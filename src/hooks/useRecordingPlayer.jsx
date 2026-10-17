import { useCallback, useEffect, useRef, useState } from 'react';
import { useMultiInstrumentPlayer } from './useTonePlayer';

// let the last note ring before playback counts as finished
const TAIL_MS = 1500;
const TICK_MS = 100;

// older recordings stored one instrument/pitch for the whole take; newer ones store them per note
export function normalizeNotes(recording) {
  return (recording.notes || []).map(note => ({
    ...note,
    raga: note.raga ?? recording.raga,
    instrument: note.instrument ?? recording.selectedInstrument ?? 'Veena',
    pitch: note.pitch ?? recording.basePitchShift ?? 0,
  }));
}

export function recordingLength(recording) {
  const notes = recording.notes || [];
  const lastNote = notes.length ? Math.max(...notes.map(n => n.timestamp)) : 0;
  return Math.max(recording.duration ?? 0, lastNote + TAIL_MS);
}

// one recording plays at a time; position is in ms from the start of the take
export default function useRecordingPlayer() {
  const { prepare, playNote } = useMultiInstrumentPlayer();
  const [player, setPlayer] = useState({ id: null, status: 'stopped', position: 0 });

  const timersRef = useRef([]);
  const tickRef = useRef(null);
  const startedAtRef = useRef(0); // performance.now() at which position 0 would have been
  const activeRef = useRef(null); // { id, notes, length }
  const playerRef = useRef(player);
  playerRef.current = player;

  const clearSchedule = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    clearInterval(tickRef.current);
    tickRef.current = null;
  }, []);

  useEffect(() => clearSchedule, [clearSchedule]);

  const stop = useCallback(() => {
    clearSchedule();
    activeRef.current = null;
    setPlayer({ id: null, status: 'stopped', position: 0 });
  }, [clearSchedule]);

  const schedule = useCallback((from) => {
    const active = activeRef.current;
    clearSchedule();
    startedAtRef.current = performance.now() - from;

    active.notes.forEach(note => {
      const delay = note.timestamp - from;
      if (delay < 0) return;
      timersRef.current.push(setTimeout(() => playNote(note.swara, note.sthayi, note.pitch, note.instrument), delay));
    });

    tickRef.current = setInterval(() => {
      const position = performance.now() - startedAtRef.current;
      if (position >= active.length) {
        stop();
        return;
      }
      setPlayer(p => (p.id === active.id ? { ...p, position } : p));
    }, TICK_MS);
  }, [clearSchedule, playNote, stop]);

  const load = (recording) => {
    const notes = normalizeNotes(recording);
    activeRef.current = { id: recording.id, notes, length: recordingLength(recording) };
    return notes;
  };

  const play = useCallback(async (recording, from) => {
    const current = playerRef.current;
    const resumeAt = from ?? (current.id === recording.id ? current.position : 0);
    const notes = load(recording);
    clearSchedule();
    setPlayer({ id: recording.id, status: 'loading', position: resumeAt });

    await prepare([...new Set(notes.map(n => n.instrument))]);
    // another recording may have been started while samples loaded
    if (activeRef.current?.id !== recording.id) return;

    setPlayer({ id: recording.id, status: 'playing', position: resumeAt });
    schedule(resumeAt);
  }, [clearSchedule, prepare, schedule]);

  const pause = useCallback(() => {
    const position = performance.now() - startedAtRef.current;
    clearSchedule();
    setPlayer(p => ({ ...p, status: 'paused', position }));
  }, [clearSchedule]);

  const toggle = useCallback((recording) => {
    const current = playerRef.current;
    if (current.id === recording.id && current.status === 'playing') pause();
    else play(recording);
  }, [pause, play]);

  // jump to a position; keeps playing if it was playing
  const seek = useCallback((recording, position) => {
    const length = recordingLength(recording);
    const target = Math.min(Math.max(0, position), length - 1);
    const current = playerRef.current;

    if (current.id === recording.id && current.status === 'playing') {
      setPlayer(p => ({ ...p, position: target }));
      schedule(target);
    } else {
      load(recording);
      clearSchedule();
      setPlayer({ id: recording.id, status: 'paused', position: target });
    }
  }, [clearSchedule, schedule]);

  return { player, toggle, seek, stop };
}
