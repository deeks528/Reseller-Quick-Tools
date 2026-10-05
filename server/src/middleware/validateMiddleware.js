import { sendError } from '../utils/apiResponse.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMap = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.') || 'general';
        errorMap[field] = err.message;
      });
      return sendError(res, 'Validation error', 400, errorMap);
    }
    req.validatedBody = result.data;
    next();
  } catch (err) {
    return sendError(res, 'Validation execution failure', 500);
  }
};
