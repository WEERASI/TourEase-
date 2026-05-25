
import React from 'react';
import { Calendar, MapPin, Hotel, Compass, MoreVertical, Edit2 } from 'lucide-react';
import { Itinerary } from '../../types/itinerary';
import Button from '../Button';

interface ItineraryCardProps {
  itinerary: Itinerary;
  onView: (itinerary: Itinerary) => void;
  onEdit: (itinerary: Itinerary) => void;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary, onView, onEdit }) => {
  // Calculate booking progress
  const allActivities = itinerary.days.flatMap(d => d.activities);
  const bookedActivities = allActivities.filter(a => a.status === 'Booked').length;
  const progressPercent = allActivities.length > 0 ? Math.round((bookedActivities / allActivities.length) * 100) : 0;

  const statusColors = {
    'Draft': 'bg-slate-100 text-slate-600',
    'Active': 'bg-sky-100 text-sky-600',
    'Completed': 'bg-emerald-100 text-emerald-600'
  };

  return (
    <div 
      onClick={() => onView(itinerary)}
      className="group bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        <img 
          src={itinerary.coverImage} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={itinerary.name} 
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${statusColors[itinerary.status]}`}>
            {itinerary.status}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition-colors">
            {itinerary.name}
          </h3>
          <button className="p-1 hover:bg-slate-50 rounded-lg text-slate-400">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Calendar size={14} className="text-sky-500" />
            <span>{new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()} ({itinerary.days.length} Days)</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-50">
            <StatItem icon={<MapPin size={12} />} count={itinerary.destinationsCount} label="Destin." />
            <StatItem icon={<Hotel size={12} />} count={itinerary.hotelsCount} label="Hotels" />
            <StatItem icon={<Compass size={12} />} count={itinerary.toursCount} label="Tours" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Budget</span>
              <span className="text-sm font-black text-slate-700">LKR {itinerary.budget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
               <span className="text-[10px] font-bold text-slate-500">{progressPercent}% Booked</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-500 ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-sky-500'}`} 
                 style={{ width: `${progressPercent}%` }} 
               />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 rounded-xl"
              onClick={(e) => { e.stopPropagation(); onEdit(itinerary); }}
            >
              <Edit2 size={14} className="mr-2" /> Edit
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              className="flex-1 rounded-xl"
              onClick={() => onView(itinerary)}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ icon, count, label }: { icon: React.ReactNode; count: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center gap-1 text-slate-700 font-bold text-sm">
      <span className="text-sky-500">{icon}</span>
      {count}
    </div>
    <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">{label}</span>
  </div>
);

export default ItineraryCard;
