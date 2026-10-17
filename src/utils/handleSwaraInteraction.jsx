// regions are annular sectors around (cx, cy); pad (px) grows the region on every side
export function containsPoint(region, x, y, pad = 0) {
  const distance = Math.hypot(x - region.cx, y - region.cy);
  if (distance < region.hitR0 - pad || distance > region.hitR1 + pad) return false;
  const delta = Math.atan2(y - region.cy, x - region.cx) - region.angle;
  const halfWithPad = region.hitHalf + pad / Math.max(distance, 1);
  return Math.abs(Math.atan2(Math.sin(delta), Math.cos(delta))) <= halfWithPad;
}

const regionKey = r => `${r.swara}:${r.sthayi}`;

// while held on a swara, the point must move this far past its edge before another swara takes over,
// so jitter on a boundary can't flip between neighbours
const STICKY_PAD_PX = 10;

// isDown/wasDown: this frame's and last frame's pinch (or mouse button) state.
// held: key of the swara this source last played while still down.
// A swara plays on pinch-down, and again whenever a held pinch slides onto a different swara.
export function handleSwaraInteraction({ swaraBoxes, x, y, isDown, wasDown, held = null, playNote, recordSwara }) {
  const heldBox = isDown && held ? swaraBoxes.find(b => regionKey(b) === held) : null;
  const box = heldBox && containsPoint(heldBox, x, y, STICKY_PAD_PX)
    ? heldBox
    : swaraBoxes.find(b => containsPoint(b, x, y));

  if (!box) return { swara: null, sthayi: null, mode: null, isReachable: true, held: null };

  const { swara, sthayi, isReachable } = box;
  const key = regionKey(box);

  if (!isDown) return { swara, sthayi, mode: 'Hover', isReachable, held: null };

  if ((!wasDown || key !== held) && isReachable) {
    if (playNote) playNote(swara, sthayi);
    if (recordSwara) recordSwara(swara, sthayi);
    return { swara, sthayi, mode: 'Played', isReachable, held: key };
  }

  // still down on the same swara (or an unreachable one): nothing new plays
  return { swara, sthayi, mode: null, isReachable, held: key === held ? held : null };
}
