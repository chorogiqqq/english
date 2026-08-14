import os
import re
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy import AudioFileClip, VideoClip

# File Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MP3_PATH = os.path.join(SCRIPT_DIR, "파도.mp3")
LRC_PATH = os.path.join(SCRIPT_DIR, "파도.lrc")
OUTPUT_MP4 = os.path.join(SCRIPT_DIR, "파도.mp4")
FONT_PATH = "C:\\Windows\\Fonts\\malgun.ttf"
FONT_BOLD_PATH = "C:\\Windows\\Fonts\\malgunbd.ttf"
if not os.path.exists(FONT_BOLD_PATH):
    FONT_BOLD_PATH = FONT_PATH

# Dimensions & FPS
WIDTH, HEIGHT = 1280, 720
FPS = 15

# Parse LRC
def parse_lrc(filepath):
    lyrics = []
    time_pattern = re.compile(r'\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]')
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            match = time_pattern.search(line)
            if match:
                m = int(match.group(1))
                s = int(match.group(2))
                ms_str = match.group(3) or '0'
                ms = int(ms_str.ljust(3, '0')[:3]) / 1000.0
                t = m * 60 + s + ms
                txt = time_pattern.sub('', line).strip()
                if txt:
                    lyrics.append((t, txt))
    lyrics.sort(key=lambda x: x[0])
    return lyrics

lrc_data = parse_lrc(LRC_PATH)

# Load Fonts
font_title = ImageFont.truetype(FONT_BOLD_PATH, 36)
font_artist = ImageFont.truetype(FONT_PATH, 20)
font_main = ImageFont.truetype(FONT_BOLD_PATH, 46)
font_sub = ImageFont.truetype(FONT_PATH, 28)
font_time = ImageFont.truetype(FONT_PATH, 18)

# Format time mm:ss
def fmt_time(seconds):
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{mins:02d}:{secs:02d}"

# Get active lyric index at timestamp t
def get_lyric_info(t):
    curr_idx = -1
    for i, (lyric_t, txt) in enumerate(lrc_data):
        if t >= lyric_t:
            curr_idx = i
        else:
            break
    
    curr_txt = lrc_data[curr_idx][1] if curr_idx >= 0 else "..."
    next_txt = lrc_data[curr_idx + 1][1] if (curr_idx + 1) < len(lrc_data) else ""
    return curr_txt, next_txt, curr_idx

# Load Audio to get duration
audio = AudioFileClip(MP3_PATH)
duration = audio.duration

# Render single frame at time t
def make_frame(t):
    # 1. Base Gradient Background (Deep Navy to Ocean Blue)
    img = Image.new("RGB", (WIDTH, HEIGHT), "#0b172a")
    draw = ImageDraw.Draw(img)
    
    # Animated subtle gradient wave pulse
    pulse = math.sin(t * 0.8) * 0.15 + 0.85
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(7 + ratio * 15 * pulse)
        g = int(23 + ratio * 45 * pulse)
        b = int(42 + ratio * 80 * pulse)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    # Decorative Glow Orbs
    orb_x = int(WIDTH * 0.5 + math.sin(t * 0.5) * 100)
    orb_y = int(HEIGHT * 0.4 + math.cos(t * 0.5) * 50)
    draw.ellipse([orb_x - 300, orb_y - 200, orb_x + 300, orb_y + 200], fill=None, outline=None)
    
    # 2. Main Glass Card Container
    card_x1, card_y1 = 140, 80
    card_x2, card_y2 = WIDTH - 140, HEIGHT - 100
    
    # Card Background with Round Corners
    draw.rounded_rectangle([card_x1, card_y1, card_x2, card_y2], radius=24, fill=(15, 25, 45, 200), outline=(255, 255, 255, 30), width=1)
    
    # Header: Song Title & Artist
    draw.text((WIDTH // 2, card_y1 + 45), "파도와 교복", font=font_title, fill="#ffffff", anchor="mm")
    draw.text((WIDTH // 2, card_y1 + 85), "Suno AI • 감성 K-POP", font=font_artist, fill="#94a3b8", anchor="mm")
    
    # Decorative Divider
    draw.line([(WIDTH // 2 - 80, card_y1 + 115), (WIDTH // 2 + 80, card_y1 + 115)], fill=(56, 189, 248, 120), width=2)
    
    # 3. Dynamic Synced Lyrics
    curr_txt, next_txt, _ = get_lyric_info(t)
    
    # Main Active Lyric Line (Glowing Cyan/White)
    lyric_y = card_y1 + 220
    # Text Shadow
    draw.text((WIDTH // 2 + 2, lyric_y + 2), curr_txt, font=font_main, fill=(0, 0, 0, 180), anchor="mm")
    draw.text((WIDTH // 2, lyric_y), curr_txt, font=font_main, fill="#38bdf8", anchor="mm")
    
    # Next Upcoming Line (Muted opacity)
    if next_txt:
        draw.text((WIDTH // 2, lyric_y + 75), next_txt, font=font_sub, fill="#64748b", anchor="mm")
        
    # 4. Bottom Timeline Progress Bar
    bar_x1, bar_y = card_x1 + 60, card_y2 - 60
    bar_x2 = card_x2 - 60
    bar_w = bar_x2 - bar_x1
    
    progress = min(1.0, max(0.0, t / duration))
    fill_w = int(bar_w * progress)
    
    # Bar Track
    draw.rounded_rectangle([bar_x1, bar_y, bar_x2, bar_y + 6], radius=3, fill=(255, 255, 255, 40))
    # Bar Fill
    if fill_w > 0:
        draw.rounded_rectangle([bar_x1, bar_y, bar_x1 + fill_w, bar_y + 6], radius=3, fill="#38bdf8")
        draw.ellipse([bar_x1 + fill_w - 6, bar_y - 3, bar_x1 + fill_w + 6, bar_y + 9], fill="#ffffff")
        
    # Time Indicators
    draw.text((bar_x1, bar_y + 20), fmt_time(t), font=font_time, fill="#94a3b8", anchor="lm")
    draw.text((bar_x2, bar_y + 20), fmt_time(duration), font=font_time, fill="#94a3b8", anchor="rm")
    
    return np.array(img)

print(f"Generating video clip for duration {duration:.2f} seconds...")
video = VideoClip(make_frame, duration=duration)
video = video.with_audio(audio)

print("Writing MP4 file...")
video.write_videofile(
    OUTPUT_MP4,
    fps=FPS,
    codec="libx264",
    audio_codec="aac",
    preset="fast"
)

print("Successfully created 파도.mp4!")
