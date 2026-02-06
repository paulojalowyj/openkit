#!/usr/bin/env node

/**
 * Update version script - updates version in CLI and other files
 */

import fs from 'fs';
import path from 'path';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync(path.resolve(import.meta.dirname, '../package.json'), 'utf-8'));

const version = pkg.version;

console.log(` Updating version to ${version}...`);

const cliPath = path.resolve(import.meta.dirname, '../bin/cli.js');
let cliContent = fs.readFileSync(cliPath, 'utf-8');

// Update version string
cliContent = cliContent.replace(
  /\.version\([^)]+\)/,
  `.version('${version}')`
);

fs.writeFileSync(cliPath, cliContent);
console.log(' Updated bin/cli.js version');

console.log(` Version updated to ${version}`);