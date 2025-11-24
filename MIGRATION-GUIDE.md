# Migration Guide: 1.x to 2.0 (2025 Edition)

## Overview

Version 2.0 of the Lark Dashboard SDK introduces powerful new features while maintaining full backward compatibility with 1.x code. This guide helps you understand what's changed and how to adopt new features.

## Breaking Changes

**None!** Version 2.0 is fully backward compatible. All your existing 1.x code will continue to work without modifications.

## New Features Summary

1. **List Blocks** - New block type for flexible list layouts
2. **Tab/Page Blocks** - Organize dashboards with tabs
3. **Permission Management** - Granular access control
4. **Enhanced Charts** - 8 new chart types + interactive features
5. **Advanced Filtering** - 9 new filter operators
6. **Enhanced Metrics** - Comparisons, sparklines, targets
7. **Performance** - Auto-refresh, caching
8. **Themes** - Custom theming support

## Step-by-Step Migration

### Step 1: Update Package

```bash
npm install @hypelab/lark-dashboard-sdk@2.0.0
```

### Step 2: Update Imports (Optional)

Add new imports for 2025 features:

```typescript
// Old (1.x) - Still works!
import {
  LarkDashboardClient,
  ChartBlockBuilder,
  MetricsBlockBuilder,
  ViewBlockBuilder,
  TextBlockBuilder
} from '@hypelab/lark-dashboard-sdk';

// New (2.0) - Add these for new features
import {
  LarkDashboardClient,
  ChartBlockBuilder,
  MetricsBlockBuilder,
  ViewBlockBuilder,
  TextBlockBuilder,
  ListBlockBuilder,        // New
  TabPageBlockBuilder,     // New
  DashboardPermissionBuilder,  // New
  BlockPermissionBuilder,      // New
  PermissionHelper             // New
} from '@hypelab/lark-dashboard-sdk';
```

### Step 3: Enhance Existing Code (Optional)

Your existing code works as-is. You can gradually adopt new features:

#### Charts - Add Interactive Features

**Before (1.x):**
```typescript
const chart = ChartBlockBuilder.line()
  .dataSource(appToken, tableId)
  .title('Sales Trend')
  .xAxis('Date')
  .yAxis([{ fieldName: 'Sales', aggregation: AggregationType.SUM }])
  .build();
```

**After (2.0) - Enhanced:**
```typescript
const chart = ChartBlockBuilder.line()
  .dataSource(appToken, tableId, undefined, 300, true) // Auto-refresh + cache
  .title('Sales Trend')
  .xAxis('Date', undefined, undefined, 'MMM YYYY', true)
  .yAxis([{
    fieldName: 'Sales',
    aggregation: AggregationType.SUM,
    format: '$#,##0.00',
    showGrid: true
  }])
  .animation({ enabled: true, duration: 1000 })
  .tooltip({ enabled: true, shared: true })
  .responsive(true)
  .exportEnabled(true)
  .zoomEnabled(true)
  .build();
```

#### Metrics - Add Comparisons

**Before (1.x):**
```typescript
const metrics = MetricsBlockBuilder
  .dataSource(appToken, tableId)
  .field('Revenue')
  .aggregation(AggregationType.SUM)
  .title('Total Revenue')
  .prefix('$')
  .build();
```

**After (2.0) - Enhanced:**
```typescript
const metrics = MetricsBlockBuilder
  .dataSource(appToken, tableId, undefined, 60, true) // Auto-refresh
  .field('Revenue')
  .aggregation(AggregationType.SUM)
  .title('Total Revenue')
  .prefix('$')
  .comparisonEnabled(true)
  .comparisonPeriod('month')
  .sparklineEnabled(true)
  .target(1000000)
  .targetLabel('Monthly Target')
  .build();
```

### Step 4: Add New Block Types

#### Add List Blocks

```typescript
const taskList = ListBlockBuilder.vertical()
  .dataSource(appToken, tableId)
  .title('Active Tasks')
  .titleField('Task Name')
  .subtitleField('Assignee')
  .descriptionField('Description')
  .badgeField('Status')
  .metaFields(['Due Date', 'Priority'])
  .addEditButton()
  .addDeleteButton()
  .pagination(true, 20)
  .showSearch(true)
  .build();
```

#### Add Tab Navigation

```typescript
const tabs = TabPageBlockBuilder.horizontalTabs()
  .title('Dashboard')
  .tab('overview', 'Overview', ['chart-1', 'metrics-1'], {
    icon: 'home'
  })
  .tab('tasks', 'Tasks', ['list-1'], {
    icon: 'check-square',
    badge: 23
  })
  .defaultTab('overview')
  .build();
```

### Step 5: Add Permissions (Optional)

**New Feature - Dashboard Permissions:**

```typescript
const permission = new DashboardPermissionBuilder()
  .shareWithTeam()
  .addTeam('team_sales', PermissionLevel.EDIT)
  .addUser('user_admin', PermissionLevel.ADMIN)
  .allowComments(true)
  .allowExport(true)
  .build();

// Add to dashboard
const dashboard = {
  name: 'Sales Dashboard',
  appToken,
  blocks: [...],
  permission  // New field
};
```

**New Feature - Block Permissions:**

```typescript
const blockPermission = new BlockPermissionBuilder()
  .blockId('sensitive-data')
  .addUser('cfo', PermissionLevel.ADMIN)
  .addTeam('finance', PermissionLevel.VIEW)
  .build();

// Add to block
const block = {
  blockType: BlockType.METRICS,
  config: {...},
  permission: blockPermission  // New field
};
```

### Step 6: Use New Filter Operators

**Before (1.x) - Basic Filtering:**
```typescript
.filters(FilterConjunction.AND, [
  {
    fieldName: 'Status',
    operator: FilterOperator.IS,
    value: 'Active'
  }
])
```

**After (2.0) - Advanced Filtering:**
```typescript
.filters(FilterConjunction.AND, [
  // String operators
  {
    fieldName: 'Name',
    operator: FilterOperator.STARTS_WITH,
    value: 'John'
  },
  // Range operators
  {
    fieldName: 'Price',
    operator: FilterOperator.IS_BETWEEN,
    value: 100,
    secondValue: 1000
  },
  // Multiple values
  {
    fieldName: 'Status',
    operator: FilterOperator.IS_ANY_OF,
    values: ['Active', 'Pending', 'Processing']
  },
  // Date operators
  {
    fieldName: 'Created',
    operator: FilterOperator.IS_WITHIN_DAYS,
    value: 7
  },
  // Regex
  {
    fieldName: 'Email',
    operator: FilterOperator.MATCHES_REGEX,
    value: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
  }
])
```

### Step 7: Use New Chart Types

```typescript
// Heatmap
const heatmap = ChartBlockBuilder
  .chartType(ChartType.HEATMAP)
  .dataSource(appToken, tableId)
  .title('Sales Heatmap')
  .build();

// Waterfall
const waterfall = ChartBlockBuilder
  .chartType(ChartType.WATERFALL)
  .dataSource(appToken, tableId)
  .title('Revenue Flow')
  .build();

// Gauge
const gauge = ChartBlockBuilder
  .chartType(ChartType.GAUGE)
  .dataSource(appToken, tableId)
  .title('Progress')
  .build();

// Sankey
const sankey = ChartBlockBuilder
  .chartType(ChartType.SANKEY)
  .dataSource(appToken, tableId)
  .title('Flow Diagram')
  .build();

// Candlestick
const candlestick = ChartBlockBuilder
  .chartType(ChartType.CANDLESTICK)
  .dataSource(appToken, tableId)
  .title('Stock Prices')
  .build();
```

### Step 8: Add Dashboard Settings

```typescript
const settings: DashboardSettings = {
  autoRefresh: true,
  refreshInterval: 300,
  theme: {
    name: 'Corporate',
    colorPrimary: '#2563eb',
    colorSecondary: '#7c3aed',
    fontFamily: 'Inter, sans-serif'
  },
  fullscreenEnabled: true,
  exportEnabled: true,
  timezone: 'Asia/Singapore'
};

const dashboard = {
  name: 'Sales Dashboard',
  appToken,
  blocks: [...],
  settings  // New field
};
```

## Common Migration Patterns

### Pattern 1: Basic Dashboard → Enhanced Dashboard

**Before:**
```typescript
const dashboard = {
  name: 'Sales Dashboard',
  appToken: 'your_app_token',
  blocks: [
    chartBlock,
    metricsBlock
  ]
};
```

**After:**
```typescript
const dashboard = {
  name: 'Sales Dashboard',
  appToken: 'your_app_token',
  description: 'Comprehensive sales analytics',
  tags: ['sales', 'analytics'],
  blocks: [
    enhancedChartBlock,
    enhancedMetricsBlock,
    listBlock,
    tabPageBlock
  ],
  permission: dashboardPermission,
  settings: {
    autoRefresh: true,
    refreshInterval: 300,
    theme: customTheme
  },
  version: '2.0.0'
};
```

### Pattern 2: Simple Chart → Interactive Chart

**Before:**
```typescript
const chart = ChartBlockBuilder.bar()
  .dataSource(appToken, tableId)
  .xAxis('Category')
  .yAxis([{ fieldName: 'Value', aggregation: AggregationType.SUM }])
  .build();
```

**After:**
```typescript
const chart = ChartBlockBuilder.bar()
  .dataSource(appToken, tableId, undefined, 300, true)
  .xAxis('Category', undefined, undefined, undefined, true)
  .yAxis([{
    fieldName: 'Value',
    aggregation: AggregationType.SUM,
    format: '#,##0',
    showGrid: true,
    scale: 'linear'
  }])
  .animation({ enabled: true, duration: 1000 })
  .tooltip({ enabled: true, shared: true })
  .responsive(true)
  .exportEnabled(true)
  .zoomEnabled(true)
  .panEnabled(true)
  .crosshair(true)
  .theme('auto')
  .build();
```

### Pattern 3: Adding Organization with Tabs

**Before:**
```typescript
// Multiple blocks without organization
const dashboard = {
  blocks: [
    chart1,
    chart2,
    chart3,
    metrics1,
    metrics2,
    list1
  ]
};
```

**After:**
```typescript
// Organized with tabs
const tabs = TabPageBlockBuilder.horizontalTabs()
  .tab('overview', 'Overview', ['chart1', 'metrics1'])
  .tab('details', 'Details', ['chart2', 'chart3'])
  .tab('data', 'Data', ['list1', 'metrics2'])
  .build();

const dashboard = {
  blocks: [
    tabs,
    chart1,
    chart2,
    chart3,
    metrics1,
    metrics2,
    list1
  ]
};
```

## Type System Updates

### New Enums

```typescript
// New block types
enum BlockType {
  LIST = 6,
  TAB_PAGE = 7,
  FILTER = 8,
  CALENDAR = 9,
  TIMELINE = 10
}

// New chart types
enum ChartType {
  HEATMAP = 10,
  TREEMAP = 11,
  WATERFALL = 12,
  GAUGE = 13,
  BUBBLE = 14,
  SANKEY = 15,
  BOXPLOT = 16,
  CANDLESTICK = 17
}

// New permission types
enum PermissionLevel {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDIT = 'edit',
  VIEW = 'view',
  COMMENT = 'comment',
  NONE = 'none'
}

enum SharingMode {
  PRIVATE = 'private',
  PUBLIC = 'public',
  LINK = 'link',
  TEAM = 'team',
  SPECIFIC_USERS = 'specific_users'
}
```

### New Interfaces

```typescript
// List configuration
interface ListConfig {
  dataSource: DataSource;
  layoutStyle: ListLayoutStyle;
  itemTemplate: ListItemTemplate;
  // ... more fields
}

// Tab/page configuration
interface TabPageConfig {
  layout: TabPageLayout;
  tabs: TabPageItem[];
  // ... more fields
}

// Permission configuration
interface DashboardPermission {
  scope: PermissionScope;
  sharingMode: SharingMode;
  entities?: PermissionEntity[];
  // ... more fields
}
```

## Testing Your Migration

### 1. Verify Existing Code

```bash
npm run build
npm run test
```

### 2. Test New Features

```bash
# Run new examples
npm run example:list
npm run example:tabpage
npm run example:permissions
npm run example:2025
```

### 3. Check TypeScript Compilation

```bash
npm run build
# Should compile without errors
```

## Troubleshooting

### Issue: TypeScript Errors

**Problem:** Type errors after upgrading

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Missing Types

**Problem:** New types not available

**Solution:**
```typescript
// Ensure you're importing from the package
import { ListBlockBuilder } from '@hypelab/lark-dashboard-sdk';

// Check package version
// package.json should show "version": "2.0.0"
```

### Issue: Backward Compatibility

**Problem:** Old code not working

**Solution:** All 1.x code is compatible. If you encounter issues:

1. Check that you're using the same API key
2. Verify data source tokens are correct
3. Review error messages for specific issues
4. File an issue on GitHub

## Best Practices

### 1. Gradual Adoption

Don't migrate everything at once. Start with:
1. Update package version
2. Test existing dashboards
3. Add one new feature at a time
4. Test thoroughly before production

### 2. Use Type Safety

```typescript
// Leverage TypeScript for safety
import {
  BlockType,
  ChartType,
  PermissionLevel
} from '@hypelab/lark-dashboard-sdk';

// TypeScript will catch errors
const block = {
  blockType: BlockType.LIST, // Type-safe
  // ...
};
```

### 3. Follow Examples

Refer to example files:
- `examples/list-block-example.ts`
- `examples/tabpage-example.ts`
- `examples/permissions-example.ts`
- `examples/2025-features-complete.ts`

### 4. Incremental Enhancement

```typescript
// Start simple
const chart = ChartBlockBuilder.line()
  .dataSource(appToken, tableId)
  .build();

// Add features incrementally
const chart = ChartBlockBuilder.line()
  .dataSource(appToken, tableId, undefined, 300, true)
  .animation({ enabled: true })
  .build();

// Full enhancement when ready
const chart = ChartBlockBuilder.line()
  .dataSource(appToken, tableId, undefined, 300, true)
  .animation({ enabled: true, duration: 1000 })
  .tooltip({ enabled: true })
  .responsive(true)
  .exportEnabled(true)
  .zoomEnabled(true)
  .build();
```

## Need Help?

- **Documentation**: [FEATURES-2025.md](FEATURES-2025.md)
- **Examples**: See `examples/` directory
- **Issues**: [GitHub Issues](https://github.com/hypelab/lark-dashboard-sdk/issues)
- **API Reference**: [types.ts](src/types.ts)

## Summary

- ✅ **Backward Compatible**: All 1.x code works without changes
- ✅ **Optional Enhancements**: Adopt new features at your own pace
- ✅ **Type Safe**: Full TypeScript support
- ✅ **Well Documented**: Comprehensive guides and examples
- ✅ **Tested**: All features thoroughly tested

Happy migrating! 🚀
