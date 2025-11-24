#!/bin/bash

# Lark Dashboard SDK - Deployment Test Script
# Tests all functionality before deployment

set -e  # Exit on error

echo "========================================="
echo "Lark Dashboard SDK - Deployment Test"
echo "========================================="
echo ""

# Check environment variables
echo "1. Checking environment variables..."
if [ -z "$LARK_API_KEY" ]; then
    echo "✗ LARK_API_KEY not set"
    echo "  Run: export LARK_API_KEY=your_api_key"
    exit 1
fi
echo "✓ LARK_API_KEY set"

if [ -z "$LARK_REGION" ]; then
    export LARK_REGION="sg"
    echo "  Setting default LARK_REGION=sg"
fi
echo "✓ LARK_REGION=$LARK_REGION"
echo ""

# Check Node.js version
echo "2. Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "✓ Node.js version: $NODE_VERSION"
echo ""

# Install dependencies
echo "3. Installing dependencies..."
npm install --silent
echo "✓ Dependencies installed"
echo ""

# Build TypeScript
echo "4. Building TypeScript..."
npm run build
if [ $? -eq 0 ]; then
    echo "✓ Build successful"
else
    echo "✗ Build failed"
    exit 1
fi
echo ""

# Verify build output
echo "5. Verifying build output..."
if [ -f "dist/index.js" ]; then
    echo "✓ dist/index.js exists"
else
    echo "✗ dist/index.js not found"
    exit 1
fi

if [ -f "dist/mcp-server.js" ]; then
    echo "✓ dist/mcp-server.js exists"
else
    echo "✗ dist/mcp-server.js not found"
    exit 1
fi
echo ""

# Test basic client functionality
echo "6. Testing basic client..."
node -e "
const { LarkDashboardClient } = require('./dist');
const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY,
  region: process.env.LARK_REGION,
});
console.log('✓ Client instantiated successfully');
"
echo ""

# Test builders
echo "7. Testing builders..."
node -e "
const { ChartBlockBuilder, MetricsBlockBuilder, ViewBlockBuilder, TextBlockBuilder, ChartType, ViewType, AggregationType } = require('./dist');

// Test Chart Builder
const chart = ChartBlockBuilder.bar()
  .dataSource('test_app', 'test_table')
  .xAxis('field1')
  .yAxis([{ fieldName: 'field2', aggregation: AggregationType.SUM }])
  .build();
console.log('✓ ChartBlockBuilder works');

// Test Metrics Builder
const metrics = new MetricsBlockBuilder()
  .dataSource('test_app', 'test_table')
  .field('revenue')
  .aggregation(AggregationType.SUM)
  .build();
console.log('✓ MetricsBlockBuilder works');

// Test View Builder
const view = ViewBlockBuilder.grid()
  .dataSource('test_app', 'test_table')
  .build();
console.log('✓ ViewBlockBuilder works');

// Test Text Builder
const text = new TextBlockBuilder()
  .heading('Test', 1)
  .build();
console.log('✓ TextBlockBuilder works');
"
echo ""

# Test with HypeLAB Automation base
echo "8. Testing with HypeLAB Automation base..."
echo "   Creating test dashboard..."

node << 'EOTEST'
const { LarkDashboardClient, TextBlockBuilder } = require('./dist');

const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY,
  region: 'sg',
  logging: false,
});

const APP_TOKEN = 'FUVdb7bebaVLeMsKJgJlnsX2gzd';

(async () => {
  try {
    // Create test dashboard
    const dashboardName = 'SDK Test - ' + new Date().toISOString();
    const dashboardId = await client.createDashboard({
      name: dashboardName,
      appToken: APP_TOKEN,
    });
    
    console.log('✓ Dashboard created:', dashboardId);
    
    // Add a text block
    const textBlock = new TextBlockBuilder()
      .heading('Test Dashboard', 1)
      .paragraph('This is a test dashboard created by the SDK deployment test.')
      .build();
    
    const blockId = await client.addBlock(APP_TOKEN, dashboardId, textBlock);
    console.log('✓ Text block added:', blockId);
    
    // List dashboards
    const dashboards = await client.listDashboards(APP_TOKEN);
    console.log('✓ Listed', dashboards.length, 'dashboards');
    
    // Clean up - delete test dashboard
    await client.deleteDashboard(APP_TOKEN, dashboardId);
    console.log('✓ Test dashboard deleted');
    
    console.log('');
    console.log('✓ All HypeLAB base tests passed!');
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    process.exit(1);
  }
})();
EOTEST

echo ""

# Test MCP server
echo "9. Testing MCP server..."
echo "   Starting MCP server (will timeout after 5 seconds)..."

timeout 5s node dist/mcp-server.js > /dev/null 2>&1 &
MCP_PID=$!
sleep 2

if ps -p $MCP_PID > /dev/null 2>&1; then
    echo "✓ MCP server started successfully"
    kill $MCP_PID 2>/dev/null || true
else
    echo "✗ MCP server failed to start"
    exit 1
fi
echo ""

# Package verification
echo "10. Verifying package configuration..."

# Check package.json
if grep -q "@hypelab/lark-dashboard-sdk" package.json; then
    echo "✓ Package name correct"
else
    echo "✗ Package name incorrect"
    exit 1
fi

# Check bin entry
if grep -q "lark-dashboard-mcp" package.json; then
    echo "✓ Binary entry configured"
else
    echo "✗ Binary entry missing"
    exit 1
fi

# Check main entry
if grep -q '"main": "dist/index.js"' package.json; then
    echo "✓ Main entry correct"
else
    echo "✗ Main entry incorrect"
    exit 1
fi
echo ""

# Summary
echo "========================================="
echo "All tests passed! ✓"
echo "========================================="
echo ""
echo "Package is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Review code one final time"
echo "2. npm publish --dry-run"
echo "3. npm publish --access public"
echo "4. Test installation: npm install -g @hypelab/lark-dashboard-sdk"
echo "5. Configure in Claude Desktop"
echo "6. Verify MCP integration works"
echo ""
echo "View test dashboard at:"
echo "https://hypelive.sg.larksuite.com/base/FUVdb7bebaVLeMsKJgJlnsX2gzd"
echo ""
