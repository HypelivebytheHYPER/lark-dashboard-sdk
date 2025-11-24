# Lark Dashboard SDK 2.0 - 2025 Enhanced Edition

[![npm version](https://img.shields.io/npm/v/@hypelab/lark-dashboard-sdk.svg)](https://www.npmjs.com/package/@hypelab/lark-dashboard-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

Production-ready TypeScript SDK for creating advanced Lark/Feishu dashboards with the latest 2025 features including list blocks, tab navigation, advanced permissions, and enhanced visualizations.

## What's New in 2.0 (2025)

### New Block Types
- **List Blocks** - 5 layout styles with rich templates and actions
- **Tab/Page Blocks** - 5 navigation patterns for organized dashboards
- **Filter Blocks** - Standalone filtering controls
- **Calendar & Timeline Views** - Time-based data visualization

### Enhanced Charts
- **8 New Chart Types**: Heatmap, Waterfall, Gauge, Treemap, Bubble, Sankey, Box Plot, Candlestick
- **Interactive Features**: Zoom, pan, crosshair, animations
- **Performance**: Auto-refresh, caching, optimized rendering
- **Export**: PDF, PNG, SVG support

### Advanced Features
- **Permission Management** - Dashboard and block-level access control
- **9 New Filter Operators** - Regex, date ranges, multiple values
- **Enhanced Metrics** - Comparisons, sparklines, targets
- **Responsive Layouts** - Breakpoints, collapsible columns
- **Theme Support** - Light, dark, and custom themes

## Installation

```bash
npm install @hypelab/lark-dashboard-sdk
```

## Quick Start

### Basic Dashboard with 2025 Features

```typescript
import {
  LarkDashboardClient,
  ChartBlockBuilder,
  ListBlockBuilder,
  TabPageBlockBuilder,
  DashboardPermissionBuilder,
  ChartType,
  PermissionLevel
} from '@hypelab/lark-dashboard-sdk';

// Initialize client
const client = new LarkDashboardClient({
  apiKey: 'your_api_key',
  region: 'sg'
});

// Create a heatmap chart (New 2025)
const heatmap = ChartBlockBuilder
  .chartType(ChartType.HEATMAP)
  .dataSource(appToken, tableId, undefined, 300, true)
  .title('Sales Heatmap')
  .animation({ enabled: true, duration: 1000 })
  .responsive(true)
  .exportEnabled(true)
  .zoomEnabled(true)
  .build();

// Create a list block (New 2025)
const taskList = ListBlockBuilder.vertical()
  .dataSource(appToken, tableId)
  .title('Active Tasks')
  .titleField('Task Name')
  .subtitleField('Assignee')
  .badgeField('Status')
  .addEditButton()
  .addDeleteButton()
  .pagination(true, 20)
  .showSearch(true)
  .build();

// Create tabbed interface (New 2025)
const tabs = TabPageBlockBuilder.horizontalTabs()
  .title('Dashboard')
  .tab('overview', 'Overview', ['chart-1', 'metrics-1'], {
    icon: 'home',
    badge: 'Live'
  })
  .tab('tasks', 'Tasks', ['list-1'], {
    icon: 'check-square',
    badge: 23
  })
  .defaultTab('overview')
  .animateTransition(true)
  .build();

// Set permissions (New 2025)
const permission = new DashboardPermissionBuilder()
  .shareWithTeam()
  .addTeam('team_sales', PermissionLevel.EDIT)
  .addUser('user_admin', PermissionLevel.ADMIN)
  .allowComments(true)
  .allowExport(true)
  .build();
```

## Feature Highlights

### List Blocks

Create rich, interactive lists with 5 layout styles:

```typescript
// Vertical list
const list = ListBlockBuilder.vertical()
  .dataSource(appToken, tableId)
  .titleField('Product Name')
  .subtitleField('Price')
  .descriptionField('Description')
  .imageField('Image')
  .badgeField('Status')
  .metaFields(['Category', 'Rating'])
  .addLinkButton('View', '/products/{id}')
  .addEditButton()
  .sortDesc('Rating')
  .pagination(true, 20)
  .showSearch(true)
  .build();

// Grid layout
const grid = ListBlockBuilder.grid()
  .dataSource(appToken, tableId)
  .titleField('Title')
  .imageField('Thumbnail')
  .build();

// Compact, horizontal, or detailed layouts also available
```

### Tab/Page Navigation

Organize dashboards with tabbed interfaces:

```typescript
const tabs = TabPageBlockBuilder.horizontalTabs()
  .tab('home', 'Home', ['block-1', 'block-2'], {
    icon: 'home',
    badge: 'new'
  })
  .tab('analytics', 'Analytics', ['block-3'], {
    icon: 'chart',
    badge: 5
  })
  .defaultTab('home')
  .showTabCount(true)
  .animateTransition(true)
  .allowReorder(true)
  .build();

// Also available: verticalTabs, pills, sidebar, dropdown
```

### Advanced Permissions

Granular access control:

```typescript
// Dashboard permission
const dashPermission = new DashboardPermissionBuilder()
  .shareWithUsers()
  .addUser('alice', PermissionLevel.ADMIN)
  .addUser('bob', PermissionLevel.EDIT)
  .addTeam('team_sales', PermissionLevel.VIEW)
  .allowComments(true)
  .expiresInDays(90)
  .build();

// Block permission
const blockPermission = new BlockPermissionBuilder()
  .blockId('sensitive-data')
  .addUser('cfo', PermissionLevel.ADMIN)
  .addTeam('finance', PermissionLevel.VIEW)
  .inheritFromDashboard(false)
  .build();
```

### Enhanced Charts

New chart types and features:

```typescript
// Gauge chart
const gauge = ChartBlockBuilder
  .chartType(ChartType.GAUGE)
  .dataSource(appToken, tableId)
  .yAxis([{
    fieldName: 'Progress',
    min: 0,
    max: 100
  }])
  .colors(['#ef4444', '#fbbf24', '#22c55e'])
  .build();

// Waterfall chart
const waterfall = ChartBlockBuilder
  .chartType(ChartType.WATERFALL)
  .dataSource(appToken, tableId)
  .xAxis('Category')
  .yAxis([{ fieldName: 'Amount', aggregation: AggregationType.SUM }])
  .animation({ enabled: true })
  .build();

// Heatmap, Sankey, Candlestick, and more available
```

### Advanced Filtering

9 new filter operators:

```typescript
// String filters
{ fieldName: 'Name', operator: FilterOperator.STARTS_WITH, value: 'John' }
{ fieldName: 'Email', operator: FilterOperator.MATCHES_REGEX, value: '.*@company.com' }

// Numeric ranges
{ fieldName: 'Price', operator: FilterOperator.IS_BETWEEN, value: 100, secondValue: 1000 }

// Multiple values
{ fieldName: 'Status', operator: FilterOperator.IS_ANY_OF, values: ['Active', 'Pending'] }

// Date filters
{ fieldName: 'Date', operator: FilterOperator.IS_WITHIN_DAYS, value: 7 }
{ fieldName: 'Due', operator: FilterOperator.IS_AFTER_DATE, value: new Date().toISOString() }
```

### Enhanced Metrics

Rich KPI displays:

```typescript
const metrics = MetricsBlockBuilder
  .dataSource(appToken, tableId, undefined, 60, true)
  .field('Revenue')
  .aggregation(AggregationType.SUM)
  .title('Total Revenue')
  .prefix('$')
  .comparisonEnabled(true)
  .comparisonPeriod('month')
  .sparklineEnabled(true)
  .target(1000000)
  .targetLabel('Goal')
  .build();
```

## Examples

### Complete 2025 Dashboard

See `examples/2025-features-complete.ts` for a comprehensive example using all features.

### Run Examples

```bash
# List blocks
npm run example:list

# Tab/page navigation
npm run example:tabpage

# Permission management
npm run example:permissions

# Complete 2025 features
npm run example:2025
```

## Documentation

- **[2025 Features Guide](FEATURES-2025.md)** - Complete guide to new features
- **[API Reference](src/types.ts)** - Full TypeScript definitions
- **[Examples](examples/)** - Working code examples
- **[Migration Guide](FEATURES-2025.md#migration-guide)** - Upgrade from 1.x

## API Overview

### Builders

```typescript
// Chart blocks
ChartBlockBuilder.bar()
ChartBlockBuilder.line()
ChartBlockBuilder.heatmap()    // New 2025
ChartBlockBuilder.waterfall()  // New 2025
ChartBlockBuilder.gauge()      // New 2025

// List blocks (New 2025)
ListBlockBuilder.vertical()
ListBlockBuilder.horizontal()
ListBlockBuilder.grid()
ListBlockBuilder.compact()
ListBlockBuilder.detailed()

// Tab/page blocks (New 2025)
TabPageBlockBuilder.horizontalTabs()
TabPageBlockBuilder.verticalTabs()
TabPageBlockBuilder.pills()
TabPageBlockBuilder.sidebar()
TabPageBlockBuilder.dropdown()

// Metrics
MetricsBlockBuilder

// View blocks
ViewBlockBuilder

// Text blocks
TextBlockBuilder
```

### Permission Management (New 2025)

```typescript
// Dashboard permissions
DashboardPermissionBuilder
  .private()
  .public()
  .shareViaLink(password)
  .shareWithTeam()
  .shareWithUsers()

// Block permissions
BlockPermissionBuilder

// Helpers
PermissionHelper.hasPermission()
PermissionHelper.validate()
PermissionHelper.isExpired()
```

## TypeScript Support

Full TypeScript definitions with IntelliSense:

```typescript
import {
  BlockType,
  ChartType,
  ListLayoutStyle,
  TabPageLayout,
  PermissionLevel,
  SharingMode,
  FilterOperator,
  AggregationType
} from '@hypelab/lark-dashboard-sdk';
```

## Architecture

```
src/
├── types.ts              # Enhanced type definitions
├── builders/
│   ├── chart-builder.ts    # Enhanced chart builder
│   ├── metrics-builder.ts  # Enhanced metrics builder
│   ├── list-builder.ts     # New: List block builder
│   ├── tabpage-builder.ts  # New: Tab/page builder
│   └── index.ts
├── permissions/            # New: Permission management
│   ├── permission-manager.ts
│   └── index.ts
├── api/
│   ├── client.ts
│   └── dashboard-api.ts
└── utils/
```

## Browser Support

- Modern browsers with ES2020 support
- Node.js 16+

## Performance

- Auto-refresh with caching
- Optimized rendering
- Lazy loading
- Responsive design

## Security

- Row-level security
- Dashboard permissions
- Block permissions
- Public link passwords
- Expiration dates
- Permission validation

## Contributing

Contributions welcome! Please read our contributing guidelines.

## Changelog

### 2.0.0 (2025)

**New Features:**
- List blocks with 5 layout styles
- Tab/page blocks with 5 navigation patterns
- 8 new chart types
- Permission management system
- 9 new filter operators
- Enhanced metrics with comparisons
- Auto-refresh and caching
- Theme support
- Responsive layouts

**Enhancements:**
- Chart animations and interactions
- Export functionality
- Dashboard settings
- Performance optimizations

**Breaking Changes:**
- None - fully backward compatible

### 1.0.0

- Initial release

## License

MIT License - see LICENSE file

## Support

- **GitHub Issues**: [Report bugs](https://github.com/hypelab/lark-dashboard-sdk/issues)
- **Documentation**: [Full docs](https://github.com/hypelab/lark-dashboard-sdk#readme)
- **Examples**: [Code samples](examples/)

## Credits

Developed by [HypeLab](https://hypelab.com)

---

**Ready to build advanced dashboards? [Get started now!](#quick-start)**
