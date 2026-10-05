import { z } from 'zod';
import { addressSchema } from './addressSchemas.js';

export const updateCustomerSchema = z.object({
  name: z.string().trim().optional(),
  phone: z.string().min(10, 'Valid customer phone is required').trim().optional(),
  defaultAddress: addressSchema.optional()
});
