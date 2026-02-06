import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';

import { normalizeRelPath, resolveWithinRoot } from '../bin/lib/upgrade/paths.js';

test('normalizeRelPath rejects traversal and absolute paths', () => {
  assert.throws(() => normalizeRelPath('../x'), /traversal/i);
  assert.throws(() => normalizeRelPath('..'), /traversal/i);
  assert.throws(() => normalizeRelPath('/etc/passwd'), /absolute/i);
});

test('resolveWithinRoot blocks escaping root', () => {
  const root = path.resolve('/tmp/openkit-root');
  assert.throws(() => resolveWithinRoot(root, '../escape.txt'));
  assert.equal(resolveWithinRoot(root, 'a/b.txt'), path.join(root, 'a/b.txt'));
});
