
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Share2, Edit3, Calendar, Users, DollarSign, 
  Map as MapIcon, ChevronRight, LayoutGrid, List, BarChart2,
  Plus, CheckCircle, Download, FileText, MapPin
} from 'lucide-react';
import Button from '../components/Button';
import DayActivityCard from '../components/itineraries/DayActivityCard';
import AddActivityModal from '../components/itineraries/AddActivityModal';
import { Itinerary, DayPlan } from '../types/itinerary';

interface ItineraryDetailPageProps {
  itinerary: Itinerary | null;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const ItineraryDetailPage: React.FC<ItineraryDetailPageProps> = ({ itinerary, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Day-by-Day' | 'Map View' | 'Budget'>('Day-by-Day');
  const [selectedDay, setSelectedDay] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!itinerary) {
    onBack();
    return null;
  }

  const currentDayPlan = itinerary.days.find(d => d.dayNumber === selectedDay) || { dayNumber: selectedDay, date: '', activities: [] };
  
  // Stats
  const allActivities = itinerary.days.flatMap(d => d.activities);
  const bookedActivities = allActivities.filter(a => a.status === 'Booked').length;
  const progressPercent = allActivities.length > 0 ? Math.round((bookedActivities / allActivities.length) * 100) : 0;
  
  const spentAmount = allActivities.filter(a => a.status === 'Booked').reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                 <ArrowLeft size={24} />
              </button>
              <div className="h-8 w-px bg-slate-100" />
              <div>
                 <h2 className="text-xl font-bold text-slate-900 leading-none">{itinerary.name}</h2>
                 <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mt-1">
                    {itinerary.status} • {itinerary.days.length} Days Itinerary
                 </p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <button className="p-2.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all">
                 <Share2 size={20} />
              </button>
              <Button variant="ghost" size="sm" className="rounded-xl px-6" leftIcon={<Edit3 size={18} />}>
                 Edit Trip
              </Button>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* Banner Card */}
        <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-16 text-white relative overflow-hidden mb-10 shadow-2xl">
           <img 
             src={itinerary.coverImage} 
             className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" 
             alt="Header" 
           />
           <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-6 mb-8 text-sky-200 font-bold text-sm">
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <Calendar size={16} /> 
                    <span>{new Date(itinerary.startDate).toLocaleDateString()} — {new Date(itinerary.endDate).toLocaleDateString()}</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <Users size={16} /> 
                    <span>{itinerary.travelers} Travelers</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-orange-400">
                    <DollarSign size={16} /> 
                    <span>Budget: LKR {itinerary.budget.toLocaleString()}</span>
                 </div>
              </div>

              <h1 className="text-4xl lg:text-6xl font-black mb-6 tracking-tight">{itinerary.name}</h1>
              <p className="text-lg text-slate-300 max-w-2xl font-medium leading-relaxed">{itinerary.description}</p>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Day Selector */}
          <aside className="w-full lg:w-72 shrink-0">
             <div className="sticky top-32 space-y-8">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4">
                   <div className="flex flex-col gap-1">
                      {itinerary.days.map(day => (
                        <button
                          key={day.dayNumber}
                          onClick={() => { setSelectedDay(day.dayNumber); setActiveTab('Day-by-Day'); }}
                          className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${
                            selectedDay === day.dayNumber && activeTab === 'Day-by-Day'
                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-200 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                           <div className="flex flex-col items-start">
                              <span className="text-xs uppercase font-black opacity-60 tracking-widest leading-none mb-1">Day</span>
                              <span className="text-lg leading-none">{day.dayNumber}</span>
                           </div>
                           <ChevronRight size={20} className={selectedDay === day.dayNumber ? 'opacity-100' : 'opacity-20'} />
                        </button>
                      ))}
                   </div>
                </div>

                {/* KPI Sidebar */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Trip Status</h4>
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-slate-700">Booking Progress</span>
                         <span className="text-xs font-black text-sky-600">{progressPercent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-sky-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl text-emerald-700">
                         <CheckCircle size={20} />
                         <span className="text-xs font-bold">{bookedActivities} of {allActivities.length} items confirmed</span>
                      </div>
                   </div>
                </div>
             </div>
          </aside>

          {/* Main Content Tabs */}
          <div className="flex-1 space-y-8">
             <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-2 flex">
                {(['Overview', 'Day-by-Day', 'Map View', 'Budget'] as const).map(tab => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${
                       activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:text-slate-900'
                     }`}
                   >
                      {tab === 'Overview' && <LayoutGrid size={18} />}
                      {tab === 'Day-by-Day' && <List size={18} />}
                      {tab === 'Map View' && <MapIcon size={18} />}
                      {tab === 'Budget' && <BarChart2 size={18} />}
                      {tab}
                   </button>
                ))}
             </div>

             {/* Tab Content: Day-by-Day */}
             {activeTab === 'Day-by-Day' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="flex items-center justify-between px-2">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900">Day {selectedDay}</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Wednesday, February 10, 2026</p>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-xl px-6" 
                        leftIcon={<Plus size={18} />}
                        onClick={() => setIsAddModalOpen(true)}
                      >
                         Add Activity
                      </Button>
                   </div>

                   <div className="relative">
                      {/* Vertical Line */}
                      <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-slate-100" />
                      
                      <div className="space-y-8">
                         {currentDayPlan.activities.length > 0 ? (
                            currentDayPlan.activities.map(activity => (
                               <DayActivityCard 
                                 key={activity.id} 
                                 activity={activity} 
                                 onBook={(id) => {}} // Placeholder
                               />
                            ))
                         ) : (
                            <div className="ml-8 py-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white">
                               <MapPin size={40} className="mx-auto text-slate-200 mb-4" />
                               <h4 className="font-bold text-slate-900 mb-2">No activities planned yet</h4>
                               <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Start building your day by adding destinations, hotels or tours.</p>
                               <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setIsAddModalOpen(true)}>Add Activity</Button>
                            </div>
                         )}
                      </div>
                   </div>

                   {currentDayPlan.activities.length > 0 && (
                      <div className="p-8 bg-sky-50 rounded-[2rem] border border-sky-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-sky-600 shadow-sm font-black">
                               D{selectedDay}
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Day Summary</p>
                               <p className="font-bold text-slate-900">LKR {currentDayPlan.activities.reduce((a,c) => a+c.cost, 0).toLocaleString()}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="text-xs font-bold text-sky-700">{currentDayPlan.activities.length} items planned</span>
                         </div>
                      </div>
                   )}
                </div>
             )}

             {/* Tab Content: Budget */}
             {activeTab === 'Budget' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <BudgetStat label="Total Budget" value={itinerary.budget} color="text-slate-900" />
                      <BudgetStat label="Amount Spent" value={spentAmount} color="text-emerald-600" />
                      <BudgetStat label="Remaining" value={itinerary.budget - spentAmount} color="text-sky-600" />
                   </div>

                   <div className="bg-white rounded-[2rem] border border-slate-100 p-10 shadow-sm">
                      <div className="flex items-center justify-between mb-10">
                         <h4 className="text-xl font-bold text-slate-900">Expense Breakdown</h4>
                         <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="rounded-xl" leftIcon={<Download size={16} />}>Export PDF</Button>
                            <Button variant="ghost" size="sm" className="rounded-xl" leftIcon={<FileText size={16} />}>Detailed CSV</Button>
                         </div>
                      </div>
                      
                      <div className="space-y-8">
                         <BudgetBar label="Accommodation" amount={60000} total={itinerary.budget} color="bg-orange-400" />
                         <BudgetBar label="Tours & Activities" amount={45000} total={itinerary.budget} color="bg-sky-400" />
                         <BudgetBar label="Transportation" amount={35000} total={itinerary.budget} color="bg-emerald-400" />
                         <BudgetBar label="Dining & Food" amount={25000} total={itinerary.budget} color="bg-amber-400" />
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>

      <AddActivityModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        dayNumber={selectedDay} 
      />
    </div>
  );
};

const BudgetStat = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
     <p className={`text-2xl font-black ${color}`}>LKR {value.toLocaleString()}</p>
  </div>
);

const BudgetBar = ({ label, amount, total, color }: { label: string; amount: number; total: number; color: string }) => {
  const percent = Math.round((amount / total) * 100);
  return (
    <div className="space-y-3">
       <div className="flex justify-between items-end">
          <span className="text-sm font-bold text-slate-700">{label}</span>
          <span className="text-sm font-black text-slate-900">LKR {amount.toLocaleString()} ({percent}%)</span>
       </div>
       <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percent}%` }} />
       </div>
    </div>
  );
};

export default ItineraryDetailPage;
