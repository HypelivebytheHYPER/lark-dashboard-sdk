/**
 * Color palette utilities
 */

import { ColorPalette } from '../types';

/**
 * Default color palettes for charts and visualizations
 */
export const DEFAULT_COLORS: ColorPalette = {
  primary: [
    '#3b82f6', // blue-500
    '#06b6d4', // cyan-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
  ],
  success: [
    '#22c55e', // green-500
    '#84cc16', // lime-500
    '#10b981', // emerald-500
  ],
  warning: [
    '#f59e0b', // amber-500
    '#eab308', // yellow-500
    '#fb923c', // orange-400
  ],
  danger: [
    '#ef4444', // red-500
    '#dc2626', // red-600
    '#f87171', // red-400
  ],
  info: [
    '#3b82f6', // blue-500
    '#06b6d4', // cyan-500
    '#0ea5e9', // sky-500
  ],
  neutral: [
    '#64748b', // slate-500
    '#6b7280', // gray-500
    '#71717a', // zinc-500
  ],
  accent: [
    '#f472b6', // pink-400
    '#a78bfa', // purple-400
    '#fb7185', // rose-400
  ],
  gradient: [
    '#3b82f6', // blue-500 to
    '#06b6d4', // cyan-500
    '#8b5cf6', // violet-500 to
    '#ec4899', // pink-500
  ],
};

/**
 * Get a color from palette by index (wraps around)
 */
export function getColorFromPalette(
  palette: string[],
  index: number
): string {
  return palette[index % palette.length];
}

/**
 * Generate color array for chart series
 */
export function generateChartColors(
  count: number,
  palette: string[] = DEFAULT_COLORS.primary
): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(getColorFromPalette(palette, i));
  }
  return colors;
}

/**
 * Get conditional formatting color based on value
 */
export function getConditionalColor(
  value: number,
  thresholds: Array<{ value: number; color: string }>
): string {
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);

  for (let i = sorted.length - 1; i >= 0; i--) {
    if (value >= sorted[i].value) {
      return sorted[i].color;
    }
  }

  return DEFAULT_COLORS.neutral[0];
}

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Lighten a color by percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjust = (val: number) => {
    const adjusted = Math.min(255, Math.floor(val + (255 - val) * (percent / 100)));
    return adjusted;
  };

  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
}

/**
 * Darken a color by percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjust = (val: number) => {
    const adjusted = Math.max(0, Math.floor(val * (1 - percent / 100)));
    return adjusted;
  };

  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
}
