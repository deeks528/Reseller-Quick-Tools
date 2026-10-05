import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from 'shared/config/urls.js';
import {
  Layers,
  Users,
  User,
  LogOut,
  MapPin,
  CreditCard,
  Link2,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { business, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const isActive = (path) => location.pathname === path;
  const isModuleActive = location.pathname.startsWith('/app/modules');
  const businessDisplayName = business?.businessName || 'Reseller Portal';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-reseller-border/80 p-2">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-15">
          {/* Brand */}
          <Link
            to={ROUTES.APP_DASHBOARD}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-forest-500 text-white flex items-center justify-center font-bold text-sm shadow-subtle group-hover:bg-forest-600 transition">
              <span className="font-display">{businessDisplayName[0]}</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-forest-800 tracking-tight leading-none">
                {businessDisplayName}
              </h1>
              {/* <span className="text-[10px] uppercase tracking-wider font-semibold text-reseller-muted">
                Reseller Tools
              </span> */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to={ROUTES.APP_DASHBOARD}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${isActive(ROUTES.APP_DASHBOARD)
                ? 'bg-forest-50 text-forest-700'
                : 'text-reseller-muted hover:text-reseller-text hover:bg-stone-50'
                }`}
            >
              Dashboard
            </Link>

            {/* Modules Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setModulesOpen(!modulesOpen)}
                onBlur={() => setTimeout(() => setModulesOpen(false), 200)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${isModuleActive
                  ? 'bg-forest-50 text-forest-700'
                  : 'text-reseller-muted hover:text-reseller-text hover:bg-stone-50'
                  }`}
              >
                <Layers className="w-3.5 h-3.5 text-forest-600" />
                <span>Modules</span>
                <ChevronDown className={`w-3 h-3 text-reseller-muted transition-transform ${modulesOpen ? 'rotate-180' : ''}`} />
              </button>

              {modulesOpen && (
                <div className="absolute left-0 mt-1.5 w-56 bg-white border border-reseller-border rounded-xl shadow-float py-1.5 z-50 animate-fadeIn">
                  <Link
                    to={ROUTES.MODULE_ADDRESS_FORMATTER}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-reseller-text hover:bg-stone-50 transition"
                  >
                    <MapPin className="w-3.5 h-3.5 text-forest-500" />
                    <div>
                      <div className="font-semibold">Address Formatter</div>
                      <div className="text-[10px] text-reseller-muted">Public address tool</div>
                    </div>
                  </Link>

                  <Link
                    to={ROUTES.MODULE_PAYMENT_LINK}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-reseller-text hover:bg-stone-50 transition"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-forest-500" />
                    <div>
                      <div className="font-semibold">Payment Link</div>
                      <div className="text-[10px] text-reseller-muted">Request with delivery address</div>
                    </div>
                  </Link>

                  <Link
                    to={ROUTES.MODULE_ORDER_LINK}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-reseller-text hover:bg-stone-50 transition"
                  >
                    <Link2 className="w-3.5 h-3.5 text-forest-500" />
                    <div>
                      <div className="font-semibold">Order Link</div>
                      <div className="text-[10px] text-reseller-muted">Fast 1-click reseller link</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to={ROUTES.APP_CUSTOMERS}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${isActive(ROUTES.APP_CUSTOMERS)
                ? 'bg-forest-50 text-forest-700'
                : 'text-reseller-muted hover:text-reseller-text hover:bg-stone-50'
                }`}
            >
              <Users className="w-3.5 h-3.5 text-forest-600" />
              <span>Customers</span>
            </Link>

            <Link
              to={ROUTES.APP_PROFILE}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${isActive(ROUTES.APP_PROFILE)
                ? 'bg-forest-50 text-forest-700'
                : 'text-reseller-muted hover:text-reseller-text hover:bg-stone-50'
                }`}
            >
              <User className="w-3.5 h-3.5 text-forest-600" />
              <span>Profile</span>
            </Link>
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-forest-900 leading-tight">{business?.ownerName || user?.name}</div>
              <div className="text-[10px] text-reseller-muted font-mono">{business?.mobileNumber}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-reseller-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-forest-800 hover:bg-stone-100 transition"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-reseller-border bg-white px-4 py-3 space-y-1.5 animate-fadeIn">
          <div className="pb-2.5 mb-2 border-b border-reseller-border flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-forest-800">{businessDisplayName}</div>
              <div className="text-[11px] text-reseller-muted">{business?.ownerName}</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-lg"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>

          <Link
            to={ROUTES.APP_DASHBOARD}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-reseller-text hover:bg-stone-50"
          >
            Dashboard
          </Link>

          <div className="px-2.5 pt-1.5 text-[10px] font-bold text-reseller-muted uppercase tracking-wider">Modules</div>

          <Link
            to={ROUTES.MODULE_ADDRESS_FORMATTER}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-reseller-text hover:bg-stone-50"
          >
            <MapPin className="w-3.5 h-3.5 text-forest-500" />
            <span>Address Formatter</span>
          </Link>

          <Link
            to={ROUTES.MODULE_PAYMENT_LINK}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-reseller-text hover:bg-stone-50"
          >
            <CreditCard className="w-3.5 h-3.5 text-forest-500" />
            <span>Payment Link</span>
          </Link>

          <Link
            to={ROUTES.MODULE_ORDER_LINK}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-reseller-text hover:bg-stone-50"
          >
            <Link2 className="w-3.5 h-3.5 text-forest-500" />
            <span>Order Link</span>
          </Link>

          <div className="border-t border-reseller-border my-1.5"></div>

          <Link
            to={ROUTES.APP_CUSTOMERS}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-reseller-text hover:bg-stone-50"
          >
            <Users className="w-3.5 h-3.5 text-forest-500" />
            <span>Customers &amp; Orders</span>
          </Link>

          <Link
            to={ROUTES.APP_PROFILE}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-reseller-text hover:bg-stone-50"
          >
            <User className="w-3.5 h-3.5 text-forest-500" />
            <span>Business Profile</span>
          </Link>
        </div>
      )}
    </header>
  );
};
