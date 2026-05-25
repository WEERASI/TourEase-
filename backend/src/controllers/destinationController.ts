// src/controllers/destinationController.ts
import { Request, Response } from 'express';
import Destination from '../models/destination';

// @desc    Get all destinations with filters
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, province, category, minRating, sort } = req.query;
        const filter: any = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        if (province && province !== 'All Provinces') {
            filter.province = province;
        }

        if (category) {
            filter.categories = { $in: (category as string).split(',') };
        }

        if (minRating) {
            filter.rating = { $gte: Number(minRating) };
        }

        let sortOption: any = { reviews: -1 }; // Default: Most Popular
        if (sort === 'Highest Rated') sortOption = { rating: -1 };
        if (sort === 'A-Z') sortOption = { name: 1 };
        if (sort === 'Z-A') sortOption = { name: -1 };

        const destinations = await Destination.find(filter).sort(sortOption);

        res.status(200).json({
            success: true,
            count: destinations.length,
            data: destinations,
        });
    } catch (error) {
        console.error('Get destinations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching destinations',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
export const getDestination = async (req: Request, res: Response): Promise<void> => {
    try {
        const destination = await Destination.findById(req.params.id);

        if (!destination) {
            res.status(404).json({ success: false, message: 'Destination not found' });
            return;
        }

        res.status(200).json({ success: true, data: destination });
    } catch (error) {
        console.error('Get destination error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching destination',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Create destination
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = async (req: Request, res: Response): Promise<void> => {
    try {
        const destination = await Destination.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Destination created successfully',
            data: destination,
        });
    } catch (error) {
        console.error('Create destination error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating destination',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = async (req: Request, res: Response): Promise<void> => {
    try {
        const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!destination) {
            res.status(404).json({ success: false, message: 'Destination not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Destination updated successfully',
            data: destination,
        });
    } catch (error) {
        console.error('Update destination error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating destination',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = async (req: Request, res: Response): Promise<void> => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);

        if (!destination) {
            res.status(404).json({ success: false, message: 'Destination not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Destination deleted successfully',
        });
    } catch (error) {
        console.error('Delete destination error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting destination',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
