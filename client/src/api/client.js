import axios from 'axios';
import { API_ROUTES } from 'shared/config/urls.js';

export const apiClient = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to unpack response data
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const errors = error.response?.data?.errors || null;
    return Promise.reject({ message, errors, status: error.response?.status });
  }
);

// Auth API
export const authApi = {
  login: (data) => apiClient.post(API_ROUTES.AUTH_LOGIN, data),
  register: (data) => apiClient.post(API_ROUTES.AUTH_REGISTER, data),
  logout: () => apiClient.post(API_ROUTES.AUTH_LOGOUT),
  getMe: () => apiClient.get(API_ROUTES.AUTH_ME)
};

// Business Profile API
export const businessApi = {
  getProfile: () => apiClient.get(API_ROUTES.BUSINESS_PROFILE),
  updateProfile: (data) => apiClient.put(API_ROUTES.BUSINESS_PROFILE, data)
};

// Customer API
export const customerApi = {
  getCustomers: (params) => apiClient.get(API_ROUTES.CUSTOMERS, { params }),
  getCustomerById: (id) => apiClient.get(API_ROUTES.CUSTOMER_BY_ID(id)),
  deleteCustomer: (id) => apiClient.delete(API_ROUTES.CUSTOMER_BY_ID(id))
};

// Orders API
export const orderApi = {
  createOrder: (data) => apiClient.post(API_ROUTES.ORDERS, data),
  getOrders: () => apiClient.get(API_ROUTES.ORDERS),
  getOrderById: (id) => apiClient.get(API_ROUTES.ORDER_BY_ID(id)),
  deleteOrder: (id) => apiClient.delete(API_ROUTES.ORDER_BY_ID(id)),
  attachAddress: (id, data) => apiClient.post(API_ROUTES.ORDER_ADDRESS(id), data)
};

// Public Endpoints API
export const publicApi = {
  getPublicOrder: (token) => apiClient.get(API_ROUTES.PUBLIC_ORDER(token)),
  savePublicAddress: (token, addressData) => apiClient.post(API_ROUTES.PUBLIC_ORDER_ADDRESS(token), addressData),
  initiatePayment: (token) => apiClient.post(API_ROUTES.PUBLIC_ORDER_INITIATE_PAYMENT(token)),
  getPublicAddressFormatter: (code) => apiClient.get(API_ROUTES.PUBLIC_ADDRESS(code))
};
