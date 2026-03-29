from pathlib import Path

from PIL import Image

PROJECT_ROOT = Path("/home/ubuntu/kmcerto-mobile")
SOURCE = Path("/home/ubuntu/webdev-static-assets/kmcerto-icon.png")

TARGETS = {
    PROJECT_ROOT / "assets/images/icon.png": 1024,
    PROJECT_ROOT / "assets/images/splash-icon.png": 1024,
    PROJECT_ROOT / "assets/images/favicon.png": 256,
    PROJECT_ROOT / "assets/images/android-icon-foreground.png": 432,
}


def ensure_rgba(image: Image.Image) -> Image.Image:
    if image.mode != "RGBA":
        return image.convert("RGBA")
    return image


def resize_square(image: Image.Image, size: int) -> Image.Image:
    if image.width == size and image.height == size:
        return image
    return image.resize((size, size), Image.Resampling.LANCZOS)


def save_optimized(image: Image.Image, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    quantized = image.quantize(colors=64, method=Image.FASTOCTREE)
    quantized.save(target, format="PNG", optimize=True, compress_level=9)


with Image.open(SOURCE) as original:
    base = ensure_rgba(original)
    for target, size in TARGETS.items():
        optimized = resize_square(base, size)
        save_optimized(optimized, target)
        print(f"optimized {target} -> {size}x{size} ({target.stat().st_size} bytes)")
