import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { publicApi } from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PAYMENT } from 'shared/config/payment.js';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  MapPin,
  Clock
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'deliveryAddress';

export const PublicOrderPay = () => {
  const { orderToken } = useParams();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [paymentTriggered, setPaymentTriggered] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await publicApi.getPublicOrder(orderToken);
        if (res.success && res.data) {
          setOrder(res.data);
          if (res.data.customerPhone) {
            setAddressForm((prev) => ({
              ...prev,
              phone: res.data.customerPhone.replace(/^91/, ''),
              fullName: res.data.customerName || prev.fullName
            }));
          }
        } else {
          setNotFound(true);
        }
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderToken]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setAddressForm((prev) => ({
          ...prev,
          fullName: prev.fullName || parsed.fullName || '',
          phone: prev.phone || parsed.phone || '',
          address1: parsed.address1 || '',
          address2: parsed.address2 || '',
          landmark: parsed.landmark || '',
          city: parsed.city || '',
          state: parsed.state || '',
          pincode: parsed.pincode || ''
        }));
      }
    } catch (e) {
      console.warn('Failed to load cached address:', e);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSubmittingAddress(true);

    try {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(addressForm));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }

      const res = await publicApi.savePublicAddress(orderToken, addressForm);
      if (res.success && res.data) {
        setOrder(res.data);
        showToast('Delivery address saved successfully ✓', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save delivery address', 'error');
    } finally {
      setSubmittingAddress(false);
    }
  };

  const handlePayClick = async () => {
    try {
      await publicApi.initiatePayment(orderToken);
      setPaymentTriggered(true);
    } catch (err) {
      console.warn('Initiate payment log error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="w-7 h-7 border-2 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf9f6] text-center">
        <div className="card-frame max-w-sm w-full">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h2 className="font-display text-xl font-bold text-forest-900">Order Not Found</h2>
          <p className="text-xs text-reseller-muted mt-1.5">
            This order link is invalid, expired, or no longer available.
          </p>
        </div>
      </div>
    );
  }

  const isExpired = order.isExpired || order.orderStatus === 'expired';
  const hasSavedAddress = order.address && (order.orderStatus === 'ready_for_payment' || order.orderStatus === 'payment_initiated' || order.orderStatus === 'completed');
  const formattedAmount = PAYMENT.formatCurrency(order.amount);

  return (
    <div className="min-h-screen py-8 px-4 bg-[#faf9f6]">
      <div className="max-w-lg mx-auto">
        {/* Merchant Brand Header */}
        <div className="text-center mb-5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-reseller-muted">{order.businessName}</span>
          <h1 className="font-display text-2xl font-bold text-forest-900 tracking-tight mt-0.5">Order Checkout</h1>
        </div>

        {/* Expired state notice */}
        {isExpired && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-xs">Order Expired</div>
              <p className="text-xs mt-0.5 text-rose-700">
                This order request has passed its retention duration. Please ask {order.businessName} for a new payment link.
              </p>
            </div>
          </div>
        )}

        {/* Order Summary Card */}
        <div className="bg-forest-600 text-white rounded-20 p-5 shadow-card mb-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-forest-500/50">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-forest-200 font-semibold">Item</span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">{order.item}</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-forest-200 font-semibold">Total</span>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-white">{formattedAmount}</div>
            </div>
          </div>

          <div className="pt-2.5 flex items-center justify-between text-[11px] text-forest-200 font-mono">
            <span>Ref: #{order.orderToken}</span>
            <span>Payee: {order.businessName}</span>
          </div>
        </div>

        {/* STEP 1: Address Form */}
        {!isExpired && !hasSavedAddress && (
          <div className="card-frame p-6 animate-fadeIn space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-reseller-border">
              <MapPin className="w-4 h-4 text-forest-600" />
              <div>
                <h3 className="font-display font-bold text-sm text-forest-900">Delivery Address</h3>
                <p className="text-xs text-reseller-muted">Please provide your delivery details before proceeding to pay.</p>
              </div>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="fullName">
                  Recipient Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  required
                  value={addressForm.fullName}
                  onChange={handleInputChange}
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
                  value={addressForm.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit phone number"
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
                  value={addressForm.address1}
                  onChange={handleInputChange}
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
                  value={addressForm.address2}
                  onChange={handleInputChange}
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
                  value={addressForm.landmark}
                  onChange={handleInputChange}
                  placeholder="e.g. Near City Park"
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
                    value={addressForm.city}
                    onChange={handleInputChange}
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
                    value={addressForm.state}
                    onChange={handleInputChange}
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
                    value={addressForm.pincode}
                    onChange={handleInputChange}
                    placeholder="500081"
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingAddress}
                className="btn-primary w-full py-2.5 mt-2 text-xs"
              >
                {submittingAddress ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Save Address &amp; Proceed to Pay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Payment View */}
        {!isExpired && hasSavedAddress && (
          <div className="card-frame p-6 animate-fadeIn space-y-5">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-reseller-border">
                <div className="flex items-center gap-1.5 text-forest-800 font-bold text-xs">
                  <MapPin className="w-3.5 h-3.5 text-forest-600" />
                  <span>Delivery Address</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOrder({ ...order, address: null, orderStatus: 'awaiting_address' })}
                  className="text-xs text-forest-600 hover:text-forest-800 underline font-medium"
                >
                  Edit
                </button>
              </div>

              <div className="mt-2.5 p-3 bg-stone-50 rounded-xl border border-reseller-border/70 text-xs font-mono text-reseller-text whitespace-pre-wrap leading-relaxed">
                {order.address.formattedAddress || 'Address saved'}
              </div>
            </div>

            <div className="pt-2 text-center">
              <a
                href={order.upiUrl}
                onClick={handlePayClick}
                className="btn-primary w-full py-3 text-sm font-bold shadow-card bg-forest-600 hover:bg-forest-700"
              >
                <CreditCard className="w-4 h-4 text-emerald-200" />
                <span>Pay {formattedAmount} via UPI</span>
              </a>

              <p className="mt-2.5 text-[11px] text-reseller-muted leading-relaxed">
                Opens Google Pay, PhonePe, Paytm, BHIM with amount and payee pre-filled.
              </p>
            </div>

            {paymentTriggered && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 text-xs leading-relaxed animate-fadeIn">
                <div className="font-semibold flex items-center gap-1.5 mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>UPI Payment App Opened</span>
                </div>
                Complete the payment in your UPI app, then take a screenshot of the receipt and share it with <strong>{order.businessName}</strong>.
              </div>
            )}
          </div>
        )}

        <footer className="text-center text-[11px] text-reseller-muted mt-6">
          Reseller Tools
        </footer>
      </div>
    </div>
  );
};
