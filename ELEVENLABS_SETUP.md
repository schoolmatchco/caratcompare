# ElevenLabs Setup for Premium Voice

## Get Your API Key

1. **Go to:** https://elevenlabs.io/
2. **Sign up** for a free account
3. **Free tier includes:** 10,000 characters/month (enough for ~300 videos)
4. **Get API key:**
   - Go to Profile Settings
   - Click "API Keys"
   - Copy your API key

## Add to Environment

```bash
# Edit your .env.local file
nano .env.local

# Add this line:
ELEVENLABS_API_KEY=your_api_key_here
```

Or export it temporarily:
```bash
export ELEVENLABS_API_KEY="your_api_key_here"
```

## Pricing

**Free Tier:**
- 10,000 characters/month
- ~300 videos (30 chars each)
- Perfect for testing

**Paid Tier (Starter - $5/month):**
- 30,000 characters/month
- ~1,000 videos
- Enough for all your videos in one month

**Cost for all 1,227 videos:**
- ~36,000 characters total
- One month of Starter plan = $5
- Or buy credits: ~$7 one-time

## Voice Options

Popular voices to try:
- **Rachel** - American female, clear and friendly
- **Adam** - American male, professional
- **Bella** - American female, young and energetic
- **Josh** - American male, warm and conversational

You can test different voices at: https://elevenlabs.io/voice-library

## Usage

Once you have your API key, run:

```bash
# Set your API key
export ELEVENLABS_API_KEY="your_key_here"

# Generate video with ElevenLabs voice
python3 scripts/generate_premium_video_elevenlabs.py 1.0 round 2.0 heart
```

## Character Count Estimate

Average script: ~35 characters
- "Let's compare the size of a 1.5 carat oval shaped diamond to a 2.0 carat round diamond."

For 1,227 videos:
- 1,227 × 35 = 42,945 characters
- Cost: ~$7-10 one-time (or $5/month subscription)

Much better than recording 1,227 videos yourself! 🎙️
