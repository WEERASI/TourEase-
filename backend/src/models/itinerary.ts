// src/models/itinerary.ts
import mongoose, { Schema } from 'mongoose';
import { IItinerary } from '../types';

const ActivitySchema = new Schema(
    {
        time: { type: String, required: true },
        type: {
            type: String,
            enum: ['destination', 'hotel', 'tour', 'transport', 'custom'],
            required: true,
        },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        cost: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ['Booked', 'Not Booked', 'Pending'],
            default: 'Not Booked',
        },
        provider: String,
        imageUrl: String,
        duration: String,
        location: String,
    },
    { _id: false }
);

const DayPlanSchema = new Schema(
    {
        dayNumber: { type: Number, required: true },
        date: { type: String, required: true },
        activities: { type: [ActivitySchema], default: [] },
    },
    { _id: false }
);

const ItinerarySchema = new Schema<IItinerary>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Itinerary must belong to a user'],
        },
        name: {
            type: String,
            required: [true, 'Please provide an itinerary name'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        startDate: {
            type: String,
            required: [true, 'Please provide a start date'],
        },
        endDate: {
            type: String,
            required: [true, 'Please provide an end date'],
        },
        travelers: {
            type: Number,
            default: 1,
            min: 1,
        },
        budget: {
            type: Number,
            default: 0,
        },
        type: {
            type: String,
            enum: ['Cultural', 'Beach', 'Adventure', 'Honeymoon', 'Family', 'Custom'],
            default: 'Custom',
        },
        status: {
            type: String,
            enum: ['Draft', 'Active', 'Completed'],
            default: 'Draft',
        },
        coverImage: {
            type: String,
            default: '',
        },
        destinationsCount: { type: Number, default: 0 },
        hotelsCount: { type: Number, default: 0 },
        toursCount: { type: Number, default: 0 },
        days: {
            type: [DayPlanSchema],
            default: [],
        },
    },
    { timestamps: true }
);

ItinerarySchema.index({ user: 1, createdAt: -1 });

const Itinerary = mongoose.model<IItinerary>('Itinerary', ItinerarySchema);
export default Itinerary;
