
import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Compass, Calendar, RotateCcw, X, Loader2 } from 'lucide-react';
import TourPackageCard from '../components/TourPackageCard';
import Input from '../components/Input';
import Button from '../components/Button';
import TourFiltersModal from '../components/tours/TourFiltersModal';
import SortDropdown, { SortOption } from '../components/tours/SortDropdown';
import { TourPackage, TourFilters, TourType, TourDifficulty } from '../types/tour';
import { apiRequest } from '../services/api';



interface ToursPageProps {
  onNavigateDetail?: (id: string | number) => void;
}

const ToursPage: React.FC<ToursPageProps> = ({ onNavigateDetail }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("2024-06-15");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("Recommended");
  const [filters, setFilters] = useState<TourFilters>({
    priceRange: [0, 500000],
    durations: [],
    types: [],
    ratings: [],
    difficulties: [],
    features: []
  });

  // API state
  const [apiTours, setApiTours] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  // Fetch tours from backend API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest('/tours');
        if (response.success && response.data) {
          const tours: TourPackage[] = (response.data as any[]).map((t: any) => ({
            id: t._id || t.id,
            _id: t._id,
            title: t.title,
            duration: t.duration,
            durationDays: t.durationDays,
            rating: t.rating || 0,
            price: t.price,
            imageUrl: t.imageUrl,
            badge: t.badge,
            type: t.type,
            difficulty: t.difficulty,
            inclusions: t.inclusions || [],
          }));
          setApiTours(tours);
          setApiError(false);
        }
      } catch (error) {
        console.error('Failed to fetch tours from API:', error);
        setApiError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Only use real tours from the API — no hardcoded fallbacks
  const TOURS_DATA = apiTours;

  // Calculate filtered results for modal count preview and final display
  const getFilteredTours = (currentFilters: TourFilters, query: string) => {
    return TOURS_DATA.filter(tour => {
      const matchesSearch = tour.title.toLowerCase().includes(query.toLowerCase());
      const matchesPrice = tour.price <= currentFilters.priceRange[1];
      const matchesType = currentFilters.types.length === 0 || currentFilters.types.includes(tour.type);
      const matchesDifficulty = currentFilters.difficulties.length === 0 || currentFilters.difficulties.includes(tour.difficulty);
      const matchesRating = currentFilters.ratings.length === 0 || currentFilters.ratings.some(r => tour.rating >= r);

      const matchesDuration = currentFilters.durations.length === 0 || currentFilters.durations.some(d => {
        if (d === '1-2 Days') return tour.durationDays <= 2;
        if (d === '3-4 Days') return tour.durationDays >= 3 && tour.durationDays <= 4;
        if (d === '5-7 Days') return tour.durationDays >= 5 && tour.durationDays <= 7;
        if (d === '8+ Days') return tour.durationDays >= 8;
        return false;
      });

      return matchesSearch && matchesPrice && matchesType && matchesDifficulty && matchesRating && matchesDuration;
    });
  };

  const filteredAndSortedTours = useMemo(() => {
    let results = getFilteredTours(filters, searchQuery);

    results.sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High': return a.price - b.price;
        case 'Price: High to Low': return b.price - a.price;
        case 'Highest Rated': return b.rating - a.rating;
        case 'Shortest First': return a.durationDays - b.durationDays;
        case 'Longest First': return b.durationDays - a.durationDays;
        default: return 0;
      }
    });

    return results;
  }, [searchQuery, filters, sortBy, TOURS_DATA]);

  const activeFilterCount = (
    filters.types.length +
    filters.durations.length +
    filters.ratings.length +
    filters.difficulties.length +
    (filters.priceRange[1] < 500000 ? 1 : 0)
  );

  const removeFilter = (key: keyof TourFilters, value: any) => {
    setFilters(prev => {
      if (key === 'priceRange') return { ...prev, priceRange: [0, 500000] };
      const current = prev[key] as any[];
      return { ...prev, [key]: current.filter(i => i !== value) };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 mb-4 text-sm font-medium text-slate-400">
              <span className="hover:text-sky-600 cursor-pointer">Home</span>
              <span>/</span>
              <span className="text-slate-900">Tour Packages</span>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Curated <span className="text-sky-500">Tour Packages</span>
            </h1>
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              Explore hand-picked itineraries designed to immerse you in the authentic spirit of Sri Lanka.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Where would you like to go?"
                leftIcon={<Search size={18} />}
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="date"
                className="w-full"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                rightElement={<Calendar size={18} className="text-sky-500" />}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant={activeFilterCount > 0 ? "primary" : "ghost"}
                className="flex-1 px-6 rounded-xl relative"
                leftIcon={<SlidersHorizontal size={18} />}
                onClick={() => setIsFilterModalOpen(true)}
              >
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
              <Button variant="primary" className="flex-1 px-8 rounded-xl">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Controls */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest self-center mr-2">Active:</span>
            {filters.types.map(t => (
              <FilterChip key={t} label={t} onRemove={() => removeFilter('types', t)} />
            ))}
            {filters.durations.map(d => (
              <FilterChip key={d} label={d} onRemove={() => removeFilter('durations', d)} />
            ))}
            {filters.ratings.map(r => (
              <FilterChip key={r} label={`${r}+ Stars`} onRemove={() => removeFilter('ratings', r)} />
            ))}
            {filters.difficulties.map(diff => (
              <FilterChip key={diff} label={diff} onRemove={() => removeFilter('difficulties', diff)} />
            ))}
            {filters.priceRange[1] < 500000 && (
              <FilterChip label={`Under LKR ${filters.priceRange[1].toLocaleString()}`} onRemove={() => removeFilter('priceRange', null)} />
            )}
            <button
              onClick={() => setFilters({ priceRange: [0, 500000], durations: [], types: [], ratings: [], difficulties: [], features: [] })}
              className="text-xs font-bold text-sky-600 hover:underline px-2"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-sky-100 text-sky-600 rounded-lg text-xs font-bold uppercase tracking-wider">
              {isLoading ? 'Loading...' : `${filteredAndSortedTours.length} Packages Found`}
            </div>
          </div>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Loader2 size={40} className="text-sky-500 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Loading tour packages...</h3>
            <p className="text-slate-500">Fetching the latest tours for you</p>
          </div>
        ) : filteredAndSortedTours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAndSortedTours.map((tour, idx) => (
              <div
                key={tour._id || tour.id}
                className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                <TourPackageCard
                  title={tour.title}
                  duration={tour.duration}
                  rating={tour.rating}
                  price={tour.price}
                  imageUrl={tour.imageUrl}
                  badge={tour.badge}
                  onBookNow={() => onNavigateDetail?.(tour._id || tour.id)}
                />
              </div>
            ))}
          </div>
        ) : apiTours.length === 0 && !apiError ? (
          // No approved tours exist in the system yet
          <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-sky-50 text-sky-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Compass size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No tours available yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Tour packages are being curated and approved. Please check back soon for amazing Sri Lanka experiences!
            </p>
          </div>
        ) : (
          // Tours exist but none match current filters
          <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Compass size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No packages match your criteria</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters or search keywords to find the perfect tour.</p>
            <Button
              variant="ghost"
              className="mt-8 px-10 rounded-full"
              onClick={() => setFilters({ priceRange: [0, 500000], durations: [], types: [], ratings: [], difficulties: [], features: [] })}
              leftIcon={<RotateCcw size={18} />}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <TourFiltersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={setFilters}
        matchCount={filteredAndSortedTours.length}
      />
    </div>
  );
};

// --- FIX: Added React.FC type definition to correctly handle JSX props including 'key' ---
const FilterChip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-sm animate-in zoom-in-95 duration-200">
    {label}
    <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors">
      <X size={14} />
    </button>
  </div>
);

export default ToursPage;
