import React from 'react';
import { Menu, Bell, Search, ChevronDown, User } from 'lucide-react';

interface OperatorNavbarProps {
    onToggleSidebar: () => void;
    user: any;
    onNavigate: (page: string) => void;
}

const OperatorNavbar: React.FC<OperatorNavbarProps> = ({ onToggleSidebar, user, onNavigate }) => {
    const [showDropdown, setShowDropdown] = React.useState(false);

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 lg:px-8 py-3">
            <div className="flex items-center justify-between">
                {/* Left: Mobile menu toggle + Search */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                        <Menu size={22} />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 rounded-xl px-4 py-2.5 w-80 focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:bg-white transition-all">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tours, bookings..."
                            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
                        />
                    </div>
                </div>

                {/* Right: Notifications + Profile */}
                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    <button className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
                                {user?.name?.charAt(0)?.toUpperCase() || 'O'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || 'Tour Operator'}</p>
                                <p className="text-[11px] text-slate-400 font-medium">Tour Operator</p>
                            </div>
                            <ChevronDown size={16} className="text-slate-400 hidden md:block" />
                        </button>

                        {showDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button
                                        onClick={() => { onNavigate('operator-profile'); setShowDropdown(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                    >
                                        <User size={16} />
                                        Profile & Settings
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default OperatorNavbar;
