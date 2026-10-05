import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { businessApi } from '../../api/client.js';
import { CopyButton } from '../../components/CopyButton.jsx';
import { buildPublicAddressUrl } from 'shared/config/urls.js';
import { InputField } from '../../components/InputField.jsx';
import {
  CheckCircle2,
  ExternalLink,
  Store,
  User,
  Phone,
  CreditCard,
  Hash
} from 'lucide-react';

export const ProfilePage = () => {
  const { business, updateBusinessState } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    mobileNumber: '',
    upiId: '',
    orderRetentionDays: 90,
    businessCode: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (business) {
      setFormData({
        businessName: business.businessName || '',
        ownerName: business.ownerName || '',
        mobileNumber: business.mobileNumber || '',
        upiId: business.upiId || '',
        orderRetentionDays: business.orderRetentionDays || 90,
        businessCode: business.businessCode || ''
      });
    }
  }, [business]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await businessApi.updateProfile({
        ...formData,
        orderRetentionDays: Number(formData.orderRetentionDays)
      });
      if (res.success && res.data) {
        updateBusinessState(res.data);
        showToast('Business profile updated successfully ✓', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update business profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const publicAddressUrl = formData.businessCode ? buildPublicAddressUrl(formData.businessCode) : '';

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-reseller-muted">Settings</span>
        <h1 className="font-display text-2xl font-bold text-forest-900 tracking-tight mt-0.5">Business Profile</h1>
        <p className="text-xs text-reseller-muted mt-0.5">
          Configure your store identity, receiving UPI payment handle, and order retention period.
        </p>
      </div>

      {/* Shareable Public Address Link Card */}
      <div className="card-frame p-5 bg-forest-600 text-white">
        <div className="flex items-center justify-between pb-2.5 border-b border-forest-500/60">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-forest-200 font-bold">Public Address Formatter URL</div>
            <p className="text-[11px] text-forest-100 mt-0.5">Share with customers to collect formatted addresses</p>
          </div>
          <span className="text-[11px] bg-forest-700/90 text-white px-2.5 py-0.5 rounded font-mono">
            {formData.businessCode}
          </span>
        </div>

        <div className="mt-3.5 flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            readOnly
            value={publicAddressUrl}
            className="w-full bg-forest-700/60 border border-forest-500/70 text-xs text-white rounded-xl px-3 py-2 font-mono select-all focus:outline-none"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <CopyButton text={publicAddressUrl} label="Copy" className="flex-1 sm:flex-none text-xs py-1.5" />
            <a
              href={publicAddressUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-forest-700 hover:bg-forest-800 rounded-lg text-white transition shrink-0"
              title="Preview address page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="card-frame p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="businessName">
                Business Name *
              </label>
              <InputField
                id="businessName"
                name="businessName"
                required
                icon={Store}
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Royal Silk & Jewellery"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="ownerName">
                Owner Name *
              </label>
              <InputField
                id="ownerName"
                name="ownerName"
                required
                icon={User}
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="mobileNumber">
                Mobile Number *
              </label>
              <InputField
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                required
                icon={Phone}
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="upiId">
                Receiving UPI ID *
              </label>
              <InputField
                id="upiId"
                name="upiId"
                required
                icon={CreditCard}
                value={formData.upiId}
                onChange={handleChange}
                placeholder="e.g. dealer@upi"
                className="font-mono"
              />
              <p className="text-[10px] text-reseller-muted mt-1">UPI payments are directed to this ID.</p>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="orderRetentionDays">
              Order Auto Delete Duration (Retention Days)
            </label>
            <select
              id="orderRetentionDays"
              name="orderRetentionDays"
              value={formData.orderRetentionDays}
              onChange={handleChange}
              className="input-field text-xs cursor-pointer"
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days (Default)</option>
            </select>
            <p className="text-[10px] text-reseller-muted mt-1">
              Orders past this duration are automatically expired and excluded from active views.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="businessCode">
              Unique Business Code
            </label>
            <InputField
              id="businessCode"
              name="businessCode"
              icon={Hash}
              value={formData.businessCode}
              onChange={handleChange}
              placeholder="e.g. royal-boutique"
              className="font-mono"
            />
            <p className="text-[10px] text-reseller-muted mt-1">Used in public address URLs.</p>
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
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
