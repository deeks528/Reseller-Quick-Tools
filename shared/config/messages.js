/**
 * Centralized User-facing Messages and WhatsApp Notification Templates
 * All messages and communication templates are managed here.
 */

export const MESSAGES = {
  /**
   * Order link message sent to the customer
   */
  orderLink: ({ businessName = '', item = '', amount = 0, url = '' } = {}) => {
    const formattedAmount = Number(amount).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });
    return `Hello! Here is your order details:\n\n` +
      `Item: ${item}\n` +
      `Amount: ${formattedAmount}\n\n` +
      `Please confirm your delivery address and complete payment using the link below:\n` +
      `${url}\n\n` +
      `Thank you for shopping with us!`;
  },

  /**
   * Formatted address sharing message
   */
  address: ({ formattedAddress = '', customerName = '', customerPhone = '' } = {}) => {
    let text = `${formattedAddress}`;
    return text;
  },

  /**
   * Payment request message
   */
  paymentRequest: ({ businessName = '', item = '', amount = 0, url = '' } = {}) => {
    const formattedAmount = Number(amount).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });
    return (item ? `Order: ${item}\n` : '') +
      `Amount Due: ${formattedAmount}\n\n` +
      `Click here to view details and pay securely via UPI:\n` +
      `${url}\n\n` +
      `Thank you!`;
  },

  /**
   * Payment receipt message
   */
  paymentReceipt: ({ businessName = '', item = '', amount = 0, orderToken = '' } = {}) => {
    const formattedAmount = Number(amount).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });
    return (orderToken ? `Order Ref: #${orderToken}\n` : '') +
      (item ? `Item: ${item}\n` : '') +
      `Amount Paid: ${formattedAmount}\n` +
      `Status: Payment Confirmed ✓\n\n` +
      `Thank you for shopping at ${businessName}!`;
  },

  /**
   * Order booked confirmation message
   */
  orderBooked: ({ businessName = '', item = '', orderToken = '' } = {}) => {
    return `🎉 Order Booked with ${businessName}!\n\n` +
      (orderToken ? `Order Ref: #${orderToken}\n` : '') +
      `Item: ${item}\n\n` +
      `We have received your order details .`;
  },

  /**
   * Payment received message
   */
  paymentReceived: ({ businessName = '', item = '', amount = 0 } = {}) => {
    const formattedAmount = Number(amount).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });
    return `✅ Payment Received!\n\n` +
      `We have received ${formattedAmount} for "${item}". Thank you from ${businessName}.`;
  },

  /**
   * Sold out notice
   */
  soldOut: ({ businessName = '', item = '' } = {}) => {
    return `Hello from ${businessName}.\n\n` +
      `We are sorry, but the item "${item}" is currently sold out!`;
  },

  /**
   * Customer address request message
   */
  customerAddressRequest: ({ businessName = '', url = '' } = {}) => {
    return `Hello! Please click the link below to provide your delivery address:\n\n` +
      `${url}\n\n` +
      `Thank you!`;
  },

  /**
   * Complete order confirmation with shipping address recap
   */
  orderConfirmation: ({ businessName = '', item = '', amount = 0, formattedAddress = '' } = {}) => {
    const formattedAmount = Number(amount).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });
    return `Order Confirmation\n\n` +
      `Item: ${item}\n` +
      `Amount: ${formattedAmount}\n\n` +
      `Shipping Address:\n${formattedAddress}\n\n` +
      `Thank you for choosing ${businessName}!`;
  }
};
