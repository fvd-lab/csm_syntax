#!/bin/bash

# CSM Language Support for VS Code - Installation Script
# This script installs the CSM syntax highlighting extension for VS Code

echo "Installing CSM Language Support for VS Code..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define the VS Code extensions directory
VSCODE_EXT_DIR="$HOME/.vscode/extensions/csm-language"

# Create the extension directory if it doesn't exist
echo "Creating extension directory at: $VSCODE_EXT_DIR"
mkdir -p "$VSCODE_EXT_DIR"

# Read keywords from files and generate the syntax file
echo "Generating syntax file from keyword files..."

# Read control keywords and join with |
if [ -f "$SCRIPT_DIR/keywords_control.txt" ]; then
    CONTROL_KEYWORDS=$(tr '\n' '|' < "$SCRIPT_DIR/keywords_control.txt" | sed 's/|$//')
    echo "Loaded $(wc -l < "$SCRIPT_DIR/keywords_control.txt" | tr -d ' ') control keywords"
else
    echo "Error: keywords_control.txt not found!"
    exit 1
fi

# Read function keywords and join with |
if [ -f "$SCRIPT_DIR/keywords_function.txt" ]; then
    FUNCTION_KEYWORDS=$(tr '\n' '|' < "$SCRIPT_DIR/keywords_function.txt" | sed 's/|$//')
    echo "Loaded $(wc -l < "$SCRIPT_DIR/keywords_function.txt" | tr -d ' ') function keywords"
else
    echo "Error: keywords_function.txt not found!"
    exit 1
fi

# Create syntaxes directory
mkdir -p "$VSCODE_EXT_DIR/syntaxes"

# Generate the final syntax file from template
if [ -f "$SCRIPT_DIR/csm.tmLanguage.template.json" ]; then
    sed "s/{{CONTROL_KEYWORDS}}/$CONTROL_KEYWORDS/g; s/{{FUNCTION_KEYWORDS}}/$FUNCTION_KEYWORDS/g" \
        "$SCRIPT_DIR/csm.tmLanguage.template.json" > "$VSCODE_EXT_DIR/syntaxes/csm.tmLanguage.json"
    echo "Generated syntax file with keyword substitutions"
else
    echo "Error: csm.tmLanguage.template.json not found!"
    exit 1
fi

# Copy configuration files
echo "Copying configuration files..."
cp "$SCRIPT_DIR/package.json" "$VSCODE_EXT_DIR/"
cp "$SCRIPT_DIR/language-configuration.json" "$VSCODE_EXT_DIR/"

echo ""
echo "✅ CSM Language Support installed successfully!"
echo ""
echo "Keywords installed:"
echo "- Control keywords: $CONTROL_KEYWORDS"
echo "- Function keywords: $FUNCTION_KEYWORDS"
echo ""
echo "Next steps:"
echo "1. Open VS Code"
echo "2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)"
echo "3. Type 'Developer: Reload Window' and press Enter"
echo "4. Open any .csm file to see syntax highlighting!"
echo ""
echo "To add new keywords:"
echo "- Edit keywords_control.txt or keywords_function.txt"
echo "- Run this installer again"
echo ""