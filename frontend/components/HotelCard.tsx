
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Heart, Wifi, Waves, Coffee, Dumbbell, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from './Button';

export interface HotelCardProps {
  id: number;
  name: string;
  location: string;
  city: string;
  stars: number;
  userRating: number;
  reviews: number;
  price: number;
  imageUrl: string;
  type: string;
  amenities: string[];
  isBestValue?: boolean;
  onViewRooms?: () => void;
  onBookNow?: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({
  id,
  name,
  location,
  city,
  stars,
  userRating,
  reviews,
  price,
  imageUrl,
  type,
  amenities,
  isBestValue,
  onViewRooms,
  onBookNow
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('hotelWishlist') || '[]');
    setIsWishlisted(wishlist.includes(id));
  }, [id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem('hotelWishlist') || '[]');
    let newWishlist;
    if (wishlist.includes(id)) {
      newWishlist = wishlist.filter((item: number) => item !== id);
    } else {
      newWishlist = [...wishlist, id];
    }
    localStorage.setItem('hotelWishlist', JSON.stringify(newWishlist));
    setIsWishlisted(!isWishlisted);
  };

  const AmenityIcon = ({ name }: { name: string }) => {
    switch (name.toLowerCase()) {
      case 'wifi': return <Wifi size={14} />;
      case 'pool': return <Waves size={14} />;
      case 'spa': return <ShieldCheck size={14} />;
      case 'restaurant': return <Coffee size={14} />;
      case 'gym': return <Dumbbell size={14} />;
      default: return null;
    }
  };

  return (
    <div className="group bg-white rounded-[var(--radius-xl)] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isBestValue && (
            <div className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <span>💰</span> Best Value
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-md shadow-sm flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={10} 
                className={i < stars ? "text-amber-500" : "text-slate-200"} 
                fill={i < stars ? "currentColor" : "none"} 
              />
            ))}
          </div>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-sky-500">{type}</p>
          <div className="flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded text-sky-700">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold">{userRating}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors leading-tight">
          {name}
        </h3>
        
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-4">
          <MapPin size={12} />
          <span>{city}, {location.split(',')[1]?.trim() || 'Sri Lanka'}</span>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {amenities.slice(0, 4).map((amenity) => (
            <div key={amenity} className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2 py-1 rounded text-[10px] font-medium border border-slate-100">
              <AmenityIcon name={amenity} />
              <span className="capitalize">{amenity}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex flex-col gap-4">
          <div className="flex justify-between items-end">
             <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">From</div>
             <div className="text-right">
                <span className="text-2xl font-black text-sky-600">LKR {price.toLocaleString()}</span>
                <p className="text-[10px] text-slate-400 font-medium">per night / incl. taxes</p>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl text-xs py-2.5" onClick={onViewRooms}>
              View Rooms
            </Button>
            <Button variant="secondary" size="sm" className="rounded-xl text-xs py-2.5 shadow-md shadow-orange-500/20" onClick={onBookNow}>
              Check Availability
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
