import React from 'react';

/**
 * LateFeeWarning Component
 * 
 * Displays warning banner for late fees and grace period
 * 
 * Props:
 * - hasLateFee (boolean, required): Whether student has late fee
 * - lateFeeAmount (number): Late fee amount
 * - daysUntilLateFee (number): Days remaining in grace period
 * - nextDueDate (string): Next payment due date
 * - variant (string): "banner", "card" - Default: "banner"
 */

const LateFeeWarning = ({ 
  hasLateFee, 
  lateFeeAmount = 0, 
  daysUntilLateFee = 0,
  nextDueDate,
  variant = 'banner'
}) => {
  // Don't show if no late fee and no grace period warning
  if (!hasLateFee && daysUntilLateFee <= 0) return null;

  // Late fee already applied
  if (hasLateFee && lateFeeAmount > 0) {
    if (variant === 'card') {
      return (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800 mb-1">Late Fee Applied</h3>
              <p className="text-sm text-red-700">
                A late fee of <span className="font-bold">₹{lateFeeAmount}</span> has been added to your pending payment.
                Please pay as soon as possible to avoid additional charges.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-red-100 border-l-4 border-red-600 p-4 mb-6 rounded-r-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">
              <strong>Late Fee Applied:</strong> ₹{lateFeeAmount} has been added to your payment. 
              Pay immediately to avoid additional charges.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Grace period warning (0-10 days remaining)
  if (daysUntilLateFee > 0 && daysUntilLateFee <= 10) {
    const urgency = daysUntilLateFee <= 3 ? 'high' : 'medium';
    
    if (variant === 'card') {
      return (
        <div className={`
          border-2 rounded-xl p-4
          ${urgency === 'high' 
            ? 'bg-orange-50 border-orange-200' 
            : 'bg-yellow-50 border-yellow-200'}
        `}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className={`w-6 h-6 ${urgency === 'high' ? 'text-orange-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold mb-1 ${urgency === 'high' ? 'text-orange-800' : 'text-yellow-800'}`}>
                Grace Period Ending Soon
              </h3>
              <p className={`text-sm ${urgency === 'high' ? 'text-orange-700' : 'text-yellow-700'}`}>
                <span className="font-bold">{daysUntilLateFee} day{daysUntilLateFee > 1 ? 's' : ''}</span> left 
                before late fee of <span className="font-bold">₹{lateFeeAmount}</span> applies.
                {nextDueDate && (
                  <span className="block mt-1">Due date: {new Date(nextDueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`
        border-l-4 p-4 mb-6 rounded-r-lg
        ${urgency === 'high' 
          ? 'bg-orange-100 border-orange-600' 
          : 'bg-yellow-100 border-yellow-600'}
      `}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className={`h-5 w-5 ${urgency === 'high' ? 'text-orange-600' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className={`text-sm ${urgency === 'high' ? 'text-orange-800' : 'text-yellow-800'}`}>
              <strong>⏰ {daysUntilLateFee} day{daysUntilLateFee > 1 ? 's' : ''} left</strong> before late fee of ₹{lateFeeAmount} applies.
              {nextDueDate && ` Pay before ${new Date(nextDueDate).toLocaleDateString('en-IN')}.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LateFeeWarning;
