/**
 * Lark Dashboard SDK - Main Entry Point
 * Production-ready TypeScript SDK for creating Lark dashboards via REST API
 * Enhanced with 2025 Dashboard Features
 */

// Export main client
export { LarkDashboardClient } from './api/client';

// Export all types
export * from './types';

// Export builders
export {
  ChartBlockBuilder,
  MetricsBlockBuilder,
  ViewBlockBuilder,
  TextBlockBuilder,
  ListBlockBuilder,        // New 2025
  TabPageBlockBuilder,     // New 2025
} from './builders';

// Export permissions (New 2025)
export {
  DashboardPermissionBuilder,
  BlockPermissionBuilder,
  PermissionHelper,
} from './permissions';

// Export utilities
export * from './utils';
