// src/controllers/reviewController.ts
import { Request, Response } from 'express';
import Review from '../models/review';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        req.body.user = req.user.id;

        // Check if user already reviewed this target
        const existingReview = await Review.findOne({
            user: req.user.id,
            targetType: req.body.targetType,
            targetId: req.body.targetId,
        });

        if (existingReview) {
            res.status(400).json({
                success: false,
                message: 'You have already reviewed this item',
            });
            return;
        }

        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review,
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get reviews for a specific target
// @route   GET /api/reviews/:targetType/:targetId
// @access  Public
export const getReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { targetType, targetId } = req.params;

        const reviews = await Review.find({ targetType, targetId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (owner or admin)
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404).json({ success: false, message: 'Review not found' });
            return;
        }

        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
            return;
        }

        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
