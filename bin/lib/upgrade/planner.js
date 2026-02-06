import { indexManifestFiles, defaultDecision } from './manifest.js';

export function planUpgrade({ templateFiles, manifest, projectFileStates, options }) {
  const manifestFiles = manifest ? indexManifestFiles(manifest) : new Map();
  const templatePaths = new Set([...templateFiles.keys()]);

  const ops = [];

  for (const [relPath, tf] of templateFiles.entries()) {
    const state = projectFileStates.get(relPath) || { exists: false };
    const mf = manifestFiles.get(relPath);
    const decision = (mf && mf.decision) ? mf.decision : defaultDecision();

    if (!state.exists) {
      ops.push({
        type: 'add',
        path: relPath,
        kind: tf.kind,
        templateSha256: tf.templateSha256
      });
      continue;
    }

    if (options.force) {
      ops.push({ type: 'overwrite', path: relPath, kind: tf.kind, templateSha256: tf.templateSha256, reason: 'force' });
      continue;
    }

    if (mf && typeof mf.baseSha256 === 'string' && state.currentSha256 === mf.baseSha256) {
      ops.push({ type: 'update', path: relPath, kind: tf.kind, templateSha256: tf.templateSha256, reason: 'unchanged' });
      continue;
    }

    const conflictKind = mf ? 'conflict' : 'legacy-conflict';
    let resolution = null;

    if (options.overwriteChanged) resolution = 'overwrite';
    else if (!options.isInteractive || options.yes) resolution = 'skip';
    else if (decision && decision.remember) {
      if (decision.onConflict === 'overwrite') resolution = 'overwrite';
      if (decision.onConflict === 'skip') resolution = 'skip';
    }

    ops.push({
      type: resolution === 'overwrite' ? 'overwrite' : resolution === 'skip' ? 'skip' : 'conflict',
      path: relPath,
      kind: tf.kind,
      templateSha256: tf.templateSha256,
      reason: conflictKind
    });
  }

  const orphaned = [];
  if (manifest) {
    for (const f of manifest.files) {
      if (!f || typeof f.path !== 'string') continue;
      if (!templatePaths.has(f.path)) orphaned.push(f.path);
    }
  }

  for (const p of orphaned) {
    if (options.force || options.prune) ops.push({ type: 'remove', path: p, reason: 'orphaned' });
    else ops.push({ type: 'orphaned', path: p, reason: 'orphaned' });
  }

  return ops;
}
