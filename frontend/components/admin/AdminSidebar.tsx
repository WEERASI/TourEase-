// components/admin/AdminSidebar.tsx
// Collapsible admin sidebar with navigation, icons, and logout

import React from 'react';
import {
    LayoutDashboard, MapPin, Hotel, Users, Briefcase,
    BookOpen, BarChart3, Settings, LogOut, ChevronLeft,
    ChevronRight, Compass, X, Star, Globe,
} from 'lucide-react';

interface AdminSidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
    onLogout: () => void;
}

const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-destinations', label: 'Destinations', icon: MapPin },
    { id: 'admin-hotels', label: 'Hotels', icon: Hotel },
    { id: 'admin-tours', label: 'Tours', icon: Globe },
    { id: 'admin-operators', label: 'Tour Operators', icon: Briefcase },
    { id: 'admin-users', label: 'Users', icon: Users },
    { id: 'admin-bookings', label: 'Bookings', icon: BookOpen },
    { id: 'admin-reviews', label: 'Reviews', icon: Star },
    { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({
    currentPage, onNavigate, isCollapsed, onToggleCollapse,
    isMobileOpen, onCloseMobile, onLogout,
}) => {
    const handleNav = (page: string) => {
        onNavigate(page);
        onCloseMobile();
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo area */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('admin-dashboard')}>
                    <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200 shrink-0">
                        <Compass size={20} />
                    </div>
                    {!isCollapsed && <span className="font-bold text-lg text-slate-900 tracking-tight">TourEase</span>}
                </div>
                {/* Collapse toggle (desktop only) */}
                <button
                    onClick={onToggleCollapse}
                    className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                    aria-label="Toggle sidebar"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
                {/* Close button (mobile only) */}
                <button onClick={onCloseMobile} className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                    <X size={18} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {!isCollapsed && (
                    <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p>
                )}
                {menuItems.map((item) => {
                    const isActive = currentPage === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNav(item.id)}
                            title={isCollapsed ? item.label : undefined}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-100'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                } ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <Icon size={20} className="shrink-0" />
                            {!isCollapsed && <span>{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom section — Settings and Logout */}
            <div className="border-t border-slate-100 px-3 py-4 space-y-1">
                <button
                    onClick={() => handleNav('admin-settings')}
                    title={isCollapsed ? 'Settings' : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <Settings size={20} className="shrink-0" />
                    {!isCollapsed && <span>Settings</span>}
                </button>
                <button
                    onClick={onLogout}
                    title={isCollapsed ? 'Logout' : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={20} className="shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={onCloseMobile} />
            )}

            {/* Desktop sidebar */}
            <aside
                className={`hidden md:flex flex-col bg-white border-r border-slate-100 h-screen sticky top-0 transition-all duration-300 ${isCollapsed ? 'w-[72px]' : 'w-64'
                    }`}
            >
                {sidebarContent}
            </aside>

            {/* Mobile sidebar (slide-in drawer) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transform transition-transform duration-300 md:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {sidebarContent}
            </aside>
        </>
    );
};

export default AdminSidebar;
