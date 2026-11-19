import React from 'react';

/** Status pill used across the portals (students, requests, payments, attendance…). */
const STATUS = {
  active: ['badge-success', 'Active'],
  inactive: ['badge-neutral', 'Inactive'],
  discontinued: ['badge-danger', 'Discontinued'],
  suspended: ['badge-warning', 'Suspended'],
  pending: ['badge-warning', 'Pending'],
  approved: ['badge-success', 'Approved'],
  rejected: ['badge-danger', 'Rejected'],
  paid: ['badge-success', 'Paid'],
  unpaid: ['badge-danger', 'Unpaid'],
  overdue: ['badge-danger', 'Overdue'],
  present: ['badge-success', 'Present'],
  absent: ['badge-danger', 'Absent'],
  late: ['badge-warning', 'Late'],
  completed: ['badge-info', 'Completed'],
  attended: ['badge-info', 'Attended'],
  scheduled: ['badge-brand', 'Scheduled'],
  cancelled: ['badge-neutral', 'Cancelled'],
  draft: ['badge-neutral', 'Draft'],
  published: ['badge-success', 'Published'],
};

const DOT = {
  'badge-success': 'bg-green-600',
  'badge-danger': 'bg-red-600',
  'badge-warning': 'bg-amber-500',
  'badge-info': 'bg-sky-600',
  'badge-brand': 'bg-primary',
  'badge-neutral': 'bg-gray-400',
};

const StatusBadge = ({ status, size = 'md', label }) => {
  if (!status) return null;
  const key = String(status).toLowerCase();
  const [cls, text] = STATUS[key] || ['badge-neutral', String(status).replace(/_/g, ' ')];
  return (
    <span className={`${cls} ${size === 'lg' ? 'px-3 py-1 text-sm' : ''} capitalize`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[cls]}`} aria-hidden="true" />
      {label || text}
    </span>
  );
};

export default StatusBadge;
