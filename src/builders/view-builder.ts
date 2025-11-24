/**
 * View Block Builder
 * Fluent API for creating view blocks
 */

import {
  DashboardBlock,
  BlockType,
  ViewType,
  ViewConfig,
  DataSource,
} from '../types';

export class ViewBlockBuilder {
  private config: Partial<ViewConfig> = {};
  private blockPosition?: { x: number; y: number };
  private blockSize?: { width: number; height: number };

  /**
   * Set view type
   */
  viewType(type: ViewType): this {
    this.config.viewType = type;
    return this;
  }

  /**
   * Set data source
   */
  dataSource(appToken: string, tableId: string, viewId?: string): this {
    this.config.dataSource = { appToken, tableId, viewId };
    return this;
  }

  /**
   * Set view title
   */
  title(title: string): this {
    this.config.title = title;
    return this;
  }

  /**
   * Show/hide toolbar
   */
  showToolbar(show: boolean): this {
    this.config.showToolbar = show;
    return this;
  }

  /**
   * Set view height
   */
  height(height: number): this {
    this.config.height = height;
    return this;
  }

  /**
   * Set block position
   */
  position(x: number, y: number): this {
    this.blockPosition = { x, y };
    return this;
  }

  /**
   * Set block size
   */
  size(width: number, height: number): this {
    this.blockSize = { width, height };
    return this;
  }

  /**
   * Build the view block
   */
  build(): DashboardBlock {
    if (!this.config.viewType) {
      throw new Error('View type is required');
    }
    if (!this.config.dataSource) {
      throw new Error('Data source is required');
    }

    return {
      blockType: BlockType.VIEW,
      config: this.config as ViewConfig,
      position: this.blockPosition,
      size: this.blockSize,
    };
  }

  /**
   * Create a grid view builder
   */
  static grid(): ViewBlockBuilder {
    return new ViewBlockBuilder().viewType(ViewType.GRID);
  }

  /**
   * Create a kanban view builder
   */
  static kanban(): ViewBlockBuilder {
    return new ViewBlockBuilder().viewType(ViewType.KANBAN);
  }

  /**
   * Create a gallery view builder
   */
  static gallery(): ViewBlockBuilder {
    return new ViewBlockBuilder().viewType(ViewType.GALLERY);
  }

  /**
   * Create a gantt view builder
   */
  static gantt(): ViewBlockBuilder {
    return new ViewBlockBuilder().viewType(ViewType.GANTT);
  }

  /**
   * Create a form view builder
   */
  static form(): ViewBlockBuilder {
    return new ViewBlockBuilder().viewType(ViewType.FORM);
  }
}
