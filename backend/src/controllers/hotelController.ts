// src/controllers/hotelController.ts
import { Request, Response } from 'express';
import Hotel from '../models/hotel';

// @desc    Get all hotels with filters
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, city, maxPrice, stars, minRating, amenities, propertyType, sort } = req.query;
        const filter: any = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
            ];
        }

        if (city && city !== 'All Locations') {
            filter.city = city;
        }

        if (maxPrice) {
            filter.price = { $lte: Number(maxPrice) };
        }

        if (stars) {
            filter.stars = { $in: (stars as string).split(',').map(Number) };
        }

        if (minRating) {
            filter.userRating = { $gte: Number(minRating) };
        }

        if (amenities) {
            const amenityList = (amenities as string).split(',').map((a) => a.toLowerCase());
            filter.amenities = { $all: amenityList };
        }

        if (propertyType) {
            filter.type = { $in: (propertyType as string).split(',') };
        }

        let sortOption: any = {};
        switch (sort) {
            case 'Price: Low to High': sortOption = { price: 1 }; break;
            case 'Price: High to Low': sortOption = { price: -1 }; break;
            case 'Star Rating': sortOption = { stars: -1 }; break;
            case 'User Rating': sortOption = { userRating: -1 }; break;
            default: sortOption = { userRating: -1 }; // Recommended
        }

        const hotels = await Hotel.find(filter).sort(sortOption);

        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels,
        });
    } catch (error) {
        console.error('Get hotels error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hotels',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get single hotel (with rooms)
// @route   GET /api/hotels/:id
// @access  Public
export const getHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            res.status(404).json({ success: false, message: 'Hotel not found' });
            return;
        }

        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        console.error('Get hotel error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hotel',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Create hotel
// @route   POST /api/hotels
// @access  Private/HotelPartner/Admin
export const createHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        req.body.partner = req.user.id;
        const hotel = await Hotel.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Hotel created successfully',
            data: hotel,
        });
    } catch (error) {
        console.error('Create hotel error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating hotel',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/HotelPartner/Admin
export const updateHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!hotel) {
            res.status(404).json({ success: false, message: 'Hotel not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Hotel updated successfully',
            data: hotel,
        });
    } catch (error) {
        console.error('Update hotel error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating hotel',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/HotelPartner/Admin
export const deleteHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);

        if (!hotel) {
            res.status(404).json({ success: false, message: 'Hotel not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Hotel deleted successfully',
        });
    } catch (error) {
        console.error('Delete hotel error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting hotel',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
