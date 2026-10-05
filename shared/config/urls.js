/**
 * Centralized Application URLs and Routes Configuration
 * Ensures zero hardcoding of frontend routes, API endpoints, WhatsApp, and public links.
 */

// Determine the public app URL depending on environment (Client or Server)
export const getPublicAppUrl = () => {
  // Client Vite env
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PUBLIC_APP_URL) {
    return import.meta.env.VITE_PUBLIC_APP_URL.replace(/\/+$/, '');
  }
  // Server Node env
  if (typeof process !== 'undefined' && process.env && process.env.PUBLIC_APP_URL) {
    return process.env.PUBLIC_APP_URL.replace(/\/+$/, '');
  }
  // Browser window origin fallback
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return 'http://localhost:5173';
};

// Frontend Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  APP_DASHBOARD: '/app',
  APP_PROFILE: '/app/profile',
  APP_CUSTOMERS: '/app/customers',
  APP_CUSTOMER_DETAIL: (customerId = ':customerId') => `/app/customers/${customerId}`,
  MODULE_ADDRESS_FORMATTER: '/app/modules/address-formatter',
  MODULE_PAYMENT_LINK: '/app/modules/payment-link',
  MODULE_ORDER_LINK: '/app/modules/order-link',
  PUBLIC_ADDRESS: (businessCode = ':businessCode') => `/address/${businessCode}`,
  PUBLIC_ORDER: (orderToken = ':orderToken') => `/order/${orderToken}`
};

// Backend REST API Endpoints
export const API_ROUTES = {
  // Auth
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_ME: '/api/auth/me',

  // Business Profile
  BUSINESS_PROFILE: '/api/business/profile',

  // Customers
  CUSTOMERS: '/api/customers',
  CUSTOMER_BY_ID: (id = ':id') => `/api/customers/${id}`,

  // Orders
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id = ':id') => `/api/orders/${id}`,
  ORDER_ADDRESS: (id = ':id') => `/api/orders/${id}/address`,

  // Public Endpoints
  PUBLIC_ADDRESS: (businessCode = ':businessCode') => `/api/public/address/${businessCode}`,
  PUBLIC_ORDER: (orderToken = ':orderToken') => `/api/public/order/${orderToken}`,
  PUBLIC_ORDER_ADDRESS: (orderToken = ':orderToken') => `/api/public/order/${orderToken}/address`,
  PUBLIC_ORDER_INITIATE_PAYMENT: (orderToken = ':orderToken') => `/api/public/order/${orderToken}/initiate-payment`
};

/**
 * Build absolute public order URL
 * @param {string} orderToken
 * @returns {string}
 */
export const buildPublicOrderUrl = (orderToken) => {
  return `${getPublicAppUrl()}/order/${orderToken}`;
};

/**
 * Build absolute public address formatter URL
 * @param {string} businessCode
 * @returns {string}
 */
export const buildPublicAddressUrl = (businessCode) => {
  return `${getPublicAppUrl()}/address/${businessCode}`;
};

/**
 * Normalize phone number to standard Indian international format (without + or spaces)
 * @param {string} rawPhone
 * @returns {string}
 */
export const normalizePhone = (rawPhone = '') => {
  let cleaned = String(rawPhone).replace(/\D/g, '');
  if (!cleaned) return '';
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
};

/**
 * Build official WhatsApp Send URL
 * Centralizes https://api.whatsapp.com/send
 * @param {string} phone - Recipient phone number (can be raw or with country code)
 * @param {string} message - Message text
 * @returns {string}
 */
export const buildWhatsAppUrl = (phone = '', message = '') => {
  const normalizedPhone = normalizePhone(phone);
  const encodedText = encodeURIComponent(message || '');
  if (normalizedPhone) {
    return `https://api.whatsapp.com/send/?phone=${normalizedPhone}&text=${encodedText}&type=phone_number&app_absent=0`;
  }
  return `https://api.whatsapp.com/send/?text=${encodedText}`;
};
