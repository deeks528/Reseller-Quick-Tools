import { Router } from 'express';
import {
  getPublicOrder,
  savePublicAddress,
  initiatePayment,
  getPublicAddressFormatter
} from '../controllers/publicController.js';
import { publicLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validateMiddleware.js';
import { addressSchema } from '../validations/addressSchemas.js';

const router = Router();

router.use(publicLimiter);

router.get('/order/:orderToken', getPublicOrder);
router.post('/order/:orderToken/address', validate(addressSchema), savePublicAddress);
router.post('/order/:orderToken/initiate-payment', initiatePayment);
router.get('/address/:businessCode', getPublicAddressFormatter);

export default router;
