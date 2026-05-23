# CSM Language Support for VS Code

Note: This repository was almost entirely created using GenAI with some limited human supervision. It is regularly used and updated by human users of Engineering Sketch Pad.

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

This repository ships with a pre-built `.vsix` file (`csm-language-support-0.0.1.vsix`) at the project root. Pick whichever method below is easiest for you.

### Option 1: Install the bundled `.vsix` via the VS Code UI (easiest)

No prerequisites required.

1. Open VS Code.
2. Open the Extensions view (`Cmd+Shift+X` on Mac, `Ctrl+Shift+X` on Windows/Linux).
3. Click the `…` menu in the top-right of the Extensions view and choose **Install from VSIX…**.
4. Navigate to this folder and select `csm-language-support-0.0.1.vsix`.
5. When prompted, reload VS Code (or press `Cmd+R` / `Ctrl+R`).
6. Open any `.csm` file to verify syntax highlighting works.

### Option 2: Install the bundled `.vsix` from the command line

You need the `code` command available on your `PATH`. On macOS, if `code` is not found, you can either:

- In VS Code, run **Shell Command: Install 'code' command in PATH** from the command palette (`Cmd+Shift+P`), **or**
- Call the CLI directly:
  ```bash
  "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" --install-extension /path/to/csm-language-support-0.0.1.vsix
  ```

With `code` on your `PATH`:

```bash
cd /path/to/csm_syntax
code --install-extension csm-language-support-0.0.1.vsix
```

Then reload VS Code.

### Option 3: Build and install from source

Use this if you've modified the grammar, keywords, or documentation and want to install your changes.

**Prerequisites:** Node.js (v14 or higher) and npm.

1. Open a terminal in this folder:
   ```bash
   cd /path/to/csm_syntax
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build, package, and install in one step:
   ```bash
   npm run dev
   ```
   This regenerates the grammar/docs, produces a fresh `.vsix`, and installs it into VS Code.

   Or run the steps individually:
   ```bash
   npm run package         # produces csm-language-support-<version>.vsix
   npm run install-local   # installs the produced .vsix into VS Code
   ```
4. Reload the VS Code window (`Cmd+R` or `Ctrl+R`).

### Verifying the installation

1. Open the Extensions view and search for **CSM Language Support** — it should appear as installed.
2. Open any `.csm` file; keywords, comments (`#`), and strings should be color-highlighted.
3. Press `Cmd+/` (Mac) or `Ctrl+/` (Windows/Linux) on a line to toggle a `#` comment.

### Uninstalling

In the Extensions view, find **CSM Language Support**, click the gear icon, and choose **Uninstall**. Or from the command line:

```bash
code --uninstall-extension csm-language-team.csm-language-support
```

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
