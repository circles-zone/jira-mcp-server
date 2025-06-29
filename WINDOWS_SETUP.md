# Windows Setup Instructions for JIRA MCP

Since your Claude Desktop is on Windows, you'll need to transfer the files and adjust the configuration. Here's what to do:

## 📁 Step 1: Copy the Project Files

1. Copy the entire `/root/jira-mcp-server/` folder to your Windows machine
2. Place it at: `C:\Users\YOUR_USERNAME\jira-mcp-server\`
   (Replace YOUR_USERNAME with your actual Windows username)

The folder should contain:
- `index.js` (the MCP server)
- `package.json`
- `node_modules/` (the dependencies folder)
- `test-connection.js`
- `README.md`
- `examples.md`

## 🔧 Step 2: Update the Configuration

1. Open the file `claude_desktop_config.json` in the project folder
2. Update the path - replace `YOUR_USERNAME` with your actual Windows username:
   ```json
   "args": ["C:\\Users\\YOUR_USERNAME\\jira-mcp-server\\index.js"]
   ```

3. Copy this updated `claude_desktop_config.json` file to:
   `%APPDATA%\Claude\claude_desktop_config.json`
   
   The full path will be something like:
   `C:\Users\YOUR_USERNAME\AppData\Roaming\Claude\claude_desktop_config.json`

## ✅ Step 3: Verify Node.js on Windows

1. Open Command Prompt or PowerShell
2. Run: `node --version`
3. If Node.js is not installed, download it from https://nodejs.org/

## 🧪 Step 4: Test the Connection (Optional)

1. Open Command Prompt or PowerShell
2. Navigate to your project folder:
   ```
   cd C:\Users\YOUR_USERNAME\jira-mcp-server
   ```
3. Run the test:
   ```
   node test-connection.js
   ```

## 🚀 Step 5: Restart Claude Desktop

1. Completely close Claude Desktop (from system tray too)
2. Restart Claude Desktop
3. Look for the hammer icon (🔨)
4. Try a JIRA command!

## 📝 Quick Reference - Windows Paths

- **Project Location**: `C:\Users\YOUR_USERNAME\jira-mcp-server\`
- **Config Location**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Full Config Path**: `C:\Users\YOUR_USERNAME\AppData\Roaming\Claude\claude_desktop_config.json`

## 🆘 Troubleshooting

If the MCP server doesn't work:
1. Make sure all paths use double backslashes `\\` in the config file
2. Ensure Node.js is in your system PATH
3. Check that the config file is in the correct AppData location
4. Try using forward slashes `/` instead of backslashes if issues persist