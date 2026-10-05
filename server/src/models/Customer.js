import mongoose from 'mongoose';

const addressSubSchema = new mongoose.Schema(
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

const customerSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true
    },
    name: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    defaultAddress: {
      type: addressSubSchema,
      default: null
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

// Compound unique index: one customer phone per business
customerSchema.index({ businessId: 1, phone: 1 }, { unique: true });

export const Customer = mongoose.model('Customer', customerSchema);
