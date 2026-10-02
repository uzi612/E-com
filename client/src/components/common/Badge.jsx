import React from 'react';

const Badge = ({
  children,
  variant,
  status,
  size = 'sm',
  className = '',
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const statusMap = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const sizes = {
    xs: 'text-[11px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  const resolvedVariantClass = status
    ? statusMap[status] || variants.default
    : variants[variant || 'default'] || variants.default;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${resolvedVariantClass} ${sizes[size] || sizes.sm} ${className}`}
    >
      {status && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            status === 'Delivered'
              ? 'bg-emerald-500'
              : status === 'Shipped'
              ? 'bg-indigo-500'
              : status === 'Confirmed'
              ? 'bg-blue-500'
              : status === 'Pending'
              ? 'bg-amber-500'
              : 'bg-rose-500'
          }`}
        />
      )}
      {children || status}
    </span>
  );
};

export default Badge;
