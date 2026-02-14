const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

class CSMHoverProvider {
  constructor(context) {
    this.context = context;
    this.loadDocumentation();
  }

  loadDocumentation() {
    try {
      const docPath = path.join(this.context.extensionPath, 'csm-documentation.json');
      if (fs.existsSync(docPath)) {
        const docContent = fs.readFileSync(docPath, 'utf8');
        this.documentation = JSON.parse(docContent);
      } else {
        console.warn('CSM documentation file not found');
        this.documentation = {};
      }
    } catch (error) {
      console.error('Error loading CSM documentation:', error);
      this.documentation = {};
    }
  }

  provideHover(document, position, token) {
    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      return null;
    }

    const word = document.getText(range).toUpperCase();
    const command = this.documentation[word];
    
    if (!command) {
      return null;
    }

    // Create markdown content for hover
    const markdownString = new vscode.MarkdownString();
    markdownString.isTrusted = true;
    
    // Command syntax
    markdownString.appendCodeblock(command.syntax, 'csm');
    
    // Usage description
    if (command.usage) {
      markdownString.appendMarkdown(`**Usage**: ${command.usage}\n\n`);
    }
    
    // Notes/documentation
    if (command.notes) {
      markdownString.appendMarkdown(`**Notes**:\n\n${command.notes}`);
    }

    return new vscode.Hover(markdownString, range);
  }
}

module.exports = CSMHoverProvider;