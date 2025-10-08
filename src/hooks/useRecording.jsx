import { useState, useRef, useEffect } from 'react';
import { ref, push, set } from 'firebase/database';
import { db, auth } from '../firebase';

export default function useRecording() {
  const [duration, setDuration] = useState(0);
  const isRecordingRef = useRef(false); // use ref instead
  const [isRecordingState, setIsRecordingState] = useState(false); // keep state for UI
  const recordingData = useRef([]);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = () => {

    isRecordingRef.current = true;
    setIsRecordingState(true);
    recordingData.current = [];
    startTimeRef.current = Date.now();
    setDuration(0);
    
    timerRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  const recordSwara = (swara, sthayi) => {
    if (!isRecordingRef.current) return;
    
    recordingData.current.push({ 
      swara, 
      sthayi, 
      timestamp: Date.now() - startTimeRef.current
    });
  };

  const stopRecording = async (ragaName, selectedInstrument, basePitchShift) => {
    isRecordingRef.current = false;
    setIsRecordingState(false);
    clearInterval(timerRef.current);
    
    if (!auth.currentUser) {
      alert('login to save recordings');
      return;
    }

    if (recordingData.current.length === 0) {
      return;
    }

    const recordingsRef = ref(db, `recordings/${auth.currentUser.uid}`);
    const newRecording = push(recordingsRef);
    
    await set(newRecording, {
      raga: ragaName,
      selectedInstrument:selectedInstrument, 
      basePitchShift:basePitchShift,
      notes: recordingData.current,
      timestamp: Date.now()
    });

    setDuration(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { isRecording: isRecordingState, duration, startRecording, recordSwara, stopRecording };

}