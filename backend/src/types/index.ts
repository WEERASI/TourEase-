// src/types/index.ts
// TypeScript interfaces and types for the entire application

import { Document, Types } from 'mongoose';

// ==========================================
// USER TYPES
// ==========================================

export enum UserRole {
  TOURIST = 'tourist',
  TOUR_OPERATOR = 'tour_operator',
  HOTEL_PARTNER = 'hotel_partner',
  ADMIN = 'admin',
}

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface IBankDetails {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  branchCode?: string;
}

export interface IVerificationDocument {
  type: 'business_license' | 'tourism_cert' | 'insurance';
  url: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  googleId?: string;
  authProvider: 'local' | 'google';
  isEmailVerified: boolean;
  isApproved: boolean;
  isActive: boolean;

  // Operator-specific profile fields
  companyName?: string;
  businessLicense?: string;
  businessAddress?: string;
  bio?: string;
  socialLinks?: ISocialLinks;
  bankDetails?: IBankDetails;
  verificationStatus?: 'not_verified' | 'pending' | 'verified' | 'rejected';
  verificationDocuments?: IVerificationDocument[];
  notificationPreferences?: {
    newBooking: boolean;
    cancellation: boolean;
    payment: boolean;
    approval: boolean;
    reviews: boolean;
  };

  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// ==========================================
// DESTINATION TYPES
// ==========================================

export interface IDestination extends Document {
  name: string;
  location: string;
  province: string;
  categories: string[];
  description: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  longDescription: string;
  activities: string[];
  bestTime: string;
  weather: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// TOUR TYPES
// ==========================================

export type TourDifficulty = 'Easy' | 'Moderate' | 'Challenging';
export type TourType = 'Cultural' | 'Wildlife' | 'Beach' | 'Adventure' | 'Hill Country' | 'Tea Plantation';
export type TourBadge = 'Popular' | 'Featured' | 'New';
export type TourStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';

export interface ITourItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface ITour extends Document {
  title: string;
  description?: string;
  duration: string;
  durationDays: number;
  durationNights?: number;
  rating: number;
  price: number;
  imageUrl: string;
  galleryImages?: string[];
  videoUrl?: string;
  badge?: TourBadge;
  type: TourType;
  difficulty: TourDifficulty;
  status: TourStatus;
  minGroupSize?: number;
  maxGroupSize?: number;
  destinations?: string[];
  itinerary?: ITourItineraryDay[];
  inclusions: string[];
  exclusions?: string[];
  cancellationPolicy?: string;
  availability?: string;
  notes?: string;
  operator?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// HOTEL TYPES
// ==========================================

export interface IRoom {
  id: string;
  name: string;
  size: string;
  beds: string;
  occupancy: number;
  price: number;
  available: number;
  image: string;
  amenities: string[];
}

export interface IHotel extends Document {
  name: string;
  location: string;
  city: string;
  stars: number;
  userRating: number;
  reviews: number;
  price: number;
  imageUrl: string;
  type: string;
  amenities: string[];
  isBestValue: boolean;
  rooms: IRoom[];
  partner?: Types.ObjectId;
  isApproved: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// TRANSPORTATION TYPES
// ==========================================

export type VehicleCategory = 'Economy' | 'Comfort' | 'Premium' | 'Luxury';
export type ServiceType = 'airport' | 'intercity' | 'rentals' | 'bikes';
export type PriceType = 'per trip' | 'per day';

export interface ITransportation extends Document {
  vehicleName: string;
  vehicleModel: string;
  category: VehicleCategory;
  serviceType: ServiceType;
  passengers: number;
  luggage: number;
  imageUrl: string;
  providerName: string;
  providerRating: number;
  reviews: number;
  price: number;
  priceType: PriceType;
  fuelPolicy: string;
  driverIncluded: boolean;
  amenities: string[];
  provider?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// BOOKING TYPES
// ==========================================

export type BookingType = 'tour' | 'hotel' | 'transport';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface IBooking extends Document {
  user: Types.ObjectId;
  bookingType: BookingType;
  referenceId: Types.ObjectId;
  bookingDate: Date;
  guests: {
    adults: number;
    children: number;
  };
  totalPrice: number;
  status: BookingStatus;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// ITINERARY TYPES
// ==========================================

export type ItineraryStatus = 'Draft' | 'Active' | 'Completed';
export type ActivityType = 'destination' | 'hotel' | 'tour' | 'transport' | 'custom';
export type ActivityBookingStatus = 'Booked' | 'Not Booked' | 'Pending';
export type ItineraryType = 'Cultural' | 'Beach' | 'Adventure' | 'Honeymoon' | 'Family' | 'Custom';

export interface IActivity {
  time: string;
  type: ActivityType;
  title: string;
  description: string;
  cost: number;
  status: ActivityBookingStatus;
  provider?: string;
  imageUrl?: string;
  duration?: string;
  location?: string;
}

export interface IDayPlan {
  dayNumber: number;
  date: string;
  activities: IActivity[];
}

export interface IItinerary extends Document {
  user: Types.ObjectId;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  type: ItineraryType;
  status: ItineraryStatus;
  coverImage: string;
  destinationsCount: number;
  hotelsCount: number;
  toursCount: number;
  days: IDayPlan[];
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// REVIEW TYPES
// ==========================================

export type ReviewTargetType = 'destination' | 'tour' | 'hotel' | 'transport';

export interface IReview extends Document {
  user: Types.ObjectId;
  targetType: ReviewTargetType;
  targetId: Types.ObjectId;
  rating: number;
  comment: string;
  operatorReply?: {
    text: string;
    repliedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// REQUEST/RESPONSE TYPES
// ==========================================

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  name: string;
  role: UserRole;
  phone?: string;
}

export interface GoogleAuthRequest {
  credential: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}