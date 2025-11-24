/**
 * Text block builder with fluent API
 */

import {
  TextConfig,
  TextElement,
  TextStyle,
  BlockType,
  DashboardBlock,
} from '../types';
import { validateTextConfig } from '../utils';

/**
 * Builder for creating text blocks
 * Supports rich text with formatting, links, and styling
 */
export class TextBlockBuilder {
  private config: Partial<TextConfig> = {
    elements: [],
  };

  /**
   * Add a text element
   */
  addText(content: string, style?: TextStyle, link?: string): this {
    this.config.elements!.push({
      content,
      style,
      link,
    });
    return this;
  }

  /**
   * Add bold text
   */
  addBold(content: string): this {
    return this.addText(content, { bold: true });
  }

  /**
   * Add italic text
   */
  addItalic(content: string): this {
    return this.addText(content, { italic: true });
  }

  /**
   * Add underlined text
   */
  addUnderline(content: string): this {
    return this.addText(content, { underline: true });
  }

  /**
   * Add code text
   */
  addCode(content: string): this {
    return this.addText(content, { code: true });
  }

  /**
   * Add link
   */
  addLink(content: string, url: string): this {
    return this.addText(content, undefined, url);
  }

  /**
   * Add colored text
   */
  addColored(content: string, color: string): this {
    return this.addText(content, { color });
  }

  /**
   * Add heading (large, bold text)
   */
  addHeading(content: string, fontSize: number = 24): this {
    return this.addText(content, { bold: true, fontSize });
  }

  /**
   * Add line break
   */
  addLineBreak(): this {
    return this.addText('\n');
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
   * Build the text block
   */
  build(): DashboardBlock {
    // Validate configuration
    validateTextConfig(this.config as TextConfig);

    return {
      blockType: BlockType.TEXT,
      config: this.config as TextConfig,
    };
  }

  /**
   * Create a heading text block
   */
  static heading(content: string, fontSize: number = 24): TextBlockBuilder {
    return new TextBlockBuilder().addHeading(content, fontSize);
  }

  /**
   * Create a paragraph text block
   */
  static paragraph(content: string): TextBlockBuilder {
    return new TextBlockBuilder().addText(content);
  }

  /**
   * Create a link text block
   */
  static link(content: string, url: string): TextBlockBuilder {
    return new TextBlockBuilder().addLink(content, url);
  }
}
