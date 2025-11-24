/**
 * Configuration validation utilities
 */

import {
  LarkClientConfig,
  ChartConfig,
  ViewConfig,
  MetricsConfig,
  LayoutConfig,
  TextConfig,
  BlockType,
  ChartType,
  ViewType,
  AggregationType,
} from '../types';

/**
 * Validation error
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate client configuration
 */
export function validateClientConfig(config: LarkClientConfig): void {
  if (!config.apiKey || config.apiKey.trim().length === 0) {
    throw new ValidationError('API key is required');
  }

  if (config.timeout && config.timeout < 0) {
    throw new ValidationError('Timeout must be a positive number');
  }

  if (config.maxRetries && config.maxRetries < 0) {
    throw new ValidationError('Max retries must be a non-negative number');
  }

  if (config.retryDelay && config.retryDelay < 0) {
    throw new ValidationError('Retry delay must be a positive number');
  }

  if (config.region && !['sg', 'cn', 'us'].includes(config.region)) {
    throw new ValidationError('Region must be one of: sg, cn, us');
  }
}

/**
 * Validate chart configuration
 */
export function validateChartConfig(config: ChartConfig): void {
  if (!config.chartType || !Object.values(ChartType).includes(config.chartType)) {
    throw new ValidationError('Invalid chart type');
  }

  if (!config.dataSource) {
    throw new ValidationError('Data source is required for chart blocks');
  }

  if (!config.dataSource.appToken || !config.dataSource.tableId) {
    throw new ValidationError('Data source must include appToken and tableId');
  }

  // Validate axes based on chart type
  if (config.chartType !== ChartType.PIE && !config.xAxis) {
    throw new ValidationError('X-axis is required for this chart type');
  }

  if (config.chartType !== ChartType.PIE && (!config.yAxis || config.yAxis.length === 0)) {
    throw new ValidationError('At least one Y-axis is required for this chart type');
  }

  // Validate aggregation types
  if (config.yAxis) {
    for (const axis of config.yAxis) {
      if (axis.aggregation && !Object.values(AggregationType).includes(axis.aggregation)) {
        throw new ValidationError(`Invalid aggregation type: ${axis.aggregation}`);
      }
    }
  }

  // Validate colors
  if (config.colors) {
    for (const color of config.colors) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
        throw new ValidationError(`Invalid color format: ${color}. Use hex format (#RRGGBB)`);
      }
    }
  }
}

/**
 * Validate view configuration
 */
export function validateViewConfig(config: ViewConfig): void {
  if (!config.viewType || !Object.values(ViewType).includes(config.viewType)) {
    throw new ValidationError('Invalid view type');
  }

  if (!config.dataSource) {
    throw new ValidationError('Data source is required for view blocks');
  }

  if (!config.dataSource.appToken || !config.dataSource.tableId) {
    throw new ValidationError('Data source must include appToken and tableId');
  }

  if (config.height && config.height < 100) {
    throw new ValidationError('View height must be at least 100 pixels');
  }
}

/**
 * Validate metrics configuration
 */
export function validateMetricsConfig(config: MetricsConfig): void {
  if (!config.dataSource) {
    throw new ValidationError('Data source is required for metrics blocks');
  }

  if (!config.dataSource.appToken || !config.dataSource.tableId) {
    throw new ValidationError('Data source must include appToken and tableId');
  }

  if (!config.fieldName) {
    throw new ValidationError('Field name is required for metrics blocks');
  }

  if (!config.aggregation || !Object.values(AggregationType).includes(config.aggregation)) {
    throw new ValidationError('Valid aggregation type is required for metrics blocks');
  }

  if (config.decimals !== undefined && (config.decimals < 0 || config.decimals > 10)) {
    throw new ValidationError('Decimals must be between 0 and 10');
  }

  // Validate conditional formats
  if (config.conditionalFormats) {
    for (const format of config.conditionalFormats) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(format.color)) {
        throw new ValidationError(`Invalid color format: ${format.color}. Use hex format (#RRGGBB)`);
      }
    }
  }
}

/**
 * Validate layout configuration
 */
export function validateLayoutConfig(config: LayoutConfig): void {
  if (!config.columns || config.columns.length === 0) {
    throw new ValidationError('Layout must have at least one column');
  }

  let totalWidth = 0;
  for (const column of config.columns) {
    if (column.width < 1 || column.width > 12) {
      throw new ValidationError('Column width must be between 1 and 12');
    }
    totalWidth += column.width;
  }

  if (totalWidth > 12) {
    throw new ValidationError('Total column width cannot exceed 12');
  }

  if (config.gap !== undefined && config.gap < 0) {
    throw new ValidationError('Gap must be a non-negative number');
  }

  if (config.padding !== undefined && config.padding < 0) {
    throw new ValidationError('Padding must be a non-negative number');
  }
}

/**
 * Validate text configuration
 */
export function validateTextConfig(config: TextConfig): void {
  if (!config.elements || config.elements.length === 0) {
    throw new ValidationError('Text block must have at least one element');
  }

  for (const element of config.elements) {
    if (!element.content) {
      throw new ValidationError('Text element must have content');
    }

    if (element.style?.color && !/^#[0-9A-Fa-f]{6}$/.test(element.style.color)) {
      throw new ValidationError(`Invalid color format: ${element.style.color}`);
    }

    if (element.style?.backgroundColor && !/^#[0-9A-Fa-f]{6}$/.test(element.style.backgroundColor)) {
      throw new ValidationError(`Invalid background color format: ${element.style.backgroundColor}`);
    }
  }

  if (config.alignment && !['left', 'center', 'right'].includes(config.alignment)) {
    throw new ValidationError('Alignment must be one of: left, center, right');
  }
}

/**
 * Validate block configuration based on type
 */
export function validateBlockConfig(blockType: BlockType, config: any): void {
  switch (blockType) {
    case BlockType.CHART:
      validateChartConfig(config as ChartConfig);
      break;
    case BlockType.VIEW:
      validateViewConfig(config as ViewConfig);
      break;
    case BlockType.METRICS:
      validateMetricsConfig(config as MetricsConfig);
      break;
    case BlockType.LAYOUT:
      validateLayoutConfig(config as LayoutConfig);
      break;
    case BlockType.TEXT:
      validateTextConfig(config as TextConfig);
      break;
    default:
      throw new ValidationError(`Unknown block type: ${blockType}`);
  }
}

/**
 * Validate field name format
 */
export function validateFieldName(fieldName: string): void {
  if (!fieldName || fieldName.trim().length === 0) {
    throw new ValidationError('Field name cannot be empty');
  }
}

/**
 * Validate app token format
 */
export function validateAppToken(appToken: string): void {
  if (!appToken || appToken.trim().length === 0) {
    throw new ValidationError('App token cannot be empty');
  }
}

/**
 * Validate table ID format
 */
export function validateTableId(tableId: string): void {
  if (!tableId || tableId.trim().length === 0) {
    throw new ValidationError('Table ID cannot be empty');
  }
}

/**
 * Validate dashboard configuration
 */
export function validateDashboard(dashboard: any): void {
  if (!dashboard || typeof dashboard !== 'object') {
    throw new ValidationError('Invalid dashboard configuration');
  }

  if (!dashboard.name || typeof dashboard.name !== 'string' || dashboard.name.trim().length === 0) {
    throw new ValidationError('Dashboard name is required');
  }

  if (!dashboard.appToken || typeof dashboard.appToken !== 'string' || dashboard.appToken.trim().length === 0) {
    throw new ValidationError('App token is required');
  }
}

/**
 * Validate block configuration
 */
export function validateBlock(block: any): void {
  if (!block || typeof block !== 'object') {
    throw new ValidationError('Invalid block configuration');
  }

  if (!block.type || !Object.values(BlockType).includes(block.type)) {
    throw new ValidationError('Invalid or missing block type');
  }

  if (!block.config || typeof block.config !== 'object') {
    throw new ValidationError('Block configuration is required');
  }

  // Validate block config based on type
  validateBlockConfig(block.type, block.config);
}
