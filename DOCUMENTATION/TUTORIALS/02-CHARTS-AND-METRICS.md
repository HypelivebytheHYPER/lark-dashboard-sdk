# Tutorial 2: Adding Charts & Metrics (15 Minutes)

## What You'll Learn
- Create different types of charts (bar, line, pie, scatter)
- Add KPI metric blocks
- Combine multiple blocks in one dashboard
- Use aggregations effectively
- Configure chart colors and styling

## Prerequisites
- Completed Tutorial 1
- Understand basic chart types
- Sample data in a Lark Bitable app

## Time Estimate: 15 minutes

## Section 1: Chart Types Overview

The SDK supports 8 main chart types. Let's explore each one:

### 1. Bar Charts

Perfect for comparing categories. Use when you want to show quantities side-by-side.

```typescript
import { ChartBlockBuilder, AggregationType } from '@hypelab/lark-dashboard-sdk';

const barChart = ChartBlockBuilder.bar()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Region' })
  .yAxis([
    {
      fieldName: 'Sales',
      aggregation: AggregationType.SUM,
      label: 'Total Sales'
    }
  ])
  .title('Sales by Region')
  .showLegend(true)
  .colors(['#3b82f6', '#10b981', '#f59e0b'])
  .build();
```

**Best for:**
- Comparing values across categories
- Time-based comparisons (months, quarters)
- Regional or departmental analysis

**Aggregations to use:**
- `SUM`: Total sales, total revenue
- `AVG`: Average performance
- `COUNT`: Number of items
- `MAX/MIN`: Peak or lowest values

### 2. Line Charts

Show trends over time. Perfect for time-series data.

```typescript
const lineChart = ChartBlockBuilder.line()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Date' })
  .yAxis([
    {
      fieldName: 'Temperature',
      aggregation: AggregationType.AVG,
      label: 'Avg Temp'
    },
    {
      fieldName: 'Humidity',
      aggregation: AggregationType.AVG,
      label: 'Avg Humidity'
    }
  ])
  .title('Weather Trends')
  .smooth(true) // Smooth curves
  .showLegend(true)
  .build();
```

**Best for:**
- Time-series data (daily, weekly, monthly)
- Trend analysis
- Multiple metrics over time
- Performance tracking

**Tip:** Use multiple Y-axis items to show multiple metrics on the same timeline!

### 3. Pie Charts

Show proportions of a whole. Great for part-to-whole relationships.

```typescript
const pieChart = ChartBlockBuilder.pie()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .series({ fieldName: 'Category' })
  .yAxis([
    {
      fieldName: 'Amount',
      aggregation: AggregationType.SUM,
      label: 'Total Amount'
    }
  ])
  .title('Revenue Distribution')
  .showLegend(true)
  .colors(['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'])
  .build();
```

**Best for:**
- Market share analysis
- Budget allocation
- Category breakdown
- Percentage distribution

**Important:** Pie charts work best with 2-5 categories. More than that becomes hard to read.

### 4. Scatter Plots

Show relationships between two numerical variables.

```typescript
const scatterChart = ChartBlockBuilder.scatter()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Marketing Spend' })
  .yAxis([
    {
      fieldName: 'Revenue',
      aggregation: AggregationType.SUM,
      label: 'Sales Revenue'
    }
  ])
  .title('Marketing ROI Analysis')
  .build();
```

**Best for:**
- Correlation analysis
- Outlier detection
- Relationship visualization
- Quality control charts

### 5. Area Charts

Similar to line charts but with filled area underneath.

```typescript
const areaChart = ChartBlockBuilder.area()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Month' })
  .yAxis([
    {
      fieldName: 'Revenue',
      aggregation: AggregationType.SUM
    }
  ])
  .title('Revenue Trend')
  .stacked(false) // Set to true for stacked areas
  .build();
```

**Best for:**
- Cumulative data
- Multiple series trends
- Magnitude emphasis
- Comparing stacked values

### 6. Column Charts

Vertical bars - great for categorical comparisons.

```typescript
const columnChart = ChartBlockBuilder.column()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Product' })
  .yAxis([
    {
      fieldName: 'Units Sold',
      aggregation: AggregationType.SUM
    }
  ])
  .title('Product Performance')
  .build();
```

**Best for:**
- Product comparisons
- Category rankings
- Frequency distribution
- Performance metrics

### 7. Funnel Charts

Show progression through stages.

```typescript
const funnelChart = ChartBlockBuilder.funnel()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .series({ fieldName: 'Stage' })
  .yAxis([
    {
      fieldName: 'Count',
      aggregation: AggregationType.COUNT
    }
  ])
  .title('Sales Pipeline')
  .build();
```

**Best for:**
- Sales pipeline visualization
- Conversion funnels
- Process stages
- Attrition analysis

### 8. Radar Charts

Show multiple metrics in a circular format.

```typescript
const radarChart = ChartBlockBuilder.radar()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .series({ fieldName: 'Product' })
  .yAxis([
    { fieldName: 'Quality', aggregation: AggregationType.AVG },
    { fieldName: 'Price', aggregation: AggregationType.AVG },
    { fieldName: 'Features', aggregation: AggregationType.AVG },
    { fieldName: 'Support', aggregation: AggregationType.AVG }
  ])
  .title('Product Comparison')
  .build();
```

**Best for:**
- Comparing products across dimensions
- Performance profiles
- Multi-attribute comparison
- Competitive analysis

## Section 2: Understanding Aggregations

Aggregations summarize your data. Here are all available options:

```typescript
enum AggregationType {
  SUM = 'sum',           // Total of all values
  AVG = 'avg',           // Average value
  COUNT = 'count',       // Number of records
  DISTINCT_COUNT = 'distinct_count', // Unique values
  MAX = 'max',           // Highest value
  MIN = 'min',           // Lowest value
  PERCENT = 'percent',   // Percentage of total
}
```

### Real-World Examples

```typescript
// Sales total
{ fieldName: 'Amount', aggregation: AggregationType.SUM, label: 'Total Sales' }

// Average order value
{ fieldName: 'OrderValue', aggregation: AggregationType.AVG, label: 'Avg Order' }

// Customer count
{ fieldName: 'CustomerID', aggregation: AggregationType.DISTINCT_COUNT, label: 'Unique Customers' }

// Highest temperature
{ fieldName: 'Temperature', aggregation: AggregationType.MAX, label: 'Peak Temp' }

// Percentage of budget used
{ fieldName: 'SpentAmount', aggregation: AggregationType.PERCENT, label: '% of Budget' }
```

## Section 3: Metrics Blocks

Metrics are KPI cards showing single important numbers.

### Basic Metric

```typescript
import { MetricsBlockBuilder } from '@hypelab/lark-dashboard-sdk';

const totalRevenueMetric = new MetricsBlockBuilder()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .fieldName('Revenue')
  .aggregation(AggregationType.SUM)
  .title('Total Revenue')
  .build();
```

### Formatted Metric with Currency

```typescript
const revenueMetric = new MetricsBlockBuilder()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .fieldName('Revenue')
  .aggregation(AggregationType.SUM)
  .title('Total Revenue')
  .prefix('$')           // Add currency symbol
  .decimals(2)           // Show 2 decimal places
  .numberFormat('1000')  // Use thousands separator
  .build();
```

### Metric with Trend

```typescript
const growthMetric = new MetricsBlockBuilder()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .fieldName('Revenue')
  .aggregation(AggregationType.SUM)
  .title('Monthly Revenue')
  .prefix('$')
  .decimals(0)
  .trendComparison(30, 'days')  // Compare to last 30 days
  .build();
```

### Metric with Custom Colors

```typescript
const metricWithColors = new MetricsBlockBuilder()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .fieldName('Success Rate')
  .aggregation(AggregationType.AVG)
  .title('Success Rate')
  .suffix('%')
  .decimals(1)
  .color('#10b981')      // Green color
  .build();
```

## Section 4: Complete Dashboard Example

Let's build a complete sales dashboard with multiple blocks:

```typescript
import {
  LarkDashboardClient,
  ChartBlockBuilder,
  MetricsBlockBuilder,
  AggregationType
} from '@hypelab/lark-dashboard-sdk';

const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  region: 'sg',
});

async function createSalesDashboard() {
  // Create dashboard
  const dashboardId = await client.createDashboard({
    name: 'Sales Dashboard 2025',
    appToken: 'YOUR_APP_TOKEN',
  });

  // Block 1: Total Revenue Metric
  const totalRevenueBlock = new MetricsBlockBuilder()
    .dataSource('YOUR_APP_TOKEN', 'sales_table')
    .fieldName('Amount')
    .aggregation(AggregationType.SUM)
    .title('Total Revenue')
    .prefix('$')
    .decimals(0)
    .build();

  await client.addBlock('YOUR_APP_TOKEN', dashboardId, totalRevenueBlock);

  // Block 2: Monthly Sales Trend (Line Chart)
  const monthlyTrendBlock = ChartBlockBuilder.line()
    .dataSource('YOUR_APP_TOKEN', 'sales_table')
    .xAxis({ fieldName: 'Date' })
    .yAxis([
      {
        fieldName: 'Amount',
        aggregation: AggregationType.SUM,
        label: 'Revenue'
      }
    ])
    .title('Revenue Trend')
    .smooth(true)
    .build();

  await client.addBlock('YOUR_APP_TOKEN', dashboardId, monthlyTrendBlock);

  // Block 3: Sales by Region (Bar Chart)
  const regionBreakdownBlock = ChartBlockBuilder.bar()
    .dataSource('YOUR_APP_TOKEN', 'sales_table')
    .xAxis({ fieldName: 'Region' })
    .yAxis([
      {
        fieldName: 'Amount',
        aggregation: AggregationType.SUM,
        label: 'Sales'
      }
    ])
    .title('Sales by Region')
    .colors(['#3b82f6', '#10b981', '#f59e0b', '#ef4444'])
    .build();

  await client.addBlock('YOUR_APP_TOKEN', dashboardId, regionBreakdownBlock);

  // Block 4: Sales Distribution (Pie Chart)
  const distributionBlock = ChartBlockBuilder.pie()
    .dataSource('YOUR_APP_TOKEN', 'sales_table')
    .series({ fieldName: 'Category' })
    .yAxis([
      {
        fieldName: 'Amount',
        aggregation: AggregationType.SUM,
        label: 'Amount'
      }
    ])
    .title('Sales Distribution')
    .build();

  await client.addBlock('YOUR_APP_TOKEN', dashboardId, distributionBlock);

  // Block 5: Order Count Metric
  const orderCountBlock = new MetricsBlockBuilder()
    .dataSource('YOUR_APP_TOKEN', 'sales_table')
    .fieldName('OrderID')
    .aggregation(AggregationType.DISTINCT_COUNT)
    .title('Total Orders')
    .numberFormat('1000')
    .build();

  await client.addBlock('YOUR_APP_TOKEN', dashboardId, orderCountBlock);

  // Block 6: Average Order Value
  const avgOrderBlock = new MetricsBlockBuilder()
    .dataSource('YOUR_APP_TOKEN', 'sales_table')
    .fieldName('Amount')
    .aggregation(AggregationType.AVG)
    .title('Average Order Value')
    .prefix('$')
    .decimals(2)
    .build();

  await client.addBlock('YOUR_APP_TOKEN', dashboardId, avgOrderBlock);

  console.log(`Created dashboard: ${dashboardId}`);
}

createSalesDashboard().catch(console.error);
```

## Section 5: Styling Charts

### Color Schemes

```typescript
// Professional Blue Theme
const blueTheme = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

// Pastel Theme
const pastelTheme = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'];

// Dark Modern Theme
const darkTheme = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

// Apply to chart
const chart = ChartBlockBuilder.bar()
  .dataSource(appToken, tableId)
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Value', aggregation: AggregationType.SUM }])
  .colors(blueTheme)
  .build();
```

### Chart Configuration Options

```typescript
const advancedChart = ChartBlockBuilder.bar()
  .dataSource(appToken, tableId)
  .xAxis({ fieldName: 'Month' })
  .yAxis([{ fieldName: 'Sales', aggregation: AggregationType.SUM }])
  .title('Advanced Chart')
  .showLegend(true)           // Show/hide legend
  .smooth(true)               // For line charts: smooth curves
  .stacked(true)              // For area/column: stack values
  .colors(['#3b82f6'])        // Custom colors
  .build();
```

## Checkpoint: Test Your Knowledge

1. **Question**: When would you use a pie chart vs. a bar chart?
   - **Answer**: Use pie charts for part-to-whole relationships (percentages). Use bar charts for comparing values across categories.

2. **Question**: What aggregation would you use to count unique customers?
   - **Answer**: `DISTINCT_COUNT` on a CustomerID field.

3. **Question**: How do you show multiple metrics on a line chart?
   - **Answer**: Add multiple items to the `.yAxis([])` array.

## Common Mistakes to Avoid

1. **Using pie charts with too many slices**
   - Limit to 2-5 categories for readability

2. **Forgetting aggregation specification**
   - Always specify `.aggregation()` - the SDK won't guess

3. **Mismatched field names**
   - Field names are case-sensitive and must match exactly

4. **Using line charts for non-time-series data**
   - Line charts imply continuity; use bar charts for categories

## Debugging Tips

```typescript
// Enable logging to see API calls
const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  logging: true, // This shows detailed request/response info
});

// Log your chart configuration
const chart = ChartBlockBuilder.bar().build();
console.log('Chart config:', JSON.stringify(chart, null, 2));
```

## Next Steps

- Read [Tutorial 3: Advanced Block Configuration](03-ADVANCED-CONFIGURATION.md)
- Explore filtering and data transformations
- Learn about batch operations

## Summary

You've learned:
- 8 different chart types and when to use each
- How aggregations work
- Creating KPI metric blocks
- Styling and customizing charts
- Building complete multi-block dashboards

You're now ready to create professional, data-driven dashboards!
