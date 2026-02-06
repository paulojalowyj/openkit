import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import os from 'os';
import fs from 'node:fs/promises';

import { applyUpgradeOps } from '../bin/lib/upgrade/applier.js';

test('apply refuses to traverse symlinked directories', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'openkit-upg-'));
  await fs.mkdir(path.join(root, '.opencode'), { recursive: true });

  const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'openkit-outside-'));
  await fs.symlink(outside, path.join(root, '.opencode', 'rules'));

  const templateFiles = new Map([
    ['.opencode/rules/MASTER.md', { content: Buffer.from('x'), templateSha256: 't', kind: 'template' }]
  ]);

  await assert.rejects(
    () => applyUpgradeOps({
      fs,
      projectRootAbs: root,
      templateFiles,
      ops: [{ type: 'add', path: '.opencode/rules/MASTER.md' }],
      backupsDirRel: '.opencode/.openkit-backups/test'
    }),
    /symlink/i
  );
});
