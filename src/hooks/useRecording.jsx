import { useState, useRef, useEffect } from 'react';
import { ref, push, set } from 'firebase/database';
import { db, auth } from '../firebase';

// distinct values in the order they first appeared
const uniqueInOrder = values => values.filter((v, i) => values.indexOf(v) === i);

// display name for a recording: the raga, or the ragas it moved through
export function describeRagas(ragas) {
  if (ragas.length <= 1) return ragas[0] ?? 'Untitled';
  if (ragas.length <= 3) return ragas.join(' → ');
  return `Mixed ragas (${ragas.length})`;
}

// getContext() returns the raga, instrument and pitch in use right now; it is read for
// every note, so switching any of them mid-recording is captured note by note
export default function useRecording(getContext) {
  const [duration, setDuration] = useState(0);
  const isRecordingRef = useRef(false);
  const [isRecordingState, setIsRecordingState] = useState(false);
  const recordingData = useRef([]);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const getContextRef = useRef(getContext);
  getContextRef.current = getContext;

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

    const { raga, instrument, pitch } = getContextRef.current();
    recordingData.current.push({
      swara,
      sthayi,
      raga,
      instrument,
      pitch,
      timestamp: Date.now() - startTimeRef.current
    });
  };

  const stopRecording = async () => {
    isRecordingRef.current = false;
    setIsRecordingState(false);
    clearInterval(timerRef.current);
    const totalMs = Date.now() - startTimeRef.current;

    if (!auth.currentUser) {
      alert('login to save recordings');
      return;
    }

    const notes = recordingData.current;
    if (notes.length === 0) {
      return;
    }

    const ragas = uniqueInOrder(notes.map(n => n.raga));
    const instruments = uniqueInOrder(notes.map(n => n.instrument));
    const pitches = uniqueInOrder(notes.map(n => n.pitch));

    const recordingsRef = ref(db, `recordings/${auth.currentUser.uid}`);
    const newRecording = push(recordingsRef);

    await set(newRecording, {
      // display name (renamable)
      raga: describeRagas(ragas),
      ragas,
      instruments,
      pitches,
      // kept for older readers: the first values used
      selectedInstrument: instruments[0],
      basePitchShift: pitches[0],
      duration: totalMs,
      notes,
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
