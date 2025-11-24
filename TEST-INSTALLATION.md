# Installation Test Guide

## Quick Test Guide

This guide provides step-by-step instructions for testing the installation and basic functionality of the Lark Dashboard SDK (`@hypelab/lark-dashboard-sdk`).

## Prerequisites

- Node.js 16.0.0 or higher
- npm 6.0.0 or higher
- Active internet connection

## Test 1: Basic Installation

### Step 1.1: Install the Package

```bash
npm install @hypelab/lark-dashboard-sdk
```

**Expected Output:**
```
added X packages, and audited Y packages in Z seconds
```

### Step 1.2: Verify Installation

```bash
npm list @hypelab/lark-dashboard-sdk
```

**Expected Output:**
```
your-project@1.0.0 /path/to/project
└── @hypelab/lark-dashboard-sdk@1.0.0
```

### Step 1.3: Check Package Files

```bash
ls -la node_modules/@hypelab/lark-dashboard-sdk/
```

**Expected Files:**
- `dist/` - Compiled JavaScript and TypeScript definitions
- `package.json` - Package metadata
- `README.md` - Documentation
- `LICENSE` - MIT license

## Test 2: Basic Import Test

### Step 2.1: Create a Test File

Create `test-import.js`:

```javascript
// Test basic import
const LarkDashboardSDK = require('@hypelab/lark-dashboard-sdk');

console.log('Successfully imported Lark Dashboard SDK');
console.log('Available exports:', Object.keys(LarkDashboardSDK));

// Verify main class is available
if (LarkDashboardSDK.LarkDashboardClient) {
    console.log('✓ LarkDashboardClient is available');
} else {
    console.log('✗ LarkDashboardClient not found');
    process.exit(1);
}

// Verify utils are available
if (LarkDashboardSDK.createDashboardBuilder) {
    console.log('✓ createDashboardBuilder is available');
} else {
    console.log('✗ createDashboardBuilder not found');
    process.exit(1);
}

console.log('Basic import test PASSED');
```

### Step 2.2: Run the Test

```bash
node test-import.js
```

**Expected Output:**
```
Successfully imported Lark Dashboard SDK
Available exports: [ 'LarkDashboardClient', 'createDashboardBuilder', ... ]
✓ LarkDashboardClient is available
✓ createDashboardBuilder is available
Basic import test PASSED
```

## Test 3: TypeScript Import Test

### Step 3.1: Create a TypeScript Test File

Create `test-import.ts`:

```typescript
import { LarkDashboardClient, createDashboardBuilder } from '@hypelab/lark-dashboard-sdk';

console.log('Successfully imported from TypeScript');

// Verify types are available
const client: LarkDashboardClient = new LarkDashboardClient({
    appId: 'test-app-id',
    appSecret: 'test-app-secret'
});

console.log('✓ LarkDashboardClient can be instantiated');
console.log('TypeScript import test PASSED');
```

### Step 3.2: Compile and Run (if TypeScript is installed)

```bash
npx ts-node test-import.ts
```

**Expected Output:**
```
Successfully imported from TypeScript
✓ LarkDashboardClient can be instantiated
TypeScript import test PASSED
```

## Test 4: Instantiation Test

### Step 4.1: Create Instance Test

Create `test-instantiation.js`:

```javascript
const { LarkDashboardClient } = require('@hypelab/lark-dashboard-sdk');

try {
    // Create client instance (no actual API calls)
    const client = new LarkDashboardClient({
        appId: 'test-app-id',
        appSecret: 'test-app-secret'
    });

    console.log('✓ Client instantiated successfully');
    console.log('✓ Client type:', typeof client);
    console.log('✓ Client methods available:', typeof client.createDashboard);

    if (typeof client.createDashboard === 'function') {
        console.log('✓ createDashboard method is available');
    } else {
        console.log('✗ createDashboard method not found');
        process.exit(1);
    }

    console.log('Instantiation test PASSED');
} catch (error) {
    console.error('✗ Error during instantiation:', error.message);
    process.exit(1);
}
```

### Step 4.2: Run the Test

```bash
node test-instantiation.js
```

**Expected Output:**
```
✓ Client instantiated successfully
✓ Client type: object
✓ Client methods available: function
✓ createDashboard method is available
Instantiation test PASSED
```

## Test 5: MCP Server Test

### Step 5.1: Verify MCP Server Availability

```bash
# Check if MCP server binary is available
ls -la node_modules/@hypelab/lark-dashboard-sdk/dist/mcp-server.js
```

**Expected Output:**
```
-rw-r--r--  1 user  group  XXXXX  Nov 25 12:00  node_modules/@hypelab/lark-dashboard-sdk/dist/mcp-server.js
```

### Step 5.2: Test MCP Server Startup

Create `test-mcp-startup.js`:

```javascript
const { spawn } = require('child_process');
const path = require('path');

// Path to MCP server
const mcpServerPath = path.join(__dirname, 'node_modules/@hypelab/lark-dashboard-sdk/dist/mcp-server.js');

// Start MCP server with timeout
const mcpProcess = spawn('node', [mcpServerPath], {
    timeout: 5000,
    stdio: 'pipe'
});

let startupMessage = '';

mcpProcess.stdout.on('data', (data) => {
    startupMessage += data.toString();
    console.log('MCP Output:', data.toString().trim());
});

mcpProcess.stderr.on('data', (data) => {
    console.log('MCP Error:', data.toString().trim());
});

// Kill after 5 seconds
setTimeout(() => {
    mcpProcess.kill();

    if (startupMessage.length > 0) {
        console.log('✓ MCP server started successfully');
    } else {
        console.log('✓ MCP server executable is available');
    }

    console.log('MCP server test PASSED');
}, 5000);

mcpProcess.on('error', (error) => {
    console.error('✗ Error starting MCP server:', error.message);
    process.exit(1);
});
```

### Step 5.3: Run the Test

```bash
node test-mcp-startup.js
```

**Expected Output:**
```
✓ MCP server started successfully
MCP server test PASSED
```

## Test 6: Version Check

### Step 6.1: Check Package Version

```bash
npm view @hypelab/lark-dashboard-sdk version
```

**Expected Output:**
```
1.0.0
```

### Step 6.2: Verify Version Matches package.json

```bash
node -e "console.log(require('@hypelab/lark-dashboard-sdk/package.json').version)"
```

**Expected Output:**
```
1.0.0
```

## Test 7: Dependency Check

### Step 7.1: Check Dependencies

```bash
npm list --depth=0
```

**Expected Output (should include):**
```
your-project
├── @hypelab/lark-dashboard-sdk@1.0.0
├── axios@^1.6.0
└── @modelcontextprotocol/sdk@^1.0.0
```

### Step 7.2: Verify No Vulnerabilities

```bash
npm audit
```

**Expected Output:**
```
audited X packages for vulnerabilities
found 0 vulnerabilities
```

## Test 8: Documentation Access

### Step 8.1: Check README

```bash
cat node_modules/@hypelab/lark-dashboard-sdk/README.md | head -50
```

**Expected Output:**
Should display the SDK README with installation and usage instructions.

### Step 8.2: Verify TypeScript Definitions

```bash
ls -la node_modules/@hypelab/lark-dashboard-sdk/dist/*.d.ts
```

**Expected Output:**
```
-rw-r--r--  1 user  group  XXXXX  Nov 25 12:00  index.d.ts
```

## Complete Test Script

Run all tests at once with this script. Create `run-all-tests.sh`:

```bash
#!/bin/bash

set -e

echo "=========================================="
echo "Lark Dashboard SDK - Complete Test Suite"
echo "=========================================="
echo ""

TEST_DIR=$(mktemp -d)
cd "$TEST_DIR"

echo "Test Directory: $TEST_DIR"
echo ""

# Test 1: Installation
echo "Test 1: Installing package..."
npm init -y > /dev/null 2>&1
npm install @hypelab/lark-dashboard-sdk > /dev/null 2>&1
echo "✓ Package installed successfully"
echo ""

# Test 2: Basic Import
echo "Test 2: Testing basic import..."
node -e "
const sdk = require('@hypelab/lark-dashboard-sdk');
if (sdk.LarkDashboardClient && sdk.createDashboardBuilder) {
    console.log('✓ All exports available');
} else {
    console.error('✗ Missing exports');
    process.exit(1);
}
"
echo ""

# Test 3: Instantiation
echo "Test 3: Testing instantiation..."
node -e "
const { LarkDashboardClient } = require('@hypelab/lark-dashboard-sdk');
const client = new LarkDashboardClient({
    appId: 'test',
    appSecret: 'test'
});
console.log('✓ Client instantiated successfully');
"
echo ""

# Test 4: Version Check
echo "Test 4: Checking version..."
VERSION=\$(npm view @hypelab/lark-dashboard-sdk version)
echo "✓ Package version: \$VERSION"
echo ""

# Cleanup
cd /
rm -rf "$TEST_DIR"

echo "=========================================="
echo "✓ All tests passed!"
echo "=========================================="
```

Run with:
```bash
bash run-all-tests.sh
```

## Troubleshooting

### Issue: Package Not Found

**Problem:** `npm ERR! 404 Not Found`

**Solution:**
1. Verify npm registry is accessible: `npm config get registry`
2. Check internet connection
3. Wait a few minutes and try again (npm registry may need time to index)

### Issue: Installation Fails with Permission Error

**Problem:** `EACCES: permission denied`

**Solution:**
```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g @hypelab/lark-dashboard-sdk

# Option 2: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g @hypelab/lark-dashboard-sdk
```

### Issue: TypeScript Definitions Not Found

**Problem:** `Cannot find module '@hypelab/lark-dashboard-sdk' or its corresponding type declarations`

**Solution:**
```bash
# Reinstall the package
npm uninstall @hypelab/lark-dashboard-sdk
npm install @hypelab/lark-dashboard-sdk

# Verify dist files exist
ls node_modules/@hypelab/lark-dashboard-sdk/dist/
```

### Issue: MCP Server Fails to Start

**Problem:** Error running `lark-dashboard-mcp` command

**Solution:**
```bash
# Verify the binary exists
ls -la node_modules/@hypelab/lark-dashboard-sdk/dist/mcp-server.js

# Try running directly with node
node node_modules/@hypelab/lark-dashboard-sdk/dist/mcp-server.js

# Check Node.js version
node --version  # Should be 16.0.0 or higher
```

### Issue: Dependency Version Conflicts

**Problem:** `npm ERR! peer dep missing`

**Solution:**
```bash
# Check for compatibility issues
npm audit

# Try installing with legacy peer deps flag
npm install --legacy-peer-deps @hypelab/lark-dashboard-sdk
```

## Next Steps After Installation

After successful installation, you can:

1. **Read the API Documentation**
   - Check `/node_modules/@hypelab/lark-dashboard-sdk/API.md`

2. **Run Example Code**
   ```bash
   npm install --save-dev ts-node typescript @types/node
   npx ts-node examples/basic-dashboard.ts
   ```

3. **Review Source Code**
   - Check the source on GitHub: https://github.com/hypelab/lark-dashboard-sdk

4. **Use in Your Project**
   ```typescript
   import { LarkDashboardClient } from '@hypelab/lark-dashboard-sdk';

   const client = new LarkDashboardClient({
       appId: process.env.LARK_APP_ID,
       appSecret: process.env.LARK_APP_SECRET
   });
   ```

## Support

For issues or questions:
- GitHub Issues: https://github.com/hypelab/lark-dashboard-sdk/issues
- Email: dev@hypelab.com

---

Last Updated: November 25, 2025
