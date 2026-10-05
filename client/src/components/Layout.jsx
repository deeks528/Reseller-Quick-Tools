import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const Layout = () => {
  const { business } = useAuth();
  const businessDisplayName = business?.businessName || 'Reseller Portal';

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="py-5 border-t border-reseller-border/60 text-center text-xs text-reseller-muted">
        <p className="tracking-tight">
          <span className="font-semibold text-forest-800">{businessDisplayName}</span> • Reseller Tools
        </p>
      </footer>
    </div>
  );
};
