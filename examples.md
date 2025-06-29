# JIRA MCP Usage Examples

## Example Conversations with Claude Desktop

Once you've restarted Claude Desktop and see the hammer icon (🔨), you can have conversations like these:

### 📋 Searching for Issues

**You**: "Show me all open issues in the LP project"
**Claude**: *Uses the JIRA tool to search with JQL: `project = LP AND status != Done`*

**You**: "Find all bugs assigned to me that are high priority"
**Claude**: *Searches with JQL: `assignee = currentUser() AND priority = High AND issuetype = Bug`*

**You**: "List issues created in the last 30 days"
**Claude**: *Searches with JQL: `created >= -30d ORDER BY created DESC`*

### 🔍 Getting Issue Details

**You**: "What's the current status of LP-1?"
**Claude**: *Fetches LP-1 details and shows the status, summary, and other fields*

**You**: "Show me the description and assignee for LP-1"
**Claude**: *Retrieves and displays the specific fields requested*

### ✨ Creating New Issues

**You**: "Create a bug report for a login issue where users can't reset their password"
**Claude**: *Creates a new bug in project LP with appropriate title and description*

**You**: "I need a new task for implementing OAuth integration"
**Claude**: *Creates a task type issue with the details provided*

**You**: "Create a story for adding dark mode to the application, assign it to me, and set priority to Medium"
**Claude**: *Creates a story with all the specified attributes*

### 📝 Updating Issues

**You**: "Move LP-1 to In Progress"
**Claude**: *Updates the issue status using the appropriate transition*

**You**: "Update the description of LP-1 to include the new requirements we discussed"
**Claude**: *Updates the issue description field*

**You**: "Change the priority of LP-1 to High"
**Claude**: *Updates the priority field*

### 📊 Project Information

**You**: "What JIRA projects do I have access to?"
**Claude**: *Lists all accessible projects with their keys and names*

**You**: "Show me the project lead for LP"
**Claude**: *Displays project information including the lead*

## Advanced JQL Examples

You can also use more complex JQL queries:

**You**: "Find all issues where the summary contains 'API' and they're not resolved"
**Claude**: *Searches: `summary ~ "API" AND resolution = Unresolved`*

**You**: "Show me issues I reported that are still open"
**Claude**: *Searches: `reporter = currentUser() AND status in (Open, "In Progress", "To Do")`*

**You**: "List all issues updated today"
**Claude**: *Searches: `updated >= startOfDay() ORDER BY updated DESC`*

**You**: "Find issues labeled with 'frontend' or 'UI'"
**Claude**: *Searches: `labels in (frontend, UI)`*

## Workflow Examples

### Daily Standup Helper
**You**: "Show me what I worked on yesterday"
**Claude**: *Searches for issues you updated in the last day*

### Sprint Planning
**You**: "List all unassigned stories in the backlog"
**Claude**: *Searches: `issuetype = Story AND assignee is EMPTY AND status = Backlog`*

### Bug Triage
**You**: "Find all bugs without a priority set"
**Claude**: *Searches: `issuetype = Bug AND priority is EMPTY`*

## Tips for Effective Use

1. **Be specific**: Instead of "show me issues", say "show me open bugs in project LP"
2. **Use natural language**: Claude will convert your request to JQL
3. **Iterate**: Start with broad searches and refine based on results
4. **Combine operations**: "Create a bug for the login issue and assign it to me with high priority"

Remember: Claude will use the appropriate JIRA tool based on your request, and you'll see the hammer icon (🔨) flash when it's using the MCP tools!