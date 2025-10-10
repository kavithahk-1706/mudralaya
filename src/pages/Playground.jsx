import { useEffect, useRef, useState } from "react";
import useHandTracking from "../hooks/useHandTracking";
import RagaDropdown from "../components/RagaDropDown";
import ragaData from "../raga_details.json";
import useTonePlayer from "../hooks/useTonePlayer";
import InstrumentDropdown from "../components/InstrumentDropDown";
import BasePitchDropdown from "../components/BasePitchDropdown";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


import useRecording from "../hooks/useRecording";
import RecordButton from "../components/RecordButton";

export default function Playground({
  user,
  selectedInstrument, 
  setSelectedInstrument,
  basePitchShift,
  setBasePitchShift
}) {


  const navigate=useNavigate();
  const homeButtonRef = useRef(null);
  const recordingsButtonRef = useRef(null);
  const recordButtonRef=useRef(null);

  const [selectedRaga, setSelectedRaga] = useState(ragaData[0].name);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  
  const { isRecording, duration, startRecording, recordSwara, stopRecording } = useRecording();
    const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playNote = useTonePlayer(selectedInstrument, basePitchShift);

  const [instrumentDropdownOpen, setInstrumentDropdownOpen] = useState(false);
  const [pitchDropdownOpen, setPitchDropdownOpen] = useState(false);

  const lastPlayedSwaraRef = useRef(null); 
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
  const isRecordingRef = useRef(isRecording);


  const [ragaHoveredIndex, setRagaHoveredIndex] = useState(null);
  const [instrumentHoveredIndex, setInstrumentHoveredIndex] = useState(null);
  const [pitchHoveredIndex, setPitchHoveredIndex] = useState(null);
  const [homeButtonHoveredIndex, setHomeButtonHoveredIndex]=useState(null);
  const [recordingsPageButtonHoveredIndex, setRecordingsPageButtonHoveredIndex]=useState(null);
  const [recordButtonHoveredIndex, setRecordButtonHoveredIndex]=useState(null);


  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  //handle dropdowns
  const handleAllDropdownInteractions = (screenX, screenY, isPinching, wasPinching) => {
    const canvas = canvasRef.current;



    if (!canvas) return;
    



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
      
        if (hoveredIndexRef.current !== null) {
          hoveredIndexRef.current = null;
          setHovered(null);
        }
      }

      

    
      if (isPinching && !wasPinching && dropdownRect && !isOpen &&
          screenX >= dropdownRect.left && screenX <= dropdownRect.right &&
          screenY >= dropdownRect.top && screenY <= dropdownRect.bottom) {
        setOpen(true);
      }
    };

    const checkButton = (buttonRef, onClick, hoveredIndex, setHoveredIndex) => {
        const buttonRect=buttonRef.current?.getBoundingClientRect();
        

        if(buttonRect && screenX>=buttonRect.left && screenX<=buttonRect.right && 
          screenY>=buttonRect.top && screenY<=buttonRect.bottom) {
            setHoveredIndex(hoveredIndex);
            if(isPinching && !wasPinching){
              console.log("button", buttonRect);
              onClick();
            }
          }
      }

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
      ["Veena","Sitar", "Flute", "Violin"],
      setInstrumentHoveredIndex,
      (instrument) => {
        setSelectedInstrument(instrument);   
        
      },
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

    checkButton(homeButtonRef, ()=>{if(isPinching && !wasPinching) navigate('/')}, homeButtonHoveredIndex, setHomeButtonHoveredIndex);
    checkButton(recordingsButtonRef, ()=>{if(isPinching && !wasPinching) navigate('/recordings')}, recordingsPageButtonHoveredIndex, setRecordingsPageButtonHoveredIndex);
      
    const homeRect = homeButtonRef.current?.getBoundingClientRect();
    const recordingsRect = recordingsButtonRef.current?.getBoundingClientRect();
    if (homeRect && recordingsRect) {
      console.log(
        "Home button top/bottom:", homeRect.top, homeRect.bottom,
        "Recordings button top/bottom:", recordingsRect.top, recordingsRect.bottom
      );
}
    checkButton(
      recordButtonRef, 
      () => {
        if(isPinching && !wasPinching){
        if(isRecordingRef.current) {
          stopRecording(selectedRaga, selectedInstrument, basePitchShift);
        } else {
          startRecording();
        }
      }
    },
      recordButtonHoveredIndex, 
      setRecordButtonHoveredIndex
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
    recordSwara,
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

      <div className="flex">

      <Link to="/">
      <button ref={homeButtonRef} style={{
          position: 'absolute',
          top:575,
          left: 25,
          padding: '8px',
          fontSize: '25px',
          color: '#ffffffff',
          background: `linear-gradient(45deg, hsla(271, 65%, 52%, 0.88), hsla(165, 75%, 50%, 0.9))`,
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

      <Link to="/recordings">
        <button ref={recordingsButtonRef} style={{
          position: 'absolute',
          top: 575,
          left: 650,
          padding: '8px',
          fontSize: '25px',
          color: '#ffffffff',
          background: `linear-gradient(45deg, hsla(271, 65%, 52%, 0.88), hsla(165, 75%, 50%, 0.9))`,
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          minWidth: '250px'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          View Recordings
        </button>
      </Link>      

  
      <div onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
         <RecordButton 
              isRecording={isRecording}
              onStartRecording={() => startRecording()}
              onStopRecording={() => stopRecording(selectedRaga, selectedInstrument, basePitchShift)}
              ref={recordButtonRef}
          
          />
        {isRecording && (
          <div style={{
            position: 'fixed', // changed from absolute
            bottom: 75,
            right: 375,
            color: 'white',
            fontSize: '24px',
            fontWeight: '600',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            zIndex: 1000 // make sure it's on top
          }}>
            {formatDuration(duration)}
          </div>
        )}   


        </div>
    
      </div>
   
      

    
    </div>
  )
}