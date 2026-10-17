// thumb tip (4) to index tip (8) distance, in normalized image units
export function getPinchDistance(landmarks){
    if(!landmarks || landmarks.length < 21) return Infinity;

    const thumbTip=landmarks[4];
    const indexTip=landmarks[8];

    const dx=thumbTip.x-indexTip.x;
    const dy=thumbTip.y-indexTip.y;

    return Math.sqrt(dx*dx+dy*dy);
}

// swaras: closer than PRESS starts a pinch; it holds until the fingers open past RELEASE,
// so detection noise around one threshold can't flicker it on and off
const PINCH_PRESS = 0.060;
const PINCH_RELEASE = 0.075;

// buttons/dropdowns need a firmer pinch, and only release once fingers clearly open,
// so moving a hand across them doesn't flicker into accidental clicks
const UI_PINCH_PRESS = 0.035;
const UI_PINCH_RELEASE = 0.070;

export default function getPinch(landmarks, wasPinching){
    return getPinchDistance(landmarks) < (wasPinching ? PINCH_RELEASE : PINCH_PRESS);
}

export function getUiPinch(landmarks, wasPinching){
    const distance = getPinchDistance(landmarks);
    return wasPinching ? distance < UI_PINCH_RELEASE : distance < UI_PINCH_PRESS;
}
