import React from 'react';

function Chip({ label, onClick }) {
  return (
    <button className="chip" onClick={() => onClick(label)}>
      {label}
    </button>
  );
}

export default Chip;
