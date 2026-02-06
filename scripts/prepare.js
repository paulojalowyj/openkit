#!/usr/bin/env node

/**
 * Prepare Script for npm publish
 * Ensures all necessary files are included in the package
 */

import fs from 'fs';
import path from 'path';

const REQUIRED_FILES = [
  'bin/cli.js',
  '.opencode',
  'LICENSE',
  'README.md',
  'opencode.json',
  'package.json',
];

const REQUIRED_DIRS = [
  '.opencode/prompts',
  '.opencode/skills',
  '.opencode/commands',
  '.opencode/rules',
  '.opencode/scripts',
];

function checkExists(filePath) {
  // Resolve from project root
  return fs.existsSync(path.resolve(import.meta.dirname, '..', filePath));
}

console.log(' Checking package contents...\n');

let allOK = true;

REQUIRED_FILES.forEach(file => {
  const exists = checkExists(file);
  if (exists) {
    console.log(` ${file}`);
  } else {
    console.log(` MISSING: ${file}`);
    allOK = false;
  }
});

REQUIRED_DIRS.forEach(dir => {
  const exists = checkExists(dir);
  if (exists) {
    console.log(` ${dir}/`);
  } else {
    console.log(` MISSING: ${dir}/`);
    allOK = false;
  }
});

console.log('');

if (allOK) {
  console.log(' Package is ready for publish!');
  process.exit(0);
} else {
  console.log(' Package is incomplete. Fix missing files before publishing.');
  process.exit(1);
}
