import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerApi, orderApi } from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { CopyButton } from '../../components/CopyButton.jsx';
import { WhatsAppButton } from '../../components/WhatsAppButton.jsx';
import { ROUTES } from 'shared/config/urls.js';
import { PAYMENT } from 'shared/config/payment.js';
import {
  User,
  Phone,
  MapPin,
  ArrowLeft,
  ShoppingBag,
  Trash2
} from 'lucide-react';

export const CustomerDetailPage = () => {
  const { customerId } = useParams();
  const { showToast } = useToast();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async () => {
    try {
      const res = await customerApi.getCustomerById(customerId);
      if (res.success && res.data) {
        setCustomer(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load customer profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await orderApi.deleteOrder(orderId);
      setCustomer((prev) => ({
        ...prev,
        orders: prev.orders.filter((o) => o._id !== orderId)
      }));
      showToast('Order deleted', 'success');
    } catch (err) {
      showToast('Failed to delete order', 'error');
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-reseller-muted">Loading customer details...</div>;
  }

  if (!customer) {
    return (
      <div className="card-frame py-10 text-center">
        <p className="font-bold text-xs text-forest-800">Customer not found</p>
        <Link to={ROUTES.APP_CUSTOMERS} className="btn-secondary inline-flex py-1.5 px-3 text-xs mt-3">
          Back to Customers
        </Link>
      </div>
    );
  }

  const defaultAddr = customer.defaultAddress?.formattedAddress || '';

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back button */}
      <div>
        <Link
          to={ROUTES.APP_CUSTOMERS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-reseller-muted hover:text-forest-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customers</span>
        </Link>
      </div>

      {/* Customer Header Card */}
      <div className="card-frame p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-reseller-border/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5 text-forest-600" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-forest-900">{customer.name || 'Unnamed Customer'}</h1>
              <div className="flex items-center gap-1.5 text-xs text-reseller-muted font-mono mt-0.5">
                <Phone className="w-3 h-3 text-reseller-muted" />
                <span>{customer.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <WhatsAppButton
              phone={customer.phone}
              message={`Hello ${customer.name || ''}!`}
              label="Chat on WhatsApp"
              className="py-1.5 px-3 text-xs"
            />
          </div>
        </div>

        {/* Default Shipping Address */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-forest-600" />
              <span>Saved Default Address</span>
            </span>
            {defaultAddr && <CopyButton text={defaultAddr} label="Copy" className="py-1 px-2 text-[11px]" />}
          </div>

          {defaultAddr ? (
            <div className="p-3 bg-stone-50 rounded-xl border border-reseller-border/70 font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {defaultAddr}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No saved delivery address on file yet.</p>
          )}
        </div>
      </div>

      {/* Order History */}
      <div className="card-frame p-5">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-reseller-border/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-forest-600" />
            <h2 className="font-display font-bold text-sm text-forest-900">Order History ({customer.orders?.length || 0})</h2>
          </div>
        </div>

        {customer.orders?.length === 0 ? (
          <p className="text-xs text-reseller-muted text-center py-5">No orders found for this customer.</p>
        ) : (
          <div className="space-y-2.5">
            {customer.orders.map((order) => (
              <div key={order._id} className="p-3 rounded-xl border border-reseller-border/70 hover:bg-stone-50/50 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <div>
                  <div className="font-semibold text-xs text-forest-900">{order.item}</div>
                  <div className="text-[11px] text-reseller-muted font-mono mt-0.5">
                    Ref: #{order.orderToken} • {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={order.orderStatus} />
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-reseller-border/40">
                  <div className="font-display text-sm font-bold text-forest-800 font-mono">
                    {PAYMENT.formatCurrency(order.amount)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteOrder(order._id)}
                    className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Order"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
