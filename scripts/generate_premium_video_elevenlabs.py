#!/usr/bin/env python3
"""
Premium Diamond Comparison Video Generator with ElevenLabs Voice
Creates ONE high-quality video with professional AI narration

Setup:
    1. Get ElevenLabs API key from https://elevenlabs.io/
    2. Set environment variable: export ELEVENLABS_API_KEY="your_key"
    3. Run: python3 scripts/generate_premium_video_elevenlabs.py 1.0 round 2.0 heart

Requirements:
    pip install moviepy pillow elevenlabs pydub
"""

import os
import sys
import json
import numpy as np
from pathlib import Path
from moviepy import VideoClip, AudioFileClip
from PIL import Image, ImageDraw, ImageFont
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
import tempfile

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / 'generated_videos'
DATA_FILE = PROJECT_ROOT / 'data' / 'diamond-sizes.json'
DIME_IMAGE = PROJECT_ROOT / 'us-dime.png'
SVG_DIR = PROJECT_ROOT / 'SVG'

# Video settings
WIDTH = 1080
HEIGHT = 1920
FPS = 30

# Brand colors
CYAN = '#07F4FF'
MAGENTA = '#FA06FF'
BACKGROUND = '#252525'
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

def load_svg_as_image(shape, size_px, color):
    """Create professional diamond graphics"""
    img = Image.new('RGBA', (size_px, size_px), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = size_px // 2
    rgb = hex_to_rgb(color)

    # Create brilliant cut diamond effect
    if shape.lower() == 'round':
        # Outer glow
        for i in range(5, 0, -1):
            alpha = 30 + (i * 10)
            glow_color = tuple(list(rgb) + [alpha])
            offset = 5 - i
            draw.ellipse([offset, offset, size_px-offset, size_px-offset], fill=glow_color)

        # Main body
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
    else:
        # Default shape
        for i in range(5):
            offset = i * 3
            alpha = 255 - (i * 30)
            draw.ellipse([offset, offset, size_px-offset, size_px-offset],
                        fill=tuple(list(rgb) + [alpha]))

    return img

def load_and_resize_dime(target_px):
    """Load real dime photo"""
    try:
        dime = Image.open(DIME_IMAGE).convert('RGBA')
        dime.thumbnail((target_px, target_px), Image.Resampling.LANCZOS)
        return dime
    except FileNotFoundError:
        img = Image.new('RGBA', (target_px, target_px), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw.ellipse([0, 0, target_px, target_px], fill=(192, 192, 192, 255))
        return img

def create_text_layer(text, font_size, color=WHITE, y_position=100, bold=True):
    """Create text overlay"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    try:
        font_name = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"
        font = ImageFont.truetype(font_name, font_size)
    except:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2

    # Shadow
    draw.text((x + 4, y_position + 4), text, fill=(0, 0, 0, 200), font=font)
    # Main text
    draw.text((x, y_position), text, fill=hex_to_rgb(color) + (255,), font=font)

    return img

def generate_narration_elevenlabs(carat1, shape1, carat2, shape2):
    """Generate professional voiceover using ElevenLabs"""

    # Check for API key
    api_key = os.getenv('ELEVENLABS_API_KEY')
    if not api_key:
        print("❌ ERROR: ELEVENLABS_API_KEY not set!")
        print("   Get your key from: https://elevenlabs.io/")
        print("   Then run: export ELEVENLABS_API_KEY='your_key_here'")
        sys.exit(1)

    # Create text
    shape1_text = f"{shape1} shaped" if shape1.lower() != 'round' else shape1
    shape2_text = f"{shape2} shaped" if shape2.lower() != 'round' else shape2
    text = f"Let's compare the size of a {carat1} carat {shape1_text} diamond to a {carat2} carat {shape2_text} diamond."

    print(f"   Script: '{text}'")
    print(f"   Characters: {len(text)}")

    # Initialize ElevenLabs client
    client = ElevenLabs(api_key=api_key)

    # Generate speech
    # Voice options: Rachel, Adam, Bella, Josh, etc.
    # See: https://elevenlabs.io/voice-library
    try:
        audio_generator = client.text_to_speech.convert(
            voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel - friendly female voice
            optimize_streaming_latency="0",
            output_format="mp3_44100_128",
            text=text,
            model_id="eleven_turbo_v2_5",  # Faster, cheaper model
            voice_settings=VoiceSettings(
                stability=0.5,
                similarity_boost=0.8,
                style=0.0,
                use_speaker_boost=True,
            ),
        )

        # Save to temporary file
        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')

        # Write audio data
        for chunk in audio_generator:
            if chunk:
                temp_audio.write(chunk)

        temp_audio.close()
        print(f"   ✓ Voice generated: {temp_audio.name}")

        return temp_audio.name

    except Exception as e:
        print(f"❌ ElevenLabs API Error: {e}")
        print("   Check your API key and internet connection")
        sys.exit(1)

def generate_premium_video(carat1, shape1, carat2, shape2, output_path):
    """Generate premium video with ElevenLabs voice"""

    print(f"\n{'='*60}")
    print(f"Generating Premium Video with ElevenLabs Voice")
    print(f"{carat1}ct {shape1.upper()} vs {carat2}ct {shape2.upper()}")
    print(f"{'='*60}\n")

    try:
        # Load data
        diamond_data = load_diamond_data()
        width1_mm, _ = get_dimensions(carat1, shape1, diamond_data)
        width2_mm, _ = get_dimensions(carat2, shape2, diamond_data)

        # Sizing
        DIME_MM = 17.9
        DIME_PX = 300
        SCALE = DIME_PX / DIME_MM
        diamond1_px = int(width1_mm * SCALE)
        diamond2_px = int(width2_mm * SCALE)

        print(f"📐 Sizing:")
        print(f"   Dime: {DIME_MM}mm → {DIME_PX}px")
        print(f"   Diamond 1: {width1_mm:.1f}mm → {diamond1_px}px")
        print(f"   Diamond 2: {width2_mm:.1f}mm → {diamond2_px}px\n")

        # Create assets
        print("🎨 Creating visual assets...")
        dime = load_and_resize_dime(DIME_PX)
        diamond1 = load_svg_as_image(shape1, diamond1_px, CYAN)
        diamond2 = load_svg_as_image(shape2, diamond2_px, MAGENTA)
        bg = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(BACKGROUND))

        # Generate narration
        print("🎙️  Generating ElevenLabs narration...")
        audio_path = generate_narration_elevenlabs(carat1, shape1, carat2, shape2)
        narration = AudioFileClip(audio_path)
        narration_duration = narration.duration

        print(f"   ✓ Narration length: {narration_duration:.1f}s\n")

        video_duration = narration_duration + 5

        def make_frame(t):
            """Generate frame at time t"""
            frame = bg.copy()

            shape1_text = f"{shape1} shaped" if shape1.lower() != 'round' else shape1
            shape2_text = f"{shape2} shaped" if shape2.lower() != 'round' else shape2

            if t < 1:
                # Opening text
                alpha = int((t / 1) * 255)
                q1 = create_text_layer("Let's compare the size of", 55, WHITE, HEIGHT//2 - 150)
                q2 = create_text_layer(f"a {carat1}ct {shape1_text} diamond", 60, WHITE, HEIGHT//2 - 50)
                q3 = create_text_layer(f"to a {carat2}ct {shape2_text} diamond", 60, WHITE, HEIGHT//2 + 50)
                q1.putalpha(alpha)
                q2.putalpha(alpha)
                q3.putalpha(alpha)
                frame.paste(q1, (0, 0), q1)
                frame.paste(q2, (0, 0), q2)
                frame.paste(q3, (0, 0), q3)

            elif t < narration_duration + 2:
                # Main comparison
                progress = min(1.0, (t - 1) / 1.5)
                y_center = HEIGHT // 2
                spacing = WIDTH // 3

                dime_x = (WIDTH - dime.width) // 2
                dime_y = y_center - (dime.height // 2)

                diamond1_target_x = spacing - (diamond1.width // 2)
                diamond2_target_x = WIDTH - spacing - (diamond2.width // 2)
                diamond1_x = int(-diamond1.width + (diamond1_target_x + diamond1.width) * progress)
                diamond2_x = int(WIDTH + (diamond2_target_x - WIDTH) * progress)
                diamond1_y = y_center - (diamond1.height // 2)
                diamond2_y = y_center - (diamond2.height // 2)

                alpha = int(progress * 255)

                frame.paste(dime, (dime_x, dime_y), dime)

                if progress > 0:
                    d1 = diamond1.copy()
                    d2 = diamond2.copy()
                    d1.putalpha(alpha)
                    d2.putalpha(alpha)
                    frame.paste(d1, (diamond1_x, diamond1_y), d1)
                    frame.paste(d2, (diamond2_x, diamond2_y), d2)

                if progress > 0.5:
                    label_alpha = int((progress - 0.5) * 2 * 255)
                    l1 = create_text_layer(f"{carat1:.1f}ct", 70, CYAN, 300)
                    l1s = create_text_layer(shape1.upper(), 50, CYAN, 400)
                    l2 = create_text_layer(f"{carat2:.1f}ct", 70, MAGENTA, 300)
                    l2s = create_text_layer(shape2.upper(), 50, MAGENTA, 400)
                    dl = create_text_layer("US DIME (17.9mm)", 35, WHITE, y_center + 200)
                    comp = create_text_layer(f"{width1_mm:.1f}mm  vs  {width2_mm:.1f}mm", 45, WHITE, y_center + 280, False)

                    for layer in [l1, l1s, l2, l2s, dl, comp]:
                        layer.putalpha(label_alpha)
                        frame.paste(layer, (0, 0), layer)

            else:
                # Outro
                fade = min(1.0, (t - (narration_duration + 2)) / 1.5)
                alpha = int(fade * 255)
                cta = create_text_layer("Compare any diamond size", 65, WHITE, HEIGHT//2 - 100)
                web = create_text_layer("caratcompare.co", 90, CYAN, HEIGHT//2 + 50)
                cta.putalpha(alpha)
                web.putalpha(alpha)
                frame.paste(cta, (0, 0), cta)
                frame.paste(web, (0, 0), web)

            return np.array(frame)

        # Render
        print("🎬 Rendering video...")
        video = VideoClip(make_frame, duration=video_duration)
        final_video = video.with_audio(narration)
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
        print("Usage: python3 generate_premium_video_elevenlabs.py <carat1> <shape1> <carat2> <shape2>")
        print("Example: python3 generate_premium_video_elevenlabs.py 1.0 round 2.0 heart")
        sys.exit(1)

    carat1 = float(sys.argv[1])
    shape1 = sys.argv[2].lower()
    carat2 = float(sys.argv[3])
    shape2 = sys.argv[4].lower()

    OUTPUT_DIR.mkdir(exist_ok=True)
    output_filename = f"elevenlabs_{carat1}-{shape1}-vs-{carat2}-{shape2}.mp4"
    output_path = OUTPUT_DIR / output_filename

    success = generate_premium_video(carat1, shape1, carat2, shape2, output_path)

    if success:
        print("=" * 60)
        print("🎉 Professional video ready!")
        print("   Voice: ElevenLabs AI (Rachel)")
        print("   Ready for YouTube Shorts & TikTok!")
        print("=" * 60)
    else:
        sys.exit(1)

if __name__ == '__main__':
    main()
