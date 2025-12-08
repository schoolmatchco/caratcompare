# Carat Compare - Project Overview

## Project Vision

**Carat Compare** is a beautifully designed, single-page web application that allows users to visually compare two diamond sizes and shapes side-by-side using a US dime as a real-world scale reference. The primary goal is to drive affiliate revenue through Blue Nile, James Allen, and Brilliant Earth by providing an engaging, SEO-optimized comparison tool.

---

## Core Objectives

1. **User Engagement**: Provide an intuitive, visually stunning comparison experience
2. **Affiliate Conversion**: Drive clicks to pre-filtered affiliate links
3. **SEO Dominance**: Capture long-tail search traffic through thousands of dynamic URLs
4. **Multi-Device Experience**: Flawless responsive design for mobile and desktop
5. **Performance**: Fast loading, smooth animations, optimal user experience

---

## Design Philosophy

### Visual Design Principles

- **Elegance**: Clean, minimal interface that puts diamonds front and center
- **Luxury Feel**: Black header, professional typography (Lato font family)
- **Subtle Interactions**: Smooth animations that feel premium, not gimmicky
- **Trust & Clarity**: Clear sizing information with real-world reference (dime)
- **Compact Layout**: Efficient use of space, even on desktop (no unnecessary expansion)

### Color Palette

- **Header Background**: Pure Black (`#000000`)
- **Main Background**: Dark Gray (`#252525`)
- **Modal Background**: Dark Gray (`#252525`) - matches main background
- **Shopping Section Background**: Light Gray (`#CCCCCC`)
- **Primary Text**: White (`#FFFFFF`)
- **Left Diamond Accent**: Cyan (`#07F4FF`)
- **Right Diamond Accent**: Magenta/Fuchsia (`#FA06FF`)
- **Slider Fill**: Cyan/Magenta (progressive fill based on selection)
- **Button Gradient**: Cyan to Fuchsia gradient for Apply button
- **Retailer Buttons**: Dark Gray (`#1E1E1E` - `#2D2D2D`) with white logo

### Typography

**Font Family**: Lato (Google Fonts)

- **Main Heading "CARAT & SHAPE"**: Lato Black (900 weight) for "CARAT" and "SHAPE"
- **Ampersand "&"**: Lato Thin (100 weight)
- **Subtitle "COMPARISON TOOL"**: Lato Regular or Light (300-400 weight)
- **Diamond Carat Numbers**: text-3xl (30px) - Lato Black (900 weight) in cyan/magenta
- **Diamond Shape Names**: text-xl (20px) - Lato Regular in cyan/magenta
- **Body Text**: Lato Regular (400 weight)
- **Measurements**: Lato Regular (400 weight)
- **Carat Display Format**: Decimal notation (0.5, 1.0, 1.25, etc.)

---

## Layout Structure

### Mobile-First Design (320px - 767px)

Based on the provided mockup, the mobile layout is vertically stacked:

1. **Header** (Black background, ~80px height)
   - Logo centered vertically and horizontally
   - Fixed position or sticky behavior

2. **Title Section** (~120px)
   - "CARAT & SHAPE" (large, bold/thin/bold)
   - "COMPARISON TOOL" (smaller, regular weight)

3. **Comparison Area** (~400-500px)
   - Three-column layout (equal width)
   - Left: Diamond 1 with measurement above
   - Center: Dime (17.9mm) with "CHANGE" button below
   - Right: Diamond 2 with measurement above
   - Diamond labels below each (e.g., "0.5 HEART")

4. **Shopping Section 1** (Variable height)
   - Gift icon + "SHOP X CARAT SHAPE"
   - Three stacked affiliate buttons with pricing

5. **Shopping Section 2** (Variable height)
   - Duplicate of Shopping Section 1 for second diamond

### Desktop Design (768px+)

**Key Difference**: Maintain compact, centered layout (max-width: ~1200px)

- **Header**: Same as mobile, logo centered
- **Comparison Area**: Three columns remain but with more breathing room
- **Shopping Sections**: Could display side-by-side in two columns instead of stacked
  - Left column: Shopping for Diamond 1
  - Right column: Shopping for Diamond 2
  - This creates a cleaner, more logical flow on desktop

**Desktop Layout Mockup** (Conceptual):
```
┌─────────────────────────────────────────┐
│          [LOGO CENTERED]                │ Black Header
└─────────────────────────────────────────┘
            CARAT & SHAPE
          COMPARISON TOOL

  ~7mm       17.9mm        ~10mm
  [♥]        [DIME]        [●]
  0.5 HEART  [CHANGE]   1.25 ROUND

┌───────────────────┬───────────────────┐
│ 🎁 SHOP 0.5 HEART │ 🎁 SHOP 1.25 ROUND│
│ [Blue Nile]       │ [Blue Nile]       │
│ [James Allen]     │ [James Allen]     │
│ [Brilliant Earth] │ [Brilliant Earth] │
└───────────────────┴───────────────────┘
```

---

## User Experience Flow

### Initial Load
1. User lands on URL (e.g., `/compare/0.5-heart-vs-1.25-round`)
2. Page loads with pre-selected diamonds based on URL parameters
3. Diamonds fade in with subtle scale animation (0.95 → 1.0)
4. Shopping sections populate with appropriate titles and links

### Interaction Flow
1. User clicks "CHANGE" button (change.svg icon)
2. Bottom sheet slides up from bottom on all screen sizes (mobile and desktop)
   - Dark gray background (#252525) matching main area
   - 2px black border on top, left, and right edges
   - Backdrop blur effect on background content
3. Modal contains (no scrolling - all fits in view):
   - **Live Preview Section**: Two diamond previews side-by-side at top
     - Show current selections in real-time
     - Cyan color for left diamond, magenta for right
     - Smooth animations when selections change
   - **Control Section**: Side-by-side controls for both diamonds
     - Custom sliders with progressive color fill (cyan/magenta)
     - Larger 24px thumb with white border and shadow
     - Bold end labels (0.25 and 4.00)
     - Compact 5-column shape grid below each slider
     - Only selected shapes show colored border
4. User adjusts carat and/or shape for one or both diamonds
   - Preview diamonds update instantly at top of modal
   - No flickering - smooth transitions
5. User clicks "APPLY" button (gradient cyan to magenta)
6. Modal slides down with spring animation
7. Main diamonds smoothly transition to new size (not shape - no remounting)
8. Measurements update
9. Labels update with colored text (cyan/magenta)
10. Shopping sections update dynamically with new headings and affiliate links
11. URL updates without page reload (using History API)

### Animation Details

**Diamond Size/Shape Transitions** (500ms duration):
- **Scale**: Smooth scale transition using CSS transform and Framer Motion
- **Size Animation**: Width and height animate smoothly when carat changes (no remounting)
- **Shape Change**: Only remounts when shape changes, with scale/opacity animation
- **Optimization**: Component key based on shape only, preventing unnecessary remounting on carat changes
- **Easing**: `cubic-bezier(0.4, 0.0, 0.2, 1)` for smooth, professional feel

**Visual Enhancements**:
- **Drop Shadows**: Subtle glow effect on diamonds and dime (`drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))`)
- **Scale Factor**: 5x multiplier (increased from 4x for better visibility)
  - Example: 5mm diamond → 25px display size (capped at 100px max)
- **Smooth Scrolling**: Enabled site-wide for anchor links
- **Backdrop Blur**: Applied when modal is open for visual separation

**Measurement Updates**:
- Count-up/count-down animation for millimeter values
- Duration: 400ms synchronized with diamond animation

**Shopping Section Updates**:
- Fade out old text (200ms) → Update content → Fade in new text (200ms)
- Total: 400ms

**Change Button**:
- Hover: Subtle scale (1.0 → 1.05) with slight glow enhancement
- Active: Scale down (0.98) for tactile feedback

**Modal/Bottom Sheet**:
- Mobile: Slide up from bottom with backdrop fade-in (300ms)
- Desktop: Fade in with scale (0.95 → 1.0) centered modal (300ms)
- Backdrop: Semi-transparent black overlay (rgba(0,0,0,0.6))

---

## Technical Architecture

### Technology Stack

**Frontend Framework**:
- **Next.js 14+** (App Router)
  - Server-side rendering for SEO
  - Dynamic metadata generation for each URL
  - Built-in optimization for images/fonts
  - API routes for potential price fetching

**Styling**:
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **CSS Modules** or **Styled Components** for component-specific styles (optional)

**State Management**:
- **React Context** or **Zustand** for global state (current diamond selections)
- **URL State**: Primary source of truth (enables shareable links)

**Data Management**:
- **Static JSON files** for diamond size/carat mappings
- **API routes** for dynamic price fetching (if implemented)
- **Sitemap generation** script for thousands of URL combinations

**Deployment**:
- **Vercel** (optimal for Next.js, automatic deployments, edge functions)
- **Cloudflare Pages** (alternative with excellent performance)

---

## Diamond Size Calculations

### Carat to Millimeter Mapping

While the relationship isn't perfectly linear, we can use standard industry approximations:

**Round Diamonds** (diameter in mm):
- 0.25ct: 4.1mm
- 0.50ct: 5.1mm
- 0.75ct: 5.9mm
- 1.00ct: 6.5mm
- 1.25ct: 7.0mm
- 1.50ct: 7.4mm
- 1.75ct: 7.8mm
- 2.00ct: 8.2mm
- 2.25ct: 8.5mm
- 2.50ct: 8.9mm
- 2.75ct: 9.2mm
- 3.00ct: 9.4mm
- 3.25ct: 9.7mm
- 3.50ct: 9.9mm
- 3.75ct: 10.1mm
- 4.00ct: 10.3mm

**Other Shapes**:
Different shapes have varying dimensions. We'll create a comprehensive lookup table for all shapes and carat weights. For non-round shapes, we'll use the maximum width or length as the displayed measurement.

**Implementation**:
```javascript
// data/diamond-sizes.json
{
  "round": {
    "0.25": { "width": 4.1, "height": 4.1 },
    "0.50": { "width": 5.1, "height": 5.1 },
    // ... more sizes
  },
  "heart": {
    "0.25": { "width": 4.2, "height": 4.0 },
    "0.50": { "width": 5.2, "height": 5.0 },
    // ... more sizes
  }
  // ... more shapes
}
```

---

## SEO Strategy

### Dynamic URL Structure

**Pattern**: `/compare/{carat1}-{shape1}-vs-{carat2}-{shape2}`

**Examples**:
- `/compare/0.5-heart-vs-1.25-round`
- `/compare/1.0-princess-vs-1.5-cushion`
- `/compare/2.0-oval-vs-2.5-emerald`

### URL Generation

**Carat Options**: 0.25 to 4.00 in 0.25 increments (16 options)
- 0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75, 4.00

**Shape Options**: Round, Princess, Cushion, Emerald, Asscher, Heart, Pear, Oval, Marquise, Radiant (10 shapes)

**Total Combinations**:
- First diamond: 16 carats × 10 shapes = 160 options
- Second diamond: 16 carats × 10 shapes = 160 options
- Total unique comparisons: 160 × 160 = **25,600 URLs**

**Sitemap Generation**:
Create a script that generates all combinations and outputs:
1. `sitemap.xml` (or multiple sitemaps if >50,000 URLs)
2. Static or dynamically generated pages for each combination

### Meta Tags (Per URL)

```html
<title>Compare {X} Carat {Shape1} vs {Y} Carat {Shape2} Diamond | Carat Compare</title>
<meta name="description" content="Visually compare a {X} carat {shape1} diamond to a {Y} carat {shape2} diamond. See actual size comparison with measurements. Shop from Blue Nile, James Allen, and Brilliant Earth.">
<meta property="og:title" content="Compare {X} Carat {Shape1} vs {Y} Carat {Shape2} Diamond">
<meta property="og:description" content="Visual diamond size comparison tool with real measurements">
<meta property="og:image" content="/og-images/{carat1}-{shape1}-vs-{carat2}-{shape2}.png">
```

### Schema Markup

Add JSON-LD structured data for better search appearance:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Carat Compare",
  "description": "Diamond size comparison tool",
  "applicationCategory": "UtilityApplication",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "500"
  }
}
```

---

## Affiliate Link Implementation

### Link Structure

Each retailer has specific URL patterns for filtering:

**Blue Nile**:
```
https://www.bluenile.com/diamond-search?
  track=AFFILIATE_CODE
  &shape={shape}
  &caratFrom={carat-0.1}
  &caratTo={carat+0.1}
```

**James Allen**:
```
https://www.jamesallen.com/loose-diamonds/search?
  a_aid=AFFILIATE_CODE
  &Shape={shape}
  &CaratFrom={carat-0.1}
  &CaratTo={carat+0.1}
```

**Brilliant Earth**:
```
https://www.brilliantearth.com/loose-diamonds/search?
  aff=AFFILIATE_CODE
  &shape={shape}
  &carat_from={carat-0.1}
  &carat_to={carat+0.1}
```

**Note**: We'll need to verify exact parameter names and affiliate tracking codes for each retailer.

### Dynamic Link Generation

```javascript
// utils/affiliate-links.js
export function generateAffiliateLink(retailer, carat, shape) {
  const params = {
    shape: normalizeShapeName(shape, retailer),
    caratFrom: Math.max(0.25, carat - 0.1),
    caratTo: carat + 0.1
  };

  // Build URL based on retailer
  // Add proper affiliate tracking
  return constructURL(retailer, params);
}
```

---

## Pricing Strategy

### Option 1: Dynamic Price Fetching (Ideal)

**Approach**: Use retailer APIs or web scraping to fetch real-time lowest prices

**Challenges**:
- Blue Nile, James Allen, Brilliant Earth may not have public APIs
- Web scraping may violate ToS
- Rate limiting concerns
- Requires backend service

**Implementation** (if feasible):
- Next.js API route: `/api/prices?retailer=bluenile&carat=0.5&shape=heart`
- Cache results (Redis or in-memory) for 24 hours
- Fallback to static prices if API fails

### Option 2: Researched Static Pricing (Fallback)

**Approach**: Manually research or scrape once to build static price database

**Process**:
1. Research each retailer for all carat/shape combinations
2. Record lowest available price
3. Store in JSON database
4. Update quarterly or bi-annually

**Structure**:
```json
{
  "bluenile": {
    "0.5-heart": 521,
    "1.0-round": 2850,
    // ... all combinations
  },
  "jamesallen": { /* ... */ },
  "brilliantearth": { /* ... */ }
}
```

**Recommendation**: Start with Option 2 (static), explore Option 1 after launch.

---

## Change Modal/Bottom Sheet Design

### Mobile Bottom Sheet

**Trigger**: User taps "CHANGE" button

**Animation**:
1. Backdrop fades in (black, 60% opacity)
2. Sheet slides up from bottom (300ms ease-out)
3. Sheet height: ~70% of viewport

**Content Layout**:
```
┌─────────────────────────────┐
│     [Drag Handle Bar]       │
│                             │
│  Diamond 1                  │
│  ┌─────────────────────┐    │
│  │ Carat: [Slider]     │    │
│  │ 0.5  [━━●━━━━]  3.0 │    │
│  └─────────────────────┘    │
│                             │
│  Shape:                     │
│  [♥][●][◆][▭][◈][◇][▽][◯][◊][□] │
│   (10 shape icons in grid)  │
│                             │
│  ─────────────────────      │
│                             │
│  Diamond 2                  │
│  ┌─────────────────────┐    │
│  │ Carat: [Slider]     │    │
│  │ 0.5  [━━━●━━━]  3.0 │    │
│  └─────────────────────┘    │
│                             │
│  Shape:                     │
│  [♥][●][◆][▭][◈][◇][▽][◯][◊][□] │
│                             │
│  ┌─────────────────────┐    │
│  │   COMPARE DIAMONDS  │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**Interactions**:
- Drag handle to dismiss
- Tap backdrop to dismiss
- Tap outside to dismiss
- Slider provides tactile feedback (haptics on mobile if available)
- Shape icons highlight on selection with scale animation

### Desktop Modal

**Trigger**: User clicks "CHANGE" button

**Animation**:
1. Backdrop fades in
2. Modal scales in from center (0.95 → 1.0, 300ms)

**Content**: Same as mobile but in centered modal (~500px wide)

**Dismissal**: Click backdrop, ESC key, or close button (X)

---

## Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up Next.js project with TypeScript
- [ ] Configure Tailwind CSS and Framer Motion
- [ ] Create basic layout structure (header, main, shopping sections)
- [ ] Implement responsive grid system
- [ ] Import and optimize SVG assets

### Phase 2: Core Functionality (Week 2)
- [ ] Build diamond comparison component
- [ ] Create diamond size calculation system
- [ ] Implement change modal/bottom sheet
- [ ] Add carat slider and shape selector
- [ ] Build URL parameter system
- [ ] Implement state management

### Phase 3: Animations & Polish (Week 3)
- [ ] Add diamond transition animations
- [ ] Implement measurement count-up animations
- [ ] Create modal entrance/exit animations
- [ ] Add micro-interactions (hover states, button feedback)
- [ ] Optimize for 60fps performance

### Phase 4: Affiliate Integration (Week 3-4)
- [ ] Research affiliate link structures
- [ ] Implement dynamic link generation
- [ ] Build price database (static or dynamic)
- [ ] Add shopping section logic
- [ ] Test all retailer links

### Phase 5: SEO Optimization (Week 4)
- [ ] Generate sitemap with all URL combinations
- [ ] Implement dynamic meta tags
- [ ] Add structured data (JSON-LD)
- [ ] Create OG image generator (optional)
- [ ] Submit to Google Search Console

### Phase 6: Testing & Launch (Week 5)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] Performance optimization (Lighthouse score 90+)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Analytics setup (Google Analytics, affiliate tracking)
- [ ] Deploy to production

---

## File Structure

```
carat-compare/
├── public/
│   ├── svg/
│   │   ├── diamonds/
│   │   │   ├── round.svg
│   │   │   ├── princess.svg
│   │   │   ├── heart.svg
│   │   │   └── ...
│   │   ├── retailers/
│   │   │   ├── blue-nile.svg
│   │   │   ├── james-allen.svg
│   │   │   └── brilliant-earth.svg
│   │   ├── logo.svg
│   │   ├── dime.svg
│   │   └── adjust.svg
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── compare/
│   │   │   └── [comparison]/
│   │   │       └── page.tsx
│   │   └── api/
│   │       └── prices/
│   │           └── route.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ComparisonArea.tsx
│   │   ├── DiamondDisplay.tsx
│   │   ├── DimeReference.tsx
│   │   ├── ChangeButton.tsx
│   │   ├── ChangeModal.tsx
│   │   ├── ShoppingSection.tsx
│   │   ├── AffiliateButton.tsx
│   │   └── CaratSlider.tsx
│   ├── data/
│   │   ├── diamond-sizes.json
│   │   ├── prices.json
│   │   └── affiliate-config.json
│   ├── utils/
│   │   ├── diamond-calculations.ts
│   │   ├── affiliate-links.ts
│   │   ├── url-parser.ts
│   │   └── price-fetcher.ts
│   ├── hooks/
│   │   ├── useDiamondComparison.ts
│   │   └── useAnimation.ts
│   └── styles/
│       └── globals.css
├── scripts/
│   ├── generate-sitemap.ts
│   ├── generate-sizes.ts
│   └── research-prices.ts
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Performance Targets

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Animation Frame Rate**: Consistent 60fps

**Optimization Strategies**:
- SVG optimization (SVGO)
- Image lazy loading
- Font preloading (Lato from Google Fonts)
- Code splitting
- Static generation where possible
- CDN delivery (Vercel Edge Network)

---

## Analytics & Tracking

### Events to Track

1. **Page Views**: Each unique comparison URL
2. **Diamond Changes**: When users modify selections
3. **Modal Opens**: Change button clicks
4. **Affiliate Clicks**: Button clicks with retailer parameter
5. **Time on Page**: Engagement metric
6. **Bounce Rate**: SEO quality indicator

### Implementation

**Google Analytics 4**:
```javascript
gtag('event', 'affiliate_click', {
  retailer: 'blue-nile',
  carat: '0.5',
  shape: 'heart',
  position: 'left',
  price: '2521'
});
```

**Affiliate Networks**: Use proper tracking parameters in URLs

---

## Accessibility Considerations

- **Keyboard Navigation**: Full site navigable with keyboard
- **Focus Indicators**: Visible focus states on all interactive elements
- **ARIA Labels**: Proper labeling for screen readers
- **Color Contrast**: WCAG AA compliance (4.5:1 for text)
- **Alt Text**: Descriptive alt text for diamond shapes
- **Semantic HTML**: Proper heading hierarchy, landmark regions

---

## Future Enhancements (Post-Launch)

1. **Save Comparisons**: Allow users to bookmark/share specific comparisons
2. **Email Capture**: "Get price alerts" feature for lead generation
3. **Additional Retailers**: Add more affiliate partners
4. **Ring Settings**: Show diamonds in various ring settings
5. **AR Preview**: Mobile AR to see diamonds on hand (iOS/Android)
6. **Price History**: Show price trends over time
7. **Diamond Education**: Content pages about 4Cs, certifications
8. **Blog**: SEO content about diamond buying

---

## Success Metrics

**Month 1-3**:
- 1,000+ indexed pages in Google
- 500+ monthly organic visitors
- 2%+ click-through rate on affiliate buttons
- 5+ affiliate conversions

**Month 4-6**:
- 5,000+ indexed pages
- 2,000+ monthly organic visitors
- 3%+ click-through rate
- 20+ affiliate conversions

**Month 7-12**:
- All 10,000 pages indexed
- 10,000+ monthly organic visitors
- 5%+ click-through rate
- 100+ affiliate conversions/month

---

## Contact & Resources

- **Lato Font**: [Google Fonts - Lato](https://fonts.google.com/specimen/Lato)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Framer Motion**: [framer.com/motion](https://www.framer.com/motion/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

---

**Document Version**: 1.0
**Last Updated**: December 8, 2024
**Project Status**: Planning Phase
