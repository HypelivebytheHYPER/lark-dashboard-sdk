/**
 * Lark Dashboard Client
 * Main entry point for interacting with Lark Dashboard API
 */

import {
  LarkClientConfig,
  Dashboard,
  DashboardBlock,
  DashboardResponse,
  BatchOperationResult,
} from './types';
import { HttpClient, DashboardApi } from './api';
import { validateClientConfig, parseEnvConfig, deepMerge } from './utils';
import {
  ChartBlockBuilder,
  ViewBlockBuilder,
  MetricsBlockBuilder,
  TextBlockBuilder,
} from './builders';

/**
 * Lark Dashboard Client
 *
 * Main client for creating and managing Lark/Feishu dashboard blocks.
 * Supports authentication, CRUD operations, and batch operations.
 *
 * @example
 * ```typescript
 * const client = new LarkDashboardClient({
 *   apiKey: 'your-api-key',
 *   region: 'sg',
 *   logging: true,
 * });
 *
 * const chartBlock = ChartBlockBuilder
 *   .bar()
 *   .dataSource('appToken', 'tableId')
 *   .xAxis('Category')
 *   .yAxis('Sales', AggregationType.SUM)
 *   .title('Sales by Category')
 *   .build();
 *
 * const result = await client.createBlock('appToken', chartBlock);
 * ```
 */
export class LarkDashboardClient {
  private http: HttpClient;
  private dashboardApi: DashboardApi;
  private config: LarkClientConfig;

  /**
   * Create a new Lark Dashboard Client
   *
   * @param config - Client configuration
   * @throws {ValidationError} If configuration is invalid
   */
  constructor(config: LarkClientConfig) {
    // Merge with environment variables
    const envConfig = parseEnvConfig();
    this.config = deepMerge(
      {
        apiKey: '',
        region: 'sg' as const,
        logging: false,
        timeout: 30000,
        maxRetries: 3,
        retryDelay: 1000,
      },
      deepMerge(envConfig as any, config as any)
    );

    // Validate configuration
    validateClientConfig(this.config);

    // Initialize HTTP client
    this.http = new HttpClient(this.config);

    // Initialize API clients
    this.dashboardApi = new DashboardApi(this.http);
  }

  /**
   * Create a dashboard block
   *
   * @param appToken - Application token
   * @param block - Dashboard block configuration
   * @returns Created block information
   *
   * @example
   * ```typescript
   * const block = ChartBlockBuilder.bar()
   *   .dataSource('appToken', 'tableId')
   *   .xAxis('Date')
   *   .yAxis('Revenue', AggregationType.SUM)
   *   .build();
   *
   * const result = await client.createBlock('appToken', block);
   * console.log('Created block:', result.block_id);
   * ```
   */
  async createBlock(appToken: string, block: DashboardBlock): Promise<DashboardResponse> {
    return this.dashboardApi.createBlock(appToken, block);
  }

  /**
   * Update an existing dashboard block
   *
   * @param appToken - Application token
   * @param blockId - Block ID to update
   * @param block - Updated block configuration
   * @returns Updated block information
   */
  async updateBlock(
    appToken: string,
    blockId: string,
    block: Partial<DashboardBlock>
  ): Promise<DashboardResponse> {
    return this.dashboardApi.updateBlock(appToken, blockId, block);
  }

  /**
   * Delete a dashboard block
   *
   * @param appToken - Application token
   * @param blockId - Block ID to delete
   */
  async deleteBlock(appToken: string, blockId: string): Promise<void> {
    return this.dashboardApi.deleteBlock(appToken, blockId);
  }

  /**
   * Get a dashboard block
   *
   * @param appToken - Application token
   * @param blockId - Block ID to retrieve
   * @returns Block information
   */
  async getBlock(appToken: string, blockId: string): Promise<any> {
    return this.dashboardApi.getBlock(appToken, blockId);
  }

  /**
   * List all dashboard blocks
   *
   * @param appToken - Application token
   * @returns Array of blocks
   */
  async listBlocks(appToken: string): Promise<any[]> {
    return this.dashboardApi.listBlocks(appToken);
  }

  /**
   * Create multiple dashboard blocks in batch
   *
   * @param appToken - Application token
   * @param blocks - Array of dashboard blocks
   * @returns Array of created block results
   *
   * @example
   * ```typescript
   * const blocks = [
   *   ChartBlockBuilder.bar().dataSource('app', 'table').build(),
   *   MetricsBlockBuilder.sum('Revenue').dataSource('app', 'table').build(),
   * ];
   *
   * const results = await client.batchCreateBlocks('appToken', blocks);
   * console.log(`Created ${results.length} blocks`);
   * ```
   */
  async batchCreateBlocks(
    appToken: string,
    blocks: DashboardBlock[]
  ): Promise<BatchOperationResult[]> {
    const results: BatchOperationResult[] = [];

    for (const block of blocks) {
      try {
        const response = await this.createBlock(appToken, block);
        results.push({
          success: true,
          blockId: response.block_id,
        });
      } catch (error: any) {
        results.push({
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Delete multiple dashboard blocks in batch
   *
   * @param appToken - Application token
   * @param blockIds - Array of block IDs to delete
   * @returns Array of deletion results
   */
  async batchDeleteBlocks(
    appToken: string,
    blockIds: string[]
  ): Promise<BatchOperationResult[]> {
    const results: BatchOperationResult[] = [];

    for (const blockId of blockIds) {
      try {
        await this.deleteBlock(appToken, blockId);
        results.push({
          success: true,
          blockId,
        });
      } catch (error: any) {
        results.push({
          success: false,
          blockId,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Create a complete dashboard with multiple blocks
   *
   * @param dashboard - Dashboard configuration
   * @returns Array of created block results
   *
   * @example
   * ```typescript
   * const dashboard = {
   *   name: 'Sales Dashboard',
   *   appToken: 'appToken',
   *   blocks: [
   *     TextBlockBuilder.heading('Sales Overview').build(),
   *     ChartBlockBuilder.bar().dataSource('app', 'table').build(),
   *     MetricsBlockBuilder.sum('Revenue').dataSource('app', 'table').build(),
   *   ],
   * };
   *
   * const results = await client.createDashboard(dashboard);
   * ```
   */
  async createDashboard(dashboard: Dashboard): Promise<BatchOperationResult[]> {
    if (!dashboard.blocks || dashboard.blocks.length === 0) {
      return [];
    }

    return this.batchCreateBlocks(dashboard.appToken, dashboard.blocks);
  }

  /**
   * Get chart block builder
   */
  static get Chart(): typeof ChartBlockBuilder {
    return ChartBlockBuilder;
  }

  /**
   * Get view block builder
   */
  static get View(): typeof ViewBlockBuilder {
    return ViewBlockBuilder;
  }

  /**
   * Get metrics block builder
   */
  static get Metrics(): typeof MetricsBlockBuilder {
    return MetricsBlockBuilder;
  }

  /**
   * Get text block builder
   */
  static get Text(): typeof TextBlockBuilder {
    return TextBlockBuilder;
  }

  /**
   * Get client configuration
   */
  getConfig(): LarkClientConfig {
    return { ...this.config };
  }

  /**
   * Get HTTP client (for advanced usage)
   */
  getHttpClient(): HttpClient {
    return this.http;
  }
}
