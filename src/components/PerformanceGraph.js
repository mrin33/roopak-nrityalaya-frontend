import React from 'react';

/**
 * PerformanceGraph Component
 * 
 * Simple bar chart for showing performance metrics
 * 
 * Props:
 * - data (array, required): Array of {label, value} objects
 * - maxValue (number): Maximum value for scaling - Default: 100
 * - height (number): Chart height in pixels - Default: 200
 * - color (string): "primary", "secondary", "green", "blue", "purple" - Default: "primary"
 * - showValues (boolean): Show values on bars - Default: true
 * - title (string): Chart title
 */

const PerformanceGraph = ({ 
  data = [], 
  maxValue = 100,
  height = 200,
  color = 'primary',
  showValues = true,
  title = ''
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Color schemes
  const colorSchemes = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  const barColor = colorSchemes[color] || colorSchemes.primary;

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-bold text-accent mb-4">{title}</h3>
      )}
      
      <div 
        className="flex items-end justify-between space-x-2 px-2"
        style={{ height: `${height}px` }}
      >
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const barHeight = Math.max((percentage / 100) * height, 20); // Minimum 20px

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative w-full flex items-end justify-center" style={{ height: `${height}px` }}>
                {showValues && (
                  <div 
                    className="absolute text-xs font-bold text-gray-700 mb-1"
                    style={{ bottom: `${barHeight + 8}px` }}
                  >
                    {item.value}
                  </div>
                )}
                <div
                  className={`w-full ${barColor} rounded-t-lg transition-all duration-500 ease-out hover:opacity-80`}
                  style={{ height: `${barHeight}px` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center break-words w-full">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-gray-500">
        <span>Min: 0</span>
        <span>Max: {maxValue}</span>
      </div>
    </div>
  );
};

export default PerformanceGraph;
