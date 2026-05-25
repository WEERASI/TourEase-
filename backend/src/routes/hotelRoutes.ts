// src/routes/hotelRoutes.ts
import { Router } from 'express';
import {
    getHotels,
    getHotel,
    createHotel,
    updateHotel,
    deleteHotel,
} from '../controllers/hotelController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.route('/')
    .get(getHotels)
    .post(protect, authorize(UserRole.HOTEL_PARTNER, UserRole.ADMIN), createHotel);

router.route('/:id')
    .get(getHotel)
    .put(protect, authorize(UserRole.HOTEL_PARTNER, UserRole.ADMIN), updateHotel)
    .delete(protect, authorize(UserRole.HOTEL_PARTNER, UserRole.ADMIN), deleteHotel);

export default router;
