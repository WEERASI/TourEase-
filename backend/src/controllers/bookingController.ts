// src/controllers/bookingController.ts
import { Request, Response } from 'express';
import Booking from '../models/booking';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        req.body.user = req.user.id;
        const booking = await Booking.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking,
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/me
// @access  Private
export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
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

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const booking = await Booking.findById(req.params.id).populate('user', 'name email');

        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }

        // Ensure user can only see their own bookings (unless admin/operator)
        if (
            booking.user.toString() !== req.user.id &&
            req.user.role !== 'admin' &&
            req.user.role !== 'tour_operator'
        ) {
            res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
            return;
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private/Operator/Admin
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            res.status(400).json({ success: false, message: 'Invalid status value' });
            return;
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Booking status updated to ${status}`,
            data: booking,
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking status',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Cancel booking (by owner)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }

        if (booking.user.toString() !== req.user.id) {
            res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
            return;
        }

        if (booking.status === 'cancelled') {
            res.status(400).json({ success: false, message: 'Booking is already cancelled' });
            return;
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking,
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
