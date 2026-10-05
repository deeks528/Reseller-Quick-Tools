import { z } from 'zod';

export const updateBusinessSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters').trim().optional(),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters').trim().optional(),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits').regex(/^[0-9+ -]+$/, 'Invalid mobile number format').trim().optional(),
  upiId: z.string().min(3, 'Valid UPI ID is required (e.g. yourname@upi)').regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, 'Invalid UPI ID format (e.g. mobile@upi or name@bank)').trim().optional(),
  orderRetentionDays: z.coerce.number().refine(val => [7, 14, 30, 60, 90].includes(val), {
    message: 'Retention must be 7, 14, 30, 60, or 90 days'
  }).optional(),
  businessCode: z.string().min(3, 'Business code must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Business code must contain lowercase letters, numbers, and hyphens only').trim().optional()
});
