// src/server.ts
// This is the main entry point for your TourEase backend server

// Fix DNS resolution for MongoDB Atlas SRV records
// Uses Google DNS instead of system default DNS which may not support SRV lookups
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/authRoutes';
import destinationRoutes from './routes/destinationRoutes';
import tourRoutes from './routes/tourRoutes';
import hotelRoutes from './routes/hotelRoutes';
import transportationRoutes from './routes/transportationRoutes';
import bookingRoutes from './routes/bookingRoutes';
import itineraryRoutes from './routes/itineraryRoutes';
import reviewRoutes from './routes/reviewRoutes';
import operatorRoutes from './routes/operatorRoutes';
import adminRoutes from './routes/adminRoutes';

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app: Application = express();

// Force standard parsing to override any weird text string injected by local .env formats
let PORT: any = process.env.PORT || 5000;

// If PORT is accidentally read as a non-number or cluster string like 'kuberns', reset it to 10000 for Render
if (isNaN(Number(PORT))) {
  PORT = 10000;
}

// ==========================================
// MIDDLEWARE
// ==========================================

// CORS - Allow frontend to make requests to backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTES
// ==========================================

// Health check route (test if server is running)
app.get('/', (req, res) => {
  res.json({
    message: '✅ TourEase API is running!',
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/transportation', transportationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/operator', operatorRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// ==========================================
// DATABASE CONNECTION & SERVER START
// ==========================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening for requests
    app.listen(PORT, () => {
      console.log('==========================================');
      console.log(`🚀 TourEase Backend Server Started!`);
      console.log(`📡 Running on: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📅 Started at: ${new Date().toLocaleString()}`);
      console.log('==========================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.error('Shutting down server...');
  process.exit(1);
});