/**
 * Chart Block Builder
 * Fluent API for creating chart blocks
 */

import {
  DashboardBlock,
  BlockType,
  ChartType,
  ChartConfig,
  ChartAxis,
  DataSource,
  AggregationType,
  FilterCondition,
  FilterConjunction,
} from '../types';

export class ChartBlockBuilder {
  private config: Partial<ChartConfig> = {};
  private blockPosition?: { x: number; y: number };
  private blockSize?: { width: number; height: number };

  /**
   * Set chart type
   */
  chartType(type: ChartType): this {
    this.config.chartType = type;
    return this;
  }

  /**
   * Set data source
   */
  dataSource(appToken: string, tableId: string, viewId?: string): this {
    this.config.dataSource = { appToken, tableId, viewId };
    return this;
  }

  /**
   * Set X axis
   */
  xAxis(fieldName: string, aggregation?: AggregationType, label?: string): this {
    this.config.xAxis = { fieldName, aggregation, label };
    return this;
  }

  /**
   * Set Y axis (supports multiple axes)
   */
  yAxis(axes: ChartAxis | ChartAxis[]): this {
    this.config.yAxis = Array.isArray(axes) ? axes : [axes];
    return this;
  }

  /**
   * Set series configuration
   */
  series(fieldName: string, aggregation?: AggregationType, label?: string): this {
    this.config.series = { fieldName, aggregation, label };
    return this;
  }

  /**
   * Group data by field
   */
  groupBy(fieldName: string): this {
    this.config.groupBy = fieldName;
    return this;
  }

  /**
   * Add filters
   */
  filters(conjunction: FilterConjunction, conditions: FilterCondition[]): this {
    this.config.filters = { conjunction, conditions };
    return this;
  }

  /**
   * Set chart title
   */
  title(title: string): this {
    this.config.title = title;
    return this;
  }

  /**
   * Show/hide legend
   */
  showLegend(show: boolean): this {
    this.config.showLegend = show;
    return this;
  }

  /**
   * Show/hide data labels
   */
  showDataLabels(show: boolean): this {
    this.config.showDataLabels = show;
    return this;
  }

  /**
   * Set custom colors
   */
  colors(colors: string[]): this {
    this.config.colors = colors;
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
   * Build the chart block
   */
  build(): DashboardBlock {
    if (!this.config.chartType) {
      throw new Error('Chart type is required');
    }
    if (!this.config.dataSource) {
      throw new Error('Data source is required');
    }

    return {
      blockType: BlockType.CHART,
      config: this.config as ChartConfig,
      position: this.blockPosition,
      size: this.blockSize,
    };
  }

  /**
   * Create a bar chart builder
   */
  static bar(): ChartBlockBuilder {
    return new ChartBlockBuilder().chartType(ChartType.BAR);
  }

  /**
   * Create a line chart builder
   */
  static line(): ChartBlockBuilder {
    return new ChartBlockBuilder().chartType(ChartType.LINE);
  }

  /**
   * Create a pie chart builder
   */
  static pie(): ChartBlockBuilder {
    return new ChartBlockBuilder().chartType(ChartType.PIE);
  }

  /**
   * Create a scatter chart builder
   */
  static scatter(): ChartBlockBuilder {
    return new ChartBlockBuilder().chartType(ChartType.SCATTER);
  }

  /**
   * Create an area chart builder
   */
  static area(): ChartBlockBuilder {
    return new ChartBlockBuilder().chartType(ChartType.AREA);
  }

  /**
   * Create a column chart builder
   */
  static column(): ChartBlockBuilder {
    return new ChartBlockBuilder().chartType(ChartType.COLUMN);
  }

  /**
   * Create a funnel chart builder
   */
  static funnel(): ChartBlockBuilder {
    return new ChartBlockBuilder().chartType(ChartType.FUNNEL);
  }

  /**
   * Create a radar chart builder
   */
  static radar(): ChartBlockBuilder {
    return new ChartBlockBuilder().chartType(ChartType.RADAR);
  }

  /**
   * Create a table chart builder
   */
  static table(): ChartBlockBuilder {
    return new ChartBlockBuilder().chartType(ChartType.TABLE);
  }
}
