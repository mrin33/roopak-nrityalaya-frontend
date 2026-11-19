import React, { useState } from 'react';

const STAR =
  'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z';

const SIZES = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6', xl: 'h-8 w-8' };

/** One star filled to `fill` (0–1). */
const Star = ({ fill, size }) => (
  <span className={`relative inline-block ${size}`}>
    <svg className={`absolute inset-0 ${size} text-sand-300`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={STAR} />
    </svg>
    <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
      <svg className={`${size} text-secondary-500`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={STAR} />
      </svg>
    </span>
  </span>
);

/**
 * Read-only star display, or (with `interactive` + `onChange`) a keyboard
 * accessible 1–5 rating input.
 */
const StarRating = ({ rating = 0, maxRating = 5, size = 'md', showNumber = false, interactive = false, onChange, label = 'Rating' }) => {
  const [hover, setHover] = useState(0);
  const value = Number(rating) || 0;
  const sizeClass = SIZES[size] || SIZES.md;

  if (!interactive) {
    const shown = Math.round(value * 2) / 2;
    return (
      <span className="inline-flex items-center gap-2">
        <span className="inline-flex gap-0.5" role="img" aria-label={`${label}: ${value.toFixed(1)} out of ${maxRating}`}>
          {Array.from({ length: maxRating }).map((_, i) => (
            <Star key={i} size={sizeClass} fill={Math.max(0, Math.min(1, shown - i))} />
          ))}
        </span>
        {showNumber && <span className="text-sm font-medium tabular-nums text-gray-700">{value.toFixed(1)}</span>}
      </span>
    );
  }

  const display = hover || value;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex gap-0.5" role="radiogroup" aria-label={label} onMouseLeave={() => setHover(0)}>
        {Array.from({ length: maxRating }).map((_, i) => {
          const v = i + 1;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={value === v}
              aria-label={`${v} star${v > 1 ? 's' : ''}`}
              className="rounded transition-transform hover:scale-110"
              onClick={() => onChange && onChange(v)}
              onMouseEnter={() => setHover(v)}
              onKeyDown={(e) => {
                if ((e.key === 'ArrowRight' || e.key === 'ArrowUp') && onChange) {
                  e.preventDefault();
                  onChange(Math.min(maxRating, (value || 0) + 1));
                } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowDown') && onChange) {
                  e.preventDefault();
                  onChange(Math.max(1, (value || 1) - 1));
                }
              }}
            >
              <Star size={sizeClass} fill={v <= display ? 1 : 0} />
            </button>
          );
        })}
      </span>
      {showNumber && <span className="text-sm font-medium tabular-nums text-gray-700">{value ? `${value}/${maxRating}` : '—'}</span>}
    </span>
  );
};

export default StarRating;
