# Tutorial 5: Building Multi-Source Dashboards (30 Minutes)

## What You'll Learn
- Combine data from multiple Bitable tables
- Correlate data from different sources
- Handle different aggregation types together
- Optimize multi-source queries
- Real-world multi-source patterns

## Prerequisites
- Completed Tutorials 1-4
- Understanding of filters and aggregations
- Multiple Lark Bitable apps or tables
- Advanced JavaScript/TypeScript knowledge

## Time Estimate: 30 minutes

## Section 1: Multi-Source Dashboard Fundamentals

Multi-source dashboards combine data from different tables, apps, or even external sources.

### Architecture Overview

```
Dashboard Container
├── Block 1: Data from Table A (app_token_1)
├── Block 2: Data from Table B (app_token_1)
├── Block 3: Data from Table C (app_token_2)
├── Block 4: Data from Table D (app_token_3)
└── Block 5: Computed metric combining above
```

### Why Multi-Source Dashboards?

1. **Holistic View**: See data across multiple systems
2. **Correlations**: Find relationships between different data sources
3. **Completeness**: Single dashboard for entire business
4. **Flexibility**: Mix operational and analytical data

## Section 2: Combining Data from Multiple Tables

### Example: Sales and Marketing Dashboard

Let's combine data from three tables in one app:

```typescript
import {
  LarkDashboardClient,
  ChartBlockBuilder,
  MetricsBlockBuilder,
  ViewBlockBuilder,
  AggregationType,
  FilterConjunction,
  FilterOperator
} from '@hypelab/lark-dashboard-sdk';

const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  region: 'sg',
  logging: true,
});

async function createSalesMarketingDashboard() {
  // All data is in the same app, different tables
  const APP_TOKEN = 'bitable_business_2025';

  // Create dashboard
  const dashboardId = await client.createDashboard({
    name: 'Sales & Marketing Dashboard',
    appToken: APP_TOKEN,
    description: 'Combined view of sales and marketing metrics',
  });

  console.log('Created dashboard:', dashboardId);

  // Prepare all blocks from different sources
  const blocks = [
    // === SALES METRICS (from sales_transactions table) ===

    new MetricsBlockBuilder()
      .dataSource(APP_TOKEN, 'tbl_sales_transactions')
      .fieldName('Amount')
      .aggregation(AggregationType.SUM)
      .title('Total Revenue')
      .prefix('$')
      .decimals(0)
      .build(),

    new MetricsBlockBuilder()
      .dataSource(APP_TOKEN, 'tbl_sales_transactions')
      .fieldName('TransactionID')
      .aggregation(AggregationType.COUNT)
      .title('Total Orders')
      .numberFormat('1000')
      .build(),

    // === MARKETING METRICS (from marketing_campaigns table) ===

    new MetricsBlockBuilder()
      .dataSource(APP_TOKEN, 'tbl_marketing_campaigns')
      .fieldName('InfluencerID')
      .aggregation(AggregationType.DISTINCT_COUNT)
      .title('Active Influencers')
      .build(),

    new MetricsBlockBuilder()
      .dataSource(APP_TOKEN, 'tbl_marketing_campaigns')
      .fieldName('CampaignBudget')
      .aggregation(AggregationType.SUM)
      .title('Total Campaign Budget')
      .prefix('$')
      .decimals(0)
      .build(),

    // === SALES TRENDS (line chart from sales table) ===

    ChartBlockBuilder.line()
      .dataSource(APP_TOKEN, 'tbl_sales_transactions')
      .xAxis({ fieldName: 'TransactionDate' })
      .yAxis([
        {
          fieldName: 'Amount',
          aggregation: AggregationType.SUM,
          label: 'Revenue'
        }
      ])
      .title('Daily Revenue Trend')
      .smooth(true)
      .build(),

    // === MARKETING ROI (bar chart comparing spend vs revenue) ===

    ChartBlockBuilder.bar()
      .dataSource(APP_TOKEN, 'tbl_marketing_campaigns')
      .xAxis({ fieldName: 'CampaignName' })
      .yAxis([
        {
          fieldName: 'CampaignBudget',
          aggregation: AggregationType.SUM,
          label: 'Budget Spent'
        }
      ])
      .title('Campaign Spend Breakdown')
      .build(),

    // === CUSTOMER ACQUISITION (scatter from customers table) ===

    ChartBlockBuilder.scatter()
      .dataSource(APP_TOKEN, 'tbl_customers')
      .xAxis({ fieldName: 'AcquisitionCost' })
      .yAxis([
        {
          fieldName: 'LifetimeValue',
          aggregation: AggregationType.SUM,
          label: 'Customer Value'
        }
      ])
      .title('Customer Acquisition vs Value')
      .build(),

    // === SALES BY CHANNEL (pie from transactions) ===

    ChartBlockBuilder.pie()
      .dataSource(APP_TOKEN, 'tbl_sales_transactions')
      .series({ fieldName: 'SalesChannel' })
      .yAxis([
        {
          fieldName: 'Amount',
          aggregation: AggregationType.SUM,
          label: 'Revenue'
        }
      ])
      .title('Revenue by Channel')
      .build(),

    // === TRANSACTION DETAILS TABLE ===

    ViewBlockBuilder.table()
      .dataSource(APP_TOKEN, 'tbl_sales_transactions', 'view_recent_sales')
      .title('Recent Transactions')
      .height(400)
      .showToolbar(true)
      .build(),

    // === CAMPAIGN PERFORMANCE TABLE ===

    ViewBlockBuilder.table()
      .dataSource(APP_TOKEN, 'tbl_marketing_campaigns', 'view_active_campaigns')
      .title('Active Campaigns')
      .height(400)
      .showToolbar(true)
      .build(),
  ];

  // Create all blocks at once
  const results = await client.batchCreateBlocks(APP_TOKEN, blocks);

  console.log(`Successfully created ${results.length} blocks:`);
  results.forEach((result, index) => {
    console.log(`  ${index + 1}. Block ID: ${result.blockId}`);
  });

  return dashboardId;
}

createSalesMarketingDashboard().catch(console.error);
```

## Section 3: Advanced Multi-Source Patterns

### Pattern 1: Hierarchy with Filters

Show related data across tables with matching filters:

```typescript
// User selects a region - show all related data for that region
const region = 'North America';

const multiSourceBlocks = [
  // Regional sales
  ChartBlockBuilder.bar()
    .dataSource(APP_TOKEN, 'sales')
    .xAxis({ fieldName: 'Month' })
    .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
    .filters(FilterConjunction.AND, [
      { fieldName: 'Region', operator: FilterOperator.IS, value: region }
    ])
    .title(`Sales - ${region}`)
    .build(),

  // Regional customers
  new MetricsBlockBuilder()
    .dataSource(APP_TOKEN, 'customers')
    .fieldName('CustomerID')
    .aggregation(AggregationType.DISTINCT_COUNT)
    .title(`Customers - ${region}`)
    .build()
    .filters(FilterConjunction.AND, [
      { fieldName: 'Region', operator: FilterOperator.IS, value: region }
    ]),

  // Regional marketing spend
  new MetricsBlockBuilder()
    .dataSource(APP_TOKEN, 'campaigns')
    .fieldName('Budget')
    .aggregation(AggregationType.SUM)
    .title(`Marketing Budget - ${region}`)
    .prefix('$')
    .build()
    .filters(FilterConjunction.AND, [
      { fieldName: 'TargetRegion', operator: FilterOperator.IS, value: region }
    ]),
];
```

### Pattern 2: Time-Series Correlation

Show multiple metrics over time:

```typescript
const correlationBlocks = [
  // Marketing spend over time
  ChartBlockBuilder.line()
    .dataSource(APP_TOKEN, 'marketing_spend')
    .xAxis({ fieldName: 'Date' })
    .yAxis([
      {
        fieldName: 'SpentAmount',
        aggregation: AggregationType.SUM,
        label: 'Marketing Spend'
      }
    ])
    .title('Spend vs Revenue Correlation')
    .build(),

  // Revenue over the same time period
  ChartBlockBuilder.line()
    .dataSource(APP_TOKEN, 'sales_transactions')
    .xAxis({ fieldName: 'TransactionDate' })
    .yAxis([
      {
        fieldName: 'Amount',
        aggregation: AggregationType.SUM,
        label: 'Revenue'
      }
    ])
    .title('Revenue Trend (same period)')
    .build(),

  // You can then visually compare these side-by-side
];
```

### Pattern 3: Aggregated Summary + Detail View

Show summary metrics and detailed tables:

```typescript
const summaryDetailBlocks = [
  // Summary metrics
  new MetricsBlockBuilder()
    .dataSource(APP_TOKEN, 'orders')
    .fieldName('OrderID')
    .aggregation(AggregationType.COUNT)
    .title('Total Orders')
    .build(),

  new MetricsBlockBuilder()
    .dataSource(APP_TOKEN, 'orders')
    .fieldName('Amount')
    .aggregation(AggregationType.AVG)
    .title('Average Order Value')
    .prefix('$')
    .build(),

  // Detailed table with all orders
  ViewBlockBuilder.table()
    .dataSource(APP_TOKEN, 'orders', 'view_all_orders')
    .title('All Orders (Detailed)')
    .height(500)
    .showToolbar(true)
    .build(),

  // Filtered table - High value orders
  ViewBlockBuilder.table()
    .dataSource(APP_TOKEN, 'orders', 'view_high_value')
    .title('High Value Orders (>$1000)')
    .height(400)
    .showToolbar(true)
    .build(),
];
```

## Section 4: Real-World Multi-Source Scenarios

### Scenario 1: E-Commerce Dashboard

```typescript
async function createEcommerceDashboard() {
  const APP = 'bitable_ecommerce_2025';

  // Tables: products, orders, customers, inventory, reviews, marketing

  const blocks = [
    // Revenue KPIs
    new MetricsBlockBuilder()
      .dataSource(APP, 'orders')
      .fieldName('Amount')
      .aggregation(AggregationType.SUM)
      .title('Total Revenue')
      .prefix('$')
      .build(),

    // Inventory KPI
    new MetricsBlockBuilder()
      .dataSource(APP, 'inventory')
      .fieldName('Quantity')
      .aggregation(AggregationType.SUM)
      .title('Total Inventory')
      .build(),

    // Customer satisfaction
    new MetricsBlockBuilder()
      .dataSource(APP, 'reviews')
      .fieldName('Rating')
      .aggregation(AggregationType.AVG)
      .title('Average Review Rating')
      .suffix('/5')
      .decimals(1)
      .build(),

    // Sales by product
    ChartBlockBuilder.bar()
      .dataSource(APP, 'orders')
      .xAxis({ fieldName: 'ProductName' })
      .yAxis([
        { fieldName: 'Amount', aggregation: AggregationType.SUM, label: 'Revenue' },
        { fieldName: 'OrderID', aggregation: AggregationType.COUNT, label: 'Orders' }
      ])
      .title('Top Products by Revenue')
      .build(),

    // Inventory status
    ChartBlockBuilder.bar()
      .dataSource(APP, 'inventory')
      .xAxis({ fieldName: 'ProductName' })
      .yAxis([
        { fieldName: 'Quantity', aggregation: AggregationType.SUM, label: 'Stock' }
      ])
      .title('Current Inventory Levels')
      .filters(FilterConjunction.AND, [
        { fieldName: 'Status', operator: FilterOperator.IS, value: 'Active' }
      ])
      .build(),

    // Customer growth
    ChartBlockBuilder.line()
      .dataSource(APP, 'customers')
      .xAxis({ fieldName: 'SignupDate' })
      .yAxis([
        { fieldName: 'CustomerID', aggregation: AggregationType.COUNT, label: 'New Customers' }
      ])
      .title('Customer Growth Trend')
      .build(),

    // Rating distribution
    ChartBlockBuilder.pie()
      .dataSource(APP, 'reviews')
      .series({ fieldName: 'Rating' })
      .yAxis([
        { fieldName: 'ReviewID', aggregation: AggregationType.COUNT, label: 'Reviews' }
      ])
      .title('Review Rating Distribution')
      .build(),

    // Detailed orders table
    ViewBlockBuilder.table()
      .dataSource(APP, 'orders', 'view_recent_orders')
      .title('Recent Orders')
      .height(400)
      .build(),
  ];

  return blocks;
}
```

### Scenario 2: HR Analytics Dashboard

```typescript
async function createHrDashboard() {
  const APP = 'bitable_hr_2025';

  // Tables: employees, departments, performance, attendance, payroll

  const blocks = [
    // Headcount
    new MetricsBlockBuilder()
      .dataSource(APP, 'employees')
      .fieldName('EmployeeID')
      .aggregation(AggregationType.COUNT)
      .title('Total Employees')
      .build(),

    // Average salary
    new MetricsBlockBuilder()
      .dataSource(APP, 'payroll')
      .fieldName('Salary')
      .aggregation(AggregationType.AVG)
      .title('Average Salary')
      .prefix('$')
      .decimals(0)
      .build(),

    // Employees by department
    ChartBlockBuilder.bar()
      .dataSource(APP, 'employees')
      .xAxis({ fieldName: 'Department' })
      .yAxis([
        { fieldName: 'EmployeeID', aggregation: AggregationType.COUNT, label: 'Count' }
      ])
      .title('Headcount by Department')
      .build(),

    // Performance ratings distribution
    ChartBlockBuilder.pie()
      .dataSource(APP, 'performance')
      .series({ fieldName: 'Rating' })
      .yAxis([
        { fieldName: 'EmployeeID', aggregation: AggregationType.COUNT, label: 'Employees' }
      ])
      .title('Performance Rating Distribution')
      .build(),

    // Attendance trend
    ChartBlockBuilder.line()
      .dataSource(APP, 'attendance')
      .xAxis({ fieldName: 'Date' })
      .yAxis([
        { fieldName: 'EmployeeID', aggregation: AggregationType.DISTINCT_COUNT, label: 'Present' }
      ])
      .title('Daily Attendance Trend')
      .build(),

    // Salary by department
    ChartBlockBuilder.bar()
      .dataSource(APP, 'payroll')
      .xAxis({ fieldName: 'Department' })
      .yAxis([
        { fieldName: 'Salary', aggregation: AggregationType.SUM, label: 'Total Payroll' }
      ])
      .title('Payroll by Department')
      .prefix('$')
      .build(),

    // Employee directory table
    ViewBlockBuilder.table()
      .dataSource(APP, 'employees', 'view_directory')
      .title('Employee Directory')
      .height(400)
      .build(),
  ];

  return blocks;
}
```

### Scenario 3: Project Management Dashboard

```typescript
async function createProjectDashboard() {
  const APP = 'bitable_projects_2025';

  // Tables: projects, tasks, team_members, timesheets, budget

  const blocks = [
    // Active projects
    new MetricsBlockBuilder()
      .dataSource(APP, 'projects')
      .fieldName('ProjectID')
      .aggregation(AggregationType.COUNT)
      .title('Active Projects')
      .build()
      .filters(FilterConjunction.AND, [
        { fieldName: 'Status', operator: FilterOperator.IS, value: 'Active' }
      ]),

    // Overdue tasks
    new MetricsBlockBuilder()
      .dataSource(APP, 'tasks')
      .fieldName('TaskID')
      .aggregation(AggregationType.COUNT)
      .title('Overdue Tasks')
      .build()
      .filters(FilterConjunction.AND, [
        { fieldName: 'DueDate', operator: FilterOperator.LT, value: new Date().toISOString() },
        { fieldName: 'Status', operator: FilterOperator.IS_NOT, value: 'Completed' }
      ]),

    // Team utilization
    ChartBlockBuilder.bar()
      .dataSource(APP, 'timesheets')
      .xAxis({ fieldName: 'TeamMember' })
      .yAxis([
        { fieldName: 'Hours', aggregation: AggregationType.SUM, label: 'Hours Logged' }
      ])
      .title('Team Member Utilization')
      .build(),

    // Project status
    ChartBlockBuilder.pie()
      .dataSource(APP, 'projects')
      .series({ fieldName: 'Status' })
      .yAxis([
        { fieldName: 'ProjectID', aggregation: AggregationType.COUNT, label: 'Projects' }
      ])
      .title('Projects by Status')
      .build(),

    // Budget vs actual
    ChartBlockBuilder.bar()
      .dataSource(APP, 'budget')
      .xAxis({ fieldName: 'ProjectName' })
      .yAxis([
        { fieldName: 'BudgetAmount', aggregation: AggregationType.SUM, label: 'Budget' },
        { fieldName: 'ActualCost', aggregation: AggregationType.SUM, label: 'Actual Cost' }
      ])
      .title('Budget vs Actual Spend')
      .prefix('$')
      .build(),

    // Tasks timeline
    ViewBlockBuilder.gantt()
      .dataSource(APP, 'tasks', 'view_gantt')
      .title('Project Timeline')
      .height(500)
      .build(),

    // Project list
    ViewBlockBuilder.table()
      .dataSource(APP, 'projects', 'view_all_projects')
      .title('All Projects')
      .height(400)
      .build(),
  ];

  return blocks;
}
```

## Section 5: Performance Optimization

### Tip 1: Filter Early

```typescript
// SLOW: Process all 100k records
const slowChart = ChartBlockBuilder.bar()
  .dataSource(APP, 'large_table')
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Value', aggregation: AggregationType.SUM }])
  .build();

// FAST: Filter to 1k records first
const fastChart = ChartBlockBuilder.bar()
  .dataSource(APP, 'large_table')
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Value', aggregation: AggregationType.SUM }])
  .filters(FilterConjunction.AND, [
    { fieldName: 'Year', operator: FilterOperator.IS, value: '2025' },
    { fieldName: 'Status', operator: FilterOperator.IS, value: 'Active' }
  ])
  .build();
```

### Tip 2: Use Batch Operations

```typescript
// Create all blocks at once
const results = await client.batchCreateBlocks(APP_TOKEN, [
  block1, block2, block3, block4, block5
]);

// Not one-by-one:
// await client.addBlock(APP_TOKEN, dashboardId, block1);
// await client.addBlock(APP_TOKEN, dashboardId, block2);
// ... (much slower)
```

### Tip 3: Limit Table Views

```typescript
// Show limited records in tables
ViewBlockBuilder.table()
  .dataSource(APP, 'table', 'view_top_10')  // Use a filtered view
  .title('Top 10 Records')
  .height(400)
  .build();
```

## Section 6: Troubleshooting Multi-Source Dashboards

### Issue: Field Not Found

```typescript
// If you get "Field 'Amount' not found":

// Check 1: Verify field exists in the table
// Check 2: Verify field name matches exactly (case-sensitive)
// Check 3: Use the correct table ID

const correctChart = ChartBlockBuilder.bar()
  .dataSource(APP, 'correct_table_id')  // Verify this
  .xAxis({ fieldName: 'ExactFieldName' })  // Verify this
  .yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
  .build();
```

### Issue: Slow Dashboard Loading

```typescript
// Solution 1: Add filters
.filters(FilterConjunction.AND, [
  { fieldName: 'Year', operator: FilterOperator.IS, value: '2025' }
])

// Solution 2: Reduce number of blocks
// (Remove non-essential visualizations)

// Solution 3: Use aggregated views
// Create a summary table with pre-aggregated data
```

### Issue: Data Inconsistency

```typescript
// When metrics don't match across tables:

// Solution: Verify your filters and aggregations
// Add explicit labels to blocks
new MetricsBlockBuilder()
  .dataSource(APP, 'orders')
  .fieldName('OrderID')
  .aggregation(AggregationType.COUNT)
  .title('Orders in 2025')
  .build()
  .filters(FilterConjunction.AND, [
    { fieldName: 'OrderDate', operator: FilterOperator.GTE, value: '2025-01-01' }
  ]),
```

## Checkpoint: Practice

Create a multi-source dashboard combining at least 3 different tables with:
1. At least 2 metrics
2. At least 2 charts
3. At least 1 table view
4. Appropriate filters

## Next Steps

- Read [Tutorial 6: Permission & Access Control](06-PERMISSIONS.md)
- Explore real-time data synchronization
- Build production multi-source systems

## Summary

You've learned:
- How to combine data from multiple sources
- Real-world multi-source patterns
- Performance optimization techniques
- Complex dashboard architecture

You can now build comprehensive, organization-wide dashboards!
