// URL parsing and generation utilities for clean SEO-friendly URLs

export const VALID_SHAPES = [
  'round',
  'princess',
  'cushion',
  'emerald',
  'asscher',
  'oval',
  'pear',
  'marquise',
  'radiant',
  'heart',
] as const;

export type Shape = typeof VALID_SHAPES[number];

export const VALID_CARATS = [
  0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5,
  3.75, 4.0,
];

// Regex to parse: "0.5-round-vs-1-oval"
// Captures: Group 1 (Size1), Group 2 (Shape1), Group 3 (Size2), Group 4 (Shape2)
const SLUG_REGEX = /^([\d\.]+)-([a-z]+)-vs-([\d\.]+)-([a-z]+)$/;

export interface ComparisonData {
  carat1: number;
  shape1: Shape;
  carat2: number;
  shape2: Shape;
}

/**
 * Parse a comparison slug into structured data
 * @param slug - URL slug like "0.5-round-vs-1-oval"
 * @returns Parsed data or null if invalid
 */
export function parseComparisonSlug(slug: string): ComparisonData | null {
  const match = slug.match(SLUG_REGEX);

  if (!match) return null;

  const [, carat1Raw, shape1Raw, carat2Raw, shape2Raw] = match;

  // Validate shapes
  if (
    !VALID_SHAPES.includes(shape1Raw as Shape) ||
    !VALID_SHAPES.includes(shape2Raw as Shape)
  ) {
    return null;
  }

  // Parse carats
  const carat1 = parseFloat(carat1Raw);
  const carat2 = parseFloat(carat2Raw);

  if (isNaN(carat1) || isNaN(carat2)) return null;

  // Validate carat ranges (0.25 to 4.0)
  if (carat1 < 0.25 || carat1 > 4.0 || carat2 < 0.25 || carat2 > 4.0) {
    return null;
  }

  return {
    carat1,
    shape1: shape1Raw as Shape,
    carat2,
    shape2: shape2Raw as Shape,
  };
}

/**
 * Generate a comparison slug from carat and shape data
 * @param carat1 - First diamond carat weight
 * @param shape1 - First diamond shape
 * @param carat2 - Second diamond carat weight
 * @param shape2 - Second diamond shape
 * @returns URL slug like "0.5-round-vs-1-oval"
 */
export function generateComparisonSlug(
  carat1: number,
  shape1: string,
  carat2: number,
  shape2: string
): string {
  // Format carats: remove trailing zeros (1.0 -> 1, 0.5 -> 0.5)
  const formatCarat = (c: number) => {
    return c % 1 === 0 ? c.toString() : c.toFixed(2).replace(/\.?0+$/, '');
  };

  return `${formatCarat(carat1)}-${shape1}-vs-${formatCarat(carat2)}-${shape2}`;
}

/**
 * Convert query parameters to comparison slug
 * @param params - URLSearchParams or query object
 * @returns Comparison slug or null if invalid
 */
export function queryParamsToSlug(params: URLSearchParams): string | null {
  const carat1 = parseFloat(params.get('carat1') || '');
  const shape1 = params.get('shape1') || '';
  const carat2 = parseFloat(params.get('carat2') || '');
  const shape2 = params.get('shape2') || '';

  if (
    isNaN(carat1) ||
    isNaN(carat2) ||
    !VALID_SHAPES.includes(shape1 as Shape) ||
    !VALID_SHAPES.includes(shape2 as Shape)
  ) {
    return null;
  }

  return generateComparisonSlug(carat1, shape1, carat2, shape2);
}

/**
 * Normalize carat to valid increment (0.25 steps)
 * @param carat - Raw carat value
 * @returns Nearest valid carat weight
 */
export function normalizeCaratToValidIncrement(carat: number): number {
  const clamped = Math.max(0.25, Math.min(4.0, carat));
  return VALID_CARATS.reduce((prev, curr) =>
    Math.abs(curr - clamped) < Math.abs(prev - clamped) ? curr : prev
  );
}

/**
 * Capitalize first letter of a string
 * @param str - Input string
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format carat for display (remove trailing zeros)
 * @param carat - Carat weight
 * @returns Formatted string
 */
export function formatCaratForDisplay(carat: number): string {
  return carat % 1 === 0 ? carat.toString() : carat.toFixed(2).replace(/\.?0+$/, '');
}
