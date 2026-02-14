#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function installExtension() {
  const extensionPath = path.join(__dirname, '../csm-language-support-0.0.1.vsix');
  
  if (!fs.existsSync(extensionPath)) {
    console.error('Extension package not found. Run "npm run package" first.');
    process.exit(1);
  }

  try {
    // Try using code command first
    console.log('Installing CSM Language Support extension...');
    execSync(`code --install-extension "${extensionPath}" --force`, { stdio: 'pipe' });
    console.log('✅ Extension installed successfully!');
    console.log('💡 Please reload VS Code window (Cmd+R) to activate the updated extension.');
  } catch (error) {
    // If code command fails, provide manual instructions
    console.log('⚠️  Could not install automatically. Please install manually:');
    console.log('1. Open VS Code Command Palette (Cmd+Shift+P)');
    console.log('2. Type "Extensions: Install from VSIX..."');
    console.log(`3. Select: ${extensionPath}`);
    console.log('4. Click "Install" and "Reload"');
  }
}

if (require.main === module) {
  installExtension();
}

module.exports = { installExtension };