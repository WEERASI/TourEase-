// src/controllers/tourController.ts
import { Request, Response } from 'express';
import Tour from '../models/tour';

// @desc    Get all tours with filters
// @route   GET /api/tours
// @access  Public
export const getTours = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, type, difficulty, maxPrice, minRating, duration, sort } = req.query;

        // Build $and conditions array for proper filter composition
        const andConditions: any[] = [];

        // Only show explicitly approved or active tours to the public
        andConditions.push({ status: { $in: ['approved', 'active'] } });

        const filter: any = {};

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        if (type) {
            filter.type = { $in: (type as string).split(',') };
        }

        if (difficulty) {
            filter.difficulty = { $in: (difficulty as string).split(',') };
        }

        if (maxPrice) {
            filter.price = { $lte: Number(maxPrice) };
        }

        if (minRating) {
            filter.rating = { $gte: Number(minRating) };
        }

        if (duration) {
            const ranges = (duration as string).split(',');
            const durationFilter: any[] = [];
            ranges.forEach((range) => {
                if (range === '1-2 Days') durationFilter.push({ durationDays: { $lte: 2 } });
                if (range === '3-4 Days') durationFilter.push({ durationDays: { $gte: 3, $lte: 4 } });
                if (range === '5-7 Days') durationFilter.push({ durationDays: { $gte: 5, $lte: 7 } });
                if (range === '8+ Days') durationFilter.push({ durationDays: { $gte: 8 } });
            });
            if (durationFilter.length > 0) {
                andConditions.push({ $or: durationFilter });
            }
        }

        // Combine all conditions
        const finalFilter = { ...filter, $and: andConditions };

        let sortOption: any = {};
        switch (sort) {
            case 'Price: Low to High': sortOption = { price: 1 }; break;
            case 'Price: High to Low': sortOption = { price: -1 }; break;
            case 'Highest Rated': sortOption = { rating: -1 }; break;
            case 'Shortest First': sortOption = { durationDays: 1 }; break;
            case 'Longest First': sortOption = { durationDays: -1 }; break;
            default: sortOption = { rating: -1 }; // Recommended
        }

        const tours = await Tour.find(finalFilter).sort(sortOption);

        res.status(200).json({
            success: true,
            count: tours.length,
            data: tours,
        });
    } catch (error) {
        console.error('Get tours error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tours',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get single tour
// @route   GET /api/tours/:id
// @access  Public
export const getTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const tour = await Tour.findById(req.params.id).populate('operator', 'name email');

        if (!tour) {
            res.status(404).json({ success: false, message: 'Tour not found' });
            return;
        }

        res.status(200).json({ success: true, data: tour });
    } catch (error) {
        console.error('Get tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tour',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Create tour
// @route   POST /api/tours
// @access  Private/Operator/Admin
export const createTour = async (req: Request, res: Response): Promise<void> => {
    try {
        // Attach operator from logged-in user
        req.body.operator = req.user.id;
        const tour = await Tour.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Tour created successfully',
            data: tour,
        });
    } catch (error) {
        console.error('Create tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating tour',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private/Operator/Admin
export const updateTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!tour) {
            res.status(404).json({ success: false, message: 'Tour not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Tour updated successfully',
            data: tour,
        });
    } catch (error) {
        console.error('Update tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating tour',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Delete tour
// @route   DELETE /api/tours/:id
// @access  Private/Operator/Admin
export const deleteTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if (!tour) {
            res.status(404).json({ success: false, message: 'Tour not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Tour deleted successfully',
        });
    } catch (error) {
        console.error('Delete tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting tour',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
