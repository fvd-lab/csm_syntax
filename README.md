# CSM Language Support for VS Code

A Visual Studio Code extension that provides comprehensive language support for CSM (Constructive Solid Modeling) files.

## Features

- **Syntax Highlighting**: Full syntax highlighting for CSM keywords, functions, comments, strings, and numbers
- **Comment Toggle**: Use `Cmd+/` (Mac) or `Ctrl+/` (Windows/Linux) to toggle line comments with `#`
- **Bracket Matching**: Auto-closing and matching for parentheses, brackets, and braces
- **String Support**: Syntax highlighting for both single and double quoted strings

## Supported File Extensions

- `.csm` - CSM (Constructive Solid Modeling) files

## Development

### Quick Start for Developers

1. Clone this repository
2. Install dependencies: `npm install`
3. Make your changes
4. Test by running: `npm run dev` (packages and installs locally)
5. Reload VS Code window (`Cmd+R` or `Ctrl+R`) to see changes

### Project Structure

```
csm-language-support/
├── scripts/
│   └── generate-grammar.js        # Grammar generation script with embedded keywords
├── syntaxes/
│   └── csm.tmLanguage.json        # Generated TextMate grammar
├── language-configuration.json     # Language configuration (comments, brackets)
└── package.json                   # Extension manifest
```

### Adding New Keywords

To add new keywords, edit the `generate-grammar.js` script directly and update the `controlKeywords` or `functionKeywords` arrays. Then, run the following command to regenerate the grammar:

```bash
npm run generate-grammar
```

### Available Scripts

- `npm run dev` - Package and install locally for testing (quick development cycle)
- `npm run generate-grammar` - Generate TextMate grammar from embedded keywords
- `npm run build` - Build the extension (includes grammar generation)
- `npm run package` - Package the extension into a .vsix file
- `npm run install-local` - Install the packaged extension into VS Code
- `npm run publish` - Publish the extension (requires vsce setup)

## Example CSM Code

```csm
# CSM Example - Airfoil Generation
CFGPMTR kulfan_LowerAmount 4
CFGPMTR kulfan_UpperAmount 4

dimension class 1 2 1
dimension ztail 1 2 1
dimension aupper 1 kulfan_UpperAmount 1
dimension alower 1 kulfan_UpperAmount 1

despmtr class "0.5; 1.0"
despmtr ztail "0.0005; -0.0005"
despmtr aupper "0.1; 0.15; 0.12; 0.1"
despmtr alower "-.08; -.015; -.03; 0.0012"

udparg kulfan class class
udparg kulfan ztail ztail
udparg kulfan aupper aupper    
udprim kulfan alower alower

store airfoil
```

## Installation

### From VSIX (Recommended)

No prerequisites required - just download and install!

1. Download the latest `.vsix` file from the [releases page](https://github.com/your-username/csm-language-support/releases)
2. Open VS Code
3. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) to open the command palette
4. Type "Extensions: Install from VSIX..." and select it
5. Navigate to the downloaded `.vsix` file and select it
6. Reload VS Code when prompted (or press `Cmd+R` / `Ctrl+R`)

### From Source

**Prerequisites:** Node.js (v14 or higher) and npm

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/csm-language-support.git
   cd csm-language-support
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Package the extension:
   ```bash
   npm run package
   ```
4. Install the generated `.vsix` file using the steps above, or run:
   ```bash
   npm run install-local
   ```
5. Reload VS Code window (`Cmd+R` or `Ctrl+R`)

## Contributing

1. Fork the repository
2. Clone your fork and create a new branch
3. Make your changes
4. Update the `generate-grammar.js` script if adding new keywords
5. Test your changes using `npm run dev`
6. Submit a pull request

**Note:** Before publishing, update the repository URL in `package.json` to match your GitHub repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Release Notes

### 0.0.1

- Initial release
- Basic syntax highlighting for CSM files
- Comment toggling support with `#`
- Embedded keywords for grammar generation
- Support for 42+ control keywords and 64+ function keywords
