/**
 * Client tests
 */

import { LarkDashboardClient } from '../src/client';
import { ChartBlockBuilder, MetricsBlockBuilder } from '../src/builders';
import { ChartType, AggregationType } from '../src/types';
import { ValidationError } from '../src/utils';

describe('LarkDashboardClient', () => {
  const mockApiKey = 'test-api-key';
  const mockAppToken = 'test-app-token';
  const mockTableId = 'test-table-id';

  describe('constructor', () => {
    it('should create client with valid config', () => {
      const client = new LarkDashboardClient({
        apiKey: mockApiKey,
        region: 'sg',
        logging: false,
      });

      expect(client).toBeDefined();
      expect(client.getConfig().apiKey).toBe(mockApiKey);
      expect(client.getConfig().region).toBe('sg');
    });

    it('should throw error with invalid config', () => {
      expect(() => {
        new LarkDashboardClient({
          apiKey: '',
        });
      }).toThrow(ValidationError);
    });

    it('should use environment variables', () => {
      process.env.LARK_API_KEY = 'env-api-key';
      process.env.LARK_REGION = 'us';

      const client = new LarkDashboardClient({
        apiKey: mockApiKey,
      });

      expect(client.getConfig().apiKey).toBe(mockApiKey); // explicit config takes precedence
    });

    it('should apply default values', () => {
      const client = new LarkDashboardClient({
        apiKey: mockApiKey,
      });

      const config = client.getConfig();
      expect(config.region).toBe('sg');
      expect(config.logging).toBe(false);
      expect(config.timeout).toBe(30000);
      expect(config.maxRetries).toBe(3);
    });
  });

  describe('builder access', () => {
    it('should provide Chart builder', () => {
      expect(LarkDashboardClient.Chart).toBe(ChartBlockBuilder);
    });

    it('should provide Metrics builder', () => {
      expect(LarkDashboardClient.Metrics).toBe(MetricsBlockBuilder);
    });
  });

  describe('block creation', () => {
    it('should validate block before creation', () => {
      const client = new LarkDashboardClient({
        apiKey: mockApiKey,
      });

      // Invalid chart block (missing required fields)
      expect(() => {
        ChartBlockBuilder.bar()
          .dataSource(mockAppToken, mockTableId)
          .build();
      }).toThrow(ValidationError);
    });

    it('should create valid chart block', () => {
      const block = ChartBlockBuilder.bar()
        .dataSource(mockAppToken, mockTableId)
        .xAxis('Category')
        .yAxis('Revenue', AggregationType.SUM)
        .title('Test Chart')
        .build();

      expect(block.blockType).toBe(1); // Chart type
      expect(block.config).toBeDefined();
    });

    it('should create valid metrics block', () => {
      const block = MetricsBlockBuilder.sum('Revenue')
        .dataSource(mockAppToken, mockTableId)
        .title('Total Revenue')
        .prefix('$')
        .decimals(2)
        .build();

      expect(block.blockType).toBe(3); // Metrics type
      expect(block.config).toBeDefined();
    });
  });
});
