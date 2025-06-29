@echo off
echo =====================================
echo JIRA MCP Server Setup for Windows
echo =====================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js found: 
node --version
echo.

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    echo.
    pause
    exit /b 1
)

echo.
echo =====================================
echo Installation complete!
echo =====================================
echo.
echo Next steps:
echo.
echo 1. Get your JIRA API token:
echo    - Go to: https://id.atlassian.com/manage-profile/security/api-tokens
echo    - Click "Create API token"
echo    - Copy the token
echo.
echo 2. Configure Claude Desktop:
echo    - Open: %%APPDATA%%\Claude\claude_desktop_config.json
echo    - Add the jira-local configuration (see README.md)
echo    - Update with your credentials
echo.
echo 3. Test the connection:
echo    - Create a .env file with your credentials
echo    - Run: node test-connection.js
echo.
echo 4. Restart Claude Desktop completely
echo.
echo For detailed instructions, see README.md
echo.
pause