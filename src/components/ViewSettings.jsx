import { useState } from "react";
import { BsGear, BsX } from "react-icons/bs";
import theme, { palettes } from "../utils/theme";
import { isTrailOn } from "../hooks/useViewSettings";

// 3x3 picker: corners, sides, centre = fullscreen (top/bottom middle unused)
const POSITION_GRID = [
  ["top-left", null, "top-right"],
  ["left", "fullscreen", "right"],
  ["bottom-left", null, "bottom-right"],
];

const SIZES = ["S", "M", "L"];

function Row({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span style={{ color: theme.ink }}>{label}</span>
        {hint && <span className="text-xs" style={{ color: theme.muted }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, disabled, onChange }) {
  return (
    <button
      type="button"
      data-pinchable
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="relative h-6 w-11 rounded-full p-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      style={{ background: checked ? theme.accent : theme.lineSoft, border: "none" }}
    >
      <span
        className="absolute top-1 h-4 w-4 rounded-full transition-all"
        style={{ left: checked ? 24 : 4, background: theme.bg }}
      />
    </button>
  );
}

function Chip({ active, disabled, onClick, children, title }) {
  return (
    <button
      type="button"
      data-pinchable
      title={title}
      disabled={disabled}
      onClick={onClick}
      className="rounded-md px-0 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-30"
      style={{
        background: active ? theme.accent : theme.surfaceHover,
        color: active ? theme.bg : theme.ink,
        border: `1px solid ${active ? theme.accent : theme.lineSoft}`,
      }}
    >
      {children}
    </button>
  );
}

// mouse-only panel for palette, camera overlay + finger trail
export default function ViewSettings({ viewSettings, updateViewSettings }) {
  const [open, setOpen] = useState(false);
  const { cameraVisible, cameraPosition, cameraSize, cameraOpacity, cameraBlurPx } = viewSettings;

  return (
    <div className="fixed right-5 top-1/2 z-50 flex -translate-y-1/2 items-center gap-3">
      {open && (
        <div
          className="flex w-64 flex-col gap-4 rounded-xl p-4 backdrop-blur-md"
          style={{ background: theme.surface, border: `1px solid ${theme.line}` }}
        >
          <div className="flex items-center justify-between">
            <span className="text-base" style={{ color: theme.accent, fontFamily: theme.font }}>View</span>
            <button type="button"
      data-pinchable onClick={() => setOpen(false)} className="p-1" style={{ background: "none", color: theme.ink }}>
              <BsX />
            </button>
          </div>

          <Row label="Palette" hint={theme.name}>
            <div className="flex gap-2">
              {Object.entries(palettes).map(([key, pal]) => (
                <button
                  key={key}
                  type="button"
      data-pinchable
                  title={pal.name}
                  aria-label={pal.name}
                  onClick={() => updateViewSettings({ palette: key })}
                  className="h-7 w-7 rounded-full p-0"
                  style={{
                    background: `conic-gradient(${pal.sthayi.mandra} 0 33%, ${pal.accent} 0 66%, ${pal.sthayi.tara} 0)`,
                    border: `2px solid ${viewSettings.palette === key ? theme.ink : pal.bg}`,
                    outline: `1px solid ${theme.lineSoft}`,
                  }}
                />
              ))}
            </div>
          </Row>

          <Row label="Camera">
            <Toggle checked={cameraVisible} onChange={v => updateViewSettings({ cameraVisible: v })} />
          </Row>

          <Row label="Position">
            <div className="grid grid-cols-3 gap-1">
              {POSITION_GRID.flat().map((position, i) =>
                position ? (
                  <Chip
                    key={position}
                    title={position}
                    active={cameraPosition === position}
                    disabled={!cameraVisible}
                    onClick={() => updateViewSettings({ cameraPosition: position })}
                  >
                    {position === "fullscreen" ? "Full" : "■"}
                  </Chip>
                ) : <span key={i} />
              )}
            </div>
          </Row>

          <Row label="Size" hint={cameraPosition === "fullscreen" ? "fullscreen" : null}>
            <div className="grid grid-cols-3 gap-1">
              {SIZES.map(size => (
                <Chip
                  key={size}
                  active={cameraSize === size}
                  disabled={!cameraVisible || cameraPosition === "fullscreen"}
                  onClick={() => updateViewSettings({ cameraSize: size })}
                >
                  {size}
                </Chip>
              ))}
            </div>
          </Row>

          <Row label="Opacity" hint={`${Math.round(cameraOpacity * 100)}%`}>
            <input
              type="range"
              data-pinchable min="0.05" max="1" step="0.05"
              value={cameraOpacity}
              disabled={!cameraVisible}
              onChange={e => updateViewSettings({ cameraOpacity: Number(e.target.value) })}
              style={{ accentColor: theme.accent }}
            />
          </Row>

          <Row label="Blur" hint={`${cameraBlurPx}px`}>
            <input
              type="range"
              data-pinchable min="0" max="12" step="1"
              value={cameraBlurPx}
              disabled={!cameraVisible}
              onChange={e => updateViewSettings({ cameraBlurPx: Number(e.target.value) })}
              style={{ accentColor: theme.accent }}
            />
          </Row>

          <Row label="Finger trail" hint={!cameraVisible ? "required without camera" : null}>
            <Toggle
              checked={isTrailOn(viewSettings)}
              disabled={!cameraVisible}
              onChange={v => updateViewSettings({ trailEnabled: v })}
            />
          </Row>
        </div>
      )}

      <button
        type="button"
      data-pinchable
        aria-label="View settings"
        onClick={() => setOpen(o => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-full p-0 text-xl"
        style={{ background: theme.surface, color: theme.accent, border: `1px solid ${theme.line}` }}
      >
        <BsGear />
      </button>
    </div>
  );
}
