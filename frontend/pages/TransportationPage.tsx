import React, { useState, useMemo } from 'react';
import { 
  Search, Car, Ship, MapPin, Calendar, Clock, Users, 
  Briefcase, Filter, SlidersHorizontal, ArrowRight,
  ShieldCheck, Phone, CheckCircle, Bike, 
  Navigation, SortAsc, Map as MapIcon, ChevronRight,
  RotateCcw, Info, LayoutGrid
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';
import TransportationCard from '../components/TransportationCard';
import TransportBookingModal from '../components/TransportBookingModal';

const PlaneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

const TRANSPORT_TYPES = ["Airport Transfer", "City to City", "Vehicle Rental", "Private Hire"];
const CATEGORIES = [
  { id: 'all', icon: <LayoutGrid size={20} />, label: 'All Transportation' },
  { id: 'airport', icon: <PlaneIcon />, label: 'Airport Transfers' },
  { id: 'intercity', icon: <Navigation size={20} />, label: 'Intercity' },
  { id: 'rentals', icon: <Car size={20} />, label: 'Vehicle Rentals' },
  { id: 'bikes', icon: <Bike size={20} />, label: 'Bike Rentals' },
];

const VEHICLE_TYPES = ["Sedan", "SUV", "Van", "Luxury", "Budget", "Bikes"];
const CAPACITIES = ["1-3 Passengers", "4-6 Passengers", "7-12 Passengers", "12+ Passengers"];
const AMENITIES = ["Air Conditioning", "Free WiFi", "Child Seat", "Wheelchair Accessible"];

const SAMPLE_VEHICLES = [
  {
    id: 1,
    vehicleName: "Toyota Prius / Axio",
    vehicleModel: "Hybrid Sedan • AC",
    category: "Comfort" as const,
    serviceType: "airport", // Added metadata for category filtering
    passengers: 3,
    luggage: 2,
    imageUrl: "https://i.ikman-st.com/toyota-prius-2013-for-sale-matara-241/b60c0a29-e3f7-402d-824c-03ed19b111cf/1200/800/fitted.jpg",
    providerName: "Ceylon Cabs",
    providerRating: 4.8,
    reviews: 156,
    price: 3500,
    priceType: "per trip" as const,
    fuelPolicy: "Full to Full",
    driverIncluded: true,
    amenities: ["Air Conditioning", "Free WiFi"]
  },
  {
    id: 2,
    vehicleName: "Toyota KDH High-Roof",
    vehicleModel: "Luxury Mini-Van • AC • WiFi",
    category: "Premium" as const,
    serviceType: "intercity",
    passengers: 9,
    luggage: 6,
    imageUrl: "https://i.ikman-st.com/toyota-kdh-high-roof-japan-2025-for-sale-colombo-8/6bd93a2b-2d0e-4ccb-91a3-8f50586b166a/1200/630/fitted.jpg",
    providerName: "Lanka Tours Transport",
    providerRating: 4.9,
    reviews: 242,
    price: 8500,
    priceType: "per trip" as const,
    fuelPolicy: "Included",
    driverIncluded: true,
    amenities: ["Air Conditioning", "Free WiFi", "Wheelchair Accessible"]
  },
  {
    id: 3,
    vehicleName: "Mitsubishi Montero Sport",
    vehicleModel: "4x4 Luxury SUV • AC",
    category: "Luxury" as const,
    serviceType: "rentals",
    passengers: 5,
    luggage: 4,
    imageUrl: "https://i.pinimg.com/736x/f3/58/14/f35814f3f53eef140b4a97abc5a2a7de.jpg",
    providerName: "Elite Rentals SL",
    providerRating: 4.7,
    reviews: 89,
    price: 18000,
    priceType: "per day" as const,
    fuelPolicy: "Excluded",
    driverIncluded: false,
    amenities: ["Air Conditioning", "Child Seat"]
  },
  {
    id: 4,
    vehicleName: "Suzuki Alto",
    vehicleModel: "Economy Hatchback",
    category: "Economy" as const,
    serviceType: "rentals",
    passengers: 3,
    luggage: 1,
    imageUrl: "https://i.pinimg.com/736x/78/9f/64/789f645d17d7b512ef2bfe7aafa168c3.jpg",
    providerName: "Budget Wheels",
    providerRating: 4.5,
    reviews: 112,
    price: 2500,
    priceType: "per day" as const,
    fuelPolicy: "Excluded",
    driverIncluded: false,
    amenities: ["Air Conditioning"]
  },
  {
    id: 5,
    vehicleName: "Honda Dio",
    vehicleModel: "Modern Touring Scooter",
    category: "Economy" as const,
    serviceType: "bikes",
    passengers: 2,
    luggage: 1,
    imageUrl: "https://www.riyasakwala.lk/public/images/vehicle_ad/203/AD000210-0.jpg",
    providerName: "Island Bikes",
    providerRating: 4.6,
    reviews: 45,
    price: 1500,
    priceType: "per day" as const,
    fuelPolicy: "Full to Full",
    driverIncluded: false,
    amenities: []
  }
];

const TransportationPage: React.FC = () => {
  const [transportType, setTransportType] = useState("Airport Transfer");
  const [pickup, setPickup] = useState("Colombo International Airport (CMB)");
  const [dropoff, setDropoff] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all'); // Default to 'all'

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Recommended");

  // Filtering Logic
  const filteredVehicles = useMemo(() => {
    return SAMPLE_VEHICLES.filter(vehicle => {
      // 0. Primary Category Filter (from category buttons)
      if (activeCategory !== 'all' && vehicle.serviceType !== activeCategory) {
        return false;
      }

      // 1. Vehicle Type Filter (from sidebar)
      if (selectedTypes.length > 0) {
        const matchesType = selectedTypes.some(type => 
          vehicle.vehicleName.toLowerCase().includes(type.toLowerCase()) || 
          vehicle.vehicleModel.toLowerCase().includes(type.toLowerCase()) ||
          vehicle.category.toLowerCase().includes(type.toLowerCase()) ||
          (type === "Bikes" && vehicle.serviceType === "bikes")
        );
        if (!matchesType) return false;
      }

      // 2. Capacity Filter (from sidebar)
      if (selectedCapacities.length > 0) {
        const matchesCapacity = selectedCapacities.some(range => {
          if (range === "1-3 Passengers") return vehicle.passengers <= 3;
          if (range === "4-6 Passengers") return vehicle.passengers >= 4 && vehicle.passengers <= 6;
          if (range === "7-12 Passengers") return vehicle.passengers >= 7 && vehicle.passengers <= 12;
          if (range === "12+ Passengers") return vehicle.passengers > 12;
          return false;
        });
        if (!matchesCapacity) return false;
      }

      // 3. Amenities Filter (from sidebar)
      if (selectedAmenities.length > 0) {
        const matchesAmenities = selectedAmenities.every(amenity => 
          vehicle.amenities.includes(amenity)
        );
        if (!matchesAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "User Rating") return b.providerRating - a.providerRating;
      return 0;
    });
  }, [activeCategory, selectedTypes, selectedCapacities, selectedAmenities, sortBy]);

  const toggleFilter = (item: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (state.includes(item)) {
      setState(state.filter(i => i !== item));
    } else {
      setState([...state, item]);
    }
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedCapacities([]);
    setSelectedAmenities([]);
    setActiveCategory('all');
    setSortBy("Recommended");
  };

  const activeFilterCount = selectedTypes.length + selectedCapacities.length + selectedAmenities.length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* 1. HERO SECTION */}
      <section className="bg-sky-700 text-white relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 bg-[url('https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=2000')]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Move Around <span className="text-orange-400 italic">Sri Lanka</span> with Ease</h1>
          <p className="text-sky-100 text-lg mb-12 max-w-2xl mx-auto font-medium">Reliable airport transfers, private rentals, and intercity travel with verified local providers.</p>
          
          {/* SEARCH FORM */}
          <div className="bg-white p-3 md:p-4 rounded-3xl md:rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 max-w-6xl mx-auto border-8 border-white/10">
            <div className="w-full flex flex-col lg:flex-row items-center gap-4">
              
              <div className="w-full lg:w-48 shrink-0">
                <Select 
                  label="Travel Type"
                  options={TRANSPORT_TYPES.map(t => ({ value: t, label: t }))}
                  value={transportType}
                  onChange={(e) => setTransportType(e.target.value)}
                />
              </div>

              <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input 
                    label="Pickup Location" 
                    placeholder="Search pickup point..." 
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    leftIcon={<MapPin size={18} className="text-sky-50" />}
                  />
                </div>
                <div className="flex-1">
                  <Input 
                    label="Drop-off Point" 
                    placeholder="Hotel name or city..." 
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    leftIcon={<Navigation size={18} className="text-orange-500" />}
                  />
                </div>
              </div>

              <div className="w-full lg:w-72 flex gap-4">
                <div className="flex-1">
                  <Input 
                    label="Date" 
                    type="date" 
                    defaultValue="2024-06-15" 
                    rightElement={<Calendar size={20} className="text-sky-500" aria-label="Select date" />}
                  />
                </div>
                <div className="flex-1">
                  <Input 
                    label="Time" 
                    type="time" 
                    defaultValue="09:00" 
                    rightElement={<Clock size={20} className="text-sky-500" aria-label="Select time" />}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-50">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <Users size={18} className="text-slate-400" />
                     <span className="text-xs font-bold text-slate-700">4 Passengers</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Briefcase size={18} className="text-slate-400" />
                     <span className="text-xs font-bold text-slate-700">3 Bags</span>
                  </div>
               </div>
               <Button variant="secondary" className="w-full md:w-auto px-12 py-4 rounded-2xl md:rounded-full text-lg shadow-xl shadow-orange-500/20">
                  Search Transportation
               </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NAVIGATION CATEGORIES */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4">
           {CATEGORIES.map(cat => (
             <button 
               key={cat.id}
               onClick={() => setActiveCategory(cat.id)}
               className={`
                 flex items-center gap-3 px-6 py-4 rounded-2xl whitespace-nowrap transition-all border shadow-lg
                 ${activeCategory === cat.id 
                    ? 'bg-sky-600 border-sky-600 text-white shadow-sky-200' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-sky-200'}
               `}
             >
                <span className={`${activeCategory === cat.id ? 'text-white' : 'text-sky-500'}`}>{cat.icon}</span>
                <span className="font-bold text-sm tracking-tight">{cat.label}</span>
             </button>
           ))}
        </div>
      </div>

      {/* 3. MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-8">
               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b">
                     <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <SlidersHorizontal size={18} className="text-sky-500" />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="bg-sky-100 text-sky-600 text-[10px] px-2 py-0.5 rounded-full font-black">
                            {activeFilterCount}
                          </span>
                        )}
                     </h3>
                     <button 
                       onClick={handleReset}
                       className="text-[10px] font-black text-sky-600 uppercase tracking-widest hover:underline disabled:text-slate-300"
                       disabled={activeFilterCount === 0 && activeCategory === 'all'}
                     >
                        Reset
                     </button>
                  </div>

                  <div className="space-y-10">
                    {/* VEHICLE TYPE SECTION */}
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Type</label>
                       <div className="space-y-3">
                          {VEHICLE_TYPES.map(v => (
                            <Checkbox 
                              key={v} 
                              label={v} 
                              checked={selectedTypes.includes(v)} 
                              onChange={() => toggleFilter(v, selectedTypes, setSelectedTypes)}
                            />
                          ))}
                       </div>
                    </div>

                    {/* MAX PASSENGERS SECTION */}
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Passengers</label>
                       <div className="space-y-3">
                          {CAPACITIES.map(c => (
                            <Checkbox 
                              key={c} 
                              label={c} 
                              checked={selectedCapacities.includes(c)}
                              onChange={() => toggleFilter(c, selectedCapacities, setSelectedCapacities)}
                            />
                          ))}
                       </div>
                    </div>

                    {/* AMENITIES SECTION */}
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amenities</label>
                       <div className="space-y-3">
                          {AMENITIES.map(a => (
                            <Checkbox 
                              key={a} 
                              label={a} 
                              checked={selectedAmenities.includes(a)}
                              onChange={() => toggleFilter(a, selectedAmenities, setSelectedAmenities)}
                            />
                          ))}
                       </div>
                    </div>
                  </div>
               </div>

               {/* TRUST BADGE SIDEBAR */}
               <div className="bg-sky-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
                  <ShieldCheck className="text-orange-400 mb-4" size={40} />
                  <h4 className="text-xl font-bold mb-2 leading-tight">Verified Partners</h4>
                  <p className="text-sky-200 text-xs leading-relaxed mb-6">
                    All our transport providers are background-checked and maintain 4+ star safety ratings in Sri Lanka.
                  </p>
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors">
                     Learn More <ChevronRight size={14} />
                  </button>
               </div>
            </div>
          </aside>

          {/* LISTINGS CONTENT */}
          <main className="flex-1 space-y-8">
            {/* TOP BAR */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-6">
               <div className="px-5 py-2 bg-sky-50 rounded-2xl">
                  <span className="text-sm font-bold text-sky-700">
                    {activeCategory !== 'all' ? CATEGORIES.find(c => c.id === activeCategory)?.label : 'All Transportation'}: {filteredVehicles.length} Options Found
                  </span>
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm">
                     <span className="text-slate-400">Sort:</span>
                     <select 
                       className="bg-transparent font-black text-slate-900 outline-none cursor-pointer"
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value)}
                     >
                        <option value="Recommended">Recommended</option>
                        <option value="Price: Low to High">Price: Low to High</option>
                        <option value="User Rating">User Rating</option>
                     </select>
                  </div>
                  <div className="h-6 w-px bg-slate-100" />
                  <button className="p-2 text-slate-400 hover:text-sky-600 transition-colors">
                     <MapIcon size={20} />
                  </button>
               </div>
            </div>

            {/* RESULTS GRID */}
            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {filteredVehicles.map(vehicle => (
                   <TransportationCard 
                     key={vehicle.id}
                     {...vehicle}
                     onBook={() => {
                       setSelectedVehicle(vehicle);
                       setIsBookingModalOpen(true);
                     }}
                     onViewDetails={() => {}}
                   />
                 ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No vehicles found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  We couldn't find any vehicles matching your current selection of "{CATEGORIES.find(c => c.id === activeCategory)?.label}" and applied filters.
                </p>
                <Button 
                  variant="ghost" 
                  onClick={handleReset}
                  className="rounded-full px-8"
                  leftIcon={<RotateCcw size={18} />}
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 4. WHY BOOK WITH US */}
      <section className="bg-white border-t border-slate-100 py-24 mt-12">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl font-black text-slate-900 mb-4">Seamless Travel Experiences</h2>
               <p className="text-slate-500 font-medium">We partner with the best fleet operators in the country to ensure your journey is safe, comfortable, and on-time.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <ValueProp 
                  icon={<CheckCircle size={32} className="text-emerald-500" />}
                  title="Transparent Pricing"
                  desc="No hidden fees. Highway tolls and fuel policies are clearly stated before you confirm."
               />
               <ValueProp 
                  icon={<Phone size={32} className="text-sky-500" />}
                  title="24/7 Support"
                  desc="Native support team available around the clock to assist with your bookings and driver coordination."
               />
               <ValueProp 
                  icon={<Car size={32} className="text-orange-500" />}
                  title="Verified Vehicles"
                  desc="Every vehicle undergoes regular safety inspections and maintenance checks for your peace of mind."
               />
            </div>
         </div>
      </section>

      {/* BOOKING MODAL */}
      <TransportBookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        transport={selectedVehicle}
        searchParams={{
          pickup: pickup || 'Selected Point',
          dropoff: dropoff || 'Destination',
          date: '2024-06-15',
          time: '09:00 AM',
          type: transportType
        }}
      />
    </div>
  );
};

/* --- MINI COMPONENTS --- */

const ValueProp = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="text-center space-y-4">
     <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        {icon}
     </div>
     <h3 className="text-xl font-bold text-slate-900">{title}</h3>
     <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default TransportationPage;