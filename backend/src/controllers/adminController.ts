// src/controllers/adminController.ts
// Handles all Admin dashboard operations

import { Request, Response } from 'express';
import User from '../models/User';
import Tour from '../models/tour';
import Hotel from '../models/hotel';
import Booking from '../models/booking';
import Destination from '../models/destination';
import Review from '../models/review';

// ==========================================
// DASHBOARD STATS
// ==========================================

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const [totalUsers, totalTours, totalHotels, totalDestinations, totalBookings, totalReviews] = await Promise.all([
            User.countDocuments(),
            Tour.countDocuments(),
            Hotel.countDocuments(),
            Destination.countDocuments(),
            Booking.countDocuments(),
            Review.countDocuments(),
        ]);

        // User breakdown by role
        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } },
        ]);

        // Pending approvals
        const pendingOperators = await User.countDocuments({ role: 'tour_operator', verificationStatus: 'pending' });
        const pendingTours = await Tour.countDocuments({ status: 'pending' });
        const pendingHotels = await Hotel.countDocuments({ approvalStatus: 'pending' });

        // Revenue
        const revenueResult = await Booking.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Monthly bookings (last 8 months)
        const monthlyBookings: { month: string; count: number }[] = [];
        const now = new Date();
        for (let i = 7; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            const count = await Booking.countDocuments({
                createdAt: { $gte: d, $lte: end },
            });
            monthlyBookings.push({
                month: d.toLocaleString('default', { month: 'short' }),
                count,
            });
        }

        // Recent activity (last 10 bookings)
        const recentBookings = await Booking.find()
            .populate('user', 'name email role')
            .sort({ createdAt: -1 })
            .limit(10);

        // Popular destinations
        const popularDestinations = await Destination.find()
            .sort({ rating: -1 })
            .limit(5)
            .select('name rating reviews');

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalTours,
                totalHotels,
                totalDestinations,
                totalBookings,
                totalReviews,
                totalRevenue,
                usersByRole: usersByRole.reduce((acc: any, r: any) => {
                    acc[r._id] = r.count;
                    return acc;
                }, {}),
                pendingApprovals: {
                    operators: pendingOperators,
                    tours: pendingTours,
                    hotels: pendingHotels,
                    total: pendingOperators + pendingTours + pendingHotels,
                },
                monthlyBookings,
                recentBookings,
                popularDestinations,
            },
        });
    } catch (error) {
        console.error('Admin dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard stats' });
    }
};

// ==========================================
// USER MANAGEMENT
// ==========================================

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role, search, isActive, page = '1', limit = '20' } = req.query;
        const filter: any = {};

        if (role) filter.role = role;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [users, total] = await Promise.all([
            User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            User.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            data: users,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalResults: total,
            },
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role } = req.body;
        const validRoles = ['tourist', 'tour_operator', 'hotel_partner', 'admin'];
        if (!validRoles.includes(role)) {
            res.status(400).json({ success: false, message: 'Invalid role' });
            return;
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, message: 'Role updated', data: user });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ success: false, message: 'Error updating user role' });
    }
};

// @desc    Activate / deactivate user
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { isActive } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-password');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, message: `User ${isActive ? 'activated' : 'deactivated'}`, data: user });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ success: false, message: 'Error updating user status' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
};

// ==========================================
// OPERATOR MANAGEMENT
// ==========================================

// @desc    Get tour operators with verification info
// @route   GET /api/admin/operators
// @access  Private/Admin
export const getOperators = async (req: Request, res: Response): Promise<void> => {
    try {
        const { verificationStatus, search } = req.query;
        const filter: any = { role: 'tour_operator' };

        if (verificationStatus) filter.verificationStatus = verificationStatus;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
            ];
        }

        const operators = await User.find(filter).select('-password').sort({ createdAt: -1 });

        // Get tour counts for each operator
        const operatorIds = operators.map((o) => o._id);
        const tourCounts = await Tour.aggregate([
            { $match: { operator: { $in: operatorIds } } },
            { $group: { _id: '$operator', count: { $sum: 1 } } },
        ]);
        const tourMap = new Map(tourCounts.map((t: any) => [t._id.toString(), t.count]));

        const operatorsWithStats = operators.map((op) => ({
            ...op.toObject(),
            tourCount: tourMap.get(op._id.toString()) || 0,
        }));

        res.status(200).json({ success: true, count: operatorsWithStats.length, data: operatorsWithStats });
    } catch (error) {
        console.error('Get operators error:', error);
        res.status(500).json({ success: false, message: 'Error fetching operators' });
    }
};

// @desc    Approve or reject an operator
// @route   PUT /api/admin/operators/:id/approve
// @access  Private/Admin
export const approveOperator = async (req: Request, res: Response): Promise<void> => {
    try {
        const { action, reason } = req.body; // action: 'approve' | 'reject'

        if (!['approve', 'reject'].includes(action)) {
            res.status(400).json({ success: false, message: 'Action must be approve or reject' });
            return;
        }

        const update: any = {
            verificationStatus: action === 'approve' ? 'verified' : 'rejected',
            isApproved: action === 'approve',
        };

        const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
        if (!user) {
            res.status(404).json({ success: false, message: 'Operator not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Operator ${action === 'approve' ? 'approved' : 'rejected'}`,
            data: user,
        });
    } catch (error) {
        console.error('Approve operator error:', error);
        res.status(500).json({ success: false, message: 'Error updating operator status' });
    }
};

// ==========================================
// TOUR MANAGEMENT
// ==========================================

// @desc    Get all tours with filters
// @route   GET /api/admin/tours
// @access  Private/Admin
export const getAllTours = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, search, type } = req.query;
        const filter: any = {};

        if (status) filter.status = status;
        if (type) filter.type = type;
        if (search) filter.title = { $regex: search, $options: 'i' };

        const tours = await Tour.find(filter)
            .populate('operator', 'name email companyName')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: tours.length, data: tours });
    } catch (error) {
        console.error('Get all tours error:', error);
        res.status(500).json({ success: false, message: 'Error fetching tours' });
    }
};

// @desc    Approve or reject a tour
// @route   PUT /api/admin/tours/:id/status
// @access  Private/Admin
export const updateTourStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, reason } = req.body;
        const validStatuses = ['approved', 'rejected', 'active', 'inactive', 'pending'];

        if (!validStatuses.includes(status)) {
            res.status(400).json({ success: false, message: 'Invalid status' });
            return;
        }

        const tour = await Tour.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!tour) {
            res.status(404).json({ success: false, message: 'Tour not found' });
            return;
        }

        res.status(200).json({ success: true, message: `Tour status updated to ${status}`, data: tour });
    } catch (error) {
        console.error('Update tour status error:', error);
        res.status(500).json({ success: false, message: 'Error updating tour status' });
    }
};

// ==========================================
// HOTEL MANAGEMENT
// ==========================================

// @desc    Get all hotels with approval status
// @route   GET /api/admin/hotels
// @access  Private/Admin
export const getAllHotels = async (req: Request, res: Response): Promise<void> => {
    try {
        const { approvalStatus, search, city } = req.query;
        const filter: any = {};

        if (approvalStatus) filter.approvalStatus = approvalStatus;
        if (city) filter.city = { $regex: city, $options: 'i' };
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
            ];
        }

        const hotels = await Hotel.find(filter)
            .populate('partner', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: hotels.length, data: hotels });
    } catch (error) {
        console.error('Get all hotels error:', error);
        res.status(500).json({ success: false, message: 'Error fetching hotels' });
    }
};

// @desc    Approve or reject a hotel
// @route   PUT /api/admin/hotels/:id/approve
// @access  Private/Admin
export const approveHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const { action, reason } = req.body; // 'approve' | 'reject'

        if (!['approve', 'reject'].includes(action)) {
            res.status(400).json({ success: false, message: 'Action must be approve or reject' });
            return;
        }

        const update: any = {
            isApproved: action === 'approve',
            approvalStatus: action === 'approve' ? 'approved' : 'rejected',
            rejectionReason: action === 'reject' ? (reason || '') : '',
        };

        const hotel = await Hotel.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!hotel) {
            res.status(404).json({ success: false, message: 'Hotel not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Hotel ${action === 'approve' ? 'approved' : 'rejected'}`,
            data: hotel,
        });
    } catch (error) {
        console.error('Approve hotel error:', error);
        res.status(500).json({ success: false, message: 'Error updating hotel approval' });
    }
};

// ==========================================
// BOOKING MANAGEMENT
// ==========================================

// @desc    Get all bookings platform-wide
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, bookingType, search } = req.query;
        const filter: any = {};

        if (status) filter.status = status;
        if (bookingType) filter.bookingType = bookingType;

        let bookings = await Booking.find(filter)
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        // Search by contact name
        if (search) {
            const searchStr = (search as string).toLowerCase();
            bookings = bookings.filter((b: any) => {
                const userName = b.user?.name?.toLowerCase() || '';
                const contactName = b.contactInfo?.name?.toLowerCase() || '';
                return userName.includes(searchStr) || contactName.includes(searchStr);
            });
        }

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ success: false, message: 'Error fetching bookings' });
    }
};

// @desc    Update booking status (admin)
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatusAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

        if (!validStatuses.includes(status)) {
            res.status(400).json({ success: false, message: 'Invalid status' });
            return;
        }

        const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }

        res.status(200).json({ success: true, message: `Booking status updated to ${status}`, data: booking });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({ success: false, message: 'Error updating booking' });
    }
};

// ==========================================
// REVIEW MODERATION
// ==========================================

// @desc    Get all reviews with moderation filters
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { targetType, rating, search } = req.query;
        const filter: any = {};

        if (targetType) filter.targetType = targetType;
        if (rating) filter.rating = Number(rating);

        const reviews = await Review.find(filter)
            .populate('user', 'name email avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        console.error('Get all reviews error:', error);
        res.status(500).json({ success: false, message: 'Error fetching reviews' });
    }
};

// @desc    Delete a review (moderation)
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            res.status(404).json({ success: false, message: 'Review not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ success: false, message: 'Error deleting review' });
    }
};

// ==========================================
// ANALYTICS
// ==========================================

// @desc    Get platform-wide analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
        // Revenue over time (last 12 months)
        const monthlyRevenue: Record<string, number> = {};
        const monthlyUsers: Record<string, number> = {};
        const monthlyBookings: Record<string, number> = {};
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;

            const [revResult, userCount, bookingCount] = await Promise.all([
                Booking.aggregate([
                    { $match: { status: { $in: ['confirmed', 'completed'] }, createdAt: { $gte: start, $lte: end } } },
                    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
                ]),
                User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
                Booking.countDocuments({ createdAt: { $gte: start, $lte: end } }),
            ]);

            monthlyRevenue[key] = revResult[0]?.total || 0;
            monthlyUsers[key] = userCount;
            monthlyBookings[key] = bookingCount;
        }

        // Booking status distribution
        const bookingStatusDist = await Booking.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        // Booking type distribution
        const bookingTypeDist = await Booking.aggregate([
            { $group: { _id: '$bookingType', count: { $sum: 1 } } },
        ]);

        // Top tours by bookings
        const topTours = await Booking.aggregate([
            { $match: { bookingType: 'tour' } },
            { $group: { _id: '$referenceId', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        // Populate tour names
        const tourIds = topTours.map((t: any) => t._id);
        const tours = await Tour.find({ _id: { $in: tourIds } }).select('title');
        const tourNameMap = new Map(tours.map((t) => [t._id.toString(), t.title]));

        const topToursWithNames = topTours.map((t: any) => ({
            id: t._id,
            title: tourNameMap.get(t._id.toString()) || 'Unknown',
            bookings: t.count,
            revenue: t.revenue,
        }));

        // Top destinations
        const topDestinations = await Destination.find()
            .sort({ rating: -1, reviews: -1 })
            .limit(10)
            .select('name rating reviews imageUrl');

        res.status(200).json({
            success: true,
            data: {
                monthlyRevenue,
                monthlyUsers,
                monthlyBookings,
                bookingStatusDist: bookingStatusDist.reduce((acc: any, r: any) => { acc[r._id] = r.count; return acc; }, {}),
                bookingTypeDist: bookingTypeDist.reduce((acc: any, r: any) => { acc[r._id] = r.count; return acc; }, {}),
                topTours: topToursWithNames,
                topDestinations,
            },
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ success: false, message: 'Error fetching analytics' });
    }
};

// ==========================================
// PLATFORM SETTINGS
// ==========================================

// In-memory settings (in production, store in DB or config collection)
let platformSettings = {
    commissionRate: 10,
    platformName: 'TourEase',
    supportEmail: 'support@tourease.lk',
    defaultCurrency: 'LKR',
    minBookingNotice: 24,
    maxCancellationDays: 7,
    autoApproveOperators: false,
    autoApproveTours: false,
    autoApproveHotels: false,
    maintenanceMode: false,
};

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSettings = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ success: true, data: platformSettings });
};

// @desc    Update platform settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        platformSettings = { ...platformSettings, ...req.body };
        res.status(200).json({ success: true, message: 'Settings updated', data: platformSettings });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ success: false, message: 'Error updating settings' });
    }
};
