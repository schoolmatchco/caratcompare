# Changelog

All notable changes to the Carat Compare project are documented in this file.

## [1.3.4] - 2024-12-17

### Added
- **Brilliant Earth Retailer**: Added Brilliant Earth as third affiliate option
  - New button appears in shopping sections on all comparison pages
  - Currently links to homepage (placeholder for affiliate link)
  - Logo displays correctly alongside Blue Nile and James Allen
  - Ready for affiliate tracking parameters once obtained from Impact.com

### Fixed
- **Change Modal Performance**: Major optimization for smoother user experience
  - Removed `Date.now()` cache busting that was forcing SVG reloads on every render
  - Removed GPU-intensive `backdrop-blur-sm` effect (now solid backdrop)
  - Changed spring animation to simple tween for faster, smoother modal slide
  - Replaced Framer Motion animations on preview diamonds with lightweight CSS transitions
  - Removed `scale-110` transforms on shape buttons (now color-only transitions)
  - **Result**: Modal now opens/closes smoothly without glitching or lag

### Technical
- Optimized `getShapeIcon()` function to return clean SVG paths
- Changed backdrop from `backdrop-blur-sm` to `bg-opacity-70` (solid)
- Changed modal transition from `spring (damping: 25, stiffness: 500)` to `tween (duration: 0.3, ease: 'easeOut')`
- Replaced motion.div wrappers with standard divs + CSS transitions on preview images
- Changed shape button transitions from `transition-all` to `transition-colors`

## [1.3.3] - 2024-12-11

### Fixed
- **Google Search Console HTTPS Error**: Fixed "HTTPS not evaluated" error
  - Updated `SITE_URL` in sitemap route to use `https://www.caratcompare.co` (with www)
  - Updated `metadataBase` in layout.tsx to use `https://www.caratcompare.co` (with www)
  - Resolves canonical URL mismatch between sitemap and actual served URLs
  - All sitemap URLs, canonical tags, and OG tags now consistently use www subdomain
  - Eliminates 307 redirect between sitemap URLs and canonical URLs

### Technical
- Sitemap URLs now match the canonical domain exactly (www.caratcompare.co)
- No redirects between sitemap URLs and content URLs
- Canonical tags and Open Graph URLs aligned with actual site URL
- Follows Google Search Console best practices for sitemap/canonical consistency
- Updated all metadata generation functions across shape, compare, and carat pages
- Updated robots.txt sitemap reference to use www subdomain

## [1.3.2] - 2024-12-10

### Fixed
- **Google Search Console Sitemap Error**: Fixed critical XML validation error
  - **Removed `<script/>` tag injection** in sitemap XML
  - Replaced Next.js automatic sitemap generation with custom route handler
  - Added `metadataBase` to root layout for consistent canonical URLs
  - Ensures all canonical tags use `https://caratcompare.co`
  - Sitemap now validates correctly in Google Search Console

### Technical
- Created custom `app/sitemap.xml/route.ts` route handler
  - Generates pure XML without any HTML/script tag injection
  - Bypasses Next.js automatic sitemap generation issues
- Removed `app/sitemap.ts` (was causing script tag injection)
- Added `metadataBase: new URL('https://caratcompare.co')` to `app/layout.tsx`
- All 1,232 pages now generate with correct canonical URLs
- Sitemap XML is now 100% valid per XML schema standards

## [1.3.1] - 2024-12-09

### Fixed
- **Homepage Missing Content**: Fixed critical issue where homepage was missing key elements
  - Added H1 heading showing actual diamond comparison (e.g., "0.5 Carat Heart vs 1.25 Carat Round")
  - Previously showed generic "CARAT & SHAPE" text - now shows specific diamonds being compared
  - Added DiamondFAQ section to homepage
  - Added Footer component to homepage
  - Added proper background color to match site design
  - Homepage now matches the structure and content of comparison pages

### Changed
- **Homepage Heading Dynamic**: H1 heading now dynamically reflects the diamonds being displayed
  - Left diamond shown in cyan color
  - Right diamond shown in magenta color
  - Updates based on URL parameters or defaults to 0.5ct heart vs 1.25ct round
  - Consistent with comparison page format throughout the site

### Technical
- Updated `components/HomeContent.tsx` to include all missing sections
- Imported `capitalize` and `formatCaratForDisplay` utility functions from `lib/urlHelpers.ts`
- Heading now uses same rendering logic as comparison pages for consistency

## [1.3.0] - 2024-12-08

### Added
- **Comprehensive Event Tracking**: Full interaction tracking across all user touchpoints
  - Created `lib/analytics.ts` utility with descriptive event tracking functions
  - All events use clear, human-readable names and labels for easy GA4 analysis

- **Affiliate Click Tracking**: Track every affiliate link click with full context
  - Event name: `Affiliate Click - [Retailer Name]`
  - Event label: `[Retailer] - [X.Xct] [Shape] - [Logo Button|Check Prices Link]`
  - Tracks: retailer, carat, shape, link type (logo vs text)
  - Example: "Affiliate Click - Blue Nile" with label "Blue Nile - 1.5ct Oval - Logo Button"

- **Shop Button Tracking**: Monitor which diamonds drive shopping intent
  - Event name: `Shop Button Click`
  - Event label: `Shop [X.Xct] [Shape] ([Left|Right] Diamond)`
  - Tracks: carat, shape, position on screen
  - Example: "Shop 1.5ct Oval (Left Diamond)"

- **Comparison Tool Tracking**: See what diamond comparisons users create
  - Event name: `Comparison Updated`
  - Event label: `[X.Xct] [Shape] vs [X.Xct] [Shape]`
  - Tracks: both diamond specs (carat1, shape1, carat2, shape2)
  - Example: "0.5ct Heart vs 1.25ct Round"

- **FAQ Engagement Tracking**: Understand which questions matter most
  - Event name: `FAQ Expanded`
  - Event label: [exact question text]
  - Tracks only expansions (not collapses) to measure true engagement
  - Example: "Does diamond size matter?"

- **Navigation Tracking**: Monitor user flow
  - Change button: `Change Button Click` - "Open Comparison Modal"
  - Logo clicks: `Logo Click` - "Return to Homepage"

### Technical
- All components updated with analytics imports and tracking calls
- Event tracking follows GA4 best practices with clear categories and labels
- Tracking functions designed for maximum clarity in GA4 reports dashboard

## [1.2.0] - 2024-12-08

### Added
- **Google Analytics 4 Integration**: Full GA4 tracking implementation
  - Created GoogleAnalytics component with Next.js Script optimization
  - Uses NEXT_PUBLIC_GA_ID environment variable
  - Loads with afterInteractive strategy for optimal performance
  - Automatic page view tracking
  - Measurement ID: G-1MM0RSPMSQ

### Fixed
- **React Hydration Mismatch Error**: Critical bug fix preventing proper rendering
  - Replaced Math.random() based defaults with static defaults
  - Eliminated server/client mismatch that was blocking React hydration
  - Now uses consistent defaults: 0.5ct heart vs 1.25ct round
  - This fix was essential for Google Analytics to load properly

### Technical
- Environment variable setup for local and production (.env.local, Vercel)
- Proper .gitignore configuration to protect GA measurement ID

## [1.1.0] - 2024-12-08

### Added
- **Diamond FAQ Section**: Comprehensive FAQ with 6 collapsible questions
  - Professional bordered containers with plus/minus toggle icons
  - Smooth expand/collapse animations
  - Covers common diamond shopping questions
- **Clickable Logo**: Logo now links to home page (caratcompare.co) without URL parameters
- **Favicon**: Custom cyan/magenta split diamond favicon matching brand colors

### Changed
- **Affiliate Links Updated**: Switched to non-affiliate URLs for pre-approval period
  - Blue Nile: https://www.bluenile.com/diamond-search
  - James Allen: https://www.jamesallen.com/loose-diamonds/all-diamonds/
  - Brilliant Earth: https://www.brilliantearth.com/engagement-rings/start-with-a-diamond/
- **Pricing Display Removed**: Eliminated estimated pricing to avoid misleading users
  - Replaced "...from $X" with "Check Prices →" CTA
  - Simpler, more trustworthy approach
- **Subtitle Updated**: Changed to "DIAMOND SIZE & SHAPE COMPARISON TOOL"
- **Mobile Shopping Section**: Improved responsive layout
  - Buttons slightly bigger on mobile (px-4 py-2.5)
  - Logos increased to h-3.5 on mobile
  - Added horizontal padding (px-2) to prevent edge crowding
  - Increased gap between elements (gap-3)

### Fixed
- **Dimension Line Alignment**: Fixed mismatch for rotated diamond shapes
  - For elongated shapes (marquise, pear, oval, emerald, etc.)
  - Dimension line now correctly measures visual horizontal width after rotation
  - Example: 0.75ct marquise shows "9.0mm" with matching 45px dimension line
- **Mobile Layout**: Shopping section buttons and links no longer crowd on small screens

## [Unreleased] - 2024-12-08

### Added
- **Drop shadows** to all diamond SVGs and dime for better visual depth
  - Subtle glow effect using `drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))`
- **Smooth scrolling** behavior across the site
- **"Shop" link** in instructional text that smoothly scrolls to shopping sections
- **Cache-busting timestamps** for SVG files to prevent browser caching issues
- **Backdrop blur effect** when change modal is open for better visual separation
- **Black border** (2px) on top, left, and right edges of change modal
- **Live preview diamonds** in change modal that update dynamically as selections change
- **Custom slider styling** with progressive color fill (cyan/magenta) as slider moves
- **Decimal format** for carat display (0.5 instead of 0.50, 1.0 instead of 1.00)

### Changed
- **Increased diamond and dime scale** from 4x to 5x (25% larger) for better visibility
- **Updated logo** from Logo.svg to Logo 2.svg
- **Redesigned change modal** with major UX improvements:
  - Always slides up from bottom on all screen sizes (no centered modal on desktop)
  - Dark gray background (#252525) matching main comparison area
  - Live preview section at top showing both diamonds side-by-side
  - Side-by-side controls layout for better space utilization
  - Removed "Carat:" and "Shape:" labels (self-explanatory)
  - Compact 5-column shape selector grid
  - Only selected shapes show colored borders (cyan/magenta)
- **Slider improvements**:
  - Increased thumb size from 16px to 24px with 3px white border
  - Added shadow to thumbs for better visibility
  - Progressive color fill effect showing selection progress
  - Narrower width with horizontal padding
  - Bolder, larger end labels (0.25 and 4.00)
- **Increased spacing** between left and right control sections in modal (gap-8)
- **Animation optimization**:
  - Fixed flickering when adjusting carat sliders
  - Smooth size transitions instead of remounting components
  - Only remount on shape change, not carat change

### Fixed
- **State synchronization** issue where URL changes weren't updating component state
- **Modal close behavior** - removed auto-close on changes, only closes on Apply button or user interaction
- **Diamond reload flickering** - changed animation keys to prevent unnecessary remounting
- **SVG caching** - added cache-busting to ensure updated SVGs are loaded
- **Preview diamond flickering** in change modal when dragging sliders

### Technical Changes
- Added `useEffect` in ComparisonArea to sync state with URL parameter changes
- Updated `DiamondDisplay` component to animate size changes without remounting
- Created custom CSS classes for slider styling (`.slider-cyan`, `.slider-magenta`)
- Implemented dynamic CSS variable (`--value`) for slider fill percentage
- Enhanced modal with backdrop blur and border styling

## File Structure Changes
- All diamond SVG files updated from `/SVG` directory to `/public/svg/diamonds`
- New logo file: `Logo 2.svg` in `/public/svg`

## Design System Updates
- **Colors**:
  - Left diamond: #07F4FF (cyan)
  - Right diamond: #FA06FF (magenta)
  - Main background: #252525 (dark gray)
  - Modal background: #252525 (matches main)
  - Slider track: #4a4a4a (medium gray)

- **Typography**:
  - Carat numbers: text-3xl (increased 25% from text-2xl)
  - Shape names: text-xl (increased 25% from text-base)
  - Slider labels: text-sm, bold

- **Spacing**:
  - Modal controls gap: 2rem (gap-8)
  - Diamond scale: 5x (25% increase)
  - Slider thumbs: 24px diameter

## Browser Compatibility
- Custom range slider styling with vendor prefixes for WebKit and Mozilla
- Backdrop blur effect (modern browsers)
- CSS custom properties for dynamic slider fill
