// src/routes/tourRoutes.ts
import { Router } from 'express';
import {
    getTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
} from '../controllers/tourController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.route('/')
    .get(getTours)
    .post(protect, authorize(UserRole.TOUR_OPERATOR, UserRole.ADMIN), createTour);

router.route('/:id')
    .get(getTour)
    .put(protect, authorize(UserRole.TOUR_OPERATOR, UserRole.ADMIN), updateTour)
    .delete(protect, authorize(UserRole.TOUR_OPERATOR, UserRole.ADMIN), deleteTour);

export default router;
