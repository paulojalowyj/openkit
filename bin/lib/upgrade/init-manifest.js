import { readTemplateFiles } from './template.js';
import { createEmptyManifest, defaultDecision, upsertManifestFile, writeManifest } from './manifest.js';

function nowIso() {
  return new Date().toISOString();
}

export async function writeInitManifest({
  fs,
  projectRootAbs,
  templateDirAbs,
  templateRootConfigAbs,
  openkitVersion,
  includeRootConfig,
  manifestRelPath = '.opencode/openkit.manifest.json'
}) {
  const templateFiles = await readTemplateFiles({
    fs,
    templateDirAbs,
    includeRootConfig,
    rootConfigPathAbs: templateRootConfigAbs
  });

  const manifest = createEmptyManifest({
    openkitVersion,
    installedAtIso: nowIso(),
    managedPaths: includeRootConfig ? ['.opencode', 'opencode.json'] : ['.opencode']
  });

  for (const [relPath, tf] of templateFiles.entries()) {
    upsertManifestFile(manifest, {
      path: relPath,
      kind: tf.kind,
      baseSha256: tf.templateSha256,
      lastAppliedOpenkitVersion: openkitVersion,
      decision: defaultDecision()
    });
  }

  manifest.history.push({
    type: 'init',
    openkitVersion,
    timestamp: nowIso()
  });

  await writeManifest({ fs, projectRootAbs, manifestRelPath, manifest });
}
