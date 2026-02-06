/**
 * Opencode GLMs - Entry Point
 */

const path = require('path');
const pkg = require('./package.json');

module.exports = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  bin: path.resolve(__dirname, 'bin', 'cli.js'),
  template: path.dirname(__dirname),
};