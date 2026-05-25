// src/models/hotel.ts
import mongoose, { Schema } from 'mongoose';
import { IHotel } from '../types';

const RoomSchema = new Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        size: { type: String, required: true },
        beds: { type: String, required: true },
        occupancy: { type: Number, required: true },
        price: { type: Number, required: true },
        available: { type: Number, default: 0 },
        image: { type: String, default: '' },
        amenities: { type: [String], default: [] },
    },
    { _id: false }
);

const HotelSchema = new Schema<IHotel>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a hotel name'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Please provide a location'],
        },
        city: {
            type: String,
            required: [true, 'Please provide a city'],
            trim: true,
        },
        stars: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        userRating: {
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
            required: [true, 'Please provide a starting price'],
            min: 0,
        },
        imageUrl: {
            type: String,
            required: [true, 'Please provide an image URL'],
        },
        type: {
            type: String,
            required: [true, 'Please provide a property type'],
        },
        amenities: {
            type: [String],
            default: [],
        },
        isBestValue: {
            type: Boolean,
            default: false,
        },
        rooms: {
            type: [RoomSchema],
            default: [],
        },
        partner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        approvalStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        rejectionReason: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

HotelSchema.index({ name: 'text', city: 'text' });

const Hotel = mongoose.model<IHotel>('Hotel', HotelSchema);
export default Hotel;
