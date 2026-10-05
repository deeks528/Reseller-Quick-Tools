import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().trim().optional(),
  name: z.string().trim().optional(),
  phone: z.string().min(10, 'Valid phone number is required').trim(),
  houseNo: z.string().trim().optional(),
  address1: z.string().trim().optional(),
  street: z.string().trim().optional(),
  address2: z.string().trim().optional(),
  area: z.string().trim().optional(),
  city: z.string().min(2, 'City is required').trim(),
  state: z.string().min(2, 'State is required').trim(),
  pin: z.string().min(6, 'PIN must be at least 6 digits').trim().optional(),
  pincode: z.string().min(6, 'PIN must be at least 6 digits').trim().optional(),
  landmark: z.string().trim().optional(),
  formattedAddress: z.string().trim().optional()
}).refine(data => data.houseNo || data.address1, {
  message: 'House/Door number is required',
  path: ['houseNo']
}).refine(data => data.name || data.fullName, {
  message: 'Name is required',
  path: ['name']
}).refine(data => data.pin || data.pincode, {
  message: 'PIN code is required',
  path: ['pin']
});

export const normalizeAddressPayload = (data) => {
  const name = (data.name || data.fullName || '').trim();
  const houseNo = (data.houseNo || data.address1 || '').trim();
  const street = (data.street || '').trim();
  const area = (data.area || data.address2 || '').trim();
  const city = (data.city || '').trim();
  const state = (data.state || '').trim();
  const pin = (data.pin || data.pincode || '').trim();
  const phone = (data.phone || '').trim();
  const landmark = (data.landmark || '').trim();

  return {
    name,
    houseNo,
    street,
    area,
    city,
    state,
    pin,
    phone,
    landmark
  };
};
