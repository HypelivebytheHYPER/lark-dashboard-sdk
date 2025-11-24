# Best Practices Guide

## Dashboard Design Principles

### 1. Clear Information Hierarchy

**Good Practice:**
```typescript
// Order blocks logically: summary → details → deep dive
const blocks = [
  // Level 1: High-level metrics
  totalRevenueMetric,
  totalOrdersMetric,

  // Level 2: Trend analysis
  revenueTrendChart,
  orderTrendChart,

  // Level 3: Detailed breakdown
  revenueByRegionChart,
  revenueByProductChart,

  // Level 4: Raw data
  transactionDetailsTable
];
```

**Why:** Users scan dashboards top-to-bottom. Important info first.

### 2. Consistent Color Schemes

**Good Practice:**
```typescript
// Define color scheme once
const COLORS = {
  primary: '#3b82f6',    // Blue
  success: '#10b981',    // Green
  warning: '#f59e0b',    // Amber
  danger: '#ef4444',     // Red
};

// Use consistently across all charts
const chart1 = ChartBlockBuilder.bar()
  .colors([COLORS.primary, COLORS.success])
  .build();

const chart2 = ChartBlockBuilder.line()
  .colors([COLORS.primary])
  .build();
```

**Why:** Consistency aids visual recognition and professional appearance.

### 3. Meaningful Titles and Labels

**Good Practice:**
```typescript
.title('Revenue by Region (Q1 2025)')  // Specific, time-bounded
.xAxis({ fieldName: 'Region' })
.yAxis([{
  fieldName: 'Revenue',
  aggregation: AggregationType.SUM,
  label: 'Total Revenue ($)'  // Clear label with unit
}])

const metric = new MetricsBlockBuilder()
  .title('Active Customers (30-day)')  // Include calculation method
  .build();
```

**Why:** Context prevents misinterpretation of data.

### 4. Avoid Chart Clutter

**Good Practice:**
```typescript
// ONE metric per chart
const chart = ChartBlockBuilder.bar()
  .xAxis({ fieldName: 'Month' })
  .yAxis([{
    fieldName: 'Revenue',
    aggregation: AggregationType.SUM
  }])
  .build();

// Multiple metrics? Create separate charts
const chart1 = ChartBlockBuilder.line()
  .yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
  .build();

const chart2 = ChartBlockBuilder.line()
  .yAxis([{ fieldName: 'Expenses', aggregation: AggregationType.SUM }])
  .build();
```

**Why:** Simpler charts are easier to understand.

### 5. Appropriate Chart Types

**Good Practice:**
```typescript
// Comparing categories → Bar chart
.chartType(ChartType.BAR)
.xAxis({ fieldName: 'Region' })

// Showing trends over time → Line chart
.chartType(ChartType.LINE)
.xAxis({ fieldName: 'Date' })

// Part-to-whole relationships → Pie chart
.chartType(ChartType.PIE)
.series({ fieldName: 'Category' })

// Three-variable correlation → Bubble chart
.chartType(ChartType.BUBBLE)
.xAxis({ fieldName: 'Spend' })
.yAxis([{ fieldName: 'Revenue' }, { fieldName: 'Customers' }])
```

**Why:** Chart type should match data relationships.

---

## Performance Optimization Tips

### 1. Filter Early

**Good Practice:**
```typescript
// Filter before aggregation
const chart = ChartBlockBuilder.bar()
  .dataSource(APP_TOKEN, 'large_table')
  .filters(FilterConjunction.AND, [
    { fieldName: 'Year', operator: FilterOperator.IS, value: '2025' },
    { fieldName: 'Status', operator: FilterOperator.IS, value: 'Completed' }
  ])
  .build();

// Process 100k → 5k records
```

**Why:** Filtering reduces data load dramatically.

### 2. Use Batch Operations

**Good Practice:**
```typescript
// Create all blocks at once
const results = await client.batchCreateBlocks(APP_TOKEN, [
  metric1, metric2, metric3,
  chart1, chart2,
  table1
]);

// Instead of:
// await client.addBlock(APP_TOKEN, dashboardId, metric1);
// await client.addBlock(APP_TOKEN, dashboardId, metric2);
// ... (multiple API calls)
```

**Why:** Single API call is faster than multiple serial calls.

### 3. Paginate Large Data

**Good Practice:**
```typescript
const allBlocks = generateMany1000Blocks();

// Create in batches
for (let i = 0; i < allBlocks.length; i += 100) {
  const batch = allBlocks.slice(i, i + 100);
  const results = await client.batchCreateBlocks(APP_TOKEN, batch);
  console.log(`Created batch ${Math.floor(i / 100) + 1}`);
}
```

**Why:** Prevents API timeouts and memory issues.

### 4. Limit Table Views

**Good Practice:**
```typescript
// Show top 50 records
ViewBlockBuilder.table()
  .dataSource(APP_TOKEN, 'table_id', 'view_top_50')
  .height(400)
  .build()

// Or use pagination in views
```

**Why:** Reduces rendering load on dashboard.

### 5. Cache Computed Values

**Good Practice:**
```typescript
const dashboardCache = new Map();

async function getMetricValue(key: string) {
  // Check cache first
  if (dashboardCache.has(key)) {
    const cached = dashboardCache.get(key);
    // If less than 5 minutes old, use cache
    if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.value;
    }
  }

  // Fetch fresh value
  const value = await fetchMetricValue(key);
  dashboardCache.set(key, { value, timestamp: Date.now() });
  return value;
}
```

**Why:** Reduces redundant API calls.

---

## Error Handling Patterns

### 1. Graceful Degradation

**Good Practice:**
```typescript
async function createDashboardSafely() {
  try {
    const dashboardId = await client.createDashboard(config);
    console.log('Dashboard created');
  } catch (error) {
    if (error.code === 'INVALID_API_KEY') {
      console.error('Check your API key');
      // Fall back to manual process
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network unavailable, retry later');
      // Queue for retry
    } else {
      console.error('Unknown error:', error);
    }
  }
}
```

**Why:** Handle failures appropriately instead of crashing.

### 2. Input Validation

**Good Practice:**
```typescript
function validateChartConfig(config: ChartConfig): boolean {
  if (!config.appToken?.trim()) {
    throw new Error('appToken is required');
  }
  if (!config.tableId?.trim()) {
    throw new Error('tableId is required');
  }
  if (!config.xAxis?.fieldName) {
    throw new Error('xAxis.fieldName is required');
  }
  if (!config.yAxis?.length) {
    throw new Error('yAxis must have at least one field');
  }
  return true;
}

// Use before creating chart
validateChartConfig(chartConfig);
const chart = ChartBlockBuilder.bar().build(chartConfig);
```

**Why:** Prevents invalid data from being sent to API.

### 3. Retry Logic

**Good Practice:**
```typescript
async function createDashboardWithRetry(config, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = new LarkDashboardClient({
        apiKey: process.env.LARK_API_KEY!,
      });
      return await client.createDashboard(config);
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

**Why:** Handles transient failures automatically.

### 4. Logging

**Good Practice:**
```typescript
const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  logging: true,  // Enable detailed logging
  timeout: 30000,
  maxRetries: 3,
});

// Log important steps
console.log(`[DEBUG] Creating dashboard: ${dashboardConfig.name}`);
const dashboardId = await client.createDashboard(dashboardConfig);
console.log(`[SUCCESS] Dashboard created: ${dashboardId}`);

// Log errors with context
try {
  await client.addBlock(appToken, dashboardId, block);
} catch (error) {
  console.error(`[ERROR] Failed to add block to ${dashboardId}:`, error);
  throw error;
}
```

**Why:** Helps debugging and monitoring production dashboards.

---

## Authentication Best Practices

### 1. Use Environment Variables

**Good Practice:**
```typescript
// .env
LARK_API_KEY=your-token-here
LARK_REGION=sg

// Code
const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  region: process.env.LARK_REGION as LarkRegion,
});
```

**Why:** Never hardcode secrets in code.

### 2. Secure API Key Storage

**Good Practice:**
```typescript
// Use secrets management service
import * as aws from 'aws-sdk';

const secretsManager = new aws.SecretsManager();

const secret = await secretsManager
  .getSecretValue({ SecretId: 'lark-api-key' })
  .promise();

const client = new LarkDashboardClient({
  apiKey: JSON.parse(secret.SecretString).apiKey,
});
```

**Why:** Centralized secret management and rotation.

### 3. Token Scope Validation

**Good Practice:**
```typescript
async function validateApiToken() {
  const client = new LarkDashboardClient({
    apiKey: process.env.LARK_API_KEY!,
  });

  try {
    // Test API call
    const dashboards = await client.listDashboards('test_app_token');
    console.log('API token is valid');
    return true;
  } catch (error) {
    console.error('Invalid or expired API token');
    return false;
  }
}
```

**Why:** Validates token before using in production.

### 4. Rotation Schedule

**Good Practice:**
```typescript
// Rotate API keys monthly
// 1. Generate new key
// 2. Update environment variable
// 3. Test in staging
// 4. Deploy to production
// 5. Revoke old key

const KEY_ROTATION_INTERVAL = 30 * 24 * 60 * 60 * 1000; // 30 days
```

**Why:** Reduces impact of compromised keys.

---

## Common Pitfalls and Solutions

### Pitfall 1: Field Name Typos

**Problem:**
```typescript
// This will fail if field name is 'Revenue' not 'Revenu'
.yAxis([{ fieldName: 'Revenu', aggregation: AggregationType.SUM }])
```

**Solution:**
```typescript
// Verify field names exist first
const fields = await client.getTableFields(appToken, tableId);
const validFieldNames = fields.map(f => f.name);

if (!validFieldNames.includes('Revenue')) {
  throw new Error('Revenue field not found in table');
}

// Then use with confidence
.yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
```

### Pitfall 2: Not Handling Large Datasets

**Problem:**
```typescript
// This will be slow with 100k records
const chart = ChartBlockBuilder.bar()
  .dataSource(appToken, 'large_table')
  .build();
```

**Solution:**
```typescript
// Filter first
const chart = ChartBlockBuilder.bar()
  .dataSource(appToken, 'large_table')
  .filters(FilterConjunction.AND, [
    { fieldName: 'Year', operator: FilterOperator.IS, value: '2025' }
  ])
  .build();
```

### Pitfall 3: Too Many Chart Types

**Problem:**
```typescript
// Dashboard with 20 different chart types is confusing
const dashboard = [
  barChart, lineChart, pieChart, scatterChart,
  areaChart, columnChart, funnelChart, radarChart,
  // ... more and more
];
```

**Solution:**
```typescript
// Keep it simple and focused
const dashboard = [
  // KPIs
  metric1, metric2,

  // Main visualization
  mainTrendChart,

  // Supporting visualization
  breakdownChart,

  // Details
  dataTable
];
```

### Pitfall 4: Forgetting Error Handling

**Problem:**
```typescript
// No error handling
const dashboardId = await client.createDashboard(config);
await client.addBlock(appToken, dashboardId, block1);
await client.addBlock(appToken, dashboardId, block2);
```

**Solution:**
```typescript
try {
  const dashboardId = await client.createDashboard(config);
  console.log('Dashboard created');

  const blocks = [block1, block2];
  const results = await client.batchCreateBlocks(appToken, blocks);
  console.log(`Added ${results.length} blocks`);
} catch (error) {
  console.error('Dashboard creation failed:', error);
  // Handle error appropriately
}
```

### Pitfall 5: Creating Individual Blocks Serially

**Problem:**
```typescript
// N API calls
for (const block of blocks) {
  await client.addBlock(appToken, dashboardId, block);
}
```

**Solution:**
```typescript
// 1 API call
await client.batchCreateBlocks(appToken, blocks);
```

---

## Testing Dashboards

### 1. Unit Testing Chart Configs

**Good Practice:**
```typescript
import { describe, it, expect } from '@jest/globals';

describe('Chart Configuration', () => {
  it('should create valid bar chart', () => {
    const chart = ChartBlockBuilder.bar()
      .dataSource('app_token', 'table_id')
      .xAxis({ fieldName: 'Month' })
      .yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
      .title('Monthly Revenue')
      .build();

    expect(chart.type).toBe(ChartType.BAR);
    expect(chart.title).toBe('Monthly Revenue');
    expect(chart.xAxis).toBeDefined();
    expect(chart.yAxis).toHaveLength(1);
  });

  it('should validate required fields', () => {
    expect(() => {
      ChartBlockBuilder.bar()
        .build(); // Missing dataSource
    }).toThrow('dataSource is required');
  });
});
```

### 2. Integration Testing

**Good Practice:**
```typescript
describe('Dashboard Creation', () => {
  let client: LarkDashboardClient;
  let dashboardId: string;

  beforeEach(() => {
    client = new LarkDashboardClient({
      apiKey: process.env.TEST_API_KEY!,
    });
  });

  it('should create dashboard and add blocks', async () => {
    dashboardId = await client.createDashboard({
      name: 'Test Dashboard',
      appToken: 'test_app_token',
    });

    expect(dashboardId).toBeDefined();

    const chart = ChartBlockBuilder.bar()
      .dataSource('test_app_token', 'test_table')
      .xAxis({ fieldName: 'Category' })
      .yAxis([{ fieldName: 'Value', aggregation: AggregationType.SUM }])
      .build();

    const blockId = await client.addBlock(
      'test_app_token',
      dashboardId,
      chart
    );

    expect(blockId).toBeDefined();
  });

  afterEach(async () => {
    if (dashboardId) {
      await client.deleteDashboard('test_app_token', dashboardId);
    }
  });
});
```

---

## Monitoring and Maintenance

### 1. Health Checks

**Good Practice:**
```typescript
async function checkDashboardHealth() {
  const client = new LarkDashboardClient({
    apiKey: process.env.LARK_API_KEY!,
  });

  try {
    // Test API connectivity
    const dashboards = await client.listDashboards('app_token');
    console.log(`Health check passed: ${dashboards.length} dashboards found`);
    return true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

// Run periodically
setInterval(checkDashboardHealth, 5 * 60 * 1000); // Every 5 minutes
```

### 2. Performance Monitoring

**Good Practice:**
```typescript
async function measureCreationTime(config: DashboardConfig) {
  const start = performance.now();

  const client = new LarkDashboardClient({
    apiKey: process.env.LARK_API_KEY!,
  });

  const dashboardId = await client.createDashboard(config);

  const duration = performance.now() - start;
  console.log(`Dashboard created in ${duration}ms`);

  if (duration > 5000) {
    console.warn('Dashboard creation took longer than expected');
  }
}
```

### 3. Audit Logging

**Good Practice:**
```typescript
async function auditDashboardAccess(dashboardId: string, userId: string) {
  const timestamp = new Date().toISOString();
  const action = 'ACCESSED';

  console.log(JSON.stringify({
    timestamp,
    dashboardId,
    userId,
    action
  }));

  // Store in audit log
  // await auditLog.insert({ timestamp, dashboardId, userId, action });
}
```

---

## Summary Checklist

- [ ] Clear information hierarchy
- [ ] Consistent colors across charts
- [ ] Meaningful titles and labels
- [ ] Appropriate chart types for data
- [ ] Filters on large datasets
- [ ] Batch operations for multiple blocks
- [ ] Error handling with try-catch
- [ ] Input validation before API calls
- [ ] Retry logic for transient failures
- [ ] Logging for debugging
- [ ] API key in environment variables
- [ ] Regular API key rotation
- [ ] Testing (unit and integration)
- [ ] Performance monitoring
- [ ] Audit logging

Follow these practices for professional, reliable, performant dashboards!
