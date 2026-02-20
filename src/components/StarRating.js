import React from 'react';

/**
 * StarRating Component
 * 
 * Display star ratings (read-only or interactive)
 * 
 * Props:
 * - rating (number, required): Rating value (0-5)
 * - maxRating (number): Maximum rating - Default: 5
 * - size (string): "sm", "md", "lg", "xl" - Default: "md"
 * - showNumber (boolean): Show numeric value - Default: false
 * - interactive (boolean): Allow clicking to rate - Default: false
 * - onChange (function): Callback when rating changes (interactive mode)
 * - color (string): "yellow", "gold", "orange", "red" - Default: "yellow"
 */

const StarRating = ({ 
  rating, 
  maxRating = 5,
  size = 'md', 
  showNumber = false,
  interactive = false,
  onChange,
  color = 'yellow'
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  // Color classes
  const colorClasses = {
    yellow: 'text-yellow-400',
    gold: 'text-yellow-500',
    orange: 'text-orange-400',
    red: 'text-red-400'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const colorClass = colorClasses[color] || colorClasses.yellow;

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="inline-flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          const isHalfFilled = starValue - 0.5 === displayRating;

          return (
            <button
              key={index}
              type="button"
              className={`focus:outline-none ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
            >
              <svg
                className={`${sizeClass} ${isFilled || isHalfFilled ? colorClass : 'text-gray-300'}`}
                fill={isFilled || isHalfFilled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={isFilled || isHalfFilled ? 0 : 2}
                viewBox="0 0 24 24"
              >
                {isHalfFilled ? (
                  <defs>
                    <linearGradient id={`half-${index}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                ) : null}
                <path 
                  fill={isHalfFilled ? `url(#half-${index})` : undefined}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                />
              </svg>
            </button>
          );
        })}
      </div>
      
      {showNumber && (
        <span className="text-sm font-semibold text-gray-700">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
};

export default StarRating;
