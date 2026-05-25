// src/routes/transportationRoutes.ts
import { Router } from 'express';
import {
    getTransportation,
    getTransportationById,
    createTransportation,
    updateTransportation,
    deleteTransportation,
} from '../controllers/transportationController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.route('/')
    .get(getTransportation)
    .post(protect, authorize(UserRole.TOUR_OPERATOR, UserRole.ADMIN), createTransportation);

router.route('/:id')
    .get(getTransportationById)
    .put(protect, authorize(UserRole.TOUR_OPERATOR, UserRole.ADMIN), updateTransportation)
    .delete(protect, authorize(UserRole.TOUR_OPERATOR, UserRole.ADMIN), deleteTransportation);

export default router;
