
import React from 'react';
import { Backpack, Target, Hotel, Check, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

interface RoleSelectionPageProps {
  onNavigate: (page: string) => void;
  onSelectRole: (role: 'tourist' | 'operator' | 'hotel') => void;
}

const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onNavigate, onSelectRole }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 py-12 px-6 lg:py-20 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Join TourEase</h1>
        <p className="text-lg lg:text-xl text-slate-500 font-light">
          Choose how you want to use our platform and start your journey today.
        </p>
      </div>

      {/* Role Cards Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tourist Card */}
        <RoleCard
          icon={<Backpack size={32} />}
          title="I'm a Tourist"
          description="Explore and book amazing tours across the beautiful landscapes of Sri Lanka."
          features={[
            "Browse local destinations",
            "Book tours and hotel stays",
            "Save favorite itineraries",
            "Share authentic reviews"
          ]}
          onAction={() => onSelectRole('tourist')}
          buttonText="Sign Up as Tourist"
        />

        {/* Operator Card */}
        <RoleCard
          icon={<Target size={32} />}
          title="I'm a Tour Operator"
          description="Showcase your unique tours and reach thousands of international travelers."
          features={[
            "Create curated tour packages",
            "Manage real-time bookings",
            "Track business earnings",
            "Build customer trust"
          ]}
          onAction={() => onSelectRole('operator')}
          buttonText="Sign Up as Operator"
          note="Subject to admin approval"
        />

        {/* Hotel Partner Card */}
        <RoleCard
          icon={<Hotel size={32} />}
          title="I'm a Hotel Owner"
          description="List your property and attract guests seeking luxury or comfort in Sri Lanka."
          features={[
            "List your hotel property",
            "Manage rooms and rates",
            "Accept secure bookings",
            "Showcase property amenities"
          ]}
          onAction={() => onSelectRole('hotel')}
          buttonText="Sign Up as Hotel"
          note="Subject to admin approval"
        />
      </div>

      {/* Footer Link */}
      <div className="mt-16 text-center">
        <p className="text-slate-500">
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate('login')}
            className="text-sky-600 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  onAction: () => void;
  buttonText: string;
  note?: string;
}

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, features, onAction, buttonText, note }) => {
  return (
    <div className="bg-white rounded-[var(--radius-xl)] p-8 border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
      <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        {description}
      </p>

      <ul className="space-y-3 mb-10 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
            <div className="mt-1 p-0.5 bg-emerald-50 text-emerald-500 rounded-full shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Button 
          onClick={onAction} 
          className="w-full justify-between" 
          size="lg"
          rightIcon={<ArrowRight size={18} />}
        >
          {buttonText}
        </Button>
        {note && (
          <p className="mt-3 text-center text-xs text-slate-400 font-medium italic">
            * {note}
          </p>
        )}
      </div>
    </div>
  );
};

export default RoleSelectionPage;
