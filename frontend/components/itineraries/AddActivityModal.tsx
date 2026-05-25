
import React, { useState } from 'react';
import { X, Search, MapPin, Hotel, Compass, Car, Info, Plus, ChevronRight, Check } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { ActivityType } from '../../types/itinerary';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({ isOpen, onClose, dayNumber }) => {
  const [activeTab, setActiveTab] = useState<ActivityType>('destination');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const tabs = [
    { id: 'destination', label: 'Destinations', icon: <MapPin size={16} /> },
    { id: 'hotel', label: 'Hotels', icon: <Hotel size={16} /> },
    { id: 'tour', label: 'Tours', icon: <Compass size={16} /> },
    { id: 'transport', label: 'Transport', icon: <Car size={16} /> },
    { id: 'custom', label: 'Custom', icon: <Info size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-4 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl h-full md:h-[80vh] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Add to Day {dayNumber}</h2>
              <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mt-1">Build your timeline</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"><X size={24} /></button>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-2 p-1 bg-slate-100 rounded-[1.5rem]">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActivityType)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
           {activeTab !== 'custom' && (
             <div className="mb-8">
                <Input 
                  placeholder={`Search ${activeTab}s in Sri Lanka...`} 
                  leftIcon={<Search size={18} />} 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
             </div>
           )}

           <div className="space-y-4">
              {activeTab === 'destination' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <ResultItem title="Sigiriya Rock Fortress" subtitle="Ancient Wonder • 4h duration" cost="LKR 5,500" img="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=200" />
                   <ResultItem title="Temple of the Tooth" subtitle="Kandy • 2h duration" cost="LKR 1,500" img="https://images.unsplash.com/photo-1562698013-ac13558052cd?auto=format&fit=crop&q=80&w=200" />
                   <ResultItem title="Nine Arch Bridge" subtitle="Ella • 1h duration" cost="Free" img="https://images.unsplash.com/photo-1578519050142-afb511e518de?auto=format&fit=crop&q=80&w=200" />
                   <ResultItem title="Galle Fort Ramparts" subtitle="Southern • 3h duration" cost="Free" img="https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&q=80&w=200" />
                </div>
              )}

              {activeTab === 'hotel' && (
                <div className="space-y-4">
                   <ResultItem horizontal title="Paradise Beach Resort" subtitle="Mirissa • 5 Stars" cost="LKR 18,500/night" img="https://cf.bstatic.com/xdata/images/hotel/max1024x768/179034031.jpg?k=d84d0415e7d5cd76177c7984afec5faf9bab990da4c8409d58fa4663afc5e24a&o=" />
                   <ResultItem horizontal title="Heritage Kandy Hotel" subtitle="Kandy • 4 Stars" cost="LKR 12,500/night" img="https://cf.bstatic.com/xdata/images/hotel/max1024x768/619736567.jpg?k=080ccd8c7e8185b8ad32b399493904169bfc7fdda476906ebbfbefba550875ac&o=" />
                </div>
              )}

              {activeTab === 'custom' && (
                <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-300">
                   <Input label="Activity Name" placeholder="e.g. Sunset drinks at Galle Face Green" />
                   <div className="grid grid-cols-2 gap-6">
                      <Input label="Start Time" type="time" defaultValue="18:00" />
                      <Input label="Estimated Cost (LKR)" type="number" defaultValue="2000" />
                   </div>
                   <textarea className="w-full bg-white border border-slate-200 rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-sky-500/20 outline-none" rows={4} placeholder="Any personal notes or reminders..."></textarea>
                   <Button variant="primary" className="w-full rounded-2xl py-4 font-black">Add Custom Activity</Button>
                </div>
              )}
           </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-center shrink-0">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
             Items added will appear in your timeline instantly
           </p>
        </div>
      </div>
    </div>
  );
};

const ResultItem = ({ title, subtitle, cost, img, horizontal = false }: any) => (
  <div className={`group bg-white rounded-3xl border border-slate-100 p-4 hover:shadow-xl hover:border-sky-100 transition-all cursor-pointer flex ${horizontal ? 'gap-6 items-center' : 'flex-col gap-4'}`}>
     <div className={`${horizontal ? 'w-20 h-20' : 'w-full h-32'} rounded-2xl overflow-hidden shrink-0`}>
        <img src={img} className="w-full h-full object-cover" alt={title} />
     </div>
     <div className="flex-1">
        <h4 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{title}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
        <div className="flex items-center justify-between mt-3">
           <span className="text-xs font-black text-sky-600">{cost}</span>
           <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-sky-500 group-hover:text-white transition-all">
              <Plus size={16} strokeWidth={3} />
           </div>
        </div>
     </div>
  </div>
);

export default AddActivityModal;
