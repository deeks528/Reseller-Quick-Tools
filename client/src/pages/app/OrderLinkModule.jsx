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
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Phone,
  Tag
} from 'lucide-react';

export const OrderLinkModule = () => {
  const { business } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    customerPhone: '',
    amount: '',
    item: '',
    customerName: ''
  });

  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Called when dealer selects a customer from autocomplete suggestions
  const handleSelectCustomer = (customer) => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customerName: customer.name || prev.customerName,
        customerPhone: (customer.phone || '').replace(/^91/, '')
      }));
      showToast(`Auto-filled details for ${customer.name || 'customer'} ✓`, 'success');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await orderApi.createOrder({
        customerPhone: formData.customerPhone,
        amount: Number(formData.amount),
        item: formData.item,
        customerName: formData.customerName
      });

      if (res.success && res.data) {
        setCreatedOrder(res.data);
        showToast('Order link created successfully ✓', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to create order link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCreatedOrder(null);
    setFormData({
      customerPhone: '',
      amount: '',
      item: '',
      customerName: ''
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-reseller-muted">Primary Workflow</span>
        <h1 className="font-display text-2xl font-bold text-forest-900 tracking-tight mt-0.5">Order Link</h1>
        <p className="text-xs text-reseller-muted mt-0.5">
          Enter mobile, amount, and item. Customer enters their address and pays via UPI.
        </p>
      </div>

      {createdOrder ? (
        <div className="card-frame p-6 border-forest-500/30 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-forest-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-forest-900">Order Link Ready</h3>
              <p className="text-[11px] text-reseller-muted font-mono">Ref: #{createdOrder.order.orderToken}</p>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-reseller-border/70 space-y-2">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200/60">
              <span className="text-reseller-muted">Item: <strong className="text-forest-900">{createdOrder.order.item}</strong></span>
              <span className="text-reseller-muted">Price: <strong className="text-forest-800 font-mono font-bold">₹{createdOrder.order.amount}</strong></span>
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
                title="Preview Customer View"
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
              label="Send Order on WhatsApp"
              className="flex-1 py-2.5 text-xs bg-forest-600 hover:bg-forest-700 text-white"
            />
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary py-2.5 text-xs"
            >
              Create Another Order
            </button>
          </div>
        </div>
      ) : (
        <div className="card-frame p-6">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Customer Name with Live Autocomplete and Auto-fill */}
            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="customerName">
                Customer Name (Type to auto-fill existing details)
              </label>
              <CustomerAutocompleteInput
                value={formData.customerName}
                onChange={(name) => setFormData((prev) => ({ ...prev, customerName: name }))}
                onSelectCustomer={handleSelectCustomer}
                placeholder="e.g. Lakshmi Devi"
              />
            </div>

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
                placeholder="e.g. 9876543210"
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  placeholder="e.g. 499"
                  className="font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="item">
                  Item Description *
                </label>
                <InputField
                  id="item"
                  name="item"
                  required
                  icon={Tag}
                  value={formData.item}
                  onChange={handleChange}
                  placeholder="e.g. Kanchi Silk Saree"
                />
              </div>
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
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Create &amp; Send Link</span>
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
