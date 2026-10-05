import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/businessController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { updateBusinessSchema } from '../validations/businessSchemas.js';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateBusinessSchema), updateProfile);

export default router;
