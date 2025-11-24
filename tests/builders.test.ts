/**
 * Builder tests
 */

import {
  ChartBlockBuilder,
  ViewBlockBuilder,
  MetricsBlockBuilder,
  TextBlockBuilder,
} from '../src/builders';
import {
  ChartType,
  ViewType,
  AggregationType,
  FilterOperator,
  BlockType,
} from '../src/types';
import { ValidationError } from '../src/utils';

describe('Builders', () => {
  const mockAppToken = 'app-token';
  const mockTableId = 'table-id';

  describe('ChartBlockBuilder', () => {
    it('should create bar chart', () => {
      const block = ChartBlockBuilder.bar()
        .dataSource(mockAppToken, mockTableId)
        .xAxis('Category')
        .yAxis('Value', AggregationType.SUM)
        .title('Bar Chart')
        .build();

      expect(block.blockType).toBe(BlockType.CHART);
      expect((block.config as any).chartType).toBe(ChartType.BAR);
    });

    it('should create line chart', () => {
      const block = ChartBlockBuilder.line()
        .dataSource(mockAppToken, mockTableId)
        .xAxis('Date')
        .yAxis('Value', AggregationType.COUNT)
        .build();

      expect((block.config as any).chartType).toBe(ChartType.LINE);
    });

    it('should create pie chart', () => {
      const block = ChartBlockBuilder.pie()
        .dataSource(mockAppToken, mockTableId)
        .series('Category', AggregationType.COUNT)
        .build();

      expect((block.config as any).chartType).toBe(ChartType.PIE);
    });

    it('should add filters', () => {
      const block = ChartBlockBuilder.bar()
        .dataSource(mockAppToken, mockTableId)
        .xAxis('Category')
        .yAxis('Value', AggregationType.SUM)
        .addFilter('Status', FilterOperator.IS, 'Active')
        .build();

      const config = block.config as any;
      expect(config.filters.conditions).toHaveLength(1);
      expect(config.filters.conditions[0].fieldName).toBe('Status');
    });

    it('should set custom colors', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const block = ChartBlockBuilder.bar()
        .dataSource(mockAppToken, mockTableId)
        .xAxis('Category')
        .yAxis('Value', AggregationType.SUM)
        .colors(colors)
        .build();

      expect((block.config as any).colors).toEqual(colors);
    });

    it('should throw error for invalid configuration', () => {
      expect(() => {
        ChartBlockBuilder.bar()
          .dataSource(mockAppToken, mockTableId)
          .build(); // Missing required axes
      }).toThrow(ValidationError);
    });
  });

  describe('ViewBlockBuilder', () => {
    it('should create grid view', () => {
      const block = ViewBlockBuilder.grid()
        .dataSource(mockAppToken, mockTableId)
        .title('Grid View')
        .toolbar(true)
        .build();

      expect(block.blockType).toBe(BlockType.VIEW);
      expect((block.config as any).viewType).toBe(ViewType.GRID);
    });

    it('should create kanban view', () => {
      const block = ViewBlockBuilder.kanban()
        .dataSource(mockAppToken, mockTableId)
        .height(500)
        .build();

      expect((block.config as any).viewType).toBe(ViewType.KANBAN);
      expect((block.config as any).height).toBe(500);
    });
  });

  describe('MetricsBlockBuilder', () => {
    it('should create count metrics', () => {
      const block = MetricsBlockBuilder.count('ID')
        .dataSource(mockAppToken, mockTableId)
        .title('Total Count')
        .build();

      const config = block.config as any;
      expect(block.blockType).toBe(BlockType.METRICS);
      expect(config.aggregation).toBe(AggregationType.COUNT);
    });

    it('should create sum metrics', () => {
      const block = MetricsBlockBuilder.sum('Revenue')
        .dataSource(mockAppToken, mockTableId)
        .prefix('$')
        .decimals(2)
        .build();

      const config = block.config as any;
      expect(config.aggregation).toBe(AggregationType.SUM);
      expect(config.prefix).toBe('$');
      expect(config.decimals).toBe(2);
    });

    it('should add conditional formatting', () => {
      const block = MetricsBlockBuilder.average('Score')
        .dataSource(mockAppToken, mockTableId)
        .addConditionalFormat(FilterOperator.IS_GREATER_EQUAL, 80, '#00ff00')
        .build();

      const config = block.config as any;
      expect(config.conditionalFormats).toHaveLength(1);
      expect(config.conditionalFormats[0].value).toBe(80);
    });
  });

  describe('LayoutBlockBuilder', () => {
    it('should create two-column layout', () => {
      const block = LayoutBlockBuilder.twoColumn().build();

      const config = block.config as any;
      expect(block.blockType).toBe(BlockType.LAYOUT);
      expect(config.columns).toHaveLength(2);
      expect(config.columns[0].width).toBe(6);
      expect(config.columns[1].width).toBe(6);
    });

    it('should create custom layout', () => {
      const block = new LayoutBlockBuilder()
        .addColumn(3, ['block1'])
        .addColumn(9, ['block2', 'block3'])
        .gap(10)
        .padding(20)
        .build();

      const config = block.config as any;
      expect(config.columns).toHaveLength(2);
      expect(config.gap).toBe(10);
      expect(config.padding).toBe(20);
    });

    it('should throw error for invalid width', () => {
      expect(() => {
        new LayoutBlockBuilder()
          .addColumn(15) // Exceeds max width
          .build();
      }).toThrow(ValidationError);
    });
  });

  describe('TextBlockBuilder', () => {
    it('should create heading', () => {
      const block = TextBlockBuilder.heading('Dashboard Title', 28).build();

      const config = block.config as any;
      expect(block.blockType).toBe(BlockType.TEXT);
      expect(config.elements).toHaveLength(1);
      expect(config.elements[0].style.bold).toBe(true);
    });

    it('should create formatted text', () => {
      const block = new TextBlockBuilder()
        .addBold('Bold text ')
        .addItalic('Italic text ')
        .addUnderline('Underlined text')
        .build();

      const config = block.config as any;
      expect(config.elements).toHaveLength(3);
    });

    it('should create link', () => {
      const block = TextBlockBuilder.link('Click here', 'https://example.com').build();

      const config = block.config as any;
      expect(config.elements[0].link).toBe('https://example.com');
    });

    it('should set alignment', () => {
      const block = new TextBlockBuilder()
        .addText('Centered text')
        .alignment('center')
        .build();

      const config = block.config as any;
      expect(config.alignment).toBe('center');
    });
  });
});
