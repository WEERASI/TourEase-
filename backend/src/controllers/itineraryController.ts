// src/controllers/itineraryController.ts
import { Request, Response } from 'express';
import Itinerary from '../models/itinerary';

// @desc    Create a new itinerary
// @route   POST /api/itineraries
// @access  Private
export const createItinerary = async (req: Request, res: Response): Promise<void> => {
    try {
        req.body.user = req.user.id;
        const itinerary = await Itinerary.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Itinerary created successfully',
            data: itinerary,
        });
    } catch (error) {
        console.error('Create itinerary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating itinerary',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get logged-in user's itineraries
// @route   GET /api/itineraries/me
// @access  Private
export const getMyItineraries = async (req: Request, res: Response): Promise<void> => {
    try {
        const itineraries = await Itinerary.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: itineraries.length,
            data: itineraries,
        });
    } catch (error) {
        console.error('Get my itineraries error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching itineraries',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get single itinerary by ID
// @route   GET /api/itineraries/:id
// @access  Private
export const getItinerary = async (req: Request, res: Response): Promise<void> => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            res.status(404).json({ success: false, message: 'Itinerary not found' });
            return;
        }

        // Ensure user can only see their own itineraries
        if (itinerary.user.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        res.status(200).json({ success: true, data: itinerary });
    } catch (error) {
        console.error('Get itinerary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching itinerary',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Update itinerary
// @route   PUT /api/itineraries/:id
// @access  Private (owner)
export const updateItinerary = async (req: Request, res: Response): Promise<void> => {
    try {
        let itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            res.status(404).json({ success: false, message: 'Itinerary not found' });
            return;
        }

        if (itinerary.user.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        itinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Itinerary updated successfully',
            data: itinerary,
        });
    } catch (error) {
        console.error('Update itinerary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating itinerary',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Delete itinerary
// @route   DELETE /api/itineraries/:id
// @access  Private (owner)
export const deleteItinerary = async (req: Request, res: Response): Promise<void> => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            res.status(404).json({ success: false, message: 'Itinerary not found' });
            return;
        }

        if (itinerary.user.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        await Itinerary.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Itinerary deleted successfully',
        });
    } catch (error) {
        console.error('Delete itinerary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting itinerary',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
