import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { orderApi } from '../../api/client.js';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { CopyButton } from '../../components/CopyButton.jsx';
import { WhatsAppButton } from '../../components/WhatsAppButton.jsx';
import { ROUTES, buildPublicAddressUrl } from 'shared/config/urls.js';
import { PAYMENT } from 'shared/config/payment.js';
import {
  MapPin,
  CreditCard,
  Link2,
  Users,
  User,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  Clock,
  Sparkles
} from 'lucide-react';

export const DashboardPage = () => {
  const { business } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const businessDisplayName = business?.businessName || 'Reseller Dashboard';
  const addressUrl = business?.businessCode ? buildPublicAddressUrl(business.businessCode) : '';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getOrders();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid' || o.orderStatus === 'completed')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'completed' && o.orderStatus !== 'expired').length;

  return (
    <div className="space-y-6">
      {/* Dealer Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-reseller-border/60">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight mt-0.5">
            {businessDisplayName}
          </h1>
          <p className="text-xs text-reseller-muted mt-0.5">
            Owner: <strong className="text-forest-800">{business?.ownerName}</strong>
            {/* • UPI:{' '}
            <code className="text-xs font-mono text-forest-800 bg-stone-100 px-1.5 py-0.5 rounded">
              {business?.upiId}
            </code> */}
          </p>
        </div>

        {/* <div className="flex items-center gap-2">
          <Link to={ROUTES.MODULE_ORDER_LINK} className="btn-primary py-2 px-3 text-xs">
            <Link2 className="w-3.5 h-3.5" />
            <span>New Order Link</span>
          </Link>
        </div> */}
      </div>

      {/* Quick Stats Grid */}
      <div className="hidden grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card-frame p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
            <PackageCheck className="w-5 h-5 text-forest-600" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-reseller-muted uppercase tracking-wider">Active Orders</div>
            <div className="font-display text-xl font-bold text-forest-900 mt-0.5">{activeOrdersCount}</div>
          </div>
        </div>

        <div className="card-frame p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-reseller-muted uppercase tracking-wider">Confirmed Revenue</div>
            <div className="font-display text-xl font-bold text-forest-900 mt-0.5">
              {PAYMENT.formatCurrency(totalRevenue)}
            </div>
          </div>
        </div>

        <div className="card-frame p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-stone-600" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-reseller-muted uppercase tracking-wider">Retention Duration</div>
            <div className="font-display text-xl font-bold text-forest-900 mt-0.5">
              {business?.orderRetentionDays || 90} Days
            </div>
          </div>
        </div>
      </div>

      {/* MODULES SECTION */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base font-bold text-forest-900 tracking-tight">Modules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Module 1: Address Formatter */}
          <div className="card-frame p-5 flex flex-col justify-between hover:border-forest-200 transition">
            <div>
              <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center mb-3">
                <MapPin className="w-4 h-4 text-forest-600" />
              </div>
              <h3 className="font-display font-bold text-sm text-forest-900">Address Formatter</h3>
              <p className="text-xs text-reseller-muted mt-1 leading-relaxed">
                Public address form for customers with auto-formatting and browser caching.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-reseller-border/70 flex items-center gap-2">
              <Link to={ROUTES.MODULE_ADDRESS_FORMATTER} className="btn-secondary flex-1 py-1.5 text-xs">
                <span>Open</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              {addressUrl && <CopyButton text={addressUrl} label="Link" />}
              <WhatsAppButton
                label="Send"
                className="py-1 text-xs"
              />
            </div>
          </div>

          {/* Module 2: Payment Link */}
          <div className="card-frame p-5 flex flex-col justify-between hover:border-forest-200 transition">
            <div>
              <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center mb-3">
                <CreditCard className="w-4 h-4 text-forest-600" />
              </div>
              <h3 className="font-display font-bold text-sm text-forest-900">Payment Link</h3>
              <p className="text-xs text-reseller-muted mt-1 leading-relaxed">
                Customized payment request with amount, customer phone picker, and address.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-reseller-border/70">
              <Link to={ROUTES.MODULE_PAYMENT_LINK} className="btn-secondary w-full py-1.5 text-xs">
                <span>Create Payment Link</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Module 3: Order Link (Primary Flow) */}
          <div className="card-frame p-5 flex flex-col justify-between border-forest-500/20 hover:border-forest-500/40 transition relative">
            <span className="absolute top-2.5 right-2.5 text-[9px] font-bold text-forest-700 bg-forest-50 border border-forest-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Fast Track
            </span>
            <div>
              <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center mb-3">
                <Link2 className="w-4 h-4 text-forest-600" />
              </div>
              <h3 className="font-display font-bold text-sm text-forest-900">Order Link</h3>
              <p className="text-xs text-reseller-muted mt-1 leading-relaxed">
                Enter phone, amount, and item. Customer fills address and completes UPI payment.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-reseller-border/70">
              <Link to={ROUTES.MODULE_ORDER_LINK} className="btn-primary w-full py-1.5 text-xs">
                <span>Create &amp; Send</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK LINKS: Customers & Profile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Link
          to={ROUTES.APP_CUSTOMERS}
          className="card-frame p-4.5 hover:border-forest-200 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Users className="w-4 h-4 text-forest-700" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs sm:text-sm text-forest-900 group-hover:text-forest-700">
                Customer Database &amp; Orders
              </h4>
              <p className="text-[11px] text-reseller-muted">Synced customer directory, address history, and order list</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-reseller-muted group-hover:text-forest-800 group-hover:translate-x-0.5 transition" />
        </Link>

        {/* <Link
          to={ROUTES.APP_PROFILE}
          className="card-frame p-4.5 hover:border-forest-200 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <User className="w-4 h-4 text-forest-700" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs sm:text-sm text-forest-900 group-hover:text-forest-700">
                Business Profile &amp; Settings
              </h4>
              <p className="text-[11px] text-reseller-muted">Store name, mobile, UPI ID, and order retention period</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-reseller-muted group-hover:text-forest-800 group-hover:translate-x-0.5 transition" />
        </Link> */}
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="card-frame p-5">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-reseller-border/70">
          <div>
            <h3 className="font-display font-bold text-sm text-forest-900">Recent Reseller Orders</h3>
            <p className="text-xs text-reseller-muted">Active requests and links</p>
          </div>
          <Link to={ROUTES.APP_CUSTOMERS} className="text-xs font-semibold text-forest-700 hover:underline">
            View All ({orders.length})
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-reseller-muted">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center">
            <Sparkles className="w-6 h-6 text-gold mx-auto mb-1.5 opacity-60" />
            <p className="text-xs font-semibold text-forest-800">No orders created yet</p>
            <p className="text-[11px] text-reseller-muted mt-0.5">Use the Order Link module to create your first order request.</p>
            <Link to={ROUTES.MODULE_ORDER_LINK} className="btn-primary inline-flex py-1.5 px-3 text-xs mt-3">
              Create Order
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-reseller-border/70 text-reseller-muted text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-2">Item / Customer</th>
                  <th className="py-2.5 px-2">Amount</th>
                  <th className="py-2.5 px-2">Address</th>
                  <th className="py-2.5 px-2">Payment</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-reseller-border/60">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-2">
                      <div className="font-semibold text-forest-900">{order.item}</div>
                      <div className="text-[11px] text-reseller-muted font-mono">
                        {order.customerName || 'Customer'} • {order.customerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-2 font-bold text-forest-800 font-mono">
                      {PAYMENT.formatCurrency(order.amount)}
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={order.paymentStatus} type="payment" />
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <CopyButton text={order.publicUrl} label="Link" />
                        <WhatsAppButton url={order.whatsappUrl} label="WhatsApp" className="py-1 px-2 text-[11px]" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
