from fastapi import APIRouter, Query, HTTPException
from PIL import Image
from io import BytesIO
import colorsys
import requests as http

router = APIRouter()


def _accent_from_image(data: bytes) -> str:
    img = Image.open(BytesIO(data)).convert("RGB").resize((100, 100))
    pixels = list(img.getdata())

    # 36 hue buckets of 10 degrees each, weighted by saturation × brightness
    buckets = [0.0] * 36
    for r, g, b in pixels:
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        if s < 0.3 or v < 0.2 or v > 0.95:
            continue
        buckets[int(h * 36) % 36] += s * v

    if max(buckets) == 0:
        return "#3498db"

    best_bucket = buckets.index(max(buckets))
    hue = (best_bucket + 0.5) / 36  # centre of winning bucket
    r, g, b = colorsys.hsv_to_rgb(hue, 0.85, 0.88)
    return "#{:02x}{:02x}{:02x}".format(int(r * 255), int(g * 255), int(b * 255))


@router.get("/color-from-url")
def color_from_url(url: str = Query(...)):
    try:
        resp = http.get(url, timeout=5, headers={"User-Agent": "Mozilla/5.0"})
        resp.raise_for_status()
        return {"color": _accent_from_image(resp.content)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
