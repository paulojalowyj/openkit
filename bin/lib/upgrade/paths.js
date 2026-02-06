import path from 'path';

function toPosixPath(p) {
  return String(p).replace(/\\/g, '/');
}

export function normalizeRelPath(inputPath) {
  const p = toPosixPath(inputPath);
  if (p.includes('\u0000')) throw new Error('Invalid path: contains null byte');
  if (path.posix.isAbsolute(p)) throw new Error(`Invalid path: absolute path not allowed (${inputPath})`);

  const normalized = path.posix.normalize(p);
  if (normalized === '.' || normalized === '') return '';
  if (normalized.startsWith('../') || normalized === '..') {
    throw new Error(`Invalid path: path traversal not allowed (${inputPath})`);
  }
  return normalized;
}

export function resolveWithinRoot(projectRootAbs, relPath) {
  const root = path.resolve(projectRootAbs);
  const rel = normalizeRelPath(relPath);
  const abs = path.resolve(root, rel);
  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;
  if (abs !== root && !abs.startsWith(rootWithSep)) {
    throw new Error(`Path escapes project root: ${relPath}`);
  }
  return abs;
}

export async function assertNoSymlinkInPath(fs, projectRootAbs, relPath) {
  const root = path.resolve(projectRootAbs);
  const rel = normalizeRelPath(relPath);
  if (!rel) return;

  const parts = rel.split('/');
  let cursor = root;

  for (const part of parts.slice(0, -1)) {
    cursor = path.join(cursor, part);
    let st;
    try {
      st = await fs.lstat(cursor);
    } catch {
      // Missing directories will be created later; we only guard existing ones.
      continue;
    }
    if (st.isSymbolicLink()) {
      throw new Error(`Refusing to traverse symlinked directory: ${path.relative(root, cursor)}`);
    }
    if (!st.isDirectory()) {
      throw new Error(`Expected directory but found file: ${path.relative(root, cursor)}`);
    }
  }
}
