import { sha256Hex } from './sha256.js';
import { resolveWithinRoot, assertNoSymlinkInPath } from './paths.js';
import path from 'path';

export function createEmptyManifest({ openkitVersion, installedAtIso, managedPaths }) {
  return {
    schemaVersion: 1,
    managedBy: '@paulojalowyj/openkit',
    openkitVersion,
    installedAt: installedAtIso,
    projectRoot: '.',
    managedPaths,
    files: [],
    history: []
  };
}

export function validateManifest(manifest) {
  if (!manifest || typeof manifest !== 'object') throw new Error('Invalid manifest: not an object');
  if (manifest.schemaVersion !== 1) throw new Error(`Unsupported manifest schemaVersion: ${manifest.schemaVersion}`);
  if (manifest.managedBy !== '@paulojalowyj/openkit') throw new Error('Invalid manifest: managedBy mismatch');
  if (!Array.isArray(manifest.files)) throw new Error('Invalid manifest: files must be an array');
  if (!Array.isArray(manifest.history)) throw new Error('Invalid manifest: history must be an array');
  if (!Array.isArray(manifest.managedPaths)) throw new Error('Invalid manifest: managedPaths must be an array');
}

export async function loadManifestIfExists({ fs, projectRootAbs, manifestRelPath }) {
  await assertNoSymlinkInPath(fs, projectRootAbs, manifestRelPath);
  const abs = resolveWithinRoot(projectRootAbs, manifestRelPath);
  try {
    const st = await fs.lstat(abs);
    if (st.isSymbolicLink()) throw new Error('Refusing to read manifest through symlink');
    if (!st.isFile()) throw new Error('Manifest path exists but is not a file');
  } catch (e) {
    if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return null;
    throw e;
  }

  const raw = await fs.readFile(abs, 'utf8');
  const parsed = JSON.parse(raw);
  validateManifest(parsed);
  return parsed;
}

export async function writeManifest({ fs, projectRootAbs, manifestRelPath, manifest }) {
  validateManifest(manifest);

  const abs = resolveWithinRoot(projectRootAbs, manifestRelPath);
  await assertNoSymlinkInPath(fs, projectRootAbs, manifestRelPath);

  try {
    const st = await fs.lstat(abs);
    if (st.isSymbolicLink()) throw new Error('Refusing to write manifest to symlink path');
  } catch (e) {
    if (!e || (e.code !== 'ENOENT' && e.code !== 'ENOTDIR')) throw e;
  }

  await fs.mkdir(path.dirname(abs), { recursive: true });

  const tmp = `${abs}.tmp-${sha256Hex(String(Date.now())).slice(0, 8)}`;
  const json = JSON.stringify(manifest, null, 2) + '\n';
  await fs.writeFile(tmp, json, 'utf8');
  await fs.rename(tmp, abs);
}

export function indexManifestFiles(manifest) {
  const byPath = new Map();
  for (const f of manifest.files || []) {
    if (f && typeof f.path === 'string') byPath.set(f.path, f);
  }
  return byPath;
}

export function upsertManifestFile(manifest, fileEntry) {
  const idx = (manifest.files || []).findIndex((f) => f && f.path === fileEntry.path);
  if (idx === -1) manifest.files.push(fileEntry);
  else manifest.files[idx] = fileEntry;
}

export function defaultDecision() {
  return {
    strategy: 'follow-template',
    onConflict: 'prompt',
    remember: true
  };
}
