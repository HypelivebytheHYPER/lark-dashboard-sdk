# Frequently Asked Questions (FAQ)

## Installation & Setup

### Q1: How do I install the SDK?
**A:** Use npm:
```bash
npm install @hypelab/lark-dashboard-sdk
```
Requires Node.js 16+. For TypeScript projects, it includes full type definitions.

### Q2: What's my API region?
**A:** Choose based on your Lark workspace location:
- `'sg'` - Singapore (Southeast Asia)
- `'cn'` - China
- `'us'` - United States

Check your Lark workspace settings or contact your admin.

### Q3: How do I get an API key?
**A:** From Lark Admin Console:
1. Go to: Admin Console > Third-party applications
2. Create a new application
3. Generate an access token
4. Save the API key securely

### Q4: Do I need special permissions for the API key?
**A:** Your API key needs these scopes:
- `bitable:app:write` - Create dashboards
- `bitable:app:read` - Read dashboard data
- `bitable:table:read` - Read table data

Contact your Lark admin to grant these permissions.

### Q5: Can I use multiple API keys?
**A:** Yes, create multiple client instances:
```typescript
const client1 = new LarkDashboardClient({ apiKey: 'key1' });
const client2 = new LarkDashboardClient({ apiKey: 'key2' });
```

### Q6: Is the API key sensitive?
**A:** Yes! Never commit API keys to version control. Use environment variables:
```bash
LARK_API_KEY=your-secret-key
```

---

## Dashboard Creation

### Q7: How do I create a dashboard?
**A:** Use the client's `createDashboard` method:
```typescript
const dashboardId = await client.createDashboard({
  name: 'My Dashboard',
  appToken: 'YOUR_APP_TOKEN'
});
```

### Q8: What's an app token?
**A:** A unique identifier for your Lark Bitable app. Find it in the URL:
`https://app.lark.com/bitable/{APP_TOKEN}`

### Q9: Can I create multiple dashboards in one app?
**A:** Yes, unlimited dashboards per app:
```typescript
for (let i = 1; i <= 5; i++) {
  await client.createDashboard({
    name: `Dashboard ${i}`,
    appToken: 'APP_TOKEN'
  });
}
```

### Q10: How do I delete a dashboard?
**A:** Use the `deleteDashboard` method:
```typescript
await client.deleteDashboard('APP_TOKEN', 'DASHBOARD_ID');
```

### Q11: Can I update a dashboard name?
**A:** Currently, update the dashboard through Lark UI. SDK support coming in v1.1.

### Q12: What's the maximum number of blocks per dashboard?
**A:** No hard limit, but performance degrades beyond 50 blocks. Use tabs/pages to organize.

---

## Chart Creation

### Q13: How many chart types are available?
**A:** 17 types:
- Basic: Bar, Line, Pie, Column, Area
- Advanced: Scatter, Funnel, Radar, Table
- 2025 New: Heatmap, Treemap, Waterfall, Gauge, Bubble, Sankey, Box Plot, Candlestick

### Q14: Which chart type should I use for time series data?
**A:** Line chart:
```typescript
ChartBlockBuilder.line()
  .xAxis({ fieldName: 'Date' })
  .yAxis([{ fieldName: 'Value', aggregation: AggregationType.SUM }])
```

### Q15: Can I have multiple Y-axis items?
**A:** Yes, for line/area charts:
```typescript
.yAxis([
  { fieldName: 'Revenue', aggregation: AggregationType.SUM },
  { fieldName: 'Expenses', aggregation: AggregationType.SUM },
  { fieldName: 'Profit', aggregation: AggregationType.SUM }
])
```

### Q16: How do I change chart colors?
**A:** Use the `colors` method:
```typescript
.colors(['#3b82f6', '#10b981', '#f59e0b'])
```

### Q17: What aggregations are available?
**A:** Six types:
- `SUM` - Total
- `AVG` - Average
- `COUNT` - Number of records
- `DISTINCT_COUNT` - Unique values
- `MAX` - Highest value
- `MIN` - Lowest value

### Q18: Can I sort chart data?
**A:** Data order depends on your table view. Pre-sort your table or use filters.

### Q19: What's the maximum data points per chart?
**A:** Recommended: <10,000 data points. Beyond that, use filters or aggregation.

### Q20: How do I add a title to a chart?
**A:** Use the `title` method:
```typescript
.title('Monthly Revenue 2025')
```

---

## Metrics & KPIs

### Q21: How do I create a metric block?
**A:** Use MetricsBlockBuilder:
```typescript
new MetricsBlockBuilder()
  .dataSource(appToken, tableId)
  .fieldName('Revenue')
  .aggregation(AggregationType.SUM)
  .title('Total Revenue')
  .build()
```

### Q22: How do I format numbers with currency?
**A:** Use `prefix` and `decimals`:
```typescript
.prefix('$')
.decimals(2)
```

### Q23: Can I show trends in metrics?
**A:** Yes, use trend comparison:
```typescript
.trendComparison(30, 'days')  // Compare to last 30 days
```

### Q24: How do I add custom formatting?
**A:** Use `numberFormat`:
```typescript
.numberFormat('1000')  // Adds thousand separators: 1,000
```

### Q25: Can I add a suffix to metrics?
**A:** Yes:
```typescript
.suffix('%')  // Displays as "75%"
```

---

## Filters & Aggregations

### Q26: How do I filter chart data?
**A:** Use the `filters` method:
```typescript
.filters(FilterConjunction.AND, [
  { fieldName: 'Status', operator: FilterOperator.IS, value: 'Active' },
  { fieldName: 'Amount', operator: FilterOperator.GT, value: 1000 }
])
```

### Q27: What's the difference between AND and OR filters?
**A:**
- AND: ALL conditions must be true
- OR: ANY condition can be true

### Q28: What filter operators are available?
**A:** IS, IS_NOT, CONTAINS, DOES_NOT_CONTAIN, STARTS_WITH, ENDS_WITH, IS_EMPTY, IS_NOT_EMPTY, GT, GTE, LT, LTE

### Q29: Can I filter on dates?
**A:** Yes:
```typescript
{ fieldName: 'Date', operator: FilterOperator.GTE, value: '2025-01-01' }
```

### Q30: How do I combine multiple filters?
**A:** Use array syntax:
```typescript
.filters(FilterConjunction.AND, [
  { fieldName: 'Field1', operator: FilterOperator.IS, value: 'Value1' },
  { fieldName: 'Field2', operator: FilterOperator.GT, value: 100 }
])
```

---

## Batch Operations

### Q31: How do I create multiple blocks efficiently?
**A:** Use batch operations:
```typescript
const results = await client.batchCreateBlocks(appToken, [
  block1, block2, block3
]);
```

### Q32: How many blocks can I create at once?
**A:** Recommended: Up to 100 blocks per batch. For more, split into multiple batches.

### Q33: What happens if one block fails in a batch?
**A:** The entire batch may fail. Use fallback to individual creation:
```typescript
try {
  await client.batchCreateBlocks(appToken, blocks);
} catch (error) {
  // Fall back to individual creation
  for (const block of blocks) {
    await client.addBlock(appToken, dashboardId, block);
  }
}
```

### Q34: How do I handle rate limiting?
**A:** Lark allows 600 requests/minute. Use batch operations and add delays between batches.

---

## Error Handling

### Q35: What error types exist?
**A:** ValidationError, NetworkError, AuthenticationError, NotFoundError, RateLimitError

### Q36: How do I handle API errors?
**A:**
```typescript
try {
  await client.createDashboard(config);
} catch (error) {
  if (error.code === 'INVALID_API_KEY') {
    // Handle auth error
  } else if (error.code === 'NETWORK_ERROR') {
    // Handle network error
  }
}
```

### Q37: Should I retry on error?
**A:** Yes, use exponential backoff for transient errors:
```typescript
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    return await operation();
  } catch (error) {
    if (attempt < 3) {
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

### Q38: How do I enable logging for debugging?
**A:** Set `logging: true` in client config:
```typescript
new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  logging: true
})
```

---

## View Blocks

### Q39: How do I embed a table view?
**A:** Use ViewBlockBuilder:
```typescript
ViewBlockBuilder.table()
  .dataSource(appToken, tableId, viewId)
  .title('Data Table')
  .height(400)
  .build()
```

### Q40: What view types are available?
**A:** Grid, Kanban, Gallery, Gantt, Form, Calendar (new), Timeline (new)

### Q41: How do I find the view ID?
**A:** In Lark, open the view. The URL shows: `/views/{VIEW_ID}`

### Q42: Can I edit records in embedded views?
**A:** Yes, if the view has edit permissions enabled.

---

## Permissions

### Q43: How do I set dashboard permissions?
**A:**
```typescript
const perms = new DashboardPermissionBuilder()
  .addOwner('ou_user123')
  .addEditor('og_team456')
  .addViewer('od_department789')
  .build();

await client.setDashboardPermissions(appToken, dashboardId, perms);
```

### Q44: Can I set permissions on individual blocks?
**A:** Yes, use BlockPermissionBuilder for block-level access control.

### Q45: What's the difference between user and group permissions?
**A:**
- User: Specific individual
- Group: Dynamic (automatically includes new members)

Use groups for team-based permissions.

---

## 2025 Features

### Q46: What new chart types were added?
**A:** Heatmap, Treemap, Waterfall, Gauge, Bubble, Sankey, Box Plot, Candlestick

### Q47: What are List blocks?
**A:** Display tabular data with different layout styles: Vertical, Horizontal, Grid, Compact, Detailed

### Q48: What are Tab/Page blocks?
**A:** Organize dashboard blocks into tabs or pages for better UX. Layouts: Horizontal Tabs, Vertical Tabs, Pills

### Q49: What new view types exist?
**A:** Calendar and Timeline views for event and chronological data visualization

### Q50: Are all 2025 features backward compatible?
**A:** Yes, v1.0.0+ includes all 2025 features. No breaking changes.

---

## MCP Integration

### Q51: What is MCP?
**A:** Model Context Protocol - allows Claude Code to interact with the SDK via natural language.

### Q52: How do I set up MCP?
**A:** Add to Claude configuration:
```json
{
  "mcpServers": {
    "lark-dashboard": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@hypelab/lark-dashboard-sdk"],
      "env": {
        "LARK_API_KEY": "your-key",
        "LARK_REGION": "sg"
      }
    }
  }
}
```

### Q53: Can I create dashboards with Claude?
**A:** Yes! Describe what you want in natural language and Claude handles the implementation.

### Q54: What MCP tools are available?
**A:** create_dashboard, create_chart_block, create_metrics_block, create_view_block, create_text_block, list_dashboards, delete_dashboard

---

## Performance

### Q55: Why is my dashboard slow?
**A:** Common causes:
- Large dataset (>10k rows)
- Too many blocks (>50)
- Complex filters
- Unoptimized queries

**Solution:** Filter data, reduce blocks, use pre-aggregated tables.

### Q56: How do I measure dashboard performance?
**A:**
```typescript
const start = performance.now();
await operation();
const duration = performance.now() - start;
console.log(`Took ${duration}ms`);
```

### Q57: Should I enable logging in production?
**A:** No, it impacts performance. Enable only for debugging.

### Q58: How do I cache dashboard data?
**A:** Implement caching layer:
```typescript
const cache = new Map();
// Check cache before API calls
```

---

## Deployment

### Q59: How do I deploy dashboards to production?
**A:** Standard Node.js deployment. Environment variable setup:
```bash
LARK_API_KEY=prod-api-key
LARK_REGION=sg
NODE_ENV=production
```

### Q60: Can I version control my dashboards?
**A:** Save dashboard configurations in JSON, then recreate from code.

---

## Troubleshooting

### Q61: I get "Field not found" error
**A:** Verify field name exactly matches table column (case-sensitive).

### Q62: Charts show no data
**A:** Check:
- Field names are correct
- Data exists in table
- Filters aren't excluding all data
- Aggregation type is valid

### Q63: API calls are slow
**A:** Use filters, batch operations, and monitoring to identify bottlenecks.

### Q64: Invalid API key error
**A:** Verify:
- Key is correct
- Not expired
- Has correct permissions
- Region matches

### Q65: Rate limit error
**A:** Wait before retrying. Use batch operations and add delays between batches.

---

## Getting Help

### Q66: Where's the documentation?
**A:** https://github.com/hypelab/lark-dashboard-sdk

### Q67: How do I report bugs?
**A:** GitHub Issues: https://github.com/hypelab/lark-dashboard-sdk/issues

### Q68: Can I contribute?
**A:** Yes! See CONTRIBUTING.md for guidelines.

### Q69: Email support?
**A:** dev@hypelab.com

### Q70: Is there community support?
**A:** Check GitHub Discussions and issues for community help.

---

## Still Have Questions?

If you don't see your question here:
1. Check the [Tutorials](./TUTORIALS/)
2. Read the [Best Practices Guide](./BEST_PRACTICES.md)
3. Check [Advanced Topics](./ADVANCED_TOPICS.md)
4. Open a GitHub Issue
5. Email: dev@hypelab.com

Happy dashboard building!
