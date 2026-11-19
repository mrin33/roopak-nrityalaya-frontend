import React from 'react';

/** Student roll number in a monospace pill (e.g. PP-2026-001). */
const RollNumberBadge = ({ rollNumber, size = 'md', showFull = false }) => {
  if (!rollNumber) return null;
  return (
    <span
      className={`inline-flex items-center rounded-md border border-sand-300 bg-sand-50 font-mono font-semibold text-accent-light ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[0.7rem]' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
      }`}
    >
      {showFull && <span className="mr-1 font-body font-medium text-gray-500">Roll no.</span>}
      {rollNumber}
    </span>
  );
};

export default RollNumberBadge;
