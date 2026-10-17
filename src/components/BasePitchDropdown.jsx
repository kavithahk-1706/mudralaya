import { ControlDropdown } from './Controls';

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

export default function BasePitchDropdown({ basePitchShift, setBasePitchShift, ...dropdownProps }) {
  const currentLabel = pitchOptions.find(opt => opt.value === basePitchShift)?.label || "Default (C4)";

  return (
    <ControlDropdown
      caption="Pitch"
      label={currentLabel}
      options={pitchOptions.map(opt => ({ key: opt.value, label: opt.label, value: opt.value, selected: opt.value === basePitchShift }))}
      onSelect={option => setBasePitchShift(option.value)}
      minWidth={230}
      {...dropdownProps}
    />
  );
}
