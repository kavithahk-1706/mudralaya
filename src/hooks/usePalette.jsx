import { useSyncExternalStore } from "react";
import { applyPalette, DEFAULT_PALETTE, palettes } from "../utils/theme";

// one palette for the whole app, shared by every page and remembered across visits
const STORAGE_KEY = "mudralaya.palette";
const listeners = new Set();

function loadPalette() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
      // earlier versions kept the palette inside the playground's view settings
      ?? JSON.parse(localStorage.getItem("mudralaya.viewSettings"))?.palette;
    return palettes[saved] ? saved : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
}

let current = loadPalette();
applyPalette(current);

export function setPalette(key) {
  if (!palettes[key] || key === current) return;
  current = key;
  applyPalette(key);
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // storage unavailable, the choice just won't persist
  }
  listeners.forEach(listener => listener());
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export default function usePalette() {
  const palette = useSyncExternalStore(subscribe, () => current);
  return [palette, setPalette];
}
