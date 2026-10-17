import { ControlDropdown } from './Controls';

const instruments = ["Veena", "Sitar", "Flute", "Violin"];

export default function InstrumentDropdown({ selectedInstrument, setSelectedInstrument, ...dropdownProps }) {
  return (
    <ControlDropdown
      caption="Instrument"
      label={selectedInstrument}
      options={instruments.map(name => ({ key: name, label: name, selected: name === selectedInstrument }))}
      onSelect={option => setSelectedInstrument(option.key)}
      {...dropdownProps}
    />
  );
}
