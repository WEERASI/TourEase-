import React from 'react';
import {
    LayoutDashboard, Map, CalendarCheck, Star, BarChart3,
    DollarSign, User, LogOut, Compass, ChevronLeft, X,
} from 'lucide-react';

interface OperatorSidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const navItems = [
    { id: 'operator-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'operator-tours', label: 'My Tours', icon: Map },
    { id: 'operator-bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'operator-reviews', label: 'Reviews', icon: Star },
    { id: 'operator-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'operator-finances', label: 'Finances', icon: DollarSign },
    { id: 'operator-profile', label: 'Profile & Settings', icon: User },
];

const OperatorSidebar: React.FC<OperatorSidebarProps> = ({
    currentPage, onNavigate, isOpen, onClose, onLogout,
}) => {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed lg:relative inset-y-0 left-0 z-50 w-72 
                    bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 
                    text-white flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    shadow-2xl lg:shadow-none
                `}
            >
                {/* Logo / Brand */}
                <div className="px-6 py-6 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('operator-dashboard')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Compass size={22} className="text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-lg tracking-tight">TourEase</span>
                            <span className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">Operator Portal</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <div className="px-3 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Main Menu</span>
                    </div>
                    {navItems.map((item) => {
                        const isActive = currentPage === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { onNavigate(item.id); onClose(); }}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                                    transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400 shadow-sm ring-1 ring-emerald-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }
                                `}
                            >
                                <Icon size={20} className={isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="px-4 pb-6 space-y-2 border-t border-white/10 pt-4">
                    <button
                        onClick={() => onNavigate('home')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                        <ChevronLeft size={20} className="text-slate-500" />
                        <span>Tourist Site</span>
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default OperatorSidebar;
