// shared visual tokens for canvas + controls.
// `theme` always holds the active palette; applyPalette swaps it in place so the
// canvas loop (which reads theme every frame) and the next React render both pick it up
const base = {
  font: '"Noto Serif", Georgia, serif',
  // top/bottom control bars; canvas overlays stay clear of these
  barHeight: 64,
};

const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// dark palettes share the same structure: background, ink, one accent, and a tint per sthayi
const darkPalette = ({ name, bg, ink, accent, flare, mandra, tara, trailTail, muted = "rgba(160, 155, 175, 0.32)" }) => ({
  name, bg, ink, accent, flare,
  vermilion: "#c8402f",
  muted,
  bgGlow: rgba(accent, 0.06),
  guide: rgba(accent, 0.16),
  surface: rgba(bg, 0.82),
  surfaceHover: rgba(accent, 0.14),
  line: rgba(accent, 0.35),
  lineSoft: "rgba(255, 255, 255, 0.12)",
  sthayi: { mandra, madhya: accent, tara },
  trailTail,
  trailHead: flare,
  thumb: ink,
});

export const palettes = {
  lamp: darkPalette({ name: "Night + lamp gold", bg: "#0d0b1e", ink: "#f3ead8", accent: "#e9b44c", flare: "#f2c46b", mandra: "#8f7cf0", tara: "#f6dc9a", trailTail: "#5b4bd6" }),
  copper: darkPalette({ name: "Ink + copper", bg: "#0a0f11", ink: "#e8e2d6", accent: "#c8794a", flare: "#f0a86c", mandra: "#2fa59a", tara: "#ecc09a", trailTail: "#1f6f6a" }),
  lotus: darkPalette({ name: "Plum + lotus", bg: "#170d1b", ink: "#f6e9ee", accent: "#e07a8f", flare: "#ffb3a7", mandra: "#6fb5a2", tara: "#f3c1c9", trailTail: "#3e7f73" }),
  peacock: darkPalette({ name: "Peacock night", bg: "#071a1d", ink: "#eaf2ec", accent: "#d9b25f", flare: "#f5d58a", mandra: "#3aa59b", tara: "#a8d8c8", trailTail: "#1f5f66" }),
  ivory: {
    name: "Ivory (light)", bg: "#f4eee2", ink: "#2a1e14", accent: "#b5452f", flare: "#d9622b",
    vermilion: "#b5452f",
    muted: "rgba(90, 80, 70, 0.35)",
    bgGlow: "rgba(181, 69, 47, 0.05)",
    guide: "rgba(120, 80, 40, 0.18)",
    surface: "rgba(244, 238, 226, 0.88)",
    surfaceHover: "rgba(181, 69, 47, 0.12)",
    line: "rgba(181, 69, 47, 0.35)",
    lineSoft: "rgba(0, 0, 0, 0.12)",
    sthayi: { mandra: "#4b5ea8", madhya: "#b5452f", tara: "#c48a1c" },
    trailTail: "#4b5ea8",
    trailHead: "#d9622b",
    thumb: "#2a1e14",
  },
};

export const DEFAULT_PALETTE = "lamp";

const theme = { ...base, ...palettes[DEFAULT_PALETTE] };

export function applyPalette(key) {
  Object.assign(theme, palettes[key] ?? palettes[DEFAULT_PALETTE]);
}

export { rgba };
export default theme;
