import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { promises as fs } from 'node:fs';

import { planUpgrade, applyUpgrade, sha256Hex, writeManifest } from '../bin/lib/upgrade.js';

async function withTempDir(fn) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'openkit-test-'));
  try {
    return await fn(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

async function writeText(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
}

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8');
}

test('legacy mode non-interactive: add-only, skip existing', async () => {
  await withTempDir(async (root) => {
    const templateOpencodeDir = path.join(root, 'template', '.opencode');
    const projectDir = path.join(root, 'project');
    const manifestPath = path.join(projectDir, '.opencode', 'openkit.manifest.json');

    await writeText(path.join(templateOpencodeDir, 'a.txt'), 'template-a');
    await writeText(path.join(templateOpencodeDir, 'b.txt'), 'template-b');

    await writeText(path.join(projectDir, '.opencode', 'a.txt'), 'project-a-custom');

    const plan = await planUpgrade({
      templateOpencodeDir,
      projectDir,
      manifestPath,
      isTTY: false
    });

    assert.equal(plan.mode, 'legacy');
    assert.deepEqual(plan.summary.added.sort(), ['.opencode/b.txt']);
    assert.deepEqual(plan.summary.skipped.sort(), ['.opencode/a.txt']);
    assert.deepEqual(plan.summary.conflicts, []);

    await applyUpgrade(plan, { templateOpencodeDir, projectDir, manifestPath, openkitVersion: '0.1.1' });
    assert.equal(await readText(path.join(projectDir, '.opencode', 'a.txt')), 'project-a-custom');
    assert.equal(await readText(path.join(projectDir, '.opencode', 'b.txt')), 'template-b');
  });
});

test('manifest mode: update when current sha == base, conflict when != base', async () => {
  await withTempDir(async (root) => {
    const templateOpencodeDir = path.join(root, 'template', '.opencode');
    const projectDir = path.join(root, 'project');
    const manifestPath = path.join(projectDir, '.opencode', 'openkit.manifest.json');

    await writeText(path.join(templateOpencodeDir, 'x.txt'), 'template-x-v2');
    await writeText(path.join(projectDir, '.opencode', 'x.txt'), 'template-x-v1');

    await writeManifest(manifestPath, {
      schemaVersion: 1,
      files: [
        {
          path: '.opencode/x.txt',
          baseSha256: sha256Hex('template-x-v1')
        }
      ]
    });

    const plan1 = await planUpgrade({ templateOpencodeDir, projectDir, manifestPath, isTTY: false });
    assert.deepEqual(plan1.summary.updated, ['.opencode/x.txt']);
    assert.deepEqual(plan1.summary.conflicts, []);

    await applyUpgrade(plan1, { templateOpencodeDir, projectDir, manifestPath, openkitVersion: '0.1.1' });
    assert.equal(await readText(path.join(projectDir, '.opencode', 'x.txt')), 'template-x-v2');

    // Now simulate customization: base stays v2, current becomes custom.
    await writeText(path.join(projectDir, '.opencode', 'x.txt'), 'project-x-custom');
    await writeManifest(manifestPath, {
      schemaVersion: 1,
      files: [
        {
          path: '.opencode/x.txt',
          baseSha256: sha256Hex('template-x-v2')
        }
      ]
    });

    const plan2 = await planUpgrade({ templateOpencodeDir, projectDir, manifestPath, isTTY: false });
    assert.deepEqual(plan2.summary.conflicts, ['.opencode/x.txt']);
    assert.deepEqual(plan2.summary.updated, []);
  });
});

test('--dry-run: no writes (files or manifest)', async () => {
  await withTempDir(async (root) => {
    const templateOpencodeDir = path.join(root, 'template', '.opencode');
    const projectDir = path.join(root, 'project');
    const manifestPath = path.join(projectDir, '.opencode', 'openkit.manifest.json');

    await writeText(path.join(templateOpencodeDir, 'add.txt'), 'template-add');
    await writeText(path.join(templateOpencodeDir, 'upd.txt'), 'template-upd-v2');

    await writeText(path.join(projectDir, '.opencode', 'upd.txt'), 'template-upd-v1');
    await writeManifest(manifestPath, {
      schemaVersion: 1,
      files: [
        { path: '.opencode/upd.txt', baseSha256: sha256Hex('template-upd-v1') }
      ]
    });

    const plan = await planUpgrade({ templateOpencodeDir, projectDir, manifestPath, isTTY: false });
    assert.equal(plan.summary.added.length, 1);
    assert.equal(plan.summary.updated.length, 1);

    await applyUpgrade(plan, { templateOpencodeDir, projectDir, manifestPath, dryRun: true, openkitVersion: '0.1.1' });

    await assert.rejects(() => fs.readFile(path.join(projectDir, '.opencode', 'add.txt')));
    assert.equal(await readText(path.join(projectDir, '.opencode', 'upd.txt')), 'template-upd-v1');
  });
});

test('orphaned detection: manifest file missing from template is reported', async () => {
  await withTempDir(async (root) => {
    const templateOpencodeDir = path.join(root, 'template', '.opencode');
    const projectDir = path.join(root, 'project');
    const manifestPath = path.join(projectDir, '.opencode', 'openkit.manifest.json');

    await writeText(path.join(templateOpencodeDir, 'present.txt'), 'template-present');
    await writeText(path.join(projectDir, '.opencode', 'present.txt'), 'template-present');
    await writeText(path.join(projectDir, '.opencode', 'old.txt'), 'old-file');

    await writeManifest(manifestPath, {
      schemaVersion: 1,
      files: [
        { path: '.opencode/present.txt', baseSha256: sha256Hex('template-present') },
        { path: '.opencode/old.txt', baseSha256: sha256Hex('old-file') }
      ]
    });

    const plan = await planUpgrade({ templateOpencodeDir, projectDir, manifestPath, isTTY: false });
    assert.deepEqual(plan.summary.orphaned, ['.opencode/old.txt']);
  });
});

test('exit code: --fail-on-changes returns 2 when conflicts exist', async () => {
  await withTempDir(async (root) => {
    const templateOpencodeDir = path.join(root, 'template', '.opencode');
    const projectDir = path.join(root, 'project');
    const manifestPath = path.join(projectDir, '.opencode', 'openkit.manifest.json');

    await writeText(path.join(templateOpencodeDir, 'c.txt'), 'template-c');
    await writeText(path.join(projectDir, '.opencode', 'c.txt'), 'project-c-custom');

    await writeManifest(manifestPath, {
      schemaVersion: 1,
      files: [
        { path: '.opencode/c.txt', baseSha256: sha256Hex('template-c-old') }
      ]
    });

    const plan = await planUpgrade({
      templateOpencodeDir,
      projectDir,
      manifestPath,
      isTTY: false,
      failOnChanges: true
    });

    assert.equal(plan.exitCode, 2);

    const applied = await applyUpgrade(plan, {
      templateOpencodeDir,
      projectDir,
      manifestPath,
      dryRun: true,
      failOnChanges: true
    });
    assert.equal(applied.exitCode, 2);
  });
});
