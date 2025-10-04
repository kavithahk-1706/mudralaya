import { drawText } from "./canvasHelpers";

export function handleSwaraInteraction({ ctx, swaraBoxes, x, y, ref,playNote }) {
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
    drawText(ctx, `Hovered: ${swara} (${sthayi})`, 950, 600);
    mode = 'Hover';
  }

  if (swara && ref.current) {

    drawText(ctx, `Played: ${swara} (${sthayi})`, 950, 600);
    mode = 'Played';
    if(playNote){ playNote(swara,sthayi)
          console.log('TRIGGERING PLAYNOTE for',swara,sthayi);

    };

  }

  

  return {swara, sthayi, mode};
}