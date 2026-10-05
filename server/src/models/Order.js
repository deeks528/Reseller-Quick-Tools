import mongoose from 'mongoose';

const orderAddressSubSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    houseNo: { type: String, trim: true },
    street: { type: String, trim: true },
    area: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pin: { type: String, trim: true },
    landmark: { type: String, trim: true },
    phone: { type: String, trim: true },
    formattedAddress: { type: String, trim: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true
    },
    orderToken: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    item: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    customerName: {
      type: String,
      trim: true,
      default: ''
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    address: {
      type: orderAddressSubSchema,
      default: null
    },
    addressSavedAt: {
      type: Date,
      default: null
    },
    orderStatus: {
      type: String,
      enum: [
        'awaiting_address',
        'ready_for_payment',
        'payment_initiated',
        'completed',
        'expired',
        'deleted'
      ],
      default: 'awaiting_address',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'initiated', 'paid', 'failed'],
      default: 'pending',
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true
    }
  },
  { timestamps: false }
);

// Helper method to check if order is expired lazily
orderSchema.methods.checkAndMarkExpired = function () {
  if (this.deletedAt) return false;
  if (this.orderStatus === 'completed') return false;

  const now = new Date();
  if (this.expiresAt && now > this.expiresAt) {
    if (this.orderStatus !== 'expired') {
      this.orderStatus = 'expired';
      return true;
    }
  }
  return false;
};

export const Order = mongoose.model('Order', orderSchema);
