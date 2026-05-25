// src/routes/bookingRoutes.ts
import { Router } from 'express';
import {
    createBooking,
    getMyBookings,
    getBooking,
    updateBookingStatus,
    cancelBooking,
} from '../controllers/bookingController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All booking routes require authentication
router.use(protect);

router.route('/')
    .post(createBooking);

router.get('/me', getMyBookings);

router.route('/:id')
    .get(getBooking);

router.patch('/:id/status', authorize(UserRole.TOUR_OPERATOR, UserRole.ADMIN), updateBookingStatus);
router.patch('/:id/cancel', cancelBooking);

export default router;
