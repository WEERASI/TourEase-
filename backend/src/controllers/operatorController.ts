// src/controllers/operatorController.ts
// Handles all Tour Operator-specific dashboard operations

import { Request, Response } from 'express';
import Tour from '../models/tour';
import Booking from '../models/booking';
import Review from '../models/review';
import User from '../models/user';

// @desc    Get operator dashboard statistics
// @route   GET /api/operator/dashboard
// @access  Private/Operator
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const operatorId = req.user.id;

        // Get operator's tours
        const tours = await Tour.find({ operator: operatorId });
        const tourIds = tours.map((t) => t._id);

        // Count stats
        const totalTours = tours.length;
        const activeTours = tours.filter((t) => t.status === 'active').length;
        const pendingApprovals = tours.filter((t) => t.status === 'pending').length;

        // Get bookings for operator's tours
        const bookings = await Booking.find({
            bookingType: 'tour',
            referenceId: { $in: tourIds },
        }).populate('user', 'name email');

        const totalBookings = bookings.length;
        const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
        const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

        // Revenue calculated from confirmed + completed bookings
        const totalRevenue = bookings
            .filter((b) => b.status === 'confirmed' || b.status === 'completed')
            .reduce((sum, b) => sum + b.totalPrice, 0);

        // Recent tours (last 5)
        const recentTours = tours
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);

        // Recent bookings (last 5)
        const recentBookings = bookings
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);

        // Get reviews for operator's tours
        const reviews = await Review.find({
            targetType: 'tour',
            targetId: { $in: tourIds },
        });
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalTours,
                    activeTours,
                    pendingApprovals,
                    totalBookings,
                    confirmedBookings,
                    pendingBookings,
                    totalRevenue,
                    avgRating: Math.round(avgRating * 10) / 10,
                    totalReviews: reviews.length,
                },
                recentTours,
                recentBookings,
            },
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get operator's tours with filters
// @route   GET /api/operator/tours
// @access  Private/Operator
export const getMyTours = async (req: Request, res: Response): Promise<void> => {
    try {
        const operatorId = req.user.id;
        const { search, status, type, sort } = req.query;

        const filter: any = { operator: operatorId };

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        if (status) {
            filter.status = { $in: (status as string).split(',') };
        }

        if (type) {
            filter.type = { $in: (type as string).split(',') };
        }

        let sortOption: any = { createdAt: -1 };
        switch (sort) {
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'price_asc':
                sortOption = { price: 1 };
                break;
            case 'price_desc':
                sortOption = { price: -1 };
                break;
            case 'rating':
                sortOption = { rating: -1 };
                break;
            case 'title':
                sortOption = { title: 1 };
                break;
        }

        const tours = await Tour.find(filter).sort(sortOption);

        // Get booking counts for each tour
        const tourIds = tours.map((t) => t._id);
        const bookingCounts = await Booking.aggregate([
            { $match: { bookingType: 'tour', referenceId: { $in: tourIds } } },
            { $group: { _id: '$referenceId', count: { $sum: 1 } } },
        ]);
        const bookingMap = new Map(bookingCounts.map((b: any) => [b._id.toString(), b.count]));

        // Get review counts + avg ratings
        const reviewStats = await Review.aggregate([
            { $match: { targetType: 'tour', targetId: { $in: tourIds } } },
            {
                $group: {
                    _id: '$targetId',
                    avgRating: { $avg: '$rating' },
                    count: { $sum: 1 },
                },
            },
        ]);
        const reviewMap = new Map(
            reviewStats.map((r: any) => [r._id.toString(), { avgRating: r.avgRating, count: r.count }])
        );

        const toursWithStats = tours.map((tour) => {
            const tourObj = tour.toObject();
            const id = tour._id.toString();
            return {
                ...tourObj,
                bookingCount: bookingMap.get(id) || 0,
                reviewStats: reviewMap.get(id) || { avgRating: 0, count: 0 },
            };
        });

        res.status(200).json({
            success: true,
            count: toursWithStats.length,
            data: toursWithStats,
        });
    } catch (error) {
        console.error('Get my tours error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tours',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get bookings for operator's tours
// @route   GET /api/operator/bookings
// @access  Private/Operator
export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const operatorId = req.user.id;
        const { status, tourId, search, startDate, endDate } = req.query;

        // Get operator's tour IDs
        const operatorTours = await Tour.find({ operator: operatorId }).select('_id title');
        const tourIds = operatorTours.map((t) => t._id);
        const tourNameMap = new Map(operatorTours.map((t) => [t._id.toString(), t.title]));

        const filter: any = {
            bookingType: 'tour',
            referenceId: { $in: tourIds },
        };

        if (status) {
            filter.status = { $in: (status as string).split(',') };
        }

        if (tourId) {
            filter.referenceId = tourId;
        }

        if (startDate || endDate) {
            filter.bookingDate = {};
            if (startDate) filter.bookingDate.$gte = new Date(startDate as string);
            if (endDate) filter.bookingDate.$lte = new Date(endDate as string);
        }

        let bookings = await Booking.find(filter)
            .populate('user', 'name email phone avatar')
            .sort({ createdAt: -1 });

        // Search by tourist name or booking ID
        if (search) {
            const searchStr = (search as string).toLowerCase();
            bookings = bookings.filter((b: any) => {
                const userName = b.user?.name?.toLowerCase() || '';
                const bookingId = b._id.toString().toLowerCase();
                const contactName = b.contactInfo?.name?.toLowerCase() || '';
                return userName.includes(searchStr) || bookingId.includes(searchStr) || contactName.includes(searchStr);
            });
        }

        // Attach tour name to each booking
        const bookingsWithTourName = bookings.map((b) => {
            const obj = b.toObject();
            return {
                ...obj,
                tourName: tourNameMap.get(b.referenceId.toString()) || 'Unknown Tour',
            };
        });

        res.status(200).json({
            success: true,
            count: bookingsWithTourName.length,
            data: bookingsWithTourName,
        });
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get reviews for operator's tours
// @route   GET /api/operator/reviews
// @access  Private/Operator
export const getMyReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const operatorId = req.user.id;
        const { rating, tourId } = req.query;

        // Get operator's tour IDs
        const operatorTours = await Tour.find({ operator: operatorId }).select('_id title');
        const tourIds = operatorTours.map((t) => t._id);
        const tourNameMap = new Map(operatorTours.map((t) => [t._id.toString(), t.title]));

        const filter: any = {
            targetType: 'tour',
            targetId: { $in: tourIds },
        };

        if (rating) {
            filter.rating = Number(rating);
        }

        if (tourId) {
            filter.targetId = tourId;
        }

        const reviews = await Review.find(filter)
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });

        // Rating distribution
        const ratingDist = [0, 0, 0, 0, 0]; // index 0 = 1-star, index 4 = 5-star
        let totalRating = 0;
        reviews.forEach((r) => {
            ratingDist[r.rating - 1]++;
            totalRating += r.rating;
        });

        const reviewsWithTourName = reviews.map((r) => {
            const obj = r.toObject();
            return {
                ...obj,
                tourName: tourNameMap.get(r.targetId.toString()) || 'Unknown Tour',
            };
        });

        res.status(200).json({
            success: true,
            count: reviewsWithTourName.length,
            data: {
                reviews: reviewsWithTourName,
                stats: {
                    total: reviews.length,
                    avgRating: reviews.length > 0 ? Math.round((totalRating / reviews.length) * 10) / 10 : 0,
                    ratingDistribution: {
                        1: ratingDist[0],
                        2: ratingDist[1],
                        3: ratingDist[2],
                        4: ratingDist[3],
                        5: ratingDist[4],
                    },
                },
            },
        });
    } catch (error) {
        console.error('Get my reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Reply to a review
// @route   POST /api/operator/reviews/:id/reply
// @access  Private/Operator
export const replyToReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            res.status(400).json({ success: false, message: 'Reply text is required' });
            return;
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404).json({ success: false, message: 'Review not found' });
            return;
        }

        // Verify this review is for operator's tour
        const tour = await Tour.findOne({ _id: review.targetId, operator: req.user.id });
        if (!tour) {
            res.status(403).json({ success: false, message: 'Not authorized to reply to this review' });
            return;
        }

        review.operatorReply = {
            text: text.trim(),
            repliedAt: new Date(),
        };
        await review.save();

        res.status(200).json({
            success: true,
            message: 'Reply posted successfully',
            data: review,
        });
    } catch (error) {
        console.error('Reply to review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error posting reply',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get operator revenue data
// @route   GET /api/operator/revenue
// @access  Private/Operator
export const getRevenueData = async (req: Request, res: Response): Promise<void> => {
    try {
        const operatorId = req.user.id;

        // Get operator's tour IDs and names
        const operatorTours = await Tour.find({ operator: operatorId }).select('_id title');
        const tourIds = operatorTours.map((t) => t._id);
        const tourNameMap = new Map(operatorTours.map((t) => [t._id.toString(), t.title]));

        // Get all revenue-eligible bookings
        const bookings = await Booking.find({
            bookingType: 'tour',
            referenceId: { $in: tourIds },
            status: { $in: ['confirmed', 'completed'] },
        }).sort({ createdAt: -1 });

        // Revenue by month (last 12 months)
        const monthlyRevenue: Record<string, number> = {};
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyRevenue[key] = 0;
        }

        // Revenue by tour
        const revenueByTour: Record<string, { name: string; revenue: number; bookings: number }> = {};

        bookings.forEach((b) => {
            // Monthly
            const bDate = new Date(b.createdAt);
            const monthKey = `${bDate.getFullYear()}-${String(bDate.getMonth() + 1).padStart(2, '0')}`;
            if (monthlyRevenue[monthKey] !== undefined) {
                monthlyRevenue[monthKey] += b.totalPrice;
            }

            // By tour
            const tourKey = b.referenceId.toString();
            if (!revenueByTour[tourKey]) {
                revenueByTour[tourKey] = {
                    name: tourNameMap.get(tourKey) || 'Unknown Tour',
                    revenue: 0,
                    bookings: 0,
                };
            }
            revenueByTour[tourKey].revenue += b.totalPrice;
            revenueByTour[tourKey].bookings++;
        });

        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

        // Payment history (all bookings as transactions)
        const paymentHistory = bookings.slice(0, 20).map((b) => ({
            id: b._id,
            amount: b.totalPrice,
            date: b.createdAt,
            status: b.status,
            tourName: tourNameMap.get(b.referenceId.toString()) || 'Unknown Tour',
        }));

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                monthlyRevenue,
                revenueByTour: Object.values(revenueByTour),
                paymentHistory,
            },
        });
    } catch (error) {
        console.error('Get revenue data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching revenue data',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Update operator profile
// @route   PUT /api/operator/profile
// @access  Private/Operator
export const updateOperatorProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const allowedFields = [
            'name', 'phone', 'avatar', 'bio',
            'companyName', 'businessLicense', 'businessAddress',
            'socialLinks', 'bankDetails', 'notificationPreferences',
        ];

        const updates: any = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    } catch (error) {
        console.error('Update operator profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get analytics data  
// @route   GET /api/operator/analytics
// @access  Private/Operator
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
        const operatorId = req.user.id;

        const operatorTours = await Tour.find({ operator: operatorId });
        const tourIds = operatorTours.map((t) => t._id);

        // All bookings for operator's tours
        const allBookings = await Booking.find({
            bookingType: 'tour',
            referenceId: { $in: tourIds },
        });

        // Most popular tours (by booking count)
        const tourBookingCounts: Record<string, number> = {};
        allBookings.forEach((b) => {
            const key = b.referenceId.toString();
            tourBookingCounts[key] = (tourBookingCounts[key] || 0) + 1;
        });

        const popularTours = operatorTours
            .map((t) => ({
                id: t._id,
                title: t.title,
                bookings: tourBookingCounts[t._id.toString()] || 0,
                rating: t.rating,
                price: t.price,
            }))
            .sort((a, b) => b.bookings - a.bookings)
            .slice(0, 10);

        // Bookings over time (last 12 months)
        const bookingsOverTime: Record<string, number> = {};
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            bookingsOverTime[key] = 0;
        }
        allBookings.forEach((b) => {
            const bDate = new Date(b.createdAt);
            const key = `${bDate.getFullYear()}-${String(bDate.getMonth() + 1).padStart(2, '0')}`;
            if (bookingsOverTime[key] !== undefined) {
                bookingsOverTime[key]++;
            }
        });

        // Cancellation rate
        const cancelledBookings = allBookings.filter((b) => b.status === 'cancelled').length;
        const cancellationRate = allBookings.length > 0
            ? Math.round((cancelledBookings / allBookings.length) * 100)
            : 0;

        // Group size trends
        const avgGroupSize = allBookings.length > 0
            ? Math.round(
                allBookings.reduce((sum, b) => sum + (b.guests.adults + b.guests.children), 0) / allBookings.length * 10
            ) / 10
            : 0;

        res.status(200).json({
            success: true,
            data: {
                popularTours,
                bookingsOverTime,
                cancellationRate,
                avgGroupSize,
                totalBookings: allBookings.length,
                completedBookings: allBookings.filter((b) => b.status === 'completed').length,
                totalTours: operatorTours.length,
                activeTours: operatorTours.filter((t) => t.status === 'active').length,
            },
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Update tour status (submit/activate/deactivate)
// @route   PATCH /api/operator/tours/:id/status
// @access  Private/Operator
export const updateTourStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const tour = await Tour.findOne({ _id: req.params.id, operator: req.user.id });

        if (!tour) {
            res.status(404).json({ success: false, message: 'Tour not found or not authorized' });
            return;
        }

        // Status transition rules
        const validTransitions: Record<string, string[]> = {
            draft: ['pending'],
            pending: [],   // only admin can change from pending
            approved: ['active', 'inactive'],
            rejected: ['draft'],
            active: ['inactive'],
            inactive: ['active'],
        };

        const currentStatus = tour.status || 'draft';
        if (!validTransitions[currentStatus]?.includes(status)) {
            res.status(400).json({
                success: false,
                message: `Cannot transition from '${currentStatus}' to '${status}'`,
            });
            return;
        }

        tour.status = status;
        await tour.save();

        res.status(200).json({
            success: true,
            message: `Tour status updated to '${status}'`,
            data: tour,
        });
    } catch (error) {
        console.error('Update tour status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating tour status',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
