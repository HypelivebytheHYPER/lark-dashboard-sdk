# Quick Start Guide - Lark Dashboard SDK

Get started with the Lark Dashboard SDK in 5 minutes!

## Installation

```bash
npm install @hypelab/lark-dashboard-sdk
```

## Basic Usage

### 1. Create a Dashboard Client

```typescript
import { LarkDashboardClient } from '@hypelab/lark-dashboard-sdk';

const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY,
  region: 'sg' // Singapore | China (cn) | US (us)
});
```

### 2. Create Your First Dashboard

```typescript
const dashboard = await client.createDashboard('YOUR_APP_TOKEN', {
  title: '📊 My First Dashboard',
  description: 'Created with Lark Dashboard SDK'
});

console.log('Dashboard created:', dashboard.dashboard_id);
```

### 3. Add a Metrics Block

```typescript
import { MetricsBlockBuilder } from '@hypelab/lark-dashboard-sdk';

const metricsBlock = MetricsBlockBuilder.sum()
  .title('Total Revenue')
  .dataSource('YOUR_TABLE_ID')
  .field('Amount')
  .create();

await client.addBlocks(dashboard.dashboard_id, [metricsBlock]);
```

### 4. Add a Chart Block

```typescript
import { ChartBlockBuilder } from '@hypelab/lark-dashboard-sdk';

const chartBlock = ChartBlockBuilder.barChart()
  .title('Sales by Category')
  .dataSource('YOUR_TABLE_ID')
  .xAxis('Category')
  .series({
    field: 'Sales',
    type: 'bar',
    name: 'Sales Amount'
  })
  .create();

await client.addBlocks(dashboard.dashboard_id, [chartBlock]);
```

## Complete Example

```typescript
import {
  LarkDashboardClient,
  ChartBlockBuilder,
  MetricsBlockBuilder,
  TextBlockBuilder
} from '@hypelab/lark-dashboard-sdk';

async function createSalesDashboard() {
  const client = new LarkDashboardClient({
    apiKey: process.env.LARK_API_KEY,
    region: 'sg'
  });

  // Create dashboard
  const dashboard = await client.createDashboard('YOUR_APP_TOKEN', {
    title: '📈 Sales Dashboard',
    description: 'Real-time sales metrics'
  });

  // Add title block
  const titleBlock = TextBlockBuilder.heading1()
    .text('Q4 2025 Sales Performance')
    .textAlign('center')
    .create();

  // Add metrics
  const revenueBlock = MetricsBlockBuilder.sum()
    .title('Total Revenue')
    .dataSource('sales_table_id')
    .field('Revenue')
    .create();

  const ordersBlock = MetricsBlockBuilder.count()
    .title('Total Orders')
    .dataSource('sales_table_id')
    .create();

  // Add chart
  const trendBlock = ChartBlockBuilder.lineChart()
    .title('Revenue Trend')
    .dataSource('sales_table_id')
    .xAxis('Date')
    .series({
      field: 'Revenue',
      type: 'line',
      name: 'Daily Revenue'
    })
    .create();

  // Add all blocks
  await client.addBlocks(dashboard.dashboard_id, [
    titleBlock,
    revenueBlock,
    ordersBlock,
    trendBlock
  ]);

  return dashboard.dashboard_id;
}

// Run it
createSalesDashboard()
  .then(dashboardId => console.log('Dashboard ready:', dashboardId))
  .catch(err => console.error('Error:', err));
```

## Available Block Types

### Chart Blocks
- `barChart()` - Vertical bar chart
- `columnChart()` - Horizontal bar chart
- `lineChart()` - Line chart
- `areaChart()` - Area chart
- `pieChart()` - Pie chart
- `scatterChart()` - Scatter plot
- `funnelChart()` - Funnel visualization
- `radarChart()` - Radar chart
- `tableChart()` - Data table

### Metrics Blocks
- `sum()` - Sum aggregation
- `average()` - Average value
- `count()` - Record count
- `max()` - Maximum value
- `min()` - Minimum value
- `median()` - Median value
- `percentile()` - Percentile value
- And more...

### View Blocks
- `gridView()` - Grid/table view
- `kanbanView()` - Kanban board
- `galleryView()` - Gallery view
- `ganttView()` - Gantt chart
- `formView()` - Form view

### Text Blocks
- `heading1()`, `heading2()`, `heading3()` - Headings
- `paragraph()` - Regular text
- Formatting: bold, italic, underline, strikethrough, links

### Modern Blocks (2025+)
- `listBlock()` - List visualization with 5 layout styles
- `tabPageBlock()` - Tabbed navigation with 5 layout types
- `filterBlock()` - Advanced filtering
- `calendarBlock()` - Calendar view
- `timelineBlock()` - Timeline visualization

## Configuration Examples

### Set custom colors
```typescript
const block = ChartBlockBuilder.barChart()
  .title('Sales')
  .colors(['#FF6B6B', '#4ECDC4', '#45B7D1'])
  .create();
```

### Add filters
```typescript
const block = ChartBlockBuilder.barChart()
  .title('Filtered Sales')
  .filter({
    field: 'Status',
    operator: 'is',
    value: 'Completed'
  })
  .create();
```

### Configure permissions
```typescript
import { DashboardPermissionBuilder } from '@hypelab/lark-dashboard-sdk';

const permissions = DashboardPermissionBuilder.dashboard()
  .level('VIEW')
  .share('SPECIFIC_USERS')
  .users(['user_id_1', 'user_id_2'])
  .create();
```

## Error Handling

```typescript
try {
  const dashboard = await client.createDashboard(appToken, config);
} catch (error) {
  if (error.name === 'ValidationError') {
    console.error('Invalid configuration:', error.message);
  } else if (error.name === 'NetworkError') {
    console.error('Network error, retrying...', error.message);
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Using with Claude Code

### Add to Claude Code Configuration

```json
{
  "mcpServers": {
    "lark-dashboard": {
      "type": "stdio",
      "command": "lark-dashboard-mcp",
      "env": {
        "LARK_API_KEY": "${LARK_API_KEY}"
      }
    }
  }
}
```

### Use in Claude
```
Create a dashboard showing quarterly sales with revenue metrics and trends
```

Claude will automatically:
1. Create the dashboard
2. Add metrics blocks for revenue
3. Add chart blocks for trends
4. Return the dashboard URL

## Environment Variables

```bash
# Required
export LARK_API_KEY="your_lark_api_key"

# Optional
export LARK_REGION="sg"  # Default: sg
export LOG_LEVEL="info"  # Default: info
```

## Resources

- **GitHub**: https://github.com/hypelab/lark-dashboard-sdk
- **NPM**: https://www.npmjs.com/package/@hypelab/lark-dashboard-sdk
- **Documentation**: https://github.com/hypelab/lark-dashboard-sdk#readme
- **API Reference**: See API.md
- **Examples**: See examples/ folder

## Common Issues

### "Unauthorized" Error
- Verify LARK_API_KEY is correct
- Check API key has dashboard permissions
- Try regenerating the API key

### "Dashboard not found"
- Verify dashboard_id is correct
- Check you have access to the app
- Ensure app_token is valid

### "Invalid block configuration"
- Check required fields (title, dataSource)
- Verify field names exist in table
- Review API.md for field requirements

## Next Steps

1. Read the [API Reference](./API.md)
2. Check [Examples](./examples/)
3. Review [Deployment Guide](./DEPLOYMENT.md)
4. Join the [GitHub Discussions](https://github.com/hypelab/lark-dashboard-sdk/discussions)

## Support

Need help?
- Create an issue: https://github.com/hypelab/lark-dashboard-sdk/issues
- Email: dev@hypelab.com

Happy dashboard building! 🚀
