import React from 'react';
import Chip from './Chip';

function ChipContainer({ chips, onChipClick }) {
  return (
    <div className="chip-container">
      {chips.map(label => (
        <Chip key={label} label={label} onClick={onChipClick} />
      ))}
    </div>
  );
}

export default ChipContainer;
