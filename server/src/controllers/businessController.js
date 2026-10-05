import { Business } from '../models/Business.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getProfile = async (req, res, next) => {
  try {
    const business = await Business.findById(req.business._id);
    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }
    return sendSuccess(res, business);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { businessName, ownerName, mobileNumber, upiId, orderRetentionDays, businessCode } = req.body;
    const business = await Business.findById(req.business._id);

    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    if (businessName) business.businessName = businessName;
    if (ownerName) business.ownerName = ownerName;
    if (mobileNumber) business.mobileNumber = mobileNumber;
    if (upiId) business.upiId = upiId;
    if (orderRetentionDays) business.orderRetentionDays = orderRetentionDays;

    // Check if businessCode update is requested
    if (businessCode && businessCode !== business.businessCode) {
      // Check if businessCode already taken
      const existing = await Business.findOne({ businessCode });
      if (existing) {
        return sendError(res, 'This business code is already in use. Please choose another.', 409);
      }
      business.businessCode = businessCode;
    }

    await business.save();
    return sendSuccess(res, business, 'Business profile updated successfully');
  } catch (error) {
    next(error);
  }
};
