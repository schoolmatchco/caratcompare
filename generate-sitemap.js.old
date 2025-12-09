const fs = require('fs');

const carats = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75, 4.00];
const shapes = ['round', 'princess', 'cushion', 'emerald', 'asscher', 'oval', 'pear', 'marquise', 'radiant', 'heart'];
const popularCarats = [0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00, 2.50, 3.00];
const elongatedShapes = ['oval', 'pear', 'emerald', 'marquise', 'radiant'];
const milestoneCarats = [1.00, 1.50, 2.00, 2.50, 3.00, 4.00];

const baseUrl = 'https://caratcompare.co';
const urls = [];

// Helper: Format carat for URL (remove trailing zeros)
function formatCarat(c) {
  return c % 1 === 0 ? c.toString() : c.toFixed(2).replace(/\.?0+$/, '');
}

// Helper: Generate comparison slug
function generateSlug(c1, s1, c2, s2) {
  return `${formatCarat(c1)}-${s1}-vs-${formatCarat(c2)}-${s2}`;
}

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
      urls.push({ url: `${baseUrl}/compare/${generateSlug(c1, 'round', c2, 'round')}`, priority: 0.9 });
    }
  });
  shapes.forEach(shape => {
    if (shape !== 'round') {
      urls.push({ url: `${baseUrl}/compare/${generateSlug(c1, 'round', c1, shape)}`, priority: 0.9 });
    }
  });
});

// Tier 2: Cross-shape popular comparisons (360 URLs)
popularCarats.forEach(c1 => {
  shapes.forEach(s1 => {
    shapes.forEach(s2 => {
      if (shouldInclude(c1, s1, c1, s2)) {
        urls.push({ url: `${baseUrl}/compare/${generateSlug(c1, s1, c1, s2)}`, priority: 0.8 });
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
          urls.push({ url: `${baseUrl}/compare/${generateSlug(c1, s1, c2, s2)}`, priority: 0.8 });
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
        urls.push({ url: `${baseUrl}/compare/${generateSlug(c, s1, c, s2)}`, priority: 0.7 });
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
          urls.push({ url: `${baseUrl}/compare/${generateSlug(c1, s1, c2, s2)}`, priority: 0.7 });
        }
      });
    });
  });
});

// Remove duplicates
const uniqueUrls = Array.from(new Set(urls.map(u => u.url))).map(url => {
  return urls.find(u => u.url === url);
});

// Limit to 1200 comparison URLs (take highest priority first)
const finalUrls = uniqueUrls
  .sort((a, b) => b.priority - a.priority)
  .slice(0, 1200);

// Add shape hub pages (10 pages, priority 0.85)
shapes.forEach(shape => {
  finalUrls.push({ url: `${baseUrl}/${shape}`, priority: 0.85 });
});

// Add carat hub pages (16 pages, priority 0.85)
carats.forEach(carat => {
  finalUrls.push({ url: `${baseUrl}/carat/${formatCarat(carat)}`, priority: 0.85 });
});

// Generate sitemap.xml (no need to escape - clean URLs have no special chars)
const sitemapUrls = finalUrls.map(({ url, priority }) =>
  `  <url>
    <loc>${url}</loc>
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
console.log(`  - Comparison Pages (Tier 1, Priority 0.9): ${finalUrls.filter(u => u.priority === 0.9).length}`);
console.log(`  - Hub Pages (Shape + Carat, Priority 0.85): ${finalUrls.filter(u => u.priority === 0.85).length}`);
console.log(`  - Comparison Pages (Tier 2, Priority 0.8): ${finalUrls.filter(u => u.priority === 0.8).length}`);
console.log(`  - Comparison Pages (Tier 3/4, Priority 0.7): ${finalUrls.filter(u => u.priority === 0.7).length}`);
