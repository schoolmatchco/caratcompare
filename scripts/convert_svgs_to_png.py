#!/usr/bin/env python3
"""
Convert all diamond SVGs to PNG files for video generation
This only needs to be run once

Requires: pip install pillow svglib reportlab
"""

from pathlib import Path
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM

PROJECT_ROOT = Path(__file__).parent.parent
SVG_DIR = PROJECT_ROOT / 'public' / 'svg' / 'diamonds'
PNG_DIR = PROJECT_ROOT / 'assets' / 'diamonds_png'

def convert_svg_to_png(svg_path, png_path, size=500):
    """Convert a single SVG to PNG"""
    drawing = svg2rlg(svg_path)
    renderPM.drawToFile(drawing, str(png_path), fmt='PNG', dpi=144)
    print(f"✓ Converted: {svg_path.name} → {png_path.name}")

def convert_all():
    """Convert all diamond SVGs to PNGs"""
    PNG_DIR.mkdir(parents=True, exist_ok=True)

    svg_files = list(SVG_DIR.glob('*.svg'))
    print(f"Found {len(svg_files)} SVG files")

    for svg_file in svg_files:
        png_file = PNG_DIR / f"{svg_file.stem}.png"
        try:
            convert_svg_to_png(svg_file, png_file)
        except Exception as e:
            print(f"✗ Error converting {svg_file.name}: {e}")

    # Also convert logo and dime
    logo_svg = PROJECT_ROOT / 'public' / 'svg' / 'Logo 3.svg'
    dime_svg = PROJECT_ROOT / 'public' / 'svg' / 'Dime.svg'

    if logo_svg.exists():
        convert_svg_to_png(logo_svg, PNG_DIR / 'logo.png')

    if dime_svg.exists():
        convert_svg_to_png(dime_svg, PNG_DIR / 'dime.png')

    print(f"\n✓ Done! PNG files saved to: {PNG_DIR}")

if __name__ == '__main__':
    print("SVG to PNG Converter")
    print("=" * 50)
    convert_all()
