#!/usr/bin/env node

import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

// ANSI color codes (sem dependências externas)
const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  white: '\x1b[37m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Detectar se está sendo instalado como dependência via npm env vars
// INIT_CWD = diretório onde o usuário executou npm install
const initCwd = process.env.INIT_CWD;

// Se não temos INIT_CWD, provavelmente é desenvolvimento ou npx
if (!initCwd) {
  process.exit(0);
}

// Caminho do package.json do projeto pai (onde npm install foi executado)
const parentPackageJson = join(initCwd, 'package.json');

// Ler o package.json do projeto pai
if (!existsSync(parentPackageJson)) {
  process.exit(0);
}

try {
  const pkg = JSON.parse(readFileSync(parentPackageJson, 'utf8'));
  const hasOpenKit =
    pkg.dependencies?.['@paulojalowyj/openkit'] ||
    pkg.devDependencies?.['@paulojalowyj/openkit'];

  if (hasOpenKit) {
    console.error('');
    console.error(`${colors.yellow}OpenKit detected as a project dependency${colors.reset}`);
    console.error('');
    console.error(`${colors.white}OpenKit does not need to be in your project's package.json.${colors.reset}`);
    console.error(`${colors.white}The recommended way is to use npx directly:${colors.reset}`);
    console.error('');
    console.error(`${colors.cyan}  # Install OpenKit in your project${colors.reset}`);
    console.error(`${colors.cyan}  npx @paulojalowyj/openkit init${colors.reset}`);
    console.error('');
    console.error(`${colors.cyan}  # Upgrade OpenKit${colors.reset}`);
    console.error(`${colors.cyan}  npx @paulojalowyj/openkit upgrade${colors.reset}`);
    console.error('');
    console.error(`${colors.cyan}  # Start OpenCode in your project${colors.reset}`);
    console.error(`${colors.cyan}  opencode${colors.reset}`);
    console.error('');
    console.error(`${colors.gray}To remove the dependency: npm uninstall @paulojalowyj/openkit${colors.reset}`);
    console.error('');
  }
} catch (error) {
  // Erro ao ler package.json, sair silenciosamente
  process.exit(0);
}
