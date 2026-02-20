import React from 'react';

/**
 * PaymentWindowBadge Component
 * 
 * Displays payment window with discount percentage
 * 
 * Props:
 * - paymentWindow (string, required): "monthly", "quarterly", "half_yearly", "yearly"
 * - discount (number): Discount percentage (0, 2, 5, 10)
 * - size (string): "sm", "md", "lg" - Default: "md"
 * - showDiscount (boolean): Show discount badge - Default: true
 */

const PaymentWindowBadge = ({ 
  paymentWindow, 
  discount = 0, 
  size = 'md', 
  showDiscount = true 
}) => {
  if (!paymentWindow) return null;

  // Display names
  const windowNames = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    half_yearly: 'Half-Yearly',
    yearly: 'Yearly'
  };

  // Color schemes
  const colorSchemes = {
    monthly: 'bg-gray-100 text-gray-800 border-gray-300',
    quarterly: 'bg-blue-100 text-blue-800 border-blue-300',
    half_yearly: 'bg-purple-100 text-purple-800 border-purple-300',
    yearly: 'bg-green-100 text-green-800 border-green-300'
  };

  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const displayName = windowNames[paymentWindow] || paymentWindow;
  const colorScheme = colorSchemes[paymentWindow] || 'bg-gray-100 text-gray-800 border-gray-300';
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="inline-flex items-center space-x-2">
      <span className={`
        inline-flex items-center font-semibold rounded-lg border-2
        ${colorScheme} ${sizeClass}
      `}>
        {displayName}
      </span>
      
      {showDiscount && discount > 0 && (
        <span className={`
          inline-flex items-center font-bold rounded-full
          bg-green-500 text-white
          ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 
            size === 'lg' ? 'px-3 py-1 text-base' : 
            'px-2 py-0.5 text-xs'}
        `}>
          -{discount}%
        </span>
      )}
    </div>
  );
};

export default PaymentWindowBadge;
