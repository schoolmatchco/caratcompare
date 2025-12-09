import { MetadataRoute } from 'next';
import { generateAllComparisonSlugs } from '@/lib/generateStaticParams';
import { VALID_SHAPES, VALID_CARATS } from '@/lib/urlHelpers';

const SITE_URL = 'https://caratcompare.co';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Homepage (highest priority)
  const homepage: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
  ];

  // Shape hub pages (10 pages)
  const shapePages: MetadataRoute.Sitemap = VALID_SHAPES.map((shape) => ({
    url: `${SITE_URL}/${shape}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // Carat hub pages (16 pages)
  const caratPages: MetadataRoute.Sitemap = VALID_CARATS.map((carat) => ({
    url: `${SITE_URL}/carat/${carat}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // Comparison pages (1,200 pages)
  const comparisonSlugs = generateAllComparisonSlugs();
  const comparisonPages: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => {
    // Determine priority based on content
    let priority = 0.7;

    // High priority for round comparisons
    if (slug.includes('round')) {
      priority = 0.8;
    }

    // Very high priority for popular carat weights (0.5, 1.0, 1.5, 2.0)
    if (
      slug.includes('0.5-') ||
      slug.includes('-0.5') ||
      slug.includes('1-') ||
      slug.includes('-1-') ||
      slug.includes('1.5-') ||
      slug.includes('-1.5') ||
      slug.includes('2-') ||
      slug.includes('-2-')
    ) {
      priority = Math.min(priority + 0.1, 0.9);
    }

    return {
      url: `${SITE_URL}/compare/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority,
    };
  });

  // Combine all pages
  return [...homepage, ...shapePages, ...caratPages, ...comparisonPages];
}
