
import React from 'react';
import { Users, Briefcase, Wind, Star, Heart, Gauge, Check, Info, ArrowRight } from 'lucide-react';
import Button from './Button';

export interface TransportationCardProps {
  id: number;
  vehicleName: string;
  vehicleModel: string;
  category: 'Economy' | 'Comfort' | 'Premium' | 'Luxury';
  passengers: number;
  luggage: number;
  imageUrl: string;
  providerName: string;
  providerRating: number;
  reviews: number;
  price: number;
  priceType: 'per trip' | 'per day';
  fuelPolicy: string;
  driverIncluded: boolean;
  onBook: () => void;
  onViewDetails: () => void;
}

const TransportationCard: React.FC<TransportationCardProps> = ({
  vehicleName,
  vehicleModel,
  category,
  passengers,
  luggage,
  imageUrl,
  providerName,
  providerRating,
  reviews,
  price,
  priceType,
  fuelPolicy,
  driverIncluded,
  onBook,
  onViewDetails
}) => {
  const categoryColors = {
    Economy: 'bg-white/90 text-slate-600',
    Comfort: 'bg-emerald-500 text-white',
    Premium: 'bg-sky-500 text-white',
    Luxury: 'bg-amber-500 text-white'
  };

  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full">
      
      {/* 1. IMAGE SECTION (TOP) */}
      <div className="relative w-full h-[250px] overflow-hidden shrink-0">
        <img 
          src={imageUrl} 
          alt={vehicleName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        
        {/* Category Badge - Absolute on top of image */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${categoryColors[category]}`}>
            {category}
          </span>
        </div>

        {/* Wishlist Button - Absolute on top of image */}
        <button className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-slate-400 hover:text-red-500 transition-all shadow-lg active:scale-90">
          <Heart size={20} />
        </button>

        {/* Image Overlay Gradient for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* 2. CONTENT SECTION (BELOW IMAGE) */}
      <div className="flex-1 p-6 lg:p-8 flex flex-col bg-white">
        
        {/* Vehicle Name & Type */}
        <div className="mb-6">
          <h3 className="text-2xl font-black text-slate-900 leading-tight mb-1 group-hover:text-sky-600 transition-colors">
            {vehicleName}
          </h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            {vehicleModel}
          </p>
        </div>

        {/* 4-Column Amenities Row */}
        <div className="grid grid-cols-4 gap-2 mb-8 border-y border-slate-50 py-6">
          <SpecItem icon={<Users size={18} />} label="Capacity" value={`${passengers} People`} />
          <SpecItem icon={<Briefcase size={18} />} label="Luggage" value={`${luggage} Bags`} />
          <SpecItem icon={<Wind size={18} />} label="AC" value="Included" />
          <SpecItem icon={<Gauge size={18} />} label="Fuel" value={fuelPolicy} />
        </div>

        {/* Provider Details Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-[10px] font-black text-sky-600">
                {providerName.charAt(0)}
              </div>
              <span className="text-sm font-bold text-slate-700">{providerName}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-amber-500 justify-end">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-black text-slate-900">{providerRating}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{reviews} Reviews</p>
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Cost</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-sky-600">LKR {price.toLocaleString()}</span>
              <span className="text-slate-400 text-xs font-bold">/ {priceType}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
               <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Check size={10} /> {driverIncluded ? 'Pro Driver Included' : 'Self-drive'}
               </div>
               <div className="text-[10px] font-bold text-slate-400">• All Taxes Incl.</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="ghost" 
              className="rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold h-12"
              onClick={onViewDetails}
            >
              Details
            </Button>
            <Button 
              variant="secondary" 
              className="rounded-2xl shadow-xl shadow-orange-500/20 font-bold h-12"
              onClick={onBook}
              rightIcon={<ArrowRight size={18} />}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex flex-col items-center text-center gap-2 group/item">
    <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover/item:bg-sky-50 group-hover/item:text-sky-500 transition-colors">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">{label}</p>
      <p className="text-[10px] font-bold text-slate-700 leading-none truncate">{value}</p>
    </div>
  </div>
);

export default TransportationCard;
