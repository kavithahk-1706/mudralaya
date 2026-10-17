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

// every palette shares the same structure: background, ink, one accent, and a tint per sthayi
const darkPalette = ({ name, bg, ink, accent, flare, mandra, tara, trailTail, muted = "rgba(160, 155, 175, 0.32)" }) => ({
  name, mode: "dark", bg, ink, accent, flare,
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

// light palettes need darker guides and softer surfaces to keep contrast on a pale background
const lightPalette = ({ name, bg, ink, accent, flare, mandra, tara, vermilion = accent }) => ({
  name, mode: "light", bg, ink, accent, flare,
  vermilion,
  muted: rgba(ink, 0.35),
  bgGlow: rgba(accent, 0.05),
  guide: rgba(ink, 0.16),
  surface: rgba(bg, 0.88),
  surfaceHover: rgba(accent, 0.12),
  line: rgba(accent, 0.35),
  lineSoft: "rgba(0, 0, 0, 0.12)",
  sthayi: { mandra, madhya: accent, tara },
  trailTail: mandra,
  trailHead: flare,
  thumb: ink,
});

export const palettes = {
  lamp: darkPalette({ name: "Night + lamp gold", bg: "#0d0b1e", ink: "#f3ead8", accent: "#e9b44c", flare: "#f2c46b", mandra: "#8f7cf0", tara: "#f6dc9a", trailTail: "#5b4bd6" }),
  copper: darkPalette({ name: "Ink + copper", bg: "#0a0f11", ink: "#e8e2d6", accent: "#c8794a", flare: "#f0a86c", mandra: "#2fa59a", tara: "#ecc09a", trailTail: "#1f6f6a" }),
  lotus: darkPalette({ name: "Plum + lotus", bg: "#170d1b", ink: "#f6e9ee", accent: "#e07a8f", flare: "#ffb3a7", mandra: "#6fb5a2", tara: "#f3c1c9", trailTail: "#3e7f73" }),
  peacock: darkPalette({ name: "Peacock night", bg: "#071a1d", ink: "#eaf2ec", accent: "#d9b25f", flare: "#f5d58a", mandra: "#3aa59b", tara: "#a8d8c8", trailTail: "#1f5f66" }),
  ivory: lightPalette({ name: "Ivory + vermilion", bg: "#f4eee2", ink: "#2a1e14", accent: "#b5452f", flare: "#d9622b", mandra: "#4b5ea8", tara: "#c48a1c" }),
  sandal: lightPalette({ name: "Sandalwood", bg: "#f2e6d2", ink: "#2b2117", accent: "#9a5b1e", flare: "#c97a2b", mandra: "#3f6b5c", tara: "#a77d22", vermilion: "#b5452f" }),
  jasmine: lightPalette({ name: "Jasmine + leaf", bg: "#eef2ec", ink: "#1d2a24", accent: "#2f7a63", flare: "#3a9b78", mandra: "#5a4f9e", tara: "#a87a2e", vermilion: "#b5452f" }),
  dawn: lightPalette({ name: "Lotus dawn", bg: "#f7ecef", ink: "#2c1a22", accent: "#a63d62", flare: "#cf5a80", mandra: "#3d6d8a", tara: "#b9853a" }),
};

export const PALETTE_GROUPS = [
  { mode: "dark", label: "Dark" },
  { mode: "light", label: "Light" },
];

export const DEFAULT_PALETTE = "lamp";

const theme = { ...base, ...palettes[DEFAULT_PALETTE] };

// the pages outside the canvas style themselves through these css variables
const CSS_VARS = {
  "--bg": "bg", "--ink": "ink", "--accent": "accent", "--flare": "flare", "--muted": "muted",
  "--surface": "surface", "--surface-hover": "surfaceHover", "--line": "line", "--line-soft": "lineSoft",
  "--vermilion": "vermilion", "--glow": "bgGlow",
};

export function applyPalette(key) {
  Object.assign(theme, palettes[key] ?? palettes[DEFAULT_PALETTE]);
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries(CSS_VARS).forEach(([name, token]) => root.style.setProperty(name, theme[token]));
  root.style.setProperty("--ink-soft", rgba(theme.ink, 0.72));
  root.style.setProperty("--mandra", theme.sthayi.mandra);
  root.style.setProperty("--tara", theme.sthayi.tara);
  root.style.colorScheme = theme.mode;
}

export { rgba };
export default theme;
