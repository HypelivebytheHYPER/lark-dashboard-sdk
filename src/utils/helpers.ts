/**
 * Helper utilities for Lark Dashboard SDK
 */

import { FieldMapping, TableMetadata, LarkRegion } from '../types';

/**
 * Get API base URL for region
 */
export function getApiUrlForRegion(region: LarkRegion): string {
  const urls: Record<LarkRegion, string> = {
    sg: 'https://open.feishu.cn/open-apis',
    cn: 'https://open.feishu.cn/open-apis',
    us: 'https://open.larksuite.com/open-apis',
  };
  return urls[region];
}

/**
 * Sleep helper for retry logic
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
export function calculateBackoff(attempt: number, baseDelay: number): number {
  return baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
}

/**
 * Format timestamp for logging
 */
export function formatTimestamp(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Sanitize log data (remove sensitive information)
 */
export function sanitizeLogData(data: any): any {
  if (!data) return data;

  const sanitized = JSON.parse(JSON.stringify(data));

  // Remove sensitive headers
  if (sanitized.headers) {
    if (sanitized.headers.Authorization) {
      sanitized.headers.Authorization = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    if (sourceValue !== null && typeof sourceValue === 'object' && !Array.isArray(sourceValue) && key in target) {
      output[key] = deepMerge(target[key], sourceValue as any);
    } else {
      output[key] = sourceValue as any;
    }
  }

  return output;
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Retry with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelay: number,
  retryableErrors?: number[]
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if error is retryable
      if (retryableErrors && error.response?.status) {
        if (!retryableErrors.includes(error.response.status)) {
          throw error;
        }
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate backoff delay
      const delay = calculateBackoff(attempt, baseDelay);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Create field mapping helper
 */
export class FieldMapper {
  private mapping: FieldMapping;

  constructor(mapping: FieldMapping = {}) {
    this.mapping = mapping;
  }

  /**
   * Add field mapping
   */
  add(fieldName: string, fieldId: string): void {
    this.mapping[fieldName] = fieldId;
  }

  /**
   * Get field ID by name
   */
  getFieldId(fieldName: string): string | undefined {
    return this.mapping[fieldName];
  }

  /**
   * Get field name by ID
   */
  getFieldName(fieldId: string): string | undefined {
    const entry = Object.entries(this.mapping).find(([_, id]) => id === fieldId);
    return entry?.[0];
  }

  /**
   * Check if field exists
   */
  hasField(fieldName: string): boolean {
    return fieldName in this.mapping;
  }

  /**
   * Get all mappings
   */
  getAll(): FieldMapping {
    return { ...this.mapping };
  }

  /**
   * Clear all mappings
   */
  clear(): void {
    this.mapping = {};
  }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse environment variables
 */
export function parseEnvConfig(): Partial<{
  apiKey: string;
  apiUrl: string;
  region: LarkRegion;
}> {
  return {
    apiKey: process.env.LARK_API_KEY,
    apiUrl: process.env.LARK_API_URL,
    region: (process.env.LARK_REGION as LarkRegion) || 'sg',
  };
}

/**
 * Format error message
 */
export function formatErrorMessage(error: any): string {
  if (error.response?.data?.msg) {
    return error.response.data.msg;
  }
  if (error.message) {
    return error.message;
  }
  return 'Unknown error occurred';
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Truncate string
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Format duration in milliseconds
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(2)}m`;
  return `${(ms / 3600000).toFixed(2)}h`;
}

/**
 * Create table metadata helper
 */
export function createTableMetadata(
  tableId: string,
  tableName: string,
  fields: FieldMapping
): TableMetadata {
  return {
    tableId,
    tableName,
    fields,
  };
}

/**
 * Log request (for debugging)
 */
export function logRequest(method: string, url: string, data?: any): void {
  if (process.env.LARK_LOGGING === 'true') {
    console.log(`[${formatTimestamp()}] ${method} ${url}`);
    if (data) {
      console.log('Request data:', sanitizeLogData(data));
    }
  }
}

/**
 * Log response (for debugging)
 */
export function logResponse(status: number, data: any, duration?: number): void {
  if (process.env.LARK_LOGGING === 'true') {
    console.log(`[${formatTimestamp()}] Response ${status}${duration ? ` (${formatDuration(duration)})` : ''}`);
    console.log('Response data:', sanitizeLogData(data));
  }
}

/**
 * Log error (for debugging)
 */
export function logError(error: any): void {
  if (process.env.LARK_LOGGING === 'true') {
    console.error(`[${formatTimestamp()}] Error:`, formatErrorMessage(error));
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', sanitizeLogData(error.response.data));
    }
  }
}
