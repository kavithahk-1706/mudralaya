import { drawText } from "./canvasHelpers";

export function handleSwaraInteraction({ ctx, swaraBoxes, x, y, ref, prevRef, playNote, recordSwara }) {
  let swara = null;
  let sthayi = null;
  let mode = null;
  let isReachable = true;

  for (const box of swaraBoxes) {
    if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height) {
      swara = box.swara;
      sthayi = box.sthayi;
      isReachable = box.isReachable;
      break;
    }
  }

  if (swara && !ref.current) {
    const status = isReachable ? "Hovered" : "Not Allowed";
    drawText(ctx, `${status}: ${swara} (${sthayi})`, 525, 200);
    mode = 'Hover';
  }

  // EDGE TRIGGER: only on transition from not-pinching to pinching
  if (swara && ref.current && !prevRef.current && isReachable) {
    console.log('ABOUT TO RECORD:', swara, sthayi);
    drawText(ctx, `Played: ${swara} (${sthayi})`, 525, 200);
    mode = 'Played';
    if (playNote) playNote(swara, sthayi);
    if (recordSwara){ 
      recordSwara(swara, sthayi)
        if (recordSwara) {
        console.log('recordSwara is defined, calling it');

        }else{
          console.log('recordSwara is undefined!');
        }

    };
  }

  return { swara, sthayi, mode };
}