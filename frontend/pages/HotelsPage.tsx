
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, MapPin, Calendar, Users, 
  RotateCcw, Hotel as HotelIcon, ChevronLeft, ChevronRight,
  Grid, List, LayoutGrid, Star
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';
import Radio from '../components/Radio';
import HotelCard from '../components/HotelCard';
import HotelRoomModal, { RoomType } from '../components/HotelRoomModal';
import HotelBookingModal from '../components/HotelBookingModal';

// 1. RICH SAMPLE DATA WITH ROOMS
const HOTELS_DATA = [
  {
    id: 1,
    name: "Paradise Beach Resort",
    location: "Southern Province, Sri Lanka",
    city: "Mirissa",
    stars: 5,
    userRating: 4.8,
    reviews: 234,
    price: 18500,
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/179034031.jpg?k=d84d0415e7d5cd76177c7984afec5faf9bab990da4c8409d58fa4663afc5e24a&o=",
    type: "Resort",
    amenities: ["wifi", "pool", "spa", "restaurant", "beach access"],
    isBestValue: true,
    rooms: [
      { id: '1-1', name: 'Deluxe Ocean View', size: '450 sq ft', beds: '1 King Bed', occupancy: 2, price: 18500, available: 3, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800', amenities: ['AC', 'Minibar', 'Balcony', 'Safe'] },
      { id: '1-2', name: 'Family Terrace Suite', size: '750 sq ft', beds: '2 Queen Beds', occupancy: 4, price: 28000, available: 1, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800', amenities: ['Kitchenette', 'AC', 'Private Pool', 'TV'] },
      { id: '1-3', name: 'Standard Garden View', size: '350 sq ft', beds: '1 Queen Bed', occupancy: 2, price: 14000, available: 8, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800', amenities: ['AC', 'TV', 'Coffee Maker'] }
    ]
  },
  {
    id: 2,
    name: "Heritage Kandy Hotel",
    location: "Central Province, Sri Lanka",
    city: "Kandy",
    stars: 4,
    userRating: 4.6,
    reviews: 189,
    price: 12500,
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/619736567.jpg?k=080ccd8c7e8185b8ad32b399493904169bfc7fdda476906ebbfbefba550875ac&o=",
    type: "Hotel",
    amenities: ["wifi", "pool", "restaurant", "parking"],
    rooms: [
      { id: '2-1', name: 'Colonial Premium Room', size: '400 sq ft', beds: '1 King Bed', occupancy: 2, price: 12500, available: 5, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800', amenities: ['Antique Furniture', 'AC', 'Safe'] },
      { id: '2-2', name: 'Twin Heritage Room', size: '400 sq ft', beds: '2 Twin Beds', occupancy: 2, price: 11000, available: 2, image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800', amenities: ['AC', 'Minibar', 'Work Desk'] }
    ]
  },
  {
    id: 3,
    name: "Ella Mount View Villa",
    location: "Uva Province, Sri Lanka",
    city: "Ella",
    stars: 4,
    userRating: 4.9,
    reviews: 156,
    price: 9800,
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/328127792.jpg?k=0d148c7ecfe96070b11f0852b6b95df094544afd6f4b00bcd77bb83072879d6a&o=",
    type: "Villa",
    amenities: ["wifi", "restaurant", "mountain view"],
    rooms: [
      { id: '3-1', name: 'Panorama Mountain Suite', size: '500 sq ft', beds: '1 King Bed', occupancy: 3, price: 9800, available: 2, image: 'https://images.unsplash.com/photo-1578683010236-d716f97596d8?auto=format&fit=crop&q=80&w=800', amenities: ['Glass Wall', 'Fireplace', 'Balcony'] }
    ]
  },
  {
    id: 4,
    name: "Galle Fort Boutique",
    location: "Southern Province, Sri Lanka",
    city: "Galle",
    stars: 4,
    userRating: 4.7,
    reviews: 198,
    price: 15000,
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/525781097.jpg?k=e70aa44486a2ccfd95501f0156b85d9a93e97df8f0c0db6dd7e8e93da9a9cbe4&o=",
    type: "Boutique Hotel",
    amenities: ["wifi", "restaurant", "spa"],
    rooms: [
      { id: '4-1', name: 'Historic Courtyard Room', size: '380 sq ft', beds: '1 King Bed', occupancy: 2, price: 15000, available: 4, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800', amenities: ['Nespresso', 'Bath Tub', 'Fine Linen'] }
    ]
  },
  {
    id: 5,
    name: "Colombo City Hotel",
    location: "Western Province, Sri Lanka",
    city: "Colombo",
    stars: 5,
    userRating: 4.5,
    reviews: 312,
    price: 22000,
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/156672332.jpg?k=b4f3d04cbc8b0c80193f63046e63e576ba1a50fc9f48289aa152f10a026aab4d&o=",
    type: "Hotel",
    amenities: ["wifi", "pool", "spa", "gym", "restaurant", "bar"],
    rooms: [
      { id: '5-1', name: 'Executive Sky Room', size: '420 sq ft', beds: '1 King Bed', occupancy: 2, price: 22000, available: 6, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800', amenities: ['Smart Controls', 'City View', 'Executive Lounge Access'] }
    ]
  },
  {
    id: 6,
    name: "Sigiriya Nature Resort",
    location: "Central Province, Sri Lanka",
    city: "Sigiriya",
    stars: 4,
    userRating: 4.8,
    reviews: 176,
    price: 14500,
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/781856970.jpg?k=30444004c2fefefecf73be718c7eda110e57dd4d1e020b80d3833c46aadc3a4f&o=",
    type: "Resort",
    amenities: ["wifi", "pool", "restaurant", "nature views"],
    rooms: [
      { id: '6-1', name: 'Luxury Tree Villa', size: '600 sq ft', beds: '1 King Bed', occupancy: 2, price: 14500, available: 2, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800', amenities: ['Eco-friendly', 'Outdoor Shower', 'Plunge Pool'] }
    ]
  }
];

const CITIES = ["All Locations", "Colombo", "Kandy", "Ella", "Galle", "Mirissa", "Sigiriya", "Negombo", "Nuwara Eliya"];
const AMENITIES = ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym", "Parking", "Airport Shuttle", "Beach Access", "Air Conditioning"];
const PROPERTY_TYPES = ["Hotel", "Resort", "Guesthouse", "Villa", "Boutique Hotel", "Hostel"];

const HotelsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const [priceRange, setPriceRange] = useState(50000);
  const [starRatings, setStarRatings] = useState<number[]>([]);
  const [minUserRating, setMinUserRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Recommended");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  // Room Modal State
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState<any>(null);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState<any>(null);

  // --- FILTERING LOGIC ---
  const filteredHotels = useMemo(() => {
    let results = [...HOTELS_DATA];

    if (searchQuery.trim()) {
      results = results.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.city.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedCity !== "All Locations") {
      results = results.filter(h => h.city === selectedCity);
    }

    results = results.filter(h => h.price <= priceRange);

    if (starRatings.length > 0) {
      results = results.filter(h => starRatings.includes(h.stars));
    }

    if (minUserRating > 0) {
      results = results.filter(h => h.userRating >= minUserRating);
    }

    if (selectedAmenities.length > 0) {
      results = results.filter(h => selectedAmenities.every(a => h.amenities.includes(a.toLowerCase())));
    }

    if (selectedPropertyTypes.length > 0) {
      results = results.filter(h => selectedPropertyTypes.includes(h.type));
    }

    results.sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Star Rating") return b.stars - a.stars;
      if (sortBy === "User Rating") return b.userRating - a.userRating;
      return 0;
    });

    return results;
  }, [searchQuery, selectedCity, priceRange, starRatings, minUserRating, selectedAmenities, selectedPropertyTypes, sortBy]);

  // --- HANDLERS ---
  const toggleStar = (star: number) => {
    setStarRatings(prev => prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  const toggleType = (type: string) => {
    setSelectedPropertyTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleViewRooms = (hotel: any) => {
    setSelectedHotelForRooms(hotel);
    setIsRoomModalOpen(true);
  };

  const handleStartBooking = (hotel: any) => {
    setSelectedHotelForBooking(hotel);
    setIsBookingModalOpen(true);
  };

  const handleBookRoomInModal = (room: RoomType) => {
    // This is called from the Room selection modal
    // We close the room modal and open the booking flow with this room selected
    setIsRoomModalOpen(false);
    setSelectedHotelForBooking(selectedHotelForRooms);
    setIsBookingModalOpen(true);
  };

  const clearAll = () => {
    setSearchQuery("");
    setSelectedCity("All Locations");
    setPriceRange(50000);
    setStarRatings([]);
    setMinUserRating(0);
    setSelectedAmenities([]);
    setSelectedPropertyTypes([]);
    setSortBy("Recommended");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HERO SECTION */}
      <section className="bg-sky-700 text-white relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 bg-[url('https://images.unsplash.com/photo-1552423814-24830a23b17a?auto=format&fit=crop&q=80&w=2000')]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Find Your Perfect Stay in Sri Lanka</h1>
          <p className="text-sky-100 text-lg mb-12 max-w-2xl mx-auto">Discover luxury resorts, boutique villas, and cozy guesthouses across the Pearl of the Indian Ocean.</p>
          
          {/* SEARCH BAR */}
          <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-3 max-w-5xl mx-auto ring-8 ring-white/10 transition-all">
            <div className="flex-1 w-full flex items-center px-6 gap-3 border-r-0 md:border-r border-slate-100">
              <MapPin className="text-sky-500 shrink-0" size={24} />
              <div className="text-left w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                <input 
                  type="text" 
                  placeholder="Where do you want to stay?" 
                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm font-bold border-none focus:outline-none focus:ring-0 p-0 h-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-48 flex items-center px-6 gap-3 border-r-0 md:border-r border-slate-100">
              <Calendar className="text-sky-500 shrink-0" size={24} />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dates</p>
                <input 
                  type="date" 
                  className="bg-transparent text-slate-800 text-sm font-bold border-none focus:outline-none focus:ring-0 p-0 h-6 cursor-pointer"
                  defaultValue="2024-06-15"
                />
              </div>
            </div>

            <div className="w-full md:w-48 flex items-center px-6 gap-3">
              <Users className="text-sky-500 shrink-0" size={24} />
              <div className="text-left flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Guests</p>
                <div className="flex items-center gap-2">
                   <button onClick={() => setAdults(Math.max(1, adults - 1))} className="text-sky-600 hover:text-sky-800 font-bold">-</button>
                   <span className="text-sm font-bold text-slate-800">{adults + children}</span>
                   <button onClick={() => setAdults(adults + 1)} className="text-sky-600 hover:text-sky-800 font-bold">+</button>
                </div>
              </div>
            </div>

            <Button variant="secondary" className="w-full md:w-auto px-10 py-4 rounded-xl md:rounded-full text-lg shadow-xl shrink-0">
              Search Hotels
            </Button>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 pt-10 relative z-20 pb-20 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sticky top-24">
              <div className="flex items-center justify-between mb-8 border-b pb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-sky-500" />
                  Filters
                </h3>
                <button onClick={clearAll} className="text-xs font-bold text-sky-600 hover:underline">Clear All</button>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</label>
                  <Select 
                    options={CITIES.map(c => ({ value: c, label: c }))}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price / Night</label>
                    <span className="text-xs font-bold text-sky-600">Up to LKR {priceRange.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="2000" max="50000" step="500" value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Star Rating</label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2].map(star => (
                      <Checkbox key={star} checked={starRatings.includes(star)} onChange={() => toggleStar(star)}
                        label={<div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (<Star key={i} size={14} className={i < star ? "text-amber-500" : "text-slate-200"} fill={i < star ? "currentColor" : "none"} />))}</div>}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amenities</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                    {AMENITIES.map(amenity => (
                      <Checkbox key={amenity} label={amenity} checked={selectedAmenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Type</label>
                  <div className="space-y-2">
                    {PROPERTY_TYPES.map(type => (
                      <Checkbox key={type} label={type} checked={selectedPropertyTypes.includes(type)} onChange={() => toggleType(type)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RESULTS */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="px-3 py-1 bg-sky-50 text-sky-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                {filteredHotels.length} Hotels Found
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-slate-50 p-1 rounded-lg">
                   <button className="p-1.5 text-sky-600 bg-white shadow-sm rounded-md"><LayoutGrid size={18} /></button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Sort by:</span>
                  <select className="bg-transparent font-bold text-slate-900 focus:outline-none" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Star Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard 
                    key={hotel.id}
                    {...hotel}
                    onViewRooms={() => handleViewRooms(hotel)}
                    onBookNow={() => handleStartBooking(hotel)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No hotels match your filters</h3>
                <Button variant="ghost" className="mt-8 px-10 rounded-full" onClick={clearAll} leftIcon={<RotateCcw size={18} />}>Clear All Filters</Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ROOM SELECTION MODAL */}
      <HotelRoomModal 
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        hotel={selectedHotelForRooms}
        onBookRoom={handleBookRoomInModal}
      />

      {/* FULL BOOKING FLOW MODAL */}
      <HotelBookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        hotel={selectedHotelForBooking}
        initialRoom={null}
      />
    </div>
  );
};

export default HotelsPage;
