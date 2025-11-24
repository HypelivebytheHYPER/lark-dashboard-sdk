# Advanced Topics Guide

## Custom Block Creation

### Creating Extensible Block Types

```typescript
class CustomMetricsBlockBuilder {
  private config: MetricsConfig = {};

  salesMetric(appToken: string, tableId: string) {
    return this.baseMetric(appToken, tableId, 'Amount', AggregationType.SUM)
      .prefix('$')
      .decimals(0)
      .title('Total Sales');
  }

  conversionMetric(appToken: string, tableId: string) {
    return this.baseMetric(appToken, tableId, 'Conversions', AggregationType.SUM)
      .suffix('%')
      .decimals(1)
      .title('Conversion Rate');
  }

  customerMetric(appToken: string, tableId: string) {
    return this.baseMetric(appToken, tableId, 'CustomerID', AggregationType.DISTINCT_COUNT)
      .title('Unique Customers')
      .numberFormat('1000');
  }

  private baseMetric(appToken: string, tableId: string, field: string, agg: AggregationType) {
    return new MetricsBlockBuilder()
      .dataSource(appToken, tableId)
      .fieldName(field)
      .aggregation(agg);
  }
}

// Usage
const customBuilder = new CustomMetricsBlockBuilder();
const salesMetric = customBuilder.salesMetric(appToken, tableId).build();
const conversionMetric = customBuilder.conversionMetric(appToken, tableId).build();
```

### Dynamic Block Generation

```typescript
interface BlockTemplate {
  type: 'chart' | 'metric' | 'table';
  config: any;
}

class DynamicBlockGenerator {
  static fromTemplate(template: BlockTemplate): DashboardBlock {
    switch (template.type) {
      case 'chart':
        return this.createChart(template.config);
      case 'metric':
        return this.createMetric(template.config);
      case 'table':
        return this.createTable(template.config);
      default:
        throw new Error(`Unknown block type: ${template.type}`);
    }
  }

  private static createChart(config: any) {
    const builder = this.getChartBuilder(config.chartType);
    return builder
      .dataSource(config.appToken, config.tableId)
      .xAxis(config.xAxis)
      .yAxis(config.yAxis)
      .title(config.title)
      .build();
  }

  private static getChartBuilder(type: ChartType) {
    switch (type) {
      case ChartType.BAR:
        return ChartBlockBuilder.bar();
      case ChartType.LINE:
        return ChartBlockBuilder.line();
      case ChartType.PIE:
        return ChartBlockBuilder.pie();
      default:
        throw new Error(`Unsupported chart type: ${type}`);
    }
  }

  private static createMetric(config: any) {
    return new MetricsBlockBuilder()
      .dataSource(config.appToken, config.tableId)
      .fieldName(config.fieldName)
      .aggregation(config.aggregation)
      .title(config.title);
  }

  private static createTable(config: any) {
    return ViewBlockBuilder.table()
      .dataSource(config.appToken, config.tableId, config.viewId)
      .title(config.title)
      .height(config.height);
  }
}

// Usage
const templates: BlockTemplate[] = [
  {
    type: 'metric',
    config: {
      appToken: 'app_token',
      tableId: 'table_id',
      fieldName: 'Amount',
      aggregation: AggregationType.SUM,
      title: 'Total Revenue'
    }
  },
  {
    type: 'chart',
    config: {
      appToken: 'app_token',
      tableId: 'table_id',
      chartType: ChartType.BAR,
      xAxis: { fieldName: 'Month' },
      yAxis: [{ fieldName: 'Revenue', aggregation: AggregationType.SUM }],
      title: 'Monthly Revenue'
    }
  }
];

const blocks = templates.map(t => DynamicBlockGenerator.fromTemplate(t));
```

---

## API Rate Limiting Handling

### Understanding Lark Rate Limits

Lark API has rate limits:
- **Tenant API**: 600 requests per minute
- **User API**: 300 requests per minute
- **Dashboard API**: Follows tenant limits

### Rate Limit Aware Client

```typescript
class RateLimitAwareLarkClient {
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private requestsThisMinute = 0;
  private minuteStartTime = Date.now();
  private readonly MAX_REQUESTS_PER_MINUTE = 600;
  private readonly RESET_INTERVAL = 60000;

  async executeWithRateLimit<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      // Reset counter every minute
      const now = Date.now();
      if (now - this.minuteStartTime > this.RESET_INTERVAL) {
        this.requestsThisMinute = 0;
        this.minuteStartTime = now;
      }

      // Check if we've hit the limit
      if (this.requestsThisMinute >= this.MAX_REQUESTS_PER_MINUTE) {
        // Wait until the minute resets
        const waitTime = this.RESET_INTERVAL - (now - this.minuteStartTime);
        console.log(`Rate limit reached. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // Execute next request
      const request = this.requestQueue.shift();
      if (request) {
        this.requestsThisMinute++;
        await request();
      }
    }

    this.isProcessing = false;
  }
}

// Usage
const rateLimitClient = new RateLimitAwareLarkClient();

// These will be automatically queued and rate-limited
for (let i = 0; i < 1000; i++) {
  await rateLimitClient.executeWithRateLimit(async () => {
    await client.addBlock(appToken, dashboardId, blocks[i]);
  });
}
```

### Batch Operations for Rate Limiting

```typescript
async function createBlocksWithRateLimiting(
  appToken: string,
  blocks: DashboardBlock[],
  batchSize: number = 50
) {
  const results = [];

  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = blocks.slice(i, i + batchSize);

    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}...`);

    const batchResults = await client.batchCreateBlocks(appToken, batch);
    results.push(...batchResults);

    // Wait between batches to avoid rate limiting
    if (i + batchSize < blocks.length) {
      console.log('Waiting before next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    }
  }

  return results;
}
```

---

## Batch Operations Best Practices

### Handling Batch Failures

```typescript
interface BatchResult {
  success: boolean;
  blockId?: string;
  error?: Error;
}

async function createBlocksWithErrorHandling(
  appToken: string,
  blocks: DashboardBlock[]
): Promise<BatchResult[]> {
  const results: BatchResult[] = [];

  try {
    const batchResults = await client.batchCreateBlocks(appToken, blocks);

    // Handle successful blocks
    return batchResults.map((result, index) => ({
      success: true,
      blockId: result.blockId
    }));
  } catch (error) {
    console.error('Batch operation failed:', error);

    // Fallback: Create blocks individually with error handling
    for (let i = 0; i < blocks.length; i++) {
      try {
        const blockId = await client.addBlock(appToken, dashboardId, blocks[i]);
        results.push({
          success: true,
          blockId
        });
      } catch (error) {
        results.push({
          success: false,
          error: error as Error
        });
      }
    }

    return results;
  }
}

// Usage
const results = await createBlocksWithErrorHandling(appToken, blocks);
const failures = results.filter(r => !r.success);

if (failures.length > 0) {
  console.error(`${failures.length} blocks failed to create`);
  // Handle failures
}
```

### Resumable Batch Operations

```typescript
async function createBlocksWithResume(
  appToken: string,
  blocks: DashboardBlock[],
  resumeFromIndex: number = 0
) {
  const startIndex = resumeFromIndex;
  const createdBlockIds: string[] = [];

  for (let i = startIndex; i < blocks.length; i += 50) {
    const batch = blocks.slice(i, i + 50);

    try {
      const results = await client.batchCreateBlocks(appToken, batch);
      createdBlockIds.push(...results.map(r => r.blockId));
      console.log(`Created blocks ${i + 1}-${i + batch.length}`);
    } catch (error) {
      console.error(`Failed at index ${i}:`, error);
      // Save progress
      saveProgress({
        lastSuccessfulIndex: i - 1,
        createdBlockIds,
        totalBlocks: blocks.length
      });
      throw error;
    }
  }

  return createdBlockIds;
}

// Save and resume progress
function saveProgress(progress: any) {
  // Write to file or database
  // fs.writeFileSync('dashboard_progress.json', JSON.stringify(progress));
}

function loadProgress() {
  // Read from file or database
  // return JSON.parse(fs.readFileSync('dashboard_progress.json', 'utf-8'));
}
```

---

## Real-Time Data Synchronization

### Polling Strategy

```typescript
class RealtimeDashboardUpdater {
  private updateInterval: NodeJS.Timeout | null = null;
  private lastUpdateTime: number = 0;
  private updateIntervalMs: number = 30000; // 30 seconds

  startPolling(dashboardId: string, appToken: string) {
    console.log(`Starting polling for dashboard ${dashboardId}`);

    this.updateInterval = setInterval(async () => {
      try {
        await this.updateDashboard(dashboardId, appToken);
      } catch (error) {
        console.error('Failed to update dashboard:', error);
      }
    }, this.updateIntervalMs);
  }

  stopPolling() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('Stopped polling');
    }
  }

  private async updateDashboard(dashboardId: string, appToken: string) {
    const now = Date.now();
    const timeSinceLastUpdate = now - this.lastUpdateTime;

    // Only update if significant time has passed
    if (timeSinceLastUpdate < this.updateIntervalMs) {
      return;
    }

    console.log(`Updating dashboard at ${new Date().toISOString()}`);

    // Get latest data
    const metric = new MetricsBlockBuilder()
      .dataSource(appToken, 'table_id')
      .fieldName('Amount')
      .aggregation(AggregationType.SUM)
      .build();

    // Update block
    try {
      await client.updateBlock(appToken, 'block_id', metric);
      this.lastUpdateTime = now;
      console.log('Dashboard updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
    }
  }
}

// Usage
const updater = new RealtimeDashboardUpdater();
updater.startPolling('dsh_abc123', 'app_token');

// Later: stop polling
// updater.stopPolling();
```

### Webhook-Based Updates

```typescript
import express from 'express';

const app = express();

// Lark sends webhooks when data changes
app.post('/webhook/data-changed', async (req, res) => {
  const { tableId, recordId, changedFields } = req.body;

  console.log(`Data changed in table ${tableId}, record ${recordId}`);
  console.log(`Changed fields: ${changedFields.join(', ')}`);

  try {
    // Update affected dashboard blocks
    const affectedBlocks = await findAffectedBlocks(tableId, changedFields);

    for (const blockId of affectedBlocks) {
      await refreshBlock(blockId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

async function findAffectedBlocks(tableId: string, changedFields: string[]) {
  // Query which blocks use these fields
  const blocks = await client.listBlocks(appToken);
  return blocks
    .filter(block =>
      block.dataSource.tableId === tableId &&
      block.config.fields?.some(f => changedFields.includes(f))
    )
    .map(block => block.id);
}

async function refreshBlock(blockId: string) {
  console.log(`Refreshing block ${blockId}`);
  // Re-fetch data and update block
}

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

---

## Performance Tuning

### Query Optimization

```typescript
// SLOW: Aggregating 100k records
const slowChart = ChartBlockBuilder.bar()
  .dataSource(appToken, 'large_table')
  .xAxis({ fieldName: 'Month' })
  .yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
  .build();

// FAST: Pre-aggregated data
const fastChart = ChartBlockBuilder.bar()
  .dataSource(appToken, 'monthly_revenue_summary')  // Pre-aggregated table
  .xAxis({ fieldName: 'Month' })
  .yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
  .build();
```

### Connection Pooling

```typescript
class DashboardClientPool {
  private clients: LarkDashboardClient[] = [];
  private currentIndex = 0;
  private readonly poolSize = 5;

  constructor(apiKey: string) {
    for (let i = 0; i < this.poolSize; i++) {
      this.clients.push(
        new LarkDashboardClient({
          apiKey,
          region: 'sg',
          timeout: 30000,
        })
      );
    }
  }

  getClient(): LarkDashboardClient {
    const client = this.clients[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.poolSize;
    return client;
  }
}

// Usage
const pool = new DashboardClientPool(process.env.LARK_API_KEY!);

// Each operation uses a different client from the pool
for (let i = 0; i < 100; i++) {
  const client = pool.getClient();
  await client.addBlock(appToken, dashboardId, blocks[i]);
}
```

### Caching Strategy

```typescript
class CachingDashboardClient {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  async getTableFields(appToken: string, tableId: string) {
    const cacheKey = `fields:${appToken}:${tableId}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.TTL) {
        console.log('Using cached fields');
        return cached.data;
      }
    }

    // Fetch fresh data
    const fields = await client.getTableFields(appToken, tableId);

    // Cache it
    this.cache.set(cacheKey, {
      data: fields,
      timestamp: Date.now()
    });

    return fields;
  }

  clearCache() {
    this.cache.clear();
  }

  clearCacheEntry(appToken: string, tableId: string) {
    const cacheKey = `fields:${appToken}:${tableId}`;
    this.cache.delete(cacheKey);
  }
}
```

---

## Monitoring and Debugging

### Performance Metrics

```typescript
class DashboardMetrics {
  private metrics: Map<string, number[]> = new Map();

  recordTime(operation: string, durationMs: number) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(durationMs);
  }

  getStats(operation: string) {
    const times = this.metrics.get(operation) || [];
    if (times.length === 0) return null;

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const count = times.length;

    return { avg, min, max, count };
  }

  printReport() {
    console.log('Performance Report:');
    for (const [operation, times] of this.metrics) {
      const stats = this.getStats(operation);
      console.log(`  ${operation}:`);
      console.log(`    Avg: ${stats.avg.toFixed(2)}ms`);
      console.log(`    Min: ${stats.min}ms`);
      console.log(`    Max: ${stats.max}ms`);
      console.log(`    Count: ${stats.count}`);
    }
  }
}

// Usage
const metrics = new DashboardMetrics();

const start = performance.now();
const dashboardId = await client.createDashboard(config);
metrics.recordTime('createDashboard', performance.now() - start);

metrics.printReport();
```

### Request/Response Logging

```typescript
class LoggingClient extends LarkDashboardClient {
  async addBlock(appToken: string, dashboardId: string, block: DashboardBlock) {
    const requestId = `req_${Date.now()}`;

    console.log(JSON.stringify({
      type: 'REQUEST',
      requestId,
      method: 'POST',
      endpoint: `/dashboards/${dashboardId}/blocks`,
      appToken,
      blockType: block.type,
      timestamp: new Date().toISOString()
    }));

    try {
      const blockId = await super.addBlock(appToken, dashboardId, block);

      console.log(JSON.stringify({
        type: 'RESPONSE',
        requestId,
        status: 200,
        blockId,
        timestamp: new Date().toISOString()
      }));

      return blockId;
    } catch (error) {
      console.error(JSON.stringify({
        type: 'ERROR',
        requestId,
        error: error.message,
        timestamp: new Date().toISOString()
      }));

      throw error;
    }
  }
}
```

---

## Advanced Features

### Conditional Rendering

```typescript
async function createConditionalDashboard(
  config: {
    showFinancials: boolean;
    showHR: boolean;
    showOperations: boolean;
  }
) {
  const blocks = [];

  // Only add financial blocks if authorized
  if (config.showFinancials) {
    blocks.push(
      new MetricsBlockBuilder()
        .dataSource(appToken, 'financials')
        .fieldName('Revenue')
        .aggregation(AggregationType.SUM)
        .title('Total Revenue')
        .build()
    );
  }

  // Only add HR blocks if authorized
  if (config.showHR) {
    blocks.push(
      new MetricsBlockBuilder()
        .dataSource(appToken, 'hr')
        .fieldName('EmployeeID')
        .aggregation(AggregationType.COUNT)
        .title('Headcount')
        .build()
    );
  }

  // Only add operations blocks if authorized
  if (config.showOperations) {
    blocks.push(
      ChartBlockBuilder.bar()
        .dataSource(appToken, 'operations')
        .xAxis({ fieldName: 'Department' })
        .yAxis([{ fieldName: 'Cost', aggregation: AggregationType.SUM }])
        .build()
    );
  }

  return blocks;
}
```

### Dynamic Field Selection

```typescript
async function createDynamicChart(
  appToken: string,
  tableId: string,
  selectedFields: string[]
) {
  // Fetch available fields
  const allFields = await client.getTableFields(appToken, tableId);

  // Validate selected fields exist
  const validFields = selectedFields.filter(f =>
    allFields.some(af => af.name === f)
  );

  // Create Y-axis from selected fields
  const yAxisItems = validFields.map(field => ({
    fieldName: field,
    aggregation: AggregationType.SUM,
    label: field
  }));

  return ChartBlockBuilder.bar()
    .dataSource(appToken, tableId)
    .xAxis({ fieldName: 'Category' })
    .yAxis(yAxisItems)
    .build();
}
```

---

## Summary

Advanced SDK usage enables:
- Custom reusable components
- Proper rate limit handling
- Efficient batch operations
- Real-time data updates
- Performance optimization
- Comprehensive monitoring

Master these advanced techniques for production-grade dashboard systems!
