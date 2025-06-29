# JIRA MCP Server for Claude Desktop

Connect your JIRA instance to Claude Desktop on Windows. Built by the Law-AI team.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

## 🚀 Features

- **Search Issues** - Use JQL to search across your JIRA projects
- **Get Issue Details** - Retrieve complete information about specific issues
- **Create Issues** - Create new bugs, tasks, stories directly from Claude
- **Update Issues** - Modify issue status, assignee, priority, and more
- **List Projects** - View all accessible JIRA projects

## 📋 Prerequisites

- Windows 10/11
- Node.js 18+ installed ([Download here](https://nodejs.org/))
- Claude Desktop installed ([Get it here](https://claude.ai/download))
- JIRA account with API access
- Admin access to your Windows user folder

## 🔧 Installation

### 1. Clone this repository

```bash
git clone https://github.com/razibra/jira-mcp-server.git
cd jira-mcp-server
```

### 2. Install dependencies

```bash
npm install
```

Or use the provided batch file:
```bash
setup-windows.bat
```

### 3. Get your JIRA API Token

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Give it a name (e.g., "Claude Desktop Integration")
4. Copy the token and save it securely

### 4. Configure Claude Desktop

1. Locate your Claude Desktop config file:
   - Press `Win + R`, type `%APPDATA%\Claude`, press Enter
   - Open `claude_desktop_config.json` (create it if it doesn't exist)

2. Add the JIRA server configuration:

```json
{
  "mcpServers": {
    "jira-local": {
      "command": "node",
      "args": ["C:\\Users\\YOUR_USERNAME\\jira-mcp-server\\index.js"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com",
        "JIRA_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

**Important**: Replace:
- `YOUR_USERNAME` with your Windows username
- `your-company.atlassian.net` with your JIRA instance URL
- `your-email@company.com` with your JIRA email
- `your-api-token-here` with your API token from step 3

### 5. Restart Claude Desktop

1. Completely close Claude Desktop (including from system tray)
2. Start Claude Desktop again
3. Look for the hammer icon (🔨) in the chat interface - this indicates MCP servers are loaded

## 🧪 Testing the Connection

### Option 1: Using environment variables (Recommended)

Create a `.env` file in the project directory:
```env
JIRA_HOST=your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token
```

Then run:
```bash
node test-connection.js
```

### Option 2: Using Windows environment variables

```cmd
set JIRA_HOST=your-company.atlassian.net
set JIRA_EMAIL=your-email@company.com
set JIRA_API_TOKEN=your-api-token
node test-connection.js
```

## 💬 Usage in Claude Desktop

Once configured, you can use natural language to interact with JIRA:

### Search Issues
- "Show me all open issues in project ABC"
- "Find bugs assigned to me"
- "List high priority issues created this week"
- "Search for issues with 'login' in the title"

### Get Issue Details
- "What's the status of ABC-123?"
- "Show me details for issue XYZ-456"

### Create Issues
- "Create a bug for the login page not loading"
- "Make a new task for implementing user authentication"
- "Create a story for dark mode feature with high priority"

### Update Issues
- "Move ABC-123 to In Progress"
- "Assign XYZ-456 to john@company.com"
- "Change priority of ABC-789 to High"

### List Projects
- "What JIRA projects do I have access to?"
- "Show me all available projects"

## 🛠️ Available Tools

| Tool | Description | Example |
|------|-------------|---------|
| `search_issues` | Search using JQL | `project = ABC AND status = Open` |
| `get_issue` | Get issue details | `ABC-123` |
| `create_issue` | Create new issue | Bug/Task/Story with fields |
| `update_issue` | Update existing issue | Status, assignee, priority |
| `list_projects` | List all projects | Shows key, name, lead |

## 🔍 Troubleshooting

### MCP tools not showing up?
1. Ensure Claude Desktop is completely restarted
2. Check the config file location: `%APPDATA%\Claude\claude_desktop_config.json`
3. Verify the path to index.js uses your correct username
4. Look for syntax errors in the JSON config

### Authentication errors?
1. Verify your API token hasn't expired
2. Check your email matches your JIRA account
3. Ensure the JIRA host URL is correct (without https://)
4. Run `node test-connection.js` to debug

### Can't find or create issues?
1. Check you have the necessary JIRA permissions
2. Verify project keys are correct
3. Ensure issue types match your JIRA configuration

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)

## 👥 Created by

The Law-AI Team
- Raz Bracha - Project Lead
- Tal Shukin
- Oz

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Run the test connection script
3. Open an issue on GitHub
4. Contact the team on Slack/WhatsApp

---

Made with ❤️ by Law-AI