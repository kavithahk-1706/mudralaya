// pinch support for any control marked data-pinchable: a pinch over it clicks it,
// and a pinch held on a range slider drags it

// sets a React-controlled input's value so its onChange fires
function setInputValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  setter.call(input, String(value));
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function dragSlider(input, screenX) {
  const rect = input.getBoundingClientRect();
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const step = Number(input.step || 1);
  const t = Math.min(1, Math.max(0, (screenX - rect.left) / rect.width));
  const value = Math.round((min + t * (max - min)) / step) * step;
  if (Number(input.value) !== value) setInputValue(input, Number(value.toFixed(4)));
}

// hand: per-hand state object (keeps the slider being dragged)
export function handlePinchControls(hand, screenX, screenY, isPinching, wasPinching) {
  if (!isPinching) {
    hand.pinchTarget = null;
    return;
  }

  if (!wasPinching) {
    const el = document.elementFromPoint(screenX, screenY)?.closest("[data-pinchable]");
    if (!el || el.disabled) return;
    if (el.matches('input[type="range"]')) hand.pinchTarget = el;
    else el.click();
  }

  if (hand.pinchTarget) dragSlider(hand.pinchTarget, screenX);
}
