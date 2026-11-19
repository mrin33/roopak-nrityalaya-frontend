import React from 'react';

const NAMES = { monthly: 'Monthly', quarterly: 'Quarterly', half_yearly: 'Half-yearly', yearly: 'Yearly' };

/** Fee plan label with the discount it earns. */
const PaymentWindowBadge = ({ paymentWindow, discount = 0, showDiscount = true }) => {
  if (!paymentWindow) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="badge-gold">{NAMES[paymentWindow] || paymentWindow}</span>
      {showDiscount && Number(discount) > 0 && <span className="badge-success">−{Number(discount)}%</span>}
    </span>
  );
};

export default PaymentWindowBadge;
