#!/usr/bin/env python3
"""
Professional Diamond Comparison Video Generator V2
Uses real dime photo and clean diamond graphics
Works with YouTube Shorts and TikTok (1080x1920)

Requirements:
    pip install moviepy pillow

Usage:
    python3 scripts/generate_videos_v2.py
"""

import os
import json
import numpy as np
from pathlib import Path
from moviepy import VideoClip
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / 'generated_videos'
DATA_FILE = PROJECT_ROOT / 'data' / 'diamond-sizes.json'
DIME_IMAGE = PROJECT_ROOT / 'us-dime.png'

# Video settings for YouTube Shorts & TikTok
WIDTH = 1080
HEIGHT = 1920
FPS = 30
DURATION = 20

# Brand colors
CYAN = '#07F4FF'
MAGENTA = '#FA06FF'
BACKGROUND = '#252525'
WHITE = '#FFFFFF'
BLACK = '#000000'

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def load_diamond_data():
    """Load diamond dimensions from JSON"""
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def get_dimensions(carat, shape, data):
    """Get diamond dimensions in mm"""
    carat_key = f"{carat:.2f}"
    shape_data = data.get(shape.lower(), {})
    dims = shape_data.get(carat_key, {"width": 5.0, "height": 5.0})
    return dims['width'], dims['height']

def load_and_resize_dime(target_px):
    """Load real dime photo and resize"""
    try:
        dime = Image.open(DIME_IMAGE).convert('RGBA')
        # Resize maintaining aspect ratio
        dime.thumbnail((target_px, target_px), Image.Resampling.LANCZOS)
        return dime
    except FileNotFoundError:
        print(f"⚠ Dime image not found at {DIME_IMAGE}")
        print(f"Creating placeholder dime...")
        # Create silver circle as fallback
        img = Image.new('RGBA', (target_px, target_px), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw.ellipse([0, 0, target_px, target_px], fill=(192, 192, 192, 255))
        return img

def create_diamond_gem(size_px, color):
    """Create a faceted diamond/gem shape"""
    img = Image.new('RGBA', (size_px, size_px), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center = size_px // 2
    radius = size_px // 2

    # Create multi-layer gem effect
    rgb = hex_to_rgb(color)

    # Outer glow
    glow_color = tuple(list(rgb) + [60])
    draw.ellipse([2, 2, size_px-2, size_px-2], fill=glow_color)

    # Main gem body with gradient effect
    for i in range(3):
        offset = i * 2
        alpha = 255 - (i * 30)
        layer_color = tuple(list(rgb) + [alpha])
        draw.ellipse([offset, offset, size_px-offset, size_px-offset], fill=layer_color)

    # Add facet lines for sparkle effect
    draw.line([(0, center), (size_px, center)], fill=(255, 255, 255, 100), width=2)
    draw.line([(center, 0), (center, size_px)], fill=(255, 255, 255, 100), width=2)
    draw.line([(0, 0), (size_px, size_px)], fill=(255, 255, 255, 80), width=1)
    draw.line([(0, size_px), (size_px, 0)], fill=(255, 255, 255, 80), width=1)

    # Highlight spot for shine
    highlight_size = size_px // 4
    highlight_pos = size_px // 3
    draw.ellipse([highlight_pos, highlight_pos,
                  highlight_pos + highlight_size, highlight_pos + highlight_size],
                 fill=(255, 255, 255, 180))

    return img

def create_text_layer(text, font_size, color=WHITE, y_position=100):
    """Create text overlay image"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()

    # Get text dimensions using textbbox
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (WIDTH - text_width) // 2

    # Draw text with shadow
    shadow_offset = 3
    draw.text((x + shadow_offset, y_position + shadow_offset), text,
              fill=(0, 0, 0, 180), font=font)
    draw.text((x, y_position), text, fill=hex_to_rgb(color) + (255,), font=font)

    return img

def generate_comparison_video(carat1, shape1, carat2, shape2, output_path):
    """Generate a single comparison video"""

    print(f"Generating: {carat1}ct {shape1} vs {carat2}ct {shape2}")

    try:
        # Load data
        diamond_data = load_diamond_data()
        width1_mm, height1_mm = get_dimensions(carat1, shape1, diamond_data)
        width2_mm, height2_mm = get_dimensions(carat2, shape2, diamond_data)

        # CRITICAL: Accurate sizing relative to dime
        # US Dime = 17.9mm diameter
        DIME_MM = 17.9
        DIME_PX = 270  # Target dime size (about 1/4 of screen width)
        SCALE = DIME_PX / DIME_MM  # pixels per mm (~15)

        diamond1_px = int(max(width1_mm, height1_mm) * SCALE)
        diamond2_px = int(max(width2_mm, height2_mm) * SCALE)

        # Create assets
        dime = load_and_resize_dime(DIME_PX)
        diamond1 = create_diamond_gem(diamond1_px, CYAN)
        diamond2 = create_diamond_gem(diamond2_px, MAGENTA)

        # Background
        bg = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(BACKGROUND))

        def make_frame(t):
            """Generate frame at time t"""
            frame = bg.copy()

            # Scene timing
            if t < 3:
                # INTRO: Logo fade in (0-3s)
                alpha = min(255, int((t / 3) * 255))
                logo_text = create_text_layer("CARAT COMPARE", 100, WHITE, HEIGHT//2 - 100)
                logo_text.putalpha(alpha)
                frame.paste(logo_text, (0, 0), logo_text)

            elif t < 15:
                # MAIN: Comparison (3-15s)
                # Calculate positions (side by side with dime in center)
                y_center = HEIGHT // 2
                spacing = WIDTH // 4

                # Position elements
                dime_x = (WIDTH - dime.width) // 2
                dime_y = y_center - (dime.height // 2)

                diamond1_x = spacing - (diamond1.width // 2)
                diamond1_y = y_center - (diamond1.height // 2)

                diamond2_x = WIDTH - spacing - (diamond2.width // 2)
                diamond2_y = y_center - (diamond2.height // 2)

                # Animate entrance (3-4s)
                if t < 4:
                    progress = (t - 3)
                    scale = progress
                    alpha = int(progress * 255)
                else:
                    scale = 1.0
                    alpha = 255

                # Paste elements
                if scale > 0:
                    # Dime
                    frame.paste(dime, (dime_x, dime_y), dime)

                    # Diamonds with scale animation
                    d1_scaled = diamond1 if scale >= 1 else diamond1.resize(
                        (int(diamond1.width * scale), int(diamond1.height * scale)),
                        Image.Resampling.LANCZOS
                    )
                    d2_scaled = diamond2 if scale >= 1 else diamond2.resize(
                        (int(diamond2.width * scale), int(diamond2.height * scale)),
                        Image.Resampling.LANCZOS
                    )

                    d1_x = diamond1_x + (diamond1.width - d1_scaled.width) // 2
                    d1_y = diamond1_y + (diamond1.height - d1_scaled.height) // 2
                    d2_x = diamond2_x + (diamond2.width - d2_scaled.width) // 2
                    d2_y = diamond2_y + (diamond2.height - d2_scaled.height) // 2

                    frame.paste(d1_scaled, (d1_x, d1_y), d1_scaled)
                    frame.paste(d2_scaled, (d2_x, d2_y), d2_scaled)

                    # Labels
                    label1 = create_text_layer(f"{carat1:.1f}ct {shape1.upper()}", 50, CYAN, 200)
                    label2 = create_text_layer(f"{carat2:.1f}ct {shape2.upper()}", 50, MAGENTA, 200)
                    dime_label = create_text_layer("US DIME", 40, WHITE, y_center + 180)
                    size_label = create_text_layer(f"{width1_mm:.1f}mm vs {width2_mm:.1f}mm", 35, WHITE, y_center + 240)

                    label1.putalpha(alpha)
                    label2.putalpha(alpha)
                    dime_label.putalpha(alpha)
                    size_label.putalpha(alpha)

                    frame.paste(label1, (0, 0), label1)
                    frame.paste(label2, (0, 0), label2)
                    frame.paste(dime_label, (0, 0), dime_label)
                    frame.paste(size_label, (0, 0), size_label)

            else:
                # OUTRO: Call to action (15-20s)
                alpha = min(255, int(((t - 15) / 2) * 255))

                cta = create_text_layer("caratcompare.co", 80, WHITE, HEIGHT//2 - 100)
                cta2 = create_text_layer("Compare Any Diamond Size", 50, CYAN, HEIGHT//2 + 50)

                cta.putalpha(alpha)
                cta2.putalpha(alpha)

                frame.paste(cta, (0, 0), cta)
                frame.paste(cta2, (0, 0), cta2)

            return np.array(frame)

        # Create video clip
        clip = VideoClip(make_frame, duration=DURATION)
        clip.write_videofile(
            str(output_path),
            fps=FPS,
            codec='libx264',
            audio=False,
            preset='medium'
        )

        print(f"✓ Saved: {output_path}")
        return True

    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def generate_metadata(carat1, shape1, carat2, shape2, video_filename):
    """Generate YouTube metadata with affiliate links"""

    # Format carat display
    c1 = f"{carat1:.1f}" if carat1 % 1 else f"{int(carat1)}"
    c2 = f"{carat2:.1f}" if carat2 % 1 else f"{int(carat2)}"

    s1_cap = shape1.capitalize()
    s2_cap = shape2.capitalize()

    title = f"{c1} Carat {s1_cap} vs {c2} Carat {s2_cap} Diamond Size Comparison #shorts"

    description = f"""See the ACTUAL size difference between a {c1} carat {shape1} and {c2} carat {shape2} diamond, shown next to a US dime for scale.

📊 Accurate Measurements:
• {c1}ct {s1_cap}: Real dimensions
• {c2}ct {s2_cap}: Real dimensions
• US Dime: 17.9mm reference

🛍️ Shop {c1} Carat {s1_cap} Diamonds:
Blue Nile: [affiliate link]
James Allen: [affiliate link]
Brilliant Earth: [affiliate link]

🛍️ Shop {c2} Carat {s2_cap} Diamonds:
Blue Nile: [affiliate link]
James Allen: [affiliate link]
Brilliant Earth: [affiliate link]

✨ Compare any diamond size: https://www.caratcompare.co

#DiamondSize #DiamondShopping #EngagementRing #DiamondComparison #CaratSize #DiamondEducation #EngagementRingShopping #DiamondBuying #shorts"""

    tags = [
        "diamond size comparison",
        "carat comparison",
        f"{c1} carat diamond",
        f"{c2} carat diamond",
        f"{shape1} diamond",
        f"{shape2} diamond",
        "engagement ring",
        "diamond shopping",
        "diamond education",
        "carat size",
        "diamond buying guide"
    ]

    return {
        "title": title,
        "description": description,
        "tags": tags,
        "category": "26",  # Howto & Style
        "video_file": video_filename
    }

def main():
    """Generate 3 test videos for YouTube Shorts & TikTok"""

    print("=" * 60)
    print("Diamond Comparison Video Generator V2")
    print("YouTube Shorts & TikTok Format (1080x1920)")
    print("=" * 60)
    print()

    OUTPUT_DIR.mkdir(exist_ok=True)

    # 3 high-value test comparisons
    comparisons = [
        (1.0, 'round', 2.0, 'round'),    # Most searched comparison
        (1.0, 'round', 1.0, 'oval'),     # Popular shape comparison
        (1.5, 'round', 2.0, 'round'),    # Common upgrade path
    ]

    successful = 0
    failed = 0

    for i, (carat1, shape1, carat2, shape2) in enumerate(comparisons, 1):
        video_filename = f"{carat1}-{shape1}-vs-{carat2}-{shape2}.mp4"
        video_path = OUTPUT_DIR / video_filename
        metadata_path = OUTPUT_DIR / f"{carat1}-{shape1}-vs-{carat2}-{shape2}_metadata.json"

        print(f"\n[{i}/3] Generating: {video_filename}")

        # Generate video
        if generate_comparison_video(carat1, shape1, carat2, shape2, video_path):
            # Generate metadata
            metadata = generate_metadata(carat1, shape1, carat2, shape2, video_filename)
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)

            print(f"✓ Metadata saved: {metadata_path.name}")
            successful += 1
        else:
            failed += 1

    print("\n" + "=" * 60)
    print(f"✓ Completed: {successful} videos")
    if failed > 0:
        print(f"✗ Failed: {failed} videos")
    print(f"\n📁 Videos saved to: {OUTPUT_DIR}")
    print("=" * 60)
    print("\n📤 Ready to upload to YouTube Shorts and TikTok!")
    print("   Each video is 1080x1920 (vertical) and ~20 seconds")

if __name__ == '__main__':
    main()
