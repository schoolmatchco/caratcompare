#!/usr/bin/env python3
"""
Premium Diamond Comparison Video Generator
Creates ONE high-quality video with narration and music

Usage:
    python3 scripts/generate_premium_video.py 1.0 round 2.0 round

Requirements:
    pip install moviepy pillow gTTS pydub
"""

import os
import sys
import json
import numpy as np
from pathlib import Path
from moviepy import VideoClip, AudioFileClip, CompositeAudioClip
from moviepy.video.compositing.CompositeVideoClip import CompositeVideoClip as MoviePyComposite
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from gtts import gTTS
import tempfile

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / 'generated_videos'
DATA_FILE = PROJECT_ROOT / 'data' / 'diamond-sizes.json'
DIME_IMAGE = PROJECT_ROOT / 'us-dime.png'
SVG_DIR = PROJECT_ROOT / 'SVG'

# Video settings - YouTube Shorts & TikTok
WIDTH = 1080
HEIGHT = 1920
FPS = 30
DURATION = 30  # Longer for narration

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

def load_svg_as_image(shape, size_px, color):
    """
    Load SVG diamond and convert to colored PNG
    Since we can't use cairosvg, we'll create a stylized representation
    """
    # Try to load the actual SVG as a base
    svg_path = SVG_DIR / f"{shape.capitalize()}.svg"

    # For now, create a professional-looking diamond shape
    # In production, you'd use actual SVG conversion
    img = Image.new('RGBA', (size_px, size_px), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center = size_px // 2
    rgb = hex_to_rgb(color)

    # Create diamond shape based on cut
    if shape.lower() == 'round':
        # Perfect circle with facet effects
        # Outer glow
        for i in range(5, 0, -1):
            alpha = 30 + (i * 10)
            glow_color = tuple(list(rgb) + [alpha])
            offset = 5 - i
            draw.ellipse([offset, offset, size_px-offset, size_px-offset],
                        fill=glow_color)

        # Main body with gradient effect
        for i in range(10):
            offset = i * (size_px // 40)
            alpha = 255 - (i * 15)
            layer_color = tuple(list(rgb) + [alpha])
            draw.ellipse([offset, offset, size_px-offset, size_px-offset],
                        fill=layer_color)

        # Brilliant cut facets
        facet_lines = [
            [(center, 0), (center, size_px)],  # Vertical
            [(0, center), (size_px, center)],  # Horizontal
            [(0, 0), (size_px, size_px)],      # Diagonal 1
            [(size_px, 0), (0, size_px)],      # Diagonal 2
            [(center, 0), (0, center)],        # Star facets
            [(center, 0), (size_px, center)],
            [(center, size_px), (0, center)],
            [(center, size_px), (size_px, center)],
        ]

        for line in facet_lines:
            draw.line(line, fill=(255, 255, 255, 60), width=2)

        # Table (top flat surface)
        table_size = size_px // 3
        table_offset = (size_px - table_size) // 2
        draw.ellipse([table_offset, table_offset,
                     table_offset + table_size, table_offset + table_size],
                    fill=(255, 255, 255, 100))

        # Crown highlight
        highlight_size = size_px // 5
        highlight_offset = size_px // 4
        draw.ellipse([highlight_offset, highlight_offset,
                     highlight_offset + highlight_size, highlight_offset + highlight_size],
                    fill=(255, 255, 255, 200))

    elif shape.lower() == 'heart':
        # Heart shape with facets
        points = create_heart_points(center, size_px // 2)
        draw.polygon(points, fill=tuple(list(rgb) + [200]))
        draw.polygon(points, outline=tuple(list(rgb) + [255]), width=3)

        # Add sparkle
        draw.ellipse([center-10, center-20, center+10, center],
                    fill=(255, 255, 255, 180))

    elif shape.lower() == 'oval':
        # Elongated oval with facets
        width_ratio = 0.7
        w = int(size_px * width_ratio)
        offset_x = (size_px - w) // 2

        for i in range(5):
            offset = i * 2
            alpha = 255 - (i * 30)
            draw.ellipse([offset_x + offset, offset,
                         size_px - offset_x - offset, size_px - offset],
                        fill=tuple(list(rgb) + [alpha]))

        # Facet lines
        draw.line([(center, 0), (center, size_px)],
                 fill=(255, 255, 255, 80), width=2)
        draw.line([(offset_x, center), (size_px - offset_x, center)],
                 fill=(255, 255, 255, 80), width=2)

    else:
        # Default: circular with facets
        for i in range(5):
            offset = i * 3
            alpha = 255 - (i * 30)
            draw.ellipse([offset, offset, size_px-offset, size_px-offset],
                        fill=tuple(list(rgb) + [alpha]))

    return img

def create_heart_points(center, radius):
    """Generate heart shape points"""
    points = []
    for i in range(360):
        angle = np.radians(i)
        x = 16 * np.sin(angle) ** 3
        y = -(13 * np.cos(angle) - 5 * np.cos(2*angle) - 2 * np.cos(3*angle) - np.cos(4*angle))

        # Scale and center
        scale = radius / 20
        points.append((center + x * scale, center + y * scale))

    return points

def load_and_resize_dime(target_px):
    """Load real dime photo and resize"""
    try:
        dime = Image.open(DIME_IMAGE).convert('RGBA')
        dime.thumbnail((target_px, target_px), Image.Resampling.LANCZOS)
        return dime
    except FileNotFoundError:
        print(f"⚠ Warning: Dime image not found, using placeholder")
        img = Image.new('RGBA', (target_px, target_px), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw.ellipse([0, 0, target_px, target_px], fill=(192, 192, 192, 255))
        return img

def create_text_layer(text, font_size, color=WHITE, y_position=100, bold=True):
    """Create text overlay with shadow"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    try:
        font_name = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"
        font = ImageFont.truetype(font_name, font_size)
    except:
        font = ImageFont.load_default()

    # Calculate text position (centered)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2

    # Shadow
    shadow_offset = 4
    draw.text((x + shadow_offset, y_position + shadow_offset), text,
              fill=(0, 0, 0, 200), font=font)

    # Main text
    draw.text((x, y_position), text, fill=hex_to_rgb(color) + (255,), font=font)

    return img

def generate_narration(carat1, shape1, carat2, shape2):
    """Generate voiceover narration using gTTS"""
    # Add "shaped" for non-round diamonds to sound more natural
    shape1_text = f"{shape1} shaped" if shape1.lower() != 'round' else shape1
    shape2_text = f"{shape2} shaped" if shape2.lower() != 'round' else shape2

    text = f"Let's compare the size of a {carat1} carat {shape1_text} diamond to a {carat2} carat {shape2_text} diamond."

    # Create temporary file for audio
    temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')

    # Generate speech
    tts = gTTS(text=text, lang='en', slow=False)
    tts.save(temp_audio.name)

    return temp_audio.name

def generate_premium_video(carat1, shape1, carat2, shape2, output_path):
    """Generate ONE premium quality video"""

    print(f"\n{'='*60}")
    print(f"Generating Premium Video")
    print(f"{carat1}ct {shape1.upper()} vs {carat2}ct {shape2.upper()}")
    print(f"{'='*60}\n")

    try:
        # Load data
        diamond_data = load_diamond_data()
        width1_mm, height1_mm = get_dimensions(carat1, shape1, diamond_data)
        width2_mm, height2_mm = get_dimensions(carat2, shape2, diamond_data)

        # Accurate sizing (CRITICAL)
        DIME_MM = 17.9
        DIME_PX = 300  # Larger for better visibility
        SCALE = DIME_PX / DIME_MM

        diamond1_px = int(max(width1_mm, height1_mm) * SCALE)
        diamond2_px = int(max(width2_mm, height2_mm) * SCALE)

        print(f"📐 Sizing:")
        print(f"   Dime: {DIME_MM}mm → {DIME_PX}px")
        print(f"   Diamond 1: {width1_mm:.1f}mm → {diamond1_px}px")
        print(f"   Diamond 2: {width2_mm:.1f}mm → {diamond2_px}px")
        print(f"   Scale: {SCALE:.1f} px/mm\n")

        # Create assets
        print("🎨 Creating visual assets...")
        dime = load_and_resize_dime(DIME_PX)
        diamond1 = load_svg_as_image(shape1, diamond1_px, CYAN)
        diamond2 = load_svg_as_image(shape2, diamond2_px, MAGENTA)
        bg = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(BACKGROUND))

        # Generate narration
        print("🎙️  Generating narration...")
        audio_path = generate_narration(carat1, shape1, carat2, shape2)
        narration = AudioFileClip(audio_path)
        narration_duration = narration.duration

        print(f"   Narration length: {narration_duration:.1f}s\n")

        # Adjust video duration to match narration + padding
        video_duration = narration_duration + 5  # 5s for outro

        def make_frame(t):
            """Generate frame at time t"""
            frame = bg.copy()

            # Timeline:
            # 0-1s: Fade in question text
            # 1s-narration_end: Show comparison
            # narration_end+2s: CTA

            if t < 1:
                # Opening: Question text fade in
                alpha = int((t / 1) * 255)

                shape1_text = f"{shape1} shaped" if shape1.lower() != 'round' else shape1
                shape2_text = f"{shape2} shaped" if shape2.lower() != 'round' else shape2

                question = create_text_layer(
                    f"Let's compare the size of",
                    55, WHITE, HEIGHT//2 - 150
                )
                question2 = create_text_layer(
                    f"a {carat1}ct {shape1_text} diamond",
                    60, WHITE, HEIGHT//2 - 50
                )
                question3 = create_text_layer(
                    f"to a {carat2}ct {shape2_text} diamond",
                    60, WHITE, HEIGHT//2 + 50
                )

                question.putalpha(alpha)
                question2.putalpha(alpha)
                question3.putalpha(alpha)

                frame.paste(question, (0, 0), question)
                frame.paste(question2, (0, 0), question2)
                frame.paste(question3, (0, 0), question3)

            elif t < narration_duration + 2:
                # Main comparison scene
                progress = min(1.0, (t - 1) / 1.5)  # 1.5s animation

                # Calculate positions
                y_center = HEIGHT // 2
                spacing = WIDTH // 3

                dime_x = (WIDTH - dime.width) // 2
                dime_y = y_center - (dime.height // 2)

                # Animate diamonds sliding in from sides
                diamond1_target_x = spacing - (diamond1.width // 2)
                diamond2_target_x = WIDTH - spacing - (diamond2.width // 2)

                diamond1_x = int(-diamond1.width + (diamond1_target_x + diamond1.width) * progress)
                diamond2_x = int(WIDTH + (diamond2_target_x - WIDTH) * progress)

                diamond1_y = y_center - (diamond1.height // 2)
                diamond2_y = y_center - (diamond2.height // 2)

                alpha = int(progress * 255)

                # Paste dime
                frame.paste(dime, (dime_x, dime_y), dime)

                # Paste diamonds
                if progress > 0:
                    d1_copy = diamond1.copy()
                    d2_copy = diamond2.copy()
                    d1_copy.putalpha(alpha)
                    d2_copy.putalpha(alpha)

                    frame.paste(d1_copy, (diamond1_x, diamond1_y), d1_copy)
                    frame.paste(d2_copy, (diamond2_x, diamond2_y), d2_copy)

                # Labels
                if progress > 0.5:
                    label_alpha = int((progress - 0.5) * 2 * 255)

                    label1 = create_text_layer(f"{carat1:.1f}ct", 70, CYAN, 300)
                    label1_shape = create_text_layer(shape1.upper(), 50, CYAN, 400)

                    label2 = create_text_layer(f"{carat2:.1f}ct", 70, MAGENTA, 300)
                    label2_shape = create_text_layer(shape2.upper(), 50, MAGENTA, 400)

                    dime_label = create_text_layer("US DIME (17.9mm)", 35, WHITE, y_center + 200)
                    comparison = create_text_layer(
                        f"{width1_mm:.1f}mm  vs  {width2_mm:.1f}mm",
                        45, WHITE, y_center + 280, bold=False
                    )

                    label1.putalpha(label_alpha)
                    label1_shape.putalpha(label_alpha)
                    label2.putalpha(label_alpha)
                    label2_shape.putalpha(label_alpha)
                    dime_label.putalpha(label_alpha)
                    comparison.putalpha(label_alpha)

                    frame.paste(label1, (0, 0), label1)
                    frame.paste(label1_shape, (0, 0), label1_shape)
                    frame.paste(label2, (0, 0), label2)
                    frame.paste(label2_shape, (0, 0), label2_shape)
                    frame.paste(dime_label, (0, 0), dime_label)
                    frame.paste(comparison, (0, 0), comparison)

            else:
                # Outro: CTA
                fade_progress = min(1.0, (t - (narration_duration + 2)) / 1.5)
                alpha = int(fade_progress * 255)

                cta = create_text_layer("Compare any diamond size", 65, WHITE, HEIGHT//2 - 100)
                website = create_text_layer("caratcompare.co", 90, CYAN, HEIGHT//2 + 50)

                cta.putalpha(alpha)
                website.putalpha(alpha)

                frame.paste(cta, (0, 0), cta)
                frame.paste(website, (0, 0), website)

            return np.array(frame)

        # Create video
        print("🎬 Rendering video...")
        video = VideoClip(make_frame, duration=video_duration)

        # Add narration audio
        final_video = video.with_audio(narration)

        # Export
        final_video.write_videofile(
            str(output_path),
            fps=FPS,
            codec='libx264',
            audio_codec='aac',
            preset='medium'
        )

        # Cleanup
        os.unlink(audio_path)

        print(f"\n✅ SUCCESS!")
        print(f"📁 Saved: {output_path}")
        print(f"⏱️  Duration: {video_duration:.1f}s")
        print(f"📏 Size: {output_path.stat().st_size / 1024:.0f}KB\n")

        return True

    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main entry point"""
    if len(sys.argv) != 5:
        print("Usage: python3 generate_premium_video.py <carat1> <shape1> <carat2> <shape2>")
        print("Example: python3 generate_premium_video.py 1.0 round 2.0 round")
        sys.exit(1)

    carat1 = float(sys.argv[1])
    shape1 = sys.argv[2].lower()
    carat2 = float(sys.argv[3])
    shape2 = sys.argv[4].lower()

    OUTPUT_DIR.mkdir(exist_ok=True)

    output_filename = f"premium_{carat1}-{shape1}-vs-{carat2}-{shape2}.mp4"
    output_path = OUTPUT_DIR / output_filename

    success = generate_premium_video(carat1, shape1, carat2, shape2, output_path)

    if success:
        print("=" * 60)
        print("🎉 Ready to upload to YouTube Shorts & TikTok!")
        print("=" * 60)
    else:
        sys.exit(1)

if __name__ == '__main__':
    main()
