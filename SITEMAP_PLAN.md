# Carat Compare - Sitemap Generation Plan

## Current Diamond Dimensions Database

All dimensions verified against 11+ industry sources (GIA, Blue Nile, James Allen, etc.)

### Data Structure
- **Total data points:** 160 (16 carat weights × 10 shapes)
- **Carat range:** 0.25 to 4.00 in 0.25 increments
- **Shapes:** Round, Princess, Cushion, Emerald, Asscher, Oval, Pear, Marquise, Radiant, Heart
- **Scale factor:** 5× (all diamonds and 17.9mm dime reference)

### Complete Dimensions Table

| Carat | Round | Princess | Cushion | Emerald | Asscher | Oval | Pear | Marquise | Radiant | Heart |
|-------|-------|----------|---------|---------|---------|------|------|----------|---------|-------|
| 0.25 | 4.1×4.1 | 3.4×3.4 | 3.6×3.6 | 4.2×3.1 | 3.4×3.4 | 4.5×3.2 | 5.0×3.2 | 5.5×3.0 | 3.8×3.0 | 4.0×4.0 |
| 0.50 | 5.1×5.1 | 4.4×4.4 | 4.9×4.9 | 5.3×3.9 | 4.4×4.4 | 6.0×4.2 | 6.4×4.1 | 8.0×4.0 | 5.3×4.1 | 5.0×5.0 |
| 0.75 | 5.8×5.8 | 5.0×5.0 | 5.25×5.25 | 6.1×4.5 | 5.0×5.0 | 7.0×5.0 | 7.6×4.8 | 9.0×4.5 | 6.0×4.7 | 5.8×5.8 |
| 1.00 | 6.5×6.5 | 5.5×5.5 | 5.5×5.5 | 6.7×5.0 | 5.5×5.5 | 7.7×5.7 | 8.6×5.6 | 10.0×5.0 | 6.5×5.1 | 6.5×6.5 |
| 1.25 | 6.8×6.8 | 6.0×6.0 | 6.0×6.0 | 7.2×5.3 | 6.0×6.0 | 8.2×6.0 | 9.2×6.0 | 11.0×5.5 | 6.7×5.4 | 6.8×6.8 |
| 1.50 | 7.4×7.4 | 6.4×6.4 | 6.5×6.5 | 7.65×5.7 | 6.4×6.4 | 8.8×6.4 | 10.0×6.6 | 12.0×6.0 | 7.1×5.7 | 7.4×7.4 |
| 1.75 | 7.8×7.8 | 6.8×6.8 | 6.9×6.9 | 8.05×6.0 | 6.8×6.8 | 9.3×6.6 | 10.3×6.9 | 12.5×6.2 | 7.5×6.0 | 7.8×7.8 |
| 2.00 | 8.2×8.2 | 7.0×7.0 | 7.0×7.0 | 8.4×6.2 | 7.0×7.0 | 9.6×7.1 | 10.8×7.1 | 13.0×6.5 | 7.8×6.3 | 8.2×8.2 |
| 2.25 | 8.5×8.5 | 7.3×7.3 | 7.4×7.4 | 8.75×6.5 | 7.3×7.3 | 10.1×7.4 | 11.2×7.4 | 13.5×6.8 | 8.1×6.5 | 8.5×8.5 |
| 2.50 | 8.8×8.8 | 7.5×7.5 | 7.7×7.7 | 9.1×6.7 | 7.5×7.5 | 10.5×7.8 | 11.6×7.6 | 14.0×7.0 | 8.4×6.7 | 8.8×8.8 |
| 2.75 | 9.1×9.1 | 7.8×7.8 | 7.9×7.9 | 9.35×6.9 | 7.8×7.8 | 10.8×8.0 | 12.0×7.8 | 14.5×7.2 | 8.6×6.9 | 9.1×9.1 |
| 3.00 | 9.4×9.4 | 8.0×8.0 | 8.0×8.0 | 9.65×7.1 | 8.0×8.0 | 11.2×8.3 | 12.3×8.1 | 15.0×7.5 | 8.8×7.0 | 9.4×9.4 |
| 3.25 | 9.7×9.7 | 8.2×8.2 | 8.2×8.2 | 9.9×7.3 | 8.2×8.2 | 11.5×8.5 | 12.6×8.3 | 15.5×7.7 | 9.0×7.2 | 9.7×9.7 |
| 3.50 | 9.9×9.9 | 8.4×8.4 | 8.5×8.5 | 10.15×7.5 | 8.4×8.4 | 11.8×8.7 | 12.9×8.5 | 16.0×8.0 | 9.2×7.4 | 9.9×9.9 |
| 3.75 | 10.1×10.1 | 8.6×8.6 | 8.7×8.7 | 10.4×7.7 | 8.6×8.6 | 12.1×8.9 | 13.2×8.7 | 16.5×8.2 | 9.4×7.6 | 10.1×10.1 |
| 4.00 | 10.3×10.3 | 8.7×8.7 | 8.9×8.9 | 10.6×7.9 | 8.7×8.7 | 12.4×9.1 | 13.5×8.9 | 16.8×8.3 | 9.6×7.8 | 10.3×10.3 |

**Note:** Format is width×height in millimeters. Elongated shapes (emerald, oval, pear, marquise, radiant) are rotated 90° in the UI to display longest dimension horizontally.

---

## Sitemap Generation Strategy

### Total Possible URLs
- **All combinations:** 16 carats × 10 shapes × 16 carats × 10 shapes = 25,600 URLs
- **Target:** ~1,200 high-priority URLs (most searched/valuable comparisons)

### URL Structure
```
https://caratcompare.co/?carat1={carat}&shape1={shape}&carat2={carat}&shape2={shape}
```

Example: `https://caratcompare.co/?carat1=1.0&shape1=round&carat2=1.5&shape2=oval`

---

## Prioritization Strategy

### Tier 1: Popular Round Comparisons (240 URLs)
**Rationale:** Round is 50% of all diamond purchases
- Round vs Round: all carat combinations where carat1 < carat2
- Popular sizes: 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0
- Example: 1.0ct Round vs 1.5ct Round

**Generated URLs:** 9 carats × 8 comparisons each = 72 URLs
Then add Round vs other shapes for these 9 popular carats = 9 × 9 shapes × 2 = 162 URLs
**Subtotal: ~240 URLs**

### Tier 2: Cross-Shape Popular Comparisons (360 URLs)
**Rationale:** Users often compare different shapes at same/similar carats
- Same carat, different shapes (e.g., 1.0ct Round vs 1.0ct Oval)
- Adjacent carats, different shapes (e.g., 1.0ct Round vs 1.25ct Princess)
- Focus on 9 most popular carats: 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0

**Combinations:**
- Same carat: 9 carats × 45 shape pairs = 405 URLs (reduce to top 200)
- Adjacent carats: ~160 URLs

**Subtotal: ~360 URLs**

### Tier 3: Elongated Shape Comparisons (200 URLs)
**Rationale:** Oval, pear, emerald, marquise growing in popularity
- Oval vs Pear, Oval vs Marquise, Emerald vs Radiant
- Popular carats only: 0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0

**Subtotal: ~200 URLs**

### Tier 4: Whole Carat Milestones (400 URLs)
**Rationale:** Psychological pricing points
- Focus on: 1.0, 1.5, 2.0, 2.5, 3.0, 4.0 carats
- All shape combinations for these 6 carats
- 6 carats × 10 shapes × 10 shapes = 600 URLs (reduce to top 400)

**Subtotal: ~400 URLs**

---

## Final Sitemap Breakdown

| Priority | Category | Count | Rationale |
|----------|----------|-------|-----------|
| Highest | Round comparisons | 240 | 50% of market |
| High | Cross-shape popular carats | 360 | High search intent |
| Medium | Elongated shapes | 200 | Growing trend |
| Medium | Milestone carats | 400 | Price anchoring |
| **TOTAL** | | **1,200** | **Optimized for SEO** |

---

## Implementation Plan

### 1. Generate sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://caratcompare.co/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://caratcompare.co/?carat1=1.0&shape1=round&carat2=1.5&shape2=round</loc>
    <priority>0.9</priority>
    <changefreq>monthly</changefreq>
  </url>
  <!-- ... 1,200 high-priority URLs -->
</urlset>
```

### 2. Priority Scores
- Homepage: 1.0
- Tier 1 (Round): 0.9
- Tier 2 (Cross-shape): 0.8
- Tier 3 (Elongated): 0.7
- Tier 4 (Milestones): 0.7

### 3. Change Frequency
- Homepage: weekly
- All comparison pages: monthly

---

## SEO Considerations

### Title Tag Pattern
```
{carat1} Carat {Shape1} vs {carat2} Carat {Shape2} | Diamond Size Comparison
```
Example: "1.0 Carat Round vs 1.5 Carat Oval | Diamond Size Comparison"

### Meta Description Pattern
```
Compare {carat1}ct {shape1} vs {carat2}ct {shape2} diamonds. See actual size differences with accurate measurements. Shop from Blue Nile, James Allen & Brilliant Earth.
```

### URL Canonicalization
- Ensure carat1 ≤ carat2 OR shape1 < shape2 alphabetically
- This prevents duplicate content (1.0 round vs 1.5 oval = 1.5 oval vs 1.0 round)

---

## Validation Checklist

- [ ] All dimensions accurate (verified against 11+ sources)
- [ ] Scale factor consistent (5× for all elements)
- [ ] Elongated shapes properly oriented (longest dimension horizontal)
- [ ] Carat increments constrained (0.25 steps only)
- [ ] URL validation (snap invalid params to nearest valid value)
- [ ] 1,200 URLs cover 80%+ of search demand
- [ ] No duplicate content (proper canonicalization)
- [ ] Sitemap.xml follows protocol standards

---

## Questions for Validation

1. **Dimension accuracy:** Are all 160 data points verified and trustworthy?
2. **Prioritization:** Does the 1,200 URL strategy capture the right comparisons?
3. **SEO optimization:** Any missing considerations for title tags, meta descriptions, or canonicalization?
4. **Scale factor:** Is 5× the right multiplier for visual accuracy?
5. **Alternative approaches:** Should we generate all 25,600 URLs or stick with prioritized 1,200?

---

**Generated:** 2025-12-08
**Status:** Ready for review and validation
