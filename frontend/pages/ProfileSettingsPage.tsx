
import React, { useState } from 'react';
import { 
  User, Shield, Settings, CreditCard, Building2, Camera, 
  CheckCircle2, Smartphone, Globe, Bell, LogOut, 
  ChevronRight, Laptop, MapPin, Mail, Phone, Calendar,
  LayoutDashboard, Briefcase, Star, BarChart3, Menu
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';

interface ProfileSettingsPageProps {
  onNavigate?: (page: string) => void;
  userRole?: 'tourist' | 'operator' | 'hotel';
}

const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ onNavigate, userRole = 'operator' }) => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const tabs = [
    { id: 'Profile', label: 'Profile Information', icon: <User size={18} /> },
    { id: 'Security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'Preferences', label: 'Preferences', icon: <Settings size={18} /> },
    { id: 'Payment', label: 'Payment Methods', icon: <CreditCard size={18} /> },
    ...(userRole !== 'tourist' ? [{ id: 'Business', label: 'Business Details', icon: <Building2 size={18} /> }] : []),
  ];

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Navigation (Reused Dashboard Style) */}
      <aside 
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200 shrink-0">
              <BarChart3 size={24} />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl tracking-tight text-slate-900 truncate">TourEase Settings</span>
            )}
          </div>

          <nav className="flex-1 px-4 space-y-1 mt-4">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={false} isSidebarOpen={isSidebarOpen} onClick={() => onNavigate?.('dashboard')} />
            <NavItem icon={<Briefcase size={20} />} label="My Tours" active={false} isSidebarOpen={isSidebarOpen} onClick={() => {}} />
            <NavItem icon={<Settings size={20} />} label="Settings" active={true} isSidebarOpen={isSidebarOpen} onClick={() => {}} />
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all ${!isSidebarOpen && 'justify-center'}`}>
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg">
              <Menu size={20} className="text-slate-500" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 hidden sm:block">Account Settings</h2>
          </div>
          
          {showSuccess && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
              <CheckCircle2 size={18} />
              <span className="text-sm font-bold">Settings saved successfully!</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">Suraj Perera</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{userRole}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-sky-100 overflow-hidden border-2 border-white shadow-sm">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 animate-in fade-in duration-500">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
            
            {/* Horizontal Tabs for Section Navigation */}
            <div className="lg:w-64 shrink-0">
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap
                      ${activeTab === tab.id 
                        ? 'bg-sky-50 text-sky-600 font-bold' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                  >
                    {tab.icon}
                    <span className="text-sm">{tab.label}</span>
                    {activeTab === tab.id && <ChevronRight size={14} className="ml-auto hidden lg:block" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-10">
              
              {/* SECTION 1: PROFILE INFORMATION */}
              {activeTab === 'Profile' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
                      </div>
                      <button className="absolute bottom-1 right-1 p-2 bg-sky-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                        <Camera size={18} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Suraj Perera</h3>
                      <p className="text-slate-500 mb-4">Update your photo and personal details here.</p>
                      <Button variant="ghost" size="sm">Replace Image</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                    <Input label="Full Name" defaultValue="Suraj Perera" leftIcon={<User size={18} />} />
                    <Input 
                      label="Email Address" 
                      defaultValue="suraj.p@tourease.lk" 
                      disabled 
                      leftIcon={<Mail size={18} />}
                      rightElement={<div className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">VERIFIED</div>}
                    />
                    <Input label="Phone Number" defaultValue="+94 77 123 4567" leftIcon={<Phone size={18} />} />
                    <Input label="Date of Birth" type="date" defaultValue="1990-05-15" leftIcon={<Calendar size={18} />} />
                    <Input label="Residential Address" defaultValue="No. 45, Beach Road, Negombo" className="md:col-span-2" leftIcon={<MapPin size={18} />} />
                  </div>
                  
                  <div className="pt-6 border-t border-slate-50 flex justify-end">
                    <Button onClick={handleSave} className="px-10 rounded-full">Save Changes</Button>
                  </div>
                </div>
              )}

              {/* SECTION 2: SECURITY */}
              {activeTab === 'Security' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Current Password" type="password" placeholder="••••••••" className="md:col-span-2" />
                      <Input label="New Password" type="password" placeholder="••••••••" />
                      <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        <span>Password Strength</span>
                        <span className="text-emerald-500">Strong</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-emerald-500" />
                      </div>
                    </div>
                    <Button onClick={handleSave} variant="secondary" className="px-8 rounded-full">Update Password</Button>
                  </div>

                  <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-500">Secure your account with an extra layer of protection.</p>
                    </div>
                    <div 
                      onClick={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
                      className={`w-14 h-7 rounded-full transition-all cursor-pointer relative p-1 ${isTwoFactorEnabled ? 'bg-sky-500' : 'bg-slate-300'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all absolute ${isTwoFactorEnabled ? 'right-1' : 'left-1'}`} />
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-100 space-y-6">
                    <h4 className="font-bold text-slate-900">Active Sessions</h4>
                    <div className="space-y-4">
                      <SessionItem icon={<Laptop size={18} />} device="Chrome on MacBook Pro" location="Negombo, Sri Lanka" status="Current Session" />
                      <SessionItem icon={<Smartphone size={18} />} device="TourEase Mobile on iPhone 15" location="Colombo, Sri Lanka" status="3 hours ago" />
                    </div>
                    <Button variant="ghost" className="w-full rounded-xl border-red-200 text-red-500 hover:bg-red-50">Log out all other sessions</Button>
                  </div>
                </div>
              )}

              {/* SECTION 3: PREFERENCES */}
              {activeTab === 'Preferences' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Select 
                      label="Preferred Language" 
                      options={[{value: 'en', label: 'English'}, {value: 'si', label: 'Sinhala (සිංහල)'}, {value: 'ta', label: 'Tamil (தமிழ்)'}]} 
                      defaultValue="en"
                    />
                    <Select 
                      label="Primary Currency" 
                      options={[{value: 'lkr', label: 'Sri Lankan Rupee (LKR)'}, {value: 'usd', label: 'US Dollar (USD)'}, {value: 'eur', label: 'Euro (EUR)'}]} 
                      defaultValue="lkr"
                    />
                  </div>

                  <div className="space-y-6 pt-10 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Bell size={18} className="text-sky-500" />
                      Email Notifications
                    </h4>
                    <div className="space-y-4">
                      <Checkbox label="Booking confirmations and itinerary updates" checked />
                      <Checkbox label="Special offers and destination inspirations" checked />
                      <Checkbox label="Newsletter and travel tips" />
                      <Checkbox label="Security alerts and login notifications" checked />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <Button onClick={handleSave} className="px-10 rounded-full">Save Preferences</Button>
                  </div>
                </div>
              )}

              {/* SECTION 4: PAYMENT METHODS */}
              {activeTab === 'Payment' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Saved Cards</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <CardItem brand="Visa" last4="4242" expiry="12/26" isDefault />
                      <CardItem brand="Mastercard" last4="8821" expiry="08/25" />
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full rounded-2xl py-6 border-dashed border-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">+</span>
                    Add New Payment Method
                  </Button>
                </div>
              )}

              {/* SECTION 5: BUSINESS DETAILS */}
              {activeTab === 'Business' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Company / Hotel Name" defaultValue="Serene Trails Sri Lanka" leftIcon={<Building2 size={18} />} />
                    <Input label="Business License Number" defaultValue="SLTDA-OP-2023-442" leftIcon={<CheckCircle2 size={18} />} />
                    <Input label="Tax ID / VAT Number" defaultValue="11422891-000" />
                    <div className="md:col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                      <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Settlement Bank Account</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Bank Name" defaultValue="Commercial Bank of Ceylon" />
                        <Input label="Account Number" defaultValue="1002 **** 4492" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button onClick={handleSave} variant="secondary" className="px-10 rounded-full">Update Business Info</Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- MINI COMPONENTS --- */

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  isSidebarOpen: boolean;
  onClick: () => void;
}> = ({ icon, label, active, isSidebarOpen, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
      ${active 
        ? 'bg-sky-500 text-white shadow-lg shadow-sky-200 font-bold' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
      ${!isSidebarOpen && 'justify-center px-0'}
    `}
  >
    <span className="shrink-0">{icon}</span>
    {isSidebarOpen && <span className="text-sm">{label}</span>}
  </button>
);

const SessionItem: React.FC<{ icon: React.ReactNode; device: string; location: string; status: string }> = ({ icon, device, location, status }) => (
  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl group hover:border-sky-200 hover:bg-sky-50/50 transition-all">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{device}</p>
        <p className="text-xs text-slate-400">{location}</p>
      </div>
    </div>
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${status === 'Current Session' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
      {status}
    </span>
  </div>
);

const CardItem: React.FC<{ brand: string; last4: string; expiry: string; isDefault?: boolean }> = ({ brand, last4, expiry, isDefault }) => (
  <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl group hover:border-sky-200 transition-all">
    <div className="flex items-center gap-4">
      <div className="w-12 h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[8px] font-black italic text-slate-400">
        {brand}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-900">•••• •••• •••• {last4}</p>
          {isDefault && <span className="text-[10px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded font-bold uppercase">Default</span>}
        </div>
        <p className="text-xs text-slate-400">Expires {expiry}</p>
      </div>
    </div>
    <button className="text-slate-400 hover:text-red-500 transition-colors">
      <LogOut size={16} /> {/* Placeholder for Remove Icon */}
    </button>
  </div>
);

export default ProfileSettingsPage;
