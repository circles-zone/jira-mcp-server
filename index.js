import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

// Get configuration from environment variables
const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

if (!JIRA_HOST || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error('Missing required environment variables: JIRA_HOST, JIRA_EMAIL, JIRA_API_TOKEN');
  process.exit(1);
}

// Create axios instance with default config
const jiraApi = axios.create({
  baseURL: `https://${JIRA_HOST}/rest/api/3`,
  headers: {
    'Authorization': `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Create MCP server
const server = new Server(
  {
    name: 'jira-local',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool: Search Issues
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_issues',
      description: 'Search for JIRA issues using JQL (JIRA Query Language)',
      inputSchema: {
        type: 'object',
        properties: {
          jql: {
            type: 'string',
            description: 'JQL query string (e.g., "project = ABC AND status = Open")'
          },
          maxResults: {
            type: 'number',
            description: 'Maximum number of results to return (default: 50)',
            default: 50
          },
          startAt: {
            type: 'number',
            description: 'Starting index for pagination (default: 0)',
            default: 0
          }
        },
        required: ['jql']
      }
    },
    {
      name: 'get_issue',
      description: 'Get details of a specific JIRA issue',
      inputSchema: {
        type: 'object',
        properties: {
          issueKey: {
            type: 'string',
            description: 'Issue key (e.g., "ABC-123")'
          }
        },
        required: ['issueKey']
      }
    },
    {
      name: 'create_issue',
      description: 'Create a new JIRA issue',
      inputSchema: {
        type: 'object',
        properties: {
          project: {
            type: 'string',
            description: 'Project key (e.g., "ABC")'
          },
          summary: {
            type: 'string',
            description: 'Issue summary/title'
          },
          description: {
            type: 'string',
            description: 'Issue description'
          },
          issueType: {
            type: 'string',
            description: 'Issue type (e.g., "Bug", "Story", "Task")'
          },
          priority: {
            type: 'string',
            description: 'Priority (e.g., "High", "Medium", "Low")'
          },
          assignee: {
            type: 'string',
            description: 'Assignee email or account ID (optional)'
          }
        },
        required: ['project', 'summary', 'issueType']
      }
    },
    {
      name: 'update_issue',
      description: 'Update an existing JIRA issue',
      inputSchema: {
        type: 'object',
        properties: {
          issueKey: {
            type: 'string',
            description: 'Issue key (e.g., "ABC-123")'
          },
          fields: {
            type: 'object',
            description: 'Fields to update (e.g., {"summary": "New title", "description": "New description"})'
          },
          transition: {
            type: 'string',
            description: 'Transition name (e.g., "In Progress", "Done")'
          }
        },
        required: ['issueKey']
      }
    },
    {
      name: 'list_projects',
      description: 'List all accessible JIRA projects',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_issues': {
        const { jql, maxResults = 50, startAt = 0 } = args;
        const response = await jiraApi.get('/search', {
          params: { jql, maxResults, startAt }
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                total: response.data.total,
                startAt: response.data.startAt,
                maxResults: response.data.maxResults,
                issues: response.data.issues.map(issue => ({
                  key: issue.key,
                  summary: issue.fields.summary,
                  status: issue.fields.status.name,
                  priority: issue.fields.priority?.name,
                  assignee: issue.fields.assignee?.displayName,
                  created: issue.fields.created,
                  updated: issue.fields.updated
                }))
              }, null, 2)
            }
          ]
        };
      }

      case 'get_issue': {
        const { issueKey } = args;
        const response = await jiraApi.get(`/issue/${issueKey}`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                key: response.data.key,
                fields: {
                  summary: response.data.fields.summary,
                  description: response.data.fields.description,
                  status: response.data.fields.status.name,
                  priority: response.data.fields.priority?.name,
                  issueType: response.data.fields.issuetype.name,
                  assignee: response.data.fields.assignee?.displayName,
                  reporter: response.data.fields.reporter?.displayName,
                  created: response.data.fields.created,
                  updated: response.data.fields.updated,
                  project: {
                    key: response.data.fields.project.key,
                    name: response.data.fields.project.name
                  }
                }
              }, null, 2)
            }
          ]
        };
      }

      case 'create_issue': {
        const { project, summary, description, issueType, priority, assignee } = args;
        
        // First, get project details to find issue type ID
        const projectResponse = await jiraApi.get(`/project/${project}`);
        const issueTypes = projectResponse.data.issueTypes;
        const issueTypeObj = issueTypes.find(it => 
          it.name.toLowerCase() === issueType.toLowerCase()
        );
        
        if (!issueTypeObj) {
          throw new Error(`Issue type "${issueType}" not found in project ${project}`);
        }

        const issueData = {
          fields: {
            project: { key: project },
            summary: summary,
            issuetype: { id: issueTypeObj.id }
          }
        };

        if (description) {
          issueData.fields.description = {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: description
                  }
                ]
              }
            ]
          };
        }

        if (priority) {
          issueData.fields.priority = { name: priority };
        }

        if (assignee) {
          issueData.fields.assignee = { accountId: assignee };
        }

        const response = await jiraApi.post('/issue', issueData);
        
        return {
          content: [
            {
              type: 'text',
              text: `Issue created successfully: ${response.data.key}`
            }
          ]
        };
      }

      case 'update_issue': {
        const { issueKey, fields, transition } = args;
        
        if (fields) {
          // Update fields
          const updateData = { fields: {} };
          
          if (fields.summary) {
            updateData.fields.summary = fields.summary;
          }
          
          if (fields.description) {
            updateData.fields.description = {
              type: 'doc',
              version: 1,
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: fields.description
                    }
                  ]
                }
              ]
            };
          }
          
          if (fields.priority) {
            updateData.fields.priority = { name: fields.priority };
          }
          
          if (fields.assignee) {
            updateData.fields.assignee = { accountId: fields.assignee };
          }
          
          await jiraApi.put(`/issue/${issueKey}`, updateData);
        }
        
        if (transition) {
          // Get available transitions
          const transitionsResponse = await jiraApi.get(`/issue/${issueKey}/transitions`);
          const transitions = transitionsResponse.data.transitions;
          const transitionObj = transitions.find(t => 
            t.name.toLowerCase() === transition.toLowerCase()
          );
          
          if (!transitionObj) {
            throw new Error(`Transition "${transition}" not available for issue ${issueKey}`);
          }
          
          await jiraApi.post(`/issue/${issueKey}/transitions`, {
            transition: { id: transitionObj.id }
          });
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `Issue ${issueKey} updated successfully`
            }
          ]
        };
      }

      case 'list_projects': {
        const response = await jiraApi.get('/project');
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                response.data.map(project => ({
                  key: project.key,
                  name: project.name,
                  projectTypeKey: project.projectTypeKey,
                  lead: project.lead?.displayName
                })),
                null,
                2
              )
            }
          ]
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`
            }
          ],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.response?.data?.errorMessages?.join(', ') || error.message}`
        }
      ],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('JIRA MCP Server running');
}

main().catch(console.error);