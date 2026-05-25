
import React from 'react';
import { Hotel, Compass, Car, MapPin, Edit3, Trash2, CheckCircle, Clock, Info } from 'lucide-react';
import { Activity, BookingStatus } from '../../types/itinerary';
import Button from '../Button';

interface DayActivityCardProps {
  activity: Activity;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
  onBook?: (id: string) => void;
}

const DayActivityCard: React.FC<DayActivityCardProps> = ({ activity, onEdit, onRemove, onBook }) => {
  const typeIcons = {
    destination: <MapPin size={18} />,
    hotel: <Hotel size={18} />,
    tour: <Compass size={18} />,
    transport: <Car size={18} />,
    custom: <Info size={18} />
  };

  const statusColors = {
    'Booked': 'bg-emerald-100 text-emerald-700',
    'Not Booked': 'bg-orange-100 text-orange-700',
    'Pending': 'bg-amber-100 text-amber-700'
  };

  return (
    <div className="relative pl-8 group">
      {/* Timeline Bullet */}
      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-white border-2 border-sky-500 z-10 group-hover:scale-125 transition-transform" />
      
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Image (if any) */}
          {activity.imageUrl && (
            <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0">
               <img src={activity.imageUrl} className="w-full h-full object-cover" alt={activity.title} />
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activity.status === 'Booked' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                   {typeIcons[activity.type]}
                </div>
                <div>
                   <h4 className="font-bold text-slate-900">{activity.title}</h4>
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                      <Clock size={12} className="text-slate-300" /> {activity.time} {activity.duration && `• ${activity.duration}`}
                   </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[activity.status]}`}>
                {activity.status}
              </span>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {activity.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-6">
                 {activity.cost > 0 && (
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Cost</p>
                      <p className="text-sm font-black text-sky-600">LKR {activity.cost.toLocaleString()}</p>
                   </div>
                 )}
                 {activity.provider && (
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Provider</p>
                      <p className="text-sm font-bold text-slate-700">{activity.provider}</p>
                   </div>
                 )}
              </div>

              <div className="flex items-center gap-2">
                 {activity.status === 'Not Booked' && (
                   <Button 
                     size="sm" 
                     className="rounded-lg px-6 shadow-md shadow-orange-500/20" 
                     variant="secondary"
                     onClick={() => onBook?.(activity.id)}
                   >
                     Book Now
                   </Button>
                 )}
                 <button 
                   onClick={() => onEdit?.(activity.id)}
                   className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                   title="Edit Activity"
                 >
                    <Edit3 size={18} />
                 </button>
                 <button 
                   onClick={() => onRemove?.(activity.id)}
                   className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                   title="Remove Activity"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayActivityCard;
