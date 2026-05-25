// src/config/database.ts
// This file handles the connection to MongoDB

import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('❌ MongoDB URI is not defined in .env file');
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI);

    console.log('==========================================');
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log('==========================================');

  } catch (error) {
    console.error('==========================================');
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    console.error('==========================================');
    console.error('');
    console.error('💡 Troubleshooting Tips:');
    console.error('1. Check your .env file has MONGODB_URI');
    console.error('2. Verify MongoDB connection string is correct');
    console.error('3. Make sure you replaced <password> with actual password');
    console.error('4. Check internet connection');
    console.error('5. Verify IP address is whitelisted in MongoDB Atlas');
    console.error('');
    process.exit(1);
  }
};

// Handle mongoose connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB Disconnected!');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
});

export default connectDB