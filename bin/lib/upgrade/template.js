import path from 'path';
import { sha256Hex } from './sha256.js';

async function listFilesRecursive(fs, dirAbs, relBase = '') {
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  const out = [];

  for (const ent of entries) {
    const rel = relBase ? `${relBase}/${ent.name}` : ent.name;
    const abs = path.join(dirAbs, ent.name);

    if (ent.isSymbolicLink()) {
      throw new Error(`Template contains symlink (unsupported): ${rel}`);
    }

    if (ent.isDirectory()) {
      out.push(...await listFilesRecursive(fs, abs, rel));
      continue;
    }

    if (ent.isFile()) {
      out.push({ rel, abs });
    }
  }

  return out;
}

export async function readTemplateFiles({ fs, templateDirAbs, includeRootConfig, rootConfigPathAbs }) {
  const files = new Map();

  const templateEntries = await listFilesRecursive(fs, templateDirAbs);
  for (const { rel, abs } of templateEntries) {
    const content = await fs.readFile(abs);
    const relPath = `.opencode/${rel.replace(/\\/g, '/')}`;
    files.set(relPath, {
      path: relPath,
      kind: 'template',
      content,
      templateSha256: sha256Hex(content)
    });
  }

  if (includeRootConfig) {
    const content = await fs.readFile(rootConfigPathAbs);
    const relPath = 'opencode.json';
    files.set(relPath, {
      path: relPath,
      kind: 'root-config',
      content,
      templateSha256: sha256Hex(content)
    });
  }

  return files;
}
