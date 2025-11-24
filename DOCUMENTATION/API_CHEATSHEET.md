# API Cheat Sheet

## Quick Reference for All Methods

### Client Initialization

```typescript
import { LarkDashboardClient } from '@hypelab/lark-dashboard-sdk';

const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  region: 'sg',                    // 'sg', 'cn', or 'us'
  logging: true,                   // Optional: debug logging
  timeout: 30000,                  // Optional: 30 seconds
  maxRetries: 3,                   // Optional: auto-retries
  retryDelay: 1000                 // Optional: delay in ms
});
```

---

## Dashboard Methods

### Create Dashboard
```typescript
const dashboardId = await client.createDashboard({
  name: 'Sales Dashboard',
  appToken: 'YOUR_APP_TOKEN',
  description: 'Optional description'
});
```

### List Dashboards
```typescript
const dashboards = await client.listDashboards('YOUR_APP_TOKEN');
// Returns: Array<{id, name, createdAt, blockCount}>
```

### Delete Dashboard
```typescript
await client.deleteDashboard('YOUR_APP_TOKEN', 'DASHBOARD_ID');
```

### Update Dashboard
```typescript
// Coming in v1.1
// Currently update via Lark UI
```

---

## Block Methods

### Add Single Block
```typescript
const blockId = await client.addBlock(
  'YOUR_APP_TOKEN',
  'DASHBOARD_ID',
  blockObject
);
```

### Batch Create Blocks
```typescript
const results = await client.batchCreateBlocks(
  'YOUR_APP_TOKEN',
  [block1, block2, block3]
);
// Returns: Array<{blockId, error?}>
```

### Update Block
```typescript
await client.updateBlock(
  'YOUR_APP_TOKEN',
  'BLOCK_ID',
  updatedBlockConfig
);
```

### Delete Block
```typescript
await client.deleteBlock('YOUR_APP_TOKEN', 'BLOCK_ID');
```

### List Blocks
```typescript
const blocks = await client.listBlocks('YOUR_APP_TOKEN');
```

---

## Chart Builder

### Bar Chart
```typescript
ChartBlockBuilder.bar()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Value', aggregation: AggregationType.SUM }])
  .title('Bar Chart')
  .colors(['#3b82f6'])
  .showLegend(true)
  .build()
```

### Line Chart
```typescript
ChartBlockBuilder.line()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .xAxis({ fieldName: 'Date' })
  .yAxis([
    { fieldName: 'Revenue', aggregation: AggregationType.SUM },
    { fieldName: 'Costs', aggregation: AggregationType.SUM }
  ])
  .title('Trend')
  .smooth(true)
  .build()
```

### Pie Chart
```typescript
ChartBlockBuilder.pie()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .series({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
  .title('Distribution')
  .build()
```

### Scatter Chart
```typescript
ChartBlockBuilder.scatter()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .xAxis({ fieldName: 'X_Field' })
  .yAxis([{ fieldName: 'Y_Field', aggregation: AggregationType.SUM }])
  .title('Correlation')
  .build()
```

### Area Chart
```typescript
ChartBlockBuilder.area()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .xAxis({ fieldName: 'Date' })
  .yAxis([{ fieldName: 'Value', aggregation: AggregationType.SUM }])
  .stacked(true)
  .title('Cumulative')
  .build()
```

### Column Chart
```typescript
ChartBlockBuilder.column()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Value', aggregation: AggregationType.SUM }])
  .title('Columns')
  .build()
```

### Funnel Chart
```typescript
ChartBlockBuilder.funnel()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .series({ fieldName: 'Stage' })
  .yAxis([{ fieldName: 'Count', aggregation: AggregationType.COUNT }])
  .title('Sales Funnel')
  .build()
```

### Radar Chart
```typescript
ChartBlockBuilder.radar()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .series({ fieldName: 'Product' })
  .yAxis([
    { fieldName: 'Quality', aggregation: AggregationType.AVG },
    { fieldName: 'Price', aggregation: AggregationType.AVG },
    { fieldName: 'Features', aggregation: AggregationType.AVG }
  ])
  .title('Comparison')
  .build()
```

### Heatmap Chart (2025)
```typescript
ChartBlockBuilder.heatmap()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .xAxis({ fieldName: 'Hour' })
  .yAxis([{ fieldName: 'Intensity', aggregation: AggregationType.SUM }])
  .title('Pattern')
  .colors(['#2563eb', '#fbbf24'])
  .build()
```

### Treemap Chart (2025)
```typescript
ChartBlockBuilder.treemap()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .series({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Size', aggregation: AggregationType.SUM }])
  .title('Hierarchy')
  .build()
```

### Waterfall Chart (2025)
```typescript
ChartBlockBuilder.waterfall()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .xAxis({ fieldName: 'Stage' })
  .yAxis([{ fieldName: 'Change', aggregation: AggregationType.SUM }])
  .title('Flow')
  .build()
```

### Gauge Chart (2025)
```typescript
ChartBlockBuilder.gauge()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .fieldName('Percentage')
  .aggregation(AggregationType.AVG)
  .title('Progress')
  .minValue(0)
  .maxValue(100)
  .build()
```

### Bubble Chart (2025)
```typescript
ChartBlockBuilder.bubble()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .xAxis({ fieldName: 'X' })
  .yAxis([
    { fieldName: 'Y', aggregation: AggregationType.SUM },
    { fieldName: 'Size', aggregation: AggregationType.SUM }
  ])
  .series({ fieldName: 'Category' })
  .title('Bubbles')
  .build()
```

### Sankey Chart (2025)
```typescript
ChartBlockBuilder.sankey()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .source({ fieldName: 'From' })
  .target({ fieldName: 'To' })
  .yAxis([{ fieldName: 'Flow', aggregation: AggregationType.SUM }])
  .title('Journey')
  .build()
```

### Box Plot Chart (2025)
```typescript
ChartBlockBuilder.boxplot()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Distribution', aggregation: AggregationType.AVG }])
  .title('Statistics')
  .build()
```

### Candlestick Chart (2025)
```typescript
ChartBlockBuilder.candlestick()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .xAxis({ fieldName: 'Date' })
  .open({ fieldName: 'Open' })
  .high({ fieldName: 'High' })
  .low({ fieldName: 'Low' })
  .close({ fieldName: 'Close' })
  .title('Price Movement')
  .build()
```

---

## Metrics Builder

### Basic Metric
```typescript
new MetricsBlockBuilder()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .fieldName('Revenue')
  .aggregation(AggregationType.SUM)
  .title('Total Revenue')
  .build()
```

### With Formatting
```typescript
new MetricsBlockBuilder()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .fieldName('Amount')
  .aggregation(AggregationType.SUM)
  .title('Revenue')
  .prefix('$')
  .decimals(2)
  .suffix('USD')
  .numberFormat('1000')
  .build()
```

### With Color
```typescript
new MetricsBlockBuilder()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .fieldName('Score')
  .aggregation(AggregationType.AVG)
  .title('Average Score')
  .color('#10b981')
  .build()
```

### With Trend
```typescript
new MetricsBlockBuilder()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .fieldName('Revenue')
  .aggregation(AggregationType.SUM)
  .title('Revenue')
  .trendComparison(30, 'days')
  .build()
```

---

## View Builder

### Table View
```typescript
ViewBlockBuilder.table()
  .dataSource('APP_TOKEN', 'TABLE_ID', 'VIEW_ID')
  .title('Data Table')
  .height(400)
  .showToolbar(true)
  .build()
```

### Kanban View
```typescript
ViewBlockBuilder.kanban()
  .dataSource('APP_TOKEN', 'TABLE_ID', 'VIEW_ID')
  .title('Board')
  .height(500)
  .build()
```

### Gallery View
```typescript
ViewBlockBuilder.gallery()
  .dataSource('APP_TOKEN', 'TABLE_ID', 'VIEW_ID')
  .title('Cards')
  .height(600)
  .build()
```

### Gantt View
```typescript
ViewBlockBuilder.gantt()
  .dataSource('APP_TOKEN', 'TABLE_ID', 'VIEW_ID')
  .title('Timeline')
  .height(400)
  .build()
```

### Form View
```typescript
ViewBlockBuilder.form()
  .dataSource('APP_TOKEN', 'TABLE_ID', 'VIEW_ID')
  .title('Form')
  .build()
```

### Calendar View (2025)
```typescript
ViewBlockBuilder.calendar()
  .dataSource('APP_TOKEN', 'TABLE_ID', 'VIEW_ID')
  .title('Calendar')
  .height(500)
  .build()
```

### Timeline View (2025)
```typescript
ViewBlockBuilder.timeline()
  .dataSource('APP_TOKEN', 'TABLE_ID', 'VIEW_ID')
  .title('Timeline')
  .height(400)
  .build()
```

---

## Text Builder

### Heading
```typescript
new TextBlockBuilder()
  .heading('Dashboard Title')
  .alignment('center')
  .build()
```

### Paragraph
```typescript
new TextBlockBuilder()
  .paragraph('Description text here')
  .alignment('left')
  .build()
```

### Title
```typescript
new TextBlockBuilder()
  .title('Section Title')
  .build()
```

---

## List Builder (2025)

### Vertical List
```typescript
new ListBlockBuilder()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .layout(ListLayoutStyle.VERTICAL)
  .displayFields(['Name', 'Email', 'Status'])
  .itemsPerPage(10)
  .title('List')
  .build()
```

### Grid List
```typescript
new ListBlockBuilder()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .layout(ListLayoutStyle.GRID)
  .displayFields(['Image', 'Name', 'Price'])
  .gridColumns(4)
  .itemsPerPage(12)
  .build()
```

### Compact List
```typescript
new ListBlockBuilder()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .layout(ListLayoutStyle.COMPACT)
  .displayFields(['Name', 'Status'])
  .itemsPerPage(20)
  .build()
```

---

## Tab/Page Builder (2025)

### Horizontal Tabs
```typescript
new TabPageBlockBuilder()
  .layout(TabPageLayout.HORIZONTAL_TABS)
  .addTab({
    name: 'Tab 1',
    blocks: [block1, block2]
  })
  .addTab({
    name: 'Tab 2',
    blocks: [block3, block4]
  })
  .build()
```

### Vertical Tabs
```typescript
new TabPageBlockBuilder()
  .layout(TabPageLayout.VERTICAL_TABS)
  .addTab({
    name: 'Overview',
    blocks: [...]
  })
  .addTab({
    name: 'Details',
    blocks: [...]
  })
  .build()
```

### Pills Layout
```typescript
new TabPageBlockBuilder()
  .layout(TabPageLayout.PILLS)
  .addTab({
    name: 'Q1',
    blocks: [...]
  })
  .addTab({
    name: 'Q2',
    blocks: [...]
  })
  .build()
```

---

## Filters

### Basic Filter
```typescript
.filters(FilterConjunction.AND, [
  { fieldName: 'Status', operator: FilterOperator.IS, value: 'Active' }
])
```

### Multiple Filters (AND)
```typescript
.filters(FilterConjunction.AND, [
  { fieldName: 'Status', operator: FilterOperator.IS, value: 'Active' },
  { fieldName: 'Amount', operator: FilterOperator.GT, value: 1000 },
  { fieldName: 'Region', operator: FilterOperator.CONTAINS, value: 'North' }
])
```

### Multiple Filters (OR)
```typescript
.filters(FilterConjunction.OR, [
  { fieldName: 'Priority', operator: FilterOperator.IS, value: 'High' },
  { fieldName: 'Priority', operator: FilterOperator.IS, value: 'Critical' }
])
```

### Filter Operators Cheat Sheet
```typescript
FilterOperator.IS                // Equals
FilterOperator.IS_NOT            // Not equal
FilterOperator.CONTAINS          // Text contains
FilterOperator.DOES_NOT_CONTAIN  // Text excludes
FilterOperator.STARTS_WITH       // Text starts
FilterOperator.ENDS_WITH         // Text ends
FilterOperator.IS_EMPTY          // No value
FilterOperator.IS_NOT_EMPTY      // Has value
FilterOperator.GT                // Greater than
FilterOperator.GTE               // Greater/equal
FilterOperator.LT                // Less than
FilterOperator.LTE               // Less/equal
```

---

## Aggregations

```typescript
AggregationType.SUM              // Total
AggregationType.AVG              // Average
AggregationType.COUNT            // Count records
AggregationType.DISTINCT_COUNT   // Unique values
AggregationType.MAX              // Highest value
AggregationType.MIN              // Lowest value
AggregationType.PERCENT          // Percentage
```

---

## Permissions

### Dashboard Permissions
```typescript
const perms = new DashboardPermissionBuilder()
  .addOwner('ou_user123')
  .addEditor('ou_user456')
  .addViewer('ou_user789')
  .addGroupAsEditor('og_team123')
  .addGroupAsViewer('og_team456')
  .removeAccess('ou_user789')
  .build();

await client.setDashboardPermissions('APP_TOKEN', 'DASH_ID', perms);
```

### Block Permissions
```typescript
const perms = new BlockPermissionBuilder()
  .addEditor('ou_user123')
  .addViewer('og_team456')
  .build();

await client.setBlockPermissions('APP_TOKEN', 'BLOCK_ID', perms);
```

---

## Common Patterns

### Create Complete Dashboard
```typescript
const dashboardId = await client.createDashboard({
  name: 'Sales Dashboard',
  appToken: 'APP_TOKEN'
});

const blocks = [
  new MetricsBlockBuilder()...build(),
  ChartBlockBuilder.bar()...build(),
  ViewBlockBuilder.table()...build()
];

const results = await client.batchCreateBlocks('APP_TOKEN', blocks);
```

### Dashboard with Permissions
```typescript
const dashboardId = await client.createDashboard({...});

const perms = new DashboardPermissionBuilder()
  .addOwner('ou_owner')
  .addGroupAsViewer('og_viewers')
  .build();

await client.setDashboardPermissions('APP_TOKEN', dashboardId, perms);
```

### Filtered Chart
```typescript
ChartBlockBuilder.bar()
  .dataSource('APP_TOKEN', 'TABLE_ID')
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Value', aggregation: AggregationType.SUM }])
  .filters(FilterConjunction.AND, [
    { fieldName: 'Year', operator: FilterOperator.IS, value: '2025' },
    { fieldName: 'Status', operator: FilterOperator.IS, value: 'Active' }
  ])
  .title('Filtered Data')
  .build()
```

### Multi-Metric Dashboard
```typescript
const metrics = [
  new MetricsBlockBuilder().fieldName('Revenue').aggregation(AggregationType.SUM).title('Revenue').build(),
  new MetricsBlockBuilder().fieldName('Orders').aggregation(AggregationType.COUNT).title('Orders').build(),
  new MetricsBlockBuilder().fieldName('Customers').aggregation(AggregationType.DISTINCT_COUNT).title('Customers').build(),
];

await client.batchCreateBlocks('APP_TOKEN', metrics);
```

---

## Error Handling Quick Reference

```typescript
try {
  await client.createDashboard({...});
} catch (error) {
  if (error instanceof ValidationError) {
    // Invalid input data
  } else if (error instanceof AuthenticationError) {
    // Invalid API key
  } else if (error instanceof NetworkError) {
    // Connection failed
  } else if (error instanceof NotFoundError) {
    // Resource not found
  } else if (error instanceof RateLimitError) {
    // Too many requests
  } else {
    // Unknown error
  }
}
```

---

## Performance Tips

1. **Use batch operations** for multiple blocks
2. **Add filters** to reduce data
3. **Enable logging** only for debugging
4. **Cache results** when possible
5. **Implement retry logic** for transient failures
6. **Monitor API usage** to avoid rate limits

---

## Useful Enums

```typescript
// Block types
enum BlockType { CHART, VIEW, METRICS, LAYOUT, TEXT, LIST, TAB_PAGE, FILTER }

// Chart types
enum ChartType { BAR, LINE, PIE, SCATTER, AREA, COLUMN, FUNNEL, RADAR, ... }

// View types
enum ViewType { GRID, KANBAN, GALLERY, GANTT, FORM, CALENDAR, TIMELINE }

// List layouts
enum ListLayoutStyle { VERTICAL, HORIZONTAL, GRID, COMPACT, DETAILED }

// Tab layouts
enum TabPageLayout { HORIZONTAL_TABS, VERTICAL_TABS, PILLS }

// Regions
type LarkRegion = 'sg' | 'cn' | 'us'
```

---

## Links & Resources

- **Documentation**: https://github.com/hypelab/lark-dashboard-sdk
- **Examples**: `/examples` in repository
- **Issues**: https://github.com/hypelab/lark-dashboard-sdk/issues
- **Email**: dev@hypelab.com

Happy dashboard building!
