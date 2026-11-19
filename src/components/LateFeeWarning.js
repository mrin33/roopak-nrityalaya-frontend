import React from 'react';
import Icon from './ui/Icon';
import { formatDate } from '../utils/date';

/** Late-fee notice: applied, or due within the next 10 days. */
const LateFeeWarning = ({ hasLateFee, lateFeeAmount = 0, daysUntilLateFee = 0, nextDueDate }) => {
  if (hasLateFee && lateFeeAmount > 0) {
    return (
      <div className="callout-danger flex gap-3" role="alert">
        <Icon name="warning" className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          <strong className="font-semibold">Late fee applied.</strong> ₹{lateFeeAmount} has been added to your pending
          payment. Please pay at the academy office as soon as possible.
        </p>
      </div>
    );
  }
  if (daysUntilLateFee > 0 && daysUntilLateFee <= 10) {
    return (
      <div className="callout-warning flex gap-3">
        <Icon name="clock" className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          <strong className="font-semibold">
            {daysUntilLateFee} day{daysUntilLateFee > 1 ? 's' : ''} left
          </strong>{' '}
          before a late fee{lateFeeAmount ? ` of ₹${lateFeeAmount}` : ''} applies.
          {nextDueDate && ` Due ${formatDate(nextDueDate, { day: 'numeric', month: 'short', year: 'numeric' })}.`}
        </p>
      </div>
    );
  }
  return null;
};

export default LateFeeWarning;
