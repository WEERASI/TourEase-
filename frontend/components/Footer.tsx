
import React from 'react';
import { Compass, Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: About */}
          <div className="space-y-6">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Compass size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">TourEase</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-xs">
              Your gateway to authentic Sri Lankan experiences. Discover hidden gems from the hill country to the southern coast.
            </p>
            <div className="pt-2">
              <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-xl border border-slate-700 focus-within:ring-2 focus-within:ring-sky-500/50 transition-all">
                <input 
                  type="email" 
                  placeholder="Join our newsletter" 
                  className="bg-transparent border-none focus:ring-0 text-sm px-3 flex-1 text-white placeholder-slate-500"
                />
                <button className="p-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4">
              <FooterLink onClick={() => {}}>About Us</FooterLink>
              <FooterLink onClick={() => onNavigate('destinations')}>Destinations</FooterLink>
              <FooterLink onClick={() => onNavigate('tours')}>Tour Packages</FooterLink>
              <FooterLink onClick={() => {}}>Hotels & Stays</FooterLink>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
            <ul className="space-y-4">
              <FooterLink onClick={() => {}}>Help Center</FooterLink>
              <FooterLink onClick={() => {}}>Contact Us</FooterLink>
              <FooterLink onClick={() => {}}>Privacy Policy</FooterLink>
              <FooterLink onClick={() => {}}>Terms of Service</FooterLink>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="text-sky-500 shrink-0 mt-1" size={20} />
                <span className="text-sm leading-relaxed">
                  No. 45, Beach Road, Negombo,<br />Western Province, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-sky-500 shrink-0" size={20} />
                <span className="text-sm">+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-sky-500 shrink-0" size={20} />
                <span className="text-sm">info@tourease.lk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-800 mb-10" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm">
            © {currentYear} TourEase Sri Lanka. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <SocialIcon icon={<Facebook size={20} />} href="#" />
            <SocialIcon icon={<Instagram size={20} />} href="#" />
            <SocialIcon icon={<Twitter size={20} />} href="#" />
            <SocialIcon icon={<Linkedin size={20} />} href="#" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
  <li>
    <button 
      onClick={onClick}
      className="text-slate-400 hover:text-sky-400 transition-colors text-sm font-medium"
    >
      {children}
    </button>
  </li>
);

const SocialIcon: React.FC<{ icon: React.ReactNode; href: string }> = ({ icon, href }) => (
  <a 
    href={href}
    className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 shadow-sm"
  >
    {icon}
  </a>
);

export default Footer;
