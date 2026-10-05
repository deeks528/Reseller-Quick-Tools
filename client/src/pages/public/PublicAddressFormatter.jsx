import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { publicApi } from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';
import { CopyButton } from '../../components/CopyButton.jsx';
import { WhatsAppButton } from '../../components/WhatsAppButton.jsx';
import { MESSAGES } from 'shared/config/messages.js';
import { RotateCcw, CheckCircle2, MapPin } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'deliveryAddress';

export const PublicAddressFormatter = () => {
  const { businessCode } = useParams();
  const { showToast } = useToast();

  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [formattedAddress, setFormattedAddress] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await publicApi.getPublicAddressFormatter(businessCode);
        if (res.success && res.data) {
          setBusinessInfo(res.data);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [businessCode]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setFormData((prev) => ({
          ...prev,
          fullName: parsed.fullName || '',
          phone: parsed.phone || '',
          address1: parsed.address1 || '',
          address2: parsed.address2 || '',
          landmark: parsed.landmark || '',
          city: parsed.city || '',
          state: parsed.state || '',
          pincode: parsed.pincode || ''
        }));
      }
    } catch (e) {
      console.warn('Failed to parse cached address:', e);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearCache = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setFormData({
      fullName: '',
      phone: '',
      address1: '',
      address2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: ''
    });
    setFormattedAddress('');
    setIsGenerated(false);
    showToast('Auto-fill address cache cleared', 'info');
  };

  const handleFormatAddress = (e) => {
    e.preventDefault();

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }

    const lines = [
      `To,`,
      formData.fullName.trim(),
      `H.No / Door: ${formData.address1.trim()}`,
      formData.address2?.trim(),
      formData.landmark ? `Near: ${formData.landmark.trim()}` : null,
      `${formData.city.trim()}, ${formData.state.trim()}`,
      `PIN: ${formData.pincode.trim()}`,
      `Ph: ${formData.phone.trim()}`
    ].filter(Boolean);

    const formatted = lines.join('\n');
    setFormattedAddress(formatted);
    setIsGenerated(true);
    showToast('Address formatted & saved to cache ✓', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="w-7 h-7 border-2 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf9f6] text-center">
        <div className="card-frame max-w-sm w-full">
          <h2 className="font-display text-xl font-bold text-forest-900">Link Not Found</h2>
          <p className="text-xs text-reseller-muted mt-1.5">
            This address formatter link is invalid or no longer active.
          </p>
        </div>
      </div>
    );
  }

  const businessName = businessInfo?.businessName || 'Reseller Store';
  const merchantPhone = businessInfo?.mobileNumber || '';
  const shareMessage = MESSAGES.address({
    formattedAddress,
    customerName: formData.fullName,
    customerPhone: formData.phone
  });

  return (
    <div className="min-h-screen py-8 px-4 bg-[#faf9f6]">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-wider font-bold text-reseller-muted">Delivery Address Formatter</span>
          <h1 className="font-display text-2xl font-bold text-forest-900 tracking-tight mt-0.5">{businessName}</h1>
          <p className="text-xs text-reseller-muted mt-1">
            Fill your delivery address below. It will be formatted into a clean postal address and cached in your browser.
          </p>
        </div>

        {/* Form Card */}
        <div className="card-frame p-6">
          <form onSubmit={handleFormatAddress} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="fullName">
                Full Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Lakshmi Devi"
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="phone">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="input-field text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="address1">
                House / Flat / Door Number *
              </label>
              <input
                id="address1"
                name="address1"
                required
                value={formData.address1}
                onChange={handleChange}
                placeholder="e.g. Flat 302, Green Residency"
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="address2">
                Street / Area / Colony
              </label>
              <input
                id="address2"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                placeholder="e.g. Temple Road, Madhapur"
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="landmark">
                Landmark (Optional)
              </label>
              <input
                id="landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="e.g. Near Ayyappa Temple"
                className="input-field text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="city">
                  City *
                </label>
                <input
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Hyderabad"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="state">
                  State *
                </label>
                <input
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Telangana"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="pincode">
                  PIN Code *
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="500081"
                  className="input-field text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button type="submit" className="btn-primary flex-1 py-2.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Format &amp; Save Address</span>
              </button>

              <button
                type="button"
                onClick={handleClearCache}
                className="btn-secondary py-2.5 text-xs"
                title="Clear cached address"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Auto-fill</span>
              </button>
            </div>
          </form>

          {/* Formatted Output */}
          {isGenerated && (
            <div className="mt-5 pt-5 border-t border-reseller-border animate-fadeIn space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800">Formatted Postal Address</span>
                <CopyButton text={formattedAddress} label="Copy Address" />
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-reseller-border/80 font-mono text-xs whitespace-pre-wrap text-reseller-text leading-relaxed">
                {formattedAddress}
              </div>

              <div className="pt-1">
                <WhatsAppButton
                  phone={merchantPhone}
                  message={shareMessage}
                  label={`Send Address to ${businessName}`}
                  className="w-full py-2.5 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-reseller-muted mt-5">
          Reseller Tools
        </p>
      </div>
    </div>
  );
};
