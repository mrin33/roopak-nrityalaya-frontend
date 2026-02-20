import React from 'react';

/**
 * StatusBadge Component
 * 
 * Universal status badge for students, teachers, batches, requests, etc.
 * 
 * Props:
 * - status (string, required): The status value
 * - type (string): "student", "teacher", "request", "payment", "batch" - Default: "student"
 * - size (string): "sm", "md", "lg" - Default: "md"
 */

const StatusBadge = ({ status, type = 'student', size = 'md' }) => {
  if (!status) return null;

  // Status configurations
  const statusConfig = {
    // Student/Teacher status
    active: { 
      color: 'bg-green-100 text-green-800 border-green-300', 
      icon: '✓',
      label: 'Active'
    },
    inactive: { 
      color: 'bg-gray-100 text-gray-800 border-gray-300', 
      icon: '○',
      label: 'Inactive'
    },
    discontinued: { 
      color: 'bg-red-100 text-red-800 border-red-300', 
      icon: '✗',
      label: 'Discontinued'
    },
    suspended: { 
      color: 'bg-orange-100 text-orange-800 border-orange-300', 
      icon: '⏸',
      label: 'Suspended'
    },
    
    // Request status
    pending: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
      icon: '⏳',
      label: 'Pending'
    },
    approved: { 
      color: 'bg-green-100 text-green-800 border-green-300', 
      icon: '✓',
      label: 'Approved'
    },
    rejected: { 
      color: 'bg-red-100 text-red-800 border-red-300', 
      icon: '✗',
      label: 'Rejected'
    },
    
    // Payment status
    paid: { 
      color: 'bg-green-100 text-green-800 border-green-300', 
      icon: '✓',
      label: 'Paid'
    },
    unpaid: { 
      color: 'bg-red-100 text-red-800 border-red-300', 
      icon: '✗',
      label: 'Unpaid'
    },
    overdue: { 
      color: 'bg-orange-100 text-orange-800 border-orange-300', 
      icon: '⚠',
      label: 'Overdue'
    },
    
    // Attendance status
    present: { 
      color: 'bg-green-100 text-green-800 border-green-300', 
      icon: '✓',
      label: 'Present'
    },
    absent: { 
      color: 'bg-red-100 text-red-800 border-red-300', 
      icon: '✗',
      label: 'Absent'
    },
    late: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
      icon: '⏰',
      label: 'Late'
    },
    
    // Batch transfer status
    completed: { 
      color: 'bg-blue-100 text-blue-800 border-blue-300', 
      icon: '✓',
      label: 'Completed'
    },
    cancelled: { 
      color: 'bg-gray-100 text-gray-800 border-gray-300', 
      icon: '✗',
      label: 'Cancelled'
    }
  };

  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const config = statusConfig[status.toLowerCase()] || {
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: '○',
    label: status
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`
      inline-flex items-center space-x-1 font-semibold rounded-full border-2
      ${config.color} ${sizeClass}
    `}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
