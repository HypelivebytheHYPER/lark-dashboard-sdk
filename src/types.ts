/**
 * Core type definitions for Lark Dashboard SDK
 * Enhanced with 2025 Dashboard Features
 */

/**
 * Supported Lark regions
 */
export type LarkRegion = 'sg' | 'cn' | 'us';

/**
 * Configuration options for LarkDashboardClient
 */
export interface LarkClientConfig {
  /** API authentication token (tenant access token or user access token) */
  apiKey: string;
  /** API base URL (optional, auto-detected from region if not provided) */
  apiUrl?: string;
  /** Lark region (defaults to 'sg') */
  region?: LarkRegion;
  /** Enable request/response logging */
  logging?: boolean;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Maximum retry attempts */
  maxRetries?: number;
  /** Initial retry delay in milliseconds */
  retryDelay?: number;
}

/**
 * Dashboard block types (Enhanced 2025)
 */
export enum BlockType {
  CHART = 1,
  VIEW = 2,
  METRICS = 3,
  LAYOUT = 4,
  TEXT = 5,
  LIST = 6,      // New 2025: List block type
  TAB_PAGE = 7,  // New 2025: Tab/Page block type
  FILTER = 8,    // New 2025: Filter block type
  CALENDAR = 9,  // New 2025: Calendar view
  TIMELINE = 10, // New 2025: Timeline view
}

/**
 * Chart types supported by Chart blocks (Enhanced 2025)
 */
export enum ChartType {
  BAR = 1,
  LINE = 2,
  PIE = 3,
  SCATTER = 4,
  AREA = 5,
  COLUMN = 6,
  FUNNEL = 7,
  RADAR = 8,
  TABLE = 9,
  HEATMAP = 10,      // New 2025: Heatmap chart
  TREEMAP = 11,      // New 2025: Treemap chart
  WATERFALL = 12,    // New 2025: Waterfall chart
  GAUGE = 13,        // New 2025: Gauge chart
  BUBBLE = 14,       // New 2025: Bubble chart
  SANKEY = 15,       // New 2025: Sankey diagram
  BOXPLOT = 16,      // New 2025: Box plot
  CANDLESTICK = 17,  // New 2025: Candlestick chart
}

/**
 * View types for View blocks
 */
export enum ViewType {
  GRID = 1,
  KANBAN = 2,
  GALLERY = 3,
  GANTT = 4,
  FORM = 5,
  CALENDAR = 6,  // New 2025: Calendar view
  TIMELINE = 7,  // New 2025: Timeline view
}

/**
 * List layout styles (New 2025)
 */
export enum ListLayoutStyle {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  GRID = 'grid',
  COMPACT = 'compact',
  DETAILED = 'detailed',
}

/**
 * Tab/Page layout types (New 2025)
 */
export enum TabPageLayout {
  HORIZONTAL_TABS = 'horizontal_tabs',
  VERTICAL_TABS = 'vertical_tabs',
  PILLS = 'pills',
  SIDEBAR = 'sidebar',
  DROPDOWN = 'dropdown',
}

/**
 * Aggregation functions
 */
export enum AggregationType {
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
  MEDIAN = 'Median',          // New 2025
  STDDEV = 'StdDev',          // New 2025
  VARIANCE = 'Variance',      // New 2025
  RANGE = 'Range',            // New 2025
  FIRST = 'First',            // New 2025
  LAST = 'Last',              // New 2025
}

/**
 * Filter operators (Enhanced 2025)
 */
export enum FilterOperator {
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
  STARTS_WITH = 'startsWith',        // New 2025
  ENDS_WITH = 'endsWith',            // New 2025
  IS_BETWEEN = 'isBetween',          // New 2025
  IS_ANY_OF = 'isAnyOf',             // New 2025
  IS_NONE_OF = 'isNoneOf',           // New 2025
  MATCHES_REGEX = 'matchesRegex',    // New 2025
  IS_WITHIN_DAYS = 'isWithinDays',   // New 2025
  IS_BEFORE_DATE = 'isBeforeDate',   // New 2025
  IS_AFTER_DATE = 'isAfterDate',     // New 2025
}

/**
 * Filter conjunction
 */
export enum FilterConjunction {
  AND = 'and',
  OR = 'or',
}

/**
 * Permission levels (New 2025)
 */
export enum PermissionLevel {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDIT = 'edit',
  VIEW = 'view',
  COMMENT = 'comment',
  NONE = 'none',
}

/**
 * Permission scope (New 2025)
 */
export enum PermissionScope {
  DASHBOARD = 'dashboard',
  BLOCK = 'block',
  DATA_SOURCE = 'data_source',
}

/**
 * Sharing mode (New 2025)
 */
export enum SharingMode {
  PRIVATE = 'private',
  PUBLIC = 'public',
  LINK = 'link',
  TEAM = 'team',
  SPECIFIC_USERS = 'specific_users',
}

/**
 * Text formatting styles
 */
export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;      // New 2025
  lineHeight?: number;      // New 2025
  letterSpacing?: number;   // New 2025
}

/**
 * Filter condition (Enhanced 2025)
 */
export interface FilterCondition {
  fieldName: string;
  operator: FilterOperator;
  value?: any;
  secondValue?: any;        // New 2025: For BETWEEN operations
  values?: any[];           // New 2025: For IS_ANY_OF, IS_NONE_OF
  caseSensitive?: boolean;  // New 2025
}

/**
 * Data source configuration for charts
 */
export interface DataSource {
  appToken: string;
  tableId: string;
  viewId?: string;
  refreshInterval?: number;  // New 2025: Auto-refresh in seconds
  cacheEnabled?: boolean;    // New 2025: Enable data caching
}

/**
 * Chart axis configuration (Enhanced 2025)
 */
export interface ChartAxis {
  fieldName: string;
  aggregation?: AggregationType;
  label?: string;
  format?: string;           // New 2025: Number/date format
  showGrid?: boolean;        // New 2025
  axisPosition?: 'left' | 'right' | 'top' | 'bottom';  // New 2025
  scale?: 'linear' | 'log' | 'time';  // New 2025
  min?: number;              // New 2025
  max?: number;              // New 2025
}

/**
 * Chart animation config (New 2025)
 */
export interface ChartAnimation {
  enabled: boolean;
  duration?: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  delay?: number;
}

/**
 * Chart tooltip config (New 2025)
 */
export interface ChartTooltip {
  enabled: boolean;
  format?: string;
  shared?: boolean;
  position?: 'auto' | 'fixed';
}

/**
 * Chart configuration (Enhanced 2025)
 */
export interface ChartConfig {
  chartType: ChartType;
  dataSource: DataSource;
  xAxis?: ChartAxis;
  yAxis?: ChartAxis[];
  series?: ChartAxis;
  groupBy?: string;
  filters?: {
    conjunction: FilterConjunction;
    conditions: FilterCondition[];
  };
  title?: string;
  showLegend?: boolean;
  showDataLabels?: boolean;
  colors?: string[];
  animation?: ChartAnimation;        // New 2025
  tooltip?: ChartTooltip;            // New 2025
  responsive?: boolean;              // New 2025
  theme?: 'light' | 'dark' | 'auto'; // New 2025
  exportEnabled?: boolean;           // New 2025
  zoomEnabled?: boolean;             // New 2025
  panEnabled?: boolean;              // New 2025
  crosshair?: boolean;               // New 2025
}

/**
 * View configuration
 */
export interface ViewConfig {
  viewType: ViewType;
  dataSource: DataSource;
  title?: string;
  showToolbar?: boolean;
  height?: number;
  pageSize?: number;         // New 2025
  enableSearch?: boolean;    // New 2025
  enableFilters?: boolean;   // New 2025
  enableSort?: boolean;      // New 2025
}

/**
 * Conditional formatting rule
 */
export interface ConditionalFormat {
  operator: FilterOperator;
  value: number;
  color: string;
  icon?: string;
  backgroundColor?: string;  // New 2025
  textStyle?: TextStyle;     // New 2025
}

/**
 * Metrics configuration (Enhanced 2025)
 */
export interface MetricsConfig {
  dataSource: DataSource;
  fieldName: string;
  aggregation: AggregationType;
  title?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  conditionalFormats?: ConditionalFormat[];
  showTrend?: boolean;
  trendFieldName?: string;
  comparisonEnabled?: boolean;     // New 2025
  comparisonPeriod?: 'day' | 'week' | 'month' | 'year';  // New 2025
  sparklineEnabled?: boolean;      // New 2025
  target?: number;                 // New 2025
  targetLabel?: string;            // New 2025
}

/**
 * List item template (New 2025)
 */
export interface ListItemTemplate {
  titleField: string;
  subtitleField?: string;
  descriptionField?: string;
  imageField?: string;
  iconField?: string;
  badgeField?: string;
  metaFields?: string[];
  actionButtons?: ListActionButton[];
}

/**
 * List action button (New 2025)
 */
export interface ListActionButton {
  label: string;
  action: 'link' | 'edit' | 'delete' | 'custom';
  url?: string;
  icon?: string;
  color?: string;
}

/**
 * List sorting config (New 2025)
 */
export interface ListSorting {
  field: string;
  direction: 'asc' | 'desc';
  priority?: number;
}

/**
 * List configuration (New 2025)
 */
export interface ListConfig {
  dataSource: DataSource;
  layoutStyle: ListLayoutStyle;
  itemTemplate: ListItemTemplate;
  title?: string;
  sorting?: ListSorting[];
  filters?: {
    conjunction: FilterConjunction;
    conditions: FilterCondition[];
  };
  pagination?: {
    enabled: boolean;
    pageSize: number;
  };
  groupBy?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  clickable?: boolean;
  onClickAction?: 'detail' | 'edit' | 'custom';
}

/**
 * Tab/Page item (New 2025)
 */
export interface TabPageItem {
  id: string;
  label: string;
  icon?: string;
  blockIds: string[];
  badge?: string | number;
  disabled?: boolean;
}

/**
 * Tab/Page configuration (New 2025)
 */
export interface TabPageConfig {
  layout: TabPageLayout;
  tabs: TabPageItem[];
  defaultTab?: string;
  title?: string;
  showTabCount?: boolean;
  animateTransition?: boolean;
  allowReorder?: boolean;
  allowClose?: boolean;
  maxTabs?: number;
}

/**
 * Layout column configuration (Enhanced 2025)
 */
export interface LayoutColumn {
  width: number; // 1-12 (grid system)
  blockIds: string[];
  minWidth?: number;         // New 2025: Minimum width in pixels
  maxWidth?: number;         // New 2025: Maximum width in pixels
  collapsible?: boolean;     // New 2025
  collapsed?: boolean;       // New 2025
}

/**
 * Layout configuration (Enhanced 2025)
 */
export interface LayoutConfig {
  columns: LayoutColumn[];
  gap?: number;
  padding?: number;
  responsive?: boolean;      // New 2025: Enable responsive breakpoints
  breakpoints?: {            // New 2025
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  backgroundColor?: string;  // New 2025
  borderRadius?: number;     // New 2025
}

/**
 * Text content element
 */
export interface TextElement {
  content: string;
  style?: TextStyle;
  link?: string;
}

/**
 * Text configuration
 */
export interface TextConfig {
  elements: TextElement[];
  alignment?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  padding?: number;
}

/**
 * Permission entity (New 2025)
 */
export interface PermissionEntity {
  type: 'user' | 'team' | 'department';
  id: string;
  level: PermissionLevel;
}

/**
 * Dashboard permission config (New 2025)
 */
export interface DashboardPermission {
  scope: PermissionScope;
  sharingMode: SharingMode;
  entities?: PermissionEntity[];
  allowComments?: boolean;
  allowExport?: boolean;
  allowShare?: boolean;
  publicLinkEnabled?: boolean;
  publicLinkPassword?: string;
  expiresAt?: Date;
}

/**
 * Block permission config (New 2025)
 */
export interface BlockPermission {
  blockId: string;
  entities: PermissionEntity[];
  inheritFromDashboard?: boolean;
}

/**
 * Block configuration (union type - Enhanced 2025)
 */
export type BlockConfig =
  | ChartConfig
  | ViewConfig
  | MetricsConfig
  | LayoutConfig
  | TextConfig
  | ListConfig          // New 2025
  | TabPageConfig;      // New 2025

/**
 * Dashboard block definition (Enhanced 2025)
 */
export interface DashboardBlock {
  blockId?: string;
  blockType: BlockType;
  config: BlockConfig;
  position?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  zIndex?: number;           // New 2025
  visible?: boolean;         // New 2025
  locked?: boolean;          // New 2025
  permission?: BlockPermission;  // New 2025
}

/**
 * Dashboard theme (New 2025)
 */
export interface DashboardTheme {
  name: string;
  colorPrimary?: string;
  colorSecondary?: string;
  colorBackground?: string;
  colorText?: string;
  colorBorder?: string;
  fontFamily?: string;
  borderRadius?: number;
}

/**
 * Dashboard settings (New 2025)
 */
export interface DashboardSettings {
  autoRefresh?: boolean;
  refreshInterval?: number;
  theme?: DashboardTheme;
  fullscreenEnabled?: boolean;
  exportEnabled?: boolean;
  printEnabled?: boolean;
  timezone?: string;
  locale?: string;
}

/**
 * Dashboard definition (Enhanced 2025)
 */
export interface Dashboard {
  name: string;
  appToken: string;
  blocks?: DashboardBlock[];
  description?: string;        // New 2025
  tags?: string[];             // New 2025
  permission?: DashboardPermission;  // New 2025
  settings?: DashboardSettings;      // New 2025
  version?: string;            // New 2025
  createdAt?: Date;            // New 2025
  updatedAt?: Date;            // New 2025
  createdBy?: string;          // New 2025
}

/**
 * API response wrapper
 */
export interface LarkApiResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

/**
 * Dashboard response
 */
export interface DashboardResponse {
  block_id: string;
  block_type: number;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult {
  success: boolean;
  blockId?: string;
  error?: string;
}

/**
 * Color palette (Enhanced 2025)
 */
export interface ColorPalette {
  primary: string[];
  success: string[];
  warning: string[];
  danger: string[];
  info: string[];
  neutral: string[];
  accent: string[];      // New 2025
  gradient: string[];    // New 2025
}

/**
 * Field mapping (name to ID)
 */
export interface FieldMapping {
  [fieldName: string]: string;
}

/**
 * Table metadata
 */
export interface TableMetadata {
  tableId: string;
  tableName: string;
  fields: FieldMapping;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatuses: number[];
}

/**
 * Request context for logging
 */
export interface RequestContext {
  method: string;
  url: string;
  timestamp: string;
  duration?: number;
  status?: number;
  error?: any;
}

/**
 * Dashboard analytics data (New 2025)
 */
export interface DashboardAnalytics {
  views: number;
  uniqueVisitors: number;
  avgTimeSpent: number;
  popularBlocks: string[];
  lastAccessed: Date;
}

/**
 * Export options (New 2025)
 */
export interface ExportOptions {
  format: 'pdf' | 'png' | 'svg' | 'excel' | 'json';
  includeData?: boolean;
  pageSize?: 'A4' | 'letter' | 'custom';
  orientation?: 'portrait' | 'landscape';
  quality?: 'low' | 'medium' | 'high';
}
