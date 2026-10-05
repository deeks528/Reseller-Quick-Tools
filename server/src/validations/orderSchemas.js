import { z } from 'zod';
import { addressSchema } from './addressSchemas.js';

export const createOrderSchema = z.object({
  customerPhone: z.string().min(10, 'Valid 10-digit customer phone is required').trim(),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  item: z.string().trim().default('Order'),
  customerName: z.string().trim().optional().default(''),
  // Optional for Order Link, provided for Payment Link
  formattedAddress: z.string().trim().optional(),
  address: addressSchema.optional()
});

export const updateOrderAddressSchema = z.object({
  address: z.union([addressSchema, z.string().min(5, 'Address is too short')]),
  customerName: z.string().trim().optional()
});
