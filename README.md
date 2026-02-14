# CSM Language Support for VS Code

Note:  This repository was almost entirely created using GenAI with some limited human supervision.  It is regularly used and updated by human users of Engineering Sketch Pad.

A Visual Studio Code extension that provides syntax highlighting and language support for CSM (Computer-aided Solid Modeling) files.

## Features

- **Syntax Highlighting**: Full syntax highlighting for CSM keywords, comments, strings, numbers, and variables
- **Comment Toggle**: Use `Cmd+/` (Mac) or `Ctrl+/` (Windows/Linux) to toggle line comments with `#`
- **Auto-closing Brackets**: Automatic closing of parentheses, brackets, and quotes
- **Bracket Matching**: Highlights matching brackets and parentheses
- **Case-insensitive Keywords**: Keywords are recognized regardless of case

## Supported CSM Keywords

The extension recognizes 70+ CSM commands including:

### Geometry Creation
- `point`, `box`, `sphere`, `cone`, `cylinder`, `torus`
- `import`, `restore`, `udprim`

### Geometry Operations
- `extrude`, `rule`, `blend`, `revolve`, `sweep`
- `fillet`, `chamfer`, `hollow`
- `intersect`, `subtract`, `union`, `join`, `connect`

### Transformations
- `translate`, `rotatex`, `rotatey`, `rotatez`
- `scale`, `mirror`, `applycsys`

### Control Flow
- `ifthen`, `elseif`, `else`, `endif`
- `patbeg`, `patbreak`, `patend`

### Parameters & Variables
- `cfgpmtr`, `conpmtr`, `despmtr`, `outpmtr`
- `dimension`, `set`, `evaluate`

### Sketching
- `skbeg`, `skvar`, `skcon`, `linseg`, `cirarc`, `arc`, `spline`, `sslope`, `bezier`, `skend`

### And many more...

## Installation

### Initial Setup (First Time Only)

1. Clone or download this repository
2. Run the installation script:

   **On macOS/Linux:**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

   **On Windows:**
   ```cmd
   install.bat
   ```

3. Reload VS Code (`Cmd+Shift+P` → "Developer: Reload Window")

### Updating Keywords (After Adding New Keywords)

After you modify `keywords_control.txt` or `keywords_function.txt`, use the quick update script:

   **On macOS/Linux:**
   ```bash
   ./update.sh
   ```

   **On Windows:**
   ```cmd
   update.bat
   ```

Then reload VS Code or simply close/reopen your CSM files.

## Usage

Once installed, the extension will automatically activate when you open any `.csm` file. You'll see:

- Keywords highlighted in different colors
- Comments (starting with `#`) highlighted
- Numbers and strings highlighted
- Auto-completion for brackets and quotes

### Comment Toggle

Select one or more lines and press `Cmd+/` (Mac) or `Ctrl+/` (Windows/Linux) to add or remove `#` comments.

## Adding New Keywords

Adding new CSM keywords is extremely simple with the dedicated update script:

### Quick Update Process (Recommended)

1. **Edit the keyword files:**
   - **For control keywords** (commands like `point`, `box`, `extrude`, etc.): Edit `keywords_control.txt`
   - **For function keywords** (specific functions like `kulfan`, etc.): Edit `keywords_function.txt`
   - Add one keyword per line

2. **Run the update script:**
   ```bash
   ./update.sh        # On Mac/Linux
   update.bat         # On Windows
   ```

3. **Reload VS Code** (`Cmd+Shift+P` → "Developer: Reload Window")

### Example: Adding a New Keyword

To add a new keyword `mynewcommand`:

1. Open `keywords_control.txt`
2. Add a new line with: `mynewcommand`
3. Save the file
4. Run `./update.sh` (or `update.bat` on Windows)
5. Reload VS Code

That's it! The keyword will now be highlighted.

### Alternative: Full Reinstall

You can also run the full installation script again:
```bash
./install.sh        # On Mac/Linux
install.bat         # On Windows
```

### Advanced: Manual Template Editing

If you need more control over the syntax patterns, you can edit `csm.tmLanguage.template.json` directly. The installation/update scripts will replace:
- `{{CONTROL_KEYWORDS}}` with keywords from `keywords_control.txt`
- `{{FUNCTION_KEYWORDS}}` with keywords from `keywords_function.txt`

## File Structure

```
csm_environment/
├── README.md                           # This documentation
├── LICENSE                             # MIT License
├── package.json                        # Extension manifest
├── language-configuration.json         # Language configuration (comments, brackets)
├── install.sh                          # Unix/Mac installation script (first time)
├── install.bat                         # Windows installation script (first time)
├── update.sh                           # Unix/Mac quick update script
├── update.bat                          # Windows quick update script
├── keywords_control.txt                # CSM control keywords (one per line)
├── keywords_function.txt               # CSM function keywords (one per line)
└── csm.tmLanguage.template.json       # Syntax highlighting template

Note: The syntaxes/ folder and csm.tmLanguage.json file are created automatically during installation.
```

### Key Files for Maintenance

- **`keywords_control.txt`**: Add new CSM commands here (one per line)
- **`keywords_function.txt`**: Add new CSM functions here (one per line)  
- **`update.sh` / `update.bat`**: Quick update after modifying keyword files
- **`csm.tmLanguage.template.json`**: Modify syntax patterns if needed

### Scripts

- **Install scripts** (`install.sh`/`install.bat`): Full installation - use once
- **Update scripts** (`update.sh`/`update.bat`): Quick keyword updates - use repeatedly

The scripts automatically generate the final syntax file by reading the keyword files and substituting them into the template.

## Contributing

Feel free to submit issues or pull requests to improve the extension. Common contributions:

- Adding new CSM keywords
- Improving syntax patterns
- Adding new language features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This extension is provided as-is for educational and research purposes.

## Changelog

### Version 1.0.0
- Initial release with CSM syntax highlighting
- Support for 70+ CSM keywords
- Comment toggle functionality
- Auto-closing brackets and quotes
- Case-insensitive keyword matching