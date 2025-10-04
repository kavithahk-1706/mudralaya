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
  const instruments = ["Sitar","Flute","Violin"]; // add more as you get samples

  return (
    <div style={{ position: 'absolute', top:20, left: 625, zIndex: 10 }}>
      <div
        ref={dropdownRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          padding: '10px',
          fontSize: '30px',
          color: '#fff',
          textAlign:'center',
          background: `linear-gradient(45deg, hsla(275, 65%, 52%, 0.9), hsla(165, 75%, 50%, 0.9))`,
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