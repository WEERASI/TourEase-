// src/routes/operatorRoutes.ts
// Routes for Tour Operator dashboard operations

import { Router } from 'express';
import {
    getDashboardStats,
    getMyTours,
    getMyBookings,
    getMyReviews,
    replyToReview,
    getRevenueData,
    updateOperatorProfile,
    getAnalytics,
    updateTourStatus,
} from '../controllers/operatorController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All operator routes require authentication + tour_operator role
router.use(protect, authorize(UserRole.TOUR_OPERATOR));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Tours
router.get('/tours', getMyTours);
router.patch('/tours/:id/status', updateTourStatus);

// Bookings
router.get('/bookings', getMyBookings);

// Reviews
router.get('/reviews', getMyReviews);
router.post('/reviews/:id/reply', replyToReview);

// Financial
router.get('/revenue', getRevenueData);

// Analytics
router.get('/analytics', getAnalytics);

// Profile
router.put('/profile', updateOperatorProfile);

export default router;
