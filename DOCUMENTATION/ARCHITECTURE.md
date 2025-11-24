# Architecture Overview

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                       │
│  (Node.js, TypeScript, JavaScript)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│               Lark Dashboard SDK                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        LarkDashboardClient                          │   │
│  │  (Request handling, authentication, retry logic)    │   │
│  └────────────┬─────────────────┬────────────┬─────────┘   │
│               │                 │            │              │
│  ┌────────────▼──┐  ┌───────────▼──┐  ┌─────▼──────────┐  │
│  │  Builders     │  │  Permissions │  │  Utilities     │  │
│  │               │  │              │  │                │  │
│  │ • Chart       │  │ • Dashboard  │  │ • Validation   │  │
│  │ • Metrics     │  │ • Block      │  │ • Error Types  │  │
│  │ • View        │  │              │  │ • Logging      │  │
│  │ • Text        │  │              │  │                │  │
│  │ • List (2025) │  │              │  │                │  │
│  │ • TabPage     │  │              │  │                │  │
│  │ • Filter      │  │              │  │                │  │
│  └───────────────┘  └──────────────┘  └────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Core API Layer                         │   │
│  │  (HTTP client, request formatting, response parsing)│   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Lark REST API                              │
│  https://open.lark.com/open-apis/v1                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│             Lark Cloud Infrastructure                       │
│  • Dashboard storage                                        │
│  • Data aggregation                                         │
│  • Access control                                           │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. LarkDashboardClient

Main entry point for all SDK operations.

**Responsibilities:**
- Manage authentication (API key)
- Execute API requests
- Handle retries and timeouts
- Provide type-safe methods

**Key Methods:**
```
createDashboard() → Promise<string>
deleteDashboard() → Promise<void>
addBlock() → Promise<string>
updateBlock() → Promise<void>
deleteBlock() → Promise<void>
listBlocks() → Promise<DashboardBlock[]>
batchCreateBlocks() → Promise<BlockResult[]>
setDashboardPermissions() → Promise<void>
setBlockPermissions() → Promise<void>
```

### 2. Block Builders

Factory classes for creating different block types.

**Patterns Used:**
- Builder Pattern: Fluent API for configuration
- Type Safety: Compile-time validation
- Immutability: Each method returns new instance

**Block Types:**
```
ChartBlockBuilder
  ├── bar()
  ├── line()
  ├── pie()
  ├── scatter()
  ├── area()
  ├── column()
  ├── funnel()
  ├── radar()
  ├── heatmap()        // 2025
  ├── treemap()        // 2025
  ├── waterfall()      // 2025
  ├── gauge()          // 2025
  ├── bubble()         // 2025
  ├── sankey()         // 2025
  ├── boxplot()        // 2025
  └── candlestick()    // 2025

MetricsBlockBuilder    // Single KPI metric
ViewBlockBuilder
  ├── table()
  ├── kanban()
  ├── gallery()
  ├── gantt()
  ├── form()
  ├── calendar()       // 2025
  └── timeline()       // 2025

TextBlockBuilder       // Text content
ListBlockBuilder       // 2025: Formatted lists
TabPageBlockBuilder    // 2025: Organized pages
FilterBlockBuilder     // 2025: Interactive filters
```

### 3. Permission System

Manage dashboard and block-level access control.

**Architecture:**
```
DashboardPermissionBuilder
├── addOwner(userId)
├── addEditor(userId)
├── addViewer(userId)
├── addGroupAsEditor(groupId)
├── addGroupAsViewer(groupId)
└── build() → DashboardPermissions

BlockPermissionBuilder
├── addEditor(userId)
├── addViewer(userId)
├── addGroupAsEditor(groupId)
├── addGroupAsViewer(groupId)
└── build() → BlockPermissions
```

### 4. Type System

Full TypeScript support with comprehensive types.

**Core Types:**
```typescript
interface DashboardBlock {
  id: string;
  type: BlockType;
  title?: string;
  config: ChartConfig | MetricsConfig | ViewConfig | TextConfig;
  dataSource?: DataSource;
  filters?: Filter[];
}

interface ChartConfig {
  chartType: ChartType;
  xAxis: AxisConfig;
  yAxis: YAxisConfig[];
  colors?: string[];
  legend?: boolean;
}

interface MetricsConfig {
  fieldName: string;
  aggregation: AggregationType;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

interface ViewConfig {
  viewType: ViewType;
  height?: number;
  showToolbar?: boolean;
}

interface DataSource {
  appToken: string;
  tableId: string;
  viewId?: string;
}
```

## Data Flow

### Creating a Dashboard with Blocks

```
Step 1: User Code
  client.createDashboard({name, appToken})
       ↓
Step 2: Client Method
  Validates input
  Creates HTTP request
       ↓
Step 3: HTTP Layer
  Adds auth header
  Sends POST request to Lark API
       ↓
Step 4: Lark API
  Creates dashboard in database
  Returns dashboard ID
       ↓
Step 5: Client Processing
  Parses response
  Returns dashboard ID to user
       ↓
Step 6: User Code
  Get dashboardId
  Create blocks...

Step 7: User Code
  ChartBlockBuilder.bar()
    .dataSource(...)
    .xAxis(...)
    .yAxis(...)
    .title(...)
    .build()  →  DashboardBlock object
       ↓
Step 8: User Code
  client.addBlock(appToken, dashboardId, block)
       ↓
Step 9: Client Method
  Validates block configuration
  Transforms block to API format
       ↓
Step 10: HTTP Layer
  Sends POST request with block data
       ↓
Step 11: Lark API
  Creates block in dashboard
  Returns block ID
       ↓
Step 12: Client Returns
  blockId to user
```

## Error Handling Architecture

```
┌─────────────────────────────────────┐
│   API Request                       │
└──────────────┬──────────────────────┘
               │
     ┌─────────▼──────────┐
     │  Response Handler   │
     └─────────┬──────────┘
               │
     ┌─────────▼──────────────────┐
     │  Status Code Check          │
     │  2xx → Success              │
     │  4xx → Client Error         │
     │  5xx → Server Error         │
     │  Network → Network Error    │
     └─────────┬──────────────────┘
               │
  ┌────────────┼────────────┬────────────┐
  │            │            │            │
  ▼            ▼            ▼            ▼
Success   ValidationErr  AuthErr    NetworkErr
  │            │            │            │
  └────────────┼────────────┼────────────┘
               │            │
          ┌────▼────────────▼────┐
          │  Retry Logic?        │
          │  Transient? Retry    │
          │  Permanent? Fail     │
          └────┬─────────────────┘
               │
          ┌────▼──────────┐
          │  Return       │
          │  Result/Error │
          └───────────────┘
```

## Request Pipeline

```
Input Validation
    ↓
Builder Transformation
    ↓
Filter Processing
    ↓
Data Formatting
    ↓
HTTP Request Creation
    ↓
Authentication Headers
    ↓
Timeout Configuration
    ↓
Send Request
    ↓
Response Parsing
    ↓
Error Handling
    ↓
Retry Logic (if needed)
    ↓
Return Result
```

## Batch Operation Pipeline

```
User provides array of blocks
    ↓
Validate each block
    ↓
Transform all blocks to API format
    ↓
Group into batches (max 100)
    ↓
For each batch:
    ├─ Send batch request
    ├─ Handle response
    ├─ Track failures
    └─ Retry if needed
    ↓
Aggregate results
    ↓
Return result array
    ↓
Report successes/failures
```

## Extension Points

The SDK is designed for extension:

### 1. Custom Builders

```typescript
class CustomMetricBuilder extends MetricsBlockBuilder {
  constructor(appToken: string, tableId: string) {
    super()
      .dataSource(appToken, tableId)
      .decimals(2)
      .numberFormat('1000');
  }
}
```

### 2. Custom Client

```typescript
class EnhancedLarkClient extends LarkDashboardClient {
  async createDashboardWithMetrics(
    name: string,
    appToken: string,
    metrics: MetricConfig[]
  ) {
    const dashboardId = await this.createDashboard({ name, appToken });
    const blocks = metrics.map(m => /* create block */);
    await this.batchCreateBlocks(appToken, blocks);
    return dashboardId;
  }
}
```

### 3. Middleware

```typescript
class LoggingClient extends LarkDashboardClient {
  async addBlock(appToken: string, dashboardId: string, block: DashboardBlock) {
    console.log(`Adding block: ${block.title}`);
    const result = await super.addBlock(appToken, dashboardId, block);
    console.log(`Block added: ${result}`);
    return result;
  }
}
```

## Performance Considerations

### Memory Usage

- Each builder creates new object (no mutation)
- Blocks are serialized before transmission
- Large batches processed sequentially

### Network Efficiency

- Batch operations reduce HTTP requests
- Gzip compression enabled
- Connection pooling recommended

### Processing Time

- Validation: O(n) where n = fields
- Transformation: O(n) where n = blocks
- Network: Depends on Lark API

## Security Considerations

### Authentication

- API key stored in memory
- Passed via HTTP Authorization header
- Never logged or exposed

### Permissions

- All operations respect Lark permissions
- Block-level access control enforced
- No data exposed beyond permissions

### Input Validation

- All inputs validated before API call
- SQL injection prevention via parameterization
- XSS prevention via JSON serialization

## Scalability

### Single Client Instance

```typescript
const client = new LarkDashboardClient({ apiKey });

// Can be reused for multiple operations
await client.createDashboard(...);
await client.addBlock(...);
await client.addBlock(...);
```

### Multiple Clients (if needed)

```typescript
const client1 = new LarkDashboardClient({ apiKey: key1 });
const client2 = new LarkDashboardClient({ apiKey: key2 });

// Each maintains own connection/session
```

### Rate Limiting

- Lark: 600 requests/minute (tenant)
- SDK: Provides automatic retries
- Recommended: Batch operations

## Integration Points

The SDK integrates with:

1. **Node.js/Express**: Standard npm package
2. **TypeScript**: Full type support
3. **MCP Server**: Claude Code integration
4. **Lark API**: REST endpoints
5. **Lark Bitable**: Data source

## Module Organization

```
@hypelab/lark-dashboard-sdk/
├── index.ts                          # Exports
├── src/
│   ├── api/
│   │   ├── client.ts                # Main client
│   │   └── http.ts                  # HTTP layer
│   ├── builders/
│   │   ├── ChartBlockBuilder.ts      # Chart blocks
│   │   ├── MetricsBlockBuilder.ts    # Metrics blocks
│   │   ├── ViewBlockBuilder.ts       # View blocks
│   │   ├── TextBlockBuilder.ts       # Text blocks
│   │   ├── ListBlockBuilder.ts       # List blocks (2025)
│   │   ├── TabPageBlockBuilder.ts    # Tab pages (2025)
│   │   └── index.ts                 # Builder exports
│   ├── permissions/
│   │   ├── DashboardPermissionBuilder.ts
│   │   ├── BlockPermissionBuilder.ts
│   │   └── index.ts                 # Permission exports
│   ├── types.ts                      # Type definitions
│   ├── utils/                        # Utilities
│   │   ├── validation.ts
│   │   ├── errors.ts
│   │   └── logging.ts
│   └── mcp-server.ts                 # MCP integration
├── dist/                             # Compiled JS
└── tests/                            # Test files
```

## Design Patterns Used

1. **Builder Pattern**: Fluent API (builders)
2. **Factory Pattern**: Block creation (builders)
3. **Strategy Pattern**: Error handling
4. **Retry Pattern**: Automatic retries
5. **Singleton Pattern**: Single client instance
6. **Adapter Pattern**: MCP server wrapper

## Summary

The SDK architecture provides:

- Clean separation of concerns
- Type safety throughout
- Extensible design
- Robust error handling
- Excellent performance
- Simple, intuitive API

Designed for both ease of use and production reliability!
