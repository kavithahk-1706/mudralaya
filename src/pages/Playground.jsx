import { useEffect, useRef, useState } from "react";
import useHandTracking from "../hooks/useHandTracking";
import RagaDropdown from "../components/RagaDropDown";
import ragaData from "../raga_details.json";
import useTonePlayer from "../hooks/useTonePlayer";
import InstrumentDropdown from "../components/InstrumentDropDown";
import BasePitchDropdown from "../components/BasePitchDropdown";
import { Link } from "react-router-dom";



export default function Playground({ isAuthenticated }) {

  const [isRecording, setIsRecording] = useState(false);

  const handleRecord = () => {
    if (!isAuthenticated) {
      // redirect to login
      window.location.href = '/login';
      return;
    }
    // start recording logic
    setIsRecording(true);
  };

  const [selectedRaga, setSelectedRaga] = useState(ragaData[0].name);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("Sitar");
  const [basePitchShift, setBasePitchShift] = useState(0);

  const playNote = useTonePlayer(selectedInstrument, basePitchShift);

  const [instrumentDropdownOpen, setInstrumentDropdownOpen] = useState(false);
  const [pitchDropdownOpen, setPitchDropdownOpen] = useState(false);

  const lastPlayedSwaraRef = useRef(null); // {swara, sthayi}
  const instrumentDropdownRef = useRef(null);
  const instrumentOptionsRef = useRef(null);
  const instrumentDropdownOpenRef=useRef(null);
  const pitchDropdownRef = useRef(null);
  const pitchOptionsRef = useRef(null);
  const pitchDropdownOpenRef=useRef(null);


  const vidRef = useRef(null);
  const canvasRef = useRef(null);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);
  const selectedRagaRef = useRef(ragaData[0].name);
  const dropdownOpenRef = useRef(dropdownOpen);
  const ragaHoveredIndexRef = useRef(null);
  const instrumentHoveredIndexRef = useRef(null);
  const pitchHoveredIndexRef = useRef(null);
  


  const [ragaHoveredIndex, setRagaHoveredIndex] = useState(null);
  const [instrumentHoveredIndex, setInstrumentHoveredIndex] = useState(null);
  const [pitchHoveredIndex, setPitchHoveredIndex] = useState(null);

  //handle dropdowns
  const handleAllDropdownInteractions = (x, y, isPinching, wasPinching) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvasRect.width / canvas.width;
    const scaleY = canvasRect.height / canvas.height;
    const screenX = x * scaleX + canvasRect.left;
    const screenY = y * scaleY + canvasRect.top;

    
  

    const checkDropdown = (dropdownRef, optionsRef, isOpen, setOpen, options, setHovered, onSelect, hoveredIndexRef) => {
      const dropdownRect = dropdownRef.current?.getBoundingClientRect();
      const optionsRect = optionsRef.current?.getBoundingClientRect();
      
      // check if hovering options (only when open)
      if (optionsRect &&
          screenX >= optionsRect.left && screenX <= optionsRect.right &&
          screenY >= optionsRect.top && screenY <= optionsRect.bottom) {
        
        const optionHeight = optionsRect.height / options.length;
        const hoveredIndex = Math.floor((screenY - optionsRect.top) / optionHeight);
                
        if (hoveredIndex >= 0 && hoveredIndex < options.length && hoveredIndex !== hoveredIndexRef.current) {
          hoveredIndexRef.current = hoveredIndex;
          setHovered(hoveredIndex);
        }

        // check pinch selection while hovering
        if (isPinching && !wasPinching) {
          onSelect(options[hoveredIndex]);
          setOpen(false);
          hoveredIndexRef.current = null;
          setHovered(null);
        }
      } else {
        // only reset if this dropdown actually had a hover state
        if (hoveredIndexRef.current !== null) {
          hoveredIndexRef.current = null;
          setHovered(null);
        }
      }

      // check if clicking dropdown header to open
      if (isPinching && !wasPinching && dropdownRect && !isOpen &&
          screenX >= dropdownRect.left && screenX <= dropdownRect.right &&
          screenY >= dropdownRect.top && screenY <= dropdownRect.bottom) {
        setOpen(true);
      }
    };

    // check all three dropdowns
    checkDropdown(
      dropdownRef, 
      optionsRef, 
      dropdownOpenRef.current, 
      setDropdownOpen, 
      ragaData.map(r => r.name),
      setRagaHoveredIndex,
      (ragaName) => setSelectedRaga(ragaName),
      ragaHoveredIndexRef
    );

    checkDropdown(
      instrumentDropdownRef,
      instrumentOptionsRef,
      instrumentDropdownOpenRef.current,
      setInstrumentDropdownOpen,
      ["Flute", "Sitar", "Violin"],
      setInstrumentHoveredIndex,
      (instrument) => setSelectedInstrument(instrument),
      instrumentHoveredIndexRef
    );

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

    checkDropdown(
      pitchDropdownRef,
      pitchOptionsRef,
      pitchDropdownOpenRef.current,
      setPitchDropdownOpen,
      pitchOptions,
      setPitchHoveredIndex,
      (option) => setBasePitchShift(option.value),
      pitchHoveredIndexRef
    );
  };


//useEffects
  useEffect(() => {
    selectedRagaRef.current = selectedRaga;
  }, [selectedRaga]);

  useEffect(() => {
    dropdownOpenRef.current = dropdownOpen;
  }, [dropdownOpen]);

  useHandTracking({
    selectedRagaRef,
    vidRef,
    canvasRef,
    playNote,
    handleAllDropdownInteractions 
  });

  
  return (
    <div style={{ position: 'relative' }}>
      <video ref={vidRef} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', border: '2px solid black' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', border: '1px solid black' }} />

      <InstrumentDropdown
        selectedInstrument={selectedInstrument}
        setSelectedInstrument={setSelectedInstrument}
        dropdownOpen={instrumentDropdownOpen}
        setDropdownOpen={setInstrumentDropdownOpen}
        dropdownRef={instrumentDropdownRef}
        optionsRef={instrumentOptionsRef}
        hoveredOptionIndex={instrumentHoveredIndex}     
        setHoveredOptionIndex={setInstrumentHoveredIndex}
      />

      <BasePitchDropdown
        basePitchShift={basePitchShift}
        setBasePitchShift={setBasePitchShift}
        dropdownOpen={pitchDropdownOpen}
        setDropdownOpen={setPitchDropdownOpen}
        dropdownRef={pitchDropdownRef}
        optionsRef={pitchOptionsRef}
        hoveredOptionIndex={pitchHoveredIndex}
        setHoveredOptionIndex={setPitchHoveredIndex}
    />

      <RagaDropdown
        selectedRaga={selectedRaga}
        setSelectedRaga={setSelectedRaga}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        dropdownRef={dropdownRef}
        optionsRef={optionsRef}
        hoveredOptionIndex={ragaHoveredIndex}     
        setHoveredOptionIndex={setRagaHoveredIndex}
      />

      <Link to="/">
      <button style={{
          position: 'absolute',
          top:600,
          left: 25,
          padding: '8px',
          fontSize: '25px',
          color: '#ffffffff',
          background: `linear-gradient(45deg, hsla(275, 65%, 52%, 0.9), hsla(165, 75%, 50%, 0.9))`,
          borderRadius: '10px',
          border:'none',
          cursor: 'pointer',
          minWidth: '250px'
        }}
          
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >

            Back to Home
            
        </button>
      </Link>

      <Link to="/login">
      <button style={{
          position: 'absolute',
          top:600,
          right: 25,
          padding: '8px',
          fontSize: '25px',
          color: '#ffffffff',
          border:'none',
          background: `linear-gradient(45deg,hsla(0, 97%, 12%, 0.82), hsla(0, 82%, 30%, 0.82),hsla(0, 80%, 48%, 0.85),hsla(0, 93%, 64%, 0.74))`,
          borderRadius: '10px',
          cursor: 'pointer',
          minWidth: '250px'
        }}
          
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >

                {isAuthenticated ? (isRecording ? 'Stop Recording' : 'Record Session') : 'Login to Record'}
            
        </button>
      </Link>
      

    
    </div>
  )
}