import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long').trim(),
  businessName: z.string().min(2, 'Business name must be at least 2 characters long').trim(),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits').regex(/^[0-9+ -]+$/, 'Invalid mobile number format').trim(),
  upiId: z.string().min(3, 'Valid UPI ID is required (e.g. yourname@upi)').regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, 'Invalid UPI ID format (e.g. mobile@upi or name@bank)').trim(),
  orderRetentionDays: z.coerce.number().refine(val => [7, 14, 30, 60, 90].includes(val), {
    message: 'Retention must be 7, 14, 30, 60, or 90 days'
  }).optional().default(90)
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required')
});
