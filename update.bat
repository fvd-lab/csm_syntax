@echo off
REM CSM Language Support - Update Script (Windows)
REM Quick update for when you modify keywords_control.txt or keywords_function.txt

echo Updating CSM Language Support...

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0

REM Define the VS Code extensions directory
set VSCODE_EXT_DIR=%USERPROFILE%\.vscode\extensions\csm-language

REM Check if extension is installed
if not exist "%VSCODE_EXT_DIR%" (
    echo ❌ CSM extension not found! Please run install.bat first.
    pause
    exit /b 1
)

REM Check if keyword files exist
if not exist "%SCRIPT_DIR%keywords_control.txt" (
    echo ❌ Error: keywords_control.txt not found!
    pause
    exit /b 1
)

if not exist "%SCRIPT_DIR%keywords_function.txt" (
    echo ❌ Error: keywords_function.txt not found!
    pause
    exit /b 1
)

if not exist "%SCRIPT_DIR%csm.tmLanguage.template.json" (
    echo ❌ Error: csm.tmLanguage.template.json not found!
    pause
    exit /b 1
)

REM Generate updated syntax file from keyword files
echo 📝 Reading keyword files...

REM Use PowerShell for better text processing
powershell -Command "& {
    $controlKeywords = (Get-Content '%SCRIPT_DIR%keywords_control.txt') -join '|';
    $functionKeywords = (Get-Content '%SCRIPT_DIR%keywords_function.txt') -join '|';
    $controlCount = (Get-Content '%SCRIPT_DIR%keywords_control.txt').Count;
    $functionCount = (Get-Content '%SCRIPT_DIR%keywords_function.txt').Count;
    
    Write-Host '📚 Loaded' $controlCount 'control keywords and' $functionCount 'function keywords';
    Write-Host '🔧 Generating updated syntax file...';
    
    $template = Get-Content '%SCRIPT_DIR%csm.tmLanguage.template.json' -Raw;
    $result = $template -replace '{{CONTROL_KEYWORDS}}', $controlKeywords -replace '{{FUNCTION_KEYWORDS}}', $functionKeywords;
    $result | Out-File -FilePath '%VSCODE_EXT_DIR%\syntaxes\csm.tmLanguage.json' -Encoding UTF8;
    
    Write-Host '';
    Write-Host '✅ CSM Language Support updated successfully!';
    Write-Host '';
    Write-Host '📋 Keywords updated:';
    Write-Host '   • Control keywords:' $controlCount;
    Write-Host '   • Function keywords:' $functionCount;
    Write-Host '';
    Write-Host '🔄 Next step: Reload VS Code';
    Write-Host '   Press Ctrl+Shift+P → Developer: Reload Window';
    Write-Host '';
    Write-Host '💡 Tip: You can also just close and reopen your .csm files to see the changes!';
}"

echo.
pause