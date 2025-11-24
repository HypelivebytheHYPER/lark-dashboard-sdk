# Quick Start Guide

Get started with Lark Dashboard SDK in 5 minutes.

## Installation

```bash
npm install @hypelab/lark-dashboard-sdk
```

## Prerequisites

1. **Lark/Feishu Account**: Sign up at [open.feishu.cn](https://open.feishu.cn)

2. **Create an App**: Get your app credentials
   - App ID
   - App Secret

3. **Set Environment Variables**:
```bash
export LARK_APP_ID="your-app-id"
export LARK_APP_SECRET="your-app-secret"
```

## Your First Dashboard (5 minutes)

### Step 1: Create a Simple Dashboard

Create a file `my-dashboard.ts`:

```typescript
import { DashboardBuilder } from '@hypelab/lark-dashboard-sdk';

async function createDashboard() {
  // Initialize builder
  const dashboard = new DashboardBuilder()
    .setName('My First Dashboard')
    .setDescription('Created with Lark Dashboard SDK');

  // Add a metrics view
  dashboard.addView('metrics')
    .setName('Key Metrics')
    .addMetricsBlock()
      .addMetric('Total Users', '1,234', '+12%')
      .addMetric('Revenue', '$45.6K', '+8.5%')
      .addMetric('Active Projects', '42', '+3')
      .end();

  // Create the dashboard
  const result = await dashboard.create({
    appId: process.env.LARK_APP_ID!,
    appSecret: process.env.LARK_APP_SECRET!
  });

  console.log('Dashboard created!');
  console.log('URL:', result.url);
}

createDashboard();
```

### Step 2: Run It

```bash
npx ts-node my-dashboard.ts
```

### Step 3: View Your Dashboard

Open the URL printed in the console to see your dashboard!

## Basic Usage Examples

### Text Block

```typescript
dashboard.addView('overview')
  .addTextBlock()
    .setTitle('Welcome')
    .setContent('This is your dashboard overview')
    .end();
```

### Chart Block

```typescript
dashboard.addView('analytics')
  .addChartBlock()
    .setChartType('line')
    .setDataSource('table123', 'view456')
    .setTitle('Monthly Trends')
    .end();
```

### Layout with Multiple Blocks

```typescript
dashboard.addView('home')
  .addLayoutBlock('row')
    .addMetricsBlock()
      .addMetric('Users', '1,234')
      .end()
    .addChartBlock()
      .setChartType('bar')
      .end()
    .end();
```

## Configuration Options

### Using Environment Variables

Create a `.env` file:

```bash
LARK_APP_ID=cli_xxx
LARK_APP_SECRET=xxx
LARK_DASHBOARD_NAME=My Dashboard
```

### Using Configuration Object

```typescript
const config = {
  appId: 'cli_xxx',
  appSecret: 'xxx',
  defaultBaseId: 'bascXXX',
  timeout: 30000
};

const result = await dashboard.create(config);
```

## MCP Server Integration

Use with Claude Code for AI-powered dashboard creation.

### Step 1: Start MCP Server

```bash
npx lark-dashboard-mcp
```

### Step 2: Configure Claude

Add to `~/.claude.json`:

```json
{
  "mcpServers": {
    "lark-dashboard": {
      "command": "npx",
      "args": ["lark-dashboard-mcp"],
      "env": {
        "LARK_APP_ID": "your-app-id",
        "LARK_APP_SECRET": "your-app-secret"
      }
    }
  }
}
```

### Step 3: Use with Claude

```
Create a sales dashboard with:
- Revenue metrics
- Monthly sales chart
- Top products table
```

Claude will use the MCP server to create your dashboard automatically!

## Common Patterns

### Dashboard with Multiple Views

```typescript
const dashboard = new DashboardBuilder()
  .setName('Business Dashboard');

// Overview view
dashboard.addView('overview')
  .setName('Overview')
  .addMetricsBlock()
    .addMetric('Total', '1,234')
    .end();

// Analytics view
dashboard.addView('analytics')
  .setName('Analytics')
  .addChartBlock()
    .setChartType('line')
    .end();

await dashboard.create(config);
```

### Connecting to Data Sources

```typescript
dashboard.addView('data')
  .addChartBlock()
    .setDataSource('bascXXX', 'tblXXX')
    .setChartType('bar')
    .configureXAxis('date')
    .configureYAxis('value')
    .end();
```

### Custom Styling

```typescript
dashboard.addView('styled')
  .addTextBlock()
    .setTitle('Styled Block')
    .setStyle({
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '8px'
    })
    .end();
```

## Next Steps

### Learn More

- **[API Documentation](../API.md)** - Complete API reference
- **[Examples](../examples/)** - More complete examples
- **[Integration Guide](INTEGRATION_GUIDE.md)** - Advanced integrations

### Try Examples

```bash
# Basic dashboard
npm run example:basic

# Complete dashboard with all features
npm run example:complete

# Multi-source data dashboard
npm run example:multi-source

# Real-time dashboard
npm run example:realtime
```

### Advanced Features

1. **Real-time Updates**: Refresh data automatically
2. **Custom Templates**: Create reusable templates
3. **Data Transformations**: Process data before display
4. **Webhooks**: Trigger updates from external events

## Troubleshooting

### Common Issues

**Error: "Invalid credentials"**
```bash
# Check your environment variables
echo $LARK_APP_ID
echo $LARK_APP_SECRET

# Make sure they're set correctly
export LARK_APP_ID="cli_xxx"
export LARK_APP_SECRET="xxx"
```

**Error: "Base not found"**
```typescript
// Make sure the base ID is correct
dashboard.setBaseId('bascXXX'); // Get from Lark UI
```

**Error: "Permission denied"**
- Check app permissions in Lark admin console
- Ensure app has access to create dashboards
- Verify app is enabled

### Debug Mode

```typescript
const dashboard = new DashboardBuilder()
  .setDebug(true); // Enable verbose logging
```

### Get Help

- **GitHub Issues**: [Report bugs](https://github.com/hypelab/lark-dashboard-sdk/issues)
- **Documentation**: [Full docs](https://github.com/hypelab/lark-dashboard-sdk)
- **Examples**: Check the `examples/` directory

## Performance Tips

1. **Batch Operations**: Create multiple blocks in one view
2. **Use Data Sources**: Connect to existing tables instead of creating new ones
3. **Limit API Calls**: Use builder pattern to minimize requests
4. **Cache Results**: Store dashboard IDs for updates

## Best Practices

1. **Naming**: Use descriptive names for views and blocks
2. **Organization**: Group related blocks in the same view
3. **Data Sources**: Connect to existing data when possible
4. **Error Handling**: Always wrap API calls in try-catch
5. **Configuration**: Use environment variables for credentials

## Example: Complete Dashboard

```typescript
import { DashboardBuilder } from '@hypelab/lark-dashboard-sdk';

async function main() {
  try {
    const dashboard = new DashboardBuilder()
      .setName('Sales Dashboard')
      .setDescription('Q4 2024 Sales Performance');

    // Metrics view
    dashboard.addView('metrics')
      .setName('Key Metrics')
      .addMetricsBlock()
        .addMetric('Revenue', '$125K', '+15%')
        .addMetric('Orders', '1,234', '+8%')
        .addMetric('Customers', '456', '+12%')
        .end();

    // Charts view
    dashboard.addView('charts')
      .setName('Analytics')
      .addChartBlock()
        .setTitle('Monthly Revenue')
        .setChartType('line')
        .setDataSource('baseId', 'tableId')
        .end()
      .addChartBlock()
        .setTitle('Top Products')
        .setChartType('bar')
        .end();

    // Create dashboard
    const result = await dashboard.create({
      appId: process.env.LARK_APP_ID!,
      appSecret: process.env.LARK_APP_SECRET!
    });

    console.log('✓ Dashboard created:', result.url);
  } catch (error) {
    console.error('Failed to create dashboard:', error);
  }
}

main();
```

## What's Next?

Now that you've created your first dashboard:

1. Explore the [API Documentation](../API.md) for all features
2. Check out [complete examples](../examples/)
3. Learn about [MCP integration](INTEGRATION_GUIDE.md)
4. Join the community and share your dashboards!

Happy dashboard building!
