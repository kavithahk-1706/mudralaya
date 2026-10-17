import { useEffect, useState } from "react";
import { applyPalette, DEFAULT_PALETTE } from "../utils/theme";

const STORAGE_KEY = "mudralaya.viewSettings";

export const DEFAULT_VIEW_SETTINGS = {
  cameraVisible: true,
  cameraPosition: "fullscreen", // top-left | top-right | bottom-left | bottom-right | left | right | fullscreen
  cameraSize: "M", // S | M | L (ignored when fullscreen)
  cameraOpacity: 0.2,
  cameraBlurPx: 5,
  trailEnabled: true,
  palette: DEFAULT_PALETTE,
};

const loadSettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const settings = { ...DEFAULT_VIEW_SETTINGS, ...saved };
    applyPalette(settings.palette);
    return settings;
  } catch {
    return DEFAULT_VIEW_SETTINGS;
  }
};

// trail is compulsory without the camera: it's the only spatial reference left
export const isTrailOn = (settings) => !settings.cameraVisible || settings.trailEnabled;

// camera/trail display settings, remembered across visits
export default function useViewSettings() {
  const [viewSettings, setViewSettings] = useState(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewSettings));
    } catch {
      // storage unavailable (private mode etc.), settings just won't persist
    }
  }, [viewSettings]);

  const updateViewSettings = (changes) => {
    // swap the palette before re-rendering so controls pick it up in the same render
    if (changes.palette) applyPalette(changes.palette);
    setViewSettings(prev => ({ ...prev, ...changes }));
  };

  return [viewSettings, updateViewSettings];
}
