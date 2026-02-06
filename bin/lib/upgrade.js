import path from 'node:path';
import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';

function toPosix(p) {
  return p.replaceAll('\\\\', '/');
}

function assertSafeRelativePath(rel) {
  const normalized = toPosix(rel);
  if (path.isAbsolute(normalized)) {
    throw new Error(`Path must be relative: ${rel}`);
  }
  const parts = normalized.split('/');
  if (parts.includes('..')) {
    throw new Error(`Path traversal is not allowed: ${rel}`);
  }
}

export function sha256Hex(content) {
  const buf = Buffer.isBuffer(content) ? content : Buffer.from(String(content));
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function listFilesRecursive(rootDir) {
  const out = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;
      const abs = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(abs);
        continue;
      }
      out.push(abs);
    }
  }

  await walk(rootDir);
  return out;
}

export async function readManifest(manifestPath) {
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) return null;
    throw err;
  }
}

export async function writeManifest(manifestPath, manifest) {
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  const json = JSON.stringify(manifest, null, 2) + '\n';
  await fs.writeFile(manifestPath, json, 'utf8');
}

function manifestBaseShaByPath(manifest) {
  const map = new Map();
  if (!manifest) return map;

  const files = manifest.files;
  if (Array.isArray(files)) {
    for (const f of files) {
      if (!f || typeof f.path !== 'string') continue;
      if (typeof f.baseSha256 === 'string' && f.baseSha256) {
        map.set(toPosix(f.path), f.baseSha256);
      }
    }
    return map;
  }

  if (files && typeof files === 'object') {
    for (const [p, meta] of Object.entries(files)) {
      if (meta && typeof meta.baseSha256 === 'string' && meta.baseSha256) {
        map.set(toPosix(p), meta.baseSha256);
      }
    }
  }

  return map;
}

function upsertManifestFileEntry(filesArr, filePath, baseSha256, openkitVersion) {
  const p = toPosix(filePath);
  let existing = filesArr.find((f) => f && f.path === p);
  if (!existing) {
    existing = { path: p, kind: p.startsWith('.opencode/') ? 'template' : 'root-config' };
    filesArr.push(existing);
  }
  existing.baseSha256 = baseSha256;
  if (openkitVersion) existing.lastAppliedOpenkitVersion = openkitVersion;
}

export async function planUpgrade({
  templateOpencodeDir,
  projectDir,
  manifestPath,
  isTTY,
  failOnChanges = false
}) {
  const manifest = await readManifest(manifestPath);
  const baseShaByPath = manifestBaseShaByPath(manifest);
  const hasManifest = Boolean(manifest);

  const templateAbsFiles = await listFilesRecursive(templateOpencodeDir);
  const operations = [];

  const templateManagedPaths = new Set();
  for (const absTemplatePath of templateAbsFiles) {
    const relInOpencode = toPosix(path.relative(templateOpencodeDir, absTemplatePath));
    assertSafeRelativePath(relInOpencode);
    const managedPath = toPosix(path.posix.join('.opencode', relInOpencode));
    templateManagedPaths.add(managedPath);

    const destAbs = path.join(projectDir, managedPath);
    const templateContent = await fs.readFile(absTemplatePath);
    const templateSha = sha256Hex(templateContent);

    try {
      const currentContent = await fs.readFile(destAbs);
      const currentSha = sha256Hex(currentContent);
      if (!hasManifest) {
        operations.push({
          type: 'skip',
          path: managedPath,
          reason: isTTY ? 'legacy-existing-interactive' : 'legacy-existing-noninteractive',
          templateSha,
          currentSha
        });
        continue;
      }

      const baseSha = baseShaByPath.get(managedPath);
      if (baseSha && currentSha === baseSha) {
        operations.push({
          type: 'update',
          path: managedPath,
          reason: 'matches-manifest-base',
          templateSha,
          currentSha,
          baseSha
        });
      } else {
        operations.push({
          type: 'conflict',
          path: managedPath,
          reason: baseSha ? 'differs-from-manifest-base' : 'missing-manifest-entry',
          templateSha,
          currentSha,
          baseSha: baseSha || null
        });
      }
    } catch (err) {
      if (!err || err.code !== 'ENOENT') throw err;
      operations.push({
        type: 'add',
        path: managedPath,
        reason: 'missing-on-disk',
        templateSha
      });
    }
  }

  const orphaned = [];
  if (hasManifest) {
    for (const p of baseShaByPath.keys()) {
      if (p.startsWith('.opencode/') && !templateManagedPaths.has(p)) {
        orphaned.push(p);
      }
    }
  }
  for (const p of orphaned.sort()) {
    operations.push({ type: 'orphaned', path: p, reason: 'missing-from-template' });
  }

  const summary = {
    added: operations.filter((o) => o.type === 'add').map((o) => o.path),
    updated: operations.filter((o) => o.type === 'update').map((o) => o.path),
    skipped: operations.filter((o) => o.type === 'skip').map((o) => o.path),
    conflicts: operations.filter((o) => o.type === 'conflict').map((o) => o.path),
    orphaned: operations.filter((o) => o.type === 'orphaned').map((o) => o.path)
  };

  const exitCode = summary.conflicts.length > 0 && failOnChanges ? 2 : 0;

  return {
    mode: hasManifest ? 'manifest' : 'legacy',
    operations,
    summary,
    exitCode
  };
}

export async function applyUpgrade(plan, {
  templateOpencodeDir,
  projectDir,
  manifestPath,
  dryRun = false,
  openkitVersion = null,
  failOnChanges = false
} = {}) {
  const conflicts = plan?.summary?.conflicts?.length ? plan.summary.conflicts : [];
  const exitCode = conflicts.length > 0 && failOnChanges ? 2 : 0;
  if (dryRun) {
    return { ...plan, exitCode, wrote: false };
  }

  const manifest = (await readManifest(manifestPath)) || {
    schemaVersion: 1,
    managedBy: '@paulojalowyj/openkit',
    openkitVersion: openkitVersion || null,
    projectRoot: '.',
    managedPaths: ['.opencode'],
    files: [],
    history: []
  };

  if (!Array.isArray(manifest.files)) {
    manifest.files = [];
  }

  for (const op of plan.operations) {
    if (op.type !== 'add' && op.type !== 'update') continue;
    const relInOpencode = op.path.replace(/^\.opencode\//, '');
    assertSafeRelativePath(relInOpencode);

    const srcAbs = path.join(templateOpencodeDir, relInOpencode);
    const destAbs = path.join(projectDir, op.path);
    await fs.mkdir(path.dirname(destAbs), { recursive: true });
    const content = await fs.readFile(srcAbs);
    await fs.writeFile(destAbs, content);
    upsertManifestFileEntry(manifest.files, op.path, sha256Hex(content), openkitVersion);
  }

  manifest.openkitVersion = openkitVersion || manifest.openkitVersion;
  manifest.history = Array.isArray(manifest.history) ? manifest.history : [];
  manifest.history.push({
    type: 'upgrade',
    openkitVersion: openkitVersion || null,
    timestamp: new Date().toISOString()
  });

  await writeManifest(manifestPath, manifest);

  return { ...plan, exitCode, wrote: true };
}
