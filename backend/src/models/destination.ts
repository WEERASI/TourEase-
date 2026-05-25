// src/models/destination.ts
import mongoose, { Schema } from 'mongoose';
import { IDestination } from '../types';

const DestinationSchema = new Schema<IDestination>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a destination name'],
            trim: true,
            unique: true,
        },
        location: {
            type: String,
            required: [true, 'Please provide a location'],
            trim: true,
        },
        province: {
            type: String,
            required: [true, 'Please provide a province'],
            trim: true,
        },
        categories: {
            type: [String],
            required: [true, 'Please provide at least one category'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        reviews: {
            type: Number,
            default: 0,
        },
        imageUrl: {
            type: String,
            required: [true, 'Please provide an image URL'],
        },
        longDescription: {
            type: String,
            default: '',
        },
        activities: {
            type: [String],
            default: [],
        },
        bestTime: {
            type: String,
            default: '',
        },
        weather: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Text index for search
DestinationSchema.index({ name: 'text', description: 'text', province: 'text' });

const Destination = mongoose.model<IDestination>('Destination', DestinationSchema);
export default Destination;
