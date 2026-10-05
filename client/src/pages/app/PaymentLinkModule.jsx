import React, { useState } from 'react';
import { orderApi } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { CopyButton } from '../../components/CopyButton.jsx';
import { WhatsAppButton } from '../../components/WhatsAppButton.jsx';
import { CustomerAutocompleteInput } from '../../components/CustomerAutocompleteInput.jsx';
import { InputField } from '../../components/InputField.jsx';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Phone,
  Tag
} from 'lucide-react';

export const PaymentLinkModule = () => {
  const { business } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    amount: '',
    customerPhone: '',
    formattedAddress: '',
    customerName: '',
    item: ''
  });

  const [extractedPhones, setExtractedPhones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const extractPhoneFromAddress = (text) => {
    if (!text) {
      setExtractedPhones([]);
      return;
    }
    const matches = text.match(/(?:\+91|91)?(?:\s|-)?([6-9]\d{9})/g);
    if (matches) {
      const cleanList = matches
        .map((m) => m.replace(/\D/g, '').replace(/^91/, ''))
        .filter((val, idx, self) => self.indexOf(val) === idx && val.length === 10);
      setExtractedPhones(cleanList);
      if (cleanList.length === 1 && !formData.customerPhone) {
        setFormData((prev) => ({ ...prev, customerPhone: cleanList[0] }));
      }
    } else {
      setExtractedPhones([]);
    }
  };

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, formattedAddress: val }));
    extractPhoneFromAddress(val);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-fill customer details from database search
  const handleSelectCustomer = (customer) => {
    if (customer) {
      setFormData((prev) => {
        const updatedPhone = (customer.phone || '').replace(/^91/, '') || prev.customerPhone;
        const updatedAddress = customer.defaultAddress?.formattedAddress || prev.formattedAddress;
        return {
          ...prev,
          customerName: customer.name || prev.customerName,
          customerPhone: updatedPhone,
          formattedAddress: updatedAddress
        };
      });
      showToast(`Auto-filled details for ${customer.name || 'customer'} ✓`, 'success');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await orderApi.createOrder({
        amount: Number(formData.amount),
        customerPhone: formData.customerPhone,
        formattedAddress: formData.formattedAddress,
        customerName: formData.customerName,
        item: formData.item || 'Order Request'
      });

      if (res.success && res.data) {
        setCreatedOrder(res.data);
        showToast('Payment link generated successfully ✓', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to create payment link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCreatedOrder(null);
    setFormData({
      amount: '',
      customerPhone: '',
      formattedAddress: '',
      customerName: '',
      item: ''
    });
    setExtractedPhones([]);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-reseller-muted">Module 2</span>
        <h1 className="font-display text-2xl font-bold text-forest-900 tracking-tight mt-0.5">Payment Link</h1>
        <p className="text-xs text-reseller-muted mt-0.5">
          Create a targeted payment link with an amount, delivery address, and direct UPI deep link.
        </p>
      </div>

      {/* Generated Order View */}
      {createdOrder ? (
        <div className="card-frame p-6 border-emerald-300 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-forest-900">Payment Request Created</h3>
              <p className="text-[11px] text-reseller-muted font-mono">Token: #{createdOrder.order.orderToken}</p>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-reseller-border/70 space-y-2">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200/60">
              <span className="text-reseller-muted">Item: <strong className="text-forest-900">{createdOrder.order.item}</strong></span>
              <span className="text-reseller-muted">Amount: <strong className="text-forest-800 font-mono font-bold">₹{createdOrder.order.amount}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={createdOrder.publicUrl}
                className="input-field text-xs font-mono bg-white select-all py-1.5"
              />
              <CopyButton text={createdOrder.publicUrl} label="Copy" className="py-1.5 text-xs" />
              <a
                href={createdOrder.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-forest-600 hover:bg-forest-700 text-white rounded-lg transition"
                title="Preview Payment Page"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1">
              WhatsApp Message Preview
            </label>
            <div className="p-3 bg-stone-50 rounded-xl border border-reseller-border/70 font-mono text-[11px] whitespace-pre-wrap text-reseller-text leading-relaxed">
              {createdOrder.whatsappText}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <WhatsAppButton
              url={createdOrder.whatsappUrl}
              label="Send Link on WhatsApp"
              className="flex-1 py-2.5 text-xs"
            />
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary py-2.5 text-xs"
            >
              Create Another
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <div className="card-frame p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Name with Autocomplete */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider" htmlFor="customerName">
                  Customer Name
                </label>
                <span className="text-[10px] text-forest-700 font-medium">Type name to auto-fill details</span>
              </div>
              <CustomerAutocompleteInput
                value={formData.customerName}
                onChange={(val) => setFormData((prev) => ({ ...prev, customerName: val }))}
                onSelectCustomer={handleSelectCustomer}
                placeholder="Type customer name to search existing or enter new..."
              />
            </div>

            {/* Mobile & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="customerPhone">
                  Customer Mobile Number *
                </label>
                <InputField
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  required
                  icon={Phone}
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="amount">
                  Amount (₹) *
                </label>
                <InputField
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 1499"
                  className="font-mono"
                />
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="item">
                Item / Order Description (Optional)
              </label>
              <InputField
                id="item"
                name="item"
                icon={Tag}
                value={formData.item}
                onChange={handleChange}
                placeholder="e.g. Banarasi Soft Silk Saree"
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="formattedAddress">
                Delivery Address *
              </label>
              <textarea
                id="formattedAddress"
                name="formattedAddress"
                required
                rows={3}
                value={formData.formattedAddress}
                onChange={handleAddressChange}
                placeholder="Paste customer's delivery address here (phone numbers detected automatically)"
                className="input-field text-xs leading-relaxed"
              />

              {extractedPhones.length > 0 && (
                <div className="mt-2 p-2 bg-stone-50 rounded-lg border border-reseller-border/70 flex items-center gap-2 flex-wrap text-xs">
                  <Sparkles className="w-3 h-3 text-forest-600 shrink-0" />
                  <span className="text-[11px] font-semibold text-forest-800">Detected in address:</span>
                  {extractedPhones.map((ph) => (
                    <button
                      key={ph}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, customerPhone: ph }))}
                      className={`px-2 py-0.5 rounded text-xs font-mono transition ${
                        formData.customerPhone === ph
                          ? 'bg-forest-600 text-white'
                          : 'bg-white text-forest-800 border border-reseller-border hover:bg-stone-50'
                      }`}
                    >
                      {ph} {formData.customerPhone === ph && '✓'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Generate Payment Request Link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
