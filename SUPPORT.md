# Support Documentation

## Overview

This document provides comprehensive support information for the Lark Dashboard SDK, including troubleshooting guides, frequently asked questions, and resources for getting help.

## Table of Contents

1. [Getting Help](#getting-help)
2. [Common Issues](#common-issues)
3. [Troubleshooting Guide](#troubleshooting-guide)
4. [FAQ](#frequently-asked-questions)
5. [Error Reference](#error-reference)
6. [Advanced Troubleshooting](#advanced-troubleshooting)

---

## Getting Help

### Support Channels

1. **GitHub Issues** (Recommended for bugs)
   - URL: https://github.com/hypelab/lark-dashboard-sdk/issues
   - Best for: Bug reports, feature requests, general questions
   - Response time: Within 2-3 business days

2. **Email Support**
   - Address: dev@hypelab.com
   - Best for: Account issues, enterprise support, sensitive issues
   - Response time: Within 24 business hours

3. **Documentation**
   - README.md - Quick start guide
   - API.md - Complete API reference
   - TEST-INSTALLATION.md - Installation troubleshooting
   - CONTRIBUTING.md - Development guide

4. **GitHub Discussions**
   - URL: https://github.com/hypelab/lark-dashboard-sdk/discussions
   - Best for: General questions, best practices, community discussion

### Creating Effective Issues

When reporting issues, please include:

```markdown
### Environment
- Node.js version: (output of `node --version`)
- npm version: (output of `npm --version`)
- OS: (Windows/macOS/Linux)
- SDK version: (output of `npm list @hypelab/lark-dashboard-sdk`)

### Description
Clear description of the issue...

### Steps to Reproduce
1. Step 1
2. Step 2
3. ...

### Expected Behavior
What should happen...

### Actual Behavior
What actually happens...

### Error Messages
If applicable, paste full error messages...

### Code Sample
Minimal code example that reproduces the issue...
```

---

## Common Issues

### Installation Issues

#### Issue 1: Package Not Found on npm

**Error Message:**
```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@hypelab/lark-dashboard-sdk
```

**Causes:**
- Package not yet published
- Typo in package name
- npm registry cache outdated
- Network connectivity issue

**Solutions:**

1. **Verify Package Name**
   ```bash
   npm search @hypelab/lark-dashboard-sdk
   ```

2. **Clear npm Cache**
   ```bash
   npm cache clean --force
   npm install @hypelab/lark-dashboard-sdk
   ```

3. **Check npm Registry**
   ```bash
   npm config get registry
   # Should return: https://registry.npmjs.org/
   ```

4. **Switch Registry if Needed**
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

5. **Verify Internet Connection**
   ```bash
   ping registry.npmjs.org
   ```

---

#### Issue 2: Permission Denied During Installation

**Error Message:**
```
npm ERR! Error: EACCES, permission denied
```

**Causes:**
- npm installed with sudo previously
- Incorrect file permissions in npm cache
- Global npm directory permissions issue

**Solutions:**

1. **Reinstall npm Properly**
   ```bash
   # Uninstall current npm
   npm uninstall -g npm

   # Reinstall using Node Version Manager
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install node
   ```

2. **Fix npm Directory Permissions**
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   export PATH=~/.npm-global/bin:$PATH
   ```

3. **Update ~/.bashrc or ~/.zshrc**
   ```bash
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

---

#### Issue 3: Dependency Version Conflicts

**Error Message:**
```
npm ERR! peer dep missing: node-fetch@2
```

**Causes:**
- Incompatible dependency versions
- npm version too old
- Conflicting peer dependencies

**Solutions:**

1. **Update npm**
   ```bash
   npm install -g npm@latest
   ```

2. **Use Legacy Peer Deps Flag**
   ```bash
   npm install --legacy-peer-deps @hypelab/lark-dashboard-sdk
   ```

3. **Check Node.js Version**
   ```bash
   node --version
   # Should be 16.0.0 or higher
   ```

4. **Clean Install**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### Runtime Issues

#### Issue 4: Module Not Found Error

**Error Message:**
```
Error: Cannot find module '@hypelab/lark-dashboard-sdk'
```

**Causes:**
- Package not installed
- Incorrect import path
- node_modules directory corrupted
- Working directory issue

**Solutions:**

1. **Verify Installation**
   ```bash
   npm list @hypelab/lark-dashboard-sdk
   ```

2. **Reinstall Package**
   ```bash
   npm uninstall @hypelab/lark-dashboard-sdk
   npm install @hypelab/lark-dashboard-sdk
   ```

3. **Verify Import Statement**
   ```javascript
   // Correct
   const { LarkDashboardClient } = require('@hypelab/lark-dashboard-sdk');

   // Or with TypeScript
   import { LarkDashboardClient } from '@hypelab/lark-dashboard-sdk';
   ```

4. **Check Working Directory**
   ```bash
   pwd
   # Should be the directory containing node_modules
   ```

---

#### Issue 5: TypeScript Definition Errors

**Error Message:**
```
error TS7016: Could not find a declaration file for module '@hypelab/lark-dashboard-sdk'
```

**Causes:**
- TypeScript definitions not installed
- TypeScript version incompatibility
- Incorrect tsconfig settings

**Solutions:**

1. **Verify Definitions Exist**
   ```bash
   ls node_modules/@hypelab/lark-dashboard-sdk/dist/*.d.ts
   ```

2. **Update TypeScript**
   ```bash
   npm install --save-dev typescript@latest
   ```

3. **Configure tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true
     }
   }
   ```

4. **Reinstall Package**
   ```bash
   npm uninstall @hypelab/lark-dashboard-sdk
   npm install @hypelab/lark-dashboard-sdk
   ```

---

#### Issue 6: Authentication Failures

**Error Message:**
```
Error: Invalid app credentials or authentication failed
```

**Causes:**
- Incorrect app ID or secret
- Credentials not set as environment variables
- Lark API credentials invalid or expired
- Insufficient permissions

**Solutions:**

1. **Verify Credentials**
   ```javascript
   console.log('App ID:', process.env.LARK_APP_ID);
   console.log('App Secret:', process.env.LARK_APP_SECRET);
   ```

2. **Check Environment Variables**
   ```bash
   # Create .env file
   echo "LARK_APP_ID=your_app_id" > .env
   echo "LARK_APP_SECRET=your_app_secret" >> .env

   # Don't commit to version control
   echo ".env" >> .gitignore
   ```

3. **Use Environment Variable in Code**
   ```javascript
   const client = new LarkDashboardClient({
       appId: process.env.LARK_APP_ID,
       appSecret: process.env.LARK_APP_SECRET
   });
   ```

4. **Verify Lark Credentials**
   - Go to Lark/Feishu development console
   - Verify app is approved
   - Check API scopes are granted
   - Ensure app secret is current

---

### API Issues

#### Issue 7: Request Timeout Errors

**Error Message:**
```
Error: timeout of 30000ms exceeded
```

**Causes:**
- Lark API is slow or unreachable
- Network connectivity issue
- Request payload too large
- Rate limiting

**Solutions:**

1. **Check Network Connection**
   ```bash
   ping api.lark.com
   ```

2. **Increase Timeout**
   ```javascript
   const client = new LarkDashboardClient({
       appId: process.env.LARK_APP_ID,
       appSecret: process.env.LARK_APP_SECRET,
       timeout: 60000  // 60 seconds
   });
   ```

3. **Implement Retry Logic**
   ```javascript
   const axios = require('axios');
   const axiosRetry = require('axios-retry');

   axiosRetry(axios, { retries: 3 });
   ```

4. **Check Rate Limits**
   - Verify you're not exceeding rate limits
   - Implement request throttling
   - Check API quota in Lark console

---

#### Issue 8: Permission Denied Errors

**Error Message:**
```
Error: Permission denied: You don't have permission to access this resource
```

**Causes:**
- App doesn't have required scopes
- User doesn't have required permissions
- API endpoint not enabled
- Insufficient credentials

**Solutions:**

1. **Verify API Scopes**
   - Go to Lark app settings
   - Check required scopes are enabled:
     - `bitable:app` - Bitable app access
     - `dashboard:write` - Dashboard creation
     - Check specific scopes needed for your use case

2. **Check User Permissions**
   - Verify user has permission to create dashboards
   - Check if user is in required department

3. **Enable API Endpoints**
   - Verify Bitable API is enabled in app
   - Check Dashboard API is enabled

4. **Review Permissions Example**
   ```typescript
   import { LarkDashboardClient } from '@hypelab/lark-dashboard-sdk';

   const client = new LarkDashboardClient({
       appId: process.env.LARK_APP_ID,
       appSecret: process.env.LARK_APP_SECRET
   });

   // Check current permissions
   client.getAppInfo()
       .then(info => console.log('Scopes:', info.scopes))
       .catch(err => console.error('Error:', err));
   ```

---

#### Issue 9: Invalid Dashboard Configuration

**Error Message:**
```
Error: Invalid dashboard configuration
```

**Causes:**
- Missing required fields
- Invalid field types
- Conflicting configurations
- Unsupported operations

**Solutions:**

1. **Validate Configuration**
   ```javascript
   const dashboardConfig = {
       name: 'My Dashboard',  // Required
       appId: 'app_id',       // Required
       content: {             // Required
           blocks: []
       }
   };
   ```

2. **Check Field Types**
   - Strings should be strings
   - Numbers should be numbers
   - Booleans should be booleans
   - Arrays should be arrays

3. **Review Examples**
   - Check `/examples/` directory
   - See `basic-dashboard.ts` for minimal example
   - See `complete-dashboard.ts` for advanced features

4. **Validate JSON Schema**
   ```javascript
   const Ajv = require('ajv');
   const ajv = new Ajv();
   const validate = ajv.compile(dashboardSchema);

   const valid = validate(config);
   if (!valid) console.log(validate.errors);
   ```

---

### MCP Server Issues

#### Issue 10: MCP Server Fails to Start

**Error Message:**
```
Error: Failed to start MCP server
```

**Causes:**
- Port already in use
- Invalid configuration
- Missing dependencies
- Permission issues

**Solutions:**

1. **Check Port Availability**
   ```bash
   # macOS/Linux
   lsof -i :3000  # Check if port 3000 is in use

   # Windows
   netstat -ano | findstr :3000
   ```

2. **Use Different Port**
   ```bash
   MCP_PORT=3001 node node_modules/@hypelab/lark-dashboard-sdk/dist/mcp-server.js
   ```

3. **Verify Configuration**
   ```bash
   cat .env
   # Should have MCP_PORT and LAN_APP_ID, LARK_APP_SECRET
   ```

4. **Check Logs**
   ```bash
   node node_modules/@hypelab/lark-dashboard-sdk/dist/mcp-server.js 2>&1 | tee mcp-server.log
   ```

---

---

## Troubleshooting Guide

### Step-by-Step Troubleshooting Process

#### Step 1: Identify the Issue

1. **Read the Error Message Carefully**
   - Note the error message
   - Note the stack trace
   - Note any additional context

2. **Search Documentation**
   - Check API.md
   - Check README.md
   - Check Common Issues above

3. **Search GitHub Issues**
   - Go to GitHub issues
   - Search for similar issues
   - Check if issue is already resolved

#### Step 2: Gather Information

```bash
# System Information
node --version
npm --version
uname -a  # macOS/Linux

# SDK Information
npm list @hypelab/lark-dashboard-sdk
npm list --depth=1

# Environment
echo $PATH
npm config get registry
npm config get prefix
```

#### Step 3: Reproduce the Issue

1. **Create Minimal Reproduction**
   ```javascript
   // Minimal code that reproduces the issue
   const { LarkDashboardClient } = require('@hypelab/lark-dashboard-sdk');

   // ... minimal code to trigger the issue
   ```

2. **Document Steps**
   - Exact steps to reproduce
   - Expected behavior
   - Actual behavior

#### Step 4: Apply Solutions

1. **Try Suggestions from Common Issues**
2. **Check GitHub Discussions**
3. **Contact Support with Details**

#### Step 5: Report Issue if Needed

```markdown
## Issue: [Brief Description]

### Environment
- Node.js: [version]
- npm: [version]
- SDK: [version]
- OS: [OS]

### Description
[Detailed description]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]

### Error Output
[Full error message and stack trace]

### Minimal Code Example
[Minimal code that reproduces issue]
```

---

## Frequently Asked Questions

### Q1: Can I use this SDK with Node.js versions below 16?

**A:** No, the SDK requires Node.js 16.0.0 or higher. We recommend using the latest LTS version (20.x or later).

**Solution:**
```bash
nvm install 20  # Install Node.js 20 (LTS)
nvm use 20
npm install @hypelab/lark-dashboard-sdk
```

---

### Q2: How do I set up authentication?

**A:** Use environment variables to store credentials safely:

```bash
# .env file (DO NOT commit to version control)
LARK_APP_ID=your_app_id_here
LARK_APP_SECRET=your_app_secret_here
```

```javascript
const client = new LarkDashboardClient({
    appId: process.env.LARK_APP_ID,
    appSecret: process.env.LARK_APP_SECRET
});
```

---

### Q3: How do I create a dashboard programmatically?

**A:** Use the `createDashboardBuilder` helper:

```typescript
import { createDashboardBuilder } from '@hypelab/lark-dashboard-sdk';

const dashboard = createDashboardBuilder()
    .setName('My Dashboard')
    .setDescription('Dashboard description')
    .addBlock(/* ... */)
    .build();
```

---

### Q4: What are the rate limits for the API?

**A:** Rate limits depend on your Lark account tier. Check your Lark app settings for specific limits. Implement exponential backoff for retries.

---

### Q5: Can I use this SDK in a browser?

**A:** No, this SDK is designed for Node.js server-side use only. API calls require authentication that should only be done server-side.

---

### Q6: How do I debug API requests?

**A:** Enable debug logging:

```javascript
const client = new LarkDashboardClient({
    appId: process.env.LARK_APP_ID,
    appSecret: process.env.LARK_APP_SECRET,
    debug: true
});

// Or use axios interceptors
client.axios.interceptors.request.use(config => {
    console.log('Request:', config);
    return config;
});
```

---

### Q7: Can I use multiple clients simultaneously?

**A:** Yes, create separate client instances:

```javascript
const client1 = new LarkDashboardClient({ appId: 'app1', appSecret: 'secret1' });
const client2 = new LarkDashboardClient({ appId: 'app2', appSecret: 'secret2' });
```

---

### Q8: How do I handle errors properly?

**A:** Use try-catch blocks:

```typescript
try {
    const dashboard = await client.createDashboard(config);
    console.log('Dashboard created:', dashboard.id);
} catch (error) {
    if (error.response?.status === 401) {
        console.error('Authentication failed');
    } else if (error.response?.status === 403) {
        console.error('Permission denied');
    } else {
        console.error('Error:', error.message);
    }
}
```

---

### Q9: Is TypeScript supported?

**A:** Yes! Full TypeScript support with type definitions:

```typescript
import {
    LarkDashboardClient,
    DashboardConfig,
    Block
} from '@hypelab/lark-dashboard-sdk';

const config: DashboardConfig = {
    name: 'My Dashboard',
    appId: 'app_id',
    content: {
        blocks: [] as Block[]
    }
};
```

---

### Q10: How do I contribute?

**A:** See CONTRIBUTING.md for detailed guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

---

## Error Reference

### HTTP Status Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request parameters and format |
| 401 | Unauthorized | Verify authentication credentials |
| 403 | Forbidden | Check API scopes and permissions |
| 404 | Not Found | Verify resource exists |
| 429 | Too Many Requests | Implement rate limit handling |
| 500 | Server Error | Retry with exponential backoff |

### Common Error Messages

#### "Invalid credentials"
- Check appId and appSecret are correct
- Verify app is approved in Lark
- Check credentials haven't expired

#### "Insufficient permissions"
- Verify required API scopes are enabled
- Check user permissions
- Contact workspace admin if needed

#### "Invalid request format"
- Verify JSON is valid
- Check all required fields are present
- Validate field types match schema

#### "Rate limit exceeded"
- Wait before retrying
- Implement request throttling
- Consider upgrading plan

---

## Advanced Troubleshooting

### Enable Debug Mode

```javascript
// Enable verbose logging
const client = new LarkDashboardClient({
    appId: process.env.LARK_APP_ID,
    appSecret: process.env.LARK_APP_SECRET,
    debug: true
});

// Add request/response logging
client.axios.interceptors.request.use(config => {
    console.log('[Request]', config.method.toUpperCase(), config.url);
    console.log('[Headers]', config.headers);
    console.log('[Data]', config.data);
    return config;
});

client.axios.interceptors.response.use(
    response => {
        console.log('[Response]', response.status, response.statusText);
        console.log('[Data]', response.data);
        return response;
    },
    error => {
        console.log('[Error]', error.response?.status, error.message);
        return Promise.reject(error);
    }
);
```

### Monitor Network Activity

```bash
# Use tcpdump to monitor network traffic
tcpdump -A -s 0 'tcp port 443' | grep -v '^$'

# Or use curl with verbose flag
curl -v -X POST https://api.lark.com/...
```

### Check Memory Usage

```javascript
// Monitor memory usage
console.log('Memory usage:', process.memoryUsage());

// Check for memory leaks with long-running operations
setInterval(() => {
    console.log('Memory:', Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB');
}, 5000);
```

---

## Escalation Process

### When to Escalate

1. **Issue persists after following troubleshooting steps**
2. **Blocking production environment**
3. **Security-related concern**
4. **Requires code-level investigation**

### Escalation Steps

1. **Gather comprehensive information**
   - Environment details
   - Minimal reproduction
   - Error logs and stack traces
   - Steps taken to resolve

2. **Contact support**
   - Email: dev@hypelab.com
   - Include all gathered information
   - Mark as urgent if production is blocked

3. **Follow up**
   - Respond to support requests promptly
   - Provide additional information if asked
   - Test solutions in your environment

---

## Resources

- **Documentation:** https://github.com/hypelab/lark-dashboard-sdk
- **API Reference:** API.md in project root
- **Examples:** /examples directory
- **GitHub Issues:** https://github.com/hypelab/lark-dashboard-sdk/issues
- **Lark Documentation:** https://open.larksuite.com
- **Node.js Docs:** https://nodejs.org/docs/

---

## Document Maintenance

This support documentation is maintained and updated regularly. Last updated: November 25, 2025

**Found an issue with this documentation?**
- Create an issue on GitHub
- Email dev@hypelab.com
- Submit a pull request with improvements

---
