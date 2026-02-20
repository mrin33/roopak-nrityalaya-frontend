import React from 'react';

/**
 * RollNumberBadge Component
 * 
 * Displays student roll number with level-based color coding
 * 
 * Props:
 * - rollNumber (string, required): The roll number (e.g., "PP1", "VP2")
 * - size (string): "sm", "md", "lg" - Default: "md"
 * - showFull (boolean): Show full text or just roll number - Default: false
 */

const RollNumberBadge = ({ rollNumber, size = 'md', showFull = false }) => {
  if (!rollNumber) return null;

  // Extract level code from roll number (first 2-3 characters)
  const levelCode = rollNumber.match(/^[A-Z]+/)?.[0] || '';
  
  // Color scheme based on level
  const getColorScheme = (code) => {
    switch (code) {
      case 'PP': // Praveshika Pratham
        return 'bg-green-100 text-green-800 border-green-300';
      case 'PD': // Praveshika Dwitiya
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'MP': // Madhyama Pratham
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'MD': // Madhyama Dwitiya
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'MT': // Madhyama Tritiya
        return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'VP': // Visharad Pratham
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'VD': // Visharad Dwitiya
        return 'bg-red-100 text-red-800 border-red-300';
      case 'AP': // Alankar Pratham
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const colorScheme = getColorScheme(levelCode);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`
      inline-flex items-center font-mono font-bold rounded-full border-2
      ${colorScheme} ${sizeClass}
    `}>
      {showFull && <span className="mr-1">Roll No:</span>}
      {rollNumber}
    </span>
  );
};

export default RollNumberBadge;
