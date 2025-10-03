export default function usePinch(landmarks){
    if(!landmarks||landmarks<21) return false;

    const thumbTip=landmarks[4];
    const indexTip=landmarks[8];

    const dx=thumbTip.x-indexTip.x;
    const dy=thumbTip.y-indexTip.y;

    const distance=Math.sqrt(dx*dx+dy*dy);

    return [distance, distance < 0.065];
}