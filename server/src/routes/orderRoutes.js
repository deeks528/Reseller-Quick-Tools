import { Router } from 'express';
import { createOrder, getOrders, getOrderById, deleteOrder, attachAddress } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createOrderSchema, updateOrderAddressSchema } from '../validations/orderSchemas.js';

const router = Router();

router.post('/', protect, validate(createOrderSchema), createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.delete('/:id', protect, deleteOrder);
router.post('/:id/address', protect, validate(updateOrderAddressSchema), attachAddress);

export default router;
