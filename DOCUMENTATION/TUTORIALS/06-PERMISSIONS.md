# Tutorial 6: Permission & Access Control (15 Minutes)

## What You'll Learn
- Configure dashboard permissions
- Set block-level access control
- Share dashboards with teams
- Manage different permission levels
- Best practices for secure dashboards

## Prerequisites
- Completed Tutorials 1-5
- Understanding of Lark workspace structure
- Basic knowledge of role-based access

## Time Estimate: 15 minutes

## Section 1: Dashboard Permissions Overview

Lark dashboards support three permission levels:

| Permission | Can View | Can Edit | Can Delete |
|-----------|----------|----------|-----------|
| **View Only** | Yes | No | No |
| **Edit** | Yes | Yes | No |
| **Owner** | Yes | Yes | Yes |

## Section 2: Basic Dashboard Permissions

### Create a Dashboard with Permissions

```typescript
import { LarkDashboardClient, DashboardPermissionBuilder } from '@hypelab/lark-dashboard-sdk';

const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  region: 'sg',
});

async function createDashboardWithPermissions() {
  // Create dashboard
  const dashboard = await client.createDashboard({
    name: 'Sales Dashboard - Q1 2025',
    appToken: 'YOUR_APP_TOKEN',
    description: 'Dashboard for sales team',
  });

  // Create permission builder
  const permissions = new DashboardPermissionBuilder()
    .addOwner('ou_alice123')              // Alice owns the dashboard
    .addEditor('ou_bob456')               // Bob can edit
    .addViewer('ou_charlie789')           // Charlie can view only
    .build();

  // Apply permissions
  await client.setDashboardPermissions(
    'YOUR_APP_TOKEN',
    dashboard,
    permissions
  );

  console.log('Dashboard created with permissions');
  return dashboard;
}
```

## Section 3: Permission Builder Methods

### Adding Individual Users

```typescript
import { DashboardPermissionBuilder, PermissionLevel } from '@hypelab/lark-dashboard-sdk';

const permissions = new DashboardPermissionBuilder()
  // Single users
  .addOwner('ou_user123')           // User becomes owner
  .addEditor('ou_user456')          // User can edit
  .addViewer('ou_user789')          // User can view
  .build();
```

### Adding Groups and Departments

```typescript
const permissions = new DashboardPermissionBuilder()
  // Groups (dynamic, automatically includes new members)
  .addGroupAsEditor('og_sales_team')      // Entire sales team can edit
  .addGroupAsViewer('og_finance_team')    // Finance team can view

  // Departments
  .addDepartmentAsEditor('od_engineering')  // Engineering department can edit
  .addDepartmentAsViewer('od_marketing')    // Marketing can view
  .build();
```

### Removing Permissions

```typescript
const permissions = new DashboardPermissionBuilder()
  .addEditor('ou_user123')
  .addEditor('ou_user456')
  .removeAccess('ou_user456')  // Remove user456's access
  .build();
```

### Changing Permission Levels

```typescript
const permissions = new DashboardPermissionBuilder()
  .addEditor('ou_user123')        // Initially editor
  .demoteToViewer('ou_user123')   // Downgrade to viewer
  .promoteToEditor('ou_user456')  // Upgrade user456 to editor
  .build();
```

## Section 4: Block-Level Permissions

Control which users can see specific blocks within a dashboard.

```typescript
import { BlockPermissionBuilder } from '@hypelab/lark-dashboard-sdk';

async function createDashboardWithBlockPermissions() {
  const APP_TOKEN = 'YOUR_APP_TOKEN';

  // Create dashboard
  const dashboardId = await client.createDashboard({
    name: 'Financial Dashboard',
    appToken: APP_TOKEN,
  });

  // Create revenue chart (finance only)
  const revenueChart = ChartBlockBuilder.bar()
    .dataSource(APP_TOKEN, 'financial_data')
    .xAxis({ fieldName: 'Month' })
    .yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
    .title('Monthly Revenue')
    .build();

  const revenueBlockId = await client.addBlock(APP_TOKEN, dashboardId, revenueChart);

  // Set finance-only access on revenue chart
  const revenuePermissions = new BlockPermissionBuilder()
    .addViewer('og_finance_team')   // Finance can view
    .addEditor('ou_cfo')            // CFO can edit
    .build();

  await client.setBlockPermissions(
    APP_TOKEN,
    revenueBlockId,
    revenuePermissions
  );

  // Create headcount metric (HR only)
  const headcountMetric = new MetricsBlockBuilder()
    .dataSource(APP_TOKEN, 'hr_data')
    .fieldName('EmployeeID')
    .aggregation(AggregationType.COUNT)
    .title('Total Employees')
    .build();

  const headcountBlockId = await client.addBlock(APP_TOKEN, dashboardId, headcountMetric);

  // Set HR-only access
  const hrPermissions = new BlockPermissionBuilder()
    .addViewer('og_hr_team')   // HR can view
    .addEditor('ou_hr_director')  // HR Director can edit
    .build();

  await client.setBlockPermissions(
    APP_TOKEN,
    headcountBlockId,
    hrPermissions
  );

  // Create public summary block (everyone can see)
  const summaryBlock = new TextBlockBuilder()
    .heading('Company Overview - All Employees')
    .build();

  const summaryBlockId = await client.addBlock(APP_TOKEN, dashboardId, summaryBlock);

  // No restrictions on summary
  const publicPermissions = new BlockPermissionBuilder()
    .addViewer('og_all_employees')  // Everyone in the workspace
    .build();

  await client.setBlockPermissions(
    APP_TOKEN,
    summaryBlockId,
    publicPermissions
  );

  console.log('Dashboard created with block-level permissions');
  return dashboardId;
}
```

## Section 5: Real-World Permission Patterns

### Pattern 1: Role-Based Dashboard

Different views for different roles:

```typescript
async function createRoleBasedDashboard() {
  const APP_TOKEN = 'bitable_business_2025';

  const dashboardId = await client.createDashboard({
    name: 'Business Dashboard',
    appToken: APP_TOKEN,
  });

  // Executive Summary (Executive team only)
  const executiveBlock = ChartBlockBuilder.bar()
    .dataSource(APP_TOKEN, 'financial_summary')
    .xAxis({ fieldName: 'Quarter' })
    .yAxis([{ fieldName: 'Profit', aggregation: AggregationType.SUM }])
    .title('Quarterly Profit')
    .build();

  const executiveBlockId = await client.addBlock(APP_TOKEN, dashboardId, executiveBlock);

  const executivePermissions = new BlockPermissionBuilder()
    .addViewer('ou_ceo')
    .addViewer('ou_cfo')
    .addViewer('ou_coo')
    .build();

  await client.setBlockPermissions(APP_TOKEN, executiveBlockId, executivePermissions);

  // Sales Dashboard (Sales team)
  const salesBlock = ChartBlockBuilder.bar()
    .dataSource(APP_TOKEN, 'sales_data')
    .xAxis({ fieldName: 'SalesRep' })
    .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
    .title('Sales by Rep')
    .build();

  const salesBlockId = await client.addBlock(APP_TOKEN, dashboardId, salesBlock);

  const salesPermissions = new BlockPermissionBuilder()
    .addGroupAsViewer('og_sales_team')
    .addGroupAsEditor('og_sales_managers')
    .build();

  await client.setBlockPermissions(APP_TOKEN, salesBlockId, salesPermissions);

  // HR Dashboard (HR only)
  const hrBlock = new MetricsBlockBuilder()
    .dataSource(APP_TOKEN, 'hr_data')
    .fieldName('EmployeeID')
    .aggregation(AggregationType.COUNT)
    .title('Headcount')
    .build();

  const hrBlockId = await client.addBlock(APP_TOKEN, dashboardId, hrBlock);

  const hrPermissions = new BlockPermissionBuilder()
    .addGroupAsViewer('og_hr_team')
    .addEditor('ou_hr_director')
    .build();

  await client.setBlockPermissions(APP_TOKEN, hrBlockId, hrPermissions);

  return dashboardId;
}
```

### Pattern 2: Data Classification

Protect sensitive data with graduated access:

```typescript
async function createClassifiedDashboard() {
  const APP_TOKEN = 'bitable_data_2025';

  const dashboardId = await client.createDashboard({
    name: 'Data Dashboard',
    appToken: APP_TOKEN,
  });

  // PUBLIC: Customer count (everyone)
  const publicBlock = new MetricsBlockBuilder()
    .dataSource(APP_TOKEN, 'customers')
    .fieldName('CustomerID')
    .aggregation(AggregationType.COUNT)
    .title('Total Customers')
    .build();

  const publicId = await client.addBlock(APP_TOKEN, dashboardId, publicBlock);

  const publicPerms = new BlockPermissionBuilder()
    .addGroupAsViewer('og_all_employees')
    .build();

  await client.setBlockPermissions(APP_TOKEN, publicId, publicPerms);

  // INTERNAL: Revenue breakdown (managers+)
  const internalBlock = ChartBlockBuilder.pie()
    .dataSource(APP_TOKEN, 'revenue')
    .series({ fieldName: 'Category' })
    .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
    .title('Revenue by Category')
    .build();

  const internalId = await client.addBlock(APP_TOKEN, dashboardId, internalBlock);

  const internalPerms = new BlockPermissionBuilder()
    .addGroupAsViewer('og_managers')
    .addGroupAsViewer('og_executives')
    .build();

  await client.setBlockPermissions(APP_TOKEN, internalId, internalPerms);

  // CONFIDENTIAL: Profit margin (executives only)
  const confidentalBlock = new MetricsBlockBuilder()
    .dataSource(APP_TOKEN, 'financials')
    .fieldName('ProfitMargin')
    .aggregation(AggregationType.AVG)
    .title('Profit Margin %')
    .build();

  const confidentalId = await client.addBlock(APP_TOKEN, dashboardId, confidentalBlock);

  const confidentalPerms = new BlockPermissionBuilder()
    .addEditor('ou_ceo')
    .addEditor('ou_cfo')
    .build();

  await client.setBlockPermissions(APP_TOKEN, confidentalId, confidentalPerms);

  return dashboardId;
}
```

### Pattern 3: Team-Specific Views

Each team sees their own data:

```typescript
async function createTeamDashboards() {
  const APP_TOKEN = 'bitable_ops_2025';

  // Sales team dashboard
  const salesDashboardId = await client.createDashboard({
    name: 'Sales Dashboard',
    appToken: APP_TOKEN,
  });

  // Set dashboard access
  const salesDashboardPerms = new DashboardPermissionBuilder()
    .addGroupAsViewer('og_sales_team')
    .addGroupAsEditor('og_sales_managers')
    .addOwner('ou_sales_vp')
    .build();

  await client.setDashboardPermissions(
    APP_TOKEN,
    salesDashboardId,
    salesDashboardPerms
  );

  // Add sales-specific blocks
  const salesChart = ChartBlockBuilder.bar()
    .dataSource(APP_TOKEN, 'sales')
    .xAxis({ fieldName: 'Month' })
    .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
    .title('Monthly Sales')
    .build();

  await client.addBlock(APP_TOKEN, salesDashboardId, salesChart);

  // Support team dashboard
  const supportDashboardId = await client.createDashboard({
    name: 'Support Dashboard',
    appToken: APP_TOKEN,
  });

  const supportDashboardPerms = new DashboardPermissionBuilder()
    .addGroupAsViewer('og_support_team')
    .addGroupAsEditor('og_support_managers')
    .addOwner('ou_support_vp')
    .build();

  await client.setDashboardPermissions(
    APP_TOKEN,
    supportDashboardId,
    supportDashboardPerms
  );

  return { salesDashboardId, supportDashboardId };
}
```

## Section 6: Permission Best Practices

### Rule 1: Follow Principle of Least Privilege

```typescript
// GOOD: Grant only necessary access
const permissions = new DashboardPermissionBuilder()
  .addViewerGroup('og_finance_team')    // Just Finance
  .addEditorGroup('og_finance_managers') // Just managers
  .build();

// BAD: Over-permissive
const badPermissions = new DashboardPermissionBuilder()
  .addEditorGroup('og_all_employees')   // Everyone can edit!
  .build();
```

### Rule 2: Use Groups, Not Individual Users

```typescript
// GOOD: Use groups (automatically updated when users join/leave)
const permissions = new DashboardPermissionBuilder()
  .addGroupAsEditor('og_sales_team')
  .build();

// LESS IDEAL: Individual users (manual updates needed)
const permissions = new DashboardPermissionBuilder()
  .addEditor('ou_alice123')
  .addEditor('ou_bob456')
  .addEditor('ou_charlie789')
  // ... need to update whenever team changes
  .build();
```

### Rule 3: Regular Audit

```typescript
async function auditDashboardPermissions() {
  const dashboards = await client.listDashboards('YOUR_APP_TOKEN');

  for (const dashboard of dashboards) {
    const perms = await client.getDashboardPermissions(
      'YOUR_APP_TOKEN',
      dashboard.id
    );

    console.log(`Dashboard: ${dashboard.name}`);
    console.log('Owners:', perms.owners);
    console.log('Editors:', perms.editors);
    console.log('Viewers:', perms.viewers);
    console.log('---');
  }
}
```

### Rule 4: Protect Sensitive Blocks

```typescript
// Always protect sensitive financial/HR data
const sensitiveMetric = new MetricsBlockBuilder()
  .dataSource(APP_TOKEN, 'salaries')
  .fieldName('Salary')
  .aggregation(AggregationType.AVG)
  .title('Average Salary')
  .build();

const sensitiveBlockId = await client.addBlock(APP_TOKEN, dashboardId, sensitiveMetric);

// Restrict access immediately
const restrictedPerms = new BlockPermissionBuilder()
  .addEditor('ou_hr_director')
  .addEditor('ou_ceo')
  .build();

await client.setBlockPermissions(
  APP_TOKEN,
  sensitiveBlockId,
  restrictedPerms
);
```

### Rule 5: Clear Ownership Chain

```typescript
async function establishOwnershipChain() {
  const dashboards = [
    {
      name: 'Sales Dashboard',
      owner: 'ou_sales_vp',
      editors: ['og_sales_managers'],
      viewers: ['og_sales_team']
    },
    {
      name: 'Finance Dashboard',
      owner: 'ou_cfo',
      editors: ['og_finance_managers'],
      viewers: ['og_finance_team']
    },
    {
      name: 'Executive Dashboard',
      owner: 'ou_ceo',
      editors: ['ou_cfo', 'ou_coo'],
      viewers: ['ou_executives']
    }
  ];

  for (const config of dashboards) {
    const dashboardId = await client.createDashboard({
      name: config.name,
      appToken: 'YOUR_APP_TOKEN',
    });

    const permissions = new DashboardPermissionBuilder()
      .addOwner(config.owner);

    config.editors.forEach(editor => {
      permissions.addEditor(editor);
    });

    config.viewers.forEach(viewer => {
      permissions.addViewer(viewer);
    });

    await client.setDashboardPermissions(
      'YOUR_APP_TOKEN',
      dashboardId,
      permissions.build()
    );
  }
}
```

## Section 7: Common Permission Scenarios

### Scenario 1: Public Dashboard with Private Sections

```typescript
async function createPublicWithPrivateBlocks() {
  const APP_TOKEN = 'bitable_public_2025';

  // Create public dashboard
  const dashboardId = await client.createDashboard({
    name: 'Company Dashboard',
    appToken: APP_TOKEN,
  });

  // Make dashboard accessible to all
  const dashboardPerms = new DashboardPermissionBuilder()
    .addGroupAsViewer('og_all_employees')
    .build();

  await client.setDashboardPermissions(APP_TOKEN, dashboardId, dashboardPerms);

  // Add public blocks
  const publicMetric = new MetricsBlockBuilder()
    .dataSource(APP_TOKEN, 'metrics')
    .fieldName('ActiveProjects')
    .aggregation(AggregationType.COUNT)
    .title('Active Projects')
    .build();

  const publicBlockId = await client.addBlock(APP_TOKEN, dashboardId, publicMetric);

  // Add private block (HR only)
  const privateMetric = new MetricsBlockBuilder()
    .dataSource(APP_TOKEN, 'hr')
    .fieldName('EmployeeID')
    .aggregation(AggregationType.COUNT)
    .title('Employees')
    .build();

  const privateBlockId = await client.addBlock(APP_TOKEN, dashboardId, privateMetric);

  const privatePerms = new BlockPermissionBuilder()
    .addGroupAsViewer('og_hr_team')
    .build();

  await client.setBlockPermissions(APP_TOKEN, privateBlockId, privatePerms);

  return dashboardId;
}
```

### Scenario 2: Temporary Access Grant

```typescript
async function grantTemporaryAccess(userId: string, durationDays: number) {
  // Note: This is a pattern you'd implement in your application
  // Lark doesn't have built-in expiring permissions, so you'd need to:

  // 1. Grant access
  const permissions = new DashboardPermissionBuilder()
    .addEditor(userId)
    .build();

  // 2. Schedule removal
  const removalTime = new Date();
  removalTime.setDate(removalTime.getDate() + durationDays);

  // 3. Store in a scheduled task system
  console.log(`Access granted until: ${removalTime.toISOString()}`);

  // 4. When scheduler triggers, revoke access
  // await client.revokeAccess(userId);
}
```

## Checkpoint: Knowledge Check

1. **What are the three permission levels in Lark dashboards?**
   - View Only, Edit, Owner

2. **Why should you use groups instead of individual users?**
   - Groups automatically include/exclude users as they join/leave teams

3. **What's the principle of least privilege?**
   - Grant only the minimum access needed to do the job

4. **How do you protect sensitive data blocks?**
   - Set block-level permissions to restrict which users can see them

## Next Steps

- Read [Tutorial 7: Using 2025 Features](07-2025-FEATURES.md)
- Implement permission auditing in your dashboards
- Set up automated permission management

## Summary

You've learned:
- Dashboard and block-level permissions
- Permission builder API
- Real-world permission patterns
- Best practices for secure dashboards
- Common permission scenarios

Your dashboards are now secure and properly controlled!
