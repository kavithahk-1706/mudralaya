import { useRef, useEffect, useCallback } from "react";
import * as Tone from "tone";

export default function useTonePlayer(selectedInstrument="Flute", basePitchShift = 0) {
    const samplerRef = useRef(null);
    const reverbRef = useRef(null);
    const delayRef = useRef(null);
    const toneStartedRef = useRef(false);
    const samplerLoadedRef = useRef(false);
    const prevInstrumentRef = useRef(null);

    const instrumentSamples = {
      Sitar: { "C4": "/assets/Sitar_1_C.wav" },
      Flute: {"C4": "/assets/Flute_1_C.mp3" },
      Violin: {"G4":"/assets/Violin_1_G.wav"}
    };
   

    useEffect(() => {
      // only recreate if instrument actually changed
      if (prevInstrumentRef.current === selectedInstrument && samplerRef.current && samplerLoadedRef.current) {
        return;
      }
      
      prevInstrumentRef.current = selectedInstrument;

      samplerLoadedRef.current = false;

      // dispose old
      samplerRef.current?.dispose();
      reverbRef.current?.dispose();
      delayRef.current?.dispose();

      reverbRef.current = new Tone.Reverb({
        decay: 6,
        preDelay: 0.2,
        wet: 0.2
      }).toDestination();

      delayRef.current = new Tone.FeedbackDelay({
        delayTime: "8n",
        feedback: 0.3,
        wet: 0.25
      }).connect(reverbRef.current);

      samplerRef.current = new Tone.Sampler({
        urls: instrumentSamples[selectedInstrument],
        baseUrl: "",
        onload: () => {
          console.log(`${selectedInstrument} sampler loaded`);

          samplerLoadedRef.current = true;
        },
        onerror: (error) => {
          console.error(`${selectedInstrument} sampler failed:`, error);
        }
      }).connect(reverbRef.current);

      return () => {
        samplerRef.current?.dispose();
        reverbRef.current?.dispose();
        delayRef.current?.dispose();
      };
    }, [selectedInstrument]);

    const playNote = useCallback(async (swara, sthayi) => {
      if (!samplerRef.current || !samplerLoadedRef.current) {
        console.log("Sampler not ready yet");
        return;
      }

      if (!toneStartedRef.current) {
        await Tone.start(); // WAIT for this to finish
        toneStartedRef.current = true;
        console.log("Tone.js started");
      }

      const note = getSwaraNote(swara, sthayi, basePitchShift);

      samplerRef.current.triggerAttackRelease(note, "2");
    }, [basePitchShift]);

    return playNote;
}

function getSwaraNote(swara, sthayi, basePitchShift = 0) {
  const swaraMap = {
    "S": 0, "R1": 1, "R2": 2, "G1": 2,
    "G2": 3, "G3": 4, "M1": 5, "M2": 6,
    "P": 7, "D1": 8, "D2": 9, "N1": 9,
    "N2": 10, "N3": 11
  };

  const octaveMap = {
    "mandra": 3,
    "madhyai": 4,
    "tara": 5
  };

  const semitone = swaraMap[swara] ?? 0;
  const baseOctave = octaveMap[sthayi] || 4;
  
  // calculate total semitones from C0
  const totalSemitones = (baseOctave * 12) + semitone + basePitchShift;
  
  // derive octave and semitone from total
  const octave = Math.floor(totalSemitones / 12);
  const finalSemitone = ((totalSemitones % 12) + 12) % 12;
  
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return `${noteNames[finalSemitone]}${octave}`;
}