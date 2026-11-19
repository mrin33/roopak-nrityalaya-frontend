import React from 'react';
import Icon from './Icon';

/** Compact icon button for table rows; `label` is announced and shown as a tooltip. */
const RowAction = ({ icon, label, onClick, disabled, danger }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`icon-btn h-8 w-8 disabled:opacity-40 ${danger ? 'hover:bg-red-50 hover:text-red-700' : ''}`}
    aria-label={label}
    title={label}
  >
    <Icon name={icon} className="h-4 w-4" />
  </button>
);

export default RowAction;
