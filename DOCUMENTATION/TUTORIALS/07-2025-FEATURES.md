# Tutorial 7: Using 2025 Features (20 Minutes)

## What You'll Learn
- New chart types (Heatmap, Treemap, Waterfall, Gauge, Bubble, Sankey, etc.)
- List blocks for tabular data
- Tab/Page blocks for organization
- Calendar and Timeline views
- Filter blocks for interactivity

## Prerequisites
- Completed Tutorials 1-6
- SDK version 1.0.0+
- Understanding of basic block creation

## Time Estimate: 20 minutes

## Section 1: New 2025 Chart Types

### Heatmap Charts

Visualize intensity patterns in 2D matrix.

```typescript
import { ChartBlockBuilder, AggregationType } from '@hypelab/lark-dashboard-sdk';

const heatmapChart = ChartBlockBuilder.heatmap()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Hour' })
  .yAxis([
    {
      fieldName: 'DayOfWeek',
      aggregation: AggregationType.SUM,
      label: 'Activity Intensity'
    }
  ])
  .title('Website Traffic Heatmap')
  .colors(['#2563eb', '#0ea5e9', '#fbbf24', '#f97316'])
  .build();

// Use cases:
// - Website traffic patterns (hour × day)
// - Customer activity by time
// - Sensor data intensity
// - Correlation visualization
```

### Treemap Charts

Show hierarchical data with proportional rectangles.

```typescript
const treemapChart = ChartBlockBuilder.treemap()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .series({ fieldName: 'Category' })
  .yAxis([
    {
      fieldName: 'Revenue',
      aggregation: AggregationType.SUM,
      label: 'Sales'
    }
  ])
  .title('Revenue by Category Hierarchy')
  .build();

// Use cases:
// - Market share visualization
// - Budget allocation
// - Portfolio composition
// - File/folder size visualization
```

### Waterfall Charts

Show cumulative effect of positive and negative changes.

```typescript
const waterfallChart = ChartBlockBuilder.waterfall()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Category' })
  .yAxis([
    {
      fieldName: 'Amount',
      aggregation: AggregationType.SUM,
      label: 'Change'
    }
  ])
  .title('Revenue Build-up Analysis')
  .build();

// Use cases:
// - Profit and loss statement
// - Sales pipeline progression
// - Project budget changes
// - Inventory fluctuations
```

### Gauge Charts

Show progress toward a goal with semi-circular gauge.

```typescript
const gaugeChart = ChartBlockBuilder.gauge()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .fieldName('CompletionPercentage')
  .aggregation(AggregationType.AVG)
  .title('Project Completion')
  .minValue(0)
  .maxValue(100)
  .thresholds([
    { value: 33, color: '#ef4444' },  // Red
    { value: 66, color: '#f59e0b' },  // Orange
    { value: 100, color: '#10b981' }  // Green
  ])
  .build();

// Use cases:
// - Progress tracking
// - KPI achievement
// - Performance scoring
// - Resource utilization
```

### Bubble Charts (Enhanced)

Show three dimensions with bubble position and size.

```typescript
const bubbleChart = ChartBlockBuilder.bubble()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'MarketingSpend' })
  .yAxis([
    {
      fieldName: 'Revenue',
      aggregation: AggregationType.SUM,
      label: 'Sales'
    },
    {
      fieldName: 'CustomerCount',
      aggregation: AggregationType.DISTINCT_COUNT,
      label: 'Bubble Size'
    }
  ])
  .series({ fieldName: 'Region' })
  .title('Sales Performance Analysis')
  .build();

// Use cases:
// - ROI analysis (spend vs. revenue)
// - Market positioning (x × y × size)
// - Scientific data visualization
// - Portfolio management
```

### Sankey Diagrams

Show flows between categories and quantities.

```typescript
const sankeyChart = ChartBlockBuilder.sankey()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .source({ fieldName: 'SourceCategory' })
  .target({ fieldName: 'DestinationCategory' })
  .yAxis([
    {
      fieldName: 'Amount',
      aggregation: AggregationType.SUM,
      label: 'Flow Volume'
    }
  ])
  .title('Customer Journey Flow')
  .build();

// Use cases:
// - Customer journey mapping
// - Energy flow
// - Supply chain
// - Website navigation flow
```

### Box Plot Charts

Show statistical distribution and outliers.

```typescript
const boxplotChart = ChartBlockBuilder.boxplot()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Department' })
  .yAxis([
    {
      fieldName: 'Salary',
      aggregation: AggregationType.AVG,
      label: 'Salary Distribution'
    }
  ])
  .title('Salary Distribution by Department')
  .build();

// Use cases:
// - Statistical analysis
// - Quality control
// - Outlier detection
// - Distribution comparison
```

### Candlestick Charts

Show OHLC (Open, High, Low, Close) data for stocks/trends.

```typescript
const candlestickChart = ChartBlockBuilder.candlestick()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Date' })
  .open({ fieldName: 'OpenPrice' })
  .high({ fieldName: 'HighPrice' })
  .low({ fieldName: 'LowPrice' })
  .close({ fieldName: 'ClosePrice' })
  .title('Stock Price Movement')
  .build();

// Use cases:
// - Stock price analysis
// - Currency trends
// - Commodity pricing
// - Cryptocurrency analysis
```

## Section 2: List Blocks (New 2025)

Display data as formatted lists with flexible layouts.

```typescript
import { ListBlockBuilder, ListLayoutStyle } from '@hypelab/lark-dashboard-sdk';

// Vertical List Layout
const verticalList = new ListBlockBuilder()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .layout(ListLayoutStyle.VERTICAL)
  .title('Recent Orders')
  .displayFields(['OrderID', 'CustomerName', 'Amount', 'Date'])
  .itemsPerPage(10)
  .build();

// Horizontal List Layout
const horizontalList = new ListBlockBuilder()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .layout(ListLayoutStyle.HORIZONTAL)
  .title('Top Products')
  .displayFields(['ProductName', 'Price', 'Rating'])
  .itemsPerPage(5)
  .build();

// Grid Layout
const gridList = new ListBlockBuilder()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .layout(ListLayoutStyle.GRID)
  .title('Product Catalog')
  .displayFields(['ProductImage', 'ProductName', 'Price'])
  .itemsPerPage(12)
  .gridColumns(4)
  .build();

// Compact Layout
const compactList = new ListBlockBuilder()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .layout(ListLayoutStyle.COMPACT)
  .title('Task List')
  .displayFields(['TaskName', 'Status', 'Priority'])
  .itemsPerPage(20)
  .build();

// Detailed Layout
const detailedList = new ListBlockBuilder()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .layout(ListLayoutStyle.DETAILED)
  .title('Customer Details')
  .displayFields(['CustomerName', 'Email', 'Phone', 'Company', 'Status'])
  .itemsPerPage(8)
  .expandableDetails(true)
  .build();
```

### List Block Features

```typescript
const advancedList = new ListBlockBuilder()
  .dataSource(APP_TOKEN, TABLE_ID)
  .layout(ListLayoutStyle.VERTICAL)
  .displayFields(['Name', 'Email', 'Status'])
  .itemsPerPage(15)
  .sortBy('Name', 'asc')          // Sort field
  .filterExpression('Status = "Active"')  // Filter data
  .searchEnabled(true)            // Enable search
  .expandableDetails(true)        // Show more on expand
  .highlightField('Status')       // Highlight important field
  .build();
```

## Section 3: Tab/Page Blocks (New 2025)

Organize dashboard blocks into tabs or pages.

```typescript
import { TabPageBlockBuilder, TabPageLayout } from '@hypelab/lark-dashboard-sdk';

// Horizontal Tabs Layout
const horizontalTabs = new TabPageBlockBuilder()
  .layout(TabPageLayout.HORIZONTAL_TABS)
  .title('Dashboard Navigation')
  .addTab({
    name: 'Overview',
    blocks: [
      // Your overview blocks here
    ]
  })
  .addTab({
    name: 'Detailed Analysis',
    blocks: [
      // Your analysis blocks here
    ]
  })
  .addTab({
    name: 'Reports',
    blocks: [
      // Your report blocks here
    ]
  })
  .build();

// Vertical Tabs Layout
const verticalTabs = new TabPageBlockBuilder()
  .layout(TabPageLayout.VERTICAL_TABS)
  .addTab({
    name: 'Sales',
    blocks: [salesChart1, salesChart2, salesTable]
  })
  .addTab({
    name: 'Marketing',
    blocks: [marketingChart1, marketingMetrics]
  })
  .addTab({
    name: 'Operations',
    blocks: [opsChart1, opsMetrics]
  })
  .build();

// Pills Layout (compact)
const pillsLayout = new TabPageBlockBuilder()
  .layout(TabPageLayout.PILLS)
  .addTab({
    name: 'Q1',
    blocks: [q1Chart, q1Metrics]
  })
  .addTab({
    name: 'Q2',
    blocks: [q2Chart, q2Metrics]
  })
  .addTab({
    name: 'Q3',
    blocks: [q3Chart, q3Metrics]
  })
  .addTab({
    name: 'Q4',
    blocks: [q4Chart, q4Metrics]
  })
  .build();
```

## Section 4: New View Types

### Calendar View (New 2025)

Display records as calendar events.

```typescript
import { ViewBlockBuilder } from '@hypelab/lark-dashboard-sdk';

const calendarView = ViewBlockBuilder.calendar()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID', 'YOUR_VIEW_ID')
  .title('Event Calendar')
  .height(500)
  .build();

// Use cases:
// - Event scheduling
// - Project milestones
// - Meeting calendar
// - Deadline tracking
```

### Timeline View (New 2025)

Show events in chronological order.

```typescript
const timelineView = ViewBlockBuilder.timeline()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID', 'YOUR_VIEW_ID')
  .title('Project Timeline')
  .height(400)
  .groupByField('Phase')
  .build();

// Use cases:
// - Project phases
// - Historical events
// - Process steps
// - Release roadmap
```

## Section 5: Filter Blocks (New 2025)

Create interactive filters that affect multiple blocks.

```typescript
import { FilterBlockBuilder } from '@hypelab/lark-dashboard-sdk';

const filterBlock = new FilterBlockBuilder()
  .filterField('Region')
  .filterType('select')  // or 'date_range', 'number_range', 'search'
  .title('Select Region')
  .defaultValue('North America')
  .affectBlocks(['block_sales_chart', 'block_revenue_metric'])
  .build();

// Date range filter
const dateFilter = new FilterBlockBuilder()
  .filterField('Date')
  .filterType('date_range')
  .title('Select Date Range')
  .defaultStart('2025-01-01')
  .defaultEnd('2025-03-31')
  .affectBlocks(['block_trend_chart', 'block_data_table'])
  .build();

// Number range filter
const numberFilter = new FilterBlockBuilder()
  .filterField('Amount')
  .filterType('number_range')
  .title('Revenue Range')
  .minValue(0)
  .maxValue(100000)
  .defaultMin(10000)
  .defaultMax(50000)
  .affectBlocks(['block_amount_chart', 'block_transactions_table'])
  .build();
```

## Section 6: Complete 2025 Dashboard Example

```typescript
import {
  LarkDashboardClient,
  ChartBlockBuilder,
  ListBlockBuilder,
  TabPageBlockBuilder,
  ViewBlockBuilder,
  TextBlockBuilder,
  AggregationType,
  ListLayoutStyle,
  TabPageLayout
} from '@hypelab/lark-dashboard-sdk';

async function create2025Dashboard() {
  const client = new LarkDashboardClient({
    apiKey: process.env.LARK_API_KEY!,
    region: 'sg',
    logging: true,
  });

  const APP_TOKEN = 'YOUR_APP_TOKEN';

  // Create dashboard
  const dashboardId = await client.createDashboard({
    name: '2025 Analytics Dashboard',
    appToken: APP_TOKEN,
    description: 'Showcasing all 2025 features',
  });

  console.log('Creating dashboard with 2025 features...');

  // Section 1: Title
  const title = new TextBlockBuilder()
    .heading('2025 Dashboard Analytics')
    .alignment('center')
    .build();

  // Section 2: Key Metrics
  const totalRevenueMetric = new MetricsBlockBuilder()
    .dataSource(APP_TOKEN, 'sales_2025')
    .fieldName('Amount')
    .aggregation(AggregationType.SUM)
    .title('Total Revenue')
    .prefix('$')
    .build();

  // Section 3: New Chart Types
  const heatmap = ChartBlockBuilder.heatmap()
    .dataSource(APP_TOKEN, 'traffic_2025')
    .xAxis({ fieldName: 'Hour' })
    .yAxis([{ fieldName: 'Visitors', aggregation: AggregationType.COUNT }])
    .title('Website Traffic Heatmap')
    .build();

  const treemap = ChartBlockBuilder.treemap()
    .dataSource(APP_TOKEN, 'sales_2025')
    .series({ fieldName: 'Category' })
    .yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
    .title('Revenue Distribution')
    .build();

  const waterfall = ChartBlockBuilder.waterfall()
    .dataSource(APP_TOKEN, 'financials_2025')
    .xAxis({ fieldName: 'Month' })
    .yAxis([{ fieldName: 'Change', aggregation: AggregationType.SUM }])
    .title('Profit Analysis')
    .build();

  const gauge = ChartBlockBuilder.gauge()
    .dataSource(APP_TOKEN, 'goals_2025')
    .fieldName('ProgressPercent')
    .aggregation(AggregationType.AVG)
    .title('Q1 Goal Progress')
    .minValue(0)
    .maxValue(100)
    .build();

  const sankey = ChartBlockBuilder.sankey()
    .dataSource(APP_TOKEN, 'funnel_2025')
    .source({ fieldName: 'Source' })
    .target({ fieldName: 'Destination' })
    .yAxis([{ fieldName: 'Count', aggregation: AggregationType.SUM }])
    .title('Customer Journey Flow')
    .build();

  // Section 4: List Block
  const customerList = new ListBlockBuilder()
    .dataSource(APP_TOKEN, 'customers_2025')
    .layout(ListLayoutStyle.DETAILED)
    .title('Top Customers')
    .displayFields(['CustomerName', 'Email', 'Lifetime Value', 'Status'])
    .itemsPerPage(10)
    .sortBy('Lifetime Value', 'desc')
    .build();

  // Section 5: Tab Layout
  const quarterlyTabs = new TabPageBlockBuilder()
    .layout(TabPageLayout.PILLS)
    .addTab({
      name: 'Q1 2025',
      blocks: [
        ChartBlockBuilder.line()
          .dataSource(APP_TOKEN, 'sales_2025')
          .xAxis({ fieldName: 'Date' })
          .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
          .title('Q1 Revenue Trend')
          .build(),
        new MetricsBlockBuilder()
          .dataSource(APP_TOKEN, 'sales_2025')
          .fieldName('Amount')
          .aggregation(AggregationType.SUM)
          .title('Q1 Total')
          .prefix('$')
          .build()
      ]
    })
    .addTab({
      name: 'Q2 2025',
      blocks: [
        ChartBlockBuilder.line()
          .dataSource(APP_TOKEN, 'sales_2025')
          .xAxis({ fieldName: 'Date' })
          .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
          .title('Q2 Revenue Trend')
          .build()
      ]
    })
    .build();

  // Section 6: Calendar and Timeline Views
  const eventCalendar = ViewBlockBuilder.calendar()
    .dataSource(APP_TOKEN, 'events_2025', 'view_calendar')
    .title('2025 Event Calendar')
    .height(400)
    .build();

  const projectTimeline = ViewBlockBuilder.timeline()
    .dataSource(APP_TOKEN, 'projects_2025', 'view_timeline')
    .title('Project Timeline')
    .height(300)
    .build();

  // Create all blocks
  const blocks = [
    title,
    totalRevenueMetric,
    heatmap,
    treemap,
    waterfall,
    gauge,
    sankey,
    customerList,
    quarterlyTabs,
    eventCalendar,
    projectTimeline,
  ];

  const results = await client.batchCreateBlocks(APP_TOKEN, blocks);

  console.log(`Successfully created ${results.length} blocks with 2025 features!`);
  console.log(`Dashboard ID: ${dashboardId}`);

  return dashboardId;
}

create2025Dashboard().catch(console.error);
```

## Section 7: When to Use Each 2025 Feature

| Feature | Best For | Example |
|---------|----------|---------|
| **Heatmap** | Pattern detection, intensity mapping | Website traffic by hour/day |
| **Treemap** | Hierarchical data, proportions | Budget allocation, file sizes |
| **Waterfall** | Cumulative changes, flow analysis | P&L statement, pipeline |
| **Gauge** | Progress toward goals, KPI targets | Completion %, utilization % |
| **Bubble** | 3-variable correlation | ROI analysis, market positioning |
| **Sankey** | Flow visualization, journey mapping | Customer journey, supply chain |
| **Box Plot** | Statistical distribution | Quality control, outlier detection |
| **Candlestick** | OHLC data, trends | Stock prices, trends |
| **List Block** | Tabular data with formats | Product catalog, customer list |
| **Tab Pages** | Dashboard organization | Multi-quarter reports, team views |
| **Calendar** | Event tracking | Meetings, deadlines, events |
| **Timeline** | Chronological events | Project phases, roadmap |
| **Filter Block** | Interactive filtering | Multi-block filtering |

## Section 8: Performance Notes

### Large Datasets
- Heatmaps and Treemaps work best with <1000 data points
- Use filters to reduce data before visualization
- Consider pre-aggregating data in the source table

### Mobile Responsiveness
- Vertical tabs work better on mobile
- Gauge charts are responsive
- Ensure list items are readable on small screens

### Rendering Performance
- Tab pages load all tabs initially (consider lazy loading)
- Filter blocks update all affected blocks simultaneously
- Use batch operations when creating multiple blocks

## Checkpoint: Self-Assessment

1. **When would you use a Sankey diagram?**
   - Answer: When visualizing flows or journeys between categories

2. **What layout style is best for a product catalog?**
   - Answer: Grid layout with ListBlockBuilder

3. **How do tab pages improve dashboard UX?**
   - Answer: Organize content logically, reduce cognitive load, improve scannability

## Next Steps

- Explore advanced customization options
- Implement interactive filter blocks
- Build modern, organized dashboards with tabs

## Summary

You've learned:
- All 8 new 2025 chart types and their use cases
- List blocks with multiple layout options
- Tab/Page blocks for organization
- New Calendar and Timeline views
- Filter blocks for interactivity

You can now build cutting-edge, modern dashboards with all 2025 features!
