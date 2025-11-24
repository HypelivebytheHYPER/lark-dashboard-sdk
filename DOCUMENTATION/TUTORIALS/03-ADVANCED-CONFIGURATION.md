# Tutorial 3: Advanced Block Configuration (20 Minutes)

## What You'll Learn
- Filter data on charts and metrics
- Use batch operations for efficiency
- Configure view blocks (tables, kanban, gallery)
- Handle errors gracefully
- Optimize dashboard performance

## Prerequisites
- Completed Tutorials 1 and 2
- Understanding of basic block creation
- Sample data with multiple fields

## Time Estimate: 20 minutes

## Section 1: Filtering Data

Filters allow you to show only relevant data on your charts and metrics.

### Basic Single Filter

```typescript
import { ChartBlockBuilder, FilterOperator, FilterConjunction, AggregationType } from '@hypelab/lark-dashboard-sdk';

const filteredChart = ChartBlockBuilder.bar()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Product' })
  .yAxis([{ fieldName: 'Sales', aggregation: AggregationType.SUM }])
  .title('Active Sales Only')
  // Add filter: only show records where Status = 'Active'
  .filters(FilterConjunction.AND, [
    { fieldName: 'Status', operator: FilterOperator.IS, value: 'Active' }
  ])
  .build();
```

### Multiple Filters with AND Logic

Show only records matching ALL conditions:

```typescript
const advancedFilterAnd = ChartBlockBuilder.bar()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Region' })
  .yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
  .title('High-Value Active Sales')
  .filters(FilterConjunction.AND, [
    { fieldName: 'Status', operator: FilterOperator.IS, value: 'Active' },
    { fieldName: 'Amount', operator: FilterOperator.GT, value: 1000 },
    { fieldName: 'Region', operator: FilterOperator.IS_NOT, value: 'Internal' }
  ])
  .build();
```

**Explanation:**
- `FilterConjunction.AND`: ALL conditions must be true
- Only shows records where: Status = 'Active' AND Amount > 1000 AND Region != 'Internal'

### Multiple Filters with OR Logic

Show records matching ANY condition:

```typescript
const advancedFilterOr = ChartBlockBuilder.bar()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Count', aggregation: AggregationType.COUNT }])
  .title('Priority Items')
  .filters(FilterConjunction.OR, [
    { fieldName: 'Priority', operator: FilterOperator.IS, value: 'High' },
    { fieldName: 'Priority', operator: FilterOperator.IS, value: 'Critical' },
    { fieldName: 'Status', operator: FilterOperator.IS, value: 'Urgent' }
  ])
  .build();
```

**Explanation:**
- `FilterConjunction.OR`: ANY condition can be true
- Shows records where: Priority = 'High' OR Priority = 'Critical' OR Status = 'Urgent'

### All Filter Operators

```typescript
enum FilterOperator {
  IS = 'is',                        // Equals
  IS_NOT = 'is_not',               // Not equals
  CONTAINS = 'contains',            // Text contains substring
  DOES_NOT_CONTAIN = 'does_not_contain', // Text doesn't contain
  STARTS_WITH = 'starts_with',      // Text starts with
  ENDS_WITH = 'ends_with',          // Text ends with
  IS_EMPTY = 'is_empty',            // Field is empty
  IS_NOT_EMPTY = 'is_not_empty',    // Field has value
  GT = 'gt',                        // Greater than (numbers)
  GTE = 'gte',                      // Greater than or equal
  LT = 'lt',                        // Less than
  LTE = 'lte',                      // Less than or equal
}
```

### Filter Examples by Type

```typescript
// Text filters
{ fieldName: 'Name', operator: FilterOperator.CONTAINS, value: 'Smith' }
{ fieldName: 'Email', operator: FilterOperator.STARTS_WITH, value: '@company.com' }

// Number filters
{ fieldName: 'Revenue', operator: FilterOperator.GT, value: 5000 }
{ fieldName: 'Score', operator: FilterOperator.LTE, value: 100 }

// Null checks
{ fieldName: 'CompletedDate', operator: FilterOperator.IS_EMPTY, value: null }
{ fieldName: 'Comment', operator: FilterOperator.IS_NOT_EMPTY, value: null }

// Date filters (use ISO format)
{ fieldName: 'CreatedDate', operator: FilterOperator.GT, value: '2025-01-01' }
```

### Real-World Filter Examples

```typescript
// Sales dashboard: Only completed transactions in Q1 2025
const q1SalesChart = ChartBlockBuilder.bar()
  .dataSource(appToken, tableId)
  .xAxis({ fieldName: 'Region' })
  .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
  .filters(FilterConjunction.AND, [
    { fieldName: 'Status', operator: FilterOperator.IS, value: 'Completed' },
    { fieldName: 'TransactionDate', operator: FilterOperator.GTE, value: '2025-01-01' },
    { fieldName: 'TransactionDate', operator: FilterOperator.LTE, value: '2025-03-31' }
  ])
  .build();

// Customer dashboard: VIP customers from US or EU
const vipChart = ChartBlockBuilder.bar()
  .dataSource(appToken, tableId)
  .xAxis({ fieldName: 'Industry' })
  .yAxis([{ fieldName: 'Spending', aggregation: AggregationType.SUM }])
  .filters(FilterConjunction.AND, [
    { fieldName: 'CustomerTier', operator: FilterOperator.IS, value: 'VIP' },
    {
      // This is an OR within the AND - using multiple matching values
      fieldName: 'Region',
      operator: FilterOperator.IS,
      value: 'North America'
    }
  ])
  .build();
```

## Section 2: Batch Operations

When creating multiple blocks, use batch operations for better performance.

### Batch Create Blocks

Instead of creating blocks one-by-one:

```typescript
// SLOW: Multiple API calls
await client.addBlock(appToken, dashboardId, block1);
await client.addBlock(appToken, dashboardId, block2);
await client.addBlock(appToken, dashboardId, block3);
```

Use batch operations:

```typescript
// FAST: Single API call
const blocks = [
  ChartBlockBuilder.bar()
    .dataSource(appToken, tableId)
    .xAxis({ fieldName: 'Month' })
    .yAxis([{ fieldName: 'Sales', aggregation: AggregationType.SUM }])
    .build(),

  MetricsBlockBuilder.sum('Revenue')
    .dataSource(appToken, tableId)
    .build(),

  ViewBlockBuilder.table()
    .dataSource(appToken, tableId, viewId)
    .build()
];

const results = await client.batchCreateBlocks(appToken, blocks);
console.log('Created block IDs:', results.map(r => r.blockId));
```

### Benefits of Batch Operations
- **Faster**: Single network request vs. multiple
- **Atomic**: All-or-nothing operation (if one fails, all fail)
- **Cleaner code**: More organized and easier to maintain

### Batch Operation Example

```typescript
async function createCompleteAnalyticsDashboard() {
  const client = new LarkDashboardClient({
    apiKey: process.env.LARK_API_KEY!,
  });

  // Create dashboard
  const dashboardId = await client.createDashboard({
    name: 'Analytics Dashboard',
    appToken: 'YOUR_APP_TOKEN',
  });

  // Prepare all blocks
  const blocks = [
    // KPI Metrics
    new MetricsBlockBuilder()
      .dataSource('YOUR_APP_TOKEN', 'analytics')
      .fieldName('Sessions')
      .aggregation(AggregationType.COUNT)
      .title('Total Sessions')
      .build(),

    new MetricsBlockBuilder()
      .dataSource('YOUR_APP_TOKEN', 'analytics')
      .fieldName('Users')
      .aggregation(AggregationType.DISTINCT_COUNT)
      .title('Unique Users')
      .build(),

    // Trends
    ChartBlockBuilder.line()
      .dataSource('YOUR_APP_TOKEN', 'analytics')
      .xAxis({ fieldName: 'Date' })
      .yAxis([{ fieldName: 'Sessions', aggregation: AggregationType.COUNT }])
      .title('Daily Sessions Trend')
      .build(),

    // Geographic breakdown
    ChartBlockBuilder.bar()
      .dataSource('YOUR_APP_TOKEN', 'analytics')
      .xAxis({ fieldName: 'Country' })
      .yAxis([{ fieldName: 'Users', aggregation: AggregationType.DISTINCT_COUNT }])
      .title('Users by Country')
      .filters(FilterConjunction.AND, [
        { fieldName: 'Sessions', operator: FilterOperator.GT, value: 10 }
      ])
      .build(),

    // Device breakdown
    ChartBlockBuilder.pie()
      .dataSource('YOUR_APP_TOKEN', 'analytics')
      .series({ fieldName: 'DeviceType' })
      .yAxis([{ fieldName: 'Sessions', aggregation: AggregationType.COUNT }])
      .title('Sessions by Device')
      .build()
  ];

  // Create all at once
  const results = await client.batchCreateBlocks('YOUR_APP_TOKEN', blocks);

  console.log(`Created ${results.length} blocks`);
  results.forEach((result, index) => {
    console.log(`Block ${index + 1}: ${result.blockId}`);
  });

  return dashboardId;
}
```

## Section 3: View Blocks (Tables, Kanban, Gallery)

View blocks embed Lark table views directly in dashboards.

### Table View

Embed a grid view of your data:

```typescript
import { ViewBlockBuilder, ViewType } from '@hypelab/lark-dashboard-sdk';

const tableView = ViewBlockBuilder.table()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID', 'YOUR_VIEW_ID')
  .title('Customer Records')
  .height(400)        // Height in pixels
  .showToolbar(true)  // Show filter/sort toolbar
  .build();

await client.addBlock('YOUR_APP_TOKEN', dashboardId, tableView);
```

### Kanban View

Show tasks in a kanban board:

```typescript
const kanbanView = ViewBlockBuilder.kanban()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID', 'YOUR_VIEW_ID')
  .title('Project Board')
  .height(500)
  .build();

await client.addBlock('YOUR_APP_TOKEN', dashboardId, kanbanView);
```

### Gallery View

Display records as cards:

```typescript
const galleryView = ViewBlockBuilder.gallery()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID', 'YOUR_VIEW_ID')
  .title('Product Showcase')
  .height(600)
  .build();

await client.addBlock('YOUR_APP_TOKEN', dashboardId, galleryView);
```

### Gantt View

Show project timeline:

```typescript
const ganttView = ViewBlockBuilder.gantt()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID', 'YOUR_VIEW_ID')
  .title('Project Timeline')
  .height(400)
  .build();

await client.addBlock('YOUR_APP_TOKEN', dashboardId, ganttView);
```

### Form View

Display records in form format:

```typescript
const formView = ViewBlockBuilder.form()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID', 'YOUR_VIEW_ID')
  .title('Feedback Form')
  .build();

await client.addBlock('YOUR_APP_TOKEN', dashboardId, formView);
```

### Finding Your View ID

1. In Lark Bitable, open your table
2. Click on a view (Grid, Kanban, Gallery, etc.)
3. The URL shows: `/views/{VIEW_ID}`
4. Copy that ID

## Section 4: Error Handling

Handle errors gracefully in production:

### Try-Catch Pattern

```typescript
import { ValidationError, NetworkError } from '@hypelab/lark-dashboard-sdk';

async function createDashboardSafely() {
  const client = new LarkDashboardClient({
    apiKey: process.env.LARK_API_KEY!,
  });

  try {
    const dashboardId = await client.createDashboard({
      name: 'Test Dashboard',
      appToken: 'YOUR_APP_TOKEN',
    });

    const block = ChartBlockBuilder.bar()
      .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
      .xAxis({ fieldName: 'Category' })
      .yAxis([{ fieldName: 'Value', aggregation: AggregationType.SUM }])
      .build();

    await client.addBlock('YOUR_APP_TOKEN', dashboardId, block);
    console.log('Dashboard created successfully');

  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation error:', error.message);
      // Fix the data and retry
    } else if (error instanceof NetworkError) {
      console.error('Network error:', error.message);
      // Implement retry logic
    } else {
      console.error('Unknown error:', error);
      // Generic error handling
    }
  }
}
```

### Error Types

```typescript
// ValidationError: Bad input data
try {
  await client.addBlock(appToken, dashboardId, invalidBlock);
} catch (error) {
  if (error.name === 'ValidationError') {
    console.error('Invalid block configuration');
  }
}

// NetworkError: Connection issues
try {
  await client.createDashboard(dashboardConfig);
} catch (error) {
  if (error.name === 'NetworkError') {
    console.error('Cannot connect to Lark API');
  }
}

// AuthenticationError: Invalid API key
try {
  const client = new LarkDashboardClient({
    apiKey: 'invalid-key',
  });
  await client.listDashboards('YOUR_APP_TOKEN');
} catch (error) {
  if (error.name === 'AuthenticationError') {
    console.error('Invalid API key');
  }
}
```

### Retry with Exponential Backoff

```typescript
async function createDashboardWithRetry(
  config: any,
  maxRetries: number = 3
) {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = new LarkDashboardClient({
        apiKey: process.env.LARK_API_KEY!,
      });
      return await client.createDashboard(config);
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        // Wait before retrying: 1s, 2s, 4s, etc.
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// Usage
try {
  const dashboardId = await createDashboardWithRetry({
    name: 'Resilient Dashboard',
    appToken: 'YOUR_APP_TOKEN',
  });
} catch (error) {
  console.error('Failed after retries:', error);
}
```

## Section 5: Performance Optimization

### Optimize Data Queries

```typescript
// Slow: Analyzing 10,000 rows
const slowChart = ChartBlockBuilder.bar()
  .dataSource('YOUR_APP_TOKEN', 'large_table')
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
  .build();

// Fast: Filter first, then analyze
const fastChart = ChartBlockBuilder.bar()
  .dataSource('YOUR_APP_TOKEN', 'large_table')
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
  .filters(FilterConjunction.AND, [
    { fieldName: 'Year', operator: FilterOperator.IS, value: '2025' },
    { fieldName: 'Status', operator: FilterOperator.IS, value: 'Completed' }
  ])
  .build();
```

### Pagination for Batch Operations

```typescript
// When creating 100+ blocks, paginate
const allBlocks = generateMany100Blocks();

// Process in batches of 10
for (let i = 0; i < allBlocks.length; i += 10) {
  const batch = allBlocks.slice(i, i + 10);
  const results = await client.batchCreateBlocks('YOUR_APP_TOKEN', batch);
  console.log(`Created batch ${Math.floor(i / 10) + 1}`);
}
```

### Cache Dashboard Metadata

```typescript
// Avoid repeated API calls
interface DashboardCache {
  dashboardId: string;
  blocks: DashboardBlock[];
  lastUpdated: Date;
}

const dashboardCache: DashboardCache = {
  dashboardId: '',
  blocks: [],
  lastUpdated: new Date(),
};

async function getDashboardBlocks(dashboardId: string) {
  // If cached and less than 5 minutes old, use cache
  if (
    dashboardCache.dashboardId === dashboardId &&
    Date.now() - dashboardCache.lastUpdated.getTime() < 5 * 60 * 1000
  ) {
    return dashboardCache.blocks;
  }

  // Otherwise fetch fresh
  const blocks = await client.listBlocks('YOUR_APP_TOKEN');
  dashboardCache.blocks = blocks;
  dashboardCache.lastUpdated = new Date();
  return blocks;
}
```

## Checkpoint: Self-Assessment

1. **Can you write a filter that shows only records where Status is 'Active' AND Amount > 500?**
   ```typescript
   .filters(FilterConjunction.AND, [
     { fieldName: 'Status', operator: FilterOperator.IS, value: 'Active' },
     { fieldName: 'Amount', operator: FilterOperator.GT, value: 500 }
   ])
   ```

2. **Why would you use batch operations?**
   - Faster (single API call instead of multiple)
   - Atomic (all succeed or all fail)
   - Cleaner code

3. **How do you handle API errors gracefully?**
   - Use try-catch blocks
   - Check error types
   - Implement retry logic with exponential backoff

## Next Steps

- Read [Tutorial 4: MCP Integration with Claude](04-MCP-INTEGRATION.md)
- Explore advanced features
- Build production dashboards

## Summary

You've learned:
- How to filter data effectively
- Using batch operations for performance
- Embedding view blocks
- Error handling patterns
- Performance optimization techniques

You're now ready for production-grade dashboard applications!
