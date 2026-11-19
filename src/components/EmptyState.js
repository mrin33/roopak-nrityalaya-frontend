import React from 'react';
import Icon from './ui/Icon';

const ICONS = { document: 'document', image: 'photo', user: 'users', calendar: 'calendar', star: 'star', upload: 'upload', mail: 'mail', book: 'book', cash: 'cash' };

/** Friendly "nothing here yet" placeholder with an optional action. */
const EmptyState = ({ icon = 'document', title, description, actionText, onAction, size = 'md' }) => (
  <div className={`px-4 text-center ${size === 'sm' ? 'py-8' : size === 'lg' ? 'py-16' : 'py-12'}`}>
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand-100 text-sand-400">
      <Icon name={ICONS[icon] || icon} className="h-6 w-6" />
    </div>
    <h3 className="mt-4 font-body text-base font-semibold text-accent">{title}</h3>
    {description && <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">{description}</p>}
    {actionText && onAction && (
      <button type="button" onClick={onAction} className="btn-primary mt-5">
        {actionText}
      </button>
    )}
  </div>
);

export default EmptyState;
