
import React, { useEffect } from 'react';
import { Star, MapPin, ArrowLeft, Calendar, CloudSun, CheckCircle, ArrowRight, Share2, Heart } from 'lucide-react';
import Button from '../components/Button';

interface DestinationDetailPageProps {
  destination: any;
  onNavigate: (page: string) => void;
}

const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({ destination, onNavigate }) => {
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!destination) {
    onNavigate('destinations');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative h-[60vh] lg:h-[75vh] overflow-hidden">
        <img 
          src={destination.imageUrl} 
          alt={destination.name} 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        
        {/* Navigation Overlays */}
        <div className="absolute top-8 left-8">
          <button 
            onClick={() => onNavigate('destinations')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold hover:bg-white/20 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Explore
          </button>
        </div>

        <div className="absolute top-8 right-8 flex gap-3">
          <button className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all">
            <Share2 size={20} />
          </button>
          <button className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all">
            <Heart size={20} />
          </button>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-16 left-0 right-0">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    UNESCO Heritage
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-bold text-white">{destination.rating}</span>
                  </div>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                  {destination.name}
                </h1>
                <div className="flex items-center gap-2 text-sky-200 text-lg font-medium">
                  <MapPin size={20} />
                  <span>{destination.location}</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                variant="secondary" 
                className="rounded-full shadow-2xl px-12 py-4 text-lg"
                onClick={() => onNavigate('tours')}
              >
                Book a Tour Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Content */}
      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Details (2/3) */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">About the Destination</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {destination.longDescription}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                  <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Best Time to Visit</h4>
                    <p className="text-sm text-slate-500">{destination.bestTime}</p>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                    <CloudSun size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Typical Weather</h4>
                    <p className="text-sm text-slate-500">{destination.weather}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Things to Do</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                {destination.activities.map((activity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 group cursor-default">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <CheckCircle size={20} />
                    </div>
                    <span className="text-lg font-semibold text-slate-700">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b pb-4">Traveler Highlights</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium text-sm">Overall Rating</span>
                  <div className="flex items-center gap-1">
                    <Star size={18} fill="#f59e0b" className="text-amber-500" />
                    <span className="font-bold text-slate-900">{destination.rating}/5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium text-sm">Total Reviews</span>
                  <span className="font-bold text-slate-900">{destination.reviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium text-sm">Safe for Solo Travelers</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">Yes</span>
                </div>
              </div>
            </div>

            {/* Google Maps Placeholder */}
            <div className="bg-slate-200 rounded-3xl h-64 overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="Map" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
                  <MapPin size={18} className="text-sky-500" />
                  View on Map
                </button>
              </div>
            </div>

            {/* Nearby Cross-Sell */}
            <div className="bg-sky-600 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Available Tours</h3>
              <p className="text-sky-100 mb-8 relative z-10 leading-relaxed">
                Explore hand-picked tour packages covering {destination.name} and nearby attractions.
              </p>
              <Button 
                variant="secondary" 
                className="w-full justify-between rounded-xl py-4"
                rightIcon={<ArrowRight size={20} />}
                onClick={() => onNavigate('tours')}
              >
                View Tours
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;
