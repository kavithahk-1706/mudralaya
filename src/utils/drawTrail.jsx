import theme from "./theme";

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// trail smoothing: slow movement is mostly tracking jitter, so it gets damped hard;
// fast movement is intentional, so the trail follows it more closely
const SMOOTHING_MIN = 0.2;
const SMOOTHING_MAX = 0.8;
const SMOOTHING_SPEED_PX = 80;

const TRAIL_MAX_WIDTH = 4;

// moves prev toward raw by a speed-dependent factor (exponential smoothing)
export function smoothPoint(prev, raw) {
  if (!prev) return raw;
  const speed = Math.hypot(raw.x - prev.x, raw.y - prev.y);
  const alpha = Math.min(SMOOTHING_MAX, SMOOTHING_MIN + (SMOOTHING_MAX - SMOOTHING_MIN) * (speed / SMOOTHING_SPEED_PX));
  return { x: prev.x + (raw.x - prev.x) * alpha, y: prev.y + (raw.y - prev.y) * alpha };
}

// chaikin corner cutting: rounds a polyline into a curve, keeping its endpoints
function roundCorners(points, iterations = 2) {
  let pts = points;
  for (let k = 0; k < iterations; k++) {
    const next = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      next.push({ x: 0.75 * a.x + 0.25 * b.x, y: 0.75 * a.y + 0.25 * b.y });
      next.push({ x: 0.25 * a.x + 0.75 * b.x, y: 0.25 * a.y + 0.75 * b.y });
    }
    next.push(pts[pts.length - 1]);
    pts = next;
  }
  return pts;
}

// luminous trail behind the index fingertip; points are oldest -> newest.
// drawn as one tapered ribbon (a single fill) so there are no seams between segments
export function drawIndexTrail(ctx, points) {
  if (points.length < 3) return;

  const pts = roundCorners(points);
  const n = pts.length;
  const left = [];
  const right = [];

  for (let i = 0; i < n; i++) {
    const before = pts[Math.max(0, i - 1)];
    const after = pts[Math.min(n - 1, i + 1)];
    const len = Math.hypot(after.x - before.x, after.y - before.y) || 1;
    const nx = -(after.y - before.y) / len;
    const ny = (after.x - before.x) / len;
    const halfWidth = 0.3 + TRAIL_MAX_WIDTH * (i / (n - 1));
    left.push({ x: pts[i].x + nx * halfWidth, y: pts[i].y + ny * halfWidth });
    right.push({ x: pts[i].x - nx * halfWidth, y: pts[i].y - ny * halfWidth });
  }

  const tail = pts[0];
  const head = pts[n - 1];
  const [tr, tg, tb] = hexToRgb(theme.trailTail);
  const [hr, hg, hb] = hexToRgb(theme.trailHead);

  // a gradient needs some length; a near-still finger just gets a faint solid fill
  let fill = `rgba(${hr}, ${hg}, ${hb}, 0.5)`;
  if (Math.hypot(head.x - tail.x, head.y - tail.y) > 2) {
    fill = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
    fill.addColorStop(0, `rgba(${tr}, ${tg}, ${tb}, 0)`);
    fill.addColorStop(0.5, `rgba(${tr}, ${tg}, ${tb}, 0.55)`);
    fill.addColorStop(1, `rgba(${hr}, ${hg}, ${hb}, 0.95)`);
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(left[0].x, left[0].y);
  for (let i = 1; i < n; i++) ctx.lineTo(left[i].x, left[i].y);
  for (let i = n - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.shadowColor = theme.trailHead;
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.restore();
}

// fingertip markers: index glows, thumb is a small dot, a thin string joins them while pinching
export function drawFingertips(ctx, index, thumb, isPinching) {
  ctx.save();

  if (isPinching) {
    ctx.strokeStyle = theme.trailHead;
    ctx.shadowColor = theme.trailHead;
    ctx.shadowBlur = 10;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(thumb.x, thumb.y);
    ctx.lineTo(index.x, index.y);
    ctx.stroke();
  }

  ctx.shadowBlur = 16;
  ctx.shadowColor = theme.trailHead;
  ctx.fillStyle = theme.trailHead;
  ctx.beginPath();
  ctx.arc(index.x, index.y, isPinching ? 7 : 5, 0, 2 * Math.PI);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = theme.thumb;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(thumb.x, thumb.y, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}
