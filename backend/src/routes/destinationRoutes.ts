// src/routes/destinationRoutes.ts
import { Router } from 'express';
import {
    getDestinations,
    getDestination,
    createDestination,
    updateDestination,
    deleteDestination,
} from '../controllers/destinationController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.route('/')
    .get(getDestinations)
    .post(protect, authorize(UserRole.ADMIN), createDestination);

router.route('/:id')
    .get(getDestination)
    .put(protect, authorize(UserRole.ADMIN), updateDestination)
    .delete(protect, authorize(UserRole.ADMIN), deleteDestination);

export default router;
