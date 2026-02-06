#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { dirname } from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import { glob } from 'glob';
import { writeInitManifest } from './lib/upgrade/init-manifest.js';
import { runUpgrade } from './lib/upgrade/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

function getOpenkitVersion() {
  try {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    if (pkg && typeof pkg.version === 'string') return pkg.version;
  } catch {
  }
  return program.version();
}

function checkOpenCodeInstalled() {
  try {
    execSync('which opencode || where opencode', {
      stdio: 'ignore',
      shell: true,
      timeout: 5000
    });
    return true;
  } catch (e) {
  }

  try {
    execSync('npm list -g @opencode-ai/plugin', {
      stdio: 'ignore',
      shell: true,
      timeout: 5000
    });
    return true;
  } catch (e) {
  }

  return false;
}

async function installOpenCode() {
  console.log(chalk.yellow('\nInstalando OpenCode...'));

  try {
    execSync('curl -fsSL https://opencode.ai/install | bash', {
      stdio: 'inherit',
      shell: true,
      timeout: 120000
    });

    if (!checkOpenCodeInstalled()) {
      throw new Error('Installação concluída mas OpenCode não detectado');
    }

    console.log(chalk.green('OpenCode instalado com sucesso!\n'));
  } catch (error) {
    console.log(`\n${chalk.red('Falha na instalação do OpenCode.')}`);
    console.log(chalk.white(`Error: ${error.message}\n`));
    console.log(chalk.yellow('Instale manualmente:'));
    console.log(chalk.white('   curl -fsSL https://opencode.ai/install | bash\n'));
    throw error;
  }
}

async function promptInstallOpenCode() {
  if (!process.stdin.isTTY) {
    console.log(chalk.red('\n OpenCode not installed and cannot install in non-interactive mode'));
    console.log('Please install manually: curl -fsSL https://opencode.ai/install | bash\n');
    return false;
  }
  
  const { install } = await inquirer.prompt([{
    type: 'confirm',
    name: 'install',
    message: 'OpenCode não está instalado. Deseja instalar agora?',
    default: true
  }]);
  return install;
}

function showOpenCodeNotInstalledError() {
  console.log(chalk.red('\nOpenCode não está instalado no seu sistema.\n'));
  console.log(chalk.cyan('Para usar este pacote, você precisa ter o OpenCode instalado.\n'));
  console.log(chalk.yellow('Instalação manual:'));
  console.log(chalk.white('  curl -fsSL https://opencode.ai/install | bash\n'));
}

// Lista embutida de arquivos a ignorar (não usamos .opencodeignore externo)
const IGNORED_PATTERNS = [
  'node_modules/',
  'dist/',
  'build/',
  'bin/',
  'bun.lock',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'package.json',
  '.git/',
  '.gitignore',
  '.DS_Store',
  'Thumbs.db',
  '*.swp',
  '*.swo',
  '*.lock',
  '.dependencies/',
  '.turbo/',
  '.parcel-cache/'
];

function shouldIgnore(path) {
  for (const pattern of IGNORED_PATTERNS) {
    if (!pattern || pattern.startsWith('#')) continue;
    
    const normalizedPath = path.replace(/\\/g, '/');
    const normalizedPattern = pattern.replace(/\\/g, '/');
    
    if (normalizedPath === normalizedPattern) return true;
    if (normalizedPattern.endsWith('/')) {
      if (normalizedPath === normalizedPattern.slice(0, -1)) return true;
    }
    if (normalizedPath.startsWith(normalizedPattern + '/')) return true;
    
    const wildcardIndex = normalizedPattern.indexOf('*');
    if (wildcardIndex !== -1) {
      const prefix = normalizedPattern.substring(0, wildcardIndex);
      const suffix = normalizedPattern.substring(wildcardIndex + 1);
      if (normalizedPath.startsWith(prefix) && (!suffix || normalizedPath.endsWith(suffix))) {
        return true;
      }
    }
  }
  return false;
}

async function copyDir(src, dest, root = src) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    const relativePath = path.relative(root, srcPath).replace(/\\/g, '/');

    if (shouldIgnore(relativePath)) {
      continue;
    }

    if (entry.isSymbolicLink()) {
      throw new Error(`Refusing to copy symlink: ${relativePath}`);
    }

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, root);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

async function promptProjectMetadata(cliProjectName, cliProjectIdentifier, cliAuthor, cliVersion) {
  const isInteractive = process.stdin.isTTY;
  
  if (!isInteractive) {
    console.log(chalk.yellow('\n  Non-interactive mode detected'));
  }

  // Priority 1: CLI flags
  let projectName = cliProjectName || '';
  let projectIdentifier = cliProjectIdentifier || '';
  let author = cliAuthor || '';
  let version = cliVersion || '';

  // Priority 2: Environment variables
  if (!projectName) projectName = process.env.OPENKIT_PROJECT_NAME || '';
  if (!projectIdentifier) projectIdentifier = process.env.OPENKIT_PROJECT_IDENTIFIER || '';
  if (!author) author = process.env.OPENKIT_AUTHOR || '';
  if (!version) version = process.env.OPENKIT_VERSION || '';

  // Utility functions
  function toKebabCase(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function validateKebabCase(str) {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
  }

  // Priority 3: Defaults (if still empty)
  const defaultProjectName = path.basename(process.cwd());
  const defaultProjectIdentifier = toKebabCase(defaultProjectName);
  const defaultAuthor = (() => {
    try {
      const os = require('os');
      return os.userInfo().username || 'your name';
    } catch {
      return 'your name';
    }
  })();
  const defaultVersion = '1.0.0';

  // Priority 4: Interactive prompts (if TTY and still empty)
  if (isInteractive && (!projectName || !projectIdentifier || !author || !version)) {
    console.log('');

    const { projectName: inputName, projectIdentifier: inputIdentifier, author: inputAuthor, version: inputVersion } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Nome do projeto:',
        default: projectName || defaultProjectName,
        when: () => !projectName,
        validate: input => input.trim().length > 0 || 'Nome não pode ser vazio'
      },
      {
        type: 'input',
        name: 'projectIdentifier',
        message: 'Project identifier (kebab-case):',
        default: projectIdentifier || defaultProjectIdentifier,
        when: () => !projectIdentifier,
        validate: input => validateKebabCase(input) || 'Project identifier must be kebab-case (lowercase letters, numbers, and dashes only)'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Autor do projeto:',
        default: author || defaultAuthor,
        when: () => !author
      },
      {
        type: 'input',
        name: 'version',
        message: 'Versão inicial:',
        default: version || defaultVersion,
        when: () => !version
      }
    ]);

    projectName = projectName || inputName;
    projectIdentifier = projectIdentifier || inputIdentifier;
    author = author || inputAuthor;
    version = version || inputVersion;
  }

  // Auto-generate projectIdentifier from projectName if still empty
  if (!projectIdentifier && projectName) {
    projectIdentifier = toKebabCase(projectName);
  }

  // Apply defaults if still empty
  if (!projectName) projectName = defaultProjectName;
  if (!projectIdentifier) projectIdentifier = defaultProjectIdentifier;
  if (!author) author = defaultAuthor;
  if (!version) version = defaultVersion;

  return { projectName, projectIdentifier, author, version };
}

async function createEnvFile(targetDir, replacements) {
  const envExamplePath = path.join(targetDir, '.env.example');
  const envPath = path.join(targetDir, '.env');

  if (!existsSync(envExamplePath)) {
    return; // No .env.example in blueprint, skip
  }

  if (existsSync(envPath)) {
    console.log(chalk.yellow('Warning: .env already exists, keeping existing file'));
    console.log(chalk.gray('   To regenerate: remove .env and run init again'));
    return;
  }

  console.log(chalk.yellow('Creating .env from .env.example...'));
  await fs.copy(envExamplePath, envPath);

  // Now replace placeholders in the created .env
  console.log(chalk.yellow('Updating .env with your values...'));
  let content = await fs.readFile(envPath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(key, value);
  }
  await fs.writeFile(envPath, content);
  console.log(chalk.yellow('.env created with real values'));
}

async function replacePlaceholders(dir, replacements) {
  const TEXT_EXTENSIONS = ['.py', '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.yml', '.yaml', '.html', '.toml', '.env', '.env.example'];
  const entries = await glob('**/*', { cwd: dir, nodir: true });

  let processedCount = 0;
  const total = entries.length;

  for (const entry of entries) {
    const ext = path.extname(entry);
    if (!TEXT_EXTENSIONS.includes(ext)) continue;

    const filePath = path.join(dir, entry);
    let content = await fs.readFile(filePath, 'utf8');

    for (const [key, value] of Object.entries(replacements)) {
      content = content.replaceAll(key, value);
    }

    await fs.writeFile(filePath, content);
    processedCount++;

    if (processedCount % 10 === 0 || processedCount === total) {
      console.log(chalk.gray(`  Processed ${processedCount}/${total} files...`));
    }
  }

  if (processedCount > 0) {
    console.log(chalk.gray(`   Processed ${processedCount} files`));
  }
}

async function copyBlueprint(blueprintName, targetDir, replacements) {
  const blueprintsRoot = path.join(__dirname, '..', 'blueprints');
  const availableBlueprints = (() => {
    try {
      return readdirSync(blueprintsRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name);
    } catch {
      return [];
    }
  })();

  if (!blueprintName || typeof blueprintName !== 'string') {
    throw new Error('Blueprint name is required');
  }

  if (blueprintName.includes('..') || blueprintName.includes('/') || blueprintName.includes('\\')) {
    throw new Error('Invalid blueprint name');
  }

  if (!availableBlueprints.includes(blueprintName)) {
    const hint = availableBlueprints.length > 0 ? ` Available: ${availableBlueprints.join(', ')}` : '';
    throw new Error(`Blueprint "${blueprintName}" não encontrado.${hint}`);
  }

  const blueprintDir = path.join(blueprintsRoot, blueprintName);

  if (!existsSync(blueprintDir)) {
    throw new Error(`Blueprint "${blueprintName}" não encontrado`);
  }

  console.log(chalk.blue(` Copying ${blueprintName} blueprint...`));
  await copyDir(blueprintDir, targetDir);

  console.log(chalk.yellow('  Replacing placeholders...'));
  await replacePlaceholders(targetDir, replacements);

  console.log(chalk.green(` ${blueprintName} blueprint installed`));
}

program
  .name('openkit')
  .description('OpenKit - OpenCode Agent System in your project')
  .version('0.1.1');

program
  .command('init')
  .description('Initialize OpenCode configuration in current directory')
  .option('-f, --force', 'Overwrite existing directories')
  .option('--blueprint <name>', 'Blueprint to initialize (fullstack, etc.)')
  .option('--project-name <name>', 'Project name (overrides prompt)')
  .option('--project-identifier <identifier>', 'Project identifier for package names and system resources (kebab-case, overrides prompt)')
  .option('--author <name>', 'Author name (overrides prompt)')
  .option('--project-version <version>', 'Project version (overrides prompt)')
  .action(async (options) => {
    console.log(chalk.blue(' Initializing OpenCode Agent System...'));

    const isInstalled = checkOpenCodeInstalled();

    if (!isInstalled) {
      const shouldInstall = await promptInstallOpenCode();

      if (shouldInstall) {
        try {
          await installOpenCode();
        } catch (error) {
          console.log(chalk.red('\nInitialization aborted due to installation failure.\n'));
          process.exit(1);
        }
      } else {
        showOpenCodeNotInstalledError();
        process.exit(1);
      }
    }

    let metadata = {};
    if (options.blueprint) {
      metadata = await promptProjectMetadata(options.projectName, options.projectIdentifier, options.author, options.projectVersion);

      const { projectName, projectIdentifier, author, version } = metadata;
      console.log('');
      console.log(chalk.blue(' Blueprint selected:'), chalk.white(options.blueprint));
      console.log(chalk.white(`  - Name: ${projectName}`));
      console.log(chalk.white(`  - Identifier: ${projectIdentifier}`));
      console.log(chalk.white(`  - Author: ${author}`));
      console.log(chalk.white(`  - Version: ${version}`));
      console.log('');
    }

    const projectDir = process.cwd();
    const opencodeDir = path.join(projectDir, '.opencode');
    const templateDir = path.join(__dirname, '..', '.opencode');

    if (existsSync(opencodeDir) && !options.force) {
      console.log(chalk.yellow('Warning: .opencode directory already exists'));
      console.log('Use --force to overwrite');
      process.exit(1);
    }

    if (existsSync(opencodeDir) && options.force) {
      console.log(chalk.yellow(' Removing existing .opencode directory...'));
      await removeDir(opencodeDir);
    }

    mkdirSync(opencodeDir, { recursive: true });

    console.log(chalk.green(' Copying OpenCode configuration...'));
    await copyDir(templateDir, opencodeDir);

    const templateConfigPath = path.join(__dirname, '..', 'opencode.json');
    const targetConfigPath = path.join(projectDir, 'opencode.json');

    const willWriteRootConfig = existsSync(templateConfigPath) && (!existsSync(targetConfigPath) || options.force);

    if (existsSync(templateConfigPath)) {
      if (existsSync(targetConfigPath) && !options.force) {
        console.log(chalk.yellow('Warning: opencode.json already exists, skipping'));
      } else {
        copyFileSync(templateConfigPath, targetConfigPath);
        console.log(chalk.green(' Added opencode.json to project root'));
      }
    }

    // Write install manifest for safe upgrades (no extra console noise).
    try {
      await writeInitManifest({
        fs,
        projectRootAbs: projectDir,
        templateDirAbs: templateDir,
        templateRootConfigAbs: templateConfigPath,
        openkitVersion: getOpenkitVersion(),
        includeRootConfig: willWriteRootConfig
      });
    } catch (e) {
      console.log(chalk.yellow(`Warning: failed to write manifest (${e.message})`));
    }

    if (options.blueprint) {
      const replacements = {
        '{{PROJECT_NAME}}': metadata.projectName,
        '{{PROJECT_IDENTIFIER}}': metadata.projectIdentifier,
        '{{VERSION}}': metadata.version,
        '{{AUTHOR}}': metadata.author
      };

      await copyBlueprint(options.blueprint, projectDir, replacements);
      await createEnvFile(projectDir, replacements);
    }

    console.log('');
    console.log(chalk.green(' Successfully initialized OpenCode!'));
    console.log(chalk.cyan('\n Next steps:'));
    console.log('  1. Restart OpenCode TUI');
    console.log('  2. Use /engineer, /plan, /debug, and other commands');

    if (options.blueprint) {
      console.log('');
      console.log(chalk.cyan('Development:'));
      console.log('  1. Start services: docker compose -f docker-compose.dev.yml up -d');
      console.log('  2. Access backend: http://localhost:8000');
      console.log('  3. Access frontend: http://localhost:5173');
    }
    console.log('');
  });

program
  .command('upgrade')
  .description('Upgrade OpenCode configuration in current directory')
  .option('--dry-run', 'Plan changes without writing')
  .option('--yes', 'Assume defaults (TTY only); conflicts default to skip')
  .option('--force', 'Overwrite all managed files (with backup)')
  .option('--overwrite-changed', 'Overwrite customized files (with backup)')
  .option('--fail-on-changes', 'Exit with code 2 if conflicts/customizations detected')
  .option('--prune', 'Remove files no longer present in template (with backup)')
  .option('--manifest-path <path>', 'Override manifest path (relative to project root)')
  .action(async (options) => {
    const projectDir = process.cwd();
    const opencodeDir = path.join(projectDir, '.opencode');

    try {
      const st = await fs.lstat(opencodeDir);
      if (st.isSymbolicLink()) throw new Error('.opencode is a symlink');
      if (!st.isDirectory()) throw new Error('.opencode is not a directory');
    } catch (e) {
      if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) {
        console.log('Missing .opencode directory. Run `openkit init` first.');
        process.exit(1);
      }
      console.log(`Upgrade failed: ${e.message}`);
      process.exit(1);
    }

    const isInteractive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
    const templateDir = path.join(__dirname, '..', '.opencode');
    const templateRootConfig = path.join(__dirname, '..', 'opencode.json');
    const hasTemplateRootConfig = existsSync(templateRootConfig);

    try {
      const result = await runUpgrade({
        fs,
        prompt: inquirer.prompt,
        projectRootAbs: projectDir,
        templateDirAbs: templateDir,
        templateRootConfigAbs: hasTemplateRootConfig ? templateRootConfig : null,
        openkitVersion: getOpenkitVersion(),
        options: {
          dryRun: Boolean(options.dryRun),
          yes: Boolean(options.yes),
          force: Boolean(options.force),
          overwriteChanged: Boolean(options.overwriteChanged),
          failOnChanges: Boolean(options.failOnChanges),
          prune: Boolean(options.prune) || Boolean(options.force),
          manifestPath: options.manifestPath,
          isInteractive
        }
      });

      const { buckets, backupsDir } = result;
      const counts = {
        added: buckets.add.length,
        updated: buckets.update.length,
        overwritten: buckets.overwrite.length,
        removed: buckets.remove.length,
        skipped: buckets.skip.length,
        conflicts: buckets.conflicts.length,
        orphaned: buckets.orphaned.length
      };

      const lines = [];
      lines.push(`added: ${counts.added}`);
      lines.push(`updated: ${counts.updated}`);
      lines.push(`overwritten: ${counts.overwritten}`);
      lines.push(`removed: ${counts.removed}`);
      lines.push(`skipped: ${counts.skipped}`);
      lines.push(`conflicts: ${counts.conflicts}`);
      lines.push(`orphaned: ${counts.orphaned}`);
      if (backupsDir) lines.push(`backups: ${backupsDir}`);
      console.log(lines.join('\n'));

      const shouldListAll = Boolean(options.dryRun);
      const listBuckets = shouldListAll
        ? ['add', 'update', 'overwrite', 'remove', 'skip', 'conflicts', 'orphaned']
        : ['skip', 'conflicts', 'orphaned', 'remove'];

      for (const key of listBuckets) {
        const arr = buckets[key];
        if (!arr || arr.length === 0) continue;
        console.log(`\n${key}:`);
        for (const p of arr.sort()) console.log(`  ${p}`);
      }

      process.exit(result.exitCode);
    } catch (e) {
      console.log(`Upgrade failed: ${e.message}`);
      process.exit(1);
    }
  });

program
  .command('doctor')
  .description('Check OpenCode installation')
  .action(async () => {
    console.log(chalk.blue('Checking OpenCode installation...\n'));

    const projectDir = process.cwd();
    const opencodeDir = path.join(projectDir, '.opencode');

    const checks = [
      {
        name: '.opencode directory',
        check: () => existsSync(opencodeDir),
        file: true,
      },
      {
        name: 'Commands',
        check: () => existsSync(path.join(opencodeDir, 'commands/debug.md')),
        file: true,
      },
      {
        name: 'Prompts',
        check: () => existsSync(path.join(opencodeDir, 'prompts/backend-specialist.md')),
        file: true,
      },
      {
        name: 'Skills',
        check: () => existsSync(path.join(opencodeDir, 'skills/')) && existsSync(path.join(opencodeDir, 'skills/clean-code/')),
        dir: true,
      },
      {
        name: 'Config',
        check: () => existsSync(path.join(projectDir, 'opencode.json')),
        file: true,
      },
    ];

    let allPassed = true;

    for (const check of checks) {
      const result = check.check();
      if (result) {
        console.log(chalk.green(`OK   ${check.name}`));
      } else {
        console.log(chalk.red(`FAIL ${check.name}`));
        allPassed = false;
      }
    }

    console.log('');
    if (allPassed) {
      console.log(chalk.green('All checks passed.'));
    } else {
      console.log(chalk.yellow('Some checks failed. Run `npx openkit init`'));
    }
});

async function removeDir(dir) {
  await fs.remove(dir);
}

program.parse(process.argv);
