import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { User } from '../models/User.js';
import { Business } from '../models/Business.js';
import { sendError } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Authentication required. Please sign in.', 401);
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendError(res, 'Session expired or user no longer exists.', 401);
    }

    const business = await Business.findById(user.businessId);
    if (!business) {
      return sendError(res, 'Business profile not found for this account.', 404);
    }

    req.user = user;
    req.business = business;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendError(res, 'Invalid or expired session. Please sign in again.', 401);
    }
    return sendError(res, 'Internal authentication error', 500);
  }
};
