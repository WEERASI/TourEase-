
import React, { useState, useMemo } from 'react';
import { Search, Plus, Map, Briefcase, Filter, SlidersHorizontal, ChevronDown, BookOpen } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import ItineraryCard from '../components/itineraries/ItineraryCard';
import CreateItineraryModal from '../components/itineraries/CreateItineraryModal';
import { Itinerary } from '../types/itinerary';

// Sample Mock Data
const MOCK_ITINERARIES: Itinerary[] = [
  {
    id: '1',
    name: '7-Day Cultural Discovery',
    description: 'Exploring ancient rock fortresses and temple cities in the heart of Sri Lanka.',
    startDate: '2026-02-10',
    endDate: '2026-02-17',
    travelers: 2,
    budget: 175000,
    type: 'Cultural',
    status: 'Active',
    coverImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=1200',
    destinationsCount: 5,
    hotelsCount: 4,
    toursCount: 6,
    days: [
      {
        dayNumber: 1,
        date: '2026-02-10',
        activities: [
          {
            id: 'a1',
            time: '08:00 AM',
            type: 'transport',
            title: 'Airport Transfer',
            description: 'Colombo Airport to City Hotel',
            cost: 2500,
            status: 'Booked',
            provider: 'Ceylon Cabs',
            duration: '45 min'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'South Coast Surf & Sun',
    description: 'Beach hopping from Mirissa to Hiriketiya with whale watching adventures.',
    startDate: '2026-03-05',
    endDate: '2026-03-12',
    travelers: 4,
    budget: 250000,
    type: 'Beach',
    status: 'Draft',
    coverImage: 'https://images.unsplash.com/photo-1522310193626-604c5ef8be43?auto=format&fit=crop&q=80&w=1200',
    destinationsCount: 3,
    hotelsCount: 2,
    toursCount: 3,
    days: []
  },
  {
    id: '3',
    name: 'Honeymoon in Highlands',
    description: 'A romantic escape through misty Ella and scenic Nuwara Eliya tea estates.',
    startDate: '2025-11-20',
    endDate: '2025-11-28',
    travelers: 2,
    budget: 420000,
    type: 'Honeymoon',
    status: 'Completed',
    coverImage: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&q=80&w=1200',
    destinationsCount: 4,
    hotelsCount: 3,
    toursCount: 4,
    days: []
  }
];

interface ItinerariesPageProps {
  onViewDetails: (itinerary: Itinerary) => void;
  onNavigate: (page: string) => void;
}

const ItinerariesPage: React.FC<ItinerariesPageProps> = ({ onViewDetails, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Upcoming' | 'Past' | 'Drafts'>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Recently Modified');

  const filteredItineraries = useMemo(() => {
    let results = MOCK_ITINERARIES.filter(it => 
      it.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeTab === 'Upcoming') results = results.filter(it => it.status === 'Active');
    if (activeTab === 'Past') results = results.filter(it => it.status === 'Completed');
    if (activeTab === 'Drafts') results = results.filter(it => it.status === 'Draft');

    return results;
  }, [searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Header Section */}
      <section className="bg-white border-b border-slate-100 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">My Itineraries</h1>
              <p className="text-slate-500 font-medium">Plan your perfect Sri Lankan adventure step by step.</p>
            </div>
            <Button 
              variant="secondary" 
              size="lg" 
              className="rounded-full shadow-lg shadow-orange-500/20 px-8"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus size={20} />}
            >
              Create New Itinerary
            </Button>
          </div>

          <div className="mt-12 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex p-1 bg-slate-100 rounded-2xl w-full lg:w-auto">
              {(['All', 'Upcoming', 'Past', 'Drafts'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 lg:px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="flex-1 lg:w-80">
                <Input 
                  placeholder="Search your trips..." 
                  leftIcon={<Search size={18} />} 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm cursor-pointer hover:border-sky-300 transition-colors">
                <SlidersHorizontal size={18} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{sortBy}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredItineraries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItineraries.map(itinerary => (
              <ItineraryCard 
                key={itinerary.id} 
                itinerary={itinerary} 
                onView={onViewDetails}
                onEdit={() => setIsCreateModalOpen(true)}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <BookOpen size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Start Planning Your Dream Trip</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed">
              Create your first itinerary to organize destinations, hotels, and tours across the Pearl of the Indian Ocean.
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="rounded-full px-10 shadow-xl shadow-orange-500/20"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus size={20} />}
            >
              Create Your First Itinerary
            </Button>
          </div>
        )}
      </div>

      <CreateItineraryModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={(itinerary) => {
          // In a real app, logic to add itinerary to state
          setIsCreateModalOpen(false);
          onViewDetails(itinerary);
        }}
      />
    </div>
  );
};

export default ItinerariesPage;
