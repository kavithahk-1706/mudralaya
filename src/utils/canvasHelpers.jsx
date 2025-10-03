export function flipCoords(x, y, canvas) {
  return { x: canvas.width - x, y };
}

export function flipLandmark(landmark, canvas) {
  return {
    x: canvas.width - landmark.x * canvas.width,
    y: landmark.y * canvas.height,
 
  };
}

export function returnLandmark(landmark,canvas){
    return{
        x:landmark.x*canvas.width,
        y:landmark.y*canvas.height,
    }
}

export function drawText(ctx, text, x, y, options = {}) {
  const {
    font = "24px Arial",
    fillStyle = "#000",
    textAlign = "start",
    textBaseline = "alphabetic"
  } = options;

  ctx.save(); // Save flipped state
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to normal orientation
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.fillText(text, x, y);
  ctx.restore(); // Restore flipped state
}


export function toSubscript(num){
  const subscripts = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
  return num.split('').map(d => subscripts[parseInt(d)]).join('');
};


