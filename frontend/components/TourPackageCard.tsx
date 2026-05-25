
import React, { useState } from 'react';
import { Star, Clock, Heart, ArrowRight } from 'lucide-react';
import Button from './Button';

export interface TourPackageCardProps {
  title: string;
  duration: string;
  rating: number;
  price: number;
  imageUrl: string;
  badge?: 'Popular' | 'Featured' | 'New';
  onBookNow?: () => void;
}

const TourPackageCard: React.FC<TourPackageCardProps> = ({
  title,
  duration,
  rating,
  price,
  imageUrl,
  badge,
  onBookNow
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group bg-white rounded-[var(--radius-xl)] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Status Badge */}
        {badge && (
          <div className="absolute top-4 right-4 bg-[var(--color-accent-gold)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            {badge}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <Clock size={14} className="text-sky-500" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} fill="var(--color-accent-gold)" className="text-[var(--color-accent-gold)]" />
            <span className="text-xs font-bold text-slate-700">{rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-4 group-hover:text-sky-600 transition-colors">
          {title}
        </h3>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
          <div>
            <div className="text-[var(--color-primary-500)] text-xl font-black">
              LKR {price.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              per person
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-full shadow-lg shadow-orange-500/20 px-5"
            onClick={onBookNow}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourPackageCard;
