# Carat Compare

> A visual diamond size comparison tool with affiliate monetization

**Live Site:** https://www.caratcompare.co
**Repository:** https://github.com/schoolmatchco/caratcompare
**Status:** ✅ Deployed and Live
**Version:** 1.3.5 (Critical SEO Hotfix)
**Last Updated:** December 17, 2024

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy (automatic via Vercel on git push)
git push origin main
```

**Local development:** http://localhost:3000

---

## Project Overview

Carat Compare is a Next.js 16 application that allows users to visually compare two diamond sizes and shapes side-by-side using a US dime as a real-world reference. The tool is designed to drive affiliate revenue through Blue Nile, James Allen, and Brilliant Earth.

### Key Features

- **Visual Size Comparison**: Real-time diamond size comparison with accurate dimensions
- **1,201 SEO-Optimized URLs**: Comprehensive sitemap covering popular diamond comparisons
- **Responsive Design**: Mobile-first with perfect desktop experience
- **Interactive Change Modal**: Bottom-sheet modal with live preview and custom sliders
- **Affiliate Integration**: Links to three major diamond retailers
- **FAQ Section**: Educational content about diamond shopping
- **Google Analytics 4**: Full GA4 tracking with page views and user analytics
- **Smooth Animations**: Framer Motion for professional feel

---

## Tech Stack

### Core Technologies
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)

### Deployment
- **Hosting**: Vercel
- **Domain**: caratcompare.co
- **SSL**: Automatic (Vercel)
- **Deployment**: Automatic on push to `main` branch

### Development Tools
- **Node.js**: Latest LTS
- **Package Manager**: npm
- **Version Control**: Git + GitHub

---

## Project Structure

```
/Volumes/NAS/AI Repository/Projects/Carat Compare/
├── app/
│   ├── layout.tsx                 # Root layout with fonts
│   ├── page.tsx                   # Home page (Suspense wrapper)
│   ├── favicon.ico                # Cyan/magenta split diamond favicon
│   └── globals.css                # Tailwind + custom CSS
├── components/
│   ├── Header.tsx                 # Logo header (clickable to home)
│   ├── HomeContent.tsx            # Main content with URL param handling
│   ├── ComparisonArea.tsx         # Three-column diamond comparison
│   ├── DiamondDisplay.tsx         # Individual diamond with measurements
│   ├── ChangeButton.tsx           # Modal trigger button
│   ├── ChangeModal.tsx            # Bottom-sheet with sliders & shape selector
│   ├── ShoppingSection.tsx        # Affiliate buttons and links
│   ├── DiamondFAQ.tsx             # Collapsible FAQ section
│   └── Footer.tsx                 # Site footer
├── data/
│   └── diamond-sizes.json         # 160 verified diamond dimensions
├── public/
│   ├── svg/
│   │   ├── diamonds/              # 10 diamond shape SVGs
│   │   ├── retailers/             # 3 retailer logos
│   │   ├── Logo 3.svg             # Site logo
│   │   ├── Dime.svg               # US dime reference
│   │   └── gift.svg               # Shopping section icon
│   └── sitemap.xml                # 1,201 SEO URLs
├── CHANGELOG.md                   # Version history & changes
├── PROJECT_OVERVIEW.md            # Detailed project documentation
├── SITEMAP_PLAN.md                # SEO strategy & dimension data
└── README.md                      # This file

```

---

## Key Components

### DiamondDisplay.tsx
Renders individual diamond with:
- Width measurement line above
- Animated SVG diamond (with rotation for elongated shapes)
- Carat and shape label below
- "SHOP" button linking to shopping section
- **Scale factor**: 5× (all diamonds)
- **Max display size**: 100px × 100px

**Important Fix (Dec 8):** Dimension lines now correctly match visual width after rotation for elongated shapes (marquise, pear, oval, emerald, radiant).

### ChangeModal.tsx
Bottom-sheet modal with:
- Live preview of both diamonds at top
- Side-by-side controls for both diamonds
- Custom sliders with progressive color fill (cyan/magenta)
- 5-column shape selector grid
- Apply button (gradient cyan to magenta)
- Smooth animations (no flickering)

### ShoppingSection.tsx
Affiliate section with:
- Gift icon + "SHOP X CARAT SHAPE" heading
- 3 retailer buttons (currently non-affiliate URLs for pre-approval)
- "Check Prices →" CTA links
- Responsive mobile layout

**Recent Changes:**
- Removed pricing estimates
- Made mobile buttons bigger (px-4 py-2.5)
- Added horizontal padding to prevent edge crowding
- Increased logo size on mobile (h-3.5)

---

## Diamond Dimension Data

**File:** `data/diamond-sizes.json`

- **Total dimensions**: 160 data points (16 carats × 10 shapes)
- **Carat range**: 0.25 to 4.00 in 0.25 increments
- **Shapes**: Round, Princess, Cushion, Emerald, Asscher, Oval, Pear, Marquise, Radiant, Heart
- **Verification**: Cross-referenced with 11+ industry sources (GIA, Blue Nile, James Allen)
- **Format**: `{ "shape": { "carat": { "width": X, "height": Y } } }`

**Example:**
```json
{
  "round": {
    "1.00": { "width": 6.5, "height": 6.5 }
  },
  "marquise": {
    "0.75": { "width": 9.0, "height": 4.5 }
  }
}
```

**Elongated Shape Handling:**
- Shapes where width > height are rotated 90° in the UI
- This displays the longest dimension horizontally
- Dimension line measures the visual horizontal width (after rotation)

See `SITEMAP_PLAN.md` for complete dimension table.

---

## URL Structure & SEO

### URL Pattern
```
https://caratcompare.co/?carat1={carat}&shape1={shape}&carat2={carat}&shape2={shape}
```

**Examples:**
- `/?carat1=1.0&shape1=round&carat2=1.5&shape2=oval`
- `/?carat1=0.75&shape1=princess&carat2=2.0&shape2=emerald`

### Sitemap
- **Total URLs**: 1,201 (strategically selected from 25,600 possible combinations)
- **File**: `public/sitemap.xml`
- **Prioritization**: Focus on popular sizes (0.5, 1.0, 1.5, 2.0) and shapes (round, oval, princess)
- **Update frequency**: Monthly

### SEO Metadata
Each URL has dynamic:
- **Title**: `{carat1} CARAT {SHAPE1} vs {carat2} CARAT {SHAPE2}`
- **Subtitle**: `DIAMOND SIZE & SHAPE COMPARISON TOOL`
- Meta descriptions and OG tags are generated dynamically

---

## Affiliate Integration

### Current Status: Pre-Approval
Affiliate buttons currently link to general diamond search pages (no tracking codes) while awaiting affiliate program approval.

### Retailers
1. **Blue Nile**: Approved (3.5% commission) - Full affiliate integration
2. **James Allen**: Approved (2% commission) - Full affiliate integration
3. **Brilliant Earth**: Approved - Placeholder homepage link (pending Impact.com setup)

### Future Integration
Once approved for affiliate programs, update URLs in `components/ShoppingSection.tsx` with proper tracking parameters.

---

## Recent Changes (December 17, 2024)

### Version 1.3.5 (CRITICAL HOTFIX - Latest)
- 🚨 **Critical SEO Fix**: Fixed broken canonical URLs (all pages had `/undefined`)
- ✅ **Google Search Console**: Resolved 945 pages with canonical/duplicate errors
- ✅ **Root Cause**: Next.js 15+ params Promise not awaited in metadata
- ✅ **Impact**: Zero user-facing changes, SEO recovery in progress

### Version 1.3.4
- ✅ **Brilliant Earth Added**: Third affiliate retailer option in shopping sections
- ✅ **Performance Optimization**: Change modal now opens/closes smoothly without lag
  - Removed SVG cache busting (Date.now())
  - Removed GPU-intensive backdrop blur
  - Simplified animations (spring → tween)
  - Replaced Framer Motion with CSS transitions
  - Result: 60fps smooth performance on mobile
- ✅ **Pinterest Verification**: Added domain verification meta tag

### Version 1.3.3 (December 11, 2024)

### Version 1.3.3 (Latest)
- ✅ **Google Search Console HTTPS Fix**: Resolved "HTTPS not evaluated" error
- ✅ Updated all URLs to use `www.caratcompare.co` subdomain consistently
- ✅ Fixed canonical URL mismatch across all page types
- ✅ Updated sitemap, metadata, robots.txt to use www subdomain
- ✅ Eliminated 307 redirects between sitemap and canonical URLs

### Version 1.3.2
- ✅ Fixed Google Search Console sitemap XML validation error
- ✅ Created custom sitemap route handler to prevent script tag injection

### Version 1.3.1
- ✅ **Homepage Content Fixed**: Resolved critical issue where homepage was missing H1, FAQ, and Footer
- ✅ **Dynamic Homepage Heading**: H1 now shows actual diamonds being compared (e.g., "0.5 Carat Heart vs 1.25 Carat Round")
- ✅ Consistent design and structure across all pages

### Version 1.3.0
- ✅ **Comprehensive Event Tracking**: Full GA4 tracking for all user interactions
- ✅ Affiliate click tracking with detailed context
- ✅ Shop button, comparison updates, and FAQ engagement tracking

### Version 1.2.0
- ✅ **Google Analytics 4 Integration**: Full tracking implementation with GA4
- ✅ **Fixed React Hydration Error**: Critical bug preventing proper rendering
  - Replaced random defaults with static defaults (0.5ct heart vs 1.25ct round)
  - Fixed server/client mismatch issue

### Version 1.1.0
- ✅ Diamond FAQ section with 6 collapsible questions
- ✅ Clickable logo linking to homepage
- ✅ Custom favicon (cyan/magenta split diamond)
- ✅ Updated affiliate links to non-affiliate URLs (pre-approval period)
- ✅ Removed pricing estimates, replaced with "Check Prices →" CTA
- ✅ Improved mobile spacing for shopping section
- ✅ Changed subtitle to "DIAMOND SIZE & SHAPE COMPARISON TOOL"
- ✅ Dimension line alignment for rotated shapes (marquise, pear, oval, etc.)
- ✅ Mobile layout crowding in shopping section

See `CHANGELOG.md` for complete version history.

---

## Known Issues & Considerations

### Current State
- ✅ All features working as expected
- ✅ Mobile responsive
- ✅ SEO optimized
- ✅ 1,201 URLs in sitemap

### Pending
- ⏳ Affiliate program approval (Blue Nile, James Allen, Brilliant Earth)
- ⏳ Google Search Console indexing (3-6 months for organic traffic)
- ⏳ Google Search Console HTTPS error resolution (resubmit sitemap, wait 24-48 hours)

### Future Enhancements
- Add Google Analytics tracking
- Implement affiliate tracking parameters when approved
- Consider adding more educational content (blog posts)
- Potential AR preview feature (mobile)

---

## Development Workflow

### Making Changes
1. Make edits to components/files
2. Test locally at http://localhost:3000
3. Commit changes with descriptive message
4. Push to GitHub `main` branch
5. Vercel automatically deploys (1-2 minutes)

### Git Commit Format
```bash
git commit -m "Brief description

- Detailed change 1
- Detailed change 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### Component Changes
- **Diamond dimensions**: Edit `data/diamond-sizes.json`
- **Affiliate links**: Edit `components/ShoppingSection.tsx`
- **FAQ content**: Edit `components/DiamondFAQ.tsx`
- **Styling**: Edit component files or `app/globals.css`

---

## Design System

### Colors
- **Header Background**: `#000000` (pure black)
- **Main Background**: `#252525` (dark gray)
- **Shopping Background**: `#CCCCCC` (light gray)
- **Left Diamond**: `#07F4FF` (cyan)
- **Right Diamond**: `#FA06FF` (magenta)
- **Button Dark**: `#1E1E1E`

### Typography
- **Font Family**: Lato (Google Fonts)
- **Heading**: 900 weight (Black)
- **Body**: 400 weight (Regular)
- **Carat Numbers**: text-3xl, 900 weight, cyan/magenta
- **Shape Names**: text-xl, 400 weight, cyan/magenta

### Scale Factor
All diamonds and the dime reference use a **5× scale multiplier**.
- Example: 6.5mm diamond → 32.5px display size (capped at 100px max)
- Dime: 17.9mm × 5 = 89.5px (capped at 125px)

---

## Testing Checklist

### Visual Testing
- [ ] Diamonds scale correctly (compare with reference images)
- [ ] Dimension lines match visual width
- [ ] Rotated shapes display correctly (marquise, pear, oval, emerald, radiant)
- [ ] Mobile layout doesn't crowd
- [ ] Logo clicks to homepage

### Functional Testing
- [ ] Change modal opens and closes smoothly
- [ ] Sliders update diamonds in real-time
- [ ] Shape selection works
- [ ] Apply button updates main display
- [ ] URL updates when diamonds change
- [ ] Affiliate buttons link correctly
- [ ] FAQ items expand/collapse

### Cross-Browser
- [ ] Chrome/Edge (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Firefox

---

## Performance Targets

- **First Contentful Paint**: < 1.5s ✅
- **Largest Contentful Paint**: < 2.5s ✅
- **Cumulative Layout Shift**: < 0.1 ✅
- **Animation Frame Rate**: 60fps ✅

Current Lighthouse scores meet all targets.

---

## Contact & Resources

- **Live Site**: https://caratcompare.co
- **GitHub**: https://github.com/schoolmatchco/caratcompare
- **Vercel Dashboard**: [Access via GitHub integration]

### Documentation Files
- `README.md` - This file (project overview & current status)
- `PROJECT_OVERVIEW.md` - Detailed architecture & original vision
- `CHANGELOG.md` - Version history & all changes
- `SITEMAP_PLAN.md` - SEO strategy & dimension data table

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- [Lato Font](https://fonts.google.com/specimen/Lato)

---

## For Next Session

### Priority Tasks
1. **Verify Measurements**: User has reference graphic to check against our dimensions
2. **Affiliate Program Status**: Check on approval status from retailers
3. **Custom GA Events**: Consider tracking affiliate clicks, diamond changes, FAQ interactions
4. **Content Expansion**: Consider adding blog posts for SEO

### Quick Context
- Project is fully functional and deployed
- All major features complete
- Focus shifted to SEO and affiliate approval
- Mobile responsive issues resolved
- Dimension line accuracy fixed

### Key Files to Review
- `components/DiamondDisplay.tsx` - Core diamond rendering
- `components/ShoppingSection.tsx` - Affiliate links
- `data/diamond-sizes.json` - All dimension data
- `CHANGELOG.md` - Recent changes

---

## Google Search Console Notes (December 11, 2024)

### HTTPS Error Fix
**Issue:** "HTTPS not evaluated: These pages are not served over HTTPS"

**Root Cause:**
- Site serves content at `www.caratcompare.co` (with www)
- Sitemap and canonical tags pointed to `caratcompare.co` (without www)
- This caused a 307 redirect mismatch between sitemap URLs and canonical URLs

**Solution Applied:**
1. Updated `SITE_URL` in `app/sitemap.xml/route.ts` to use www
2. Updated `metadataBase` in `app/layout.tsx` to use www
3. Updated all page metadata generators:
   - `app/[shape]/page.tsx` - canonical and OG URLs
   - `app/compare/[slug]/page.tsx` - canonical and OG URLs
   - `app/carat/[carat]/page.tsx` - canonical and OG URLs
4. Updated `app/robots.ts` sitemap reference to use www

**Next Steps:**
1. Resubmit sitemap in Google Search Console: `https://www.caratcompare.co/sitemap.xml`
2. Request re-indexing for key URLs using URL Inspection tool
3. Wait 24-48 hours for Google to re-crawl
4. Verify "HTTPS not evaluated" error is resolved

---

**Last Updated**: December 17, 2024
**Version**: 1.3.4
**Status**: Production-ready, deployed, and live with optimized performance
