import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from 'shared/config/urls.js';

export const WhatsAppButton = ({
  phone = '',
  message = '',
  url = null, // Or direct pre-built URL
  label = 'Send on WhatsApp',
  className = '',
  variant = 'primary'
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    const targetUrl = url || buildWhatsAppUrl(phone, message);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const styleClass =
    variant === 'primary'
      ? 'bg-[#25D366] hover:bg-[#1EBE5D] text-white'
      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${styleClass} ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-current shrink-0" />
      <span>{label}</span>
    </button>
  );
};
