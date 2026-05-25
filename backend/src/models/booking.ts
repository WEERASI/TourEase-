// src/models/booking.ts
import mongoose, { Schema } from 'mongoose';
import { IBooking } from '../types';

const BookingSchema = new Schema<IBooking>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Booking must belong to a user'],
        },
        bookingType: {
            type: String,
            enum: ['tour', 'hotel', 'transport'],
            required: [true, 'Please provide a booking type'],
        },
        referenceId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Please provide a reference ID'],
        },
        bookingDate: {
            type: Date,
            required: [true, 'Please provide a booking date'],
        },
        guests: {
            adults: { type: Number, default: 1, min: 1 },
            children: { type: Number, default: 0, min: 0 },
        },
        totalPrice: {
            type: Number,
            required: [true, 'Please provide the total price'],
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
        contactInfo: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
        },
        specialRequests: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Index for faster user-specific queries
BookingSchema.index({ user: 1, createdAt: -1 });

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
