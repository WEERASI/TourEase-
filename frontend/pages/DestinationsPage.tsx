
import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, SlidersHorizontal, Star, X, Check, RotateCcw } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';

// 1. UPDATED DATA with categories and standardized provinces
export const DESTINATIONS_DATA = [
  {
    id: 1,
    name: "Sigiriya",
    location: "Central Province, Sri Lanka",
    province: "Central Province",
    categories: ["Historical", "Adventure", "Cultural"],
    description: "Rising 200 meters from the central plains, the ancient rock fortress of Sigiriya is an archaeological wonder and a UNESCO World Heritage site.",
    rating: 4.9,
    reviews: 1240,
    imageUrl: "https://plus.unsplash.com/premium_photo-1730145749791-28fc538d7203?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "Sigiriya or Sinhagiri is an ancient rock fortress located in the northern Matale District near the town of Dambulla in the Central Province, Sri Lanka. It is a site of historical and archaeological significance that is dominated by a massive column of rock around 180 metres (590 ft) high.",
    activities: ["Climb Lion Rock", "Explore Water Gardens", "Visit Pidurangala Rock", "Village Safari Tours"],
    bestTime: "January to April",
    weather: "25°C - 32°C"
  },
  {
    id: 2,
    name: "Ella",
    location: "Uva Province, Sri Lanka",
    province: "Uva Province",
    categories: ["Mountain", "Adventure", "Hill Country"],
    description: "A misty mountain town famous for its lush tea plantations, the Nine Arch Bridge, and the breathtaking views from Little Adam's Peak.",
    rating: 4.8,
    reviews: 856,
    imageUrl: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "Ella is a small town in the Badulla District of Uva Province, Sri Lanka. It is approximately 200 kilometres (120 mi) east of Colombo and is situated at an elevation of 1,041 metres above sea level.",
    activities: ["Nine Arch Bridge Walk", "Hike Little Adam's Peak", "Visit Ravana Falls", "Tea Factory Tour"],
    bestTime: "December to March",
    weather: "15°C - 25°C"
  },
  {
    id: 3,
    name: "Mirissa",
    location: "Southern Province, Sri Lanka",
    province: "Southern Province",
    categories: ["Beach", "Wildlife", "Adventure"],
    description: "A tropical paradise known for its whale watching, surfing, and the iconic Coconut Tree Hill overlooking the turquoise Indian Ocean.",
    rating: 4.7,
    reviews: 642,
    imageUrl: "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "Mirissa is a small town on the south coast of Sri Lanka. Mirissa's beach and nightlife make it a popular tourist destination. It is also one of the island's main whale watching locations.",
    activities: ["Whale Watching", "Surfing", "Coconut Tree Hill Photos", "Secret Beach Relaxation"],
    bestTime: "November to April",
    weather: "28°C - 33°C"
  },
  {
    id: 4,
    name: "Galle Fort",
    location: "Southern Province, Sri Lanka",
    province: "Southern Province",
    categories: ["Historical", "Cultural", "Shopping"],
    description: "A historic Dutch fortress city with charming cobblestone streets, colonial architecture, and stunning sunset views from the ramparts.",
    rating: 4.9,
    reviews: 2105,
    imageUrl: "https://images.unsplash.com/photo-1704797390682-76479a29dc9a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "Galle Fort on the southwest coast of Sri Lanka was built first in 1588 by the Portuguese, then extensively fortified by the Dutch during the 17th century.",
    activities: ["Walk the Ramparts", "Visit Maritime Museum", "Shopping in Old Town", "Lighthouse Sunset"],
    bestTime: "December to March",
    weather: "27°C - 31°C"
  },
  {
    id: 5,
    name: "Kandy",
    location: "Central Province, Sri Lanka",
    province: "Central Province",
    categories: ["Cultural", "Religious", "Hill Country"],
    description: "The cultural capital of Sri Lanka, home to the sacred Temple of the Tooth Relic and surrounded by misty green hills and lakes.",
    rating: 4.6,
    reviews: 1890,
    imageUrl: "https://images.unsplash.com/photo-1665849050430-5e8c16bacf7e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "Kandy is a major city in Sri Lanka located in the Central Province. It was the last capital of the ancient kings' era of Sri Lanka.",
    activities: ["Temple of the Tooth Visit", "Peradeniya Botanical Gardens", "Kandy Lake Walk", "Cultural Dance Show"],
    bestTime: "January to April",
    weather: "22°C - 28°C"
  },
  {
    id: 6,
    name: "Yala National Park",
    location: "Southern Province, Sri Lanka",
    province: "Southern Province",
    categories: ["Wildlife", "Safari", "Adventure"],
    description: "Experience the wild heart of the island. Yala is world-famous for its high leopard density and diverse wildlife safaris.",
    rating: 4.8,
    reviews: 1432,
    imageUrl: "https://images.unsplash.com/photo-1603789764099-52b21a871336?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    longDescription: "Yala National Park is the most visited and second largest national park in Sri Lanka, bordering the Indian Ocean.",
    activities: ["Jeep Safari", "Leopard Spotting", "Bird Watching", "Visit Sithulpawwa Temple"],
    bestTime: "February to June",
    weather: "26°C - 32°C"
  }
];

const PROVINCES = ["All Provinces", "Central Province", "Southern Province", "Uva Province", "Western Province", "North Central Province"];
const CATEGORIES = ["Beach", "Mountain", "Historical", "Wildlife", "Cultural", "Adventure", "Religious", "Safari", "Hill Country", "Shopping"];

interface DestinationsPageProps {
  onExplore?: (destination: any) => void;
}

const DestinationsPage: React.FC<DestinationsPageProps> = ({ onExplore }) => {
  // 2. FILTER STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("All Provinces");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setBy] = useState("Most Popular");
  const [showFilters, setShowFilters] = useState(false);

  // 3. FILTERING LOGIC
  const filteredDestinations = useMemo(() => {
    let results = [...DESTINATIONS_DATA];

    // Search by Name
    if (searchQuery.trim() !== "") {
      results = results.filter(dest => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Province
    if (selectedProvince !== "All Provinces") {
      results = results.filter(dest => dest.province === selectedProvince);
    }

    // Filter by Rating
    if (minRating > 0) {
      results = results.filter(dest => dest.rating >= minRating);
    }

    // Filter by Category (Matching ANY selected category)
    if (selectedCategories.length > 0) {
      results = results.filter(dest => 
        dest.categories.some(cat => selectedCategories.includes(cat))
      );
    }

    // Sorting Logic
    results.sort((a, b) => {
      if (sortBy === "Highest Rated") return b.rating - a.rating;
      if (sortBy === "Most Popular") return b.reviews - a.reviews;
      if (sortBy === "A-Z") return a.name.localeCompare(b.name);
      if (sortBy === "Z-A") return b.name.localeCompare(a.name);
      return 0;
    });

    return results;
  }, [searchQuery, selectedProvince, selectedCategories, minRating, sortBy]);

  // 4. CLEAR FILTERS
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedProvince("All Provinces");
    setSelectedCategories([]);
    setMinRating(0);
    setBy("Most Popular");
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const hasActiveFilters = searchQuery !== "" || selectedProvince !== "All Provinces" || selectedCategories.length > 0 || minRating > 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <nav className="flex items-center gap-2 mb-4 text-sm font-medium text-slate-400">
                <span className="hover:text-sky-600 cursor-pointer">Home</span>
                <span>/</span>
                <span className="text-slate-900">Destinations</span>
              </nav>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Discover Popular <span className="text-sky-500">Destinations</span>
              </h1>
              <p className="text-lg text-slate-500 font-light leading-relaxed">
                From ancient rock fortresses to pristine southern beaches, find the perfect spot for your next Sri Lankan adventure.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-10 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Where do you want to go? (e.g. Sigiriya)" 
                  leftIcon={<Search size={18} />}
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  variant={showFilters ? "primary" : "ghost"} 
                  className="px-6 flex-1 md:flex-none" 
                  leftIcon={<SlidersHorizontal size={18} />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide Filters' : 'More Filters'}
                </Button>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    className="px-4 border-red-200 text-red-500 hover:bg-red-50"
                    onClick={handleClearFilters}
                    leftIcon={<RotateCcw size={18} />}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 animate-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Province Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Province</label>
                    <Select 
                      options={PROVINCES.map(p => ({ value: p, label: p }))}
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                    />
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Minimum Rating</label>
                    <Select 
                      options={[
                        { value: "0", label: "All Ratings" },
                        { value: "5", label: "5 Stars Only" },
                        { value: "4", label: "4 Stars & Above" },
                        { value: "3", label: "3 Stars & Above" },
                      ]}
                      value={minRating.toString()}
                      onChange={(e) => setMinRating(parseInt(e.target.value))}
                    />
                  </div>

                  {/* Sorting Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Sort Results By</label>
                    <Select 
                      options={[
                        { value: "Most Popular", label: "Most Popular (Reviews)" },
                        { value: "Highest Rated", label: "Highest Rated" },
                        { value: "A-Z", label: "Alphabetical (A-Z)" },
                        { value: "Z-A", label: "Alphabetical (Z-A)" },
                      ]}
                      value={sortBy}
                      onChange={(e) => setBy(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categories Toggle Grid */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block mb-4">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 border ${
                          selectedCategories.includes(cat)
                            ? 'bg-sky-500 border-sky-500 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-sky-300'
                        }`}
                      >
                        {selectedCategories.includes(cat) && <Check size={14} />}
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-xs font-bold uppercase tracking-wider">
              {filteredDestinations.length} Results
            </span>
            {hasActiveFilters && (
              <span className="text-xs text-slate-400 font-medium italic">Filters are currently active</span>
            )}
          </div>
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest, idx) => (
              <div 
                key={dest.id} 
                className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                <DestinationCard 
                  name={dest.name}
                  location={dest.location}
                  description={dest.description}
                  rating={dest.rating}
                  reviews={dest.reviews}
                  imageUrl={dest.imageUrl}
                  onExplore={() => onExplore?.(dest)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No destinations match your criteria</h3>
            <p className="text-slate-500">Try adjusting your filters, search terms, or categories to find what you're looking for.</p>
            <Button 
              variant="ghost" 
              className="mt-8 px-10 rounded-full" 
              onClick={handleClearFilters}
              leftIcon={<RotateCcw size={18} />}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationsPage;
