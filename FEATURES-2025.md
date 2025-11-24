# Lark Dashboard SDK - 2025 Features

## Overview

The Lark Dashboard SDK has been significantly enhanced with new 2025 dashboard capabilities, including advanced block types, improved layouts, comprehensive permission management, and performance optimizations.

## Table of Contents

1. [New Block Types](#new-block-types)
2. [Enhanced Chart Types](#enhanced-chart-types)
3. [List Blocks](#list-blocks)
4. [Tab/Page Blocks](#tabpage-blocks)
5. [Permission Management](#permission-management)
6. [Advanced Filtering](#advanced-filtering)
7. [Enhanced Metrics](#enhanced-metrics)
8. [Performance Features](#performance-features)
9. [Responsive Layouts](#responsive-layouts)
10. [Migration Guide](#migration-guide)

---

## New Block Types

### List Block (Type: 6)
Display data in flexible list layouts with customizable templates, actions, and filtering.

### Tab/Page Block (Type: 7)
Create tabbed interfaces for organizing multiple views within a single dashboard.

### Filter Block (Type: 8)
Standalone filter controls for cross-block data filtering.

### Calendar View (Type: 9)
Display time-based data in calendar format.

### Timeline View (Type: 10)
Show chronological events and milestones.

---

## Enhanced Chart Types

### New Chart Types (2025)

#### Heatmap (Type: 10)
```typescript
const heatmap = ChartBlockBuilder
  .chartType(ChartType.HEATMAP)
  .dataSource(appToken, tableId)
  .title('Sales Heatmap')
  .xAxis('Time Period')
  .yAxis([{ fieldName: 'Sales', aggregation: AggregationType.SUM }])
  .colors(['#4ade80', '#fbbf24', '#f87171'])
  .build();
```

#### Waterfall (Type: 12)
Perfect for showing sequential positive and negative changes.

```typescript
const waterfall = ChartBlockBuilder
  .chartType(ChartType.WATERFALL)
  .dataSource(appToken, tableId)
  .title('Revenue Breakdown')
  .xAxis('Category')
  .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
  .colors(['#22c55e', '#ef4444'])
  .build();
```

#### Gauge (Type: 13)
Display single metrics with visual indicators.

```typescript
const gauge = ChartBlockBuilder
  .chartType(ChartType.GAUGE)
  .dataSource(appToken, tableId)
  .title('Target Achievement')
  .yAxis([{
    fieldName: 'Sales',
    aggregation: AggregationType.SUM,
    min: 0,
    max: 1000000
  }])
  .colors(['#ef4444', '#fbbf24', '#22c55e'])
  .build();
```

#### Sankey Diagram (Type: 15)
Visualize flow and relationships between entities.

```typescript
const sankey = ChartBlockBuilder
  .chartType(ChartType.SANKEY)
  .dataSource(appToken, tableId)
  .title('Customer Journey')
  .xAxis('Source')
  .yAxis([{ fieldName: 'Target', aggregation: AggregationType.COUNT }])
  .build();
```

#### Candlestick (Type: 17)
Financial charts for OHLC data.

```typescript
const candlestick = ChartBlockBuilder
  .chartType(ChartType.CANDLESTICK)
  .dataSource(appToken, tableId)
  .title('Stock Prices')
  .xAxis('Date')
  .yAxis([
    { fieldName: 'Open', label: 'Open' },
    { fieldName: 'High', label: 'High' },
    { fieldName: 'Low', label: 'Low' },
    { fieldName: 'Close', label: 'Close' }
  ])
  .build();
```

### Enhanced Chart Configuration

All charts now support:

```typescript
interface ChartConfig {
  // Existing properties...

  // New 2025 features
  animation?: ChartAnimation;        // Smooth animations
  tooltip?: ChartTooltip;            // Interactive tooltips
  responsive?: boolean;              // Auto-resize
  theme?: 'light' | 'dark' | 'auto'; // Theme support
  exportEnabled?: boolean;           // Export to image/PDF
  zoomEnabled?: boolean;             // Zoom functionality
  panEnabled?: boolean;              // Pan navigation
  crosshair?: boolean;               // Crosshair cursor
}
```

**Example with all features:**

```typescript
const enhancedChart = ChartBlockBuilder.line()
  .dataSource(appToken, tableId, undefined, 300, true) // Auto-refresh, caching
  .title('Sales Trend')
  .xAxis('Date', undefined, undefined, 'MMM YYYY', true)
  .yAxis([{
    fieldName: 'Sales',
    aggregation: AggregationType.SUM,
    format: '$#,##0.00',
    showGrid: true,
    scale: 'linear',
    min: 0
  }])
  .animation({
    enabled: true,
    duration: 1000,
    easing: 'easeInOut',
    delay: 100
  })
  .tooltip({
    enabled: true,
    format: '${value}',
    shared: true,
    position: 'auto'
  })
  .responsive(true)
  .theme('auto')
  .exportEnabled(true)
  .zoomEnabled(true)
  .panEnabled(true)
  .crosshair(true)
  .build();
```

---

## List Blocks

### Layout Styles

1. **Vertical** - Traditional list view
2. **Horizontal** - Horizontal scrolling cards
3. **Grid** - Responsive grid layout
4. **Compact** - Minimal space usage
5. **Detailed** - Rich information display

### Basic Usage

```typescript
import { ListBlockBuilder, ListLayoutStyle } from '@hypelab/lark-dashboard-sdk';

const list = ListBlockBuilder.vertical()
  .dataSource(appToken, tableId)
  .title('Task List')
  .titleField('Task Name')
  .subtitleField('Assignee')
  .descriptionField('Description')
  .build();
```

### Item Templates

Configure how list items are displayed:

```typescript
const list = ListBlockBuilder.detailed()
  .dataSource(appToken, tableId)
  .titleField('Product Name')        // Required
  .subtitleField('Price')            // Optional
  .descriptionField('Description')   // Optional
  .imageField('Product Image')       // Optional
  .iconField('Icon')                 // Optional
  .badgeField('Status')              // Optional
  .metaFields(['Category', 'Rating', 'Reviews']) // Optional
  .build();
```

### Action Buttons

Add interactive buttons to list items:

```typescript
const list = ListBlockBuilder.grid()
  .dataSource(appToken, tableId)
  .titleField('Customer Name')
  .addLinkButton('View Profile', '/customers/{id}', 'user', 'primary')
  .addEditButton('Edit', 'edit')
  .addDeleteButton('Delete', 'trash')
  .build();
```

### Sorting

```typescript
const list = ListBlockBuilder.vertical()
  .dataSource(appToken, tableId)
  .titleField('Task Name')
  .sortDesc('Created At')
  .sortAsc('Priority', 2) // Secondary sort
  .build();
```

### Filtering

```typescript
import { FilterOperator, FilterConjunction } from '@hypelab/lark-dashboard-sdk';

const list = ListBlockBuilder.grid()
  .dataSource(appToken, tableId)
  .titleField('Product Name')
  .filters(FilterConjunction.AND, [
    {
      fieldName: 'Status',
      operator: FilterOperator.IS,
      value: 'Active'
    },
    {
      fieldName: 'Stock',
      operator: FilterOperator.IS_GREATER,
      value: 0
    }
  ])
  .build();
```

### Pagination & Search

```typescript
const list = ListBlockBuilder.detailed()
  .dataSource(appToken, tableId)
  .titleField('Order ID')
  .pagination(true, 20) // Enable with 20 items per page
  .showSearch(true)
  .showFilters(true)
  .build();
```

### Grouping

```typescript
const list = ListBlockBuilder.vertical()
  .dataSource(appToken, tableId)
  .titleField('Task Name')
  .groupBy('Status')
  .build();
```

### Complete Example

```typescript
const taskList = ListBlockBuilder.detailed()
  .dataSource(appToken, tableId)
  .title('Project Tasks')
  .titleField('Task Name')
  .subtitleField('Assignee')
  .descriptionField('Description')
  .badgeField('Priority')
  .imageField('Avatar')
  .metaFields(['Due Date', 'Status', 'Category'])
  .addEditButton()
  .addDeleteButton()
  .addLinkButton('View Details', '/tasks/{id}', 'eye')
  .sortDesc('Created At')
  .filters(FilterConjunction.AND, [
    {
      fieldName: 'Status',
      operator: FilterOperator.IS_NOT,
      value: 'Completed'
    }
  ])
  .pagination(true, 20)
  .showSearch(true)
  .showFilters(true)
  .groupBy('Status')
  .clickable(true, 'detail')
  .position(0, 0)
  .size(12, 8)
  .build();
```

---

## Tab/Page Blocks

### Layout Types

1. **Horizontal Tabs** - Traditional top tabs
2. **Vertical Tabs** - Side navigation tabs
3. **Pills** - Pill-style buttons
4. **Sidebar** - Full sidebar navigation
5. **Dropdown** - Compact dropdown selector

### Basic Usage

```typescript
import { TabPageBlockBuilder } from '@hypelab/lark-dashboard-sdk';

const tabs = TabPageBlockBuilder.horizontalTabs()
  .title('Dashboard Sections')
  .tab('overview', 'Overview', ['block-1', 'block-2'], {
    icon: 'home',
    badge: 'new'
  })
  .tab('analytics', 'Analytics', ['block-3', 'block-4'], {
    icon: 'chart'
  })
  .defaultTab('overview')
  .build();
```

### Tab Configuration

```typescript
const tabs = TabPageBlockBuilder.horizontalTabs()
  .title('Business Dashboard')

  // Add tabs
  .tab('home', 'Home', ['home-1', 'home-2'], {
    icon: 'home',
    badge: 'Live',
    disabled: false
  })
  .tab('reports', 'Reports', ['report-1'], {
    icon: 'file-text',
    badge: 5 // Numeric badge
  })

  // Settings
  .defaultTab('home')
  .showTabCount(true)
  .animateTransition(true)
  .allowReorder(true)
  .allowClose(true)
  .maxTabs(10)

  .position(0, 0)
  .size(12, 10)
  .build();
```

### Layout Examples

#### Horizontal Tabs
```typescript
const horizontal = TabPageBlockBuilder.horizontalTabs()
  .title('Analytics')
  .tab('overview', 'Overview', ['block-1'])
  .tab('details', 'Details', ['block-2'])
  .build();
```

#### Vertical Tabs
```typescript
const vertical = TabPageBlockBuilder.verticalTabs()
  .title('Settings')
  .tab('general', 'General', ['settings-1'])
  .tab('security', 'Security', ['settings-2'])
  .build();
```

#### Pills
```typescript
const pills = TabPageBlockBuilder.pills()
  .title('Categories')
  .tab('all', 'All', ['products-all'], { badge: 1250 })
  .tab('featured', 'Featured', ['products-featured'], { badge: 50 })
  .build();
```

#### Sidebar
```typescript
const sidebar = TabPageBlockBuilder.sidebar()
  .title('Project Menu')
  .tab('dashboard', 'Dashboard', ['dash-1'], { icon: 'home' })
  .tab('tasks', 'Tasks', ['tasks-1'], { icon: 'check', badge: 23 })
  .tab('team', 'Team', ['team-1'], { icon: 'users' })
  .build();
```

#### Dropdown
```typescript
const dropdown = TabPageBlockBuilder.dropdown()
  .title('Quick Actions')
  .tab('create', 'Create', ['create-1'], { icon: 'plus' })
  .tab('import', 'Import', ['import-1'], { icon: 'upload' })
  .build();
```

---

## Permission Management

### Dashboard Permissions

```typescript
import {
  DashboardPermissionBuilder,
  PermissionLevel,
  SharingMode
} from '@hypelab/lark-dashboard-sdk';

// Private Dashboard
const privatePermission = new DashboardPermissionBuilder()
  .private()
  .allowComments(false)
  .allowExport(false)
  .build();

// Public Dashboard
const publicPermission = new DashboardPermissionBuilder()
  .public()
  .allowComments(true)
  .allowExport(true)
  .build();

// Share via Link
const linkPermission = new DashboardPermissionBuilder()
  .shareViaLink('SecurePassword123')
  .expiresInDays(30)
  .build();

// Team Dashboard
const teamPermission = new DashboardPermissionBuilder()
  .shareWithTeam()
  .addTeam('team_sales', PermissionLevel.EDIT)
  .addTeam('team_marketing', PermissionLevel.VIEW)
  .addUser('user_admin', PermissionLevel.ADMIN)
  .allowComments(true)
  .allowExport(true)
  .build();

// Specific Users
const specificPermission = new DashboardPermissionBuilder()
  .shareWithUsers()
  .addUser('user_alice', PermissionLevel.ADMIN)
  .addUser('user_bob', PermissionLevel.EDIT)
  .addUser('user_charlie', PermissionLevel.VIEW)
  .addDepartment('dept_finance', PermissionLevel.VIEW)
  .expiresInDays(90)
  .build();
```

### Block Permissions

```typescript
import { BlockPermissionBuilder } from '@hypelab/lark-dashboard-sdk';

const blockPermission = new BlockPermissionBuilder()
  .blockId('sensitive-block-1')
  .addUser('user_cfo', PermissionLevel.ADMIN)
  .addTeam('team_finance', PermissionLevel.VIEW)
  .inheritFromDashboard(false)
  .build();
```

### Permission Levels

- **OWNER** - Full control
- **ADMIN** - Manage permissions and settings
- **EDIT** - Edit content
- **VIEW** - Read-only access
- **COMMENT** - Can comment only
- **NONE** - No access

### Permission Helpers

```typescript
import { PermissionHelper } from '@hypelab/lark-dashboard-sdk';

// Check permission level
const hasPermission = PermissionHelper.hasPermission(
  PermissionLevel.EDIT,
  PermissionLevel.VIEW
); // true

// Get highest level
const highest = PermissionHelper.getHighestLevel([
  PermissionLevel.VIEW,
  PermissionLevel.EDIT,
  PermissionLevel.ADMIN
]); // PermissionLevel.ADMIN

// Check expiration
const isExpired = PermissionHelper.isExpired(permission);

// Validate permission
const validation = PermissionHelper.validate(permission);
if (!validation.valid) {
  console.error(validation.errors);
}
```

---

## Advanced Filtering

### New Filter Operators (2025)

```typescript
enum FilterOperator {
  // Existing
  IS = 'is',
  IS_NOT = 'isNot',
  CONTAINS = 'contains',
  DOES_NOT_CONTAIN = 'doesNotContain',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
  IS_GREATER = 'isGreater',
  IS_GREATER_EQUAL = 'isGreaterEqual',
  IS_LESS = 'isLess',
  IS_LESS_EQUAL = 'isLessEqual',

  // New 2025
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  IS_BETWEEN = 'isBetween',
  IS_ANY_OF = 'isAnyOf',
  IS_NONE_OF = 'isNoneOf',
  MATCHES_REGEX = 'matchesRegex',
  IS_WITHIN_DAYS = 'isWithinDays',
  IS_BEFORE_DATE = 'isBeforeDate',
  IS_AFTER_DATE = 'isAfterDate',
}
```

### Filter Examples

```typescript
// String filters
{
  fieldName: 'Name',
  operator: FilterOperator.STARTS_WITH,
  value: 'John',
  caseSensitive: false
}

// Between filter
{
  fieldName: 'Price',
  operator: FilterOperator.IS_BETWEEN,
  value: 100,
  secondValue: 1000
}

// Multiple values
{
  fieldName: 'Status',
  operator: FilterOperator.IS_ANY_OF,
  values: ['Active', 'Pending', 'Processing']
}

// Regex filter
{
  fieldName: 'Email',
  operator: FilterOperator.MATCHES_REGEX,
  value: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
}

// Date filters
{
  fieldName: 'Created Date',
  operator: FilterOperator.IS_WITHIN_DAYS,
  value: 7
}

{
  fieldName: 'Due Date',
  operator: FilterOperator.IS_AFTER_DATE,
  value: new Date().toISOString()
}
```

---

## Enhanced Metrics

### New Features

```typescript
const metrics = MetricsBlockBuilder
  .dataSource(appToken, tableId, undefined, 60, true)
  .field('Revenue')
  .aggregation(AggregationType.SUM)
  .title('Total Revenue')
  .prefix('$')
  .decimals(2)

  // New 2025 features
  .comparisonEnabled(true)
  .comparisonPeriod('month')
  .sparklineEnabled(true)
  .target(1000000)
  .targetLabel('Monthly Goal')

  .conditionalFormat({
    operator: FilterOperator.IS_GREATER,
    value: 1000000,
    color: '#22c55e',
    backgroundColor: '#f0fdf4',
    textStyle: { bold: true, fontSize: 24 }
  })

  .build();
```

### New Aggregation Types

```typescript
enum AggregationType {
  // Existing...

  // New 2025
  MEDIAN = 'Median',
  STDDEV = 'StdDev',
  VARIANCE = 'Variance',
  RANGE = 'Range',
  FIRST = 'First',
  LAST = 'Last',
}
```

---

## Performance Features

### Auto-Refresh

```typescript
const dataSource = {
  appToken,
  tableId,
  viewId,
  refreshInterval: 300, // Refresh every 5 minutes
  cacheEnabled: true    // Enable caching
};
```

### Dashboard Settings

```typescript
const settings: DashboardSettings = {
  autoRefresh: true,
  refreshInterval: 300,
  fullscreenEnabled: true,
  exportEnabled: true,
  printEnabled: true,
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  theme: {
    name: 'Corporate',
    colorPrimary: '#2563eb',
    colorSecondary: '#7c3aed',
    fontFamily: 'Inter, sans-serif'
  }
};
```

---

## Responsive Layouts

### Enhanced Layout Configuration

```typescript
const layout = {
  columns: [
    {
      width: 8,
      blockIds: ['main-1', 'main-2'],
      minWidth: 640,
      maxWidth: 1200,
      collapsible: true,
      collapsed: false
    },
    {
      width: 4,
      blockIds: ['sidebar-1'],
      minWidth: 320,
      collapsible: true
    }
  ],
  gap: 16,
  padding: 24,
  responsive: true,
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1280
  },
  backgroundColor: '#ffffff',
  borderRadius: 12
};
```

---

## Migration Guide

### From 1.x to 2.0 (2025)

#### Type Changes

```typescript
// Old
import { BlockType } from '@hypelab/lark-dashboard-sdk';
// BlockType.CHART = 1, METRICS = 3, etc.

// New - Additional types
BlockType.LIST = 6
BlockType.TAB_PAGE = 7
BlockType.FILTER = 8
BlockType.CALENDAR = 9
BlockType.TIMELINE = 10
```

#### Chart Enhancements

```typescript
// Old
const chart = ChartBlockBuilder.line()
  .dataSource(appToken, tableId)
  .build();

// New - Enhanced with 2025 features
const chart = ChartBlockBuilder.line()
  .dataSource(appToken, tableId, undefined, 300, true)
  .animation({ enabled: true, duration: 1000 })
  .tooltip({ enabled: true })
  .responsive(true)
  .exportEnabled(true)
  .build();
```

#### New Builders

```typescript
// Add to imports
import {
  ListBlockBuilder,
  TabPageBlockBuilder,
  DashboardPermissionBuilder,
  BlockPermissionBuilder
} from '@hypelab/lark-dashboard-sdk';
```

#### Backward Compatibility

All existing code remains compatible. New features are optional enhancements.

---

## Complete Example

See `examples/2025-features-complete.ts` for a comprehensive example using all 2025 features together.

---

## API Reference

For detailed API documentation, see the TypeScript definitions in `src/types.ts`.

## Support

- GitHub: https://github.com/hypelab/lark-dashboard-sdk
- Issues: https://github.com/hypelab/lark-dashboard-sdk/issues
- Documentation: https://github.com/hypelab/lark-dashboard-sdk#readme

---

Copyright 2025 HypeLab
