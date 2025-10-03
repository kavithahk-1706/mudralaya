import { drawText } from "./canvasHelpers";

export function handleSwaraInteraction({ ctx, swaraBoxes, x, y, ref }) {
  let swara = null;
  let sthayi = null;
  let mode = null;

  for (const box of swaraBoxes) {
    if (
      x >= box.x &&
      x <= box.x + box.width &&
      y >= box.y &&
      y <= box.y + box.height
    ) {
      swara = box.swara;
      sthayi = box.sthayi;
      break;
    }
  }

  if (swara && !ref.current) {
    drawText(ctx, `Hovered: ${swara} (${sthayi})`, 900, 150);
    mode = 'Hover';
  }

  if (swara && ref.current) {
    drawText(ctx, `Played: ${swara} (${sthayi})`, 900, 150);
    mode = 'Played';
  }

  console.log('after loop - swara:', swara, 'sthayi:', sthayi);
  console.log('mouse coords:', x, y);
  console.log('first box coords:', swaraBoxes[0]);
  console.log('ref.current:', ref.current);

  return {swara, sthayi, mode};
}