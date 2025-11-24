/**
 * Tab/Page Block Builder (New 2025)
 * Fluent API for creating tabbed interfaces and page navigation
 */

import {
  DashboardBlock,
  BlockType,
  TabPageConfig,
  TabPageLayout,
  TabPageItem,
} from '../types';

export class TabPageBlockBuilder {
  private config: Partial<TabPageConfig> = {
    tabs: [],
  };
  private blockPosition?: { x: number; y: number };
  private blockSize?: { width: number; height: number };

  /**
   * Set layout type
   */
  layout(layout: TabPageLayout): this {
    this.config.layout = layout;
    return this;
  }

  /**
   * Set title
   */
  title(title: string): this {
    this.config.title = title;
    return this;
  }

  /**
   * Add a tab
   */
  addTab(tab: TabPageItem): this {
    if (!this.config.tabs) {
      this.config.tabs = [];
    }
    this.config.tabs.push(tab);
    return this;
  }

  /**
   * Add a tab with parameters
   */
  tab(
    id: string,
    label: string,
    blockIds: string[],
    options?: {
      icon?: string;
      badge?: string | number;
      disabled?: boolean;
    }
  ): this {
    const tab: TabPageItem = {
      id,
      label,
      blockIds,
      icon: options?.icon,
      badge: options?.badge,
      disabled: options?.disabled,
    };
    return this.addTab(tab);
  }

  /**
   * Set default tab
   */
  defaultTab(tabId: string): this {
    this.config.defaultTab = tabId;
    return this;
  }

  /**
   * Show/hide tab count badges
   */
  showTabCount(show: boolean): this {
    this.config.showTabCount = show;
    return this;
  }

  /**
   * Enable/disable transition animations
   */
  animateTransition(animate: boolean): this {
    this.config.animateTransition = animate;
    return this;
  }

  /**
   * Allow users to reorder tabs
   */
  allowReorder(allow: boolean): this {
    this.config.allowReorder = allow;
    return this;
  }

  /**
   * Allow users to close tabs
   */
  allowClose(allow: boolean): this {
    this.config.allowClose = allow;
    return this;
  }

  /**
   * Set maximum number of tabs
   */
  maxTabs(max: number): this {
    this.config.maxTabs = max;
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
   * Build the tab/page block
   */
  build(): DashboardBlock {
    if (!this.config.layout) {
      throw new Error('Layout type is required');
    }
    if (!this.config.tabs || this.config.tabs.length === 0) {
      throw new Error('At least one tab is required');
    }

    return {
      blockType: BlockType.TAB_PAGE,
      config: this.config as TabPageConfig,
      position: this.blockPosition,
      size: this.blockSize,
    };
  }

  /**
   * Create a horizontal tabs builder
   */
  static horizontalTabs(): TabPageBlockBuilder {
    return new TabPageBlockBuilder().layout(TabPageLayout.HORIZONTAL_TABS);
  }

  /**
   * Create a vertical tabs builder
   */
  static verticalTabs(): TabPageBlockBuilder {
    return new TabPageBlockBuilder().layout(TabPageLayout.VERTICAL_TABS);
  }

  /**
   * Create a pills layout builder
   */
  static pills(): TabPageBlockBuilder {
    return new TabPageBlockBuilder().layout(TabPageLayout.PILLS);
  }

  /**
   * Create a sidebar layout builder
   */
  static sidebar(): TabPageBlockBuilder {
    return new TabPageBlockBuilder().layout(TabPageLayout.SIDEBAR);
  }

  /**
   * Create a dropdown layout builder
   */
  static dropdown(): TabPageBlockBuilder {
    return new TabPageBlockBuilder().layout(TabPageLayout.DROPDOWN);
  }
}
