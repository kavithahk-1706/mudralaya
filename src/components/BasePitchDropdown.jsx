export default function BasePitchDropdown({ 
  basePitchShift, 
  setBasePitchShift, 
  dropdownOpen, 
  setDropdownOpen, 
  dropdownRef, 
  optionsRef,
  hoveredOptionIndex,
  setHoveredOptionIndex 
}) {
  const pitchOptions = [
    { value: -6, label: "-6 semitones (F#3)" },
    { value: -5, label: "-5 semitones (G3)" },
    { value: -4, label: "-4 semitones (G#3)" },
    { value: -3, label: "-3 semitones (A3)"  },
    { value: -2, label: "-2 semitones (A#3)" },
    { value: -1, label: "-1 semitone (B3)" },
    { value: 0, label: "Default (C4)" },
    { value: 1, label: "+1 semitone (C#4)" },
    { value: 2, label: "+2 semitones (D4)" },
    { value: 3, label: "+3 semitones (D#4)" },
    { value: 4, label: "+4 semitones (E4)" },
    { value: 5, label: "+5 semitones (F4)" },
    { value: 6, label: "+6 semitones (F#4)" }

  ];

  const currentLabel = pitchOptions.find(opt => opt.value === basePitchShift)?.label || "Default (C)";

  return (
    <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
      <div
        ref={dropdownRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          padding: '10px',
          fontSize: '30px',
          color: '#333',
          background: `linear-gradient(45deg,hsla(185, 100%, 85%, 0.63), hsla(165, 75%, 50%, 0.82),hsla(200, 80%, 48%, 0.85),hsla(275, 65%, 52%, 0.74))`,
          borderRadius: '10px',
          cursor: 'pointer',
          minWidth: '300px'
        }}
      >
        {currentLabel}
      </div>

      {dropdownOpen && (
        <div
          ref={optionsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: '600px',
            overflowY: 'auto',
            backgroundColor: 'rgba(39, 38, 38, 0.7)',
            borderRadius: '10px',
            marginTop: '5px'
          }}
        >
          {pitchOptions.map((option, index) => (
            <div
              key={option.value}
              onClick={() => {
                setBasePitchShift(option.value);
                setDropdownOpen(false);
              }}
              style={{
                padding: '7px',
                fontSize: '20px',
                color: '#ccc',
                cursor: 'pointer',
                borderBottom: '1px solid #444',
                backgroundColor: hoveredOptionIndex === index ? '#686868a4' : 'transparent'
              }}
              onMouseEnter={() => setHoveredOptionIndex(index)}
              onMouseLeave={() => setHoveredOptionIndex(null)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}