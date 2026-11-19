import React from 'react';

/** Enrolment vs. capacity meter for a batch. */
const BatchCapacityBar = ({ currentEnrolled, maxStudents = 15, showLabel = true, size = 'md' }) => {
  if (currentEnrolled === undefined || currentEnrolled === null || !maxStudents) return null;
  const pct = Math.min((currentEnrolled / maxStudents) * 100, 100);
  const left = Math.max(maxStudents - currentEnrolled, 0);
  const tone = pct >= 100 ? 'bg-red-600' : pct >= 80 ? 'bg-amber-500' : 'bg-primary';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-accent">
            {currentEnrolled} / {maxStudents} students
          </span>
          <span className={pct >= 100 ? 'font-medium text-red-700' : 'text-gray-500'}>
            {pct >= 100 ? 'Full' : `${left} place${left === 1 ? '' : 's'} left`}
          </span>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-sand-200 ${size === 'sm' ? 'h-1.5' : 'h-2'}`}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={maxStudents}
        aria-valuenow={currentEnrolled}
        aria-label="Batch capacity"
      >
        <div className={`h-full rounded-full ${tone} transition-[width] duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default BatchCapacityBar;
