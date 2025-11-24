# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-25

### Added
- Initial release of Lark Dashboard SDK
- TypeScript SDK for creating and managing Lark/Feishu dashboards
- Support for 7 block types: Charts, Metrics, Views, Text, Lists, Tab Pages, Filters
- Fluent builder API for all block types
- Model Context Protocol (MCP) server for Claude Code integration
- Comprehensive error handling and validation
- Retry logic with exponential backoff
- Batch operations support
- Region support (Singapore, China, US)
- Full TypeScript type definitions
- Production-ready logging and debugging

### Features
- **ChartBlockBuilder**: Bar, Line, Pie, Area, Scatter charts with full configuration
- **MetricsBlockBuilder**: KPI metrics with aggregations and trend comparisons
- **ViewBlockBuilder**: Table, Kanban, Gallery, Gantt, Calendar views
- **TextBlockBuilder**: Headings, paragraphs with formatting support
- **ListBlockBuilder**: Ordered and unordered lists (2025 feature)
- **TabPageBlockBuilder**: Multi-tab dashboard pages (2025 feature)
- **FilterBlockBuilder**: Advanced filtering capabilities (2025 feature)

### MCP Server
- 7 MCP tools for dashboard management
- Native Claude Code integration
- Environment-based configuration
- Automatic authentication handling

### Developer Experience
- Comprehensive TypeScript support
- JSDoc comments on all public APIs
- Example implementations
- Error messages with debugging context
- Configurable logging levels

### Dependencies
- axios: ^1.6.0
- axios-retry: ^4.0.0
- @modelcontextprotocol/sdk: ^1.0.0

### Requirements
- Node.js >= 16.0.0
- TypeScript >= 5.0.0 (optional)

## [2.0.0] - 2025-11-25

### Added - 2025 Enhanced Edition

#### New Block Types
- **List Blocks** with 5 layout styles (vertical, horizontal, grid, compact, detailed)
- **Tab/Page Blocks** with 5 navigation patterns
- **Filter Blocks**, **Calendar Views**, **Timeline Views**

#### New Chart Types (8 Additional)
- Heatmap, Treemap, Waterfall, Gauge, Bubble, Sankey, Box Plot, Candlestick

#### Permission Management System
- Dashboard-level and block-level permissions
- 6 permission levels (owner, admin, edit, view, comment, none)
- 5 sharing modes (private, public, link, team, specific users)
- Password-protected links and expiration dates
- Permission validation and helpers

#### Advanced Features
- 9 new filter operators (regex, date ranges, multiple values)
- Enhanced metrics with comparisons, sparklines, targets
- Chart animations, tooltips, zoom, pan, export
- Auto-refresh and intelligent caching
- Responsive layouts with breakpoints
- Theme support (light, dark, custom)
- Dashboard settings and analytics

### Enhanced
- All existing builders maintain backward compatibility
- Optional new parameters for enhanced features
- Extended type system with 2025 features

### Documentation
- FEATURES-2025.md - Comprehensive feature guide
- MIGRATION-GUIDE.md - Upgrade instructions
- README-2025.md - Updated documentation
- 4 new example files

### Breaking Changes
**None** - Fully backward compatible with 1.x

---

[2.0.0]: https://github.com/hypelab/lark-dashboard-sdk/releases/tag/v2.0.0
[1.0.0]: https://github.com/hypelab/lark-dashboard-sdk/releases/tag/v1.0.0
