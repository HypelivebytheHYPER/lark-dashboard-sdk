/**
 * Dashboard API methods
 */

import { HttpClient } from './http-client';
import { DashboardBlock, DashboardResponse, LarkApiResponse } from '../types';

/**
 * Dashboard API client
 */
export class DashboardApi {
  constructor(private http: HttpClient) {}

  /**
   * Create a dashboard block
   */
  async createBlock(
    appToken: string,
    block: DashboardBlock
  ): Promise<DashboardResponse> {
    const payload = this.convertBlockToApiFormat(block);

    const response = await this.http.post<DashboardResponse>(
      `/bitable/v1/apps/${appToken}/dashboard/blocks`,
      payload
    );

    return response.data!;
  }

  /**
   * Update a dashboard block
   */
  async updateBlock(
    appToken: string,
    blockId: string,
    block: Partial<DashboardBlock>
  ): Promise<DashboardResponse> {
    const payload = this.convertBlockToApiFormat(block as DashboardBlock);

    const response = await this.http.put<DashboardResponse>(
      `/bitable/v1/apps/${appToken}/dashboard/blocks/${blockId}`,
      payload
    );

    return response.data!;
  }

  /**
   * Delete a dashboard block
   */
  async deleteBlock(appToken: string, blockId: string): Promise<void> {
    await this.http.delete(`/bitable/v1/apps/${appToken}/dashboard/blocks/${blockId}`);
  }

  /**
   * Get dashboard block
   */
  async getBlock(appToken: string, blockId: string): Promise<any> {
    const response = await this.http.get(
      `/bitable/v1/apps/${appToken}/dashboard/blocks/${blockId}`
    );
    return response.data;
  }

  /**
   * List dashboard blocks
   */
  async listBlocks(appToken: string): Promise<any[]> {
    const response = await this.http.get(`/bitable/v1/apps/${appToken}/dashboard/blocks`);
    return response.data?.items || [];
  }

  /**
   * Batch create blocks
   */
  async batchCreateBlocks(
    appToken: string,
    blocks: DashboardBlock[]
  ): Promise<DashboardResponse[]> {
    const results: DashboardResponse[] = [];

    // Create blocks sequentially to avoid rate limiting
    for (const block of blocks) {
      try {
        const result = await this.createBlock(appToken, block);
        results.push(result);
      } catch (error) {
        console.error(`Failed to create block:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Batch delete blocks
   */
  async batchDeleteBlocks(appToken: string, blockIds: string[]): Promise<void> {
    // Delete blocks sequentially to avoid rate limiting
    for (const blockId of blockIds) {
      try {
        await this.deleteBlock(appToken, blockId);
      } catch (error) {
        console.error(`Failed to delete block ${blockId}:`, error);
        throw error;
      }
    }
  }

  /**
   * Convert block configuration to Lark API format
   */
  private convertBlockToApiFormat(block: DashboardBlock): any {
    const payload: any = {
      block_type: block.blockType,
    };

    // Add configuration based on block type
    switch (block.blockType) {
      case 1: // Chart
        payload.config = this.convertChartConfig(block.config);
        break;
      case 2: // View
        payload.config = this.convertViewConfig(block.config);
        break;
      case 3: // Metrics
        payload.config = this.convertMetricsConfig(block.config);
        break;
      case 4: // Layout
        payload.config = this.convertLayoutConfig(block.config);
        break;
      case 5: // Text
        payload.config = this.convertTextConfig(block.config);
        break;
    }

    // Add position if provided
    if (block.position) {
      payload.position = block.position;
    }

    // Add size if provided
    if (block.size) {
      payload.size = block.size;
    }

    return payload;
  }

  /**
   * Convert chart configuration to API format
   */
  private convertChartConfig(config: any): any {
    return {
      chart_type: config.chartType,
      data_source: {
        app_token: config.dataSource.appToken,
        table_id: config.dataSource.tableId,
        view_id: config.dataSource.viewId,
      },
      x_axis: config.xAxis ? {
        field_name: config.xAxis.fieldName,
        aggregation: config.xAxis.aggregation,
        label: config.xAxis.label,
      } : undefined,
      y_axis: config.yAxis?.map((axis: any) => ({
        field_name: axis.fieldName,
        aggregation: axis.aggregation,
        label: axis.label,
      })),
      series: config.series ? {
        field_name: config.series.fieldName,
        aggregation: config.series.aggregation,
      } : undefined,
      group_by: config.groupBy,
      filters: config.filters ? {
        conjunction: config.filters.conjunction,
        conditions: config.filters.conditions.map((c: any) => ({
          field_name: c.fieldName,
          operator: c.operator,
          value: c.value,
        })),
      } : undefined,
      title: config.title,
      show_legend: config.showLegend,
      show_data_labels: config.showDataLabels,
      colors: config.colors,
    };
  }

  /**
   * Convert view configuration to API format
   */
  private convertViewConfig(config: any): any {
    return {
      view_type: config.viewType,
      data_source: {
        app_token: config.dataSource.appToken,
        table_id: config.dataSource.tableId,
        view_id: config.dataSource.viewId,
      },
      title: config.title,
      show_toolbar: config.showToolbar,
      height: config.height,
    };
  }

  /**
   * Convert metrics configuration to API format
   */
  private convertMetricsConfig(config: any): any {
    return {
      data_source: {
        app_token: config.dataSource.appToken,
        table_id: config.dataSource.tableId,
        view_id: config.dataSource.viewId,
      },
      field_name: config.fieldName,
      aggregation: config.aggregation,
      title: config.title,
      prefix: config.prefix,
      suffix: config.suffix,
      decimals: config.decimals,
      conditional_formats: config.conditionalFormats?.map((f: any) => ({
        operator: f.operator,
        value: f.value,
        color: f.color,
        icon: f.icon,
      })),
      show_trend: config.showTrend,
      trend_field_name: config.trendFieldName,
    };
  }

  /**
   * Convert layout configuration to API format
   */
  private convertLayoutConfig(config: any): any {
    return {
      columns: config.columns.map((col: any) => ({
        width: col.width,
        block_ids: col.blockIds,
      })),
      gap: config.gap,
      padding: config.padding,
    };
  }

  /**
   * Convert text configuration to API format
   */
  private convertTextConfig(config: any): any {
    return {
      elements: config.elements.map((el: any) => ({
        content: el.content,
        style: el.style ? {
          bold: el.style.bold,
          italic: el.style.italic,
          underline: el.style.underline,
          strikethrough: el.style.strikethrough,
          code: el.style.code,
          color: el.style.color,
          background_color: el.style.backgroundColor,
          font_size: el.style.fontSize,
        } : undefined,
        link: el.link,
      })),
      alignment: config.alignment,
      background_color: config.backgroundColor,
      padding: config.padding,
    };
  }
}
