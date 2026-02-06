import path from 'path';
import { resolveWithinRoot, assertNoSymlinkInPath } from './paths.js';
import { sha256Hex } from './sha256.js';

async function existsNoFollow(fs, absPath) {
  try {
    const st = await fs.lstat(absPath);
    return { exists: true, stat: st };
  } catch (e) {
    if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return { exists: false, stat: null };
    throw e;
  }
}

async function ensureParentDir(fs, absPath) {
  await fs.mkdir(path.dirname(absPath), { recursive: true });
}

async function writeFileAtomic(fs, absPath, content) {
  const tmp = `${absPath}.tmp-${sha256Hex(String(Date.now())).slice(0, 8)}`;
  await fs.writeFile(tmp, content);
  await fs.rename(tmp, absPath);
}

async function backupFile({ fs, projectRootAbs, backupsDirAbs, relPath }) {
  const srcAbs = resolveWithinRoot(projectRootAbs, relPath);
  const dstAbs = path.join(backupsDirAbs, relPath.replace(/\\/g, '/'));
  await fs.mkdir(path.dirname(dstAbs), { recursive: true });
  await fs.copyFile(srcAbs, dstAbs);
}

export async function applyUpgradeOps({ fs, projectRootAbs, templateFiles, ops, backupsDirRel }) {
  const modified = [];
  const removed = [];
  const added = [];

  const willOverwriteOrRemove = ops.some((op) => op.type === 'update' || op.type === 'overwrite' || op.type === 'remove');
  const backupsDirAbs = willOverwriteOrRemove ? resolveWithinRoot(projectRootAbs, backupsDirRel) : null;
  if (backupsDirAbs) {
    await assertNoSymlinkInPath(fs, projectRootAbs, backupsDirRel);
    await fs.mkdir(backupsDirAbs, { recursive: true });
  }

  for (const op of ops) {
    if (op.type === 'orphaned' || op.type === 'conflict' || op.type === 'skip') continue;

    await assertNoSymlinkInPath(fs, projectRootAbs, op.path);
    const abs = resolveWithinRoot(projectRootAbs, op.path);

    const { exists, stat } = await existsNoFollow(fs, abs);
    if (exists && stat.isSymbolicLink()) throw new Error(`Refusing to operate on symlink: ${op.path}`);
    if (exists && !stat.isFile()) throw new Error(`Refusing to operate on non-file path: ${op.path}`);

    if (op.type === 'remove') {
      if (exists) {
        await backupFile({ fs, projectRootAbs, backupsDirAbs, relPath: op.path });
        await fs.unlink(abs);
        removed.push(op.path);
      }
      continue;
    }

    const tf = templateFiles.get(op.path);
    if (!tf) throw new Error(`Missing template content for: ${op.path}`);

    if (op.type === 'add') {
      await ensureParentDir(fs, abs);
      await writeFileAtomic(fs, abs, tf.content);
      added.push(op.path);
      continue;
    }

    if (op.type === 'update' || op.type === 'overwrite') {
      if (exists) await backupFile({ fs, projectRootAbs, backupsDirAbs, relPath: op.path });
      await ensureParentDir(fs, abs);
      await writeFileAtomic(fs, abs, tf.content);
      modified.push(op.path);
    }
  }

  return {
    backupsDir: backupsDirAbs ? backupsDirRel : null,
    added,
    modified,
    removed
  };
}
