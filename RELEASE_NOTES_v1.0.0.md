# Lark Dashboard SDK v1.0.0 - Production Ready 🚀

## Overview

The Lark Dashboard SDK v1.0.0 is a production-ready TypeScript SDK for creating and managing Lark/Feishu dashboards via REST API with native Model Context Protocol (MCP) support for Claude Code integration.

## Key Metrics

- **5,350+ Lines** of production TypeScript code
- **30+ Dashboard Block Types** including 2025 features
- **13 Builder Classes** for intuitive API design
- **Package Size**: 544 KB (dist directory)
- **7 MCP Tools** for AI-powered dashboard creation
- **6 Complete Examples** demonstrating all features

## Major Features

### 🎨 Comprehensive Block Type Support

1. **Chart Blocks** (13 types)
   - Bar, Line, Pie, Area, Scatter (standard)
   - Heatmap, Treemap, Waterfall, Gauge (advanced)
   - Bubble, Sankey, Box Plot, Candlestick (specialized)

2. **Metrics Blocks**
   - KPI cards with aggregations (SUM, AVG, COUNT, MIN, MAX)
   - Trend comparisons with previous periods
   - Custom formatting (prefix, suffix, decimals)
   - Sparkline visualizations

3. **View Blocks** (6 types)
   - Table, Kanban, Gallery views
   - Gantt, Calendar, Timeline views
   - Customizable toolbars and layouts

4. **Text Blocks**
   - Headings (H1-H6)
   - Paragraphs with rich formatting
   - Alignment and styling options

5. **List Blocks** (2025 Feature)
   - 5 layout styles: vertical, horizontal, grid, compact, detailed
   - Custom item templates
   - Dynamic data binding

6. **Tab/Page Blocks** (2025 Feature)
   - 5 navigation patterns
   - Multi-page dashboard organization
   - Nested content support

7. **Filter Blocks** (2025 Feature)
   - 9 filter operators including regex
   - Date ranges and multiple values
   - AND/OR conjunction support

### 🔧 Developer Experience

- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Fluent API**: Intuitive builder pattern for all block types
- **Error Handling**: Robust validation and error recovery
- **Retry Logic**: Automatic retries with exponential backoff
- **Batch Operations**: Efficiently create multiple blocks at once
- **Regional Support**: Singapore, China, and US regions

### 🤖 MCP Server Integration

Native Claude Code integration via Model Context Protocol:
- 7 MCP tools for dashboard management
- Environment-based configuration
- Automatic authentication handling
- Natural language dashboard creation

### 🔐 Permission Management System

- Dashboard-level and block-level permissions
- 6 permission levels (owner, admin, edit, view, comment, none)
- 5 sharing modes (private, public, link, team, specific users)
- Password-protected links
- Expiration dates for shared links

### 🎯 Advanced Features

- **Auto-refresh**: Configurable data refresh intervals
- **Intelligent Caching**: Optimized performance with smart caching
- **Responsive Layouts**: Automatic adaptation to screen sizes
- **Theme Support**: Light, dark, and custom themes
- **Dashboard Analytics**: Built-in usage tracking
- **Export Options**: PDF, PNG, and data export

## Installation

```bash
npm install @hypelab/lark-dashboard-sdk
```

## Quick Start

```typescript
import { LarkDashboardClient, ChartBlockBuilder, AggregationType } from '@hypelab/lark-dashboard-sdk';

const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  region: 'sg',
  logging: true,
});

// Create dashboard
const dashboardId = await client.createDashboard({
  name: 'Sales Dashboard',
  appToken: 'YOUR_APP_TOKEN',
});

// Add bar chart
const chartBlock = ChartBlockBuilder.bar()
  .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID')
  .xAxis({ fieldName: 'Category' })
  .yAxis([{ fieldName: 'Revenue', aggregation: AggregationType.SUM }])
  .title('Revenue by Category')
  .build();

await client.addBlock('YOUR_APP_TOKEN', dashboardId, chartBlock);
```

## MCP Integration

Add to your `~/.claude.json`:

```json
{
  "mcpServers": {
    "lark-dashboard": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@hypelab/lark-dashboard-sdk"],
      "env": {
        "LARK_API_KEY": "your-api-key-here",
        "LARK_REGION": "sg"
      }
    }
  }
}
```

Then use natural language with Claude Code:
```
Create a sales dashboard with bar chart showing revenue by month,
KPI card for total revenue, and table view of recent orders
```

## What's Included

### Core Package
- Full TypeScript SDK with type definitions
- 13 builder classes for all block types
- MCP server executable (`lark-dashboard-mcp`)
- Comprehensive error handling and validation

### Documentation
- README.md - Quick start guide
- API.md - Complete API reference
- CHANGELOG.md - Version history
- MIGRATION-GUIDE.md - Upgrade instructions
- README-2025.md - 2025 features documentation
- CLAUDE_CONFIG.md - MCP setup guide

### Examples
- `basic-dashboard.ts` - Simple dashboard creation
- `complete-dashboard.ts` - Full-featured dashboard
- `multi-source-dashboard.ts` - Multiple data sources
- `realtime-dashboard.ts` - Real-time updates
- `2025-features-complete.ts` - Latest features
- `permissions-example.ts` - Permission management

## Requirements

- **Node.js**: >= 16.0.0
- **TypeScript**: >= 5.0.0 (optional, for TypeScript projects)

## Dependencies

- `axios`: ^1.6.0 - HTTP client
- `axios-retry`: ^4.0.0 - Automatic retries
- `@modelcontextprotocol/sdk`: ^1.0.0 - MCP integration

## Browser Compatibility

The SDK is designed for Node.js environments. For browser usage, bundle with webpack or similar tools.

## Testing

```bash
npm test
```

Includes comprehensive test coverage for all builders and client methods.

## License

MIT License - Free for commercial and personal use.

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/hypelab/lark-dashboard-sdk/issues)
- **Email**: dev@hypelab.com
- **Documentation**: [Full API Reference](https://github.com/hypelab/lark-dashboard-sdk#readme)

## Acknowledgments

Built with TypeScript, powered by the Model Context Protocol, designed for developers who value type safety and great DX.

## What's Next

See our [roadmap](https://github.com/hypelab/lark-dashboard-sdk/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement) for upcoming features:
- WebSocket support for real-time updates
- Dashboard templates library
- Visual dashboard builder UI
- Additional chart types
- Performance optimizations

---

**Package**: [@hypelab/lark-dashboard-sdk](https://www.npmjs.com/package/@hypelab/lark-dashboard-sdk)
**Version**: 1.0.0
**Released**: November 25, 2025
**License**: MIT
