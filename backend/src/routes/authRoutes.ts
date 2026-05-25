// src/routes/authRoutes.ts
// Authentication routes

import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  googleAuth,
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;

