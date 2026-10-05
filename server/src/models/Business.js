import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    ownerName: {
      type: String,
      required: true,
      trim: true
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true
    },
    upiId: {
      type: String,
      required: true,
      trim: true
    },
    businessCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    orderRetentionDays: {
      type: Number,
      enum: [7, 14, 30, 60, 90],
      default: 90
    }
  },
  { timestamps: true }
);

export const Business = mongoose.model('Business', businessSchema);
