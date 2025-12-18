# Diamond Comparison Video Generator

Complete guide to generate and upload 1,200+ diamond comparison videos to YouTube.

---

## Overview

This system automatically generates short-form YouTube videos (15-20 seconds) comparing diamond sizes and shapes. Each video shows:
1. Your logo
2. Dime reference
3. Two diamonds sliding in from left/right
4. Measurements and carat information
5. Call-to-action to visit your website

**Output:** YouTube Shorts-optimized vertical videos (1080x1920) with SEO-optimized titles, descriptions, and affiliate links.

---

## Quick Start (5 Steps)

### 1. Install Dependencies

```bash
# Navigate to project directory
cd "/Volumes/NAS/AI Repository/Projects/Carat Compare"

# Install Python packages
pip3 install moviepy pillow cairosvg google-api-python-client google-auth-oauthlib google-auth-httplib2
```

**Note:** This may take a few minutes. MoviePy will also install FFmpeg if needed.

### 2. Generate Pilot Videos

```bash
# Generate 20 test videos
python3 scripts/generate_videos.py
```

**Output:**
- 20 videos in `generated_videos/` folder
- Metadata files with titles, descriptions, tags
- Each video is ~1-2MB, 20 seconds long

**Time:** ~30-60 minutes (depending on your computer)

### 3. Review Videos

```bash
# Open output folder
open generated_videos/
```

Watch a few videos to make sure they look good:
- Logo fades in/out nicely?
- Diamonds slide in smoothly?
- Text is readable?
- Colors match your brand?

### 4. Set Up YouTube API (First Time Only)

**A. Create Google Cloud Project**

1. Go to https://console.cloud.google.com/
2. Click "Create Project"
3. Name it "Carat Compare Videos"
4. Click "Create"

**B. Enable YouTube API**

1. In your project, go to "APIs & Services" → "Library"
2. Search for "YouTube Data API v3"
3. Click it, then click "Enable"

**C. Create Credentials**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Configure consent screen:
   - User Type: External
   - App name: Carat Compare Video Uploader
   - User support email: your email
   - Developer contact: your email
   - Save
4. Create OAuth client ID:
   - Application type: Desktop app
   - Name: Video Uploader
   - Click "Create"
5. Download credentials:
   - Click the download icon next to your client ID
   - Save as `client_secrets.json`
   - Move to: `/Volumes/NAS/AI Repository/Projects/Carat Compare/scripts/`

### 5. Upload to YouTube

```bash
# Upload first batch (50 videos max to avoid spam detection)
python3 scripts/upload_to_youtube.py
```

**First run:**
- Browser will open
- Log in to your YouTube account
- Click "Allow"
- Return to terminal

**Subsequent uploads:** Won't need browser login (credentials saved)

**Upload limits:**
- Script uploads max 50 videos per run
- 10 second delay between uploads
- Run multiple times for more videos

---

## Detailed Instructions

### Video Generation

#### Generate All Videos (1,227 total)

Edit `scripts/generate_videos.py` to generate all comparisons instead of just 20 pilots:

```python
# Find this function at the bottom of generate_videos.py
def generate_all_videos():
    """Generate ALL 1,227 comparison videos"""
    OUTPUT_DIR.mkdir(exist_ok=True)

    # All carat options
    carats = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75, 4.00]

    # All shape options
    shapes = ['round', 'princess', 'cushion', 'emerald', 'asscher', 'heart', 'pear', 'oval', 'marquise', 'radiant']

    comparisons = []

    # Generate all same-shape comparisons
    for shape in shapes:
        for i, carat1 in enumerate(carats):
            for carat2 in carats[i+1:]:  # Only larger carats
                comparisons.append((carat1, shape, carat2, shape))

    # Generate cross-shape comparisons (same carat)
    for carat in carats:
        for i, shape1 in enumerate(shapes):
            for shape2 in shapes[i+1:]:
                comparisons.append((carat, shape1, carat, shape2))

    print(f"Total comparisons to generate: {len(comparisons)}")

    # Generate each video
    for i, (carat1, shape1, carat2, shape2) in enumerate(comparisons, 1):
        # ... rest of generation code same as generate_pilot_videos()

# Replace the call at bottom:
if __name__ == '__main__':
    print("Diamond Comparison Video Generator")
    print("=" * 50)
    generate_all_videos()  # Changed from generate_pilot_videos()
```

**Time estimate:** 15-30 hours for all 1,227 videos (can run overnight)

#### Customize Videos

**Change colors:**
```python
# In generate_videos.py, change these:
CYAN = '#07F4FF'  # Your cyan color
MAGENTA = '#FA06FF'  # Your magenta color
BACKGROUND = '#252525'  # Background color
```

**Change duration:**
```python
DURATION = 20  # Change to 15 or 30 seconds
```

**Add background music:**
```python
# At end of generate_comparison_video():
audio = AudioFileClip('path/to/music.mp3').subclip(0, DURATION)
final = final.set_audio(audio)
```

### YouTube Upload

#### Upload Strategy

**Recommended approach:**
1. **Week 1:** Upload 20 pilot videos
2. **Monitor for 2-4 weeks:** Track views, CTR, rankings
3. **Week 5+:** If successful, upload 50-100/day until all done

**Avoid spam detection:**
- Max 50-100 uploads per day
- Use 10+ second delay between uploads
- Upload during off-peak hours
- Don't upload all at once

#### Upload Single Video

```bash
# Upload specific video by slug name
python3 scripts/upload_to_youtube.py "1-round-vs-2-round"
```

#### Check Upload Log

```bash
# See all uploaded videos
cat generated_videos/upload_log.json
```

Output shows:
- Video IDs
- YouTube URLs
- Upload timestamp

### Monitoring & Analytics

#### Track Performance

After uploading, monitor these metrics in YouTube Studio:
- **Views:** How many people watched
- **CTR (Click-Through Rate):** Impressions → Views
- **Retention:** How long people watch
- **Traffic sources:** YouTube search, suggested videos, etc.
- **Description clicks:** People clicking affiliate links

**Where to check:**
1. Go to https://studio.youtube.com
2. Click "Analytics"
3. Filter by video or date range

#### Optimize Based on Data

**If a video performs well:**
- Make a longer version (1-2 minutes)
- Create related comparisons
- Pin engaging comment
- Respond to all comments

**If a video performs poorly:**
- Try different thumbnail
- Update title (make more searchable)
- Improve description (add more keywords)
- Consider deleting if very low views

---

## Troubleshooting

### "MoviePy not found"

```bash
# Reinstall with dependencies
pip3 install moviepy[optional]

# Or manually install FFmpeg:
brew install ffmpeg  # On macOS
```

### "SVG not rendering"

```bash
# Install cairo
brew install cairo  # On macOS
pip3 install cairosvg
```

### "YouTube quota exceeded"

YouTube API has daily quota of 10,000 units. Each upload uses ~1,600 units.

**Solution:**
- Wait 24 hours
- Upload max 6 videos per day
- Request quota increase from Google Cloud Console

### "Upload failed: forbidden"

**Causes:**
1. API not enabled → Enable YouTube Data API v3
2. Wrong credentials → Re-download client_secrets.json
3. Account not verified → Verify your YouTube channel

### "Video quality is low"

Increase resolution in `generate_videos.py`:

```python
# Change these:
WIDTH = 1920  # Higher res
HEIGHT = 3840
```

Note: Higher res = larger files = longer render time

---

## Best Practices

### Titles

**Good:**
- "1ct vs 2ct Round Diamond Size - Actual Comparison #Shorts"
- "Round vs Oval Diamond: Which Looks Bigger? #Shorts"

**Bad:**
- "Diamond comparison video 1" (not descriptive)
- "AMAZING DIAMOND SIZE!!!" (clickbait)

### Descriptions

**Include:**
- Clear explanation in first 2 lines (visible before "Show more")
- Precise measurements
- All 3 affiliate links
- Link to your website
- Relevant hashtags (5-10)
- Affiliate disclosure

**Don't:**
- Stuff keywords unnaturally
- Use misleading info
- Spam links

### Tags

**Use:**
- Specific tags: "1 carat diamond", "round diamond size"
- General tags: "diamond shopping", "engagement ring"
- Brand tags: "carat compare"

**Avoid:**
- Irrelevant tags
- Competitor brand names
- Misleading tags

### Thumbnails

YouTube will auto-generate thumbnails from your video. The frame at 15 seconds (showing both diamonds + dime) is usually the best.

**To set custom thumbnail:**
1. YouTube Studio → Videos
2. Click video → Details
3. Thumbnail → Upload custom (if account verified)

---

## Scaling Up

### Generate All 1,227 Videos

**Option A: Run overnight**
```bash
# Edit generate_videos.py to use generate_all_videos()
# Then run:
nohup python3 scripts/generate_videos.py > video_gen.log 2>&1 &

# Check progress:
tail -f video_gen.log
```

**Option B: Batch processing**
```bash
# Generate in batches of 100
python3 scripts/generate_videos.py --batch 1  # Videos 1-100
python3 scripts/generate_videos.py --batch 2  # Videos 101-200
# etc.
```

### Upload Schedule

**Week 1:** 20 videos (pilots)
**Week 2-3:** Monitor performance
**Week 4+:** 50-100 videos/day until complete

**Total time:** ~3-4 weeks to upload all 1,227 videos

### Automation

**Fully automated pipeline:**

```bash
#!/bin/bash
# auto_upload.sh - Run daily via cron

cd "/Volumes/NAS/AI Repository/Projects/Carat Compare"

# Upload 50 videos with 10s delay
python3 scripts/upload_to_youtube.py

# Log completion
echo "Upload completed: $(date)" >> upload_cron.log
```

Add to crontab:
```bash
# Run daily at 2 AM
0 2 * * * /path/to/auto_upload.sh
```

---

## Expected Results

### Timeline

**Week 1-2:** Minimal views (YouTube learning your content)
**Week 3-4:** Views start trickling in
**Month 2-3:** Steady growth as videos rank
**Month 6+:** Compounding effect, consistent traffic

### Realistic Estimates (After 6 Months)

**Conservative:**
- 50 views/video/month average
- Total: 61,350 views/month
- Description CTR: 2% = 1,227 clicks
- Conversion: 1.5% = 18 sales
- Commission: $100/sale = $1,800/month

**Moderate:**
- 100 views/video/month average
- Total: 122,700 views/month
- 2% CTR = 2,454 clicks
- 2% conversion = 49 sales
- $100/sale = $4,900/month

**Optimistic:**
- 200 views/video/month (some go viral)
- Total: 245,400 views/month
- 3% CTR = 7,362 clicks
- 2.5% conversion = 184 sales
- $100/sale = $18,400/month

**Reality:** Probably somewhere in between conservative and moderate after 6-12 months of consistent posting.

---

## Next Steps

1. **Run pilot test** (20 videos)
2. **Wait 4 weeks** and monitor performance
3. **Analyze data:**
   - Which videos got most views?
   - What search terms drove traffic?
   - What's the CTR on affiliate links?
4. **Decide:**
   - If successful → Scale to all 1,227 videos
   - If mediocre → Keep top 50-100 performers
   - If failure → Pivot or abandon

---

## Support

**Script errors:**
- Check logs in terminal output
- Verify file paths are correct
- Ensure all dependencies installed

**YouTube issues:**
- Check YouTube Studio for upload status
- Verify API quotas in Google Cloud Console
- Ensure channel is in good standing

**Questions:**
- See YOUTUBE_VIDEO_STRATEGY.md for strategic overview
- Check comments in generate_videos.py for code details

---

**Good luck! This could be a game-changer for your affiliate revenue.** 🚀
