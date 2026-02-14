#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseOpenCSMHeader() {
  const headerPath = path.join(__dirname, '../OpenCSM.h');
  const content = fs.readFileSync(headerPath, 'utf8');
  
  const commands = {};
  const lines = content.split('\n');
  
  let currentCommand = null;
  let collectingDoc = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for command definitions - commands start at beginning of line, all caps  
    const commandMatch = line.match(/^([A-Z][A-Z0-9]*)\s+(.*)$/);
    if (commandMatch) {
      const commandName = commandMatch[1];
      const params = commandMatch[2].trim();
      
      // Skip if this looks like a #define or other non-command
      if (commandName.startsWith('MAX_') || commandName.startsWith('OCSM_') || 
          line.includes('#define') || line.includes('/*') || line.includes('*/')) {
        continue;
      }
      
      // Save previous command
      if (currentCommand) {
        commands[currentCommand.name] = currentCommand;
      }
      
      // Start new command
      currentCommand = {
        name: commandName,
        syntax: `${commandName} ${params}`,
        description: '',
        usage: '',
        parameters: params,
        notes: ''
      };
      
      collectingDoc = true;
      continue;
    }
    
    // Collect documentation for current command
    if (collectingDoc && currentCommand) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('use:')) {
        currentCommand.usage = trimmed.replace('use:', '').trim();
      } else if (trimmed.startsWith('notes:')) {
        // Start collecting notes
        let noteLines = [];
        let j = i + 1;
        
        // Collect all note lines until we hit another command or empty section
        while (j < lines.length) {
          const noteLine = lines[j].trim();
          if (noteLine.match(/^[A-Z][A-Z0-9]*\s+/) || noteLine === '') {
            break;
          }
          if (noteLine) {
            noteLines.push(noteLine);
          }
          j++;
        }
        
        currentCommand.notes = noteLines.join('\\n');
        collectingDoc = false;
      }
    }
  }
  
  // Save last command
  if (currentCommand) {
    commands[currentCommand.name] = currentCommand;
  }
  
  console.log(`Found commands: ${Object.keys(commands).join(', ')}`);
  return commands;
}

function main() {
  const headerPath = path.join(__dirname, '../OpenCSM.h');
  const docPath = path.join(__dirname, '../csm-documentation.json');
  
  // Check if OpenCSM.h exists
  if (!fs.existsSync(headerPath)) {
    if (fs.existsSync(docPath)) {
      console.log('OpenCSM.h not found, using existing csm-documentation.json');
      return;
    } else {
      console.warn('Warning: OpenCSM.h not found and no existing documentation available');
      console.warn('Documentation generation skipped');
      return;
    }
  }
  
  console.log('Extracting CSM documentation from OpenCSM.h...');
  
  const commands = parseOpenCSMHeader();
  
  // Save command documentation for hover provider
  fs.writeFileSync(docPath, JSON.stringify(commands, null, 2));
  console.log(`Saved ${Object.keys(commands).length} command documentations to ${docPath}`);
}

if (require.main === module) {
  main();
}

module.exports = { parseOpenCSMHeader };