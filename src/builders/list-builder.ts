/**
 * List Block Builder (New 2025)
 * Fluent API for creating list blocks with advanced layouts
 */

import {
  DashboardBlock,
  BlockType,
  ListConfig,
  ListLayoutStyle,
  ListItemTemplate,
  ListActionButton,
  ListSorting,
  DataSource,
  FilterCondition,
  FilterConjunction,
} from '../types';

export class ListBlockBuilder {
  private config: Partial<ListConfig> = {};
  private blockPosition?: { x: number; y: number };
  private blockSize?: { width: number; height: number };
  private template: Partial<ListItemTemplate> = {};
  private actionButtons: ListActionButton[] = [];
  private sortingRules: ListSorting[] = [];

  /**
   * Set data source
   */
  dataSource(appToken: string, tableId: string, viewId?: string): this {
    this.config.dataSource = { appToken, tableId, viewId };
    return this;
  }

  /**
   * Set layout style
   */
  layoutStyle(style: ListLayoutStyle): this {
    this.config.layoutStyle = style;
    return this;
  }

  /**
   * Set list title
   */
  title(title: string): this {
    this.config.title = title;
    return this;
  }

  /**
   * Set title field in template
   */
  titleField(fieldName: string): this {
    this.template.titleField = fieldName;
    return this;
  }

  /**
   * Set subtitle field in template
   */
  subtitleField(fieldName: string): this {
    this.template.subtitleField = fieldName;
    return this;
  }

  /**
   * Set description field in template
   */
  descriptionField(fieldName: string): this {
    this.template.descriptionField = fieldName;
    return this;
  }

  /**
   * Set image field in template
   */
  imageField(fieldName: string): this {
    this.template.imageField = fieldName;
    return this;
  }

  /**
   * Set icon field in template
   */
  iconField(fieldName: string): this {
    this.template.iconField = fieldName;
    return this;
  }

  /**
   * Set badge field in template
   */
  badgeField(fieldName: string): this {
    this.template.badgeField = fieldName;
    return this;
  }

  /**
   * Set meta fields (additional info displayed)
   */
  metaFields(fields: string[]): this {
    this.template.metaFields = fields;
    return this;
  }

  /**
   * Add action button
   */
  addActionButton(button: ListActionButton): this {
    this.actionButtons.push(button);
    return this;
  }

  /**
   * Add link action button
   */
  addLinkButton(label: string, url: string, icon?: string, color?: string): this {
    this.actionButtons.push({
      label,
      action: 'link',
      url,
      icon,
      color,
    });
    return this;
  }

  /**
   * Add edit action button
   */
  addEditButton(label: string = 'Edit', icon?: string): this {
    this.actionButtons.push({
      label,
      action: 'edit',
      icon: icon || 'edit',
    });
    return this;
  }

  /**
   * Add delete action button
   */
  addDeleteButton(label: string = 'Delete', icon?: string): this {
    this.actionButtons.push({
      label,
      action: 'delete',
      icon: icon || 'delete',
      color: 'danger',
    });
    return this;
  }

  /**
   * Add sorting rule
   */
  addSorting(field: string, direction: 'asc' | 'desc', priority?: number): this {
    this.sortingRules.push({ field, direction, priority });
    return this;
  }

  /**
   * Sort ascending by field
   */
  sortAsc(field: string, priority?: number): this {
    return this.addSorting(field, 'asc', priority);
  }

  /**
   * Sort descending by field
   */
  sortDesc(field: string, priority?: number): this {
    return this.addSorting(field, 'desc', priority);
  }

  /**
   * Add filters
   */
  filters(conjunction: FilterConjunction, conditions: FilterCondition[]): this {
    this.config.filters = { conjunction, conditions };
    return this;
  }

  /**
   * Enable pagination
   */
  pagination(enabled: boolean, pageSize: number = 20): this {
    this.config.pagination = { enabled, pageSize };
    return this;
  }

  /**
   * Group list items by field
   */
  groupBy(fieldName: string): this {
    this.config.groupBy = fieldName;
    return this;
  }

  /**
   * Show/hide search bar
   */
  showSearch(show: boolean): this {
    this.config.showSearch = show;
    return this;
  }

  /**
   * Show/hide filter controls
   */
  showFilters(show: boolean): this {
    this.config.showFilters = show;
    return this;
  }

  /**
   * Make items clickable
   */
  clickable(clickable: boolean, action?: 'detail' | 'edit' | 'custom'): this {
    this.config.clickable = clickable;
    if (action) {
      this.config.onClickAction = action;
    }
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
   * Build the list block
   */
  build(): DashboardBlock {
    if (!this.config.dataSource) {
      throw new Error('Data source is required');
    }
    if (!this.config.layoutStyle) {
      throw new Error('Layout style is required');
    }
    if (!this.template.titleField) {
      throw new Error('Title field is required in template');
    }

    // Set template with action buttons
    this.template.actionButtons = this.actionButtons.length > 0 ? this.actionButtons : undefined;
    this.config.itemTemplate = this.template as ListItemTemplate;

    // Set sorting if any
    if (this.sortingRules.length > 0) {
      this.config.sorting = this.sortingRules;
    }

    return {
      blockType: BlockType.LIST,
      config: this.config as ListConfig,
      position: this.blockPosition,
      size: this.blockSize,
    };
  }

  /**
   * Create a vertical list builder
   */
  static vertical(): ListBlockBuilder {
    return new ListBlockBuilder().layoutStyle(ListLayoutStyle.VERTICAL);
  }

  /**
   * Create a horizontal list builder
   */
  static horizontal(): ListBlockBuilder {
    return new ListBlockBuilder().layoutStyle(ListLayoutStyle.HORIZONTAL);
  }

  /**
   * Create a grid list builder
   */
  static grid(): ListBlockBuilder {
    return new ListBlockBuilder().layoutStyle(ListLayoutStyle.GRID);
  }

  /**
   * Create a compact list builder
   */
  static compact(): ListBlockBuilder {
    return new ListBlockBuilder().layoutStyle(ListLayoutStyle.COMPACT);
  }

  /**
   * Create a detailed list builder
   */
  static detailed(): ListBlockBuilder {
    return new ListBlockBuilder().layoutStyle(ListLayoutStyle.DETAILED);
  }
}
