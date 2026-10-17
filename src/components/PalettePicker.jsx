import { useEffect, useRef, useState } from "react";
import { BsPalette, BsMoonStars, BsSun } from "react-icons/bs";
import theme, { palettes, PALETTE_GROUPS } from "../utils/theme";
import usePalette from "../hooks/usePalette";

const GROUP_ICONS = { dark: BsMoonStars, light: BsSun };

function Swatch({ pal, size = 18 }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${pal.sthayi.mandra} 0 33%, ${pal.accent} 0 66%, ${pal.sthayi.tara} 0)`,
        boxShadow: `0 0 0 2px ${pal.bg}, 0 0 0 3px ${theme.lineSoft}`,
      }}
    />
  );
}

// palettes listed under Dark / Light headings; buttons are pinchable so the playground panel works by hand
export function PaletteOptions({ onPick, columns = 1 }) {
  const [palette, setPalette] = usePalette();

  return (
    <div className="flex flex-col gap-3">
      {PALETTE_GROUPS.map(({ mode, label }) => {
        const Icon = GROUP_ICONS[mode];
        return (
          <div key={mode} className="grid gap-1" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider" style={{ color: theme.muted, gridColumn: "1 / -1" }}>
              <Icon /> {label}
            </span>
            {Object.entries(palettes).filter(([, pal]) => pal.mode === mode).map(([key, pal]) => {
              const active = key === palette;
              return (
                <button
                  key={key}
                  type="button"
                  data-pinchable
                  aria-pressed={active}
                  onClick={() => { setPalette(key); onPick?.(); }}
                  className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                  style={{
                    background: active ? theme.surfaceHover : "transparent",
                    color: theme.ink,
                    border: `1px solid ${active ? theme.line : "transparent"}`,
                  }}
                >
                  <Swatch pal={pal} />
                  <span className="truncate">{pal.name}</span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// a single palette button that expands into the grouped list (used on the regular pages)
export default function PaletteMenu() {
  const [palette] = usePalette();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label="Palette"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm"
        style={{ background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--line)" }}
      >
        <BsPalette style={{ color: "var(--accent)" }} />
        <Swatch pal={palettes[palette]} size={14} />
      </button>
      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-60 rounded-xl p-3 backdrop-blur-md"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <PaletteOptions onPick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
