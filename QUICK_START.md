# Quick Start Guide

## 5-Minute Setup

### 1. Install

```bash
npm install @hypelab/lark-dashboard-sdk
```

### 2. Create Dashboard

```typescript
import { LarkDashboardClient, ChartBlockBuilder, AggregationType } from '@hypelab/lark-dashboard-sdk';

const client = new LarkDashboardClient({
  apiKey: 'your_api_key',
  region: 'sg',
});

// Create dashboard
const dashboardId = await client.createDashboard({
  name: 'My Dashboard',
  appToken: 'YOUR_APP_TOKEN',
});

// Add bar chart
const chart = ChartBlockBuilder.bar()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis('category')
  .yAxis([{ fieldName: 'value', aggregation: AggregationType.SUM }])
  .build();

await client.addBlock('YOUR_APP_TOKEN', dashboardId, chart);

console.log('Dashboard created!');
```

### 3. Use with Claude

Add to `~/.claude.json`:

```json
{
  "mcpServers": {
    "lark-dashboard": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@hypelab/lark-dashboard-sdk"],
      "env": {
        "LARK_API_KEY": "your_key",
        "LARK_REGION": "sg"
      }
    }
  }
}
```

Restart Claude, then:

```
Create a sales dashboard with revenue metrics and product charts
```

## Common Patterns

### Metrics Block

```typescript
import { MetricsBlockBuilder, AggregationType } from '@hypelab/lark-dashboard-sdk';

const metrics = new MetricsBlockBuilder()
  .dataSource(appToken, tableId)
  .field('revenue')
  .aggregation(AggregationType.SUM)
  .title('Total Revenue')
  .prefix('$')
  .decimals(2)
  .build();
```

### Multiple Charts

```typescript
const charts = [
  ChartBlockBuilder.line().dataSource(appToken, tableId).xAxis('date').yAxis([{...}]).build(),
  ChartBlockBuilder.pie().dataSource(appToken, tableId).xAxis('category').yAxis([{...}]).build(),
];

await client.addBlocks(appToken, dashboardId, charts);
```

### Grid View

```typescript
import { ViewBlockBuilder } from '@hypelab/lark-dashboard-sdk';

const grid = ViewBlockBuilder.grid()
  .dataSource(appToken, tableId)
  .title('Orders')
  .showToolbar(true)
  .build();
```

## Testing

Test with HypeLAB Automation base:

```bash
export LARK_API_KEY="your_key"
export LARK_REGION="sg"
node examples/basic-dashboard.js
```

## Documentation

- Full API: `/docs/API.md`
- Installation: `/docs/INSTALLATION.md`
- Troubleshooting: `/docs/TROUBLESHOOTING.md`
- Examples: `/examples/`

## Support

- GitHub Issues
- Email: dev@hypelab.com
- Docs: Full documentation in `/docs`
