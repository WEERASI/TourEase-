// src/seed.ts
// Database Seed Script — Populates MongoDB with initial data from frontend hardcoded arrays

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './models/destination';
import Tour from './models/tour';
import Hotel from './models/hotel';
import Transportation from './models/transportation';

dotenv.config();

const DESTINATIONS_DATA = [
    {
        name: 'Sigiriya',
        location: 'Central Province',
        province: 'Central Province',
        categories: ['Cultural', 'Historical'],
        description: 'Ancient rock fortress and UNESCO World Heritage Site rising 200m above the jungle.',
        rating: 4.8,
        reviews: 2453,
        imageUrl: 'https://images.unsplash.com/photo-1586613835341-d478e8cfde2e?auto=format&fit=crop&q=80&w=600',
        longDescription: 'Sigiriya, also known as Lion Rock, is an ancient rock fortress located in the northern Matale District near the town of Dambulla. Built during the reign of King Kashyapa (477-495 AD), the site is one of the best-preserved examples of ancient urban planning.',
        activities: ['Rock Climbing', 'Frescoes Viewing', 'Garden Tours', 'Photography', 'Bird Watching'],
        bestTime: 'January to April',
        weather: 'Tropical, 27-30°C',
    },
    {
        name: 'Ella',
        location: 'Uva Province',
        province: 'Uva Province',
        categories: ['Nature', 'Adventure'],
        description: 'Charming hill country town with stunning views, tea plantations, and epic train rides.',
        rating: 4.7,
        reviews: 1876,
        imageUrl: 'https://images.unsplash.com/photo-1578005343379-d1f816e94b73?auto=format&fit=crop&q=80&w=600',
        longDescription: 'Ella is a small town nestled in the hill country of Sri Lanka, surrounded by lush green hills, tea plantations, and breathtaking views. It is famous for the scenic train ride, Nine Arches Bridge, and Little Adam\'s Peak.',
        activities: ['Hiking', 'Train Rides', 'Tea Tasting', 'Waterfall Visits', 'Rock Climbing'],
        bestTime: 'January to March',
        weather: 'Cool, 15-25°C',
    },
    {
        name: 'Galle Fort',
        location: 'Southern Province',
        province: 'Southern Province',
        categories: ['Cultural', 'Beach'],
        description: 'Historic Dutch fort blending colonial architecture, boutique shops, and ocean views.',
        rating: 4.6,
        reviews: 1432,
        imageUrl: 'https://images.unsplash.com/photo-1588598198321-9735fd510f44?auto=format&fit=crop&q=80&w=600',
        longDescription: 'Galle Fort, in the Bay of Galle on the southwest coast, was first fortified by the Portuguese in 1588. The Dutch extensively rebuilt it from 1649 onward, creating the largest remaining European-built fortress in Asia.',
        activities: ['Walking Tours', 'Shopping', 'Photography', 'Beach Visits', 'Museum Visits'],
        bestTime: 'December to March',
        weather: 'Tropical, 26-30°C',
    },
    {
        name: 'Kandy',
        location: 'Central Province',
        province: 'Central Province',
        categories: ['Cultural', 'Religious'],
        description: 'Sacred city home to the Temple of the Tooth Relic and vibrant Esala Perahera festival.',
        rating: 4.5,
        reviews: 2100,
        imageUrl: 'https://images.unsplash.com/photo-1580975789081-7eb1b01be500?auto=format&fit=crop&q=80&w=600',
        longDescription: 'Kandy is a major city in Sri Lanka, set on a plateau surrounded by mountains. It is the cultural capital and home to the Temple of the Tooth Relic (Sri Dalada Maligawa), one of the most sacred places of worship in the Buddhist world.',
        activities: ['Temple Visits', 'Perahera Festival', 'Botanical Garden', 'Lake Walks', 'Cultural Shows'],
        bestTime: 'January to April',
        weather: 'Cool, 20-28°C',
    },
    {
        name: 'Mirissa',
        location: 'Southern Province',
        province: 'Southern Province',
        categories: ['Beach', 'Wildlife'],
        description: 'Tropical paradise known for whale watching, golden beaches, and vibrant nightlife.',
        rating: 4.5,
        reviews: 1654,
        imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=600',
        longDescription: 'Mirissa is a small town on the south coast of Sri Lanka. It is a popular destination for whale watching, surfing, and enjoying the beautiful beaches. The town is known for its laid-back atmosphere and picturesque sunset views.',
        activities: ['Whale Watching', 'Surfing', 'Beach Activities', 'Snorkeling', 'Nightlife'],
        bestTime: 'November to April',
        weather: 'Tropical, 27-31°C',
    },
    {
        name: 'Yala National Park',
        location: 'Southern Province',
        province: 'Southern Province',
        categories: ['Wildlife', 'Nature'],
        description: 'Sri Lanka\'s most famous national park with the highest density of leopards in the world.',
        rating: 4.7,
        reviews: 1920,
        imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=600',
        longDescription: 'Yala National Park is the most visited and second largest national park in Sri Lanka. It is famous for its high density of leopards and diverse wildlife including elephants, sloth bears, crocodiles, and numerous bird species.',
        activities: ['Safari Tours', 'Bird Watching', 'Photography', 'Camping', 'Nature Walks'],
        bestTime: 'February to July',
        weather: 'Hot, 27-35°C',
    },
];

const TOURS_DATA = [
    {
        title: 'Sigiriya Rock Fortress Trek',
        duration: '1 Day',
        durationDays: 1,
        rating: 4.9,
        price: 12500,
        imageUrl: 'https://images.unsplash.com/photo-1586613835341-d478e8cfde2e?auto=format&fit=crop&q=80&w=600',
        badge: 'Popular',
        type: 'Cultural',
        difficulty: 'Moderate',
        inclusions: ['Guide', 'Entrance Fees', 'Lunch', 'Transport'],
    },
    {
        title: 'Ella Adventure & Tea Trails',
        duration: '2 Days / 1 Night',
        durationDays: 2,
        rating: 4.8,
        price: 28000,
        imageUrl: 'https://images.unsplash.com/photo-1578005343379-d1f816e94b73?auto=format&fit=crop&q=80&w=600',
        badge: 'Featured',
        type: 'Adventure',
        difficulty: 'Moderate',
        inclusions: ['Guide', 'Accommodation', 'Meals', 'Transport', 'Tea Factory Visit'],
    },
    {
        title: 'Yala Safari Experience',
        duration: '1 Day',
        durationDays: 1,
        rating: 4.7,
        price: 15000,
        imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600',
        type: 'Wildlife',
        difficulty: 'Easy',
        inclusions: ['Jeep Safari', 'Guide', 'Lunch', 'Park Fees'],
    },
    {
        title: 'Galle Fort Heritage Walk',
        duration: 'Half Day',
        durationDays: 1,
        rating: 4.6,
        price: 5500,
        imageUrl: 'https://images.unsplash.com/photo-1588598198321-9735fd510f44?auto=format&fit=crop&q=80&w=600',
        type: 'Cultural',
        difficulty: 'Easy',
        inclusions: ['Guide', 'Refreshments'],
    },
    {
        title: 'Mirissa Whale Watching',
        duration: '1 Day',
        durationDays: 1,
        rating: 4.8,
        price: 9500,
        imageUrl: 'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&q=80&w=600',
        badge: 'Popular',
        type: 'Wildlife',
        difficulty: 'Easy',
        inclusions: ['Boat Ride', 'Guide', 'Breakfast', 'Life Jacket'],
    },
    {
        title: 'Kandy Cultural Immersion',
        duration: '2 Days / 1 Night',
        durationDays: 2,
        rating: 4.5,
        price: 22000,
        imageUrl: 'https://images.unsplash.com/photo-1580975789081-7eb1b01be500?auto=format&fit=crop&q=80&w=600',
        type: 'Cultural',
        difficulty: 'Easy',
        inclusions: ['Guide', 'Accommodation', 'Meals', 'Transport', 'Temple Visit'],
    },
    {
        title: 'Adam\'s Peak Sunrise Trek',
        duration: '1 Day',
        durationDays: 1,
        rating: 4.9,
        price: 8500,
        imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=600',
        badge: 'New',
        type: 'Adventure',
        difficulty: 'Challenging',
        inclusions: ['Guide', 'Breakfast', 'Transport', 'Headlamp'],
    },
    {
        title: 'Nuwara Eliya Tea Country',
        duration: '3 Days / 2 Nights',
        durationDays: 3,
        rating: 4.6,
        price: 35000,
        imageUrl: 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?auto=format&fit=crop&q=80&w=600',
        type: 'Tea Plantation',
        difficulty: 'Easy',
        inclusions: ['Guide', 'Accommodation', 'Meals', 'Transport', 'Factory Tours', 'Tea Tasting'],
    },
];

const HOTELS_DATA = [
    {
        name: 'Heritance Kandalama',
        location: 'Dambulla, near Sigiriya',
        city: 'Dambulla',
        stars: 5,
        userRating: 4.8,
        reviews: 1234,
        price: 45000,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
        type: 'Resort',
        amenities: ['pool', 'spa', 'wifi', 'restaurant', 'gym', 'bar'],
        isBestValue: false,
        rooms: [
            { id: 'r1', name: 'Deluxe Room', size: '35 sq m', beds: '1 King Bed', occupancy: 2, price: 45000, available: 5, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['wifi', 'minibar', 'room service', 'balcony'] },
            { id: 'r2', name: 'Superior Suite', size: '55 sq m', beds: '1 King Bed + Sofa', occupancy: 3, price: 68000, available: 3, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['wifi', 'minibar', 'room service', 'balcony', 'living area'] },
            { id: 'r3', name: 'Presidential Suite', size: '90 sq m', beds: '1 King Bed + Living Room', occupancy: 4, price: 120000, available: 1, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['wifi', 'minibar', 'room service', 'private pool', 'butler'] },
        ],
    },
    {
        name: '98 Acres Resort & Spa',
        location: 'Ella, Hill Country',
        city: 'Ella',
        stars: 4,
        userRating: 4.9,
        reviews: 876,
        price: 38000,
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=600',
        type: 'Boutique',
        amenities: ['spa', 'wifi', 'restaurant', 'bar', 'garden'],
        isBestValue: true,
        rooms: [
            { id: 'r4', name: 'Standard Chalet', size: '30 sq m', beds: '1 Double Bed', occupancy: 2, price: 38000, available: 8, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['wifi', 'mountain view', 'tea maker'] },
            { id: 'r5', name: 'Deluxe Chalet', size: '45 sq m', beds: '1 King Bed', occupancy: 2, price: 52000, available: 4, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['wifi', 'mountain view', 'tea maker', 'balcony', 'minibar'] },
        ],
    },
    {
        name: 'Jetwing Lighthouse',
        location: 'Galle, Southern Coast',
        city: 'Galle',
        stars: 5,
        userRating: 4.7,
        reviews: 1567,
        price: 52000,
        imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=600',
        type: 'Resort',
        amenities: ['pool', 'spa', 'wifi', 'restaurant', 'gym', 'beach access', 'bar'],
        isBestValue: false,
        rooms: [
            { id: 'r6', name: 'Superior Room', size: '40 sq m', beds: '1 King Bed', occupancy: 2, price: 52000, available: 6, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['wifi', 'ocean view', 'minibar'] },
            { id: 'r7', name: 'Themed Suite', size: '70 sq m', beds: '1 King Bed + Lounge', occupancy: 3, price: 85000, available: 2, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['wifi', 'ocean view', 'minibar', 'private terrace', 'jacuzzi'] },
        ],
    },
    {
        name: 'Cinnamon Wild Yala',
        location: 'Yala, Southern Province',
        city: 'Yala',
        stars: 4,
        userRating: 4.5,
        reviews: 920,
        price: 35000,
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=600',
        type: 'Resort',
        amenities: ['pool', 'wifi', 'restaurant', 'safari desk', 'garden'],
        isBestValue: false,
        rooms: [
            { id: 'r8', name: 'Jungle Chalet', size: '32 sq m', beds: '1 Double Bed', occupancy: 2, price: 35000, available: 10, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['wifi', 'nature view', 'fan'] },
            { id: 'r9', name: 'Luxury Cabin', size: '50 sq m', beds: '1 King Bed', occupancy: 2, price: 55000, available: 4, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['wifi', 'nature view', 'air conditioning', 'minibar', 'outdoor shower'] },
        ],
    },
    {
        name: 'The Fortress Resort & Spa',
        location: 'Koggala, Southern Coast',
        city: 'Koggala',
        stars: 5,
        userRating: 4.6,
        reviews: 1100,
        price: 58000,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600',
        type: 'Resort',
        amenities: ['pool', 'spa', 'wifi', 'restaurant', 'gym', 'beach access', 'bar', 'tennis'],
        isBestValue: false,
        rooms: [
            { id: 'r10', name: 'Beach Room', size: '42 sq m', beds: '1 King Bed', occupancy: 2, price: 58000, available: 7, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['wifi', 'beach view', 'minibar', 'rain shower'] },
        ],
    },
    {
        name: 'Back of Beyond Pidurangala',
        location: 'Pidurangala, Sigiriya',
        city: 'Sigiriya',
        stars: 3,
        userRating: 4.4,
        reviews: 340,
        price: 12000,
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600',
        type: 'Eco Lodge',
        amenities: ['wifi', 'restaurant', 'garden', 'nature trails'],
        isBestValue: true,
        rooms: [
            { id: 'r11', name: 'Eco Room', size: '25 sq m', beds: '1 Double Bed', occupancy: 2, price: 12000, available: 6, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['fan', 'nature view', 'shared bathroom'] },
            { id: 'r12', name: 'Treehouse Suite', size: '35 sq m', beds: '1 Queen Bed', occupancy: 2, price: 22000, available: 2, image: 'https://images.unsplash.com/photo-1590490360182-c33d7b340009?auto=format&fit=crop&q=80&w=300', amenities: ['fan', 'nature view', 'private bathroom', 'balcony'] },
        ],
    },
];

const TRANSPORTATION_DATA = [
    {
        vehicleName: 'Toyota Prius',
        vehicleModel: 'Comfortable sedan for city & intercity travel',
        category: 'Economy',
        serviceType: 'intercity',
        passengers: 3,
        luggage: 2,
        imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=400',
        providerName: 'Ceylon Cabs',
        providerRating: 4.7,
        reviews: 342,
        price: 8500,
        priceType: 'per trip',
        fuelPolicy: 'Fuel included',
        driverIncluded: true,
        amenities: ['AC', 'Bluetooth', 'USB Charging'],
    },
    {
        vehicleName: 'Toyota HiAce',
        vehicleModel: 'Spacious van for group tours',
        category: 'Comfort',
        serviceType: 'intercity',
        passengers: 12,
        luggage: 8,
        imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=400',
        providerName: 'Lanka Tours',
        providerRating: 4.8,
        reviews: 156,
        price: 18000,
        priceType: 'per day',
        fuelPolicy: 'Fuel excluded',
        driverIncluded: true,
        amenities: ['AC', 'PA System', 'Reclining Seats', 'USB Charging'],
    },
    {
        vehicleName: 'Mercedes-Benz S-Class',
        vehicleModel: 'Premium luxury sedan for VIP transfers',
        category: 'Luxury',
        serviceType: 'airport',
        passengers: 3,
        luggage: 3,
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400',
        providerName: 'Elite Transfers Lanka',
        providerRating: 4.9,
        reviews: 89,
        price: 25000,
        priceType: 'per trip',
        fuelPolicy: 'Fuel included',
        driverIncluded: true,
        amenities: ['AC', 'Leather Seats', 'WiFi', 'Water Bottles', 'USB Charging', 'Newspapers'],
    },
    {
        vehicleName: 'Honda Vezel',
        vehicleModel: 'Compact SUV for flexible touring',
        category: 'Comfort',
        serviceType: 'rentals',
        passengers: 4,
        luggage: 3,
        imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400',
        providerName: 'Drive Lanka',
        providerRating: 4.6,
        reviews: 210,
        price: 12000,
        priceType: 'per day',
        fuelPolicy: 'Fuel excluded',
        driverIncluded: false,
        amenities: ['AC', 'GPS', 'Bluetooth', 'USB Charging'],
    },
    {
        vehicleName: 'Royal Enfield Classic 350',
        vehicleModel: 'Classic motorcycle for scenic rides',
        category: 'Economy',
        serviceType: 'bikes',
        passengers: 2,
        luggage: 1,
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400',
        providerName: 'Ride Lanka',
        providerRating: 4.5,
        reviews: 78,
        price: 4500,
        priceType: 'per day',
        fuelPolicy: 'Fuel excluded',
        driverIncluded: false,
        amenities: ['Helmet', 'Side Bags', 'Phone Mount'],
    },
];

const seedDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI is not set in .env file');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            Destination.deleteMany({}),
            Tour.deleteMany({}),
            Hotel.deleteMany({}),
            Transportation.deleteMany({}),
        ]);
        console.log('✅ Existing data cleared');

        // Seed destinations
        console.log('🌍 Seeding destinations...');
        const destinations = await Destination.insertMany(DESTINATIONS_DATA);
        console.log(`   ✅ ${destinations.length} destinations created`);

        // Seed tours
        console.log('🎒 Seeding tours...');
        const tours = await Tour.insertMany(TOURS_DATA);
        console.log(`   ✅ ${tours.length} tours created`);

        // Seed hotels
        console.log('🏨 Seeding hotels...');
        const hotels = await Hotel.insertMany(HOTELS_DATA);
        console.log(`   ✅ ${hotels.length} hotels created`);

        // Seed transportation
        console.log('🚗 Seeding transportation...');
        const vehicles = await Transportation.insertMany(TRANSPORTATION_DATA);
        console.log(`   ✅ ${vehicles.length} vehicles created`);

        console.log('\n==========================================');
        console.log('🎉 Database seeded successfully!');
        console.log(`   Destinations: ${destinations.length}`);
        console.log(`   Tours: ${tours.length}`);
        console.log(`   Hotels: ${hotels.length}`);
        console.log(`   Vehicles: ${vehicles.length}`);
        console.log('==========================================');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();
