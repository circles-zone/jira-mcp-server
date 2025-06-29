import axios from 'axios';

// Get from environment variables
const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

if (!JIRA_HOST || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error('Please set environment variables:');
  console.error('set JIRA_HOST=your-company.atlassian.net');
  console.error('set JIRA_EMAIL=your-email@company.com');
  console.error('set JIRA_API_TOKEN=your-api-token');
  console.error('');
  console.error('Or create a .env file with these values.');
  process.exit(1);
}

// Create axios instance
const jiraApi = axios.create({
  baseURL: `https://${JIRA_HOST}/rest/api/3`,
  headers: {
    'Authorization': `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

async function testConnection() {
  console.log('Testing JIRA connection...');
  console.log(`Host: ${JIRA_HOST}`);
  console.log(`Email: ${JIRA_EMAIL}`);
  console.log('');

  try {
    // Test 1: Get current user
    console.log('1. Testing authentication - Getting current user...');
    const userResponse = await jiraApi.get('/myself');
    console.log(`✅ Authentication successful! Logged in as: ${userResponse.data.displayName}`);
    console.log(`   Account ID: ${userResponse.data.accountId}`);
    console.log('');

    // Test 2: List projects
    console.log('2. Fetching available projects...');
    const projectsResponse = await jiraApi.get('/project');
    console.log(`✅ Found ${projectsResponse.data.length} projects:`);
    projectsResponse.data.forEach(project => {
      console.log(`   - ${project.key}: ${project.name}`);
    });
    console.log('');

    // Test 3: Search for recent issues
    console.log('3. Searching for recent issues...');
    const searchResponse = await jiraApi.get('/search', {
      params: {
        jql: 'updated >= -7d ORDER BY updated DESC',
        maxResults: 5
      }
    });
    console.log(`✅ Found ${searchResponse.data.total} issues updated in the last 7 days`);
    if (searchResponse.data.issues.length > 0) {
      console.log('   Recent issues:');
      searchResponse.data.issues.forEach(issue => {
        console.log(`   - ${issue.key}: ${issue.fields.summary}`);
      });
    }
    console.log('');

    // Test 4: Check permissions
    console.log('4. Checking permissions...');
    const permissionsResponse = await jiraApi.get('/mypermissions', {
      params: {
        permissions: 'CREATE_ISSUES,EDIT_ISSUES,BROWSE_PROJECTS'
      }
    });
    console.log('✅ Your permissions:');
    Object.entries(permissionsResponse.data.permissions).forEach(([key, value]) => {
      console.log(`   - ${key}: ${value.havePermission ? '✓' : '✗'}`);
    });

    console.log('\n✅ All tests passed! JIRA connection is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection test failed!');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Error: ${error.response.data?.errorMessages?.join(', ') || error.response.statusText}`);
      
      if (error.response.status === 401) {
        console.error('\n   This is an authentication error. Please check:');
        console.error('   1. Your API token is correct');
        console.error('   2. Your email address is correct');
        console.error('   3. The API token has not expired');
      }
    } else {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

testConnection();