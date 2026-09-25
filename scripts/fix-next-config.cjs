#!/usr/bin/env node
// Script to create mock next/config module for Storybook compatibility
const fs = require('fs');
const path = require('path');

const mockConfigPath = path.join(__dirname, '..', 'node_modules', 'next', 'config.js');
const mockDir = path.dirname(mockConfigPath);

// Create directory if it doesn't exist
if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir, { recursive: true });
}

// Create the mock file
const mockContent = `module.exports = () => ({ publicRuntimeConfig: {}, serverRuntimeConfig: {} });\n`;
fs.writeFileSync(mockConfigPath, mockContent, 'utf8');

console.log('Created next/config mock for Storybook compatibility');
