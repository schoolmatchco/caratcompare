import { generateAllComparisonSlugs } from '@/lib/generateStaticParams';
import { VALID_SHAPES, VALID_CARATS } from '@/lib/urlHelpers';

const SITE_URL = 'https://www.caratcompare.co';

export async function GET() {
  const currentDate = new Date().toISOString();

  // Generate all URLs
  const urls: string[] = [];

  // Homepage
  urls.push(generateUrlEntry(SITE_URL, currentDate, 'monthly', 1.0));

  // Shape hub pages
  VALID_SHAPES.forEach((shape) => {
    urls.push(generateUrlEntry(`${SITE_URL}/${shape}`, currentDate, 'monthly', 0.9));
  });

  // Carat hub pages
  VALID_CARATS.forEach((carat) => {
    urls.push(generateUrlEntry(`${SITE_URL}/carat/${carat}`, currentDate, 'monthly', 0.9));
  });

  // Comparison pages
  const comparisonSlugs = generateAllComparisonSlugs();
  comparisonSlugs.forEach((slug) => {
    let priority = 0.7;
    if (slug.includes('round')) priority = 0.8;
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
    urls.push(generateUrlEntry(`${SITE_URL}/compare/${slug}`, currentDate, 'monthly', priority));
  });

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

function generateUrlEntry(
  url: string,
  lastmod: string,
  changefreq: string,
  priority: number
): string {
  return `<url>
<loc>${url}</loc>
<lastmod>${lastmod}</lastmod>
<changefreq>${changefreq}</changefreq>
<priority>${priority}</priority>
</url>`;
}
