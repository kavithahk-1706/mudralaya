import ragaData from '../raga_details.json';
import { ControlDropdown } from './Controls';

export default function RagaDropdown({ selectedRaga, setSelectedRaga, ...dropdownProps }) {
  return (
    <ControlDropdown
      caption="Raga"
      label={selectedRaga}
      options={ragaData.map(r => ({ key: r.name, label: r.name, selected: r.name === selectedRaga }))}
      onSelect={option => setSelectedRaga(option.key)}
      minWidth={240}
      columns={3}
      {...dropdownProps}
    />
  );
}
