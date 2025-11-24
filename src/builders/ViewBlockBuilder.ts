/**
 * View block builder with fluent API
 */

import {
  ViewConfig,
  ViewType,
  DataSource,
  BlockType,
  DashboardBlock,
} from '../types';
import { validateViewConfig } from '../utils';

/**
 * Builder for creating view blocks
 * Embeds existing views: Grid, Kanban, Gallery, Gantt, Form
 */
export class ViewBlockBuilder {
  private config: Partial<ViewConfig> = {};

  /**
   * Set view type
   */
  type(viewType: ViewType): this {
    this.config.viewType = viewType;
    return this;
  }

  /**
   * Set data source
   */
  dataSource(appToken: string, tableId: string, viewId?: string): this {
    this.config.dataSource = {
      appToken,
      tableId,
      viewId,
    };
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
  toolbar(show: boolean = true): this {
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
   * Build the view block
   */
  build(): DashboardBlock {
    // Validate configuration
    validateViewConfig(this.config as ViewConfig);

    return {
      blockType: BlockType.VIEW,
      config: this.config as ViewConfig,
    };
  }

  /**
   * Create a grid view block
   */
  static grid(): ViewBlockBuilder {
    return new ViewBlockBuilder().type(ViewType.GRID);
  }

  /**
   * Create a kanban view block
   */
  static kanban(): ViewBlockBuilder {
    return new ViewBlockBuilder().type(ViewType.KANBAN);
  }

  /**
   * Create a gallery view block
   */
  static gallery(): ViewBlockBuilder {
    return new ViewBlockBuilder().type(ViewType.GALLERY);
  }

  /**
   * Create a gantt view block
   */
  static gantt(): ViewBlockBuilder {
    return new ViewBlockBuilder().type(ViewType.GANTT);
  }

  /**
   * Create a form view block
   */
  static form(): ViewBlockBuilder {
    return new ViewBlockBuilder().type(ViewType.FORM);
  }
}
