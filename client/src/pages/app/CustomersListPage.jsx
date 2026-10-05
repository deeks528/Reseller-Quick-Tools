import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerApi, orderApi } from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { CopyButton } from '../../components/CopyButton.jsx';
import { WhatsAppButton } from '../../components/WhatsAppButton.jsx';
import { InputField } from '../../components/InputField.jsx';
import { ROUTES } from 'shared/config/urls.js';
import { PAYMENT } from 'shared/config/payment.js';
import { MESSAGES } from 'shared/config/messages.js';
import {
  Search,
  Trash2,
  ExternalLink,
  Clock,
  Sparkles,
  Phone
} from 'lucide-react';

export const CustomersListPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('orders');

  const loadData = async () => {
    try {
      const [orderRes, custRes] = await Promise.all([
        orderApi.getOrders(),
        customerApi.getCustomers()
      ]);
      if (orderRes.success && orderRes.data) {
        setOrders(orderRes.data);
      }
      if (custRes.success && custRes.data) {
        setCustomers(custRes.data);
      }
    } catch (err) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await orderApi.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      showToast('Order deleted successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete order', 'error');
    }
  };

  const getDaysLeft = (expiresAt) => {
    if (!expiresAt) return '—';
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d` : 'Expired';
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerPhone || '').includes(q) ||
      (o.item || '').toLowerCase().includes(q) ||
      (o.orderToken || '').toLowerCase().includes(q)
    );
  });

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.defaultAddress?.city || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-reseller-muted">Directory</span>
          <h1 className="font-display text-2xl font-bold text-forest-900 tracking-tight mt-0.5">Customers &amp; Orders</h1>
          <p className="text-xs text-reseller-muted mt-0.5">
            Manage your customer database, active order requests, and saved addresses.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-stone-100 p-1 rounded-xl border border-reseller-border/70 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'orders' ? 'bg-white text-forest-800 shadow-subtle' : 'text-reseller-muted hover:text-forest-900'
            }`}
          >
            Active Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'customers' ? 'bg-white text-forest-800 shadow-subtle' : 'text-reseller-muted hover:text-forest-900'
            }`}
          >
            Customers ({customers.length})
          </button>
        </div>
      </div>

      {/* Robust Search Input with InputField Component */}
      <InputField
        icon={Search}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by customer name, phone, item, or token..."
      />

      {/* Content View */}
      {loading ? (
        <div className="py-12 text-center text-xs text-reseller-muted">Loading customer records...</div>
      ) : activeTab === 'orders' ? (
        filteredOrders.length === 0 ? (
          <div className="card-frame py-10 text-center">
            <Sparkles className="w-6 h-6 text-gold mx-auto mb-1.5 opacity-60" />
            <p className="text-xs font-bold text-forest-800">No matching orders found</p>
            <p className="text-[11px] text-reseller-muted mt-0.5">Try another search term or create a new order link.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredOrders.map((order) => {
              const formattedAddr = order.address?.formattedAddress || '';
              const daysLeft = getDaysLeft(order.expiresAt);
              const addressWhatsAppMsg = formattedAddr
                ? MESSAGES.address({ formattedAddress: formattedAddr, customerPhone: order.customerPhone })
                : '';

              return (
                <div key={order._id} className="card-frame p-4.5 flex flex-col justify-between hover:border-forest-200 transition">
                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between pb-2.5 border-b border-reseller-border/70">
                      <div>
                        <h3 className="font-display font-bold text-sm text-forest-900">
                          {order.customerName || 'Customer'}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-reseller-muted font-mono mt-0.5">
                          <Phone className="w-3 h-3 text-reseller-muted" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-display font-bold text-base text-forest-800 font-mono">
                          {PAYMENT.formatCurrency(order.amount)}
                        </div>
                        <div className="text-[10px] text-reseller-muted font-mono">#{order.orderToken}</div>
                      </div>
                    </div>

                    {/* Middle details */}
                    <div className="py-2.5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-reseller-muted text-[11px]">Item:</span>
                        <span className="font-semibold text-forest-900">{order.item}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-reseller-muted text-[11px]">Address:</span>
                        <StatusBadge status={order.orderStatus} />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-reseller-muted text-[11px]">Payment:</span>
                        <StatusBadge status={order.paymentStatus} type="payment" />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-reseller-muted text-[11px]">Expires:</span>
                        <span className="font-semibold text-stone-600 flex items-center gap-1 text-[11px] font-mono">
                          <Clock className="w-3 h-3" />
                          {daysLeft}
                        </span>
                      </div>

                      {formattedAddr && (
                        <div className="mt-2 p-2 bg-stone-50 rounded-lg border border-reseller-border/60 text-[11px] font-mono text-reseller-text whitespace-pre-wrap max-h-20 overflow-y-auto leading-relaxed">
                          {formattedAddr}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2.5 border-t border-reseller-border/70 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {formattedAddr ? (
                        <WhatsAppButton
                          phone={order.customerPhone}
                          message={addressWhatsAppMsg}
                          label="Send Address"
                          className="py-1 px-2.5 text-xs"
                        />
                      ) : (
                        <WhatsAppButton
                          url={order.whatsappUrl}
                          label="Send Link"
                          className="py-1 px-2.5 text-xs"
                        />
                      )}

                      {formattedAddr && (
                        <CopyButton text={formattedAddr} label="Copy" className="py-1 px-2.5 text-xs" />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteOrder(order._id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Customers List */
        <div className="card-frame p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-reseller-border/70 text-reseller-muted text-[10px] uppercase tracking-wider bg-stone-50/50">
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Orders</th>
                  <th className="py-2.5 px-3">Default Address</th>
                  <th className="py-2.5 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-reseller-border/60">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-stone-50/50 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-forest-900">{customer.name || 'Unnamed Customer'}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-reseller-muted">
                      {customer.phone}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-forest-800">{customer.orderCount} orders</span>
                    </td>
                    <td className="py-3 px-3">
                      {customer.defaultAddress?.city ? (
                        <span className="text-[11px] text-reseller-text">
                          {customer.defaultAddress.city}, {customer.defaultAddress.state}
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">None saved</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={ROUTES.APP_CUSTOMER_DETAIL(customer._id)}
                        className="btn-secondary py-1 px-2.5 text-xs inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
