
import React, { useState } from 'react';
import { 
  Search, Briefcase, Heart, Bell, Trash2, 
  Calendar, RefreshCcw, Compass, Map
} from 'lucide-react';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { TourCardSkeleton, ListItemSkeleton, TableRowSkeleton, SkeletonBase } from '../components/Skeleton';
import Button from '../components/Button';

const StatesPreviewPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="p-8 lg:p-12 space-y-16 max-w-7xl mx-auto pb-24 animate-in fade-in duration-700">
      <header className="border-b border-slate-100 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Loading & Empty States</h1>
            <p className="text-slate-500">Standardized UI feedback for asynchronous operations and missing data.</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setLoading(!loading)}
            leftIcon={<RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />}
          >
            {loading ? 'Stop Loading' : 'Start Loading'}
          </Button>
        </div>
      </header>

      {/* 1. SPINNERS */}
      <section className="space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-900">1. Spinners</h2>
          <p className="text-slate-500">Themed loading indicators for different context sizes.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-12 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="sm" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Small (Buttons)</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Spinner size="md" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Medium (Sections)</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Large (Modals)</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Spinner size="xl" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Extra Large (Page)</span>
          </div>
        </div>
      </section>

      {/* 2. SKELETON LOADERS */}
      <section className="space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-900">2. Skeleton Loaders</h2>
          <p className="text-slate-500">Animated shimmers that mirror the final UI structure.</p>
        </div>
        
        <div className="space-y-10">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Tour Card Skeletons</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TourCardSkeleton />
              <TourCardSkeleton />
              <TourCardSkeleton />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">List Item Skeletons</h3>
              <div className="space-y-3">
                <ListItemSkeleton />
                <ListItemSkeleton />
                <ListItemSkeleton />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Table Skeletons</h3>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-slate-50">
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EMPTY STATES */}
      <section className="space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-900">3. Empty States</h2>
          <p className="text-slate-500">Clear guidance when no data is found or items are cleared.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EmptyState 
            icon={<Briefcase size={40} />}
            title="No Bookings Yet"
            description="Your itinerary looks a bit empty. Start exploring our handpicked tours across the island."
            actionLabel="Explore Tours"
            onAction={() => {}}
          />
          <EmptyState 
            icon={<Search size={40} />}
            title="No Results Found"
            description="We couldn't find anything matching your search. Try adjusting your filters or keywords."
            actionLabel="Clear Filters"
            onAction={() => {}}
          />
          <EmptyState 
            icon={<Heart size={40} />}
            title="Your Wishlist is Empty"
            description="Save the destinations and tours you love to easily find them later."
            actionLabel="Browse Destinations"
            onAction={() => {}}
          />
          <EmptyState 
            icon={<Bell size={40} />}
            title="All Caught Up!"
            description="You have no new notifications. We'll alert you here when something important happens."
          />
        </div>
      </section>
    </div>
  );
};

export default StatesPreviewPage;
