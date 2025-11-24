/**
 * Metrics block builder with fluent API
 */

import {
  MetricsConfig,
  DataSource,
  AggregationType,
  ConditionalFormat,
  FilterOperator,
  BlockType,
  DashboardBlock,
} from '../types';
import { validateMetricsConfig } from '../utils';

/**
 * Builder for creating metrics/KPI blocks
 * Displays aggregated metrics with conditional formatting
 */
export class MetricsBlockBuilder {
  private config: Partial<MetricsConfig> = {};

  /**
   * Set data source
   */
  dataSource(appToken: string, tableId: string, viewId?: string): this {
    this.config.dataSource = {
      appToken,
      tableId,
      viewId,
    };
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
   * Set aggregation function
   */
  aggregation(aggregation: AggregationType): this {
    this.config.aggregation = aggregation;
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
   * Set value prefix (e.g., "$" for currency)
   */
  prefix(prefix: string): this {
    this.config.prefix = prefix;
    return this;
  }

  /**
   * Set value suffix (e.g., "%" for percentage)
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
   * Add conditional formatting rule
   */
  addConditionalFormat(operator: FilterOperator, value: number, color: string, icon?: string): this {
    if (!this.config.conditionalFormats) {
      this.config.conditionalFormats = [];
    }
    this.config.conditionalFormats.push({
      operator,
      value,
      color,
      icon,
    });
    return this;
  }

  /**
   * Enable trend display
   */
  showTrend(fieldName?: string): this {
    this.config.showTrend = true;
    if (fieldName) {
      this.config.trendFieldName = fieldName;
    }
    return this;
  }

  /**
   * Build the metrics block
   */
  build(): DashboardBlock {
    // Validate configuration
    validateMetricsConfig(this.config as MetricsConfig);

    return {
      blockType: BlockType.METRICS,
      config: this.config as MetricsConfig,
    };
  }

  /**
   * Create a count metrics block
   */
  static count(fieldName: string): MetricsBlockBuilder {
    return new MetricsBlockBuilder()
      .field(fieldName)
      .aggregation(AggregationType.COUNT);
  }

  /**
   * Create a sum metrics block
   */
  static sum(fieldName: string): MetricsBlockBuilder {
    return new MetricsBlockBuilder()
      .field(fieldName)
      .aggregation(AggregationType.SUM);
  }

  /**
   * Create an average metrics block
   */
  static average(fieldName: string): MetricsBlockBuilder {
    return new MetricsBlockBuilder()
      .field(fieldName)
      .aggregation(AggregationType.AVG);
  }

  /**
   * Create a max metrics block
   */
  static max(fieldName: string): MetricsBlockBuilder {
    return new MetricsBlockBuilder()
      .field(fieldName)
      .aggregation(AggregationType.MAX);
  }

  /**
   * Create a min metrics block
   */
  static min(fieldName: string): MetricsBlockBuilder {
    return new MetricsBlockBuilder()
      .field(fieldName)
      .aggregation(AggregationType.MIN);
  }
}
