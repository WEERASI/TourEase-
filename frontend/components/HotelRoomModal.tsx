
import React, { useState, useMemo } from 'react';
import { 
  X, Star, MapPin, Wifi, Waves, Coffee, Dumbbell, 
  ShieldCheck, Maximize, Users, Bed, Check, 
  ArrowRight, Filter, SortAsc, Info, Tag
} from 'lucide-react';
import Button from './Button';
import Select from './Select';

export interface RoomType {
  id: string;
  name: string;
  size: string;
  beds: string;
  occupancy: number;
  price: number;
  available: number;
  image: string;
  amenities: string[];
}

export interface HotelRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: {
    id: number;
    name: string;
    location: string;
    city: string;
    stars: number;
    userRating: number;
    reviews: number;
    imageUrl: string;
    description?: string;
    amenities: string[];
    rooms: RoomType[];
  } | null;
  onBookRoom: (room: RoomType) => void;
}

const HotelRoomModal: React.FC<HotelRoomModalProps> = ({ isOpen, onClose, hotel, onBookRoom }) => {
  const [filterOccupancy, setFilterOccupancy] = useState<string>('all');
  const [filterBed, setFilterBed] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-low');

  const filteredRooms = useMemo(() => {
    if (!hotel) return [];
    let rooms = [...hotel.rooms];

    if (filterOccupancy !== 'all') {
      rooms = rooms.filter(r => r.occupancy >= parseInt(filterOccupancy));
    }

    if (filterBed !== 'all') {
      rooms = rooms.filter(r => r.beds.toLowerCase().includes(filterBed.toLowerCase()));
    }

    rooms.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

    return rooms;
  }, [hotel, filterOccupancy, filterBed, sortBy]);

  if (!isOpen || !hotel) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-slate-50 w-full max-w-6xl h-full md:h-[90vh] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-2 bg-white/20 backdrop-blur-md text-white rounded-full md:hidden"
        >
          <X size={24} />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          
          {/* Header Section: Hero & Stats */}
          <section className="relative h-64 md:h-80 shrink-0">
            <img 
              src={hotel.imageUrl} 
              alt={hotel.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < hotel.stars ? "text-amber-400" : "text-slate-400"} fill={i < hotel.stars ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest">• Verified Stay</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">{hotel.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin size={16} className="text-sky-400" />
                    <span>{hotel.city}, {hotel.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <div className="bg-sky-500 text-white px-2 py-0.5 rounded text-xs font-black">{hotel.userRating}</div>
                    <span className="font-medium">Excellent ({hotel.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="hidden md:flex absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all border border-white/20 shadow-xl"
            >
              <X size={20} />
            </button>
          </section>

          <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
            
            {/* Quick Overview Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">About this Property</h2>
                <p className="text-slate-600 leading-relaxed italic">
                  Experience world-class hospitality in the heart of {hotel.city}. This {hotel.stars}-star sanctuary offers 
                  a perfect blend of modern comfort and Sri Lankan heritage.
                </p>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                      {amenity === 'wifi' && <Wifi size={14} className="text-sky-500" />}
                      {amenity === 'pool' && <Waves size={14} className="text-sky-500" />}
                      {amenity === 'spa' && <ShieldCheck size={14} className="text-sky-500" />}
                      <span className="capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-sky-600 rounded-3xl p-6 text-white flex flex-col justify-center shadow-xl shadow-sky-200/50">
                <div className="flex items-center gap-2 text-sky-200 text-xs font-black uppercase tracking-widest mb-2">
                   <Tag size={14} /> Seasonal Offer
                </div>
                <h3 className="text-xl font-bold mb-2">Save up to 15%</h3>
                <p className="text-sm text-sky-100 opacity-90 mb-4">Join our rewards program to unlock member-only rates on all room types.</p>
                <Button variant="secondary" className="w-full rounded-xl">Check Member Rates</Button>
              </div>
            </div>

            {/* Room Filters & List */}
            <div className="space-y-6 pt-10 border-t border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  Available Rooms
                  <span className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-xs font-black">{filteredRooms.length}</span>
                </h2>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
                    <Filter size={14} className="text-slate-400" />
                    <select 
                      className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none py-1"
                      value={filterOccupancy}
                      onChange={(e) => setFilterOccupancy(e.target.value)}
                    >
                      <option value="all">Any Occupancy</option>
                      <option value="2">2+ Guests</option>
                      <option value="3">3+ Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
                    <SortAsc size={14} className="text-slate-400" />
                    <select 
                      className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none py-1"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Room Cards Stack */}
              <div className="space-y-6">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-xl hover:border-sky-100 transition-all group">
                      {/* Room Image */}
                      <div className="md:w-72 lg:w-96 h-64 md:h-auto overflow-hidden relative">
                        <img 
                          src={room.image} 
                          alt={room.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {room.available <= 2 && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse shadow-lg">
                            ONLY {room.available} LEFT
                          </div>
                        )}
                      </div>

                      {/* Room Content */}
                      <div className="flex-1 p-6 lg:p-8 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-1">{room.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                               <div className="flex items-center gap-1"><Maximize size={14} /> {room.size}</div>
                               <div className="flex items-center gap-1"><Bed size={14} /> {room.beds}</div>
                               <div className="flex items-center gap-1"><Users size={14} /> Max {room.occupancy}</div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 mb-8">
                          {room.amenities.map(amenity => (
                            <div key={amenity} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                              <Check size={14} className="text-emerald-500 shrink-0" />
                              <span className="capitalize">{amenity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-6">
                          <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price per night</div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-sky-600">LKR {room.price.toLocaleString()}</span>
                              <span className="text-slate-400 text-[10px] font-bold">/ night</span>
                            </div>
                          </div>
                          <Button 
                            variant="secondary" 
                            className="px-8 rounded-full shadow-lg shadow-orange-500/20"
                            onClick={() => onBookRoom(room)}
                            rightIcon={<ArrowRight size={18} />}
                          >
                            Book Room
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <Info size={40} className="mx-auto text-slate-200 mb-4" />
                    <h4 className="text-xl font-bold text-slate-900 mb-2">No matching rooms found</h4>
                    <p className="text-slate-500">Try adjusting your occupancy or bed type filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Footer Summary */}
        <div className="bg-white border-t border-slate-100 p-4 md:px-10 md:py-6 flex items-center justify-between gap-6 shadow-2xl z-20">
           <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Property</p>
              <p className="text-sm font-black text-slate-900 truncate max-w-xs">{hotel.name}</p>
           </div>
           <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button variant="ghost" className="rounded-full flex-1 sm:flex-none" onClick={onClose}>Back to Search</Button>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                 <ShieldCheck size={14} className="text-sky-500" /> Secure Checkout Guaranteed
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRoomModal;
