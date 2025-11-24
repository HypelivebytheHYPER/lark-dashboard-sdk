# Quick Reference Guide

Fast reference for common operations with Lark Dashboard SDK.

## Installation

```bash
npm install lark-dashboard-sdk
```

## Setup

```typescript
import { LarkDashboardClient } from 'lark-dashboard-sdk';

const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  region: 'sg',  // 'sg', 'cn', or 'us'
  logging: true,
});
```

## Chart Types

### Bar Chart
```typescript
import { ChartBlockBuilder, AggregationType } from 'lark-dashboard-sdk';

const chart = ChartBlockBuilder.bar()
  .dataSource('appToken', 'tableId')
  .xAxis('Category')
  .yAxis('Revenue', AggregationType.SUM)
  .title('Revenue by Category')
  .build();
```

### Line Chart
```typescript
const chart = ChartBlockBuilder.line()
  .dataSource('appToken', 'tableId')
  .xAxis('Date')
  .yAxis('Sales', AggregationType.COUNT)
  .title('Sales Trend')
  .build();
```

### Pie Chart
```typescript
const chart = ChartBlockBuilder.pie()
  .dataSource('appToken', 'tableId')
  .series('Category', AggregationType.COUNT)
  .title('Distribution')
  .build();
```

### Multi-Axis Chart
```typescript
const chart = ChartBlockBuilder.column()
  .dataSource('appToken', 'tableId')
  .xAxis('Month')
  .yAxis('Revenue', AggregationType.SUM, 'Revenue')
  .yAxis('Orders', AggregationType.COUNT, 'Orders')
  .groupBy('Category')
  .title('Performance')
  .build();
```

### Chart with Filters
```typescript
import { FilterOperator } from 'lark-dashboard-sdk';

const chart = ChartBlockBuilder.bar()
  .dataSource('appToken', 'tableId')
  .xAxis('Product')
  .yAxis('Revenue', AggregationType.SUM)
  .addFilter('Status', FilterOperator.IS, 'Active')
  .addFilter('Revenue', FilterOperator.IS_GREATER, 1000)
  .title('Active Products')
  .build();
```

## View Types

### Grid View
```typescript
import { ViewBlockBuilder } from 'lark-dashboard-sdk';

const view = ViewBlockBuilder.grid()
  .dataSource('appToken', 'tableId')
  .title('All Records')
  .toolbar(true)
  .height(400)
  .build();
```

### Kanban View
```typescript
const view = ViewBlockBuilder.kanban()
  .dataSource('appToken', 'tableId')
  .title('Task Board')
  .build();
```

## Metrics

### Simple Count
```typescript
import { MetricsBlockBuilder } from 'lark-dashboard-sdk';

const metrics = MetricsBlockBuilder.count('ID')
  .dataSource('appToken', 'tableId')
  .title('Total Records')
  .build();
```

### Sum with Formatting
```typescript
const metrics = MetricsBlockBuilder.sum('Revenue')
  .dataSource('appToken', 'tableId')
  .title('Total Revenue')
  .prefix('$')
  .decimals(2)
  .build();
```

### With Conditional Formatting
```typescript
const metrics = MetricsBlockBuilder.average('Score')
  .dataSource('appToken', 'tableId')
  .title('Average Score')
  .suffix('%')
  .addConditionalFormat(FilterOperator.IS_GREATER_EQUAL, 80, '#22c55e')
  .addConditionalFormat(FilterOperator.IS_GREATER_EQUAL, 50, '#f59e0b')
  .addConditionalFormat(FilterOperator.IS_LESS, 50, '#ef4444')
  .build();
```

## Layout

### Two-Column Layout
```typescript
import { LayoutBlockBuilder } from 'lark-dashboard-sdk';

const layout = LayoutBlockBuilder.twoColumn()
  .gap(20)
  .padding(15)
  .build();
```

### Custom Layout
```typescript
const layout = new LayoutBlockBuilder()
  .addColumn(3, ['block-id-1'])
  .addColumn(9, ['block-id-2', 'block-id-3'])
  .gap(16)
  .build();
```

## Text

### Heading
```typescript
import { TextBlockBuilder } from 'lark-dashboard-sdk';

const text = TextBlockBuilder.heading('Dashboard Title', 28)
  .alignment('center')
  .backgroundColor('#f8fafc')
  .padding(20)
  .build();
```

### Formatted Text
```typescript
const text = new TextBlockBuilder()
  .addBold('Important: ')
  .addText('Regular text ')
  .addItalic('italic ')
  .addLink('link', 'https://example.com')
  .alignment('left')
  .build();
```

## Operations

### Create Block
```typescript
const result = await client.createBlock('appToken', block);
console.log('Block ID:', result.block_id);
```

### Create Multiple Blocks
```typescript
const results = await client.batchCreateBlocks('appToken', [
  block1,
  block2,
  block3,
]);

results.forEach((result, index) => {
  if (result.success) {
    console.log(`Block ${index + 1}: ${result.blockId}`);
  }
});
```

### Update Block
```typescript
await client.updateBlock('appToken', 'blockId', updatedBlock);
```

### Delete Block
```typescript
await client.deleteBlock('appToken', 'blockId');
```

### Create Complete Dashboard
```typescript
const dashboard = {
  name: 'Sales Dashboard',
  appToken: 'appToken',
  blocks: [
    TextBlockBuilder.heading('Dashboard').build(),
    MetricsBlockBuilder.sum('Revenue').dataSource('app', 'table').build(),
    ChartBlockBuilder.bar().dataSource('app', 'table').build(),
  ],
};

const results = await client.createDashboard(dashboard);
```

## Aggregation Types

```typescript
import { AggregationType } from 'lark-dashboard-sdk';

AggregationType.COUNT         // Count records
AggregationType.COUNT_ALL     // Count all (including empty)
AggregationType.SUM           // Sum values
AggregationType.AVG           // Average
AggregationType.MAX           // Maximum
AggregationType.MIN           // Minimum
AggregationType.EMPTY         // Count empty
AggregationType.FILLED        // Count filled
AggregationType.UNIQUE        // Count unique
AggregationType.PERCENT_EMPTY // Percentage empty
AggregationType.PERCENT_FILLED // Percentage filled
```

## Filter Operators

```typescript
import { FilterOperator } from 'lark-dashboard-sdk';

FilterOperator.IS                 // Equals
FilterOperator.IS_NOT             // Not equals
FilterOperator.CONTAINS           // Contains text
FilterOperator.DOES_NOT_CONTAIN   // Doesn't contain
FilterOperator.IS_EMPTY           // Is empty
FilterOperator.IS_NOT_EMPTY       // Is not empty
FilterOperator.IS_GREATER         // Greater than
FilterOperator.IS_GREATER_EQUAL   // Greater or equal
FilterOperator.IS_LESS            // Less than
FilterOperator.IS_LESS_EQUAL      // Less or equal
```

## Colors

```typescript
import { DEFAULT_COLORS, generateChartColors } from 'lark-dashboard-sdk';

// Use default palettes
DEFAULT_COLORS.primary    // Blue tones
DEFAULT_COLORS.success    // Green tones
DEFAULT_COLORS.warning    // Amber tones
DEFAULT_COLORS.danger     // Red tones
DEFAULT_COLORS.info       // Cyan tones
DEFAULT_COLORS.neutral    // Gray tones

// Generate colors
const colors = generateChartColors(5, DEFAULT_COLORS.primary);

// Use in chart
const chart = ChartBlockBuilder.bar()
  .colors(colors)
  .build();
```

## Error Handling

```typescript
import { ValidationError } from 'lark-dashboard-sdk';

try {
  const result = await client.createBlock('appToken', block);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid config:', error.message);
  } else if (error.response) {
    console.error('API error:', error.response.data.msg);
  } else {
    console.error('Network error:', error.message);
  }
}
```

## Environment Variables

```env
LARK_API_KEY=your-api-key
LARK_REGION=sg
LARK_API_URL=https://open.feishu.cn/open-apis
```

## Common Patterns

### KPI Dashboard
```typescript
const blocks = [
  TextBlockBuilder.heading('KPIs').build(),
  MetricsBlockBuilder.sum('Revenue').dataSource('app', 'table').build(),
  MetricsBlockBuilder.count('Orders').dataSource('app', 'table').build(),
  ChartBlockBuilder.line().dataSource('app', 'table').build(),
];

await client.batchCreateBlocks('appToken', blocks);
```

### Sales Dashboard
```typescript
const blocks = [
  TextBlockBuilder.heading('Sales Dashboard').build(),

  // KPIs row
  MetricsBlockBuilder.sum('Revenue').dataSource('app', 'table').build(),
  MetricsBlockBuilder.count('Orders').dataSource('app', 'table').build(),
  MetricsBlockBuilder.average('OrderValue').dataSource('app', 'table').build(),

  // Charts row
  ChartBlockBuilder.bar()
    .dataSource('app', 'table')
    .xAxis('Category')
    .yAxis('Revenue', AggregationType.SUM)
    .build(),

  ChartBlockBuilder.line()
    .dataSource('app', 'table')
    .xAxis('Date')
    .yAxis('Revenue', AggregationType.SUM)
    .build(),
];
```

## TypeScript Types

```typescript
import {
  LarkClientConfig,
  Dashboard,
  DashboardBlock,
  ChartConfig,
  ViewConfig,
  MetricsConfig,
  LayoutConfig,
  TextConfig,
} from 'lark-dashboard-sdk';
```

## More Examples

See `/Users/mdch/lark-dashboard-sdk/examples/complete-dashboard.ts` for a comprehensive example with all block types.

## Documentation

- **README.md** - Getting started
- **API.md** - Complete API reference
- **DEPLOYMENT.md** - Deployment guide
- **PROJECT_COMPLETE.md** - Implementation summary
