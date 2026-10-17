import { getCoverFrame } from "./canvasHelpers";
import theme from "./theme";

// overlay width as a fraction of the viewport width
const SIZE_FRACTION = { S: 0.18, M: 0.26, L: 0.36 };
const MARGIN = 16;
// keep windowed overlays clear of the top and bottom control bars
const INSET_TOP = theme.barHeight + 12;
const INSET_BOTTOM = theme.barHeight + 12;

// where the camera overlay sits on screen (css px)
export function getOverlayRect(position, size, imageWidth, imageHeight, W, H) {
  if (position === "fullscreen") return getCoverFrame(imageWidth, imageHeight, W, H);

  const w = W * (SIZE_FRACTION[size] ?? SIZE_FRACTION.M);
  const h = w * (imageHeight / imageWidth);

  const x = position.endsWith("left") ? MARGIN : W - w - MARGIN;
  let y = (H - h) / 2; // left / right sides
  if (position.startsWith("top")) y = INSET_TOP;
  if (position.startsWith("bottom")) y = H - h - INSET_BOTTOM;

  return { x, y, w, h };
}

// draws the mirrored camera frame into the given rect
export function drawCameraFrame(ctx, image, frame, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(frame.x + frame.w, frame.y);
  ctx.scale(-1, 1);
  ctx.drawImage(image, 0, 0, frame.w, frame.h);
  ctx.restore();
}

// blurring a full-size frame every render is expensive and steals main-thread time from
// hand detection, so each camera frame is blurred once at quarter size and reused until the next one
const DOWNSCALE = 4;
const cache = { key: null, blurPx: null, canvas: null };

function blurredFrame(image, frameKey, blurPx) {
  if (blurPx <= 0) return image;
  if (cache.key === frameKey && cache.blurPx === blurPx) return cache.canvas;

  cache.canvas ??= document.createElement("canvas");
  const w = Math.max(1, Math.round(image.width / DOWNSCALE));
  const h = Math.max(1, Math.round(image.height / DOWNSCALE));
  if (cache.canvas.width !== w || cache.canvas.height !== h) {
    cache.canvas.width = w;
    cache.canvas.height = h;
  }
  const ctx = cache.canvas.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.filter = `blur(${blurPx / DOWNSCALE}px)`;
  ctx.drawImage(image, 0, 0, w, h);
  ctx.filter = "none";

  cache.key = frameKey;
  cache.blurPx = blurPx;
  return cache.canvas;
}

// frameKey identifies the camera frame (changes once per detection result)
export function drawCameraOverlay(ctx, image, frameKey, rect, { windowed, opacity, blurPx }) {
  const source = blurredFrame(image, frameKey, blurPx);
  if (!windowed) {
    drawCameraFrame(ctx, source, rect, opacity);
    return;
  }

  // windowed: rounded, clipped frame with a hairline border
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.w, rect.h, 12);
  ctx.clip();
  drawCameraFrame(ctx, source, rect, opacity);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = theme.accent;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.w, rect.h, 12);
  ctx.stroke();
  ctx.restore();
}
