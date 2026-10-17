//imports
import { useEffect, useRef, useState } from "react";
import useHandTracking from "../hooks/useHandTracking";
import RagaDropdown from "../components/RagaDropDown";
import ragaData from "../raga_details.json";
import useTonePlayer from "../hooks/useTonePlayer";
import InstrumentDropdown from "../components/InstrumentDropDown";
import BasePitchDropdown from "../components/BasePitchDropdown";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import useRecording from "../hooks/useRecording";
import RecordButton from "../components/RecordButton";
import ViewSettings from "../components/ViewSettings";
import useViewSettings from "../hooks/useViewSettings";
import usePalette from "../hooks/usePalette";
import { ControlButton } from "../components/Controls";
import { BsHouseDoor, BsCollectionPlay } from "react-icons/bs";
import theme from "../utils/theme";

export default function Playground({
  user,
  selectedInstrument, 
  setSelectedInstrument,
  basePitchShift,
  setBasePitchShift
}) {

  //navigate hook
  const navigate=useNavigate();

  //toneplayer custom hook
  const playNote = useTonePlayer(selectedInstrument, basePitchShift);

  //states
  const [selectedRaga, setSelectedRaga] = useState(ragaData[0].name);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [instrumentDropdownOpen, setInstrumentDropdownOpen] = useState(false);
  const [pitchDropdownOpen, setPitchDropdownOpen] = useState(false);
  const [ragaHoveredIndex, setRagaHoveredIndex] = useState(null);
  const [instrumentHoveredIndex, setInstrumentHoveredIndex] = useState(null);
  const [pitchHoveredIndex, setPitchHoveredIndex] = useState(null);
  const [homeButtonHoveredIndex, setHomeButtonHoveredIndex]=useState(null);
  const [recordingsPageButtonHoveredIndex, setRecordingsPageButtonHoveredIndex]=useState(null);
  const [recordButtonHoveredIndex, setRecordButtonHoveredIndex]=useState(null);
  // read per note while recording, so mid-recording switches are kept
  const recordingContextRef = useRef({});
  recordingContextRef.current = { raga: selectedRaga, instrument: selectedInstrument, pitch: basePitchShift };
  const { isRecording, duration, startRecording, recordSwara, stopRecording } = useRecording(() => recordingContextRef.current);
  const [viewSettings, updateViewSettings] = useViewSettings();
  usePalette(); // re-render the themed controls when the palette changes

  //refs
  const homeButtonRef = useRef(null);
  const recordingsButtonRef = useRef(null);
  const recordButtonRef=useRef(null);
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
  const userRef = useRef(user);
  const viewSettingsRef = useRef(viewSettings);


  //function to format duration of recording
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  //user state/login handler
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('login failed:', error);
    }
  };

  //handle dropdowns and buttons through hand tracking
  const handleAllDropdownInteractions = (screenX, screenY, isPinching, wasPinching) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    //dropdowns check
    const checkDropdown = (dropdownRef, optionsRef, isOpen, setOpen, options, setHovered, onSelect, hoveredIndexRef) => {
      const dropdownRect = dropdownRef.current?.getBoundingClientRect();
      const optionsRect = optionsRef.current?.getBoundingClientRect();
      
      // check if hovering options (only when open)
      if (optionsRect &&
          screenX >= optionsRect.left && screenX <= optionsRect.right &&
          screenY >= optionsRect.top && screenY <= optionsRect.bottom) {
        
        // options are laid out row by row in a grid of data-columns columns
        const columns = Number(optionsRef.current.dataset.columns || 1);
        const rows = Math.ceil(options.length / columns);
        const row = Math.floor((screenY - optionsRect.top) / (optionsRect.height / rows));
        const col = Math.floor((screenX - optionsRect.left) / (optionsRect.width / columns));
        const hoveredIndex = row * columns + col;
                
        if (hoveredIndex >= 0 && hoveredIndex < options.length && hoveredIndex !== hoveredIndexRef.current) {
          hoveredIndexRef.current = hoveredIndex;
          setHovered(hoveredIndex);
        }

        // check pinch selection while hovering
        if (isPinching && !wasPinching && hoveredIndex >= 0 && hoveredIndex < options.length) {
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

    //buttons check
    const checkButton = (buttonRef, onClick, hoveredIndex, setHoveredIndex) => {
        const buttonRect=buttonRef.current?.getBoundingClientRect();
        if(buttonRect && screenX>=buttonRect.left && screenX<=buttonRect.right && 
          screenY>=buttonRect.top && screenY<=buttonRect.bottom) {
            setHoveredIndex(hoveredIndex);
            if(isPinching && !wasPinching){
              onClick();
            }
          }
      }

    //call the dropdown checks for handtracking

    //raga
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

    //instrument
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

    //pitch options for pitch dropdown
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

  //pitch
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

    //check buttons for handtracking

    //back to home button
    checkButton(
      homeButtonRef, 
      ()=>{if(isPinching && !wasPinching) navigate('/')}, 
      homeButtonHoveredIndex, setHomeButtonHoveredIndex
    );

    //view recordings page button
    checkButton(
      recordingsButtonRef, 
      ()=>{if(isPinching && !wasPinching) navigate('/recordings')}, 
      recordingsPageButtonHoveredIndex, 
      setRecordingsPageButtonHoveredIndex
    );

    //start recording button (checks user state and triggers login if not logged in)
    checkButton(
      recordButtonRef, 
      () => {
          if (!userRef.current) {
            handleLogin();  
            return;
          }
          if (isRecordingRef.current) {
            stopRecording();
          } else {
            startRecording();
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

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    viewSettingsRef.current = viewSettings;
  }, [viewSettings]);

  //call the main hand tracking hook/
  useHandTracking({
    selectedRagaRef,
    viewSettingsRef,
    vidRef,
    canvasRef,
    playNote,
    recordSwara,
    handleAllDropdownInteractions 
  });



  
  return (
    <div style={{ position: 'relative' }}>
      {/* mediapipe reads frames from the video; the user only ever sees the canvas */}
      <video ref={vidRef} playsInline muted style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }} />
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }} />

      <ViewSettings viewSettings={viewSettings} updateViewSettings={updateViewSettings} />

      {/* controls float in two slim bars that fade into the canvas instead of boxing it in */}
      <div
        className="fixed inset-x-0 top-0 z-40 flex items-center gap-3 px-4"
        style={{ height: theme.barHeight, background: `linear-gradient(to bottom, ${theme.bg}, transparent)` }}
      >
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

        <div className="ml-auto flex items-center gap-3">
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
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 px-4"
        style={{ height: theme.barHeight, background: `linear-gradient(to top, ${theme.bg}, transparent)` }}
      >
        <Link to="/">
          <ControlButton ref={homeButtonRef}>
            <BsHouseDoor style={{ color: theme.accent }} />
            Home
          </ControlButton>
        </Link>

        <Link to="/recordings">
          <ControlButton ref={recordingsButtonRef}>
            <BsCollectionPlay style={{ color: theme.accent }} />
            Recordings
          </ControlButton>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {isRecording && (
            <span className="text-sm tabular-nums" style={{ color: theme.vermilion }}>
              ● {formatDuration(duration)}
            </span>
          )}
          <RecordButton
            isRecording={isRecording}
            onLogin={handleLogin}
            user={user}
            onStartRecording={() => startRecording()}
            onStopRecording={() => stopRecording()}
            ref={recordButtonRef}
          />
        </div>
      </div>
    </div>
  )
}
