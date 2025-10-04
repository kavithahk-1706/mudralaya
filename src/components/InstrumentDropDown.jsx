// InstrumentDropdown.jsx
export default function InstrumentDropdown({ 
  selectedInstrument, 
  setSelectedInstrument, 
  dropdownOpen, 
  setDropdownOpen, 
  dropdownRef, 
  optionsRef,
  hoveredOptionIndex,
  setHoveredOptionIndex 
}) {
  const instruments = ["Flute", "Sitar","Violin"]; // add more as you get samples

  return (
    <div style={{ position: 'absolute', top:20, left: 600, zIndex: 10 }}>
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
        {selectedInstrument}
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
          {instruments.map((instrument, index) => (
            <div
              key={instrument}
              onClick={() => {
                setSelectedInstrument(instrument);
                setDropdownOpen(false);
              }}
              style={{
                padding: '10px',
                fontSize: '25px',
                color: '#ccc',
                cursor: 'pointer',
                borderBottom: '1px solid #444',
                backgroundColor: hoveredOptionIndex === index ? '#686868a4' : 'transparent' // use state instead
              }}
              onMouseEnter={() => setHoveredOptionIndex(index)} // keep mouse support
              onMouseLeave={() => setHoveredOptionIndex(null)}
            >
              {instrument}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}