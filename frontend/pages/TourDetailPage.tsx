
import React, { useState, useEffect } from 'react';
import { 
  Star, Clock, Users, MapPin, Check, X, 
  ChevronRight, Calendar, Heart, Share2, 
  Minus, Plus, ShieldCheck, Info, Loader2, ArrowLeft
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import BookingModal from '../components/BookingModal';
import { apiRequest } from '../services/api';

const FALLBACK_TOURS_DETAILS: Record<number, any> = {
  1: {
    title: "Cultural Triangle Heritage Tour",
    rating: 4.9,
    reviews: 128,
    location: "Sigiriya, Dambulla & Polonnaruwa",
    duration: "5 Days",
    groupSize: "Up to 12 people",
    price: 85000,
    images: [
      "https://images.unsplash.com/photo-1712746547176-3a4812c63da8?q=80&w=1632&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1588598133416-293e6aa1624c?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1625736312933-255d65426b3a?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Immerse yourself in the rich tapestry of Sri Lanka's ancient history. This curated 5-day journey takes you through the heart of the Cultural Triangle, visiting iconic sites like the Sigiriya Rock Fortress, the golden Dambulla Cave Temple, and the sprawling ruins of Polonnaruwa.",
    itinerary: [
      { day: 1, title: "Arrival & Negombo Exploration", desc: "Meet your guide at the airport and head to your beachside hotel in Negombo for a relaxing evening." },
      { day: 2, title: "Sigiriya Rock Fortress", desc: "Climb the legendary Lion Rock and explore the ancient water gardens and frescoes." },
      { day: 3, title: "Ancient City of Polonnaruwa", desc: "A guided cycle tour through the well-preserved ruins of the island's second ancient capital." },
      { day: 4, title: "Dambulla & Village Immersion", desc: "Visit the UNESCO cave temples and experience authentic Sri Lankan rural life and a traditional lunch." },
      { day: 5, title: "Departure via Kandy", desc: "Visit the Temple of the Tooth in Kandy before heading back to the airport or your next destination." }
    ],
    inclusions: ["AC Private Transport", "English Speaking Guide", "All Entrance Fees", "Daily Breakfast", "4-Star Accommodations"],
    exclusions: ["International Airfare", "Lunch & Dinner", "Personal Expenses", "Travel Insurance"]
  },
  2: {
    title: "Wild Safari & Beach Escape",
    rating: 4.8,
    reviews: 95,
    location: "Yala National Park & Mirissa",
    duration: "7 Days",
    groupSize: "Up to 8 people",
    price: 120000,
    images: [
      "https://images.unsplash.com/photo-1674556275189-e78fd6223e6d?q=80&w=736&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1588598133416-293e6aa1624c?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Combine the thrill of wildlife safari with a relaxing golden beach getaway. Venture deep into Yala National Park for leopards, elephants and sloth bears, followed by coastal surfing and whale watching in Mirissa.",
    itinerary: [
      { day: 1, title: "Arrival & Transfer to Yala", desc: "Arrive and transfer to your safari lodge near Yala National Park." },
      { day: 2, title: "Full Day Jeep Safari", desc: "Embark on sunrise and sunset game drives in search of Sri Lankan leopards." },
      { day: 3, title: "Transfer to Mirissa", desc: "Travel along the scenic southern coastline to the beach destination of Mirissa." },
      { day: 4, title: "Whale Watching Cruise", desc: "Catch a morning boat trip to spot blue whales and dolphins in their natural habitat." },
      { day: 5, title: "Beach Relaxation & Surfing", desc: "Spend a leisurely day enjoying Mirissa beach or learning to surf." },
      { day: 6, title: "Galle Fort Day Trip", desc: "Explore the historic Dutch colonial Galle Fort and walk along its ramparts." },
      { day: 7, title: "Departure", desc: "Transfer back to Colombo airport for your departure flight." }
    ],
    inclusions: ["4x4 Safari Jeeps", "Luxury Beach Resort", "English Speaking Guide/Driver", "All Park Entry Fees", "Daily Breakfast"],
    exclusions: ["Tips and Gratuities", "Lunch & Dinner", "Optional Water Sports"]
  },
  3: {
    title: "Hill Country Misty Peaks",
    rating: 4.7,
    reviews: 64,
    location: "Kandy, Nuwara Eliya & Ella",
    duration: "4 Days",
    groupSize: "Up to 15 people",
    price: 65000,
    images: [
      "https://images.unsplash.com/photo-1695188605801-37454176b1a9?q=80&w=1074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Travel through the iconic misty peaks and emerald green tea fields of Sri Lanka's hill country. Take the scenic blue train to Ella, hike to Adams Peak or Ella Rock, and sip freshly brewed Ceylon tea.",
    itinerary: [
      { day: 1, title: "Kandy Cultural Capital", desc: "Visit the Temple of the Sacred Tooth Relic and watch a cultural dance performance." },
      { day: 2, title: "Nuwara Eliya Tea Country", desc: "Drive up to 'Little England', visit a tea plantation and factory for authentic tea tasting." },
      { day: 3, title: "Scenic Train to Ella & Hike", desc: "Ride the world-famous blue train to Ella and hike up to Nine Arch Bridge." },
      { day: 4, title: "Ella Rock Sunrise & Departure", desc: "Catch a morning hike to Ella Rock before starting the return journey to Colombo." }
    ],
    inclusions: ["Scenic Train Tickets", "AC Private Transport", "Tea Plantation Tasting Tour", "Local Hikes Guide", "3-Star Hotels"],
    exclusions: ["Meals not specified", "Personal Porterage", "Entrance fees to optional temples"]
  }
};

const DEFAULT_DETAIL = {
  title: "Sri Lanka Island Tour",
  rating: 4.8,
  reviews: 120,
  location: "Sri Lanka",
  duration: "5 Days",
  groupSize: "Up to 12 people",
  price: 45000,
  images: [
    "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=600"
  ],
  description: "Experience the ultimate Sri Lankan holiday featuring lush rainforests, golden sandy beaches, ancient heritage ruins, and incredible wildlife parks.",
  itinerary: [
    { day: 1, title: "Arrival & City Tour", desc: "Arrive at the airport and enjoy a brief city tour before checking into your hotel." },
    { day: 2, title: "Historical Sites Expedition", desc: "Explore the ancient temples and historical monuments with a certified local guide." },
    { day: 3, title: "Wildlife Safari Adventure", desc: "Board a 4x4 jeep safari to explore one of Sri Lanka's famous national wildlife parks." },
    { day: 4, title: "Beach Relaxation & Water Sports", desc: "Unwind on the pristine beaches of the south coast or join in some fun water activities." },
    { day: 5, title: "Departure", desc: "Enjoy a final souvenir shopping trip in Colombo before catching your flight home." }
  ],
  inclusions: ["AC Transport", "Airport Pick-up & Drop", "Entrance Tickets", "Tour Guide Guide", "Hotel Accommodations"],
  exclusions: ["Lunch & Dinner", "Personal expenses", "Optional activities tips"]
};

interface TourDetailPageProps {
  tourId?: string | number | null;
  onNavigate?: (page: string) => void;
}

const TourDetailPage: React.FC<TourDetailPageProps> = ({ tourId, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [tour, setTour] = useState<any>(null);
  const [mainImage, setMainImage] = useState('');
  const [guests, setGuests] = useState(2);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadTourDetails = async () => {
      if (!tourId) {
        setTour(DEFAULT_DETAIL);
        setMainImage(DEFAULT_DETAIL.images[0]);
        setIsLoading(false);
        return;
      }

      // Check if it's a numeric ID (fallback tour)
      const numericId = Number(tourId);
      if (!isNaN(numericId) && FALLBACK_TOURS_DETAILS[numericId]) {
        const data = FALLBACK_TOURS_DETAILS[numericId];
        setTour(data);
        setMainImage(data.images[0]);
        setIsLoading(false);
        return;
      }

      // Fetch from API if it's a MongoDB string ObjectId
      try {
        setIsLoading(true);
        const response = await apiRequest(`/tours/${tourId}`);
        if (response.success && response.data) {
          const t = response.data;
          
          // Map DB Tour object to UI shape
          const mappedTour = {
            title: t.title,
            rating: t.rating || 4.8,
            reviews: Math.floor(Math.random() * 50) + 15,
            location: t.destinations && t.destinations.length > 0 ? t.destinations.join(', ') : 'Sri Lanka',
            duration: t.duration,
            groupSize: `Up to ${t.maxGroupSize || 12} people`,
            price: t.price,
            images: [
              t.imageUrl,
              ...(t.galleryImages && t.galleryImages.length > 0 ? t.galleryImages : [
                "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=1200",
                "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=600",
                "https://images.unsplash.com/photo-1588598133416-293e6aa1624c?auto=format&fit=crop&q=80&w=600"
              ])
            ],
            description: t.description || "No description provided for this tour package. Explore Sri Lanka's beautiful tourist destinations with our specialized guides.",
            itinerary: t.itinerary && t.itinerary.length > 0 ? t.itinerary.map((it: any) => ({
              day: it.day,
              title: it.title,
              desc: it.description || (it.activities && it.activities.join('. ')) || ''
            })) : DEFAULT_DETAIL.itinerary,
            inclusions: t.inclusions && t.inclusions.length > 0 ? t.inclusions : ["AC Private Transport", "English Speaking Guide", "Hotel Accommodation"],
            exclusions: t.exclusions && t.exclusions.length > 0 ? t.exclusions : ["International Flight Tickets", "Lunch and Dinner", "Personal Items Tips"]
          };

          setTour(mappedTour);
          setMainImage(mappedTour.images[0]);
          setError(false);
        } else {
          // Fall back to default
          setTour(DEFAULT_DETAIL);
          setMainImage(DEFAULT_DETAIL.images[0]);
        }
      } catch (err) {
        console.error('Failed to load tour details:', err);
        setError(true);
        // Load default detail on error so page doesn't crash
        setTour(DEFAULT_DETAIL);
        setMainImage(DEFAULT_DETAIL.images[0]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTourDetails();
  }, [tourId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
        <Loader2 size={48} className="text-sky-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading tour details...</p>
      </div>
    );
  }

  const currentTour = tour || DEFAULT_DETAIL;
  const totalPrice = currentTour.price * guests;

  return (
    <div className="min-h-screen bg-slate-50 pb-12 animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <span className="hover:text-sky-600 cursor-pointer" onClick={() => onNavigate?.('home')}>Home</span>
            <ChevronRight size={14} />
            <span className="hover:text-sky-600 cursor-pointer" onClick={() => onNavigate?.('tours')}>Tours</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 truncate max-w-[200px] md:max-w-xs">{currentTour.title}</span>
          </nav>
          
          <button 
            onClick={() => onNavigate?.('tours')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Tours
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area (70%) */}
          <div className="lg:w-[70%] space-y-8">
            {/* Header & Gallery */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{currentTour.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-slate-900 font-bold">{currentTour.rating}</span>
                      <span className="text-slate-400">({currentTour.reviews} Reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin size={16} />
                      <span>{currentTour.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-full border border-slate-200 hover:bg-white hover:text-sky-600 transition-all">
                    <Share2 size={18} />
                  </button>
                  <button 
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2.5 rounded-full border transition-all ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 hover:text-red-500'}`}
                  >
                    <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-xl)] shadow-lg bg-slate-200">
                  <img src={mainImage} alt="Main" className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />
                </div>
                {currentTour.images && currentTour.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-4">
                    {currentTour.images.map((img: string, i: number) => (
                      <button 
                        key={i} 
                        onClick={() => setMainImage(img)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all bg-slate-100 ${mainImage === img ? 'border-sky-500 ring-2 ring-sky-100' : 'border-transparent hover:border-slate-200'}`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg"><Clock size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Duration</p>
                  <p className="text-sm font-bold text-slate-900">{currentTour.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Group Size</p>
                  <p className="text-sm font-bold text-slate-900">{currentTour.groupSize}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><MapPin size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Pick-up</p>
                  <p className="text-sm font-bold text-slate-900">Colombo/Negombo</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><ShieldCheck size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Insurance</p>
                  <p className="text-sm font-bold text-slate-900">Included</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-100 overflow-x-auto">
                {['Overview', 'Itinerary', 'Inclusions', 'Reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-5 text-sm font-bold transition-all relative shrink-0 ${activeTab === tab ? 'text-sky-600' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 rounded-t-full" />}
                  </button>
                ))}
              </div>
              <div className="p-8">
                {activeTab === 'Overview' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold text-slate-900">Tour Highlights</h3>
                    <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{currentTour.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="flex items-start gap-3">
                        <Check size={18} className="text-emerald-500 mt-1 shrink-0" />
                        <span className="text-slate-700">Explore stunning tourist attractions</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check size={18} className="text-emerald-500 mt-1 shrink-0" />
                        <span className="text-slate-700">Certified professional English-speaking guide</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check size={18} className="text-emerald-500 mt-1 shrink-0" />
                        <span className="text-slate-700">All transfers in air-conditioned vehicles</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check size={18} className="text-emerald-500 mt-1 shrink-0" />
                        <span className="text-slate-700">Authentic local dining options</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Itinerary' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    {currentTour.itinerary && currentTour.itinerary.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-6 relative group">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 font-bold flex items-center justify-center border-2 border-sky-100 shrink-0 z-10">
                            {item.day || (idx + 1)}
                          </div>
                          {idx < currentTour.itinerary.length - 1 && (
                            <div className="w-0.5 h-full bg-slate-100 absolute top-10" />
                          )}
                        </div>
                        <div className="pb-8 flex-1">
                          <h4 className="text-lg font-bold text-slate-900 mb-2">Day {item.day || (idx + 1)}: {item.title}</h4>
                          <p className="text-slate-600 leading-relaxed">{item.desc || item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'Inclusions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-300">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                        Price Includes
                      </h4>
                      <ul className="space-y-3">
                        {currentTour.inclusions && currentTour.inclusions.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-3 text-slate-600">
                            <Check size={16} className="text-emerald-500 shrink-0" /> <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-2 h-6 bg-red-500 rounded-full" />
                        Price Excludes
                      </h4>
                      <ul className="space-y-3">
                        {currentTour.exclusions && currentTour.exclusions.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-3 text-slate-600">
                            <X size={16} className="text-red-500 shrink-0" /> <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'Reviews' && (
                  <div className="text-center py-12 animate-in fade-in duration-300">
                    <div className="flex justify-center gap-1 text-amber-500 mb-4">
                      {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={24} className="text-amber-500" />)}
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">{currentTour.rating} out of 5</h4>
                    <p className="text-slate-500 mb-8">Based on {currentTour.reviews} verified traveler reviews</p>
                    <Button variant="ghost">Read All Reviews</Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Booking Area (30%) */}
          <div className="lg:w-[30%]">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-8 space-y-8">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Starts from</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-sky-600">LKR {currentTour.price.toLocaleString()}</span>
                      <span className="text-slate-400 text-sm font-medium">/ person</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input 
                      label="Departure Date" 
                      type="date" 
                      defaultValue="2024-06-15"
                      leftIcon={<Calendar size={18} />}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Guests</label>
                      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <button 
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="font-bold text-slate-900 text-lg">{guests} Guests</span>
                        <button 
                          onClick={() => setGuests(guests + 1)}
                          className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-6 border-t border-slate-50">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>LKR {currentTour.price.toLocaleString()} x {guests} Guests</span>
                      <span className="font-bold text-slate-900">LKR {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Service Fee & Tax</span>
                      <span className="font-bold text-slate-900">LKR 0</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-slate-100 text-lg">
                      <span className="font-bold text-slate-900">Total Price</span>
                      <span className="font-black text-sky-600">LKR {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full rounded-full shadow-lg shadow-orange-500/20 py-4 font-bold text-lg"
                      onClick={() => setIsBookingModalOpen(true)}
                    >
                      Book Now
                    </Button>
                    <Button variant="ghost" className="w-full rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 font-bold" leftIcon={<Heart size={18} />}>
                      Save to Wishlist
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                    <Info size={14} />
                    <span>Free cancellation up to 48 hours before</span>
                  </div>
                </div>
              </div>

              {/* Help Widget */}
              <div className="bg-sky-600 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500" />
                <h4 className="font-bold mb-2 relative z-10 text-lg">Need Customization?</h4>
                <p className="text-sky-100 text-sm mb-4 relative z-10 leading-relaxed">Talk to our experts about personalizing this tour for your specific needs.</p>
                <button className="bg-white text-sky-600 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-sky-50 transition-all relative z-10 shadow-sm">
                  Chat With Us
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Multi-step Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tourTitle={currentTour.title}
        pricePerPerson={currentTour.price}
        tourId={typeof tourId === 'string' ? tourId : undefined}
      />
    </div>
  );
};

export default TourDetailPage;
