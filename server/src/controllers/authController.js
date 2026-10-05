import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Business } from '../models/Business.js';
import { ENV } from '../config/env.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { generateBusinessCode } from '../utils/token.js';

const sendTokenResponse = (user, business, statusCode, res, message = 'Success') => {
  const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN
  });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  res.cookie('token', token, cookieOptions);

  return sendSuccess(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    business: {
      id: business._id,
      businessName: business.businessName,
      ownerName: business.ownerName,
      mobileNumber: business.mobileNumber,
      upiId: business.upiId,
      businessCode: business.businessCode,
      orderRetentionDays: business.orderRetentionDays
    }
  }, message, statusCode);
};

export const register = async (req, res, next) => {
  try {
    const { email, password, name, businessName, mobileNumber, upiId, orderRetentionDays } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'An account with this email already exists', 400);
    }

    // 1. Create User
    const user = new User({
      email,
      password,
      name
    });

    // 2. Generate unique businessCode
    let businessCode = generateBusinessCode(businessName);
    let existingBiz = await Business.findOne({ businessCode });
    while (existingBiz) {
      businessCode = generateBusinessCode(businessName);
      existingBiz = await Business.findOne({ businessCode });
    }

    // 3. Create Business
    const business = await Business.create({
      ownerId: user._id,
      businessName,
      ownerName: name,
      mobileNumber,
      upiId,
      businessCode,
      orderRetentionDays: orderRetentionDays || 90
    });

    user.businessId = business._id;
    await user.save();

    return sendTokenResponse(user, business, 201, res, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const business = await Business.findById(user.businessId);
    if (!business) {
      return sendError(res, 'Associated business profile not found', 404);
    }

    return sendTokenResponse(user, business, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  return sendSuccess(res, null, 'Logged out successfully');
};

export const getMe = async (req, res) => {
  return sendSuccess(res, {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    },
    business: {
      id: req.business._id,
      businessName: req.business.businessName,
      ownerName: req.business.ownerName,
      mobileNumber: req.business.mobileNumber,
      upiId: req.business.upiId,
      businessCode: req.business.businessCode,
      orderRetentionDays: req.business.orderRetentionDays
    }
  });
};
