// src/routes/adminRoutes.ts
// All admin routes — protected with Admin role authorization

import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';
import {
    getDashboardStats,
    getUsers, updateUserRole, updateUserStatus, deleteUser,
    getOperators, approveOperator,
    getAllTours, updateTourStatus,
    getAllHotels, approveHotel,
    getAllBookings, updateBookingStatusAdmin,
    getAllReviews, deleteReview,
    getAnalytics,
    getSettings, updateSettings,
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, authorize(UserRole.ADMIN));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Operator management
router.get('/operators', getOperators);
router.put('/operators/:id/approve', approveOperator);

// Tour management
router.get('/tours', getAllTours);
router.put('/tours/:id/status', updateTourStatus);

// Hotel management
router.get('/hotels', getAllHotels);
router.put('/hotels/:id/approve', approveHotel);

// Booking management
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatusAdmin);

// Review moderation
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

// Analytics
router.get('/analytics', getAnalytics);

// Platform settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
