
import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X, Compass, ChevronDown, LogOut, User } from 'lucide-react';
import Button from './Button';

interface NavbarProps {
  onNavigate: (page: string) => void;
  user?: { name?: string; email?: string } | null;
  onAuthChange?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, user, onAuthChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use user prop for auth state (reactive via App)
  const userEmail = user?.email || null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberUser');
    onAuthChange?.();
    onNavigate('login');
  };

  const navLinks = [
    { name: 'Home', action: () => onNavigate('home') },
    { name: 'Destinations', action: () => onNavigate('destinations') },
    { name: 'Tours', action: () => onNavigate('tours') },
    { name: 'Hotels', action: () => onNavigate('hotels') },
    { name: 'Transport', action: () => onNavigate('transportation') },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${isScrolled
        ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm border-slate-200'
        : 'bg-white py-5 border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200 group-hover:scale-105 transition-transform">
            <Compass size={24} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">TourEase</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={link.action}
              className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors flex items-center gap-1 group"
            >
              {link.name}
              {link.name !== 'Home' && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
            </button>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="hidden lg:flex items-center gap-5">
          <div className="relative">
            <button className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-all">
              <Bell size={20} />
            </button>
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white text-white text-[10px] font-bold flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1" />

          {/* AUTH SECTION */}
          <div className="flex items-center gap-3">
            {userEmail ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                  <User size={18} />
                  <span>{userEmail.split('@')[0]}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-4 border-red-200 text-red-500 hover:bg-red-50"
                  onClick={handleLogout}
                  leftIcon={<LogOut size={16} />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="px-6 rounded-full"
                onClick={() => onNavigate('login')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        <button
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl transition-all duration-300 origin-top ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
          }`}
      >
        <div className="p-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => { link.action(); setIsMobileMenuOpen(false); }}
              className="block w-full text-left text-base font-semibold text-slate-700 hover:text-sky-600 py-2 border-b border-slate-50"
            >
              {link.name}
            </button>
          ))}

          <div className="pt-4 flex flex-col gap-3">
            {userEmail ? (
              <Button variant="danger" className="w-full" onClick={handleLogout}>Logout</Button>
            ) : (
              <Button variant="primary" className="w-full" onClick={() => onNavigate('login')}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
