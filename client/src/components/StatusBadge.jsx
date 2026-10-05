import React from 'react';

export const StatusBadge = ({ status, type = 'order' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'awaiting_address':
        return { label: 'Address Pending', bg: 'bg-amber-50/80 text-amber-900 border-amber-200/70' };
      case 'ready_for_payment':
        return { label: 'Ready for Payment', bg: 'bg-sky-50/80 text-sky-900 border-sky-200/70' };
      case 'payment_initiated':
        return { label: 'Payment Initiated', bg: 'bg-purple-50/80 text-purple-900 border-purple-200/70' };
      case 'completed':
      case 'paid':
        return { label: 'Paid / Completed', bg: 'bg-emerald-50/80 text-emerald-900 border-emerald-200/70' };
      case 'expired':
        return { label: 'Expired', bg: 'bg-stone-100 text-stone-600 border-stone-200' };
      case 'deleted':
        return { label: 'Deleted', bg: 'bg-rose-50 text-rose-800 border-rose-200/60' };
      case 'pending':
        return { label: 'Payment Pending', bg: 'bg-amber-50/80 text-amber-900 border-amber-200/70' };
      case 'initiated':
        return { label: 'UPI Opened', bg: 'bg-purple-50/80 text-purple-900 border-purple-200/70' };
      default:
        return { label: status || 'Unknown', bg: 'bg-stone-50 text-stone-700 border-stone-200' };
    }
  };

  const { label, bg } = getBadgeConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium border tracking-tight ${bg}`}>
      {label}
    </span>
  );
};
