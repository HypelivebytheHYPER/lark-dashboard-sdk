/**
 * Layout block builder with fluent API
 */

import {
  LayoutConfig,
  LayoutColumn,
  BlockType,
  DashboardBlock,
} from '../types';
import { validateLayoutConfig } from '../utils';

/**
 * Builder for creating layout blocks
 * Creates multi-column layouts with responsive sizing (12-column grid)
 */
export class LayoutBlockBuilder {
  private config: Partial<LayoutConfig> = {
    columns: [],
  };

  /**
   * Add a column to the layout
   */
  addColumn(width: number, blockIds: string[] = []): this {
    this.config.columns!.push({
      width,
      blockIds,
    });
    return this;
  }

  /**
   * Set all columns at once
   */
  columns(columns: LayoutColumn[]): this {
    this.config.columns = columns;
    return this;
  }

  /**
   * Set gap between columns
   */
  gap(gap: number): this {
    this.config.gap = gap;
    return this;
  }

  /**
   * Set padding around layout
   */
  padding(padding: number): this {
    this.config.padding = padding;
    return this;
  }

  /**
   * Build the layout block
   */
  build(): DashboardBlock {
    // Validate configuration
    validateLayoutConfig(this.config as LayoutConfig);

    return {
      blockType: BlockType.LAYOUT,
      config: this.config as LayoutConfig,
    };
  }

  /**
   * Create a two-column layout (6-6 split)
   */
  static twoColumn(): LayoutBlockBuilder {
    return new LayoutBlockBuilder()
      .addColumn(6)
      .addColumn(6);
  }

  /**
   * Create a three-column layout (4-4-4 split)
   */
  static threeColumn(): LayoutBlockBuilder {
    return new LayoutBlockBuilder()
      .addColumn(4)
      .addColumn(4)
      .addColumn(4);
  }

  /**
   * Create a sidebar layout (3-9 split)
   */
  static sidebar(): LayoutBlockBuilder {
    return new LayoutBlockBuilder()
      .addColumn(3)
      .addColumn(9);
  }

  /**
   * Create a main-aside layout (8-4 split)
   */
  static mainAside(): LayoutBlockBuilder {
    return new LayoutBlockBuilder()
      .addColumn(8)
      .addColumn(4);
  }

  /**
   * Create a full-width layout
   */
  static fullWidth(): LayoutBlockBuilder {
    return new LayoutBlockBuilder().addColumn(12);
  }
}
