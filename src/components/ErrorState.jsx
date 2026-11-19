import React from 'react';
import Icon from './ui/Icon';

/** Error placeholder with an optional retry action. */
const ErrorState = ({ title = 'We couldn’t load this page', message, onRetry, compact = false }) => (
  <div className={`mx-auto max-w-md px-4 text-center ${compact ? 'py-8' : 'py-16 sm:py-24'}`} role="alert">
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-700">
      <Icon name="warning" className="h-6 w-6" />
    </div>
    <h2 className="font-heading text-xl font-semibold text-accent">{title}</h2>
    {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn-primary mt-6">
        <Icon name="refresh" className="h-4 w-4" />
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
