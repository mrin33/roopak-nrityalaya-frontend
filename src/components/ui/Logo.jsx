import React from 'react';
import academy from '../../config/academy';

/**
 * Monogram mark + wordmark. Replace the monogram with the academy's official
 * logo file once it is available.
 */
export const LogoMark = ({ className = 'h-10 w-10' }) => (
  <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="#8B4513" />
    <circle cx="32" cy="32" r="26" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
    <text x="32" y="41" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="23" fontWeight="700" fill="#FBF8F3">
      RN
    </text>
  </svg>
);

const Logo = ({ light = false, compact = false }) => (
  <span className="flex items-center gap-3">
    <LogoMark className={compact ? 'h-9 w-9' : 'h-10 w-10 sm:h-11 sm:w-11'} />
    <span className="leading-tight">
      <span className={`block font-heading text-lg font-semibold sm:text-xl ${light ? 'text-sand-50' : 'text-primary-700'}`}>
        {academy.name}
      </span>
      {!compact && (
        <span className={`block text-[0.68rem] font-medium uppercase tracking-[0.22em] ${light ? 'text-secondary-300' : 'text-secondary-700'}`}>
          {academy.tagline}
        </span>
      )}
    </span>
  </span>
);

export default Logo;
