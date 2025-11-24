/**
 * Metrics Block Builder
 * Fluent API for creating metrics/KPI blocks
 */

import {
  DashboardBlock,
  BlockType,
  MetricsConfig,
  DataSource,
  AggregationType,
  ConditionalFormat,
} from '../types';

export class MetricsBlockBuilder {
  private config: Partial<MetricsConfig> = {};
  private blockPosition?: { x: number; y: number };
  private blockSize?: { width: number; height: number };

  /**
   * Set data source
   */
  dataSource(appToken: string, tableId: string, viewId?: string): this {
    this.config.dataSource = { appToken, tableId, viewId };
    return this;
  }

  /**
   * Set field to aggregate
   */
  field(fieldName: string): this {
    this.config.fieldName = fieldName;
    return this;
  }

  /**
   * Set aggregation type
   */
  aggregation(type: AggregationType): this {
    this.config.aggregation = type;
    return this;
  }

  /**
   * Set metrics title
   */
  title(title: string): this {
    this.config.title = title;
    return this;
  }

  /**
   * Set prefix (e.g., "$", "€")
   */
  prefix(prefix: string): this {
    this.config.prefix = prefix;
    return this;
  }

  /**
   * Set suffix (e.g., "%", "units")
   */
  suffix(suffix: string): this {
    this.config.suffix = suffix;
    return this;
  }

  /**
   * Set decimal places
   */
  decimals(decimals: number): this {
    this.config.decimals = decimals;
    return this;
  }

  /**
   * Add conditional formatting
   */
  conditionalFormat(format: ConditionalFormat): this {
    if (!this.config.conditionalFormats) {
      this.config.conditionalFormats = [];
    }
    this.config.conditionalFormats.push(format);
    return this;
  }

  /**
   * Show trend indicator
   */
  showTrend(show: boolean, trendFieldName?: string): this {
    this.config.showTrend = show;
    if (trendFieldName) {
      this.config.trendFieldName = trendFieldName;
    }
    return this;
  }

  /**
   * Set block position
   */
  position(x: number, y: number): this {
    this.blockPosition = { x, y };
    return this;
  }

  /**
   * Set block size
   */
  size(width: number, height: number): this {
    this.blockSize = { width, height };
    return this;
  }

  /**
   * Build the metrics block
   */
  build(): DashboardBlock {
    if (!this.config.dataSource) {
      throw new Error('Data source is required');
    }
    if (!this.config.fieldName) {
      throw new Error('Field name is required');
    }
    if (!this.config.aggregation) {
      throw new Error('Aggregation type is required');
    }

    return {
      blockType: BlockType.METRICS,
      config: this.config as MetricsConfig,
      position: this.blockPosition,
      size: this.blockSize,
    };
  }
}
