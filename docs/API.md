# API Reference

## LarkDashboardClient

Main client for dashboard operations.

### Constructor

```typescript
new LarkDashboardClient(config: LarkClientConfig)
```

**Parameters:**

- `config.apiKey` (string, required): API authentication token
- `config.region` (LarkRegion, optional): 'sg', 'cn', or 'us'. Default: 'sg'
- `config.apiUrl` (string, optional): Override API base URL
- `config.logging` (boolean, optional): Enable logging. Default: false
- `config.timeout` (number, optional): Request timeout in ms. Default: 30000
- `config.maxRetries` (number, optional): Max retry attempts. Default: 3
- `config.retryDelay` (number, optional): Initial retry delay in ms. Default: 1000

### Methods

#### createDashboard

Create a new dashboard in a base.

```typescript
async createDashboard(dashboard: Dashboard): Promise<string>
```

**Returns:** Dashboard block ID

#### addBlock

Add a single block to a dashboard.

```typescript
async addBlock(
  appToken: string,
  dashboardId: string,
  block: DashboardBlock
): Promise<string>
```

**Returns:** Block ID

#### addBlocks

Add multiple blocks to a dashboard.

```typescript
async addBlocks(
  appToken: string,
  dashboardId: string,
  blocks: DashboardBlock[]
): Promise<BatchOperationResult[]>
```

#### updateBlock

Update an existing block.

```typescript
async updateBlock(
  appToken: string,
  dashboardId: string,
  blockId: string,
  block: Partial<DashboardBlock>
): Promise<void>
```

#### deleteBlock

Delete a block from a dashboard.

```typescript
async deleteBlock(
  appToken: string,
  dashboardId: string,
  blockId: string
): Promise<void>
```

#### deleteDashboard

Delete an entire dashboard.

```typescript
async deleteDashboard(
  appToken: string,
  dashboardId: string
): Promise<void>
```

#### getDashboard

Get dashboard details.

```typescript
async getDashboard(
  appToken: string,
  dashboardId: string
): Promise<any>
```

#### listDashboards

List all dashboards in a base.

```typescript
async listDashboards(appToken: string): Promise<any[]>
```

## Builders

### ChartBlockBuilder

Build chart blocks with fluent API.

```typescript
ChartBlockBuilder.bar()
  .dataSource(appToken, tableId, viewId?)
  .xAxis(fieldName, aggregation?, label?)
  .yAxis(axes)
  .title(title)
  .showLegend(boolean)
  .showDataLabels(boolean)
  .colors(hexColors[])
  .position(x, y)
  .size(width, height)
  .build()
```

**Static Methods:**
- `ChartBlockBuilder.bar()`
- `ChartBlockBuilder.line()`
- `ChartBlockBuilder.pie()`
- `ChartBlockBuilder.scatter()`
- `ChartBlockBuilder.area()`
- `ChartBlockBuilder.column()`
- `ChartBlockBuilder.funnel()`
- `ChartBlockBuilder.radar()`
- `ChartBlockBuilder.table()`

### MetricsBlockBuilder

Build metrics/KPI blocks.

```typescript
new MetricsBlockBuilder()
  .dataSource(appToken, tableId, viewId?)
  .field(fieldName)
  .aggregation(AggregationType)
  .title(title)
  .prefix(prefix)
  .suffix(suffix)
  .decimals(number)
  .showTrend(boolean, trendFieldName?)
  .conditionalFormat(ConditionalFormat)
  .position(x, y)
  .size(width, height)
  .build()
```

### ViewBlockBuilder

Build view blocks.

```typescript
ViewBlockBuilder.grid()
  .dataSource(appToken, tableId, viewId?)
  .title(title)
  .showToolbar(boolean)
  .height(pixels)
  .position(x, y)
  .size(width, height)
  .build()
```

**Static Methods:**
- `ViewBlockBuilder.grid()`
- `ViewBlockBuilder.kanban()`
- `ViewBlockBuilder.gallery()`
- `ViewBlockBuilder.gantt()`
- `ViewBlockBuilder.form()`

### TextBlockBuilder

Build text/markdown blocks.

```typescript
new TextBlockBuilder()
  .addText(content, style?, link?)
  .heading(content, level?)
  .paragraph(content, style?)
  .bold(content)
  .italic(content)
  .link(content, url, style?)
  .code(content)
  .alignment('left' | 'center' | 'right')
  .backgroundColor(color)
  .padding(pixels)
  .position(x, y)
  .size(width, height)
  .build()
```

## Enums

### ChartType

```typescript
enum ChartType {
  BAR = 1,
  LINE = 2,
  PIE = 3,
  SCATTER = 4,
  AREA = 5,
  COLUMN = 6,
  FUNNEL = 7,
  RADAR = 8,
  TABLE = 9,
}
```

### ViewType

```typescript
enum ViewType {
  GRID = 1,
  KANBAN = 2,
  GALLERY = 3,
  GANTT = 4,
  FORM = 5,
}
```

### AggregationType

```typescript
enum AggregationType {
  COUNT = 'Count',
  COUNT_ALL = 'CountAll',
  SUM = 'Sum',
  AVG = 'Average',
  MAX = 'Max',
  MIN = 'Min',
  EMPTY = 'Empty',
  FILLED = 'Filled',
  UNIQUE = 'Unique',
  PERCENT_EMPTY = 'PercentEmpty',
  PERCENT_FILLED = 'PercentFilled',
}
```

### FilterOperator

```typescript
enum FilterOperator {
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
}
```

## MCP Tools

### create_dashboard

Create a new dashboard.

**Input:**
```json
{
  "app_token": "string",
  "name": "string"
}
```

### create_chart_block

Add a chart block.

**Input:**
```json
{
  "app_token": "string",
  "dashboard_id": "string",
  "chart_type": "bar" | "line" | "pie" | ...,
  "table_id": "string",
  "view_id": "string" (optional),
  "x_axis_field": "string",
  "y_axis_fields": [{
    "field_name": "string",
    "aggregation": "Sum" | "Average" | ...,
    "label": "string" (optional)
  }],
  "title": "string" (optional),
  "show_legend": boolean (optional),
  "colors": string[] (optional)
}
```

### create_metrics_block

Add a metrics block.

**Input:**
```json
{
  "app_token": "string",
  "dashboard_id": "string",
  "table_id": "string",
  "field_name": "string",
  "aggregation": "Sum" | "Count" | ...,
  "title": "string" (optional),
  "prefix": "string" (optional),
  "suffix": "string" (optional),
  "decimals": number (optional)
}
```

### create_view_block

Add a view block.

**Input:**
```json
{
  "app_token": "string",
  "dashboard_id": "string",
  "view_type": "grid" | "kanban" | ...,
  "table_id": "string",
  "view_id": "string" (optional),
  "title": "string" (optional),
  "show_toolbar": boolean (optional)
}
```

### create_text_block

Add a text block.

**Input:**
```json
{
  "app_token": "string",
  "dashboard_id": "string",
  "content": "string",
  "is_heading": boolean (optional),
  "alignment": "left" | "center" | "right" (optional)
}
```

### list_dashboards

List all dashboards.

**Input:**
```json
{
  "app_token": "string"
}
```

### delete_dashboard

Delete a dashboard.

**Input:**
```json
{
  "app_token": "string",
  "dashboard_id": "string"
}
```
