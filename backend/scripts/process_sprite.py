"""
角色Q版精灵图处理脚本
功能: 镜像 → 裁剪9帧(3x3网格) → 抠白底 → 输出单行序列帧PNG

用法:
  python process_sprite.py 输入图.png [选项]
  
选项:
  --cols 3         网格列数 (默认3)
  --rows 3         网格行数 (默认3)
  --out 输出路径   输出文件路径 (默认同目录_chibi_spritesheet.png)
  --threshold 240  白底抠图阈值 (0-255, 默认240)
  --nomirror       不镜像
  --pad 2          帧间距像素 (默认2, 输出序列帧之间的间距)
"""

import sys
import os
from pathlib import Path
from PIL import Image

def mirror_image(img: Image.Image) -> Image.Image:
    """水平镜像"""
    return img.transpose(Image.FLIP_LEFT_RIGHT)

def remove_white_bg(img: Image.Image, threshold: int = 240) -> Image.Image:
    """去除白色/近白色背景，转为透明"""
    img = img.convert("RGBA")
    data = img.load()
    width, height = img.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = data[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                data[x, y] = (r, g, b, 0)  # 透明
    return img

def remove_color_bg(img: Image.Image, target_r: int, target_g: int, target_b: int, tolerance: int = 30) -> Image.Image:
    """去除指定颜色背景"""
    img = img.convert("RGBA")
    data = img.load()
    width, height = img.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = data[x, y]
            if (abs(r - target_r) <= tolerance and 
                abs(g - target_g) <= tolerance and 
                abs(b - target_b) <= tolerance):
                data[x, y] = (r, g, b, 0)
    return img

def detect_bg_color(img: Image.Image) -> tuple:
    """检测四个角的平均颜色作为背景色"""
    img = img.convert("RGB")
    w, h = img.size
    corners = [
        img.getpixel((2, 2)),
        img.getpixel((w-3, 2)),
        img.getpixel((2, h-3)),
        img.getpixel((w-3, h-3)),
    ]
    r = sum(c[0] for c in corners) // 4
    g = sum(c[1] for c in corners) // 4
    b = sum(c[2] for c in corners) // 4
    return (r, g, b)

def crop_grid(img: Image.Image, cols: int, rows: int) -> list[Image.Image]:
    """将图片按网格裁剪为帧列表"""
    width = img.size[0] // cols
    height = img.size[1] // rows
    frames = []
    for row in range(rows):
        for col in range(cols):
            x = col * width
            y = row * height
            frame = img.crop((x, y, x + width, y + height))
            frames.append(frame)
    return frames

def build_spritesheet(frames: list[Image.Image], pad: int = 2) -> Image.Image:
    """将帧列表拼接为单行序列帧PNG"""
    max_h = max(f.size[1] for f in frames)
    total_w = sum(f.size[0] for f in frames) + pad * (len(frames) - 1)
    sheet = Image.new("RGBA", (total_w, max_h), (0, 0, 0, 0))
    x = 0
    for frame in frames:
        y = (max_h - frame.size[1]) // 2  # 垂直居中
        sheet.paste(frame, (x, y), frame if frame.mode == 'RGBA' else None)
        x += frame.size[0] + pad
    return sheet

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"错误: 文件 '{input_path}' 不存在")
        sys.exit(1)

    # 解析参数
    cols, rows = 3, 3
    out_path = None
    threshold = 240
    pad = 2
    do_mirror = True

    args = sys.argv[2:]
    i = 0
    while i < len(args):
        if args[i] == '--cols' and i+1 < len(args):
            cols = int(args[i+1]); i += 2
        elif args[i] == '--rows' and i+1 < len(args):
            rows = int(args[i+1]); i += 2
        elif args[i] == '--out' and i+1 < len(args):
            out_path = Path(args[i+1]); i += 2
        elif args[i] == '--threshold' and i+1 < len(args):
            threshold = int(args[i+1]); i += 2
        elif args[i] == '--pad' and i+1 < len(args):
            pad = int(args[i+1]); i += 2
        elif args[i] == '--nomirror':
            do_mirror = False; i += 1
        else:
            i += 1

    if out_path is None:
        out_path = input_path.parent / f"{input_path.stem}_spritesheet.png"

    print(f"处理: {input_path}")
    print(f"网格: {cols}x{rows} = {cols*rows}帧")
    print(f"路径: {out_path}")

    # 加载图片
    img = Image.open(input_path)
    print(f"原图尺寸: {img.size}")

    # 1. 镜像
    if do_mirror:
        print("→ 水平镜像...")
        img = mirror_image(img)

    # 2. 检测背景色并抠图
    bg_color = detect_bg_color(img)
    print(f"→ 检测背景色: RGB{bg_color}")
    print(f"→ 抠图(容差30)...")
    img = remove_color_bg(img, *bg_color, tolerance=30)

    # 3. 裁剪帧
    print(f"→ 裁剪为 {cols}x{rows} 帧...")
    frames = crop_grid(img, cols, rows)
    print(f"  每帧尺寸: {frames[0].size}")

    # 4. 合成序列帧
    print(f"→ 合成单行序列帧(间距{pad}px)...")
    sheet = build_spritesheet(frames, pad)
    print(f"  序列帧尺寸: {sheet.size}")

    # 5. 保存
    sheet.save(out_path, "PNG")
    print(f"\n✅ 完成: {out_path}")
    print(f"   总帧数: {len(frames)}")
    print(f"   每帧宽: {frames[0].size[0]}px")
    print(f"   每帧高: {frames[0].size[1]}px")
    print(f"   CSS宽度: {sheet.size[0]}px / {len(frames)} = {frames[0].size[0]}px/帧")
    print(f"\n   CSS动画参考:")
    total_frames = len(frames)
    frame_w = frames[0].size[0]
    duration = 1.5  # 秒
    print(f"   @keyframes chibi-idle {{")
    print(f"     from {{ background-position: 0 0; }}")
    print(f"     to {{ background-position: -{sheet.size[0]}px 0; }}")
    print(f"   }}")
    print(f"   或 steps({total_frames}) 分帧: animation: chibi-idle {duration}s steps({total_frames}) infinite;")

if __name__ == "__main__":
    main()
