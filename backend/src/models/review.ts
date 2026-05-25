// src/models/review.ts
import mongoose, { Schema } from 'mongoose';
import { IReview } from '../types';

const ReviewSchema = new Schema<IReview>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user'],
        },
        targetType: {
            type: String,
            enum: ['destination', 'tour', 'hotel', 'transport'],
            required: [true, 'Please provide a target type'],
        },
        targetId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Please provide a target ID'],
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, 'Please provide a comment'],
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        },
        operatorReply: {
            text: { type: String },
            repliedAt: { type: Date },
        },
    },
    { timestamps: true }
);

// Prevent duplicate reviews
ReviewSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

const Review = mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
