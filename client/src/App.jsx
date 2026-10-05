import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Layout } from './components/Layout.jsx';

import { LandingPage } from './pages/public/LandingPage.jsx';
import { LoginPage } from './pages/public/LoginPage.jsx';
import { RegisterPage } from './pages/public/RegisterPage.jsx';
import { PublicAddressFormatter } from './pages/public/PublicAddressFormatter.jsx';
import { PublicOrderPay } from './pages/public/PublicOrderPay.jsx';

import { DashboardPage } from './pages/app/DashboardPage.jsx';
import { ProfilePage } from './pages/app/ProfilePage.jsx';
import { CustomersListPage } from './pages/app/CustomersListPage.jsx';
import { CustomerDetailPage } from './pages/app/CustomerDetailPage.jsx';
import { AddressFormatterModule } from './pages/app/AddressFormatterModule.jsx';
import { PaymentLinkModule } from './pages/app/PaymentLinkModule.jsx';
import { OrderLinkModule } from './pages/app/OrderLinkModule.jsx';

import { ROUTES } from 'shared/config/urls.js';

export const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path="/address/:businessCode" element={<PublicAddressFormatter />} />
            <Route path="/order/:orderToken" element={<PublicOrderPay />} />

            {/* Authenticated Dealer Protected Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="customers" element={<CustomersListPage />} />
              <Route path="customers/:customerId" element={<CustomerDetailPage />} />
              <Route path="modules/address-formatter" element={<AddressFormatterModule />} />
              <Route path="modules/payment-link" element={<PaymentLinkModule />} />
              <Route path="modules/order-link" element={<OrderLinkModule />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
