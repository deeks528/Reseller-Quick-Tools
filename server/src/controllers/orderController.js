import { Order } from '../models/Order.js';
import { Customer } from '../models/Customer.js';
import { orderService } from '../services/orderService.js';
import { formatPostalAddress } from '../utils/formatAddress.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { buildPublicOrderUrl, buildWhatsAppUrl } from '../../../shared/config/urls.js';
import { MESSAGES } from '../../../shared/config/messages.js';

export const createOrder = async (req, res, next) => {
  try {
    const { customerPhone, amount, item, customerName, formattedAddress, address } = req.body;

    const result = await orderService.createOrder({
      business: req.business,
      customerPhone,
      amount,
      item,
      customerName,
      address,
      formattedAddress
    });

    return sendSuccess(res, result, 'Order created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const businessId = req.business._id;
    const now = new Date();

    // Fetch active orders (not soft-deleted)
    const orders = await Order.find({
      businessId,
      deletedAt: null
    }).sort({ createdAt: -1 });

    // Lazy expiration check
    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        let changed = false;
        if (order.expiresAt && now > order.expiresAt && order.orderStatus !== 'completed') {
          if (order.orderStatus !== 'expired') {
            order.orderStatus = 'expired';
            changed = true;
          }
        }
        if (changed) {
          await order.save();
        }

        const publicUrl = buildPublicOrderUrl(order.orderToken);
        const whatsappText = order.address?.formattedAddress
          ? MESSAGES.address({ formattedAddress: order.address.formattedAddress, customerPhone: order.customerPhone })
          : MESSAGES.orderLink({
              businessName: req.business.businessName,
              item: order.item,
              amount: order.amount,
              url: publicUrl
            });
        const whatsappUrl = buildWhatsAppUrl(order.customerPhone, whatsappText);

        return {
          ...order.toObject(),
          publicUrl,
          whatsappUrl,
          whatsappText
        };
      })
    );

    return sendSuccess(res, updatedOrders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const businessId = req.business._id;

    const order = await Order.findOne({
      _id: id,
      businessId,
      deletedAt: null
    });

    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    // Lazy expiration check
    const now = new Date();
    if (order.expiresAt && now > order.expiresAt && order.orderStatus !== 'completed') {
      if (order.orderStatus !== 'expired') {
        order.orderStatus = 'expired';
        await order.save();
      }
    }

    const publicUrl = buildPublicOrderUrl(order.orderToken);
    const whatsappText = order.address?.formattedAddress
      ? MESSAGES.address({ formattedAddress: order.address.formattedAddress, customerPhone: order.customerPhone })
      : MESSAGES.orderLink({
          businessName: req.business.businessName,
          item: order.item,
          amount: order.amount,
          url: publicUrl
        });
    const whatsappUrl = buildWhatsAppUrl(order.customerPhone, whatsappText);

    return sendSuccess(res, {
      ...order.toObject(),
      publicUrl,
      whatsappUrl,
      whatsappText
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const businessId = req.business._id;

    const order = await Order.findOneAndUpdate(
      { _id: id, businessId, deletedAt: null },
      { deletedAt: new Date(), orderStatus: 'deleted' },
      { new: true }
    );

    if (!order) {
      return sendError(res, 'Order not found or already deleted', 404);
    }

    return sendSuccess(res, null, 'Order deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const attachAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const businessId = req.business._id;
    const { address, customerName } = req.body;

    const order = await Order.findOne({
      _id: id,
      businessId,
      deletedAt: null
    });

    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    let finalAddress = null;
    if (typeof address === 'string') {
      finalAddress = {
        formattedAddress: address.trim(),
        name: customerName || order.customerName,
        phone: order.customerPhone
      };
    } else if (address) {
      finalAddress = {
        ...address,
        formattedAddress: formatPostalAddress(address)
      };
    }

    order.address = finalAddress;
    order.addressSavedAt = new Date();
    order.orderStatus = 'ready_for_payment';
    if (customerName) {
      order.customerName = customerName;
    }

    await order.save();

    // Update customer default address
    if (order.customerId && finalAddress) {
      await Customer.findByIdAndUpdate(order.customerId, {
        defaultAddress: finalAddress,
        ...(customerName ? { name: customerName } : {})
      });
    }

    return sendSuccess(res, order, 'Address attached successfully');
  } catch (error) {
    next(error);
  }
};
