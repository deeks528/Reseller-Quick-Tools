import { Order } from '../models/Order.js';
import { Business } from '../models/Business.js';
import { Customer } from '../models/Customer.js';
import { formatPostalAddress } from '../utils/formatAddress.js';
import { normalizeAddressPayload } from '../validations/addressSchemas.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { PAYMENT } from '../../../shared/config/payment.js';

export const getPublicOrder = async (req, res, next) => {
  try {
    const { orderToken } = req.params;

    if (!orderToken || orderToken.length < 4) {
      return sendError(res, 'Invalid order link', 400);
    }

    const order = await Order.findOne({
      orderToken,
      deletedAt: null
    });

    if (!order) {
      return sendError(res, 'Order link not found or no longer available', 404);
    }

    // Lazy expiration check
    const now = new Date();
    const isExpired = order.expiresAt && now > order.expiresAt;
    if (isExpired && order.orderStatus !== 'completed') {
      if (order.orderStatus !== 'expired') {
        order.orderStatus = 'expired';
        await order.save();
      }
    }

    const business = await Business.findById(order.businessId);
    if (!business) {
      return sendError(res, 'Merchant profile unavailable', 404);
    }

    // Compute UPI URL if address is saved and not expired
    let upiUrl = '';
    if (!isExpired && (order.orderStatus === 'ready_for_payment' || order.orderStatus === 'payment_initiated' || order.orderStatus === 'completed')) {
      upiUrl = PAYMENT.buildUpiUrl({
        upiId: business.upiId,
        businessName: business.businessName,
        amount: order.amount,
        order: order.item
      });
    }

    // Expose only non-sensitive public data (no MongoDB IDs)
    return sendSuccess(res, {
      orderToken: order.orderToken,
      item: order.item,
      amount: order.amount,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      address: order.address,
      addressSavedAt: order.addressSavedAt,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      isExpired,
      expiresAt: order.expiresAt,
      businessName: business.businessName,
      businessCode: business.businessCode,
      upiUrl
    });
  } catch (error) {
    next(error);
  }
};

export const savePublicAddress = async (req, res, next) => {
  try {
    const { orderToken } = req.params;

    const order = await Order.findOne({
      orderToken,
      deletedAt: null
    });

    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    // Check expiration
    const now = new Date();
    if (order.expiresAt && now > order.expiresAt) {
      order.orderStatus = 'expired';
      await order.save();
      return sendError(res, 'This order link has expired', 410);
    }

    const business = await Business.findById(order.businessId);
    if (!business) {
      return sendError(res, 'Merchant profile unavailable', 404);
    }

    // Normalize and format address
    const normalized = normalizeAddressPayload(req.body);
    const formattedAddress = formatPostalAddress(normalized);

    const addressObject = {
      ...normalized,
      formattedAddress
    };

    order.address = addressObject;
    order.addressSavedAt = new Date();
    order.orderStatus = 'ready_for_payment';
    if (normalized.name) {
      order.customerName = normalized.name;
    }

    await order.save();

    // Sync to Customer record defaultAddress
    if (order.customerId) {
      await Customer.findByIdAndUpdate(order.customerId, {
        name: normalized.name || undefined,
        defaultAddress: addressObject
      });
    }

    const upiUrl = PAYMENT.buildUpiUrl({
      upiId: business.upiId,
      businessName: business.businessName,
      amount: order.amount,
      order: order.item
    });

    return sendSuccess(res, {
      orderToken: order.orderToken,
      item: order.item,
      amount: order.amount,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      address: order.address,
      addressSavedAt: order.addressSavedAt,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      businessName: business.businessName,
      businessCode: business.businessCode,
      upiUrl
    }, 'Address saved successfully');
  } catch (error) {
    next(error);
  }
};

export const initiatePayment = async (req, res, next) => {
  try {
    const { orderToken } = req.params;

    const order = await Order.findOne({
      orderToken,
      deletedAt: null
    });

    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    if (order.orderStatus === 'expired') {
      return sendError(res, 'This order link has expired', 410);
    }

    order.orderStatus = 'payment_initiated';
    order.paymentStatus = 'initiated';
    await order.save();

    return sendSuccess(res, {
      orderToken: order.orderToken,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus
    }, 'Payment initiated');
  } catch (error) {
    next(error);
  }
};

export const getPublicAddressFormatter = async (req, res, next) => {
  try {
    const { businessCode } = req.params;

    if (!businessCode) {
      return sendError(res, 'Business code is required', 400);
    }

    const business = await Business.findOne({ businessCode }).select('businessName mobileNumber businessCode');

    if (!business) {
      return sendError(res, 'Business not found for this address link', 404);
    }

    return sendSuccess(res, {
      businessName: business.businessName,
      mobileNumber: business.mobileNumber,
      businessCode: business.businessCode
    });
  } catch (error) {
    next(error);
  }
};
