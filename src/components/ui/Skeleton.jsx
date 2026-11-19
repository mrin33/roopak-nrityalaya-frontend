import React from 'react';

/** Building blocks for loading placeholders that mirror the final layout. */
export const Skeleton = ({ className = 'h-4 w-full' }) => <div className={`skeleton ${className}`} aria-hidden="true" />;

export const StatCardsSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-7 w-16" />
        <Skeleton className="mt-3 h-3 w-24" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 6, cols = 5 }) => (
  <div className="surface overflow-hidden">
    <div className="flex gap-4 border-b border-sand-200 bg-sand-50 px-4 py-3">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex items-center gap-4 border-b border-sand-100 px-4 py-4 last:border-0">
        {Array.from({ length: cols }).map((__, c) => (
          <Skeleton key={c} className={`h-3.5 flex-1 ${c === 0 ? 'max-w-[10rem]' : ''}`} />
        ))}
      </div>
    ))}
  </div>
);

export const CardGridSkeleton = ({ count = 6, media = false }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="surface overflow-hidden">
        {media && <Skeleton className="aspect-[4/3] w-full rounded-none" />}
        <div className="space-y-3 p-5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Full-page loading state for portal pages: header, stat cards and a table.
 * `variant` = 'table' | 'cards' | 'form' | 'gallery'
 */
export const PageSkeleton = ({ label = 'Loading…', variant = 'table', stats = true }) => (
  <div className="page" role="status" aria-live="polite" aria-busy="true">
    <span className="sr-only">{label}</span>
    <div className="mb-6 space-y-2">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>
    {stats && variant !== 'form' && (
      <div className="mb-6">
        <StatCardsSkeleton />
      </div>
    )}
    {variant === 'table' && <TableSkeleton />}
    {variant === 'cards' && <CardGridSkeleton />}
    {variant === 'gallery' && <CardGridSkeleton media />}
    {variant === 'form' && (
      <div className="card max-w-3xl space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Skeleton;
