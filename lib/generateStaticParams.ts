// Generate static params for Next.js static site generation
// Uses same prioritization logic as sitemap generator

import { generateComparisonSlug, VALID_SHAPES, VALID_CARATS } from './urlHelpers';

const shapes = VALID_SHAPES;
const carats = VALID_CARATS;
const popularCarats = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];
const elongatedShapes = ['oval', 'pear', 'emerald', 'marquise', 'radiant'];
const milestoneCarats = [1.0, 1.5, 2.0, 2.5, 3.0, 4.0];

// Helper: Should we include this comparison?
function shouldInclude(carat1: number, shape1: string, carat2: number, shape2: string): boolean {
  if (carat1 < carat2) return true;
  if (carat1 === carat2 && shape1 < shape2) return true;
  return false;
}

/**
 * Generate all comparison slugs for static site generation
 * Returns array of slugs matching sitemap.xml priorities
 */
export function generateAllComparisonSlugs(): string[] {
  const slugs: string[] = [];

  // Tier 1: Round comparisons (Priority 0.9)
  popularCarats.forEach((c1) => {
    popularCarats.forEach((c2) => {
      if (shouldInclude(c1, 'round', c2, 'round')) {
        slugs.push(generateComparisonSlug(c1, 'round', c2, 'round'));
      }
    });
    shapes.forEach((shape) => {
      if (shape !== 'round') {
        slugs.push(generateComparisonSlug(c1, 'round', c1, shape));
      }
    });
  });

  // Tier 2: Cross-shape popular comparisons (Priority 0.8)
  popularCarats.forEach((c1) => {
    shapes.forEach((s1) => {
      shapes.forEach((s2) => {
        if (shouldInclude(c1, s1, c1, s2)) {
          slugs.push(generateComparisonSlug(c1, s1, c1, s2));
        }
      });
    });
  });

  // Adjacent carat comparisons
  popularCarats.forEach((c1, i) => {
    if (i < popularCarats.length - 1) {
      const c2 = popularCarats[i + 1];
      shapes.forEach((s1) => {
        shapes.forEach((s2) => {
          if (s1 !== s2) {
            slugs.push(generateComparisonSlug(c1, s1, c2, s2));
          }
        });
      });
    }
  });

  // Tier 3: Elongated shape comparisons (Priority 0.7)
  const popularCaratsForElongated = [0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0];
  popularCaratsForElongated.forEach((c) => {
    elongatedShapes.forEach((s1) => {
      elongatedShapes.forEach((s2) => {
        if (shouldInclude(c, s1, c, s2)) {
          slugs.push(generateComparisonSlug(c, s1, c, s2));
        }
      });
    });
  });

  // Tier 4: Milestone carat comparisons (Priority 0.7)
  milestoneCarats.forEach((c1) => {
    milestoneCarats.forEach((c2) => {
      shapes.forEach((s1) => {
        shapes.forEach((s2) => {
          if (shouldInclude(c1, s1, c2, s2) && !(c1 === c2 && s1 === s2)) {
            slugs.push(generateComparisonSlug(c1, s1, c2, s2));
          }
        });
      });
    });
  });

  // Remove duplicates and limit to 1200
  const uniqueSlugs = Array.from(new Set(slugs));
  return uniqueSlugs.slice(0, 1200);
}

/**
 * Generate params in Next.js format for generateStaticParams
 */
export function generateComparisonStaticParams() {
  const slugs = generateAllComparisonSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

/**
 * Generate shape hub static params
 */
export function generateShapeStaticParams() {
  return shapes.map((shape) => ({
    shape: shape,
  }));
}

/**
 * Generate carat hub static params
 */
export function generateCaratStaticParams() {
  return carats.map((carat) => ({
    carat: carat.toString(),
  }));
}
