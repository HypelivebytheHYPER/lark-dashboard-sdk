# Integration Guide

Complete guide for integrating Lark Dashboard SDK with various tools and workflows.

## Table of Contents

1. [Claude Code Integration](#claude-code-integration)
2. [MCP Server Setup](#mcp-server-setup)
3. [Lark MCP Integration](#lark-mcp-integration)
4. [Workflow Examples](#workflow-examples)
5. [Advanced Usage](#advanced-usage)

## Claude Code Integration

Use the Lark Dashboard SDK with Claude Code for AI-powered dashboard creation.

### Setup Steps

#### 1. Install the Package

```bash
npm install -g @hypelab/lark-dashboard-sdk
```

#### 2. Configure Claude Code

Edit `~/.claude.json` (or `%USERPROFILE%\.claude.json` on Windows):

```json
{
  "mcpServers": {
    "lark-dashboard": {
      "command": "lark-dashboard-mcp",
      "env": {
        "LARK_APP_ID": "cli_xxx",
        "LARK_APP_SECRET": "xxx"
      }
    }
  }
}
```

#### 3. Verify Setup

```bash
# Check if MCP server is available
claude mcp list

# You should see: lark-dashboard
```

#### 4. Use with Claude

```
Create a sales dashboard with:
- Monthly revenue chart
- Top customers table
- Key metrics overview
```

### Environment Configuration

#### Option 1: Direct in Config

```json
{
  "mcpServers": {
    "lark-dashboard": {
      "command": "lark-dashboard-mcp",
      "env": {
        "LARK_APP_ID": "cli_xxx",
        "LARK_APP_SECRET": "xxx",
        "LARK_DEFAULT_BASE_ID": "bascXXX"
      }
    }
  }
}
```

#### Option 2: Reference Environment Variables

```json
{
  "mcpServers": {
    "lark-dashboard": {
      "command": "lark-dashboard-mcp",
      "env": {
        "LARK_APP_ID": "${LARK_APP_ID}",
        "LARK_APP_SECRET": "${LARK_APP_SECRET}"
      }
    }
  }
}
```

Then set in your shell:

```bash
export LARK_APP_ID="cli_xxx"
export LARK_APP_SECRET="xxx"
```

### Available MCP Tools

The MCP server exposes these tools to Claude:

#### `create_dashboard`
Create a complete dashboard from specification.

```typescript
{
  name: string;
  description?: string;
  views: Array<{
    name: string;
    blocks: Array<Block>;
  }>;
}
```

#### `add_view`
Add a view to an existing dashboard.

```typescript
{
  dashboardId: string;
  name: string;
  blocks: Array<Block>;
}
```

#### `update_view`
Update an existing view.

```typescript
{
  dashboardId: string;
  viewId: string;
  blocks: Array<Block>;
}
```

#### `get_dashboard_info`
Get dashboard information.

```typescript
{
  dashboardId: string;
}
```

## MCP Server Setup

### Starting the Server

#### Global Installation

```bash
# Install globally
npm install -g @hypelab/lark-dashboard-sdk

# Start server
lark-dashboard-mcp
```

#### Local Installation

```bash
# Install in project
npm install @hypelab/lark-dashboard-sdk

# Start server
npx lark-dashboard-mcp
```

#### With npx (No Installation)

```bash
npx @hypelab/lark-dashboard-sdk
```

### Server Configuration

#### Environment Variables

```bash
# Required
LARK_APP_ID=cli_xxx
LARK_APP_SECRET=xxx

# Optional
LARK_DEFAULT_BASE_ID=bascXXX
LARK_API_TIMEOUT=30000
LARK_DEBUG=true
```

#### Configuration File

Create `.lark-dashboard.json`:

```json
{
  "appId": "cli_xxx",
  "appSecret": "xxx",
  "defaultBaseId": "bascXXX",
  "timeout": 30000,
  "debug": false
}
```

### Server Options

```bash
# Standard mode
lark-dashboard-mcp

# Debug mode
lark-dashboard-mcp --debug

# Custom config
lark-dashboard-mcp --config /path/to/config.json

# Help
lark-dashboard-mcp --help
```

## Lark MCP Integration

Combine with the official Lark MCP server for full functionality.

### Setup Both Servers

```json
{
  "mcpServers": {
    "lark": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-lark"],
      "env": {
        "LARK_APP_ID": "cli_xxx",
        "LARK_APP_SECRET": "xxx"
      }
    },
    "lark-dashboard": {
      "command": "lark-dashboard-mcp",
      "env": {
        "LARK_APP_ID": "cli_xxx",
        "LARK_APP_SECRET": "xxx"
      }
    }
  }
}
```

### Chaining Operations

Use both servers together:

```
1. Use lark-mcp to query data from a bitable
2. Use lark-dashboard to create a dashboard visualizing that data
```

Example conversation:

```
User: Get sales data from my Sales table,
      then create a dashboard showing top products

Claude: [Uses lark-mcp to query data]
        [Uses lark-dashboard to create visualization]
```

### Common Workflows

#### Workflow 1: Data to Dashboard

```
1. Query data with lark-mcp
2. Process/aggregate data
3. Create dashboard with lark-dashboard
4. Share dashboard URL
```

#### Workflow 2: Scheduled Dashboards

```
1. Set up cron job
2. Query latest data
3. Update existing dashboard
4. Send notifications
```

#### Workflow 3: Interactive Dashboards

```
1. Create base dashboard
2. User requests modifications
3. Update views dynamically
4. Iterate based on feedback
```

## Workflow Examples

### Example 1: Sales Dashboard from Data

```typescript
import { DashboardBuilder } from '@hypelab/lark-dashboard-sdk';
import { LarkClient } from '@lark-mcp/client';

async function createSalesDashboard() {
  // 1. Get data from Lark
  const lark = new LarkClient({
    appId: process.env.LARK_APP_ID!,
    appSecret: process.env.LARK_APP_SECRET!
  });

  const salesData = await lark.bitable.getRecords({
    baseId: 'bascXXX',
    tableId: 'tblXXX'
  });

  // 2. Process data
  const totalRevenue = salesData.reduce(
    (sum, record) => sum + record.fields.amount,
    0
  );

  // 3. Create dashboard
  const dashboard = new DashboardBuilder()
    .setName('Sales Dashboard')
    .addView('overview')
      .addMetricsBlock()
        .addMetric('Total Revenue', `$${totalRevenue}`)
        .end()
      .addChartBlock()
        .setDataSource('bascXXX', 'tblXXX')
        .setChartType('line')
        .end();

  const result = await dashboard.create({
    appId: process.env.LARK_APP_ID!,
    appSecret: process.env.LARK_APP_SECRET!
  });

  return result.url;
}
```

### Example 2: Automated Report Generation

```typescript
import { DashboardBuilder } from '@hypelab/lark-dashboard-sdk';
import cron from 'node-cron';

// Generate daily report at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Generating daily dashboard...');

  const dashboard = new DashboardBuilder()
    .setName(`Daily Report - ${new Date().toLocaleDateString()}`);

  // Add metrics
  dashboard.addView('daily-metrics')
    .addMetricsBlock()
      .addMetric('Today Users', await getUserCount())
      .addMetric('Revenue', await getRevenue())
      .end();

  const result = await dashboard.create({
    appId: process.env.LARK_APP_ID!,
    appSecret: process.env.LARK_APP_SECRET!
  });

  // Send notification
  await sendNotification(`Dashboard ready: ${result.url}`);
});
```

### Example 3: Multi-Source Dashboard

```typescript
async function createMultiSourceDashboard() {
  const dashboard = new DashboardBuilder()
    .setName('Business Overview');

  // Sales data
  dashboard.addView('sales')
    .setName('Sales')
    .addChartBlock()
      .setDataSource('bascSales', 'tblOrders')
      .end();

  // Marketing data
  dashboard.addView('marketing')
    .setName('Marketing')
    .addChartBlock()
      .setDataSource('bascMarketing', 'tblCampaigns')
      .end();

  // Finance data
  dashboard.addView('finance')
    .setName('Finance')
    .addChartBlock()
      .setDataSource('bascFinance', 'tblBudget')
      .end();

  return await dashboard.create({
    appId: process.env.LARK_APP_ID!,
    appSecret: process.env.LARK_APP_SECRET!
  });
}
```

### Example 4: Real-time Dashboard Updates

```typescript
import { DashboardBuilder } from '@hypelab/lark-dashboard-sdk';

class RealtimeDashboard {
  private dashboardId: string;
  private config: any;

  async initialize() {
    const dashboard = new DashboardBuilder()
      .setName('Real-time Metrics');

    const result = await dashboard.create(this.config);
    this.dashboardId = result.dashboardId;
  }

  async update(metrics: any) {
    // Update existing dashboard
    const dashboard = new DashboardBuilder()
      .setExistingDashboard(this.dashboardId);

    dashboard.addView('metrics')
      .addMetricsBlock()
        .addMetric('Current Users', metrics.users.toString())
        .addMetric('Active Sessions', metrics.sessions.toString())
        .end();

    await dashboard.update(this.config);
  }

  startPolling(intervalMs: number = 5000) {
    setInterval(async () => {
      const metrics = await this.fetchMetrics();
      await this.update(metrics);
    }, intervalMs);
  }
}
```

## Advanced Usage

### Custom MCP Tools

Extend the MCP server with custom tools:

```typescript
import { MCPServer } from '@hypelab/lark-dashboard-sdk';

const server = new MCPServer();

// Add custom tool
server.addTool({
  name: 'create_sales_dashboard',
  description: 'Create a sales dashboard template',
  inputSchema: {
    type: 'object',
    properties: {
      period: { type: 'string' }
    }
  },
  handler: async (input) => {
    // Custom dashboard creation logic
    return {
      url: 'https://...',
      dashboardId: 'xxx'
    };
  }
});

server.start();
```

### Template System

Create reusable templates:

```typescript
import { DashboardTemplate } from '@hypelab/lark-dashboard-sdk';

// Define template
const salesTemplate = new DashboardTemplate()
  .setName('Sales Dashboard Template')
  .addView('metrics')
    .addMetricsBlock()
      .addMetric('Revenue', '{{revenue}}')
      .addMetric('Orders', '{{orders}}')
      .end();

// Use template
const dashboard = salesTemplate.instantiate({
  revenue: '$125K',
  orders: '1,234'
});

await dashboard.create(config);
```

### Webhook Integration

Trigger dashboard updates from webhooks:

```typescript
import express from 'express';
import { DashboardBuilder } from '@hypelab/lark-dashboard-sdk';

const app = express();

app.post('/webhook/update-dashboard', async (req, res) => {
  const { dashboardId, data } = req.body;

  const dashboard = new DashboardBuilder()
    .setExistingDashboard(dashboardId);

  // Update with webhook data
  dashboard.addView('updates')
    .addTextBlock()
      .setContent(`Updated at ${new Date().toISOString()}`)
      .end();

  await dashboard.update(config);

  res.json({ success: true });
});

app.listen(3000);
```

### Error Handling

Robust error handling:

```typescript
import { DashboardBuilder, DashboardError } from '@hypelab/lark-dashboard-sdk';

async function createDashboardWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const dashboard = new DashboardBuilder()
        .setName('My Dashboard');

      return await dashboard.create(config);
    } catch (error) {
      if (error instanceof DashboardError) {
        if (error.code === 'RATE_LIMIT') {
          await sleep(1000 * Math.pow(2, i)); // Exponential backoff
          continue;
        }
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Performance Optimization

```typescript
// Batch operations
const dashboard = new DashboardBuilder()
  .setName('Optimized Dashboard')
  .setBatchMode(true); // Batch API calls

// Add multiple views
for (const viewConfig of viewConfigs) {
  dashboard.addView(viewConfig.name);
}

// Execute all at once
await dashboard.create(config);
```

## Best Practices

1. **Use Environment Variables**: Never hardcode credentials
2. **Error Handling**: Always wrap API calls in try-catch
3. **Rate Limiting**: Implement exponential backoff
4. **Caching**: Cache dashboard IDs for updates
5. **Validation**: Validate input before creating dashboards
6. **Logging**: Use debug mode during development
7. **Testing**: Test with small dashboards first

## Troubleshooting

### MCP Server Not Found

```bash
# Check installation
npm list -g @hypelab/lark-dashboard-sdk

# Reinstall
npm install -g @hypelab/lark-dashboard-sdk
```

### Claude Can't Connect

```bash
# Verify config
cat ~/.claude.json

# Check server manually
lark-dashboard-mcp --debug
```

### Authentication Errors

```bash
# Verify credentials
echo $LARK_APP_ID
echo $LARK_APP_SECRET

# Test with curl
curl -X POST https://open.feishu.cn/open-api/auth/v3/tenant_access_token/internal \
  -H "Content-Type: application/json" \
  -d "{\"app_id\":\"$LARK_APP_ID\",\"app_secret\":\"$LARK_APP_SECRET\"}"
```

## Support

- **GitHub Issues**: [Report issues](https://github.com/hypelab/lark-dashboard-sdk/issues)
- **Documentation**: [Full docs](https://github.com/hypelab/lark-dashboard-sdk)
- **Examples**: Check `examples/` directory
