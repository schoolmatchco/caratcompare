// Generate unique SEO-optimized text for diamond comparisons
import diamondSizes from '@/data/diamond-sizes.json';
import { Shape, capitalize } from './urlHelpers';

interface DiamondDimensions {
  width: number;
  height: number;
}

/**
 * Get diamond dimensions from the verified data
 * @param shape - Diamond shape
 * @param carat - Carat weight
 * @returns Dimensions or null if not found
 */
function getDimensions(shape: Shape, carat: number): DiamondDimensions | null {
  const caratKey = carat.toFixed(2);
  const shapeData = diamondSizes[shape as keyof typeof diamondSizes];

  if (!shapeData || !shapeData[caratKey as keyof typeof shapeData]) {
    return null;
  }

  const dims = shapeData[caratKey as keyof typeof shapeData] as DiamondDimensions;
  return dims;
}

/**
 * Calculate face-up surface area based on shape geometry
 * @param shape - Diamond shape
 * @param dim - Dimensions (width x height in mm)
 * @returns Surface area in mm²
 */
function calculateFaceUpArea(shape: Shape, dim: DiamondDimensions): number {
  const { width, height } = dim;

  switch (shape) {
    case 'round':
      // Circle area: πr²
      return Math.PI * Math.pow(width / 2, 2);

    case 'oval':
    case 'marquise':
    case 'pear':
      // Ellipse area approximation: π * a * b
      return Math.PI * (width / 2) * (height / 2);

    case 'princess':
    case 'asscher':
    case 'cushion':
    case 'radiant':
    case 'emerald':
      // Rectangle/Square area (slightly overestimates for cut corners, but better for visual footprint)
      return width * height;

    case 'heart':
      // Heart shape is roughly 85% of bounding box
      return width * height * 0.85;

    default:
      return width * height;
  }
}

/**
 * Get shape-specific description
 * @param shape - Diamond shape
 * @returns Description text
 */
function getShapeDescription(shape: Shape): string {
  const descriptions: Record<Shape, string> = {
    round: 'classic round brilliant cut',
    oval: 'elegant elongated oval',
    princess: 'modern square princess cut',
    cushion: 'romantic cushion cut with rounded corners',
    emerald: 'sophisticated emerald cut with step facets',
    asscher: 'vintage square asscher cut',
    radiant: 'brilliant radiant cut',
    pear: 'distinctive teardrop pear shape',
    marquise: 'dramatic elongated marquise',
    heart: 'romantic heart shape',
  };

  return descriptions[shape] || shape;
}

/**
 * Generate unique comparison text for SEO (plain text, no markdown)
 * @param carat1 - First diamond carat
 * @param shape1 - First diamond shape
 * @param carat2 - Second diamond carat
 * @param shape2 - Second diamond shape
 * @returns Plain text comparison (no markdown formatting)
 */
export function generateComparisonText(
  carat1: number,
  shape1: Shape,
  carat2: number,
  shape2: Shape
): string {
  // Get dimensions
  const d1 = getDimensions(shape1, carat1);
  const d2 = getDimensions(shape2, carat2);

  if (!d1 || !d2) {
    return `Compare a ${carat1} carat ${shape1} diamond to a ${carat2} carat ${shape2} diamond using our visual comparison tool.`;
  }

  // Calculate areas
  const area1 = calculateFaceUpArea(shape1, d1);
  const area2 = calculateFaceUpArea(shape2, d2);

  // Determine which is larger
  const areaDiff = Math.abs(area1 - area2);
  const percentDiff = ((areaDiff / Math.min(area1, area2)) * 100).toFixed(0);
  const largerDiamond = area1 > area2 ? { carat: carat1, shape: shape1, dims: d1, area: area1 } : { carat: carat2, shape: shape2, dims: d2, area: area2 };
  const smallerDiamond = area1 > area2 ? { carat: carat2, shape: shape2, dims: d2, area: area2 } : { carat: carat1, shape: shape1, dims: d1, area: area1 };

  const isSameShape = shape1 === shape2;
  const isSameCarat = carat1 === carat2;

  // Start building the text
  let text = '';

  // Opening paragraph
  if (isSameShape && isSameCarat) {
    text += `When comparing a ${carat1} carat ${capitalize(shape1)} to a ${carat2} carat ${capitalize(shape2)}, they are identical in both weight and dimensions. `;
  } else if (parseInt(percentDiff) < 5) {
    text += `When comparing a ${carat1} carat ${capitalize(shape1)} to a ${carat2} carat ${capitalize(shape2)}, the visual size difference is minimal. Both diamonds occupy nearly the same surface area (within ${percentDiff}%), making them appear almost identical when viewed face-up. `;
  } else {
    text += `When comparing a ${carat1} carat ${capitalize(shape1)} to a ${carat2} carat ${capitalize(shape2)}, the ${largerDiamond.carat} carat ${capitalize(largerDiamond.shape)} appears visually larger. It has a face-up surface area that is approximately ${percentDiff}% larger than the ${smallerDiamond.carat} carat ${capitalize(smallerDiamond.shape)}. `;
  }

  // Dimension details
  if (!isSameShape && parseInt(percentDiff) > 5) {
    const longerDiamond = d1.width > d2.width ? { dims: d1, shape: shape1, carat: carat1 } : { dims: d2, shape: shape2, carat: carat2 };
    const shorterDiamond = d1.width > d2.width ? { dims: d2, shape: shape2, carat: carat2 } : { dims: d1, shape: shape1, carat: carat1 };

    if (longerDiamond.dims.width > shorterDiamond.dims.width * 1.15) {
      text += `The ${getShapeDescription(longerDiamond.shape)} measures ${longerDiamond.dims.width}mm in length, creating a more elongated appearance compared to the ${getShapeDescription(shorterDiamond.shape)} at ${shorterDiamond.dims.width}mm. `;
    }
  } else if (isSameShape && !isSameCarat) {
    const mmDiff = Math.abs(largerDiamond.dims.width - smallerDiamond.dims.width).toFixed(1);
    text += `You gain approximately ${mmDiff}mm in width by choosing the ${largerDiamond.carat} carat ${capitalize(largerDiamond.shape)} over the ${smallerDiamond.carat} carat version. `;
  }

  // Specific measurements paragraph
  text += `\n\nDetailed Measurements:\n\n`;
  text += `The ${carat1} carat ${shape1} diamond measures ${d1.width}mm × ${d1.height}mm, `;
  text += `while the ${carat2} carat ${shape2} measures ${d2.width}mm × ${d2.height}mm. `;

  // Finger coverage (based on average size 6.5 finger = 17mm width)
  const avgFingerWidth = 17; // mm
  const coverage1 = (Math.max(d1.width, d1.height) / avgFingerWidth) * 100;
  const coverage2 = (Math.max(d2.width, d2.height) / avgFingerWidth) * 100;
  const maxCoverage = Math.max(coverage1, coverage2);
  const coveredDiamond = coverage1 > coverage2 ? { carat: carat1, shape: shape1 } : { carat: carat2, shape: shape2 };

  if (maxCoverage > 40) {
    text += `The ${coveredDiamond.carat} carat ${coveredDiamond.shape} covers approximately ${maxCoverage.toFixed(0)}% of the width of an average finger (size 6.5), creating a substantial, eye-catching presence.`;
  } else if (maxCoverage > 25) {
    text += `On an average finger (size 6.5), this diamond occupies about ${maxCoverage.toFixed(0)}% of the finger width, offering a balanced and elegant look.`;
  } else {
    text += `This diamond creates a delicate appearance, covering about ${maxCoverage.toFixed(0)}% of an average finger width (size 6.5).`;
  }

  // Shopping guidance paragraph
  text += `\n\nShopping Considerations:\n\n`;

  if (!isSameShape) {
    text += `Beyond size, consider that ${shape1} diamonds tend to have different brilliance patterns compared to ${shape2} cuts. `;
  }

  text += `Use the interactive visual tool above to see these diamonds side-by-side with a US dime for real-world scale reference. The measurements shown are based on well-cut diamonds with standard proportions.`;

  return text;
}

/**
 * Generate short meta description for SEO
 * @param carat1 - First diamond carat
 * @param shape1 - First diamond shape
 * @param carat2 - Second diamond carat
 * @param shape2 - Second diamond shape
 * @returns Meta description (under 160 characters)
 */
export function generateMetaDescription(
  carat1: number,
  shape1: Shape,
  carat2: number,
  shape2: Shape
): string {
  const d1 = getDimensions(shape1, carat1);
  const d2 = getDimensions(shape2, carat2);

  if (!d1 || !d2) {
    return `Compare ${carat1}ct ${shape1} vs ${carat2}ct ${shape2} diamonds. See actual size differences with our visual comparison tool.`;
  }

  const area1 = calculateFaceUpArea(shape1, d1);
  const area2 = calculateFaceUpArea(shape2, d2);
  const percentDiff = (Math.abs(area1 - area2) / Math.min(area1, area2) * 100).toFixed(0);
  const larger = area1 > area2 ? `${carat1}ct ${shape1}` : `${carat2}ct ${shape2}`;

  return `Compare ${carat1}ct ${shape1} vs ${carat2}ct ${shape2}. The ${larger} is ${percentDiff}% larger. See actual size with measurements.`;
}
