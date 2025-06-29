# Setup Instructions for Law-AI Team

## 🚀 Quick Start for Tal and Oz

Follow these steps to get JIRA integration working in your Claude Desktop:

### 1. Clone the Repository

Open Command Prompt or PowerShell and run:
```cmd
git clone https://github.com/razibra/jira-mcp-server.git
cd jira-mcp-server
```

### 2. Run the Setup

Double-click `setup-windows.bat` or run:
```cmd
setup-windows.bat
```

This will install all necessary dependencies.

### 3. Get Your Personal JIRA API Token

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Name it something like "Claude Desktop Integration"
4. **Copy the token immediately** (you won't be able to see it again!)

### 4. Configure Claude Desktop

1. Press `Win + R`, type `%APPDATA%\Claude`, press Enter
2. Open `claude_desktop_config.json` (or create it if it doesn't exist)
3. Add this configuration (merge with existing content if any):

```json
{
  "mcpServers": {
    "jira-local": {
      "command": "node",
      "args": ["C:\\Users\\YOUR_WINDOWS_USERNAME\\jira-mcp-server\\index.js"],
      "env": {
        "JIRA_HOST": "law--ai.atlassian.net",
        "JIRA_EMAIL": "your-email@law-ai.ai",
        "JIRA_API_TOKEN": "paste-your-token-here"
      }
    }
  }
}
```

**Replace:**
- `YOUR_WINDOWS_USERNAME` with your actual Windows username (e.g., Tal, Oz)
- `your-email@law-ai.ai` with your Law-AI email
- `paste-your-token-here` with the API token from step 3

### 5. Test Your Connection

Create a `.env` file in the jira-mcp-server folder:
```env
JIRA_HOST=law--ai.atlassian.net
JIRA_EMAIL=your-email@law-ai.ai
JIRA_API_TOKEN=your-api-token
```

Then run:
```cmd
node test-connection.js
```

You should see:
- ✅ Authentication successful!
- Your name
- Law-AI Product (LP) project

### 6. Restart Claude Desktop

1. **Completely close Claude Desktop** (check system tray!)
2. Start Claude Desktop again
3. Look for the **hammer icon (🔨)** in the chat

## 📝 Our JIRA Details

- **JIRA Host**: law--ai.atlassian.net
- **Project Key**: LP (Law-AI Product)
- **Project Name**: Law-AI Product

## 💬 Example Commands to Try

Once everything is set up, try these in Claude Desktop:

- "What JIRA projects do I have access to?"
- "Show me all open issues in project LP"
- "Create a bug for the login page not working"
- "What's the status of LP-1?"
- "Update LP-1 status to In Progress"

## ⚠️ Important Security Notes

1. **Never share your API token** with anyone
2. **Don't commit your API token** to any repository
3. Keep your `.env` file local only

## 🐛 Troubleshooting

### No hammer icon in Claude?
- Make sure Claude Desktop is **completely** closed (not just minimized)
- Check Windows Task Manager and end any Claude processes
- Restart Claude Desktop

### Authentication failed?
1. Your API token might have a typo
2. Your email might not match your JIRA account
3. Create a new API token and try again

### Can't find the config file?
The full path is usually:
`C:\Users\[YourName]\AppData\Roaming\Claude\claude_desktop_config.json`

### Node.js not installed?
Download from: https://nodejs.org/ (get the LTS version)

## 🆘 Need Help?

Contact Raz on:
- Slack: #dev-team channel
- WhatsApp: Law-AI Dev Group
- Email: raz@law-ai.ai

---

**Remember**: After setup, you can use natural language in Claude to interact with JIRA. No need to remember commands or syntax!

Good luck! 🎉