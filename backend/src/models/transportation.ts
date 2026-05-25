// src/models/transportation.ts
import mongoose, { Schema } from 'mongoose';
import { ITransportation } from '../types';

const TransportationSchema = new Schema<ITransportation>(
    {
        vehicleName: {
            type: String,
            required: [true, 'Please provide a vehicle name'],
            trim: true,
        },
        vehicleModel: {
            type: String,
            required: [true, 'Please provide a vehicle model description'],
        },
        category: {
            type: String,
            enum: ['Economy', 'Comfort', 'Premium', 'Luxury'],
            required: [true, 'Please provide a category'],
        },
        serviceType: {
            type: String,
            enum: ['airport', 'intercity', 'rentals', 'bikes'],
            required: [true, 'Please provide a service type'],
        },
        passengers: {
            type: Number,
            required: true,
            min: 1,
        },
        luggage: {
            type: Number,
            default: 0,
        },
        imageUrl: {
            type: String,
            required: [true, 'Please provide an image URL'],
        },
        providerName: {
            type: String,
            required: [true, 'Please provide a provider name'],
        },
        providerRating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        reviews: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Please provide a price'],
            min: 0,
        },
        priceType: {
            type: String,
            enum: ['per trip', 'per day'],
            required: true,
        },
        fuelPolicy: {
            type: String,
            default: '',
        },
        driverIncluded: {
            type: Boolean,
            default: false,
        },
        amenities: {
            type: [String],
            default: [],
        },
        provider: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const Transportation = mongoose.model<ITransportation>('Transportation', TransportationSchema);
export default Transportation;
