/**
 * HTTP client for Lark API requests
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { LarkClientConfig, LarkApiResponse, RequestContext } from '../types';
import { getApiUrlForRegion, formatTimestamp, sanitizeLogData, formatDuration } from '../utils';

/**
 * HTTP client wrapper with retry logic and logging
 */
export class HttpClient {
  private client: AxiosInstance;
  private config: LarkClientConfig;

  constructor(config: LarkClientConfig) {
    this.config = config;

    // Determine base URL
    const baseURL = config.apiUrl || getApiUrlForRegion(config.region || 'sg');

    // Create axios instance
    this.client = axios.create({
      baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Configure retry logic
    axiosRetry(this.client, {
      retries: config.maxRetries || 3,
      retryDelay: (retryCount) => {
        const delay = (config.retryDelay || 1000) * Math.pow(2, retryCount - 1);
        return delay + Math.random() * 1000;
      },
      retryCondition: (error) => {
        // Retry on network errors or 5xx errors
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response?.status ? error.response.status >= 500 : false)
        );
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        if (this.config.logging) {
          const context: RequestContext = {
            method: config.method?.toUpperCase() || 'GET',
            url: config.url || '',
            timestamp: formatTimestamp(),
          };
          this.logRequest(context);
        }
        return config;
      },
      (error) => {
        if (this.config.logging) {
          this.logError(error);
        }
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        if (this.config.logging) {
          const context: RequestContext = {
            method: response.config.method?.toUpperCase() || 'GET',
            url: response.config.url || '',
            timestamp: formatTimestamp(),
            status: response.status,
            duration: response.config.headers?.['X-Request-Start']
              ? Date.now() - parseInt(response.config.headers['X-Request-Start'] as string)
              : undefined,
          };
          this.logResponse(context, response.data);
        }
        return response;
      },
      (error) => {
        if (this.config.logging) {
          const context: RequestContext = {
            method: error.config?.method?.toUpperCase() || 'GET',
            url: error.config?.url || '',
            timestamp: formatTimestamp(),
            status: error.response?.status,
            error: error.response?.data || error.message,
          };
          this.logError(context);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Perform GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<LarkApiResponse<T>> {
    const response = await this.client.get<LarkApiResponse<T>>(url, config);
    this.checkResponse(response);
    return response.data;
  }

  /**
   * Perform POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<LarkApiResponse<T>> {
    const response = await this.client.post<LarkApiResponse<T>>(url, data, config);
    this.checkResponse(response);
    return response.data;
  }

  /**
   * Perform PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<LarkApiResponse<T>> {
    const response = await this.client.put<LarkApiResponse<T>>(url, data, config);
    this.checkResponse(response);
    return response.data;
  }

  /**
   * Perform PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<LarkApiResponse<T>> {
    const response = await this.client.patch<LarkApiResponse<T>>(url, data, config);
    this.checkResponse(response);
    return response.data;
  }

  /**
   * Perform DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<LarkApiResponse<T>> {
    const response = await this.client.delete<LarkApiResponse<T>>(url, config);
    this.checkResponse(response);
    return response.data;
  }

  /**
   * Check response for errors
   */
  private checkResponse(response: AxiosResponse<LarkApiResponse>): void {
    if (response.data.code !== 0) {
      throw new Error(
        `Lark API Error (code ${response.data.code}): ${response.data.msg}`
      );
    }
  }

  /**
   * Log request
   */
  private logRequest(context: RequestContext): void {
    console.log(`[${context.timestamp}] ${context.method} ${context.url}`);
  }

  /**
   * Log response
   */
  private logResponse(context: RequestContext, data: any): void {
    const duration = context.duration ? ` (${formatDuration(context.duration)})` : '';
    console.log(
      `[${context.timestamp}] ${context.method} ${context.url} - ${context.status}${duration}`
    );
    if (this.config.logging && data) {
      console.log('Response:', sanitizeLogData(data));
    }
  }

  /**
   * Log error
   */
  private logError(context: RequestContext): void {
    console.error(
      `[${context.timestamp}] ${context.method} ${context.url} - ERROR (${context.status || 'no status'})`
    );
    if (context.error) {
      console.error('Error:', sanitizeLogData(context.error));
    }
  }

  /**
   * Get underlying axios instance (for advanced usage)
   */
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}
