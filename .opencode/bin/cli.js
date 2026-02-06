#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { dirname } from 'path';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

function checkOpenCodeInstalled() {
  try {
    execSync('which opencode || where opencode', {
      stdio: 'ignore',
      shell: true
    });
    return true;
  } catch (e) {
  }

  try {
    execSync('npm list -g @opencode-ai/plugin', {
      stdio: 'ignore',
      shell: true
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
      shell: true
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

program
  .name('openkit')
  .description('Initialize OpenCode Agent System in your project')
  .version('0.1.1');

program
  .command('init')
  .description('Initialize OpenCode configuration in current directory')
  .option('-f, --force', 'Overwrite existing .opencode directory')
  .action(async (options) => {
    console.log(chalk.blue('Initializing OpenCode Agent System...'));

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

    const projectDir = process.cwd();
    const opencodeDir = path.join(projectDir, '.opencode');
    const templateDir = path.join(__dirname, '..', '.opencode');

    if (existsSync(opencodeDir) && !options.force) {
      console.log(chalk.yellow('Warning: .opencode directory already exists'));
      console.log('Use --force to overwrite');
      process.exit(1);
    }

    if (existsSync(opencodeDir) && options.force) {
      console.log(chalk.yellow('Removing existing .opencode directory...'));
      await removeDir(opencodeDir);
    }

    mkdirSync(opencodeDir, { recursive: true });

    console.log(chalk.green('Copying OpenCode configuration...'));
    await copyDir(templateDir, opencodeDir);

    console.log(chalk.green('Successfully initialized OpenCode!'));
    console.log(chalk.cyan('\nNext steps:'));
    console.log('  1. Restart OpenCode TUI');
    console.log('  2. Use /engineer, /plan, /debug, and other commands\n');
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
        check: () => existsSync(path.join(opencodeDir, 'skills/')),
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
      console.log(chalk.yellow('Some checks failed. Run `npx @paulojalowyj/openkit init`'));
    }
  });

async function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

async function removeDir(dir) {
  await fs.remove(dir);
}

program.parse(process.argv);
