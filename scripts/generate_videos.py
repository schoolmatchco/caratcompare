#!/usr/bin/env python3
"""
Diamond Comparison Video Generator for YouTube
Generates short-form videos comparing diamond sizes

Requirements:
    pip install moviepy pillow cairosvg
"""

import os
import json
from pathlib import Path
from moviepy.editor import *
from PIL import Image, ImageDraw, ImageFont
import cairosvg
from io import BytesIO

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / 'generated_videos'
ASSETS_DIR = PROJECT_ROOT / 'public'
DATA_FILE = PROJECT_ROOT / 'data' / 'diamond-sizes.json'

# Video settings
WIDTH = 1080  # For YouTube Shorts (vertical)
HEIGHT = 1920
FPS = 30
DURATION = 20  # 20 seconds total

# Colors (matching your brand)
CYAN = '#07F4FF'
MAGENTA = '#FA06FF'
BACKGROUND = '#252525'
WHITE = '#FFFFFF'

def load_diamond_data():
    """Load diamond dimensions from JSON"""
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def svg_to_image(svg_path, size=(400, 400)):
    """Convert SVG to PIL Image"""
    png_data = cairosvg.svg2png(url=str(svg_path), output_width=size[0], output_height=size[1])
    return Image.open(BytesIO(png_data)).convert('RGBA')

def create_text_image(text, font_size=80, color=WHITE, size=(WIDTH, 200)):
    """Create an image with text"""
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Try to load a nice font, fall back to default
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', font_size)
    except:
        font = ImageFont.load_default()

    # Center the text
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size[0] - text_width) // 2
    y = (size[1] - text_height) // 2

    draw.text((x, y), text, font=font, fill=color)
    return img

def create_background():
    """Create dark background"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BACKGROUND)
    return img

def get_dimensions(carat, shape, diamond_data):
    """Get diamond dimensions for given carat and shape"""
    carat_key = f"{carat:.2f}"
    shape_data = diamond_data.get(shape, {})
    dims = shape_data.get(carat_key, {'width': 5.0, 'height': 5.0})
    return dims['width'], dims['height']

def format_carat(carat):
    """Format carat for display (1.0 -> 1, 1.5 -> 1.5, 0.75 -> 0.75)"""
    if carat % 1 == 0 or carat % 1 == 0.5:
        return f"{carat:.1f}"
    return f"{carat:.2f}"

def generate_comparison_video(carat1, shape1, carat2, shape2, output_path):
    """
    Generate a single comparison video

    Args:
        carat1: First diamond carat size
        shape1: First diamond shape
        carat2: Second diamond carat size
        shape2: Second diamond shape
        output_path: Where to save the video
    """
    print(f"Generating: {carat1}ct {shape1} vs {carat2}ct {shape2}")

    # Load data
    diamond_data = load_diamond_data()
    width1, height1 = get_dimensions(carat1, shape1, diamond_data)
    width2, height2 = get_dimensions(carat2, shape2, diamond_data)

    # Calculate pixel sizes (scale factor for visibility)
    SCALE = 15  # pixels per mm
    diamond1_px = int(width1 * SCALE)
    diamond2_px = int(width2 * SCALE)
    dime_px = int(17.9 * SCALE)  # Dime is 17.9mm

    # Create background
    bg = create_background()

    # Load and resize assets
    logo_path = ASSETS_DIR / 'svg' / 'Logo 3.svg'
    dime_path = ASSETS_DIR / 'svg' / 'Dime.svg'
    diamond1_path = ASSETS_DIR / 'svg' / 'diamonds' / f'{shape1.capitalize()}.svg'
    diamond2_path = ASSETS_DIR / 'svg' / 'diamonds' / f'{shape2.capitalize()}.svg'

    logo = svg_to_image(logo_path, (400, 400))
    dime = svg_to_image(dime_path, (dime_px, dime_px))
    diamond1_img = svg_to_image(diamond1_path, (diamond1_px, diamond1_px))
    diamond2_img = svg_to_image(diamond2_path, (diamond2_px, diamond2_px))

    # Timeline: 20 seconds total
    # 0-3s: Logo fade in/out
    # 3-15s: Comparison (dime + diamonds)
    # 15-20s: Outro (website URL)

    clips = []

    # --- INTRO: Logo (0-3s) ---
    def make_logo_frame(t):
        """Create frame with fading logo"""
        frame = bg.copy()

        # Fade in/out
        if t < 0.5:
            alpha = int(255 * (t / 0.5))
        elif t > 2.5:
            alpha = int(255 * (1 - (t - 2.5) / 0.5))
        else:
            alpha = 255

        # Paste logo in center
        logo_with_alpha = logo.copy()
        logo_with_alpha.putalpha(alpha)

        x = (WIDTH - logo.size[0]) // 2
        y = (HEIGHT - logo.size[1]) // 2
        frame.paste(logo_with_alpha, (x, y), logo_with_alpha)

        return np.array(frame)

    intro_clip = VideoClip(make_logo_frame, duration=3)
    clips.append(intro_clip)

    # --- MAIN: Comparison (3-15s) ---
    def make_comparison_frame(t):
        """Create frame with dime and diamonds"""
        frame = bg.copy()

        # Slide-in animation (0-1s of this clip)
        slide_progress = min(t, 1.0)

        # Dime in center
        dime_x = (WIDTH - dime.size[0]) // 2
        dime_y = (HEIGHT - dime.size[1]) // 2
        frame.paste(dime, (dime_x, dime_y), dime)

        # Left diamond (slides from left)
        d1_x = int((WIDTH // 4 - diamond1_img.size[0] // 2) * slide_progress - diamond1_img.size[0] * (1 - slide_progress))
        d1_y = dime_y + (dime.size[1] - diamond1_img.size[1]) // 2
        if d1_x + diamond1_img.size[0] > 0:  # Only draw if visible
            frame.paste(diamond1_img, (d1_x, d1_y), diamond1_img)

        # Right diamond (slides from right)
        d2_x_final = 3 * WIDTH // 4 - diamond2_img.size[0] // 2
        d2_x = int(d2_x_final * slide_progress + WIDTH * (1 - slide_progress))
        d2_y = dime_y + (dime.size[1] - diamond2_img.size[1]) // 2
        if d2_x < WIDTH:  # Only draw if visible
            frame.paste(diamond2_img, (d2_x, d2_y), diamond2_img)

        # Add text labels (appear after slide-in)
        if t > 1:
            text_alpha = int(min(255, 255 * (t - 1)))

            # Left diamond label
            label1 = create_text_image(
                f"{format_carat(carat1)}ct {shape1.capitalize()}\n{width1:.1f}mm",
                font_size=50,
                color=CYAN
            )
            label1.putalpha(text_alpha)
            frame.paste(label1, (WIDTH // 4 - label1.size[0] // 2, d1_y - 150), label1)

            # Right diamond label
            label2 = create_text_image(
                f"{format_carat(carat2)}ct {shape2.capitalize()}\n{width2:.1f}mm",
                font_size=50,
                color=MAGENTA
            )
            label2.putalpha(text_alpha)
            frame.paste(label2, (3 * WIDTH // 4 - label2.size[0] // 2, d2_y - 150), label2)

        return np.array(frame)

    comparison_clip = VideoClip(make_comparison_frame, duration=12).set_start(3)
    clips.append(comparison_clip)

    # --- OUTRO: Website URL (15-20s) ---
    def make_outro_frame(t):
        """Create frame with website URL"""
        frame = bg.copy()

        # Fade in
        alpha = int(min(255, 255 * t))

        # Main text
        url_text = create_text_image("CaratCompare.co", font_size=90, color=WHITE)
        url_text.putalpha(alpha)
        frame.paste(url_text, (WIDTH // 2 - url_text.size[0] // 2, HEIGHT // 2 - 100), url_text)

        # Subtext
        sub_text = create_text_image("Compare 1,200+ Diamond Sizes", font_size=50, color=WHITE)
        sub_text.putalpha(alpha)
        frame.paste(sub_text, (WIDTH // 2 - sub_text.size[0] // 2, HEIGHT // 2 + 50), sub_text)

        # CTA
        cta_text = create_text_image("Link in Description ↓", font_size=45, color=CYAN)
        cta_text.putalpha(alpha)
        frame.paste(cta_text, (WIDTH // 2 - cta_text.size[0] // 2, HEIGHT // 2 + 200), cta_text)

        return np.array(frame)

    outro_clip = VideoClip(make_outro_frame, duration=5).set_start(15)
    clips.append(outro_clip)

    # Composite and render
    final = CompositeVideoClip(clips, size=(WIDTH, HEIGHT))

    # Write video
    final.write_videofile(
        str(output_path),
        fps=FPS,
        codec='libx264',
        audio=False,
        preset='medium',
        threads=4
    )

    print(f"✓ Saved: {output_path}")

def generate_metadata(carat1, shape1, carat2, shape2, slug):
    """Generate YouTube metadata (title, description, tags)"""

    # Format carats
    c1 = format_carat(carat1)
    c2 = format_carat(carat2)
    s1 = shape1.capitalize()
    s2 = shape2.capitalize()

    # Title (max 100 chars for YouTube)
    title = f"{c1}ct {s1} vs {c2}ct {s2} Diamond Size Comparison #Shorts"

    # Build affiliate URLs
    def build_affiliate_url(retailer, carat, shape):
        if retailer == 'bluenile':
            return f"https://www.bluenile.com/diamond-search?CaratFrom={carat}&CaratTo={carat}&Shape={shape}-cut&a_aid=6938679a08145&a_cid=55e51e63"
        elif retailer == 'jamesallen':
            return f"https://www.jamesallen.com/loose-diamonds/all-diamonds/?Shape={shape}-cut&CaratFrom={carat}&CaratTo={carat}&a_aid=6938679a08145&a_cid=dfef9309"
        else:  # brilliant earth
            urls = {
                'round': 'https://brilliantearth.sjv.io/MAZ2YN',
                'oval': 'https://brilliantearth.sjv.io/kO59Pv',
                'cushion': 'https://brilliantearth.sjv.io/xLBrq3',
                'pear': 'https://brilliantearth.sjv.io/POoRqM',
                'princess': 'https://brilliantearth.sjv.io/e1Dex6',
                'emerald': 'https://brilliantearth.sjv.io/GKaOY6',
                'marquise': 'https://brilliantearth.sjv.io/VxnAjJ',
                'radiant': 'https://brilliantearth.sjv.io/Z62Le0',
                'asscher': 'https://brilliantearth.sjv.io/o4A5ge',
                'heart': 'https://brilliantearth.sjv.io/BnjOV0',
            }
            return urls.get(shape.lower(), urls['round'])

    # Load diamond dimensions for description
    diamond_data = load_diamond_data()
    width1, height1 = get_dimensions(carat1, shape1, diamond_data)
    width2, height2 = get_dimensions(carat2, shape2, diamond_data)

    # Description
    description = f"""Compare {c1} carat {s1} vs {c2} carat {s2} diamonds side-by-side!

See the actual size difference with precise measurements. Perfect for engagement ring shopping.

📏 MEASUREMENTS:
• {c1}ct {s1}: {width1:.1f}mm × {height1:.1f}mm
• {c2}ct {s2}: {width2:.1f}mm × {height2:.1f}mm

💍 SHOP CERTIFIED DIAMONDS:
💎 Blue Nile: {build_affiliate_url('bluenile', carat1, shape1)}
💎 James Allen: {build_affiliate_url('jamesallen', carat1, shape1)}
💎 Brilliant Earth: {build_affiliate_url('brilliantearth', shape1)}

🔗 FULL INTERACTIVE TOOL:
https://www.caratcompare.co/compare/{slug}

Compare over 1,200 diamond sizes at CaratCompare.co - the ultimate diamond size comparison tool!

#diamondsize #engagementring #diamondcomparison #{shape1}diamond #{shape2}diamond #caratsize #diamondshopping #bridetobe #proposal #weddingring

---
Disclosure: Affiliate links above support this channel at no extra cost to you."""

    # Tags
    tags = [
        'diamond size',
        'diamond comparison',
        f'{shape1} diamond',
        f'{shape2} diamond',
        f'{c1} carat diamond',
        f'{c2} carat diamond',
        'engagement ring',
        'diamond shopping',
        'carat compare',
        'diamond size chart',
        'how big is diamond',
        'diamond actual size'
    ]

    return {
        'title': title,
        'description': description,
        'tags': tags[:15],  # YouTube max 15 tags
        'category': '26'  # Howto & Style
    }

def generate_pilot_videos():
    """Generate 20 pilot videos for testing"""

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)

    # High-volume comparisons to test
    comparisons = [
        # Popular round comparisons
        (0.5, 'round', 1.0, 'round'),
        (0.75, 'round', 1.0, 'round'),
        (1.0, 'round', 1.5, 'round'),
        (1.0, 'round', 2.0, 'round'),
        (1.5, 'round', 2.0, 'round'),

        # Shape comparisons (same carat)
        (1.0, 'round', 1.0, 'oval'),
        (1.0, 'round', 1.0, 'princess'),
        (1.0, 'round', 1.0, 'cushion'),
        (1.5, 'round', 1.5, 'oval'),
        (2.0, 'round', 2.0, 'oval'),

        # Popular fancy shapes
        (1.0, 'oval', 1.5, 'oval'),
        (1.0, 'oval', 2.0, 'oval'),
        (1.0, 'cushion', 1.5, 'cushion'),
        (1.0, 'princess', 1.5, 'princess'),

        # Budget comparisons
        (0.25, 'round', 0.5, 'round'),
        (0.5, 'round', 0.75, 'round'),

        # Premium comparisons
        (2.0, 'round', 3.0, 'round'),
        (3.0, 'round', 4.0, 'round'),

        # Mixed
        (1.0, 'pear', 1.5, 'pear'),
        (1.0, 'emerald', 1.5, 'emerald'),
    ]

    # Generate each video
    for i, (carat1, shape1, carat2, shape2) in enumerate(comparisons, 1):
        # Create slug
        c1 = format_carat(carat1)
        c2 = format_carat(carat2)
        slug = f"{c1}-{shape1}-vs-{c2}-{shape2}"

        # Output path
        video_path = OUTPUT_DIR / f"{slug}.mp4"

        # Skip if already exists
        if video_path.exists():
            print(f"⊘ Skipping (exists): {slug}")
            continue

        # Generate video
        try:
            generate_comparison_video(carat1, shape1, carat2, shape2, video_path)

            # Save metadata
            metadata = generate_metadata(carat1, shape1, carat2, shape2, slug)
            metadata_path = OUTPUT_DIR / f"{slug}_metadata.json"
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)

            print(f"✓ Completed {i}/{len(comparisons)}: {slug}")

        except Exception as e:
            print(f"✗ Error generating {slug}: {e}")
            continue

if __name__ == '__main__':
    print("Diamond Comparison Video Generator")
    print("=" * 50)
    generate_pilot_videos()
    print("\n✓ All done! Videos saved to:", OUTPUT_DIR)
    print("\nNext steps:")
    print("1. Review videos in generated_videos/")
    print("2. Upload to YouTube manually or use upload_to_youtube.py")
    print("3. Monitor performance for 2-4 weeks")
