// src/controllers/transportationController.ts
import { Request, Response } from 'express';
import Transportation from '../models/transportation';

// @desc    Get all transportation with filters
// @route   GET /api/transportation
// @access  Public
export const getTransportation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serviceType, vehicleType, capacity, amenities, sort } = req.query;
        const filter: any = {};

        if (serviceType && serviceType !== 'all') {
            filter.serviceType = serviceType;
        }

        if (vehicleType) {
            const types = (vehicleType as string).split(',');
            filter.$or = types.map((t) => ({
                $or: [
                    { vehicleName: { $regex: t, $options: 'i' } },
                    { vehicleModel: { $regex: t, $options: 'i' } },
                    { category: { $regex: t, $options: 'i' } },
                    ...(t === 'Bikes' ? [{ serviceType: 'bikes' }] : []),
                ],
            }));
        }

        if (capacity) {
            const ranges = (capacity as string).split(',');
            const capacityFilter: any[] = [];
            ranges.forEach((range) => {
                if (range === '1-3 Passengers') capacityFilter.push({ passengers: { $lte: 3 } });
                if (range === '4-6 Passengers') capacityFilter.push({ passengers: { $gte: 4, $lte: 6 } });
                if (range === '7-12 Passengers') capacityFilter.push({ passengers: { $gte: 7, $lte: 12 } });
                if (range === '12+ Passengers') capacityFilter.push({ passengers: { $gt: 12 } });
            });
            if (capacityFilter.length > 0) {
                if (filter.$or) {
                    filter.$and = [{ $or: filter.$or }, { $or: capacityFilter }];
                    delete filter.$or;
                } else {
                    filter.$or = capacityFilter;
                }
            }
        }

        if (amenities) {
            const amenityList = (amenities as string).split(',');
            filter.amenities = { $all: amenityList };
        }

        let sortOption: any = {};
        switch (sort) {
            case 'Price: Low to High': sortOption = { price: 1 }; break;
            case 'User Rating': sortOption = { providerRating: -1 }; break;
            default: sortOption = { providerRating: -1 }; // Recommended
        }

        const vehicles = await Transportation.find(filter).sort(sortOption);

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles,
        });
    } catch (error) {
        console.error('Get transportation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transportation',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get single transportation
// @route   GET /api/transportation/:id
// @access  Public
export const getTransportationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const vehicle = await Transportation.findById(req.params.id);

        if (!vehicle) {
            res.status(404).json({ success: false, message: 'Vehicle not found' });
            return;
        }

        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        console.error('Get transportation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vehicle',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Create transportation
// @route   POST /api/transportation
// @access  Private/Operator/Admin
export const createTransportation = async (req: Request, res: Response): Promise<void> => {
    try {
        req.body.provider = req.user.id;
        const vehicle = await Transportation.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Transportation created successfully',
            data: vehicle,
        });
    } catch (error) {
        console.error('Create transportation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating transportation',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Update transportation
// @route   PUT /api/transportation/:id
// @access  Private/Operator/Admin
export const updateTransportation = async (req: Request, res: Response): Promise<void> => {
    try {
        const vehicle = await Transportation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!vehicle) {
            res.status(404).json({ success: false, message: 'Vehicle not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Transportation updated successfully',
            data: vehicle,
        });
    } catch (error) {
        console.error('Update transportation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating transportation',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Delete transportation
// @route   DELETE /api/transportation/:id
// @access  Private/Operator/Admin
export const deleteTransportation = async (req: Request, res: Response): Promise<void> => {
    try {
        const vehicle = await Transportation.findByIdAndDelete(req.params.id);

        if (!vehicle) {
            res.status(404).json({ success: false, message: 'Vehicle not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Transportation deleted successfully',
        });
    } catch (error) {
        console.error('Delete transportation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting transportation',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
