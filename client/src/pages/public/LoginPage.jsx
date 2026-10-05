import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { InputField } from '../../components/InputField.jsx';
import { ROUTES } from 'shared/config/urls.js';
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || ROUTES.APP_DASHBOARD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      showToast(`Welcome back, ${res.data.business?.ownerName || 'Dealer'}!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('dealer@resellertools.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf9f6]">
      <div className="w-full max-w-sm">
        {/* Brand header */}
        <div className="text-center mb-6">
          {/* <div className="w-10 h-10 rounded-xl bg-forest-500 text-white mx-auto flex items-center justify-center shadow-subtle mb-3">
            <span className="font-display font-bold text-base">R</span>
          </div> */}
          <h1 className="font-display text-2xl font-bold text-forest-900 tracking-tight">Reseller Portal</h1>
          <p className="text-xs text-reseller-muted mt-1">Sign in to your reseller dashboard</p>
        </div>

        {/* Card */}
        <div className="card-frame p-6">
          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="email">
                Email
              </label>
              <InputField
                id="email"
                type="email"
                required
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dealer@resellertools.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-reseller-muted uppercase tracking-wider mb-1" htmlFor="password">
                Password
              </label>
              <InputField
                id="password"
                type="password"
                required
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
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
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Demo helper */}
          <div className="mt-5 pt-4 border-t border-reseller-border/80 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-forest-700 hover:text-forest-900 bg-forest-50/70 hover:bg-forest-100/60 px-2.5 py-1.5 rounded-lg border border-forest-100 transition"
            >
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Fill Demo Credentials</span>
            </button>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-xs text-reseller-muted mt-5">
          New reseller?{' '}
          <Link to={ROUTES.REGISTER} className="font-semibold text-forest-700 hover:text-forest-900 underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
