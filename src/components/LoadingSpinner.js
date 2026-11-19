import React from 'react';
import { PageSkeleton } from './ui/Skeleton';

const SIZES = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-8 w-8 border-[3px]', xl: 'h-10 w-10 border-[3px]' };

/**
 * Inline spinner for small loading areas. `fullScreen` renders a page
 * skeleton instead (portal pages load inside the layout, not over it).
 */
const LoadingSpinner = ({ size = 'md', color = 'primary', fullScreen = false, text = '' }) => {
  if (fullScreen) return <PageSkeleton label={text || 'Loading…'} />;
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8" role="status" aria-live="polite">
      <span
        className={`${SIZES[size] || SIZES.md} animate-spin rounded-full ${
          color === 'white' ? 'border-white/40 border-t-white' : 'border-sand-300 border-t-primary'
        }`}
        aria-hidden="true"
      />
      <span className={text ? 'text-sm text-gray-600' : 'sr-only'}>{text || 'Loading…'}</span>
    </div>
  );
};

export default LoadingSpinner;
