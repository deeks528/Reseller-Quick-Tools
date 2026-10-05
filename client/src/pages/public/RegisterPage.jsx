import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ROUTES } from 'shared/config/urls.js';
import { InputField } from '../../components/InputField.jsx';
import { Store, User, Mail, Lock, Phone, CreditCard, ArrowRight, Clock } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    mobileNumber: '',
    upiId: '',
    orderRetentionDays: 90
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(formData);
      showToast(`Welcome to Reseller Tools, ${res.data.business.businessName}!`, 'success');
      navigate(ROUTES.APP_DASHBOARD);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center bg-[#faf9f6]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          {/* <div className="w-10 h-10 rounded-xl bg-forest-500 text-white mx-auto flex items-center justify-center shadow-subtle mb-3">
            <span className="font-display font-bold text-base">R</span>
          </div> */}
          <h1 className="font-display text-2xl font-bold text-forest-900 tracking-tight">Create Business Store</h1>
          <p className="text-xs text-reseller-muted mt-1">Configure your business profile and UPI handle</p>
        </div>

        {/* Card */}
        <div className="card-frame p-6">
          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  placeholder="e.g. Royal Silk Boutique"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="name">
                  Owner Name *
                </label>
                <InputField
                  id="name"
                  name="name"
                  required
                  icon={User}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  placeholder="10-digit number"
                  className="font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="upiId">
                  UPI ID *
                </label>
                <InputField
                  id="upiId"
                  name="upiId"
                  required
                  icon={CreditCard}
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="e.g. mobile@upi"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="email">
                  Email *
                </label>
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  required
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="dealer@resellertools.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="password">
                  Password *
                </label>
                <InputField
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="orderRetentionDays">
                Order Retention (Auto Delete)
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-2 text-xs"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-reseller-muted mt-5">
          Already registered?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-forest-700 hover:text-forest-900 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
