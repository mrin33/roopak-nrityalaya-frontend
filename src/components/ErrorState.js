import React from 'react';

/** Error placeholder with an optional retry action. */
const ErrorState = ({ title = 'Could not load this page', message, onRetry }) => (
  <div className="max-w-md mx-auto text-center py-16 px-4" role="alert">
    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center text-red-600">
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    </div>
    <h2 className="text-xl font-bold text-accent mb-2">{title}</h2>
    {message && <p className="text-gray-600 mb-6">{message}</p>}
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn-primary">
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
