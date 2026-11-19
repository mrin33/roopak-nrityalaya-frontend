import React from 'react';
import Icon from './Icon';

/**
 * Clearly labelled stand-in for a photograph the academy has not supplied
 * yet. It is deliberately obvious so it is never mistaken for real content.
 */
const ImagePlaceholder = ({ label = 'Photo coming soon', note = 'Placeholder — replace with an academy photograph', className = '', dark = false, icon = 'photo' }) => (
  <div
    className={`relative flex flex-col items-center justify-center overflow-hidden text-center ${
      dark ? 'bg-accent text-sand-200' : 'bg-sand-100 text-gray-500'
    } ${className}`}
    role="img"
    aria-label={`${label} (placeholder image)`}
  >
    <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
      <defs>
        <pattern id="rn-ph" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="28" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#rn-ph)" />
    </svg>
    <div className="relative px-4">
      <Icon name={icon} className="mx-auto h-10 w-10 opacity-60" strokeWidth={1.25} />
      <p className="mt-2 text-sm font-medium">{label}</p>
      {note && <p className="mt-0.5 text-xs opacity-75">{note}</p>}
    </div>
  </div>
);

export default ImagePlaceholder;
