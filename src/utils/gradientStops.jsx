export default function generateMistyGradientStops(brightnessMultiplier = 1.0) {
  const adjustColor = (hslaString, multiplier) => {
    const match = hslaString.match(/hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([\d.]+)\)/);
    if (!match) return hslaString;
    
    const [, h, s, l, a] = match;
    
    let satBoost = 0;
    let lightBoost = 0;
    
    if (multiplier === 3) { // hover
      satBoost = 20;
      lightBoost = 15;
    } else if (multiplier === 5) { // active/played
      satBoost = 30;
      lightBoost = 25;
    }
    
    const newS = Math.min(100, parseInt(s) + satBoost);
    const newL = Math.min(95, parseInt(l) + lightBoost);
    
    return `hsla(${h}, ${newS}%, ${newL}%, ${a})`;
  };

  // peacock vibes - teal to emerald to deep blue with purple hints
  const gradientStops = [
    {
      offset: "0%",
      color: adjustColor("hsla(271, 65%, 52%, 0.88)", brightnessMultiplier), // deep teal
      opacity: 1
    },
    {
      offset: "30%",
      color: adjustColor("hsla(200, 80%, 48%, 0.93)", brightnessMultiplier), // emerald-teal
      opacity: 1
    },
    {
      offset: "65%",
      color: adjustColor("hsla(165, 75%, 50%, 0.95)", brightnessMultiplier), // peacock blue
      opacity: 1
    },
    {
      offset: "100%",
      color: adjustColor("hsla(176, 74%, 71%, 0.92)", brightnessMultiplier), // blue with purple undertone
      opacity: 1
    }
  ];

  return gradientStops;
};

/*
hsla(275, 65%, 52%, 0.88)

hsla(165, 75%, 50%, 0.95)
hsla(176, 74%, 71%, 0.92)


*/ 

