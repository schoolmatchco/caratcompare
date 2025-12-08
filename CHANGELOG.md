# Changelog

All notable changes to the Carat Compare project are documented in this file.

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
