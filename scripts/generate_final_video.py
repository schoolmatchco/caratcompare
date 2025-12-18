#!/usr/bin/env python3
"""
Final Diamond Comparison Video Generator
Professional layout for YouTube Shorts & TikTok

Timeline:
- 0-3s: Logo fade in/out
- 3-10s: Text + narration intro
- 10-16s: Dime + diamonds appear vertically with measurements
- 16-20s: Outro + CTA

Usage:
    ELEVENLABS_API_KEY="your_key" python3 scripts/generate_final_video.py 1.0 princess 2.0 heart
"""

import os
import sys
import json
import numpy as np
from pathlib import Path
from moviepy import VideoClip, AudioFileClip, ImageClip
from PIL import Image, ImageDraw, ImageFont
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
import tempfile

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / 'generated_videos'
DATA_FILE = PROJECT_ROOT / 'data' / 'diamond-sizes.json'
DIME_IMAGE = PROJECT_ROOT / 'us-dime.png'
LOGO_SVG = PROJECT_ROOT / 'public' / 'svg' / 'Logo 3.svg'

# Video settings
WIDTH = 1080
HEIGHT = 1920
FPS = 30

# Brand colors
CYAN = '#07F4FF'
MAGENTA = '#FA06FF'
BACKGROUND = '#252525'
BLACK = '#000000'
WHITE = '#FFFFFF'

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

def create_diamond_graphic(size_px, color):
    """Create professional diamond graphic"""
    img = Image.new('RGBA', (size_px, size_px), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = size_px // 2
    rgb = hex_to_rgb(color)

    # Outer glow
    for i in range(5, 0, -1):
        alpha = 30 + (i * 10)
        offset = 5 - i
        draw.ellipse([offset, offset, size_px-offset, size_px-offset],
                    fill=tuple(list(rgb) + [alpha]))

    # Main body with layers
    for i in range(10):
        offset = i * (size_px // 40)
        alpha = 255 - (i * 15)
        draw.ellipse([offset, offset, size_px-offset, size_px-offset],
                    fill=tuple(list(rgb) + [alpha]))

    # Facet lines
    facets = [
        [(center, 0), (center, size_px)],
        [(0, center), (size_px, center)],
        [(0, 0), (size_px, size_px)],
        [(size_px, 0), (0, size_px)],
    ]
    for line in facets:
        draw.line(line, fill=(255, 255, 255, 60), width=2)

    # Highlight
    h_size = size_px // 5
    h_pos = size_px // 4
    draw.ellipse([h_pos, h_pos, h_pos + h_size, h_pos + h_size],
                fill=(255, 255, 255, 200))

    return img

def load_dime(target_px):
    """Load real dime photo"""
    try:
        dime = Image.open(DIME_IMAGE).convert('RGBA')
        dime.thumbnail((target_px, target_px), Image.Resampling.LANCZOS)
        return dime
    except:
        # Fallback
        img = Image.new('RGBA', (target_px, target_px), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw.ellipse([0, 0, target_px, target_px], fill=(192, 192, 192, 255))
        return img

def create_text_layer(text, font_size, color=WHITE, y_position=100, bold=True, max_width=None):
    """Create text overlay with optional wrapping"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    try:
        font_name = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"
        font = ImageFont.truetype(font_name, font_size)
    except:
        font = ImageFont.load_default()

    # Word wrap if needed
    if max_width:
        words = text.split()
        lines = []
        current_line = []

        for word in words:
            test_line = ' '.join(current_line + [word])
            bbox = draw.textbbox((0, 0), test_line, font=font)
            if bbox[2] - bbox[0] <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                current_line = [word]
        if current_line:
            lines.append(' '.join(current_line))

        # Draw multi-line text
        y = y_position
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=font)
            text_width = bbox[2] - bbox[0]
            x = (WIDTH - text_width) // 2

            # Shadow
            draw.text((x + 3, y + 3), line, fill=(0, 0, 0, 200), font=font)
            # Main text
            draw.text((x, y), line, fill=hex_to_rgb(color) + (255,), font=font)
            y += font_size + 10
    else:
        # Single line
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        x = (WIDTH - text_width) // 2

        # Shadow
        draw.text((x + 3, y_position + 3), text, fill=(0, 0, 0, 200), font=font)
        # Main text
        draw.text((x, y_position), text, fill=hex_to_rgb(color) + (255,), font=font)

    return img

def load_logo_as_image(target_height=200):
    """Load and convert SVG logo to PNG"""
    # For now, create a simple text logo
    # TODO: Convert actual SVG to PNG
    img = Image.new('RGBA', (600, target_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 80)
    except:
        font = ImageFont.load_default()

    text = "CARAT COMPARE"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Draw text with gradient effect (cyan to magenta)
    x = (600 - text_width) // 2
    y = (target_height - text_height) // 2

    # Shadow
    draw.text((x + 4, y + 4), text, fill=(0, 0, 0, 180), font=font)
    # Main text (for now just white, can make gradient later)
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)

    return img

def generate_narration(carat1, shape1, carat2, shape2):
    """Generate professional voiceover using ElevenLabs"""

    api_key = os.getenv('ELEVENLABS_API_KEY')
    if not api_key:
        print("❌ ERROR: ELEVENLABS_API_KEY not set!")
        sys.exit(1)

    # Script
    shape1_text = f"{shape1} cut" if shape1.lower() not in ['round', 'heart'] else f"{shape1} shaped" if shape1.lower() == 'heart' else shape1
    shape2_text = f"{shape2} cut" if shape2.lower() not in ['round', 'heart'] else f"{shape2} shaped" if shape2.lower() == 'heart' else shape2

    intro = f"Let's compare the size of a {carat1} carat {shape1_text} diamond to the size of a {carat2} carat {shape2_text} diamond. We'll use a US dime for the size comparison."
    outro = "To see more diamond size and shape comparisons, visit caratcompare.co, or check the description for links to high-quality diamond outlets."

    full_script = intro + " " + outro

    print(f"   Script: '{intro}'")
    print(f"   Characters: {len(full_script)}")

    client = ElevenLabs(api_key=api_key)

    try:
        # Using Rachel voice - professional & trustworthy
        audio_generator = client.text_to_speech.convert(
            voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel
            text=full_script,
            model_id="eleven_turbo_v2_5",
            voice_settings=VoiceSettings(
                stability=0.6,  # More stable for professional sound
                similarity_boost=0.8,
                style=0.0,
                use_speaker_boost=True,
            ),
        )

        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
        for chunk in audio_generator:
            if chunk:
                temp_audio.write(chunk)
        temp_audio.close()

        return temp_audio.name, intro, outro

    except Exception as e:
        print(f"❌ ElevenLabs Error: {e}")
        sys.exit(1)

def generate_video(carat1, shape1, carat2, shape2, output_path):
    """Generate final professional video"""

    print(f"\n{'='*60}")
    print(f"Generating Professional Video")
    print(f"{carat1}ct {shape1.upper()} vs {carat2}ct {shape2.upper()}")
    print(f"{'='*60}\n")

    try:
        # Load data
        diamond_data = load_diamond_data()
        width1_mm, _ = get_dimensions(carat1, shape1, diamond_data)
        width2_mm, _ = get_dimensions(carat2, shape2, diamond_data)

        # Sizing - VERTICAL LAYOUT
        DIME_MM = 17.9
        DIME_PX = 280
        SCALE = DIME_PX / DIME_MM
        diamond1_px = int(width1_mm * SCALE)
        diamond2_px = int(width2_mm * SCALE)

        print(f"📐 Vertical Layout:")
        print(f"   Diamond 1: {width1_mm:.1f}mm → {diamond1_px}px (TOP)")
        print(f"   Dime: {DIME_MM}mm → {DIME_PX}px (MIDDLE)")
        print(f"   Diamond 2: {width2_mm:.1f}mm → {diamond2_px}px (BOTTOM)\n")

        # Create assets
        print("🎨 Creating assets...")
        logo = load_logo_as_image(200)
        dime = load_dime(DIME_PX)
        diamond1 = create_diamond_graphic(diamond1_px, CYAN)
        diamond2 = create_diamond_graphic(diamond2_px, MAGENTA)

        bg_black = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(BLACK))
        bg_dark = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(BACKGROUND))

        # Generate narration
        print("🎙️  Generating narration...")
        audio_path, intro_text, outro_text = generate_narration(carat1, shape1, carat2, shape2)
        narration = AudioFileClip(audio_path)

        # Calculate timing
        intro_duration = 7  # Text + narration intro
        comparison_duration = 6  # Visual comparison
        outro_duration = 5  # Outro text
        total_duration = 3 + intro_duration + comparison_duration + outro_duration

        print(f"   Audio length: {narration.duration:.1f}s")
        print(f"   Video length: {total_duration}s\n")

        def make_frame(t):
            """Generate frame at time t"""

            # Timeline:
            # 0-3s: Logo fade in/out
            # 3-10s: Intro text + narration
            # 10-16s: Visual comparison
            # 16-21s: Outro text

            if t < 3:
                # LOGO INTRO (black background)
                frame_pil = bg_black.copy()

                if t < 1:
                    # Fade in
                    alpha = int((t / 1) * 255)
                elif t < 2:
                    # Hold
                    alpha = 255
                else:
                    # Fade out
                    alpha = int((1 - (t - 2)) * 255)

                # Center logo
                logo_copy = logo.copy()
                logo_copy.putalpha(alpha)
                logo_x = (WIDTH - logo.width) // 2
                logo_y = (HEIGHT - logo.height) // 2

                frame_pil.paste(logo_copy, (logo_x, logo_y), logo_copy)
                return np.array(frame_pil)

            elif t < 3 + intro_duration:
                # INTRO TEXT + NARRATION
                frame_pil = bg_dark.copy()
                progress = (t - 3) / 1.5
                alpha = min(255, int(progress * 255))

                # Wrap text for readability
                shape1_text = f"{shape1} cut" if shape1.lower() not in ['round', 'heart'] else f"{shape1} shaped" if shape1.lower() == 'heart' else shape1
                shape2_text = f"{shape2} cut" if shape2.lower() not in ['round', 'heart'] else f"{shape2} shaped" if shape2.lower() == 'heart' else shape2

                text = create_text_layer(
                    f"Let's compare the size of a {carat1} carat {shape1_text} diamond to a {carat2} carat {shape2_text} diamond.",
                    50, WHITE, HEIGHT//2 - 150, bold=False, max_width=WIDTH - 100
                )
                text2 = create_text_layer(
                    "We'll use a US dime for the size comparison.",
                    45, WHITE, HEIGHT//2 + 100, bold=False
                )

                text.putalpha(alpha)
                text2.putalpha(alpha)

                frame_pil.paste(text, (0, 0), text)
                frame_pil.paste(text2, (0, 0), text2)
                return np.array(frame_pil)

            elif t < 3 + intro_duration + comparison_duration:
                # VISUAL COMPARISON (vertical layout)
                frame_pil = bg_dark.copy()

                progress = (t - (3 + intro_duration)) / 1.5
                alpha = min(255, int(progress * 255))

                # Vertical positions
                y_center = HEIGHT // 2
                spacing = 320

                # Dime in center
                dime_x = (WIDTH - dime.width) // 2
                dime_y = y_center - (dime.height // 2)

                # Diamond 1 above
                d1_y = dime_y - spacing - (diamond1.height // 2)
                d1_x = (WIDTH - diamond1.width) // 2

                # Diamond 2 below
                d2_y = dime_y + dime.height + spacing - (diamond2.height // 2)
                d2_x = (WIDTH - diamond2.width) // 2

                # Paste dime
                if progress > 0.2:
                    dime_alpha = min(255, int((progress - 0.2) / 0.3 * 255))
                    dime_copy = dime.copy()
                    dime_copy.putalpha(dime_alpha)
                    frame_pil.paste(dime_copy, (dime_x, dime_y), dime_copy)

                    # Dime label
                    if progress > 0.5:
                        label_dime = create_text_layer("US DIME", 35, WHITE, dime_y + dime.height + 20)
                        label_dime_mm = create_text_layer("17.9mm", 40, WHITE, dime_y + dime.height + 70, bold=True)
                        label_dime.putalpha(dime_alpha)
                        label_dime_mm.putalpha(dime_alpha)
                        frame_pil.paste(label_dime, (0, 0), label_dime)
                        frame_pil.paste(label_dime_mm, (0, 0), label_dime_mm)

                # Paste diamond 1 (above)
                if progress > 0.5:
                    d1_alpha = min(255, int((progress - 0.5) / 0.3 * 255))
                    d1_copy = diamond1.copy()
                    d1_copy.putalpha(d1_alpha)
                    frame_pil.paste(d1_copy, (d1_x, d1_y), d1_copy)

                    # Labels
                    label1 = create_text_layer(f"{carat1:.1f}ct", 55, CYAN, d1_y - 100)
                    label1_shape = create_text_layer(shape1.upper(), 40, CYAN, d1_y - 40)
                    label1_mm = create_text_layer(f"{width1_mm:.1f}mm", 35, WHITE, d1_y + diamond1.height + 10)
                    label1.putalpha(d1_alpha)
                    label1_shape.putalpha(d1_alpha)
                    label1_mm.putalpha(d1_alpha)
                    frame_pil.paste(label1, (0, 0), label1)
                    frame_pil.paste(label1_shape, (0, 0), label1_shape)
                    frame_pil.paste(label1_mm, (0, 0), label1_mm)

                # Paste diamond 2 (below)
                if progress > 0.7:
                    d2_alpha = min(255, int((progress - 0.7) / 0.3 * 255))
                    d2_copy = diamond2.copy()
                    d2_copy.putalpha(d2_alpha)
                    frame_pil.paste(d2_copy, (d2_x, d2_y), d2_copy)

                    # Labels
                    label2 = create_text_layer(f"{carat2:.1f}ct", 55, MAGENTA, d2_y - 100)
                    label2_shape = create_text_layer(shape2.upper(), 40, MAGENTA, d2_y - 40)
                    label2_mm = create_text_layer(f"{width2_mm:.1f}mm", 35, WHITE, d2_y + diamond2.height + 10)
                    label2.putalpha(d2_alpha)
                    label2_shape.putalpha(d2_alpha)
                    label2_mm.putalpha(d2_alpha)
                    frame_pil.paste(label2, (0, 0), label2)
                    frame_pil.paste(label2_shape, (0, 0), label2_shape)
                    frame_pil.paste(label2_mm, (0, 0), label2_mm)

                return np.array(frame_pil)

            else:
                # OUTRO
                frame_pil = bg_dark.copy()
                progress = (t - (3 + intro_duration + comparison_duration)) / 1.5
                alpha = min(255, int(progress * 255))

                cta1 = create_text_layer("See more comparisons at", 50, WHITE, HEIGHT//2 - 120)
                cta2 = create_text_layer("caratcompare.co", 70, CYAN, HEIGHT//2 - 20, bold=True)
                cta3 = create_text_layer("Check description for", 45, WHITE, HEIGHT//2 + 80)
                cta4 = create_text_layer("high-quality diamond outlets", 45, WHITE, HEIGHT//2 + 140)

                for layer in [cta1, cta2, cta3, cta4]:
                    layer.putalpha(alpha)

                for layer in [cta1, cta2, cta3, cta4]:
                    frame_pil.paste(layer, (0, 0), layer)

                return np.array(frame_pil)

        # Render
        print("🎬 Rendering video...")
        video = VideoClip(make_frame, duration=total_duration)
        final_video = video.with_audio(narration)
        final_video.write_videofile(
            str(output_path),
            fps=FPS,
            codec='libx264',
            audio_codec='aac',
            preset='medium'
        )

        os.unlink(audio_path)

        print(f"\n✅ SUCCESS!")
        print(f"📁 {output_path}")
        print(f"⏱️  {total_duration}s")
        print(f"📏 {output_path.stat().st_size / 1024:.0f}KB\n")

        return True

    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    if len(sys.argv) != 5:
        print("Usage: python3 generate_final_video.py <carat1> <shape1> <carat2> <shape2>")
        print("Example: python3 generate_final_video.py 1.0 princess 2.0 heart")
        sys.exit(1)

    carat1 = float(sys.argv[1])
    shape1 = sys.argv[2].lower()
    carat2 = float(sys.argv[3])
    shape2 = sys.argv[4].lower()

    OUTPUT_DIR.mkdir(exist_ok=True)
    output_filename = f"final_{carat1}-{shape1}-vs-{carat2}-{shape2}.mp4"
    output_path = OUTPUT_DIR / output_filename

    success = generate_video(carat1, shape1, carat2, shape2, output_path)

    if success:
        print("=" * 60)
        print("🎉 Professional video ready for YouTube Shorts & TikTok!")
        print("=" * 60)

if __name__ == '__main__':
    main()
