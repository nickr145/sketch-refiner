import base64
import io
import cv2
import numpy as np
from PIL import Image

def refine_image(image_base64: str, constraints: dict) -> str:
    # Decode image
    image_bytes = base64.b64decode(image_base64.split(",")[-1])
    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = np.array(pil_img)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    # Optional edge-preserving smoothing
    if constraints.get("smoothLines", False):
        gray = cv2.bilateralFilter(gray, d=7, sigmaColor=40, sigmaSpace=40)

    # Inverted threshold (SAFE for line art)
    _, cleaned = cv2.threshold(
        gray, 200, 255, cv2.THRESH_BINARY_INV
    )

    # Convert back to RGB
    cleaned_rgb = cv2.cvtColor(cleaned, cv2.COLOR_GRAY2RGB)

    # Encode to base64 (RAW — no prefix)
    buffer = io.BytesIO()
    Image.fromarray(cleaned_rgb).save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode()

    return encoded



