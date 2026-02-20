import React from 'react';

/**
 * LoadingSpinner Component
 * 
 * Beautiful loading spinner with multiple variants
 * 
 * Props:
 * - size (string): "sm", "md", "lg", "xl" - Default: "md"
 * - color (string): "primary", "secondary", "white", "gray" - Default: "primary"
 * - variant (string): "spinner", "dots", "pulse" - Default: "spinner"
 * - fullScreen (boolean): Center in full screen - Default: false
 * - text (string): Loading text to display
 */

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  variant = 'spinner',
  fullScreen = false,
  text = ''
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Color classes
  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const colorClass = colorClasses[color] || colorClasses.primary;

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${
                  size === 'sm' ? 'w-2 h-2' :
                  size === 'lg' ? 'w-4 h-4' :
                  size === 'xl' ? 'w-5 h-5' :
                  'w-3 h-3'
                } rounded-full ${colorClass.replace('border-', 'bg-')} animate-bounce`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`${sizeClass} rounded-full ${colorClass.replace('border-', 'bg-')} animate-pulse`} />
        );

      case 'spinner':
      default:
        return (
          <div
            className={`
              ${sizeClass} 
              border-4 
              ${colorClass}
              border-t-transparent 
              rounded-full 
              animate-spin
            `}
          />
        );
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderSpinner()}
      {text && (
        <p className={`
          font-medium
          ${size === 'sm' ? 'text-xs' :
            size === 'lg' ? 'text-lg' :
            size === 'xl' ? 'text-xl' :
            'text-sm'}
          ${color === 'white' ? 'text-white' : 'text-gray-600'}
        `}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
