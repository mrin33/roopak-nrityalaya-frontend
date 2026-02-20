import React from 'react';

/**
 * BatchCapacityBar Component
 * 
 * Visual progress bar showing batch enrollment capacity
 * 
 * Props:
 * - currentEnrolled (number, required): Current number of students
 * - maxStudents (number, required): Maximum capacity (default 15)
 * - showLabel (boolean): Show text label - Default: true
 * - showPercentage (boolean): Show percentage - Default: true
 * - size (string): "sm", "md", "lg" - Default: "md"
 */

const BatchCapacityBar = ({ 
  currentEnrolled, 
  maxStudents = 15, 
  showLabel = true,
  showPercentage = true,
  size = 'md'
}) => {
  if (currentEnrolled === undefined || maxStudents === undefined) return null;

  const percentage = Math.min((currentEnrolled / maxStudents) * 100, 100);
  const spotsLeft = maxStudents - currentEnrolled;
  
  // Determine color based on capacity
  const getColorScheme = () => {
    if (percentage >= 100) {
      return {
        bar: 'bg-red-500',
        bg: 'bg-red-100',
        text: 'text-red-700',
        status: 'Full'
      };
    } else if (percentage >= 80) {
      return {
        bar: 'bg-orange-500',
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        status: 'Almost Full'
      };
    } else if (percentage >= 60) {
      return {
        bar: 'bg-yellow-500',
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        status: 'Filling Up'
      };
    } else {
      return {
        bar: 'bg-green-500',
        bg: 'bg-green-100',
        text: 'text-green-700',
        status: 'Available'
      };
    }
  };

  const colorScheme = getColorScheme();
  
  // Size variants for progress bar
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const heightClass = heightClasses[size] || heightClasses.md;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            {currentEnrolled} / {maxStudents} students
          </span>
          {showPercentage && (
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${colorScheme.bg} ${colorScheme.text}`}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full ${colorScheme.bg} rounded-full overflow-hidden ${heightClass}`}>
        <div 
          className={`${colorScheme.bar} ${heightClass} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showLabel && (
        <div className="flex items-center justify-between mt-1">
          <span className={`text-xs ${colorScheme.text}`}>
            {percentage >= 100 ? 'Batch Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
          </span>
          {percentage >= 80 && percentage < 100 && (
            <span className="text-xs text-gray-500 italic">{colorScheme.status}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchCapacityBar;
