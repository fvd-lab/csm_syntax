const vscode = require('vscode');
const CSMHoverProvider = require('./hoverProvider');

function activate(context) {
  console.log('CSM Language Support extension is now active!');
  
  // Register hover provider for CSM files
  const hoverProvider = new CSMHoverProvider(context);
  const hoverDisposable = vscode.languages.registerHoverProvider(
    { scheme: 'file', language: 'csm' },
    hoverProvider
  );
  
  context.subscriptions.push(hoverDisposable);
  
  // Register other providers here if needed
  console.log('CSM hover provider registered');
}

function deactivate() {
  console.log('CSM Language Support extension is now inactive');
}

module.exports = {
  activate,
  deactivate
};