import React from 'react';

const COLORS = {
  primary: 'bg-primary',
  secondary: 'bg-secondary-500',
  green: 'bg-green-600',
  blue: 'bg-sky-600',
  purple: 'bg-primary-400',
  orange: 'bg-amber-500',
};

/** Simple accessible bar chart: data = [{ label, value }]. */
const PerformanceGraph = ({ data = [], maxValue, height = 200, color = 'primary', showValues = true, title = '', unit = '' }) => {
  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg bg-sand-50 text-sm text-gray-500">No data yet</div>
    );
  }
  const max = maxValue || Math.max(...data.map((d) => Number(d.value) || 0), 1);
  const bar = COLORS[color] || COLORS.primary;

  return (
    <figure className="w-full">
      {title && <figcaption className="mb-4 text-sm font-semibold text-accent">{title}</figcaption>}
      <div className="relative" style={{ height }}>
        <div className="absolute inset-0 flex flex-col justify-between" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-t border-dashed border-sand-200" />
          ))}
        </div>
        <ul className="relative flex h-full items-end gap-2 sm:gap-3">
          {data.map((d, i) => {
            const v = Number(d.value) || 0;
            const h = Math.max((v / max) * 100, v > 0 ? 3 : 0);
            return (
              <li key={i} className="group flex h-full flex-1 flex-col justify-end" aria-label={`${d.label}: ${v}${unit}`} title={`${d.label}: ${v}${unit}`}>
                {showValues && (
                  <span className="mb-1 text-center text-[0.7rem] font-medium tabular-nums text-gray-600">
                    {v}
                    {unit}
                  </span>
                )}
                <div className={`w-full rounded-t-md ${bar} opacity-90 transition-[height,opacity] duration-500 group-hover:opacity-100`} style={{ height: `${h}%` }} />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3" aria-hidden="true">
        {data.map((d, i) => (
          <span key={i} className="flex-1 truncate text-center text-[0.7rem] text-gray-500">
            {d.label}
          </span>
        ))}
      </div>
    </figure>
  );
};

export default PerformanceGraph;
