// src/models/tour.ts
import mongoose, { Schema } from 'mongoose';
import { ITour } from '../types';

const TourItineraryDaySchema = new Schema(
    {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        activities: { type: [String], default: [] },
    },
    { _id: false }
);

const TourSchema = new Schema<ITour>(
    {
        title: {
            type: String,
            required: [true, 'Please provide a tour title'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        duration: {
            type: String,
            required: [true, 'Please provide duration text'],
        },
        durationDays: {
            type: Number,
            required: [true, 'Please provide duration in days'],
            min: 1,
        },
        durationNights: {
            type: Number,
            min: 0,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Please provide a price'],
            min: 0,
        },
        imageUrl: {
            type: String,
            required: [true, 'Please provide an image URL'],
        },
        galleryImages: {
            type: [String],
            default: [],
        },
        videoUrl: {
            type: String,
            default: '',
        },
        badge: {
            type: String,
            enum: ['Popular', 'Featured', 'New'],
        },
        type: {
            type: String,
            enum: ['Cultural', 'Wildlife', 'Beach', 'Adventure', 'Hill Country', 'Tea Plantation'],
            required: [true, 'Please provide a tour type'],
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Moderate', 'Challenging'],
            required: [true, 'Please provide difficulty level'],
        },
        status: {
            type: String,
            enum: ['draft', 'pending', 'approved', 'rejected', 'active', 'inactive'],
            default: 'draft',
        },
        minGroupSize: {
            type: Number,
            min: 1,
            default: 1,
        },
        maxGroupSize: {
            type: Number,
            min: 1,
            default: 20,
        },
        destinations: {
            type: [String],
            default: [],
        },
        itinerary: {
            type: [TourItineraryDaySchema],
            default: [],
        },
        inclusions: {
            type: [String],
            default: [],
        },
        exclusions: {
            type: [String],
            default: [],
        },
        cancellationPolicy: {
            type: String,
            default: '',
        },
        availability: {
            type: String,
            default: 'Year-round',
        },
        notes: {
            type: String,
            default: '',
        },
        operator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

TourSchema.index({ title: 'text' });
TourSchema.index({ operator: 1, status: 1 });

const Tour = mongoose.model<ITour>('Tour', TourSchema);
export default Tour;
