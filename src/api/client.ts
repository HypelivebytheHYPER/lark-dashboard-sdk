/**
 * Lark Dashboard REST API Client
 * Production-ready client for creating and managing Lark dashboards
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import {
  LarkClientConfig,
  LarkApiResponse,
  Dashboard,
  DashboardBlock,
  DashboardResponse,
  BatchOperationResult,
  LarkRegion,
} from '../types';
import { validateDashboard, validateBlock } from '../utils/validation';
import { logRequest, logResponse, logError } from '../utils/helpers';

/**
 * Main client class for Lark Dashboard API
 */
export class LarkDashboardClient {
  private client: AxiosInstance;
  private config: Required<LarkClientConfig>;

  /**
   * Create a new Lark Dashboard Client
   * @param config - Client configuration
   */
  constructor(config: LarkClientConfig) {
    // Set defaults
    this.config = {
      apiKey: config.apiKey,
      apiUrl: config.apiUrl || this.getRegionUrl(config.region || 'sg'),
      region: config.region || 'sg',
      logging: config.logging ?? false,
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
    };

    // Create axios instance
    this.client = axios.create({
      baseURL: this.config.apiUrl,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Configure retry logic
    axiosRetry(this.client, {
      retries: this.config.maxRetries,
      retryDelay: (retryCount) => {
        return this.config.retryDelay * Math.pow(2, retryCount - 1);
      },
      retryCondition: (error) => {
        if (axiosRetry.isNetworkOrIdempotentRequestError(error)) {
          return true;
        }
        if (error.response?.status === 429) {
          return true;
        }
        if (error.response?.status && error.response.status >= 500) {
          return true;
        }
        return false;
      },
    });

    // Add request interceptor for logging
    if (this.config.logging) {
      this.client.interceptors.request.use(
        (config) => {
          logRequest(
            config.method?.toUpperCase() || 'GET',
            config.url || '',
            config.data
          );
          return config;
        },
        (error) => {
          logError(error);
          return Promise.reject(error);
        }
      );

      this.client.interceptors.response.use(
        (response) => {
          logResponse(response.status, response.data);
          return response;
        },
        (error) => {
          logError(error);
          return Promise.reject(error);
        }
      );
    }
  }

  /**
   * Get API URL for a specific region
   */
  private getRegionUrl(region: LarkRegion): string {
    const urls: Record<LarkRegion, string> = {
      sg: 'https://open.larksuite.com/open-apis',
      cn: 'https://open.feishu.cn/open-apis',
      us: 'https://open.larksuite.com/open-apis',
    };
    return urls[region];
  }

  /**
   * Make an API request with error handling
   */
  private async request<T>(config: AxiosRequestConfig): Promise<LarkApiResponse<T>> {
    try {
      const response = await this.client.request<LarkApiResponse<T>>(config);

      if (response.data.code !== 0) {
        throw new Error(`Lark API error: ${response.data.msg} (code: ${response.data.code})`);
      }

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `API request failed: ${error.response.data?.msg || error.message} ` +
          `(status: ${error.response.status})`
        );
      }
      throw error;
    }
  }

  /**
   * Create a new dashboard
   * @param dashboard - Dashboard configuration
   * @returns Dashboard block ID
   */
  async createDashboard(dashboard: Dashboard): Promise<string> {
    // Validate dashboard
    validateDashboard(dashboard);

    const response = await this.request<DashboardResponse>({
      method: 'POST',
      url: `/bitable/v1/apps/${dashboard.appToken}/dashboards`,
      data: {
        name: dashboard.name,
      },
    });

    const dashboardId = response.data?.block_id;
    if (!dashboardId) {
      throw new Error('Failed to create dashboard: no block_id returned');
    }

    // Add blocks if provided
    if (dashboard.blocks && dashboard.blocks.length > 0) {
      await this.addBlocks(dashboard.appToken, dashboardId, dashboard.blocks);
    }

    return dashboardId;
  }

  /**
   * Add a single block to a dashboard
   * @param appToken - Base app token
   * @param dashboardId - Dashboard block ID
   * @param block - Block configuration
   * @returns Block ID
   */
  async addBlock(
    appToken: string,
    dashboardId: string,
    block: DashboardBlock
  ): Promise<string> {
    // Validate block
    validateBlock(block);

    const response = await this.request<DashboardResponse>({
      method: 'POST',
      url: `/bitable/v1/apps/${appToken}/dashboards/${dashboardId}/blocks`,
      data: {
        block_type: block.blockType,
        config: block.config,
        position: block.position,
        size: block.size,
      },
    });

    const blockId = response.data?.block_id;
    if (!blockId) {
      throw new Error('Failed to add block: no block_id returned');
    }

    return blockId;
  }

  /**
   * Add multiple blocks to a dashboard
   * @param appToken - Base app token
   * @param dashboardId - Dashboard block ID
   * @param blocks - Array of blocks
   * @returns Array of results
   */
  async addBlocks(
    appToken: string,
    dashboardId: string,
    blocks: DashboardBlock[]
  ): Promise<BatchOperationResult[]> {
    const results: BatchOperationResult[] = [];

    for (const block of blocks) {
      try {
        const blockId = await this.addBlock(appToken, dashboardId, block);
        results.push({ success: true, blockId });
      } catch (error: any) {
        results.push({ success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Update an existing block
   * @param appToken - Base app token
   * @param dashboardId - Dashboard block ID
   * @param blockId - Block ID to update
   * @param block - Updated block configuration
   */
  async updateBlock(
    appToken: string,
    dashboardId: string,
    blockId: string,
    block: Partial<DashboardBlock>
  ): Promise<void> {
    await this.request({
      method: 'PATCH',
      url: `/bitable/v1/apps/${appToken}/dashboards/${dashboardId}/blocks/${blockId}`,
      data: {
        block_type: block.blockType,
        config: block.config,
        position: block.position,
        size: block.size,
      },
    });
  }

  /**
   * Delete a block from a dashboard
   * @param appToken - Base app token
   * @param dashboardId - Dashboard block ID
   * @param blockId - Block ID to delete
   */
  async deleteBlock(
    appToken: string,
    dashboardId: string,
    blockId: string
  ): Promise<void> {
    await this.request({
      method: 'DELETE',
      url: `/bitable/v1/apps/${appToken}/dashboards/${dashboardId}/blocks/${blockId}`,
    });
  }

  /**
   * Delete a dashboard
   * @param appToken - Base app token
   * @param dashboardId - Dashboard block ID
   */
  async deleteDashboard(appToken: string, dashboardId: string): Promise<void> {
    await this.request({
      method: 'DELETE',
      url: `/bitable/v1/apps/${appToken}/dashboards/${dashboardId}`,
    });
  }

  /**
   * Get dashboard details
   * @param appToken - Base app token
   * @param dashboardId - Dashboard block ID
   */
  async getDashboard(appToken: string, dashboardId: string): Promise<any> {
    const response = await this.request({
      method: 'GET',
      url: `/bitable/v1/apps/${appToken}/dashboards/${dashboardId}`,
    });
    return response.data;
  }

  /**
   * List all dashboards in a base
   * @param appToken - Base app token
   */
  async listDashboards(appToken: string): Promise<any[]> {
    const response = await this.request<{ items: any[] }>({
      method: 'GET',
      url: `/bitable/v1/apps/${appToken}/dashboards`,
    });
    return response.data?.items || [];
  }
}
