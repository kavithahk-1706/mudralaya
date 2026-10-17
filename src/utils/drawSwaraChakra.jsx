import theme, { rgba } from "./theme";
import { isSwaraReachable } from "./swaraValidation";

const SWARA_ORDER = ["S", "R1", "R2", "G2", "G3", "M1", "M2", "P", "D1", "D2", "N2", "N3"];
const SWARA_POS = { S: 0, R1: 1, R2: 2, G2: 3, G3: 4, M1: 5, M2: 6, P: 7, D1: 8, D2: 9, N2: 10, N3: 11 };

// the wheel has 18 slots of 20° each; madhya's 12 semitones take 240° of it
const SLOTS = 18;
const STEP = (2 * Math.PI) / SLOTS;
// angle of slot k: S at the bottom, k > 0 runs anticlockwise on screen
const slotAngle = k => Math.PI / 2 - k * STEP;

const PLAYED_FLARE_MS = 450;
const HUB_HOLD_MS = 1500;

// radii as fractions of the wheel size
const RING = { mandra: 0.2, madhya: 0.32, tara: 0.44 };
const RING_WIDTH = 0.116;
// hit areas cover the whole slot and meet the neighbouring ring halfway, so there are no dead gaps
const RING_GAP = 0.12 - RING_WIDTH;
const HUB = 0.12;
const RIM = 0.5;

const SUBSCRIPTS = "₀₁₂₃₄₅₆₇₈₉";

// R1 in tara -> Ṙ₁ (dot above), in mandra -> Ṛ₁ (dot below)
export function swaraLabel(swara, sthayi) {
  const letter = swara.match(/[A-Z]+/)?.[0] ?? swara;
  const number = swara.match(/\d+/)?.[0];
  const dot = sthayi === "tara" ? "̇" : sthayi === "mandra" ? "̣" : "";
  return letter + dot + (number ? [...number].map(d => SUBSCRIPTS[d]).join("") : "");
}

// same sthayi subsets the old row layout used
function ragaSwaras(raga) {
  const set = new Set([...(raga.arohana || []), ...(raga.avarohana || [])]);
  const madhya = SWARA_ORDER.filter(sw => set.has(sw));
  const tara = madhya.slice(0, Math.ceil(madhya.length / 2) + 1);
  const mandra = (raga.avarohana || []).slice(1, Math.ceil((raga.avarohana || []).length / 2) + 1);
  return { madhya, tara, mandra };
}

function sector(cx, cy, r0, r1, angle, hitPad) {
  const rMid = (r0 + r1) / 2;
  return {
    shape: "sector", cx, cy, r0, r1, angle,
    half: STEP * 0.47,
    hitHalf: STEP * 0.5,
    hitR0: r0 - hitPad,
    hitR1: r1 + hitPad,
    labelX: cx + Math.cos(angle) * rMid,
    labelY: cy + Math.sin(angle) * rMid,
  };
}

// folded layout: madhya runs anticlockwise from S, turns at Ṡ and tara comes back clockwise on the
// outer ring; mandra runs clockwise from S on the inner ring. S and Ṡ are the hinges, so they span
// the two rings they join.
export function buildChakra(raga, cx, cy, size) {
  if (!raga) return [];
  const { madhya, tara, mandra } = ragaSwaras(raga);
  const half = (RING_WIDTH * size) / 2;
  const hitPad = (RING_GAP * size) / 2;
  const ring = st => [RING[st] * size - half, RING[st] * size + half];
  const regions = [];

  madhya.forEach(sw => {
    const k = SWARA_POS[sw];
    const [r0, r1] = k === 0 ? [ring("mandra")[0], ring("madhya")[1]] : ring("madhya");
    regions.push({ swara: sw, sthayi: "madhya", ...sector(cx, cy, r0, r1, slotAngle(k), hitPad) });
  });
  tara.forEach(sw => {
    const j = SWARA_POS[sw];
    const [r0, r1] = j === 0 ? [ring("madhya")[0], ring("tara")[1]] : ring("tara");
    regions.push({ swara: sw, sthayi: "tara", ...sector(cx, cy, r0, r1, slotAngle(12 - j), hitPad) });
  });
  mandra.forEach(sw => {
    const below = 12 - SWARA_POS[sw]; // semitones below S
    regions.push({ swara: sw, sthayi: "mandra", ...sector(cx, cy, ...ring("mandra"), slotAngle(-below), hitPad) });
  });

  return regions;
}

const point = (cx, cy, r, a) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];

function sectorPath(ctx, g) {
  ctx.beginPath();
  ctx.arc(g.cx, g.cy, g.r1, g.angle - g.half, g.angle + g.half);
  ctx.arc(g.cx, g.cy, g.r0, g.angle + g.half, g.angle - g.half, true);
  ctx.closePath();
}

// the wheel itself: hub, ring tracks, 18 spokes between the slots, outer rim with a slowly turning bead ring
function drawWheel(ctx, cx, cy, size, now) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = theme.guide;

  const circle = r => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.stroke(); };
  circle(HUB * size);
  Object.values(RING).forEach(r => circle(r * size));

  for (let k = 0; k < SLOTS; k++) {
    const a = slotAngle(k + 0.5);
    ctx.beginPath();
    ctx.moveTo(...point(cx, cy, HUB * size, a));
    ctx.lineTo(...point(cx, cy, RIM * size, a));
    ctx.stroke();
  }

  ctx.strokeStyle = theme.line;
  circle(RIM * size);
  circle((RIM + 0.03) * size);

  // decorative only: the targets never move
  const spin = now * 0.00004;
  ctx.fillStyle = theme.line;
  for (let i = 0; i < SLOTS * 2; i++) {
    ctx.beginPath();
    ctx.arc(...point(cx, cy, (RIM + 0.015) * size, spin + (i * Math.PI) / SLOTS), size * 0.004, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.restore();
}

// draws the chakra and the hub status; returns hit regions
export function drawSwaraChakra(ctx, { raga, cx, cy, size, currentSwara, hover, played, now }) {
  drawWheel(ctx, cx, cy, size, now);
  const regions = buildChakra(raga, cx, cy, size);

  regions.forEach(g => {
    g.isReachable = currentSwara
      ? isSwaraReachable(currentSwara.swara, currentSwara.sthayi, g.swara, g.sthayi, raga)
      : true;
    const tint = theme.sthayi[g.sthayi];
    const isHover = hover?.swara === g.swara && hover?.sthayi === g.sthayi;
    const isPlayed = played?.swara === g.swara && played?.sthayi === g.sthayi;
    const flare = isPlayed ? Math.max(0, 1 - (now - played.at) / PLAYED_FLARE_MS) : 0;

    sectorPath(ctx, g);
    ctx.fillStyle = g.isReachable ? rgba(tint, isHover ? 0.34 : 0.14) : "rgba(128, 128, 128, 0.05)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = g.isReachable ? rgba(tint, isHover ? 0.9 : 0.5) : theme.muted;
    ctx.stroke();

    if (flare > 0) {
      ctx.save();
      ctx.shadowColor = theme.flare;
      ctx.shadowBlur = 26 * flare;
      ctx.fillStyle = rgba(theme.flare, 0.55 * flare);
      sectorPath(ctx, g);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = g.isReachable ? theme.ink : theme.muted;
    ctx.font = `${Math.round(size * 0.045)}px ${theme.font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(swaraLabel(g.swara, g.sthayi), g.labelX, g.labelY);
  });

  // hub shows what you're on: the hovered swara, else the one just played
  const recentPlayed = played && now - played.at < HUB_HOLD_MS ? played : null;
  const shown = hover || recentPlayed;
  if (shown?.swara) {
    const allowed = shown.isReachable !== false;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = allowed ? theme.ink : theme.muted;
    ctx.font = `600 ${Math.round(size * 0.075)}px ${theme.font}`;
    ctx.fillText(swaraLabel(shown.swara, shown.sthayi), cx, cy - size * 0.012);
    ctx.font = `${Math.round(size * 0.026)}px ${theme.font}`;
    ctx.fillStyle = rgba(theme.ink, 0.6);
    ctx.fillText(allowed ? shown.sthayi : "not in raga direction", cx, cy + size * 0.045);
  }

  return regions;
}
