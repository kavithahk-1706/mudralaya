const swaraPositions = {
  "S": 0, "R1": 1, "R2": 2, "G2": 3, "G3": 4,
  "M1": 5, "M2": 6, "P": 7, "D1": 8, "D2": 9,
  "N2": 10, "N3": 11
};

export const getAbsolutePosition = (swara, sthayi) => {
  const octaveOffset = {
    "mandra": -12,
    "madhya": 0,
    "tara": 12
  };
  
  return swaraPositions[swara] + (octaveOffset[sthayi] || 0);
};

export const isSwaraReachable = (currentSwara, currentSthayi, targetSwara, targetSthayi, raga) => {
  // first swara - can start anywhere in the raga
  if (!currentSwara) {
    return true;
  }
  
  const currentPos = getAbsolutePosition(currentSwara, currentSthayi);
  const targetPos = getAbsolutePosition(targetSwara, targetSthayi);
  
  if (currentPos === targetPos) return true; // same note
  
  if (targetPos > currentPos) {
    // ascending - must be in arohana
    return raga.arohana.includes(targetSwara);
  } else {
    // descending - must be in avarohana
    return raga.avarohana.includes(targetSwara);
  }
};