#!/bin/bash

# CSM Language Support - Update Script
# Quick update for when you modify keywords_control.txt or keywords_function.txt

echo "Updating CSM Language Support..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define the VS Code extensions directory
VSCODE_EXT_DIR="$HOME/.vscode/extensions/csm-language"

# Check if extension is installed
if [ ! -d "$VSCODE_EXT_DIR" ]; then
    echo "❌ CSM extension not found! Please run install.sh first."
    exit 1
fi

# Check if keyword files exist
if [ ! -f "$SCRIPT_DIR/keywords_control.txt" ]; then
    echo "❌ Error: keywords_control.txt not found!"
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/keywords_function.txt" ]; then
    echo "❌ Error: keywords_function.txt not found!"
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/csm.tmLanguage.template.json" ]; then
    echo "❌ Error: csm.tmLanguage.template.json not found!"
    exit 1
fi

# Read keywords from files and generate the updated syntax file
echo "📝 Reading keyword files..."

# Read control keywords and join with |
CONTROL_KEYWORDS=$(tr '\n' '|' < "$SCRIPT_DIR/keywords_control.txt" | sed 's/|$//')
CONTROL_COUNT=$(wc -l < "$SCRIPT_DIR/keywords_control.txt" | tr -d ' ')

# Read function keywords and join with |  
FUNCTION_KEYWORDS=$(tr '\n' '|' < "$SCRIPT_DIR/keywords_function.txt" | sed 's/|$//')
FUNCTION_COUNT=$(wc -l < "$SCRIPT_DIR/keywords_function.txt" | tr -d ' ')

echo "📚 Loaded $CONTROL_COUNT control keywords and $FUNCTION_COUNT function keywords"

# Generate the updated syntax file from template
echo "🔧 Generating updated syntax file..."
sed "s/{{CONTROL_KEYWORDS}}/$CONTROL_KEYWORDS/g; s/{{FUNCTION_KEYWORDS}}/$FUNCTION_KEYWORDS/g" \
    "$SCRIPT_DIR/csm.tmLanguage.template.json" > "$VSCODE_EXT_DIR/syntaxes/csm.tmLanguage.json"

echo ""
echo "✅ CSM Language Support updated successfully!"
echo ""
echo "📋 Keywords updated:"
echo "   • Control keywords: $CONTROL_COUNT"
echo "   • Function keywords: $FUNCTION_COUNT"
echo ""
echo "🔄 Next step: Reload VS Code"
echo "   Press Cmd+Shift+P → 'Developer: Reload Window'"
echo ""
echo "💡 Tip: You can also just close and reopen your .csm files to see the changes!"