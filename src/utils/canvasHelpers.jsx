import theme from "./theme";

// rect the camera frame occupies when scaled to cover a W x H viewport (like object-fit: cover)
export function getCoverFrame(imageWidth, imageHeight, W, H) {
  const scale = Math.max(W / imageWidth, H / imageHeight);
  const w = imageWidth * scale;
  const h = imageHeight * scale;
  return { x: (W - w) / 2, y: (H - h) / 2, w, h };
}

// normalized mediapipe landmark -> mirrored viewport (css px) coords
export function landmarkToScreen(landmark, frame) {
  return {
    x: frame.x + (1 - landmark.x) * frame.w,
    y: frame.y + landmark.y * frame.h,
  };
}

export function drawBackground(ctx, W, H) {
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.6);
  glow.addColorStop(0, theme.bgGlow);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
}
