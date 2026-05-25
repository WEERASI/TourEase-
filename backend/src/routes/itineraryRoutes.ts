// src/routes/itineraryRoutes.ts
import { Router } from 'express';
import {
    createItinerary,
    getMyItineraries,
    getItinerary,
    updateItinerary,
    deleteItinerary,
} from '../controllers/itineraryController';
import { protect } from '../middleware/auth';

const router = Router();

// All itinerary routes require authentication
router.use(protect);

router.route('/')
    .post(createItinerary);

router.get('/me', getMyItineraries);

router.route('/:id')
    .get(getItinerary)
    .put(updateItinerary)
    .delete(deleteItinerary);

export default router;
