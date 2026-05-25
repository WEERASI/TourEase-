
import React from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import Button from './Button';

interface DestinationCardProps {
  name: string;
  location: string;
  description: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  onExplore?: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  name,
  location,
  description,
  rating,
  reviews,
  imageUrl,
  onExplore
}) => {
  return (
    <div className="group bg-white rounded-[var(--radius-xl)] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <MapPin size={14} className="text-sky-500" />
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{location.split(',')[0]}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
            <Star size={14} fill="var(--color-accent-gold)" className="text-[var(--color-accent-gold)]" />
            <span className="text-xs font-bold text-amber-700">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400 text-sm mb-4 font-medium">
          <MapPin size={14} />
          <span>{location}</span>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
          {description}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <span className="text-xs text-slate-400 font-medium">
            <span className="text-slate-900 font-bold">{reviews}</span> Reviews
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full px-5 group/btn"
            onClick={onExplore}
            rightIcon={<ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />}
          >
            Explore
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
