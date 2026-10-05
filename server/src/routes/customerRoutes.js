import { Router } from 'express';
import { getCustomers, getCustomerById, deleteCustomer } from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getCustomers);
router.get('/:id', protect, getCustomerById);
router.delete('/:id', protect, deleteCustomer);

export default router;
