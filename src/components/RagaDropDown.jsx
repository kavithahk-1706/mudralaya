import ragaData from '../raga_details.json';
export default function RagaDropdown({ 
  selectedRaga, 
  setSelectedRaga, 
  dropdownOpen, 
  setDropdownOpen, 
  dropdownRef, 
  optionsRef,
  hoveredOptionIndex,
  setHoveredOptionIndex 
}) {
  return (
    <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
      <div
        value="Select Raga"
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
        {selectedRaga}
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
          {ragaData.map((r, index) => (
            <div
              key={r.name}
              onClick={() => {
                setSelectedRaga(r.name);
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
              {r.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}