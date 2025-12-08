const fs = require('fs');

const carats = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75, 4.00];
const shapes = ['round', 'princess', 'cushion', 'emerald', 'asscher', 'oval', 'pear', 'marquise', 'radiant', 'heart'];
const popularCarats = [0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00, 2.50, 3.00];
const elongatedShapes = ['oval', 'pear', 'emerald', 'marquise', 'radiant'];
const milestoneCarats = [1.00, 1.50, 2.00, 2.50, 3.00, 4.00];

const baseUrl = 'https://caratcompare.co';
const urls = [];

// Helper: Canonicalize URL (ensure carat1 <= carat2, or if equal, shape1 <= shape2 alphabetically)
function shouldInclude(carat1, shape1, carat2, shape2) {
  if (carat1 < carat2) return true;
  if (carat1 === carat2 && shape1 < shape2) return true;
  return false;
}

// Tier 1: Round comparisons (240 URLs)
popularCarats.forEach(c1 => {
  popularCarats.forEach(c2 => {
    if (shouldInclude(c1, 'round', c2, 'round')) {
      urls.push({ url: `${baseUrl}/?carat1=${c1}&shape1=round&carat2=${c2}&shape2=round`, priority: 0.9 });
    }
  });
  shapes.forEach(shape => {
    if (shape !== 'round') {
      urls.push({ url: `${baseUrl}/?carat1=${c1}&shape1=round&carat2=${c1}&shape2=${shape}`, priority: 0.9 });
    }
  });
});

// Tier 2: Cross-shape popular comparisons (360 URLs)
popularCarats.forEach(c1 => {
  shapes.forEach(s1 => {
    shapes.forEach(s2 => {
      if (shouldInclude(c1, s1, c1, s2)) {
        urls.push({ url: `${baseUrl}/?carat1=${c1}&shape1=${s1}&carat2=${c1}&shape2=${s2}`, priority: 0.8 });
      }
    });
  });
});

// Adjacent carat comparisons
popularCarats.forEach((c1, i) => {
  if (i < popularCarats.length - 1) {
    const c2 = popularCarats[i + 1];
    shapes.forEach(s1 => {
      shapes.forEach(s2 => {
        if (s1 !== s2) {
          urls.push({ url: `${baseUrl}/?carat1=${c1}&shape1=${s1}&carat2=${c2}&shape2=${s2}`, priority: 0.8 });
        }
      });
    });
  }
});

// Tier 3: Elongated shape comparisons (200 URLs)
const popularCaratsForElongated = [0.75, 1.00, 1.25, 1.50, 2.00, 2.50, 3.00];
popularCaratsForElongated.forEach(c => {
  elongatedShapes.forEach(s1 => {
    elongatedShapes.forEach(s2 => {
      if (shouldInclude(c, s1, c, s2)) {
        urls.push({ url: `${baseUrl}/?carat1=${c}&shape1=${s1}&carat2=${c}&shape2=${s2}`, priority: 0.7 });
      }
    });
  });
});

// Tier 4: Milestone carat comparisons (400 URLs)
milestoneCarats.forEach(c1 => {
  milestoneCarats.forEach(c2 => {
    shapes.forEach(s1 => {
      shapes.forEach(s2 => {
        if (shouldInclude(c1, s1, c2, s2) && !(c1 === c2 && s1 === s2)) {
          urls.push({ url: `${baseUrl}/?carat1=${c1}&shape1=${s1}&carat2=${c2}&shape2=${s2}`, priority: 0.7 });
        }
      });
    });
  });
});

// Remove duplicates
const uniqueUrls = Array.from(new Set(urls.map(u => u.url))).map(url => {
  return urls.find(u => u.url === url);
});

// Limit to 1200 URLs (take highest priority first)
const finalUrls = uniqueUrls
  .sort((a, b) => b.priority - a.priority)
  .slice(0, 1200);

// Generate sitemap.xml (escape & as &amp; for valid XML)
const escapeXml = (url) => url.replace(/&/g, '&amp;');

const sitemapUrls = finalUrls.map(({ url, priority }) =>
  `  <url>
    <loc>${escapeXml(url)}</loc>
    <priority>${priority}</priority>
    <changefreq>monthly</changefreq>
  </url>`
).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
${sitemapUrls}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log(`✓ Generated sitemap.xml with ${finalUrls.length + 1} URLs`);
console.log(`  - Homepage: 1`);
console.log(`  - Tier 1 (Priority 0.9): ${finalUrls.filter(u => u.priority === 0.9).length}`);
console.log(`  - Tier 2 (Priority 0.8): ${finalUrls.filter(u => u.priority === 0.8).length}`);
console.log(`  - Tier 3/4 (Priority 0.7): ${finalUrls.filter(u => u.priority === 0.7).length}`);
