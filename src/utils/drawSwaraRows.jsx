import { drawText, toSubscript } from "./canvasHelpers";
import generateMistyGradientStops from "./gradientStops";

export function drawSwaraRows(raga) {
  if (!raga) return null;

  const swaraOrder = ["S", "R1", "R2", "G2", "G3", "M1", "M2", "P", "D1", "D2", "N2", "N3"];
  const ragaSwarasSet = new Set([...(raga.arohana || []), ...(raga.avarohana || [])]);

  const madhyaSwaras = swaraOrder.filter(sw => ragaSwarasSet.has(sw));
  const nTara = Math.ceil((raga.arohana || []).length / 2) + 1;
  const taraSwaras = (raga.arohana || []).slice(0, nTara);
  const nMandra = Math.ceil((raga.avarohana || []).length / 2) + 1;
  const mandraSwaras = (raga.avarohana || []).slice(1, nMandra);

  return function(ctx, baseX, baseY, activeInteraction) {
    if (!ctx) return [];

    const boxes = [];

    const createAndApplyGradient = (ctx, x, y, circleSize, brightnessMultiplier) => {
      const gradient = ctx.createLinearGradient(x - circleSize, y, x + circleSize, y);
      const gradientStops = generateMistyGradientStops(brightnessMultiplier);
      gradientStops.forEach(stop => {
        const offset = parseFloat(stop.offset) / 100;
        gradient.addColorStop(offset, stop.color);
      });
      return gradient;
    };

    const drawSwara = (sw, sthayi, x, y, circleSize = 38) => {
      // check if this specific swara is the active one
      const isActive = activeInteraction?.swara === sw && activeInteraction?.sthayi === sthayi;
      const brightnessMultiplier = isActive ? (activeInteraction.mode === "Played" ? 5 : 3) : 1.0;
     
      ctx.beginPath();
      ctx.arc(x, y, circleSize, 0, 2 * Math.PI);
      ctx.fillStyle = createAndApplyGradient(ctx, x, y, circleSize, brightnessMultiplier); // pass it here
      ctx.strokeStyle = "#caedfaff";
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      const letter = sw.match(/[A-Z]+/)?.[0] || sw;
      const number = sw.match(/\d+/)?.[0] || "";
      const displayText = letter + (number ? toSubscript(number) : "");
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      drawText(ctx, displayText, ((number === "") ? x - 7 : x - 10), y + 6);

      boxes.push({
        swara: sw,
        sthayi: sthayi,
        x: x - circleSize,
        y: y - circleSize,
        width: circleSize * 2,
        height: circleSize * 2
      });
    };

    const swaraSpacing = 85;
    const rowSpacing = 80;

    // Draw madhya row
    madhyaSwaras.forEach((sw, i) => {
      const x = baseX + (i * swaraSpacing);
      const sthayi="Madhya Sthayi";
      drawSwara(sw, sthayi, x, baseY);
    });

    // Draw tara row
    const secondLastIndex = madhyaSwaras.length - 2;
    const lastIndex = madhyaSwaras.length - 1;
    if (secondLastIndex >= 0 && lastIndex >= 0) {
      const secondLastX = baseX + (secondLastIndex * swaraSpacing);
      const lastX = baseX + (lastIndex * swaraSpacing);
      const taraStartX = (secondLastX + lastX) / 2;
      const taraY = baseY - rowSpacing;
      taraSwaras.forEach((sw, i) => {
        const x = taraStartX + (i * swaraSpacing);
        const sthayi="Tara Sthayi"
        drawSwara(sw, sthayi, x, taraY, 35);
      });
    }

    // Draw mandra row
    if (madhyaSwaras.length >= 2) {
      const firstX = baseX;
      const secondX = baseX + swaraSpacing;
      const mandraStartX = (firstX + secondX) / 2;
      const mandraY = baseY + rowSpacing;
      mandraSwaras.forEach((sw, i) => {
        const x = mandraStartX - (i * swaraSpacing);
        const sthayi="Mandra Sthayi"
        drawSwara(sw,sthayi, x, mandraY, 35);
      });
    }
   
    return boxes;
  };
}