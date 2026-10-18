import { useEffect, useRef, useState } from "react";
import { BsCompass, BsX } from "react-icons/bs";
import theme, { rgba } from "../utils/theme";
import { buildChakra, swaraLabel } from "../utils/drawSwaraChakra";
import usePalette from "../hooks/usePalette";

const SWARA_POS = { S: 0, R1: 1, R2: 2, G2: 3, G3: 4, M1: 5, M2: 6, P: 7, D1: 8, D2: 9, N2: 10, N3: 11 };
const MINI = 240;

// order each sthayi is travelled in, going up (madhya, tara) or down (mandra) in pitch
function inTravelOrder(regions, sthayi) {
  const list = regions.filter(r => r.sthayi === sthayi);
  return sthayi === "mandra"
    ? list.sort((a, b) => SWARA_POS[b.swara] - SWARA_POS[a.swara])
    : list.sort((a, b) => SWARA_POS[a.swara] - SWARA_POS[b.swara]);
}

// on screen, madhya and alongside-mandra move anticlockwise; tara and opposite-mandra move clockwise
const travelsAnticlockwise = (sthayi, mandraLayout) =>
  sthayi === "madhya" || (sthayi === "mandra" && mandraLayout === "alongside");

// rough screen position of an angle on the wheel (canvas angles: 0 = right, 90° = bottom)
function whereOnWheel(angle) {
  const deg = ((angle * 180) / Math.PI + 360 + 22.5) % 360;
  return ["right", "lower right", "bottom", "lower left", "left", "upper left", "top", "upper right"][Math.floor(deg / 45)];
}

// a small live copy of the chakra with arrows along each ring
function MiniChakra({ raga, layout, paletteKey }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !raga) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = MINI * dpr;
    canvas.height = MINI * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, MINI, MINI);

    const c = MINI / 2;
    const size = MINI * 0.95;
    const regions = buildChakra(raga, c, c, size, layout);

    // swara regions stay faint so the arrows read clearly on top of them
    regions.forEach(g => {
      const tint = theme.sthayi[g.sthayi];
      ctx.beginPath();
      ctx.arc(c, c, g.r1, g.angle - g.half, g.angle + g.half);
      ctx.arc(c, c, g.r0, g.angle + g.half, g.angle - g.half, true);
      ctx.closePath();
      ctx.fillStyle = rgba(tint, 0.08);
      ctx.fill();
      ctx.strokeStyle = rgba(tint, 0.25);
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    const at = (radius, angle) => [c + Math.cos(angle) * radius, c + Math.sin(angle) * radius];

    // glowing arrow along a ring, from the sthayi's first swara to its last; returns the arc's midpoint angle
    const arrow = (list, radius, anticlockwise, tint) => {
      const a0 = list[0].angle;
      const a1 = list[list.length - 1].angle;
      const sweep = (((anticlockwise ? a0 - a1 : a1 - a0) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const mid = a0 + (anticlockwise ? -1 : 1) * sweep / 2;

      ctx.save();
      ctx.strokeStyle = tint;
      ctx.fillStyle = tint;
      ctx.shadowColor = tint;
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(c, c, radius, a0, a1, anticlockwise);
      ctx.stroke();

      // arrowhead pointing along the direction of travel
      const tip = at(radius, a1);
      const heading = a1 + (anticlockwise ? -1 : 1) * Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(...tip);
      ctx.lineTo(tip[0] - Math.cos(heading - 0.45) * 10, tip[1] - Math.sin(heading - 0.45) * 10);
      ctx.lineTo(tip[0] - Math.cos(heading + 0.45) * 10, tip[1] - Math.sin(heading + 0.45) * 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      return mid;
    };

    // sthayi name in a small pill, so it stays legible over the rings
    const pill = (text, x, y, tint) => {
      ctx.save();
      ctx.font = `600 11px ${theme.font}`;
      const w = ctx.measureText(text).width + 10;
      ctx.beginPath();
      ctx.roundRect(x - w / 2, y - 8, w, 16, 8);
      ctx.fillStyle = theme.bg;
      ctx.fill();
      ctx.strokeStyle = tint;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = tint;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x, y + 0.5);
      ctx.restore();
    };

    const names = { tara: "Tara", madhya: "Madhya", mandra: "Mandra" };
    ["tara", "madhya", "mandra"].forEach(st => {
      const list = inTravelOrder(regions, st);
      if (list.length < 2) return;
      const tint = theme.sthayi[st];
      // hinge swaras span two rings, so use a plain ring swara for the arrow radius
      const ringSwara = list.find(g => g.swara !== "S") ?? list[0];
      const radius = (ringSwara.r0 + ringSwara.r1) / 2;
      const mid = arrow(list, radius, travelsAnticlockwise(st, layout.mandraLayout), tint);

      if (st === "mandra") {
        // the inner ring is too tight for a label, so it sits in the hub with a pointer to its arrow
        const [x, y] = at(radius - 4, mid);
        ctx.save();
        ctx.strokeStyle = tint;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
        pill(names[st], c, c, tint);
      } else {
        pill(names[st], ...at(radius, mid), tint);
      }
    });
  }, [raga, layout, paletteKey]);

  return <canvas ref={canvasRef} style={{ position: "static", width: MINI, height: MINI }} className="mx-auto block" />;
}

function describe(raga, layout) {
  const regions = buildChakra(raga, 0, 0, 100, layout);
  const ends = st => {
    const list = inTravelOrder(regions, st);
    const end = list[list.length - 1];
    return end ? `${swaraLabel(end.swara, st)} at the ${whereOnWheel(end.angle)}` : "";
  };
  const extent = layout.sthayiExtent === "partial" ? " (partial arc)" : " (full sthayi)";

  return {
    madhya: `Rises anticlockwise from S at the bottom, up the right side and over the top, to ${ends("madhya")}.`,
    tara: `Starts at Ṡ on the left and keeps rising, clockwise along the outer ring, to ${ends("tara")}${extent}.`,
    mandra: layout.mandraLayout === "alongside"
      ? `Falls from S anticlockwise along the inner ring, just inside madhya, to ${ends("mandra")}${extent}.`
      : `Falls from S clockwise along the inner ring, away from madhya, to ${ends("mandra")}${extent}.`,
  };
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider" style={{ color: theme.accent }}>{title}</span>
      {children}
    </div>
  );
}

// collapsible guide on the left: how the chakra is laid out for the current palette, raga and settings
export default function ChakraGuide({ raga, viewSettings }) {
  const [open, setOpen] = useState(false);
  const [paletteKey] = usePalette();
  const layout = { mandraLayout: viewSettings.mandraLayout, sthayiExtent: viewSettings.sthayiExtent };
  const text = raga ? describe(raga, layout) : null;

  const sthayiRows = [
    { st: "tara", name: "Tara", where: "outer ring", example: "Ṡ", mark: "dot above" },
    { st: "madhya", name: "Madhya", where: "middle ring", example: "S", mark: "no dot" },
    { st: "mandra", name: "Mandra", where: "inner ring", example: "Ṣ", mark: "dot below" },
  ];

  return (
    <div className="fixed left-5 top-1/2 z-50 flex -translate-y-1/2 items-center gap-3">
      <button
        type="button"
        data-pinchable
        aria-label="Chakra guide"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-full p-0 text-xl"
        style={{ background: theme.surface, color: theme.accent, border: `1px solid ${theme.line}` }}
      >
        <BsCompass />
      </button>

      {open && (
        <div
          className="flex w-80 flex-col gap-4 overflow-y-auto rounded-xl p-4 text-sm backdrop-blur-md"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.line}`,
            color: theme.ink,
            maxHeight: `calc(100vh - ${2 * theme.barHeight + 24}px)`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-base" style={{ color: theme.accent, fontFamily: theme.font }}>Guide</span>
            <button type="button" data-pinchable onClick={() => setOpen(false)} className="p-1" style={{ background: "none", color: theme.ink }}>
              <BsX />
            </button>
          </div>

          {raga && <MiniChakra raga={raga} layout={layout} paletteKey={paletteKey} />}
          <p className="-mt-2 text-center text-xs" style={{ color: rgba(theme.ink, 0.65) }}>
            {raga?.name} · {viewSettings.sthayiExtent === "partial" ? "partial arcs" : "full sthayis"} · mandra {viewSettings.mandraLayout} · {theme.name}
          </p>

          <Section title="Sthayis">
            {sthayiRows.map(({ st, name, where, example, mark }) => (
              <div key={st} className="flex items-center gap-2.5">
                <span className="h-4 w-4 shrink-0 rounded" style={{ background: rgba(theme.sthayi[st], 0.35), border: `1px solid ${theme.sthayi[st]}` }} />
                <span className="font-semibold" style={{ fontFamily: theme.font }}>{name}</span>
                <span style={{ color: rgba(theme.ink, 0.65) }}>{where} · {example} ({mark})</span>
              </div>
            ))}
          </Section>

          {text && (
            <Section title="Which way it moves">
              <p><strong>Madhya:</strong> {text.madhya}</p>
              <p><strong>Tara:</strong> {text.tara}</p>
              <p><strong>Mandra:</strong> {text.mandra}</p>
              <p style={{ color: rgba(theme.ink, 0.65) }}>S and Ṡ are the turning points: S spans the madhya and mandra rings, Ṡ spans madhya and tara.</p>
            </Section>
          )}

          <Section title="Playing">
            <p>Pinch thumb and index finger over a swara to play it. Keep pinching and slide to play the next one.</p>
            <p>
              Swaras glow when hovered and <span style={{ color: theme.flare }}>flare</span> when played.
              Greyed-out swaras aren't allowed next: after a note, going up must follow the arohana and going down the avarohana.
            </p>
            <p>The centre shows the swara you're on. Change the layout and palette from the gear button.</p>
          </Section>
        </div>
      )}
    </div>
  );
}
