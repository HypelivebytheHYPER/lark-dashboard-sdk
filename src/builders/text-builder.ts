/**
 * Text Block Builder
 * Fluent API for creating text/markdown blocks
 */

import {
  DashboardBlock,
  BlockType,
  TextConfig,
  TextElement,
  TextStyle,
} from '../types';

export class TextBlockBuilder {
  private config: Partial<TextConfig> = {
    elements: [],
  };
  private blockPosition?: { x: number; y: number };
  private blockSize?: { width: number; height: number };

  /**
   * Add text element
   */
  addText(content: string, style?: TextStyle, link?: string): this {
    if (!this.config.elements) {
      this.config.elements = [];
    }
    this.config.elements.push({ content, style, link });
    return this;
  }

  /**
   * Add heading
   */
  heading(content: string, level: 1 | 2 | 3 = 1): this {
    return this.addText(content, {
      bold: true,
      fontSize: level === 1 ? 24 : level === 2 ? 20 : 16,
    });
  }

  /**
   * Add paragraph
   */
  paragraph(content: string, style?: TextStyle): this {
    return this.addText(content, style);
  }

  /**
   * Add bold text
   */
  bold(content: string): this {
    return this.addText(content, { bold: true });
  }

  /**
   * Add italic text
   */
  italic(content: string): this {
    return this.addText(content, { italic: true });
  }

  /**
   * Add link
   */
  link(content: string, url: string, style?: TextStyle): this {
    return this.addText(content, style, url);
  }

  /**
   * Add code block
   */
  code(content: string): this {
    return this.addText(content, { code: true });
  }

  /**
   * Set text alignment
   */
  alignment(alignment: 'left' | 'center' | 'right'): this {
    this.config.alignment = alignment;
    return this;
  }

  /**
   * Set background color
   */
  backgroundColor(color: string): this {
    this.config.backgroundColor = color;
    return this;
  }

  /**
   * Set padding
   */
  padding(padding: number): this {
    this.config.padding = padding;
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
   * Build the text block
   */
  build(): DashboardBlock {
    if (!this.config.elements || this.config.elements.length === 0) {
      throw new Error('At least one text element is required');
    }

    return {
      blockType: BlockType.TEXT,
      config: this.config as TextConfig,
      position: this.blockPosition,
      size: this.blockSize,
    };
  }
}
