import React from 'react';

/**
 * Robust InputField Component
 * Guarantees zero overlapping between leading icons and placeholder/text.
 */
export const InputField = ({
  icon: Icon,
  className = '',
  containerClassName = '',
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  readOnly = false,
  disabled = false,
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full ${containerClassName}`}>
      {Icon && (
        <div className="pointer-events-none absolute left-3 flex items-center justify-center text-reseller-muted z-10">
          <Icon className="w-4 h-4 text-stone-400 shrink-0" />
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        {...props}
        style={{
          paddingLeft: Icon ? '2.5rem' : '0.875rem',
          paddingRight: '0.875rem'
        }}
        className={`w-full border border-reseller-border rounded-xl py-2.5 text-xs text-reseller-text bg-white placeholder-stone-400 focus:outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition disabled:bg-stone-50 disabled:cursor-not-allowed ${className}`}
      />
    </div>
  );
};
