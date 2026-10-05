import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { CopyButton } from '../../components/CopyButton.jsx';
import { WhatsAppButton } from '../../components/WhatsAppButton.jsx';
import { buildPublicAddressUrl } from 'shared/config/urls.js';
import { MESSAGES } from 'shared/config/messages.js';
import { InputField } from '../../components/InputField.jsx';
import {
  ExternalLink,
  MessageCircle,
  Share2,
  Sparkles,
  Phone
} from 'lucide-react';

export const AddressFormatterModule = () => {
  const { business } = useAuth();
  const { showToast } = useToast();

  const [customerPhone, setCustomerPhone] = useState('');
  const publicAddressUrl = business?.businessCode ? buildPublicAddressUrl(business.businessCode) : '';

  const whatsappMessage = MESSAGES.customerAddressRequest({
    businessName: business?.businessName || '---',
    url: publicAddressUrl
  });

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-900 tracking-tight mt-0.5">Address Formatter</h1>
        <p className="text-xs text-reseller-muted mt-0.5">
          Share your address collection link with customers for automated formatting.
        </p>
      </div>

      {/* Shareable Link Card */}
      <div className="card-frame p-5 bg-forest-600 text-white">
        <div className="flex items-center gap-2 mb-1.5">
          <Share2 className="w-3.5 h-3.5 text-emerald-200" />
          <span className="text-[10px] uppercase tracking-wider text-forest-200 font-bold">Public Formatter URL</span>
        </div>

        <p className="text-[11px] text-forest-100 mb-3 leading-relaxed">
          Customers who open this link see your store name ({business?.businessName}) and get their delivery address formatted automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            readOnly
            value={publicAddressUrl}
            className="w-full bg-forest-700/60 border border-forest-500/70 text-xs text-white rounded-xl px-3 py-2 font-mono select-all focus:outline-none"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <CopyButton text={publicAddressUrl} label="Copy Link" className="flex-1 sm:flex-none text-xs py-1.5" />
            <a
              href={publicAddressUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-forest-700 hover:bg-forest-800 rounded-lg text-white transition shrink-0"
              title="Open Address Formatter"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Direct WhatsApp Share tool */}
      <div className="card-frame p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-reseller-border/70">
          <MessageCircle className="w-4 h-4 text-forest-600" />
          <div>
            <h3 className="font-display font-bold text-xs text-forest-900">Send Link via WhatsApp</h3>
            <p className="text-[11px] text-reseller-muted">Enter a customer's phone number to send the address collection link</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="custPhone">
              Customer Phone
            </label>
            <InputField
              id="custPhone"
              type="tel"
              icon={Phone}
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1">
              WhatsApp Message Preview
            </label>
            <div className="p-3 bg-stone-50 rounded-xl border border-reseller-border/70 font-mono text-[11px] whitespace-pre-wrap text-reseller-text leading-relaxed">
              {whatsappMessage}
            </div>
          </div>

          <WhatsAppButton
            phone={customerPhone}
            message={whatsappMessage}
            label="Send Address Link on WhatsApp"
            className="w-full py-2.5 text-xs"
          />
        </div>
      </div>

      {/* Feature Explainer */}
      <div className="card-frame p-4 bg-stone-50/70 border-dashed border-reseller-border">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-reseller-muted leading-relaxed">
            <strong className="text-forest-900 font-semibold block mb-0.5">Browser Caching</strong>
            When customers enter their address on your page, their browser automatically remembers it. Next time they purchase from you, their address is pre-filled automatically!
          </div>
        </div>
      </div>
    </div>
  );
};
