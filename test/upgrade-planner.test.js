import test from 'node:test';
import assert from 'node:assert/strict';

import { planUpgrade } from '../bin/lib/upgrade/planner.js';

function baseManifest(files) {
  return {
    schemaVersion: 1,
    managedBy: '@paulojalowyj/openkit',
    openkitVersion: '0.1.0',
    installedAt: '2026-02-06T00:00:00.000Z',
    projectRoot: '.',
    managedPaths: ['.opencode'],
    files,
    history: []
  };
}

test('plans update for unchanged managed file', () => {
  const templateFiles = new Map([
    ['.opencode/rules/MASTER.md', { kind: 'template', templateSha256: 't1' }]
  ]);
  const manifest = baseManifest([
    {
      path: '.opencode/rules/MASTER.md',
      kind: 'template',
      baseSha256: 'c1',
      lastAppliedOpenkitVersion: '0.1.0',
      decision: { strategy: 'follow-template', onConflict: 'prompt', remember: true }
    }
  ]);
  const projectFileStates = new Map([
    ['.opencode/rules/MASTER.md', { exists: true, currentSha256: 'c1' }]
  ]);

  const ops = planUpgrade({
    templateFiles,
    manifest,
    projectFileStates,
    options: { isInteractive: false, yes: false, force: false, overwriteChanged: false, prune: false }
  });

  assert.deepEqual(ops, [
    {
      type: 'update',
      path: '.opencode/rules/MASTER.md',
      kind: 'template',
      templateSha256: 't1',
      reason: 'unchanged'
    }
  ]);
});

test('non-interactive defaults to skip conflicts', () => {
  const templateFiles = new Map([
    ['.opencode/rules/MASTER.md', { kind: 'template', templateSha256: 't1' }]
  ]);
  const manifest = baseManifest([
    {
      path: '.opencode/rules/MASTER.md',
      kind: 'template',
      baseSha256: 'base',
      lastAppliedOpenkitVersion: '0.1.0',
      decision: { strategy: 'follow-template', onConflict: 'prompt', remember: true }
    }
  ]);
  const projectFileStates = new Map([
    ['.opencode/rules/MASTER.md', { exists: true, currentSha256: 'changed' }]
  ]);

  const ops = planUpgrade({
    templateFiles,
    manifest,
    projectFileStates,
    options: { isInteractive: false, yes: false, force: false, overwriteChanged: false, prune: false }
  });

  assert.equal(ops[0].type, 'skip');
  assert.equal(ops[0].reason, 'conflict');
});

test('--overwrite-changed overwrites conflicts', () => {
  const templateFiles = new Map([
    ['.opencode/rules/MASTER.md', { kind: 'template', templateSha256: 't1' }]
  ]);
  const manifest = baseManifest([
    {
      path: '.opencode/rules/MASTER.md',
      kind: 'template',
      baseSha256: 'base',
      lastAppliedOpenkitVersion: '0.1.0',
      decision: { strategy: 'follow-template', onConflict: 'prompt', remember: true }
    }
  ]);
  const projectFileStates = new Map([
    ['.opencode/rules/MASTER.md', { exists: true, currentSha256: 'changed' }]
  ]);

  const ops = planUpgrade({
    templateFiles,
    manifest,
    projectFileStates,
    options: { isInteractive: false, yes: false, force: false, overwriteChanged: true, prune: false }
  });

  assert.equal(ops[0].type, 'overwrite');
  assert.equal(ops[0].reason, 'conflict');
});

test('orphaned files are reported or pruned', () => {
  const templateFiles = new Map([
    ['.opencode/rules/MASTER.md', { kind: 'template', templateSha256: 't1' }]
  ]);
  const manifest = baseManifest([
    { path: '.opencode/rules/MASTER.md', kind: 'template', baseSha256: 'x', lastAppliedOpenkitVersion: '0.1.0', decision: { strategy: 'follow-template', onConflict: 'prompt', remember: true } },
    { path: '.opencode/old.txt', kind: 'template', baseSha256: 'y', lastAppliedOpenkitVersion: '0.1.0', decision: { strategy: 'follow-template', onConflict: 'prompt', remember: true } }
  ]);
  const projectFileStates = new Map([
    ['.opencode/rules/MASTER.md', { exists: false, currentSha256: null }]
  ]);

  const keepOps = planUpgrade({
    templateFiles,
    manifest,
    projectFileStates,
    options: { isInteractive: false, yes: false, force: false, overwriteChanged: false, prune: false }
  });
  assert.ok(keepOps.some((o) => o.type === 'orphaned' && o.path === '.opencode/old.txt'));

  const pruneOps = planUpgrade({
    templateFiles,
    manifest,
    projectFileStates,
    options: { isInteractive: false, yes: false, force: false, overwriteChanged: false, prune: true }
  });
  assert.ok(pruneOps.some((o) => o.type === 'remove' && o.path === '.opencode/old.txt'));
});
