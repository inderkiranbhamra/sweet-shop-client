import { Router } from 'express';
import { getSweets, addSweet, updateSweet, deleteSweet, purchaseSweet } from '../controllers/sweetController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public routes (or protected for all users)
router.get('/', authenticate, getSweets);
router.post('/:id/purchase', authenticate, purchaseSweet);

// Admin only routes
router.post('/', authenticate, requireAdmin, addSweet);
router.put('/:id', authenticate, requireAdmin, updateSweet);
router.delete('/:id', authenticate, requireAdmin, deleteSweet);

export default router;