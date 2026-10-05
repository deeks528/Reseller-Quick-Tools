import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES } from 'shared/config/urls.js';
import { MapPin, CreditCard, Link2, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-5xl w-full mx-auto px-4 py-5 flex items-center justify-between border-b border-reseller-border/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-forest-500 text-white flex items-center justify-center font-bold text-sm shadow-subtle">
            <span className="font-display">R</span>
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-forest-800 tracking-tight leading-none">
              Reseller Tools
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-reseller-muted">
              --
            </span>
          </div>
        </div>
        <div>
          {user ? (
            <Link to={ROUTES.APP_DASHBOARD} className="btn-primary py-2 px-3.5 text-xs">
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link to={ROUTES.LOGIN} className="btn-primary py-2 px-4 text-xs">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-3xl w-full mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-100/80 text-forest-700 text-xs font-semibold tracking-tight mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500"></span>
          <span>Purpose-built for Saree &amp; 1g Jewellery Resellers</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-forest-900 tracking-tight leading-[1.15]">
          Effortless orders, addresses &amp; UPI links.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-reseller-muted max-w-xl mx-auto leading-relaxed">
          Create WhatsApp-friendly payment requests, format customer postal addresses, and sync records with zero clutter.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={user ? ROUTES.APP_DASHBOARD : ROUTES.LOGIN} className="btn-primary px-6 py-2.5 text-sm">
            {user ? 'Open Dashboard' : 'Sign In to Store'}
            <ArrowRight className="w-4 h-4" />
          </Link>
          {!user && (
            <Link to={ROUTES.REGISTER} className="btn-secondary px-6 py-2.5 text-sm">
              Create New Store
            </Link>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 text-left">
          <div className="card-frame hover:border-forest-200 transition">
            <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center mb-3">
              <MapPin className="w-4 h-4 text-forest-600" />
            </div>
            <h3 className="font-display font-bold text-sm text-forest-900">Address Formatter</h3>
            <p className="mt-1.5 text-xs text-reseller-muted leading-relaxed">
              Share a clean address form. Automatically formats postal addresses and auto-fills from browser cache.
            </p>
          </div>

          <div className="card-frame hover:border-forest-200 transition">
            <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center mb-3">
              <CreditCard className="w-4 h-4 text-forest-600" />
            </div>
            <h3 className="font-display font-bold text-sm text-forest-900">Payment Link</h3>
            <p className="mt-1.5 text-xs text-reseller-muted leading-relaxed">
              Send requests with item details, formatted address, and a direct UPI pay button (<code className="text-[10px] bg-stone-100 px-1 py-0.5 rounded font-mono">upi://pay</code>).
            </p>
          </div>

          <div className="card-frame hover:border-forest-200 transition">
            <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center mb-3">
              <Link2 className="w-4 h-4 text-forest-600" />
            </div>
            <h3 className="font-display font-bold text-sm text-forest-900">Order Link</h3>
            <p className="mt-1.5 text-xs text-reseller-muted leading-relaxed">
              Enter only mobile, price, and item. Customer provides address before completing payment.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-xs text-reseller-muted border-t border-reseller-border/60">
        Reseller Tools
      </footer>
    </div>
  );
};
