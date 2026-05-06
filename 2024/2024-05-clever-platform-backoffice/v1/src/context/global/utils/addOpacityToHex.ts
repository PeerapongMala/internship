/**
 * Convert a 6-digit hex color (#RRGGBB) into an 8-digit hex color (#RRGGBBAA)
 * by adding an opacity value.
 *
 * @param hex - Hex color code in the format #RRGGBB
 * @param opacity - Opacity value between 0 (transparent) and 1 (opaque)
 * @returns Hex color with alpha channel (#RRGGBBAA)
 *
 * @example
 * addOpacityToHex("#ff0000", 0.5) // "#ff000080"
 * addOpacityToHex("#00ff00", 1)   // "#00ff00ff"
 */
export const addOpacityToHex = (hex: string, opacity: number): string => {
  if (!hex || hex.length !== 7 || hex[0] !== '#') return hex;

  // Convert opacity (0–1) to 0–255 and then to hex string
  const alpha = Math.round(opacity * 255);
  const alphaHex = alpha.toString(16).padStart(2, '0');

  return hex + alphaHex;
};
