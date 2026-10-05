import { Customer } from '../models/Customer.js';
import { Order } from '../models/Order.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getCustomers = async (req, res, next) => {
  try {
    const businessId = req.business._id;
    const { search } = req.query;

    const filter = {
      businessId,
      deletedAt: null
    };

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { phone: regex },
        { 'defaultAddress.city': regex }
      ];
    }

    // Fetch active customers for this business
    const customers = await Customer.find(filter).sort({ updatedAt: -1 }).lean();

    // Fetch recent active orders for each customer
    const customerIds = customers.map(c => c._id);
    const orders = await Order.find({
      businessId,
      customerId: { $in: customerIds },
      deletedAt: null
    }).sort({ createdAt: -1 }).lean();

    // Map orders to customers
    const customersWithOrders = customers.map(customer => {
      const customerOrders = orders.filter(o => String(o.customerId) === String(customer._id));
      const totalAmount = customerOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
      return {
        ...customer,
        orderCount: customerOrders.length,
        totalSpent: totalAmount,
        recentOrder: customerOrders[0] || null,
        orders: customerOrders
      };
    });

    return sendSuccess(res, customersWithOrders);
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const businessId = req.business._id;

    const customer = await Customer.findOne({
      _id: id,
      businessId,
      deletedAt: null
    }).lean();

    if (!customer) {
      return sendError(res, 'Customer not found', 404);
    }

    const orders = await Order.find({
      businessId,
      customerId: customer._id,
      deletedAt: null
    }).sort({ createdAt: -1 }).lean();

    return sendSuccess(res, {
      ...customer,
      orders
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const businessId = req.business._id;

    const customer = await Customer.findOneAndUpdate(
      { _id: id, businessId, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!customer) {
      return sendError(res, 'Customer not found or already deleted', 404);
    }

    // Also soft-delete all active orders for this customer
    await Order.updateMany(
      { customerId: customer._id, businessId, deletedAt: null },
      { deletedAt: new Date() }
    );

    return sendSuccess(res, null, 'Customer and associated orders deleted successfully');
  } catch (error) {
    next(error);
  }
};
