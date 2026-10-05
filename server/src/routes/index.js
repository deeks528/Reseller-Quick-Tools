import { Router } from 'express';
import authRoutes from './authRoutes.js';
import businessRoutes from './businessRoutes.js';
import customerRoutes from './customerRoutes.js';
import orderRoutes from './orderRoutes.js';
import publicRoutes from './publicRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/business', businessRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/public', publicRoutes);

export default router;
