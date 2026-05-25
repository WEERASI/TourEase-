
import React from 'react';
import { 
  Heart, Bell, Settings, Search, Calendar, ChevronDown, 
  MapPin, Send, Info, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight, Compass 
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import Radio from '../components/Radio';
import Select from '../components/Select';
import Textarea from '../components/Textarea';

const DesignSystemPreview: React.FC = () => {
  return (
    <div className="p-8 lg:p-12 space-y-16 animate-in fade-in duration-700">
      <header className="border-b pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
            <Compass size={28} />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Design System</h1>
        </div>
        <p className="text-xl text-slate-500 font-light">The visual identity of TourEase - Discovering Sri Lanka with ease.</p>
      </header>

      {/* Hero Visualization - Beach Side */}
      <section className="relative h-[300px] rounded-3xl overflow-hidden shadow-xl">
        <img 
          src="https://images.unsplash.com/photo-1540202404-a2f29036bb57?auto=format&fit=crop&q=80&w=2070" 
          alt="Sri Lankan Beach" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/60 to-transparent flex items-center p-12">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-4">Golden Sands & Turquoise Waters</h2>
            <p className="text-sky-100 opacity-90">Our design system reflects the natural beauty of the Sri Lankan coastline.</p>
          </div>
        </div>
      </section>

      {/* 1. COLORS */}
      <section>
        <SectionTitle title="1. Color Palette" desc="Inspired by Sri Lanka's beaches, oceans, and tropical spirit." />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <ColorCard name="Ocean Blue" hex="#0ea5e9" variable="primary-500" />
          <ColorCard name="Sunset Orange" hex="#ff6b35" variable="secondary-500" />
          <ColorCard name="Temple Gold" hex="#d4af37" variable="accent-gold" />
          <ColorCard name="Tea Green" hex="#2e7d32" variable="accent-green" />
          <ColorCard name="Success" hex="#10b981" variable="success" />
          <ColorCard name="Error" hex="#ef4444" variable="error" />
        </div>
      </section>

      {/* 2. BUTTONS */}
      <section>
        <SectionTitle title="2. Button System" desc="Standardized actions for high-converting user interfaces." />
        <div className="space-y-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="icon" leftIcon={<Heart size={20} />} />
          </div>
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Small</span>
              <Button size="sm">Small Action</Button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Medium</span>
              <Button size="md">Medium Action</Button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Large</span>
              <Button size="lg">Large Call to Action</Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button leftIcon={<Send size={18} />}>With Left Icon</Button>
            <Button rightIcon={<ArrowRight size={18} />} variant="secondary">With Right Icon</Button>
            <Button isLoading>Loading State</Button>
            <Button disabled>Disabled Button</Button>
          </div>
        </div>
      </section>

      {/* 3. INPUTS */}
      <section>
        <SectionTitle title="3. Form Inputs" desc="Clean, accessible, and validated data entry components." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Input label="Text Input" placeholder="Type something..." helperText="This is a helper message." />
            <Input label="Input with Icon" leftIcon={<Search size={18} />} placeholder="Search destinations..." />
            <Input label="Disabled State" disabled value="You cannot edit this" />
          </div>
          <div className="space-y-6">
            <Input label="Success State" success defaultValue="Verified Account" />
            <Input label="Error State" error="This field is required" placeholder="Missing data" />
            <Input 
              label="Date Input" 
              type="date" 
            />
          </div>
          <div className="space-y-6">
            <Select 
              label="Select Dropdown" 
              options={[
                { value: '', label: 'Select a region' },
                { value: 'kandy', label: 'Kandy' },
                { value: 'galle', label: 'Galle' },
                { value: 'colombo', label: 'Colombo' }
              ]} 
            />
            <Textarea 
              label="Textarea" 
              placeholder="Tell us about your trip..." 
            />
          </div>
        </div>
      </section>

      {/* 4. SELECTION CONTROLS */}
      <section>
        <SectionTitle title="4. Selection Controls" desc="Checkboxes and Radio buttons with custom branding." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Checkboxes</h4>
            <div className="space-y-4">
              <Checkbox label="Standard Checkbox" checked />
              <Checkbox label="Unchecked Checkbox" />
              <Checkbox label="Disabled option" disabled />
              <Checkbox 
                label={<span className="text-slate-500">Agree to <a href="#" className="text-sky-600 underline">terms</a></span>} 
              />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Radio Buttons</h4>
            <div className="space-y-4">
              <Radio name="type-preview" label="Tourist / Customer" checked />
              <Radio name="type-preview" label="Tour Operator" />
              <Radio name="type-preview" label="Hotel Partner" />
              <Radio name="type-disabled" label="Disabled Radio" disabled />
            </div>
          </div>
        </div>
      </section>

      {/* 5. TYPOGRAPHY */}
      <section>
        <SectionTitle title="5. Typography Scale" desc="Modular scale using Inter and Playfair Display." />
        <div className="space-y-8 border p-8 lg:p-12 rounded-2xl bg-white shadow-sm">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">Heading 1 - Playfair 4xl</span>
            <h1 className="text-5xl font-bold text-slate-900">Experience Sri Lanka Like Never Before</h1>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">Heading 2 - Playfair 3xl</span>
            <h2 className="text-3xl font-bold text-slate-800">Ancient Wonders of the Cultural Triangle</h2>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">Body Large - Inter lg</span>
            <p className="text-lg text-slate-600 leading-relaxed">From the mist-shrouded peaks of the central highlands to the sun-kissed sands of the southern coast, TourEase connects you to the heart of our island nation.</p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">Body Base - Inter base</span>
            <p className="text-base text-slate-600 leading-relaxed">Our platform provides comprehensive management for tour operators, hotel partners, and travelers seeking authentic experiences across the Pearl of the Indian Ocean.</p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">Small Text - Inter sm</span>
            <p className="text-sm text-slate-500 italic">Registered in the Democratic Socialist Republic of Sri Lanka since 2024.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
  <div className="mb-8">
    <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500">{desc}</p>
  </div>
);

const ColorCard = ({ name, hex, variable }: { name: string; hex: string; variable: string }) => (
  <div className="group cursor-pointer">
    <div 
      className="w-full aspect-square rounded-2xl shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden relative" 
      style={{ backgroundColor: `var(--color-${variable})` }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
        <span className="text-[10px] font-bold text-white bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">Copy HEX</span>
      </div>
    </div>
    <div className="mt-3">
      <h5 className="font-semibold text-sm text-slate-800">{name}</h5>
      <p className="text-xs text-slate-400 font-mono uppercase mt-0.5 tracking-tight">{hex}</p>
    </div>
  </div>
);

export default DesignSystemPreview;
