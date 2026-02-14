@echo off
REM CSM Language Support for VS Code - Installation Script (Windows)
REM This script installs the CSM syntax highlighting extension for VS Code

echo Installing CSM Language Support for VS Code...

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0

REM Define the VS Code extensions directory
set VSCODE_EXT_DIR=%USERPROFILE%\.vscode\extensions\csm-language

REM Create the extension directory if it doesn't exist
echo Creating extension directory at: %VSCODE_EXT_DIR%
if not exist "%VSCODE_EXT_DIR%" mkdir "%VSCODE_EXT_DIR%"

REM Generate syntax file from keyword files
echo Generating syntax file from keyword files...

REM Check if keyword files exist
if not exist "%SCRIPT_DIR%keywords_control.txt" (
    echo Error: keywords_control.txt not found!
    pause
    exit /b 1
)

if not exist "%SCRIPT_DIR%keywords_function.txt" (
    echo Error: keywords_function.txt not found!
    pause
    exit /b 1
)

if not exist "%SCRIPT_DIR%csm.tmLanguage.template.json" (
    echo Error: csm.tmLanguage.template.json not found!
    pause
    exit /b 1
)

REM Create syntaxes directory
if not exist "%VSCODE_EXT_DIR%\syntaxes" mkdir "%VSCODE_EXT_DIR%\syntaxes"

REM Read and process keywords (using PowerShell for better text processing)
powershell -Command "& {
    $controlKeywords = (Get-Content '%SCRIPT_DIR%keywords_control.txt') -join '|';
    $functionKeywords = (Get-Content '%SCRIPT_DIR%keywords_function.txt') -join '|';
    $template = Get-Content '%SCRIPT_DIR%csm.tmLanguage.template.json' -Raw;
    $result = $template -replace '{{CONTROL_KEYWORDS}}', $controlKeywords -replace '{{FUNCTION_KEYWORDS}}', $functionKeywords;
    $result | Out-File -FilePath '%VSCODE_EXT_DIR%\syntaxes\csm.tmLanguage.json' -Encoding UTF8;
    Write-Host 'Generated syntax file with keyword substitutions'
}"

REM Copy configuration files
echo Copying configuration files...
copy "%SCRIPT_DIR%package.json" "%VSCODE_EXT_DIR%\"
copy "%SCRIPT_DIR%language-configuration.json" "%VSCODE_EXT_DIR%\"

echo.
echo ✅ CSM Language Support installed successfully!
echo.
echo Next steps:
echo 1. Open VS Code
echo 2. Press Ctrl+Shift+P
echo 3. Type 'Developer: Reload Window' and press Enter
echo 4. Open any .csm file to see syntax highlighting!
echo.
echo To add new keywords:
echo - Edit keywords_control.txt or keywords_function.txt
echo - Run this installer again
echo.
pause