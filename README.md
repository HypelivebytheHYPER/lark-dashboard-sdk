# Lark Dashboard SDK

[![npm version](https://img.shields.io/npm/v/@hypelab/lark-dashboard-sdk.svg)](https://www.npmjs.com/package/@hypelab/lark-dashboard-sdk)
[![npm downloads](https://img.shields.io/npm/dm/@hypelab/lark-dashboard-sdk.svg)](https://www.npmjs.com/package/@hypelab/lark-dashboard-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Stars](https://img.shields.io/github/stars/HypelivebytheHYPER/lark-dashboard-sdk.svg)](https://github.com/HypelivebytheHYPER/lark-dashboard-sdk/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/HypelivebytheHYPER/lark-dashboard-sdk.svg)](https://github.com/HypelivebytheHYPER/lark-dashboard-sdk/issues)
[![Node Version](https://img.shields.io/node/v/@hypelab/lark-dashboard-sdk.svg)](https://nodejs.org)
[![Package Size](https://img.shields.io/bundlephobia/minzip/@hypelab/lark-dashboard-sdk.svg)](https://bundlephobia.com/package/@hypelab/lark-dashboard-sdk)
[![Build Status](https://img.shields.io/github/actions/workflow/status/HypelivebytheHYPER/lark-dashboard-sdk/ci.yml?branch=main)](https://github.com/HypelivebytheHYPER/lark-dashboard-sdk/actions)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-brightgreen.svg)](https://modelcontextprotocol.io)

Production-ready TypeScript SDK for creating and managing Lark/Feishu dashboards via REST API with Model Context Protocol (MCP) server support.

## Features

- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Fluent API**: Intuitive builder pattern for creating dashboard blocks
- **7 Block Types**: Charts, Metrics, Views, Text, Lists, Tab Pages, and Filters
- **MCP Server**: Native Claude Code integration via Model Context Protocol
- **Production Ready**: Error handling, retries, logging, and validation
- **Batch Operations**: Efficiently create multiple blocks at once
- **2025 Dashboard Features**: Latest Lark dashboard capabilities

## Installation

```bash
npm install @hypelab/lark-dashboard-sdk
```

## Quick Start

### Basic Usage

```typescript
import { LarkDashboardClient, ChartBlockBuilder, AggregationType } from '@hypelab/lark-dashboard-sdk';

const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  region: 'sg', // 'sg' | 'cn' | 'us'
  logging: true,
});

// Create a dashboard
const dashboardId = await client.createDashboard({
  name: 'Sales Dashboard',
  appToken: 'YOUR_APP_TOKEN',
});

// Add a bar chart
const chartBlock = ChartBlockBuilder.bar()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
  .title('Revenue by Category')
  .colors(['#3b82f6', '#10b981', '#f59e0b'])
  .build();

await client.addBlock('YOUR_APP_TOKEN', dashboardId, chartBlock);
```

### Available Block Types

#### 1. Chart Blocks

```typescript
import { ChartBlockBuilder, ChartType, AggregationType } from '@hypelab/lark-dashboard-sdk';

// Bar Chart
const barChart = ChartBlockBuilder.bar()
  .dataSource(appToken, tableId)
  .xAxis({ fieldName: 'Month' })
  .yAxis([
    { fieldName: 'Sales', aggregation: AggregationType.SUM, label: 'Total Sales' },
    { fieldName: 'Orders', aggregation: AggregationType.COUNT, label: 'Order Count' }
  ])
  .title('Monthly Sales Performance')
  .showLegend(true)
  .build();

// Line Chart
const lineChart = ChartBlockBuilder.line()
  .dataSource(appToken, tableId)
  .xAxis({ fieldName: 'Date' })
  .yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
  .build();

// Pie Chart
const pieChart = ChartBlockBuilder.pie()
  .dataSource(appToken, tableId)
  .series({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
  .build();
```

#### 2. Metrics Blocks

```typescript
import { MetricsBlockBuilder, AggregationType } from '@hypelab/lark-dashboard-sdk';

const metrics = new MetricsBlockBuilder()
  .dataSource(appToken, tableId)
  .fieldName('Revenue')
  .aggregation(AggregationType.SUM)
  .title('Total Revenue')
  .prefix('$')
  .decimals(2)
  .trendComparison(30, 'days')
  .build();
```

#### 3. View Blocks

```typescript
import { ViewBlockBuilder, ViewType } from '@hypelab/lark-dashboard-sdk';

const tableView = ViewBlockBuilder.table()
  .dataSource(appToken, tableId, viewId)
  .title('Customer List')
  .showToolbar(true)
  .height(400)
  .build();

const kanbanView = ViewBlockBuilder.kanban()
  .dataSource(appToken, tableId, viewId)
  .build();
```

#### 4. Text Blocks

```typescript
import { TextBlockBuilder } from '@hypelab/lark-dashboard-sdk';

const heading = new TextBlockBuilder()
  .heading('Dashboard Overview')
  .alignment('center')
  .build();

const paragraph = new TextBlockBuilder()
  .paragraph('Welcome to the sales dashboard.')
  .build();
```

## MCP Server Usage

The SDK includes a Model Context Protocol server for Claude Code integration.

### Setup

Add to your `~/.claude.json` or Claude Code configuration:

```json
{
  "mcpServers": {
    "lark-dashboard": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@hypelab/lark-dashboard-sdk"],
      "env": {
        "LARK_API_KEY": "your-api-key-here",
        "LARK_REGION": "sg"
      }
    }
  }
}
```

### Available MCP Tools

- `create_dashboard` - Create a new dashboard
- `create_chart_block` - Add chart visualizations
- `create_metrics_block` - Add KPI metrics
- `create_view_block` - Add table/kanban views
- `create_text_block` - Add text content
- `list_dashboards` - List all dashboards
- `delete_dashboard` - Remove dashboards

### Usage with Claude Code

```
Create a sales dashboard with:
- Bar chart showing revenue by month
- KPI card for total revenue
- Table view of recent orders
```

Claude will use the MCP tools to create the dashboard automatically.

## Configuration

### Client Options

```typescript
const client = new LarkDashboardClient({
  apiKey: string;          // Required: Lark API key
  region?: 'sg' | 'cn' | 'us';  // Default: 'sg'
  apiUrl?: string;         // Optional: Custom API URL
  logging?: boolean;       // Default: false
  timeout?: number;        // Default: 30000ms
  maxRetries?: number;     // Default: 3
  retryDelay?: number;     // Default: 1000ms
});
```

### Environment Variables

```bash
LARK_API_KEY=your-api-key
LARK_REGION=sg
LARK_LOGGING=true
```

## Advanced Features

### Batch Operations

```typescript
const blocks = [
  ChartBlockBuilder.bar().dataSource(appToken, tableId).build(),
  MetricsBlockBuilder.sum('Revenue').dataSource(appToken, tableId).build(),
  ViewBlockBuilder.table().dataSource(appToken, tableId, viewId).build(),
];

const results = await client.batchCreateBlocks(appToken, blocks);
```

### Filtering

```typescript
import { FilterOperator, FilterConjunction } from '@hypelab/lark-dashboard-sdk';

const chart = ChartBlockBuilder.bar()
  .dataSource(appToken, tableId)
  .filters(FilterConjunction.AND, [
    { fieldName: 'Status', operator: FilterOperator.IS, value: 'Active' },
    { fieldName: 'Revenue', operator: FilterOperator.GT, value: 1000 }
  ])
  .build();
```

### Error Handling

```typescript
import { ValidationError } from '@hypelab/lark-dashboard-sdk';

try {
  await client.addBlock(appToken, dashboardId, block);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message);
  } else {
    console.error('API error:', error);
  }
}
```

## API Reference

### LarkDashboardClient

- `createDashboard(dashboard: Dashboard): Promise<string>`
- `addBlock(appToken: string, dashboardId: string, block: DashboardBlock): Promise<string>`
- `updateBlock(appToken: string, blockId: string, block: Partial<DashboardBlock>): Promise<void>`
- `deleteBlock(appToken: string, blockId: string): Promise<void>`
- `listBlocks(appToken: string): Promise<DashboardBlock[]>`
- `batchCreateBlocks(appToken: string, blocks: DashboardBlock[]): Promise<BatchOperationResult[]>`

### Builders

- `ChartBlockBuilder` - Create chart visualizations
- `MetricsBlockBuilder` - Create KPI metrics
- `ViewBlockBuilder` - Create data views
- `TextBlockBuilder` - Create text blocks
- `ListBlockBuilder` - Create list blocks (2025)
- `TabPageBlockBuilder` - Create tab pages (2025)

## Examples

See the `/examples` directory for complete examples:

- `basic-dashboard.ts` - Simple dashboard creation
- `complete-dashboard.ts` - Full-featured dashboard
- `multi-source-dashboard.ts` - Multiple data sources
- `realtime-dashboard.ts` - Real-time data updates

## TypeScript Support

The SDK is written in TypeScript and provides comprehensive type definitions:

```typescript
import type {
  DashboardBlock,
  ChartConfig,
  MetricsConfig,
  ViewConfig,
  ChartType,
  ViewType,
  AggregationType,
} from '@hypelab/lark-dashboard-sdk';
```

## Requirements

- Node.js >= 16.0.0
- TypeScript >= 5.0.0 (for TypeScript projects)

## Troubleshooting

### Common Issues

**Authentication Errors**
- Verify your LARK_API_KEY is correct
- Check API key permissions in Lark admin console
- Ensure region matches your Lark workspace ('sg', 'cn', or 'us')

**Network Errors**
- Check firewall settings
- Verify network connectivity to Lark API
- Try increasing timeout in client config

**Validation Errors**
- Ensure required fields are provided
- Check data types match API expectations
- Verify field names exist in your Lark tables

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- GitHub Issues: https://github.com/hypelab/lark-dashboard-sdk/issues
- Email: dev@hypelab.com

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.
