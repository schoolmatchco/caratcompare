# YouTube Video Generation - Session Documentation
**Date:** December 18, 2024
**Status:** 🟡 In Progress - Testing New Script
**Purpose:** Create automated YouTube Shorts & TikTok videos for diamond comparisons

---

## What We're Doing

Creating a system to automatically generate 1,227 short-form videos (one for each comparison page on caratcompare.co) to:
1. Drive traffic from YouTube and TikTok
2. Generate affiliate revenue through video descriptions
3. Rank in YouTube search for diamond comparison queries
4. Create backlinks and brand awareness

---

## Current Progress

### ✅ Completed Steps

1. **Initial Strategy & Planning**
   - Created `YOUTUBE_VIDEO_STRATEGY.md` - Full strategy document
   - Decided on YouTube Shorts format (1080x1920 vertical)
   - Planned 1,227 videos (one per comparison page)

2. **Script Development** (Multiple Iterations)
   - `generate_videos.py` - First attempt (MoviePy issues)
   - `upload_to_youtube.py` - YouTube API upload script
   - `README_VIDEO_GENERATION.md` - Setup instructions
   - `convert_svgs_to_png.py` - SVG conversion tool
   - `generate_videos_simple.py` - Simplified version (circles, ugly)
   - **`generate_videos_v2.py` ← CURRENT BEST VERSION**

3. **Assets Prepared**
   - Real US dime photo saved: `us-dime.png` (5.4MB)
   - Diamond SVGs exist in: `/SVG/` folder
   - Diamond dimension data: `data/diamond-sizes.json`

4. **Dependencies Installed**
   ```bash
   pip3 install moviepy pillow
   # Note: svglib/reportlab/cairosvg had build issues, skipping them
   ```

### 🟡 Current Status

**Working on:** `scripts/generate_videos_v2.py`

This version:
- ✅ Uses REAL dime photo (`us-dime.png`)
- ✅ Creates professional faceted diamond graphics (not circles)
- ✅ Accurate sizing (17.9mm dime reference, ~15px/mm scale)
- ✅ YouTube Shorts & TikTok format (1080x1920)
- ✅ Generates only 3 test videos first
- ✅ Includes affiliate link placeholders in metadata
- ✅ 20-second videos (intro → comparison → CTA)

**Next Step:** Test the v2 script to see if videos look good

---

## How to Run (When Ready)

### Generate 3 Test Videos

```bash
cd "/Volumes/NAS/AI Repository/Projects/Carat Compare"
python3 scripts/generate_videos_v2.py
```

**Output:**
- 3 videos in `generated_videos/` folder
- 3 metadata JSON files with titles/descriptions/tags
- Each video ~20 seconds, 1080x1920 resolution

**Test comparisons:**
1. `1.0-round-vs-2.0-round.mp4` (most searched)
2. `1.0-round-vs-1.0-oval.mp4` (shape comparison)
3. `1.5-round-vs-2.0-round.mp4` (upgrade path)

### Upload to YouTube

```bash
# First time only: Set up YouTube API credentials
# 1. Go to https://console.cloud.google.com/
# 2. Create project, enable YouTube Data API v3
# 3. Create OAuth 2.0 credentials
# 4. Download as client_secrets.json in scripts/ folder

python3 scripts/upload_to_youtube.py
```

---

## Video Structure (20 seconds)

### Intro (0-3s)
- Logo fade in: "CARAT COMPARE"
- Dark gray background

### Main Comparison (3-15s)
- US Dime in center (real photo)
- Left diamond (cyan, accurate size)
- Right diamond (magenta, accurate size)
- Labels showing carat & shape
- Size measurements in mm
- Gentle scale-in animation

### Outro/CTA (15-20s)
- "caratcompare.co"
- "Compare Any Diamond Size"
- Fade to black

---

## Metadata Format

Each video gets a JSON file with:

**Title:**
`{carat1} Carat {Shape1} vs {carat2} Carat {Shape2} Diamond Size Comparison #shorts`

**Description:**
```
See the ACTUAL size difference between a X carat [shape] and Y carat [shape] diamond...

📊 Accurate Measurements:
• Xct Shape: Real dimensions
• Yct Shape: Real dimensions

🛍️ Shop X Carat Shape Diamonds:
Blue Nile: [affiliate link]
James Allen: [affiliate link]
Brilliant Earth: [affiliate link]

✨ Compare any diamond size: https://www.caratcompare.co
```

**Tags:** Diamond size, carat comparison, engagement ring, etc.

---

## Key Technical Details

### Sizing Math (CRITICAL)
```python
DIME_MM = 17.9          # Real dime diameter
DIME_PX = 270           # Target dime size on screen
SCALE = DIME_PX / DIME_MM  # ~15 pixels per mm

diamond_px = diamond_mm * SCALE  # Accurate sizing!
```

### Video Specs
- **Resolution:** 1080 x 1920 (9:16 vertical)
- **FPS:** 30
- **Duration:** 20 seconds
- **Codec:** H.264 (libx264)
- **Format:** MP4
- **File size:** ~200-250KB per video

### Assets Used
1. **Dime:** Real photo from `us-dime.png`
2. **Diamonds:** Programmatically generated faceted gems
   - Multi-layer for depth
   - Highlight spots for shine
   - Facet lines for sparkle
   - Brand colors (cyan #07F4FF, magenta #FA06FF)
3. **Background:** Dark gray #252525
4. **Font:** Arial Bold (system font)

---

## Issues Encountered & Solutions

### Issue 1: MoviePy 2.x API Changes
**Problem:** `set_start()` method doesn't exist
**Solution:** Changed to `with_start()`

### Issue 2: Cairo Library Build Failures
**Problem:** cairosvg/pycairo won't install on Mac (missing pkg-config)
**Solution:** Skipped SVG conversion, created programmatic diamonds instead

### Issue 3: First Videos Looked "Terrible"
**Problem:** Using simple circles instead of diamonds
**Solution:** Created faceted gem graphics with highlights and sparkle

### Issue 4: Image Upload Failed (5MB limit)
**Problem:** Couldn't upload dime PNG through Claude Code
**Solution:** User manually saved it as `us-dime.png` in project root

---

## Files Created This Session

```
scripts/
├── generate_videos.py (v1 - MoviePy issues)
├── generate_videos_simple.py (v1.5 - circles, ugly)
├── generate_videos_v2.py (v2 - CURRENT, professional)
├── upload_to_youtube.py (YouTube API uploader)
├── convert_svgs_to_png.py (not used due to Cairo issues)
└── README_VIDEO_GENERATION.md (setup guide)

Documentation:
├── YOUTUBE_VIDEO_STRATEGY.md (full strategy)
└── YOUTUBE_VIDEO_GENERATION_SESSION_DEC_18.md (this file)

Assets:
└── us-dime.png (real dime photo, 5.4MB)
```

---

## Next Steps (After Testing)

### If Videos Look Good:
1. Review the 3 test videos
2. Check metadata files for accuracy
3. Update affiliate links in metadata template
4. Scale to all 1,227 comparisons:
   ```python
   # Edit generate_videos_v2.py line 323-328
   # Load all comparisons from sitemap instead of just 3
   ```
5. Upload in batches (50-100 per day to avoid spam detection)

### If Videos Need Tweaking:
- Adjust sizing/positioning
- Change animation timing
- Update text/labels
- Modify colors/styling

---

## Affiliate Link Integration

**Current State:** Placeholders in metadata
**Need to add:**

```python
# Blue Nile deep link format:
f"https://www.bluenile.com/diamond-search?CaratFrom={carat}&CaratTo={carat}&Shape={shape}&a_aid=6938679a08145&a_cid=55e51e63"

# James Allen deep link format:
f"https://www.jamesallen.com/loose-diamonds/all-diamonds/?Shape={shape}&CaratFrom={carat}&CaratTo={carat}&a_aid=6938679a08145&a_cid=dfef9309"

# Brilliant Earth (shape-specific):
# See BACKUP_DEC_18_2024.md lines 113-122 for full mapping
```

---

## Revenue Projections

**Conservative (6 months):**
- 1,227 videos @ 100 views/mo each = 122,700 views/mo
- 3% CTR on affiliate links = 3,681 clicks/mo
- 2% conversion = 74 sales/mo
- $25 avg commission = **$1,800/mo**

**Realistic (12 months):**
- Same videos @ 250 views/mo = 306,750 views/mo
- 4% CTR = 12,270 clicks/mo
- 3% conversion = 368 sales/mo
- $25 avg commission = **$9,200/mo**

---

## Testing Checklist

### Before Bulk Generation:
- [ ] Generate 3 test videos
- [ ] Check video quality (clarity, sizing, animations)
- [ ] Verify dime photo looks good
- [ ] Confirm diamond graphics are professional
- [ ] Test on mobile device (YouTube Shorts app)
- [ ] Check metadata formatting
- [ ] Update affiliate links in template
- [ ] Upload 1 test video to YouTube
- [ ] Monitor for 1 week (views, CTR, conversions)

### If Successful:
- [ ] Generate all 1,227 videos
- [ ] Upload 50-100 per day
- [ ] Create YouTube channel description
- [ ] Add channel banner
- [ ] Create first community post
- [ ] Monitor analytics weekly

---

## Quick Command Reference

```bash
# Navigate to project
cd "/Volumes/NAS/AI Repository/Projects/Carat Compare"

# Generate 3 test videos
python3 scripts/generate_videos_v2.py

# View generated videos
open generated_videos/

# Upload to YouTube (after OAuth setup)
python3 scripts/upload_to_youtube.py

# Check video file sizes
ls -lh generated_videos/*.mp4

# Count generated videos
ls generated_videos/*.mp4 | wc -l
```

---

## Important Notes

1. **Dime image MUST exist:** `us-dime.png` in project root
2. **Data file MUST exist:** `data/diamond-sizes.json`
3. **Videos are 1080x1920** - perfect for YouTube Shorts AND TikTok
4. **No audio** - videos are silent (shorts/reels trend)
5. **Accurate sizing is critical** - that's the whole value prop
6. **Test on mobile first** - most shorts views are mobile

---

## If Claude Code Crashes Again

**Where we left off:**
1. Created `generate_videos_v2.py` script
2. Dime photo is saved as `us-dime.png`
3. About to test generate 3 videos
4. If successful, will scale to all 1,227

**To resume:**
```bash
cd "/Volumes/NAS/AI Repository/Projects/Carat Compare"
python3 scripts/generate_videos_v2.py
# Then check the output in generated_videos/
```

**Key files to review:**
- `scripts/generate_videos_v2.py` - Latest working script
- `YOUTUBE_VIDEO_STRATEGY.md` - Full strategy
- This file - Session notes

---

**Last Updated:** December 18, 2024
**Next Action:** Run `python3 scripts/generate_videos_v2.py` and test output
