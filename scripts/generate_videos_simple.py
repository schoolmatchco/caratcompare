#!/usr/bin/env python3
"""
Simplified Diamond Comparison Video Generator
No Cairo dependency - uses PIL only for simple shapes

Requirements:
    pip install moviepy pillow
"""

import os
import json
import numpy as np
from pathlib import Path
from moviepy import VideoClip, CompositeVideoClip
from PIL import Image, ImageDraw, ImageFont

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / 'generated_videos'
DATA_FILE = PROJECT_ROOT / 'data' / 'diamond-sizes.json'

# Video settings
WIDTH = 1080
HEIGHT = 1920
FPS = 30
DURATION = 20

# Colors
CYAN = '#07F4FF'
MAGENTA = '#FA06FF'
BACKGROUND = '#252525'
WHITE = '#FFFFFF'

def load_diamond_data():
    """Load diamond dimensions from JSON"""
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_text_image(text, font_size=80, color=WHITE, size=(WIDTH, 200), bold=False):
    """Create an image with text"""
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Try to load a nice font
    try:
        if bold:
            font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', font_size)
        else:
            font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', font_size)
    except:
        font = ImageFont.load_default()

    # Center the text
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size[0] - text_width) // 2
    y = (size[1] - text_height) // 2

    rgb_color = hex_to_rgb(color) if isinstance(color, str) and color.startswith('#') else color
    draw.text((x, y), text, font=font, fill=rgb_color)
    return img

def create_background():
    """Create dark background"""
    bg_rgb = hex_to_rgb(BACKGROUND)
    return Image.new('RGB', (WIDTH, HEIGHT), bg_rgb)

def create_circle(diameter, color, label=None):
    """Create a simple circle to represent a diamond"""
    img = Image.new('RGBA', (diameter, diameter), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw circle with gradient-like effect
    rgb_color = hex_to_rgb(color) if isinstance(color, str) and color.startswith('#') else color

    # Main circle
    draw.ellipse([0, 0, diameter-1, diameter-1], fill=rgb_color, outline=(255, 255, 255, 128), width=3)

    # Inner highlight for sparkle effect
    highlight_size = int(diameter * 0.3)
    highlight_pos = int(diameter * 0.2)
    draw.ellipse(
        [highlight_pos, highlight_pos, highlight_pos + highlight_size, highlight_pos + highlight_size],
        fill=(255, 255, 255, 100)
    )

    return img

def get_dimensions(carat, shape, diamond_data):
    """Get diamond dimensions"""
    carat_key = f"{carat:.2f}"
    shape_data = diamond_data.get(shape, {})
    dims = shape_data.get(carat_key, {'width': 5.0, 'height': 5.0})
    return dims['width'], dims['height']

def format_carat(carat):
    """Format carat for display"""
    if carat % 1 == 0 or carat % 1 == 0.5:
        return f"{carat:.1f}"
    return f"{carat:.2f}"

def generate_comparison_video(carat1, shape1, carat2, shape2, output_path):
    """Generate a single comparison video using simple circles"""
    print(f"Generating: {carat1}ct {shape1} vs {carat2}ct {shape2}")

    # Load data
    diamond_data = load_diamond_data()
    width1, height1 = get_dimensions(carat1, shape1, diamond_data)
    width2, height2 = get_dimensions(carat2, shape2, diamond_data)

    # Scale for visibility
    SCALE = 15
    diamond1_px = int(width1 * SCALE)
    diamond2_px = int(width2 * SCALE)
    dime_px = int(17.9 * SCALE)

    # Create assets
    bg = create_background()

    # Create simple representations
    dime = create_circle(dime_px, '#C0C0C0')  # Silver color for dime
    diamond1 = create_circle(diamond1_px, CYAN)
    diamond2 = create_circle(diamond2_px, MAGENTA)

    clips = []

    # --- INTRO: Logo text (0-3s) ---
    def make_intro_frame(t):
        frame = bg.copy()

        # Fade in/out
        if t < 0.5:
            alpha = int(255 * (t / 0.5))
        elif t > 2.5:
            alpha = int(255 * (1 - (t - 2.5) / 0.5))
        else:
            alpha = 255

        logo_text = create_text_image("CARAT COMPARE", font_size=120, color=WHITE, bold=True)
        logo_text.putalpha(alpha)

        x = (WIDTH - logo_text.size[0]) // 2
        y = (HEIGHT - logo_text.size[1]) // 2
        frame.paste(logo_text, (x, y), logo_text)

        return np.array(frame)

    intro_clip = VideoClip(make_intro_frame, duration=3)
    clips.append(intro_clip)

    # --- MAIN: Comparison (3-15s) ---
    def make_comparison_frame(t):
        frame = bg.copy()

        # Slide-in animation
        slide_progress = min(t, 1.0)

        # Dime in center
        dime_x = (WIDTH - dime.size[0]) // 2
        dime_y = (HEIGHT - dime.size[1]) // 2
        frame.paste(dime, (dime_x, dime_y), dime)

        # Left diamond (slides from left)
        d1_x = int((WIDTH // 4 - diamond1.size[0] // 2) * slide_progress - diamond1.size[0] * (1 - slide_progress))
        d1_y = dime_y + (dime.size[1] - diamond1.size[1]) // 2
        if d1_x + diamond1.size[0] > 0:
            frame.paste(diamond1, (d1_x, d1_y), diamond1)

        # Right diamond (slides from right)
        d2_x_final = 3 * WIDTH // 4 - diamond2.size[0] // 2
        d2_x = int(d2_x_final * slide_progress + WIDTH * (1 - slide_progress))
        d2_y = dime_y + (dime.size[1] - diamond2.size[1]) // 2
        if d2_x < WIDTH:
            frame.paste(diamond2, (d2_x, d2_y), diamond2)

        # Add text labels after slide-in
        if t > 1:
            text_alpha = int(min(255, 255 * (t - 1)))

            # Left diamond label
            label1_text = f"{format_carat(carat1)}ct {shape1.capitalize()}\n{width1:.1f}mm"
            label1 = create_text_image(label1_text, font_size=50, color=CYAN)
            label1.putalpha(text_alpha)
            frame.paste(label1, (WIDTH // 4 - label1.size[0] // 2, d1_y - 180), label1)

            # Right diamond label
            label2_text = f"{format_carat(carat2)}ct {shape2.capitalize()}\n{width2:.1f}mm"
            label2 = create_text_image(label2_text, font_size=50, color=MAGENTA)
            label2.putalpha(text_alpha)
            frame.paste(label2, (3 * WIDTH // 4 - label2.size[0] // 2, d2_y - 180), label2)

            # Dime label
            dime_label = create_text_image("US Dime\n17.9mm", font_size=40, color=WHITE)
            dime_label.putalpha(text_alpha)
            frame.paste(dime_label, (WIDTH // 2 - dime_label.size[0] // 2, dime_y + dime.size[1] + 20), dime_label)

        return np.array(frame)

    comparison_clip = VideoClip(make_comparison_frame, duration=12).with_start(3)
    clips.append(comparison_clip)

    # --- OUTRO: Website (15-20s) ---
    def make_outro_frame(t):
        frame = bg.copy()
        alpha = int(min(255, 255 * t))

        # Main URL
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

    outro_clip = VideoClip(make_outro_frame, duration=5).with_start(15)
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
    """Generate YouTube metadata"""
    c1 = format_carat(carat1)
    c2 = format_carat(carat2)
    s1 = shape1.capitalize()
    s2 = shape2.capitalize()

    title = f"{c1}ct {s1} vs {c2}ct {s2} Diamond Size Comparison #Shorts"

    def build_affiliate_url(retailer, carat, shape):
        if retailer == 'bluenile':
            return f"https://www.bluenile.com/diamond-search?CaratFrom={carat}&CaratTo={carat}&Shape={shape}-cut&a_aid=6938679a08145&a_cid=55e51e63"
        elif retailer == 'jamesallen':
            return f"https://www.jamesallen.com/loose-diamonds/all-diamonds/?Shape={shape}-cut&CaratFrom={carat}&CaratTo={carat}&a_aid=6938679a08145&a_cid=dfef9309"
        else:
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

    diamond_data = load_diamond_data()
    width1, height1 = get_dimensions(carat1, shape1, diamond_data)
    width2, height2 = get_dimensions(carat2, shape2, diamond_data)

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

Compare over 1,200 diamond sizes at CaratCompare.co!

#diamondsize #engagementring #diamondcomparison #{shape1}diamond #{shape2}diamond #caratsize #diamondshopping

---
Disclosure: Affiliate links support this channel at no extra cost to you."""

    tags = [
        'diamond size',
        'diamond comparison',
        f'{shape1} diamond',
        f'{shape2} diamond',
        f'{c1} carat diamond',
        f'{c2} carat diamond',
        'engagement ring',
        'diamond shopping',
        'carat compare'
    ]

    return {
        'title': title,
        'description': description,
        'tags': tags[:15],
        'category': '26'
    }

def generate_pilot_videos():
    """Generate 20 pilot videos"""
    OUTPUT_DIR.mkdir(exist_ok=True)

    comparisons = [
        (0.5, 'round', 1.0, 'round'),
        (0.75, 'round', 1.0, 'round'),
        (1.0, 'round', 1.5, 'round'),
        (1.0, 'round', 2.0, 'round'),
        (1.5, 'round', 2.0, 'round'),
        (1.0, 'round', 1.0, 'oval'),
        (1.0, 'round', 1.0, 'princess'),
        (1.0, 'round', 1.0, 'cushion'),
        (1.5, 'round', 1.5, 'oval'),
        (2.0, 'round', 2.0, 'oval'),
        (1.0, 'oval', 1.5, 'oval'),
        (1.0, 'oval', 2.0, 'oval'),
        (1.0, 'cushion', 1.5, 'cushion'),
        (1.0, 'princess', 1.5, 'princess'),
        (0.25, 'round', 0.5, 'round'),
        (0.5, 'round', 0.75, 'round'),
        (2.0, 'round', 3.0, 'round'),
        (3.0, 'round', 4.0, 'round'),
        (1.0, 'pear', 1.5, 'pear'),
        (1.0, 'emerald', 1.5, 'emerald'),
    ]

    for i, (carat1, shape1, carat2, shape2) in enumerate(comparisons, 1):
        c1 = format_carat(carat1)
        c2 = format_carat(carat2)
        slug = f"{c1}-{shape1}-vs-{c2}-{shape2}"

        video_path = OUTPUT_DIR / f"{slug}.mp4"

        if video_path.exists():
            print(f"⊘ Skipping (exists): {slug}")
            continue

        try:
            generate_comparison_video(carat1, shape1, carat2, shape2, video_path)

            metadata = generate_metadata(carat1, shape1, carat2, shape2, slug)
            metadata_path = OUTPUT_DIR / f"{slug}_metadata.json"
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)

            print(f"✓ Completed {i}/{len(comparisons)}: {slug}")

        except Exception as e:
            print(f"✗ Error generating {slug}: {e}")
            import traceback
            traceback.print_exc()
            continue

if __name__ == '__main__':
    print("Diamond Comparison Video Generator (Simplified)")
    print("=" * 50)
    generate_pilot_videos()
    print("\n✓ All done! Videos saved to:", OUTPUT_DIR)
