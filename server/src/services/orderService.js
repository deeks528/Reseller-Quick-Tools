import { Order } from '../models/Order.js';
import { Customer } from '../models/Customer.js';
import { generateOrderToken } from '../utils/token.js';
import { formatPostalAddress } from '../utils/formatAddress.js';
import { buildPublicOrderUrl, buildWhatsAppUrl, normalizePhone } from '../../../shared/config/urls.js';
import { MESSAGES } from '../../../shared/config/messages.js';

export const orderService = {
  /**
   * Create an order and sync customer
   */
  async createOrder({
    business,
    customerPhone,
    amount,
    item = 'Order',
    customerName = '',
    address = null,
    formattedAddress = ''
  }) {
    const cleanPhone = normalizePhone(customerPhone);
    const trimmedName = (customerName || '').trim();

    // 1. Sync Customer: Find existing or create
    let customer = await Customer.findOne({
      businessId: business._id,
      phone: cleanPhone
    });

    if (!customer) {
      customer = await Customer.create({
        businessId: business._id,
        phone: cleanPhone,
        name: trimmedName,
        defaultAddress: address ? { ...address, formattedAddress: formatPostalAddress(address) } : null
      });
    } else {
      // Update name if provided and customer had no name
      let modified = false;
      if (trimmedName && (!customer.name || customer.name !== trimmedName)) {
        customer.name = trimmedName;
        modified = true;
      }
      if (address) {
        customer.defaultAddress = {
          ...address,
          formattedAddress: formatPostalAddress(address)
        };
        modified = true;
      }
      if (modified) {
        await customer.save();
      }
    }

    // 2. Generate cryptographically safe order token
    let orderToken = generateOrderToken(8);
    // Ensure uniqueness
    let existing = await Order.findOne({ orderToken });
    while (existing) {
      orderToken = generateOrderToken(8);
      existing = await Order.findOne({ orderToken });
    }

    // 3. Calculate expiration based on business profile
    const retentionDays = business.orderRetentionDays || 90;
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + retentionDays * 24 * 60 * 60 * 1000);

    // 4. Determine initial order status and address
    let orderAddress = null;
    let addressSavedAt = null;
    let orderStatus = 'awaiting_address';

    if (address || formattedAddress) {
      const finalFormatted = formattedAddress || formatPostalAddress(address);
      orderAddress = address ? {
        ...address,
        formattedAddress: finalFormatted
      } : {
        formattedAddress: finalFormatted,
        phone: cleanPhone,
        name: trimmedName
      };
      addressSavedAt = new Date();
      orderStatus = 'ready_for_payment';
    }

    // 5. Create Order
    const order = await Order.create({
      businessId: business._id,
      customerId: customer._id,
      orderToken,
      item: item.trim(),
      amount: Number(amount),
      customerName: trimmedName || customer.name,
      customerPhone: cleanPhone,
      address: orderAddress,
      addressSavedAt,
      orderStatus,
      paymentStatus: 'pending',
      createdAt,
      expiresAt
    });

    const publicUrl = buildPublicOrderUrl(order.orderToken);
    const whatsappText = MESSAGES.orderLink({
      businessName: business.businessName,
      item: order.item,
      amount: order.amount,
      url: publicUrl
    });
    const whatsappUrl = buildWhatsAppUrl(cleanPhone, whatsappText);

    return {
      order,
      customer,
      publicUrl,
      whatsappUrl,
      whatsappText
    };
  }
};
