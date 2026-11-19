import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

const TONES = {
  brand: 'bg-primary-50 text-primary',
  gold: 'bg-secondary-50 text-secondary-700',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-sky-50 text-sky-700',
  neutral: 'bg-sand-100 text-gray-600',
};

/** Compact metric tile. Pass `to` to make the whole tile a link. */
const StatCard = ({ label, value, hint, icon, tone = 'brand', to }) => {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {icon && (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${TONES[tone] || TONES.brand}`}>
            <Icon name={icon} className="h-5 w-5" />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-accent sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </>
  );

  return to ? (
    <Link to={to} className="card card-interactive block">
      {body}
    </Link>
  ) : (
    <div className="card">{body}</div>
  );
};

export default StatCard;
