
import React, { useEffect, useState } from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';
import Button from '../components/Button';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [userName, setUserName] = useState('');

  // --- HOME PAGE LOGIC: Check auth on load ---
  useEffect(() => {
    // Check if user data exists in localStorage (set by loginUser in api.ts)
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');

    if (!storedUser || !token) {
      // Not logged in: redirect to login page
      onNavigate?.('login');
    } else {
      try {
        const user = JSON.parse(storedUser);
        // Use user's name if available, otherwise extract from email
        const displayName = user.name || (user.email ? user.email.split('@')[0] : 'Traveler');
        setUserName(displayName.charAt(0).toUpperCase() + displayName.slice(1));
      } catch {
        onNavigate?.('login');
      }
    }
  }, [onNavigate]);

  // If redirecting, don't show the home content briefly
  if (!localStorage.getItem('authToken')) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Updated Background Container with Image and Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-in fade-in duration-1000"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1460627390041-532a28402358?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
          }}
        />

        {/* Subtle pattern overlay (Keeping this for texture) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">

            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-8 text-sm font-bold shadow-xl">
              <Sparkles size={18} className="text-amber-300" />
              <span>Welcome back, {userName}! Discover the Island</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-sm leading-tight">
              Explore the Pearl of the <br />
              <span className="text-sky-300">Indian Ocean</span>
            </h1>

            <p className="text-lg md:text-2xl text-sky-50/90 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
              Find your next island escape. From the hill country peaks to the southern waves.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 ease-out fill-mode-both">
            <div className="bg-white p-3 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-3 max-w-3xl mx-auto group focus-within:ring-4 focus-within:ring-white/20 transition-all">
              <div className="flex-1 w-full flex items-center px-4 gap-3">
                <MapPin className="text-slate-400 group-focus-within:text-sky-500 transition-colors" size={24} />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="w-full py-3 bg-transparent text-slate-800 placeholder-slate-400 text-lg border-none focus:outline-none focus:ring-0"
                />
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="w-full md:w-auto px-10 py-4 rounded-xl md:rounded-full text-lg shadow-lg"
                leftIcon={<Search size={22} />}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Start planning your <span className="text-sky-500">dream itinerary</span> today.</h2>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed">
              TourEase connects you with local experts to create unforgettable journeys. Whether you're seeking adventure, relaxation, or cultural immersion, we have the perfect package for you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => onNavigate?.('tours')}>Explore Tours</Button>
              <Button variant="ghost" onClick={() => onNavigate?.('destinations')}>View Destinations</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-sky-100">
              <img src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Sigiriya" />
            </div>
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-sky-100 mt-12">
              <img src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Ella" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
