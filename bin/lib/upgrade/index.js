import path from 'path';
import { sha256Hex } from './sha256.js';
import { resolveWithinRoot, assertNoSymlinkInPath } from './paths.js';
import { readTemplateFiles } from './template.js';
import { loadManifestIfExists, writeManifest, createEmptyManifest, defaultDecision, upsertManifestFile, indexManifestFiles } from './manifest.js';
import { planUpgrade } from './planner.js';
import { applyUpgradeOps } from './applier.js';

async function readProjectFileState({ fs, projectRootAbs, relPath }) {
  await assertNoSymlinkInPath(fs, projectRootAbs, relPath);
  const abs = resolveWithinRoot(projectRootAbs, relPath);
  try {
    const st = await fs.lstat(abs);
    if (st.isSymbolicLink()) throw new Error(`Refusing to read through symlink: ${relPath}`);
    if (!st.isFile()) throw new Error(`Expected file but found non-file: ${relPath}`);
    const buf = await fs.readFile(abs);
    return { exists: true, currentSha256: sha256Hex(buf) };
  } catch (e) {
    if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return { exists: false, currentSha256: null };
    throw e;
  }
}

async function projectHasRegularFileNoFollow({ fs, projectRootAbs, relPath }) {
  await assertNoSymlinkInPath(fs, projectRootAbs, relPath);
  const abs = resolveWithinRoot(projectRootAbs, relPath);
  try {
    const st = await fs.lstat(abs);
    if (st.isSymbolicLink()) return false;
    return st.isFile();
  } catch (e) {
    if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
    throw e;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function backupsDirRelFromNow() {
  const safe = nowIso().replace(/[:.]/g, '-');
  return `.opencode/.openkit-backups/openkit-upgrade-${safe}`;
}

function summarizeOps(ops) {
  const buckets = {
    add: [],
    update: [],
    overwrite: [],
    remove: [],
    skip: [],
    conflict: [],
    orphaned: []
  };

  for (const op of ops) {
    if (buckets[op.type]) buckets[op.type].push(op.path);
    else if (op.type === 'conflict') buckets.conflict.push(op.path);
  }

  return buckets;
}

export async function runUpgrade({
  fs,
  prompt,
  projectRootAbs,
  templateDirAbs,
  templateRootConfigAbs,
  openkitVersion,
  options
}) {
  const manifestRelPath = options.manifestPath || '.opencode/openkit.manifest.json';
  const existingManifest = await loadManifestIfExists({ fs, projectRootAbs, manifestRelPath });

  const rootConfigExists = await projectHasRegularFileNoFollow({ fs, projectRootAbs, relPath: 'opencode.json' });

  const manageRootConfig = Boolean(
    templateRootConfigAbs &&
    (options.force || !rootConfigExists || (existingManifest && existingManifest.managedPaths.includes('opencode.json')))
  );

  const templateFiles = await readTemplateFiles({
    fs,
    templateDirAbs,
    includeRootConfig: manageRootConfig,
    rootConfigPathAbs: templateRootConfigAbs
  });

  const projectFileStates = new Map();
  for (const relPath of templateFiles.keys()) {
    projectFileStates.set(relPath, await readProjectFileState({ fs, projectRootAbs, relPath }));
  }

  const ops = planUpgrade({
    templateFiles,
    manifest: existingManifest,
    projectFileStates,
    options: {
      ...options,
      isInteractive: Boolean(options.isInteractive)
    }
  });

  // Resolve interactive conflicts (only those still marked as 'conflict').
  if (options.isInteractive && !options.yes) {
    for (const op of ops) {
      if (op.type !== 'conflict') continue;

      const question = {
        type: 'confirm',
        name: 'overwrite',
        message: `Arquivo modificado: ${op.path}. Sobrescrever com o template?`,
        default: false
      };

      const rememberQ = {
        type: 'confirm',
        name: 'remember',
        message: 'Lembrar esta decisao para proximos upgrades?',
        default: true
      };

      const ans = await prompt([question, rememberQ]);
      op.type = ans.overwrite ? 'overwrite' : 'skip';
      op.reason = op.reason || 'conflict';
      op._remember = Boolean(ans.remember);
      op._rememberChoice = ans.overwrite ? 'overwrite' : 'skip';
    }
  }

  const buckets = summarizeOps(ops);
  const conflicts = ops
    .filter((op) => op && (op.reason === 'conflict' || op.reason === 'legacy-conflict'))
    .map((op) => op.path);

  const exitCode = options.failOnChanges && conflicts.length > 0 ? 2 : 0;

  if (options.dryRun) {
    return {
      didWrite: false,
      exitCode,
      buckets: { ...buckets, conflicts },
      backupsDir: null
    };
  }

  const applyResult = await applyUpgradeOps({
    fs,
    projectRootAbs,
    templateFiles,
    ops,
    backupsDirRel: backupsDirRelFromNow()
  });

  // Manifest update (best-effort baseline tracking).
  const installedAt = existingManifest ? existingManifest.installedAt : nowIso();
  const manifest = existingManifest || createEmptyManifest({
    openkitVersion,
    installedAtIso: installedAt,
    managedPaths: manageRootConfig ? ['.opencode', 'opencode.json'] : ['.opencode']
  });

  manifest.openkitVersion = openkitVersion;
  if (!manifest.managedPaths.includes('.opencode')) manifest.managedPaths.unshift('.opencode');
  if (manageRootConfig && !manifest.managedPaths.includes('opencode.json')) manifest.managedPaths.push('opencode.json');

  const mfIndex = indexManifestFiles(manifest);
  for (const [relPath, tf] of templateFiles.entries()) {
    const existing = mfIndex.get(relPath);
    const op = ops.find((o) => o.path === relPath);
    const applied = op && (op.type === 'add' || op.type === 'update' || op.type === 'overwrite');

    const next = existing ? { ...existing } : {
      path: relPath,
      kind: tf.kind,
      baseSha256: tf.templateSha256,
      lastAppliedOpenkitVersion: openkitVersion,
      decision: defaultDecision()
    };

    if (applied) {
      next.baseSha256 = tf.templateSha256;
      next.lastAppliedOpenkitVersion = openkitVersion;
    }

    if (op && op._remember && next.decision && next.decision.remember) {
      next.decision.onConflict = op._rememberChoice;
    }

    upsertManifestFile(manifest, next);
  }

  // Orphaned cleanup in manifest only if removed.
  if (applyResult.removed.length > 0) {
    const removedSet = new Set(applyResult.removed);
    manifest.files = manifest.files.filter((f) => !(f && removedSet.has(f.path)));
  }

  manifest.history.push({
    type: 'upgrade',
    openkitVersion,
    timestamp: nowIso()
  });

  await writeManifest({ fs, projectRootAbs, manifestRelPath, manifest });

  return {
    didWrite: true,
    exitCode,
    buckets: { ...buckets, conflicts },
    backupsDir: applyResult.backupsDir
  };
}
