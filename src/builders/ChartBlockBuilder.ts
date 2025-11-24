/**
 * Chart block builder with fluent API
 */

import {
  ChartConfig,
  ChartType,
  DataSource,
  ChartAxis,
  AggregationType,
  FilterCondition,
  FilterConjunction,
  BlockType,
  DashboardBlock,
} from '../types';
import { validateChartConfig } from '../utils';

/**
 * Builder for creating chart blocks
 * Supports 9 chart types: Bar, Line, Pie, Scatter, Area, Column, Funnel, Radar, Table
 */
export class ChartBlockBuilder {
  private config: Partial<ChartConfig> = {};

  /**
   * Set chart type
   */
  type(chartType: ChartType): this {
    this.config.chartType = chartType;
    return this;
  }

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
   * Set X-axis configuration
   */
  xAxis(fieldName: string, aggregation?: AggregationType, label?: string): this {
    this.config.xAxis = {
      fieldName,
      aggregation,
      label,
    };
    return this;
  }

  /**
   * Add Y-axis configuration
   */
  yAxis(fieldName: string, aggregation?: AggregationType, label?: string): this {
    if (!this.config.yAxis) {
      this.config.yAxis = [];
    }
    this.config.yAxis.push({
      fieldName,
      aggregation,
      label,
    });
    return this;
  }

  /**
   * Add multiple Y-axes
   */
  yAxes(axes: ChartAxis[]): this {
    this.config.yAxis = axes;
    return this;
  }

  /**
   * Set series configuration (for grouping)
   */
  series(fieldName: string, aggregation?: AggregationType): this {
    this.config.series = {
      fieldName,
      aggregation,
    };
    return this;
  }

  /**
   * Set group by field
   */
  groupBy(fieldName: string): this {
    this.config.groupBy = fieldName;
    return this;
  }

  /**
   * Add filter condition
   */
  addFilter(fieldName: string, operator: any, value?: any): this {
    if (!this.config.filters) {
      this.config.filters = {
        conjunction: FilterConjunction.AND,
        conditions: [],
      };
    }
    this.config.filters.conditions.push({
      fieldName,
      operator,
      value,
    });
    return this;
  }

  /**
   * Set filter conjunction (AND/OR)
   */
  filterConjunction(conjunction: FilterConjunction): this {
    if (!this.config.filters) {
      this.config.filters = {
        conjunction,
        conditions: [],
      };
    } else {
      this.config.filters.conjunction = conjunction;
    }
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
  legend(show: boolean = true): this {
    this.config.showLegend = show;
    return this;
  }

  /**
   * Show/hide data labels
   */
  dataLabels(show: boolean = true): this {
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
   * Build the chart block
   */
  build(): DashboardBlock {
    // Validate configuration
    validateChartConfig(this.config as ChartConfig);

    return {
      blockType: BlockType.CHART,
      config: this.config as ChartConfig,
    };
  }

  /**
   * Create a bar chart
   */
  static bar(): ChartBlockBuilder {
    return new ChartBlockBuilder().type(ChartType.BAR);
  }

  /**
   * Create a line chart
   */
  static line(): ChartBlockBuilder {
    return new ChartBlockBuilder().type(ChartType.LINE);
  }

  /**
   * Create a pie chart
   */
  static pie(): ChartBlockBuilder {
    return new ChartBlockBuilder().type(ChartType.PIE);
  }

  /**
   * Create a scatter chart
   */
  static scatter(): ChartBlockBuilder {
    return new ChartBlockBuilder().type(ChartType.SCATTER);
  }

  /**
   * Create an area chart
   */
  static area(): ChartBlockBuilder {
    return new ChartBlockBuilder().type(ChartType.AREA);
  }

  /**
   * Create a column chart
   */
  static column(): ChartBlockBuilder {
    return new ChartBlockBuilder().type(ChartType.COLUMN);
  }

  /**
   * Create a funnel chart
   */
  static funnel(): ChartBlockBuilder {
    return new ChartBlockBuilder().type(ChartType.FUNNEL);
  }

  /**
   * Create a radar chart
   */
  static radar(): ChartBlockBuilder {
    return new ChartBlockBuilder().type(ChartType.RADAR);
  }

  /**
   * Create a table chart
   */
  static table(): ChartBlockBuilder {
    return new ChartBlockBuilder().type(ChartType.TABLE);
  }
}
