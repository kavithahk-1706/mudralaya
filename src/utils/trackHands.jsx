// keeps a stable state object per physical hand across frames.
// MediaPipe's Left/Right label can flip between frames, so hands are matched to the
// state whose last index fingertip is nearest instead.

// a hand that vanishes for less than this keeps its state (pinch, trail) when it comes back
const LOST_GRACE_MS = 250;
// a detected hand only continues a state whose fingertip was within this fraction of the screen
const MATCH_FRACTION = 0.3;

const newHandState = () => ({ pinching: false, uiPinching: false, held: null, index: null, raw: null, trail: [], lastSeen: 0 });

// rawPoints: index fingertip (screen px) per detected hand. Returns a state per detected hand, same order.
export function matchHands(states, rawPoints, now, maxDistance) {
  // drop hands lost for too long
  for (let i = states.length - 1; i >= 0; i--) {
    if (now - states[i].lastSeen > LOST_GRACE_MS) states.splice(i, 1);
  }

  const free = new Set(states);
  // nearest pairs first, so two hands can't steal each other's state
  const pairs = [];
  rawPoints.forEach((p, i) => states.forEach(s => {
    if (s.raw) pairs.push({ i, s, d: Math.hypot(p.x - s.raw.x, p.y - s.raw.y) });
  }));
  pairs.sort((a, b) => a.d - b.d);

  const matched = new Array(rawPoints.length).fill(null);
  for (const { i, s, d } of pairs) {
    if (matched[i] || !free.has(s) || d > maxDistance) continue;
    matched[i] = s;
    free.delete(s);
  }

  return matched.map(s => {
    if (s) return s;
    const fresh = newHandState();
    states.push(fresh);
    return fresh;
  });
}

export const handMatchDistance = (W, H) => Math.min(W, H) * MATCH_FRACTION;
