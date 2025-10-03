import React, { useEffect, useRef, useState } from "react";
import useHandTracking from "../hooks/useHandTracking";
import RagaDropdown from "./RagaDropDown";
import ragaData from "../raga_details.json";




export default function HandTracking() {
  const [selectedRaga, setSelectedRaga] = useState(ragaData[0].name);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const vidRef = useRef(null);
  const canvasRef = useRef(null);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);
  const selectedRagaRef = useRef(ragaData[0].name);
  const dropdownOpenRef = useRef(dropdownOpen);
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState(null);
  const hoveredOptionIndexRef = useRef(null);




  useEffect(() => {
    selectedRagaRef.current = selectedRaga;
  }, [selectedRaga]);

  useEffect(() => {
    dropdownOpenRef.current = dropdownOpen;
  }, [dropdownOpen]);

  useHandTracking({
    selectedRagaRef,
    dropdownOpenRef,
    setDropdownOpen,
    setSelectedRaga,
    vidRef,
    canvasRef,
    dropdownRef,
    optionsRef,
    hoveredOptionIndexRef,      
    setHoveredOptionIndex 
  });

  

  return (
    <div style={{ position: 'relative' }}>
      <video ref={vidRef} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', border: '2px solid black' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', border: '1px solid black' }} />
      <RagaDropdown
        selectedRaga={selectedRaga}
        setSelectedRaga={setSelectedRaga}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        dropdownRef={dropdownRef}
        optionsRef={optionsRef}
        hoveredOptionIndex={hoveredOptionIndex}        // add this
        setHoveredOptionIndex={setHoveredOptionIndex}
      />
    </div>
  )
}