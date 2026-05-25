// components/admin/AdminNavbar.tsx
// Top navigation bar for the admin dashboard

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, LogOut, Settings, ChevronDown } from 'lucide-react';

interface AdminNavbarProps {
    onToggleMobileSidebar: () => void;
    user: any;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleMobileSidebar, user, onNavigate, onLogout }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Sample notifications
    const notifications = [
        { id: 1, text: 'New hotel pending approval', time: '2 min ago', unread: true },
        { id: 2, text: 'New user registered', time: '15 min ago', unread: true },
        { id: 3, text: 'Booking #1234 confirmed', time: '1 hour ago', unread: false },
    ];

    const unreadCount = notifications.filter((n) => n.unread).length;

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
                {/* Left section */}
                <div className="flex items-center gap-4">
                    <button onClick={onToggleMobileSidebar} className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                        <Menu size={20} />
                    </button>
                    <div className="hidden md:flex items-center relative">
                        <Search size={16} className="absolute left-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="pl-9 pr-4 py-2 w-72 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
                        />
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <div ref={notifRef} className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <h4 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>Notifications</h4>
                                </div>
                                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                                    {notifications.map((n) => (
                                        <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 cursor-pointer ${n.unread ? 'bg-sky-50/30' : ''}`}>
                                            <p className="text-sm text-slate-700">{n.text}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile dropdown */}
                    <div ref={profileRef} className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-sm font-bold">
                                {user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <span className="hidden md:block text-sm font-semibold text-slate-700">{user?.name || 'Admin'}</span>
                            <ChevronDown size={14} className="hidden md:block text-slate-400" />
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>{user?.name || 'Admin'}</p>
                                    <p className="text-xs text-slate-500">{user?.email || 'admin@tourease.lk'}</p>
                                </div>
                                <div className="py-1">
                                    <button onClick={() => { onNavigate('profile-settings'); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                                        <Settings size={16} />
                                        <span>Settings</span>
                                    </button>
                                    <button onClick={() => { onLogout(); setShowProfileMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
