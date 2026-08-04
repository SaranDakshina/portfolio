import struct, zlib, base64

# Generate simple SVG-based placeholder images as actual minimal PNG files
# Each is 800x500 with a dark background and text label

def write_png(filename, bg_color, label):
    """Write a minimal valid PNG file."""
    # We'll write raw SVG as a simpler approach - just write .svg files
    pass

# Write SVG placeholders
placeholders = [
    ("woap", "#1A0800", "#C4532A", "WOAP / Wellington On a Plate"),
    ("te-matapihi", "#001A0F", "#4A7A5E", "Te Matapihi Digital Experience"),
    ("zonescan-install", "#00001A", "#3A5A8A", "Gutermann ZONESCAN Install"),
    ("tell-your-story", "#0A0500", "#8A6A3A", "Art of Living Documentary"),
]

for slug, bg, accent, label in placeholders:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <rect width="1200" height="750" fill="{bg}"/>
  <rect x="80" y="80" width="120" height="2" fill="{accent}" opacity="0.8"/>
  <text x="80" y="380" font-family="system-ui, sans-serif" font-size="48" font-weight="500" fill="#FAF9F6" opacity="0.9">{label}</text>
  <text x="80" y="440" font-family="system-ui, sans-serif" font-size="18" fill="{accent}" letter-spacing="3">PLACEHOLDER IMAGE</text>
  <circle cx="1100" cy="150" r="200" fill="{accent}" opacity="0.06"/>
  <circle cx="100" cy="650" r="150" fill="{accent}" opacity="0.04"/>
</svg>'''
    with open(f"{slug}.svg", "w") as f:
        f.write(svg)
    print(f"Written {slug}.svg")

print("Done")
