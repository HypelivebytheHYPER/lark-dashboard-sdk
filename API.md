# API Reference

Complete API reference for Lark Dashboard SDK.

## Table of Contents

- [LarkDashboardClient](#larkdashboardclient)
- [Block Builders](#block-builders)
- [Types](#types)
- [Utilities](#utilities)

## LarkDashboardClient

Main client class for interacting with Lark Dashboard API.

### Constructor

```typescript
new LarkDashboardClient(config: LarkClientConfig)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| config.apiKey | string | Yes | API authentication token |
| config.region | 'sg' \| 'cn' \| 'us' | No | Lark region (default: 'sg') |
| config.apiUrl | string | No | Custom API base URL |
| config.logging | boolean | No | Enable logging (default: false) |
| config.timeout | number | No | Request timeout in ms (default: 30000) |
| config.maxRetries | number | No | Max retry attempts (default: 3) |
| config.retryDelay | number | No | Initial retry delay in ms (default: 1000) |

**Example:**

```typescript
const client = new LarkDashboardClient({
  apiKey: 'your-api-key',
  region: 'sg',
  logging: true,
  timeout: 60000,
  maxRetries: 5,
});
```

### Instance Methods

#### createBlock

Create a dashboard block.

```typescript
async createBlock(
  appToken: string,
  block: DashboardBlock
): Promise<DashboardResponse>
```

**Returns:** `{ block_id: string, block_type: number }`

#### updateBlock

Update an existing block.

```typescript
async updateBlock(
  appToken: string,
  blockId: string,
  block: Partial<DashboardBlock>
): Promise<DashboardResponse>
```

#### deleteBlock

Delete a block.

```typescript
async deleteBlock(appToken: string, blockId: string): Promise<void>
```

#### getBlock

Get block information.

```typescript
async getBlock(appToken: string, blockId: string): Promise<any>
```

#### listBlocks

List all blocks.

```typescript
async listBlocks(appToken: string): Promise<any[]>
```

#### batchCreateBlocks

Create multiple blocks.

```typescript
async batchCreateBlocks(
  appToken: string,
  blocks: DashboardBlock[]
): Promise<BatchOperationResult[]>
```

**Returns:** Array of `{ success: boolean, blockId?: string, error?: string }`

#### batchDeleteBlocks

Delete multiple blocks.

```typescript
async batchDeleteBlocks(
  appToken: string,
  blockIds: string[]
): Promise<BatchOperationResult[]>
```

#### createDashboard

Create complete dashboard.

```typescript
async createDashboard(dashboard: Dashboard): Promise<BatchOperationResult[]>
```

### Static Properties

Access builder classes:

```typescript
LarkDashboardClient.Chart      // ChartBlockBuilder
LarkDashboardClient.View       // ViewBlockBuilder
LarkDashboardClient.Metrics    // MetricsBlockBuilder
LarkDashboardClient.Layout     // LayoutBlockBuilder
LarkDashboardClient.Text       // TextBlockBuilder
```

## Block Builders

### ChartBlockBuilder

Build chart blocks with fluent API.

#### Static Factory Methods

```typescript
ChartBlockBuilder.bar()        // Bar chart
ChartBlockBuilder.line()       // Line chart
ChartBlockBuilder.pie()        // Pie chart
ChartBlockBuilder.scatter()    // Scatter chart
ChartBlockBuilder.area()       // Area chart
ChartBlockBuilder.column()     // Column chart
ChartBlockBuilder.funnel()     // Funnel chart
ChartBlockBuilder.radar()      // Radar chart
ChartBlockBuilder.table()      // Table chart
```

#### Instance Methods

##### type(chartType: ChartType)

Set chart type.

##### dataSource(appToken: string, tableId: string, viewId?: string)

Set data source.

##### xAxis(fieldName: string, aggregation?: AggregationType, label?: string)

Configure X-axis.

##### yAxis(fieldName: string, aggregation?: AggregationType, label?: string)

Add Y-axis. Can be called multiple times for multi-axis charts.

##### yAxes(axes: ChartAxis[])

Set all Y-axes at once.

##### series(fieldName: string, aggregation?: AggregationType)

Set series for grouping.

##### groupBy(fieldName: string)

Set group by field.

##### addFilter(fieldName: string, operator: FilterOperator, value?: any)

Add filter condition.

##### filterConjunction(conjunction: FilterConjunction)

Set filter conjunction (AND/OR).

##### title(title: string)

Set chart title.

##### legend(show: boolean = true)

Show/hide legend.

##### dataLabels(show: boolean = true)

Show/hide data labels.

##### colors(colors: string[])

Set custom colors.

##### build(): DashboardBlock

Build the block.

**Example:**

```typescript
const chart = ChartBlockBuilder.bar()
  .dataSource('appToken', 'tableId')
  .xAxis('Category')
  .yAxis('Sales', AggregationType.SUM, 'Total Sales')
  .yAxis('Orders', AggregationType.COUNT, 'Order Count')
  .addFilter('Status', FilterOperator.IS, 'Active')
  .title('Sales Performance')
  .legend(true)
  .colors(['#3b82f6', '#10b981'])
  .build();
```

### ViewBlockBuilder

Build view blocks.

#### Static Factory Methods

```typescript
ViewBlockBuilder.grid()       // Grid view
ViewBlockBuilder.kanban()     // Kanban view
ViewBlockBuilder.gallery()    // Gallery view
ViewBlockBuilder.gantt()      // Gantt view
ViewBlockBuilder.form()       // Form view
```

#### Instance Methods

##### type(viewType: ViewType)

Set view type.

##### dataSource(appToken: string, tableId: string, viewId?: string)

Set data source.

##### title(title: string)

Set view title.

##### toolbar(show: boolean = true)

Show/hide toolbar.

##### height(height: number)

Set view height in pixels.

##### build(): DashboardBlock

Build the block.

### MetricsBlockBuilder

Build metrics/KPI blocks.

#### Static Factory Methods

```typescript
MetricsBlockBuilder.count(fieldName: string)
MetricsBlockBuilder.sum(fieldName: string)
MetricsBlockBuilder.average(fieldName: string)
MetricsBlockBuilder.max(fieldName: string)
MetricsBlockBuilder.min(fieldName: string)
```

#### Instance Methods

##### dataSource(appToken: string, tableId: string, viewId?: string)

Set data source.

##### field(fieldName: string)

Set field to aggregate.

##### aggregation(aggregation: AggregationType)

Set aggregation function.

##### title(title: string)

Set metrics title.

##### prefix(prefix: string)

Set value prefix (e.g., "$").

##### suffix(suffix: string)

Set value suffix (e.g., "%").

##### decimals(decimals: number)

Set decimal places.

##### addConditionalFormat(operator: FilterOperator, value: number, color: string, icon?: string)

Add conditional formatting rule.

##### showTrend(fieldName?: string)

Enable trend display.

##### build(): DashboardBlock

Build the block.

### LayoutBlockBuilder

Build layout blocks.

#### Static Factory Methods

```typescript
LayoutBlockBuilder.twoColumn()      // 6-6 split
LayoutBlockBuilder.threeColumn()    // 4-4-4 split
LayoutBlockBuilder.sidebar()        // 3-9 split
LayoutBlockBuilder.mainAside()      // 8-4 split
LayoutBlockBuilder.fullWidth()      // 12 width
```

#### Instance Methods

##### addColumn(width: number, blockIds: string[] = [])

Add column (width: 1-12).

##### columns(columns: LayoutColumn[])

Set all columns.

##### gap(gap: number)

Set gap between columns.

##### padding(padding: number)

Set padding around layout.

##### build(): DashboardBlock

Build the block.

### TextBlockBuilder

Build text blocks.

#### Static Factory Methods

```typescript
TextBlockBuilder.heading(content: string, fontSize?: number)
TextBlockBuilder.paragraph(content: string)
TextBlockBuilder.link(content: string, url: string)
```

#### Instance Methods

##### addText(content: string, style?: TextStyle, link?: string)

Add text element.

##### addBold(content: string)

Add bold text.

##### addItalic(content: string)

Add italic text.

##### addUnderline(content: string)

Add underlined text.

##### addCode(content: string)

Add code text.

##### addLink(content: string, url: string)

Add link.

##### addColored(content: string, color: string)

Add colored text.

##### addHeading(content: string, fontSize?: number)

Add heading.

##### addLineBreak()

Add line break.

##### alignment(alignment: 'left' | 'center' | 'right')

Set text alignment.

##### backgroundColor(color: string)

Set background color.

##### padding(padding: number)

Set padding.

##### build(): DashboardBlock

Build the block.

## Types

### Enums

#### BlockType

```typescript
enum BlockType {
  CHART = 1,
  VIEW = 2,
  METRICS = 3,
  LAYOUT = 4,
  TEXT = 5,
}
```

#### ChartType

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

#### ViewType

```typescript
enum ViewType {
  GRID = 1,
  KANBAN = 2,
  GALLERY = 3,
  GANTT = 4,
  FORM = 5,
}
```

#### AggregationType

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

#### FilterOperator

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

### Interfaces

#### DataSource

```typescript
interface DataSource {
  appToken: string;
  tableId: string;
  viewId?: string;
}
```

#### ChartAxis

```typescript
interface ChartAxis {
  fieldName: string;
  aggregation?: AggregationType;
  label?: string;
}
```

#### FilterCondition

```typescript
interface FilterCondition {
  fieldName: string;
  operator: FilterOperator;
  value?: any;
}
```

## Utilities

### Color Utilities

#### DEFAULT_COLORS

Pre-defined color palettes.

```typescript
DEFAULT_COLORS.primary    // Blue tones
DEFAULT_COLORS.success    // Green tones
DEFAULT_COLORS.warning    // Amber/yellow tones
DEFAULT_COLORS.danger     // Red tones
DEFAULT_COLORS.info       // Blue/cyan tones
DEFAULT_COLORS.neutral    // Gray tones
```

#### generateChartColors

```typescript
function generateChartColors(count: number, palette?: string[]): string[]
```

Generate color array for charts.

#### lightenColor / darkenColor

```typescript
function lightenColor(hex: string, percent: number): string
function darkenColor(hex: string, percent: number): string
```

Adjust color brightness.

### Validation

#### ValidationError

```typescript
class ValidationError extends Error
```

Thrown when configuration is invalid.

#### Validation Functions

```typescript
function validateChartConfig(config: ChartConfig): void
function validateViewConfig(config: ViewConfig): void
function validateMetricsConfig(config: MetricsConfig): void
function validateLayoutConfig(config: LayoutConfig): void
function validateTextConfig(config: TextConfig): void
```

### Helper Functions

#### getApiUrlForRegion

```typescript
function getApiUrlForRegion(region: LarkRegion): string
```

Get API URL for region.

#### formatErrorMessage

```typescript
function formatErrorMessage(error: any): string
```

Extract error message from error object.

#### FieldMapper

Field name to ID mapping utility.

```typescript
class FieldMapper {
  add(fieldName: string, fieldId: string): void
  getFieldId(fieldName: string): string | undefined
  getFieldName(fieldId: string): string | undefined
  hasField(fieldName: string): boolean
  getAll(): FieldMapping
  clear(): void
}
```
