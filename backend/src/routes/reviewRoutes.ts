// src/routes/reviewRoutes.ts
import { Router } from 'express';
import {
    createReview,
    getReviews,
    deleteReview,
} from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/', protect, createReview);
router.get('/:targetType/:targetId', getReviews);
router.delete('/:id', protect, deleteReview);

export default router;
