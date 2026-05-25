// src/models/User.ts
// User model for authentication and user management

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser, UserRole } from '../types';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [function (this: any) { return this.authProvider === 'local'; }, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.TOURIST,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Operator-specific profile fields
    companyName: { type: String, trim: true },
    businessLicense: { type: String, trim: true },
    businessAddress: { type: String, trim: true },
    bio: { type: String, maxlength: 1000 },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      website: String,
    },
    bankDetails: {
      bankName: String,
      accountName: String,
      accountNumber: String,
      branchCode: String,
    },
    verificationStatus: {
      type: String,
      enum: ['not_verified', 'pending', 'verified', 'rejected'],
      default: 'not_verified',
    },
    verificationDocuments: [
      {
        type: { type: String, enum: ['business_license', 'tourism_cert', 'insurance'] },
        url: String,
        uploadedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      },
    ],
    notificationPreferences: {
      newBooking: { type: Boolean, default: true },
      cancellation: { type: Boolean, default: true },
      payment: { type: Boolean, default: true },
      approval: { type: Boolean, default: true },
      reviews: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function (): string {
  const payload = {
    id: this._id,
    email: this.email,
    role: this.role,
  };

  const secret = process.env.JWT_SECRET || 'default-secret-change-this';

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRE || '7d') as any,
  });
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;