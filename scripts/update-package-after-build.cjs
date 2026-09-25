#!/usr/bin/env node
// After build: update dist/package.json so when you cd dist && yalc publish, only dist contents are at root (cjs, esm, stylox, etc.).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const distPath = path.join(root, 'dist');
const distPkgPath = path.join(distPath, 'package.json');

if (!fs.existsSync(distPath) || !fs.existsSync(distPkgPath)) {
  console.warn('update-package-after-build: dist/ or dist/package.json not found, skipping');
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(distPkgPath, 'utf8'));

// When publishing from dist/, these are at root level.
// Use types/index.d.ts (tsc emit) for public type exports; bundled index.d.ts is JS-only.
const buildFiles = ['cjs', 'esm', 'stylox', 'types', 'index.d.ts', 'package.json', 'README.md'];

pkg.files = buildFiles;
pkg.main = 'cjs/index.js';
pkg.module = 'esm/index.js';
pkg.types = 'types/index.d.ts';
pkg.exports = {
  '.': {
    types: './types/index.d.ts',
    import: './esm/index.js',
    require: './cjs/index.js',
  },
};

if (pkg.typesVersions?.['*']?.index) {
  pkg.typesVersions['*'].index = ['types/index.d.ts'];
}

fs.writeFileSync(distPkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('update-package-after-build: dist/package.json updated for publish from dist/');
console.log('  files:', pkg.files.join(', '));
console.log('  Run: cd dist && yalc publish');
