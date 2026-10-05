/**
 * Centralized Payment & UPI Deep Linking Configuration
 * Strictly handles UPI URL construction and currency standards.
 */

export const PAYMENT_CONFIG = {
  CURRENCY: 'INR',
  MIN_AMOUNT: 1.00,
  DEFAULT_NOTE_PREFIX: 'Order'
};

export const PAYMENT = {
  /**
   * Build standard UPI deep link
   * Format: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
   *
   * @param {Object} options
   * @param {string} options.upiId - Business UPI ID (pa)
   * @param {string} options.businessName - Payee display name (pn)
   * @param {number|string} options.amount - Order amount (am, 2 decimals)
   * @param {string} [options.order] - Order item name or description
   * @param {string} [options.message] - Custom transaction note (tn)
   * @returns {string} upi://pay deep link
   */
  buildUpiUrl: ({
    upiId = '',
    businessName = '',
    amount = 0,
    order = '',
    message = ''
  } = {}) => {
    if (!upiId) {
      throw new Error('UPI ID (pa) is required to build UPI payment URL.');
    }

    const cleanAmount = Number(amount || 0).toFixed(2);
    const payeeName = (businessName || 'Business').trim();
    const transactionNote = (message || order || `${PAYMENT_CONFIG.DEFAULT_NOTE_PREFIX} - ${payeeName}`).trim();

    const params = new URLSearchParams({
      pa: upiId.trim(),
      pn: payeeName,
      am: cleanAmount,
      cu: PAYMENT_CONFIG.CURRENCY,
      tn: transactionNote
    });

    return `upi://pay?${params.toString()}`;
  },

  /**
   * Format amount into Indian Rupee string
   * @param {number|string} amount
   * @returns {string}
   */
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: PAYMENT_CONFIG.CURRENCY,
      maximumFractionDigits: 2
    }).format(Number(amount) || 0);
  }
};
