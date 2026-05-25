// pages/admin/AdminDashboard.tsx
// Main admin dashboard overview with real API data

import React, { useState, useEffect } from 'react';
import {
    MapPin, Hotel, Users, BookOpen, TrendingUp, Eye,
    ArrowUpRight, UserCheck, Clock, Star, Briefcase, Globe,
    Loader2, AlertCircle,
} from 'lucide-react';
import { getDashboardStats } from '../../services/adminApi';

interface AdminDashboardProps {
    onNavigate: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getDashboardStats();
            setData(res.data);
        } catch (err: any) {
            setError(err.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <Loader2 size={32} className="animate-spin text-sky-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-3">
                <AlertCircle size={40} className="text-red-400" />
                <p className="text-slate-500">{error}</p>
                <button onClick={loadData} className="text-sky-600 font-semibold text-sm hover:underline">Retry</button>
            </div>
        );
    }

    const stats = data || {};
    const monthlyBookings = stats.monthlyBookings || [];
    const maxBookings = Math.max(...monthlyBookings.map((b: any) => b.count), 1);

    const roleLabels: Record<string, string> = { tourist: 'Tourist', tour_operator: 'Tour Operator', hotel_partner: 'Hotel Partner', admin: 'Admin' };
    const roleColors: Record<string, string> = { tourist: 'bg-sky-500', tour_operator: 'bg-orange-500', hotel_partner: 'bg-emerald-500', admin: 'bg-purple-500' };

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Welcome back! Here's what's happening with TourEase.</p>
                </div>
                {stats.pendingApprovals?.total > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                        <Clock size={16} className="text-amber-600" />
                        <span className="text-sm font-semibold text-amber-700">{stats.pendingApprovals.total} pending approvals</span>
                    </div>
                )}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { icon: <Users size={22} />, title: 'Total Users', value: stats.totalUsers || 0, color: 'bg-sky-50 text-sky-600', page: 'admin-users' },
                    { icon: <MapPin size={22} />, title: 'Destinations', value: stats.totalDestinations || 0, color: 'bg-emerald-50 text-emerald-600', page: 'admin-destinations' },
                    { icon: <Hotel size={22} />, title: 'Hotels', value: stats.totalHotels || 0, subtitle: `${stats.pendingApprovals?.hotels || 0} pending`, color: 'bg-orange-50 text-orange-600', page: 'admin-hotels' },
                    { icon: <BookOpen size={22} />, title: 'Total Bookings', value: stats.totalBookings || 0, subtitle: `LKR ${((stats.totalRevenue || 0) / 1000000).toFixed(1)}M revenue`, color: 'bg-purple-50 text-purple-600', page: 'admin-bookings' },
                ].map((card) => (
                    <button key={card.title} onClick={() => onNavigate(card.page)} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 text-left hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>{card.icon}</div>
                            <ArrowUpRight size={16} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{card.title}</p>
                        {card.subtitle && <p className="text-xs text-slate-400 mt-1">{card.subtitle}</p>}
                    </button>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Bookings Over Time */}
                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Bookings Over Time</h3>
                        <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Last 8 months</span>
                    </div>
                    <div className="flex items-end gap-3 h-48">
                        {monthlyBookings.map((item: any) => (
                            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-xs font-semibold text-slate-600">{item.count}</span>
                                <div
                                    className="w-full bg-gradient-to-t from-sky-500 to-sky-400 rounded-t-lg transition-all duration-500 hover:from-sky-600 hover:to-sky-500"
                                    style={{ height: `${(item.count / maxBookings) * 100}%`, minHeight: '8px' }}
                                />
                                <span className="text-xs text-slate-400 font-medium">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Users by Role */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Users by Role</h3>
                    <div className="space-y-4">
                        {Object.entries(stats.usersByRole || {}).map(([role, count]: any) => {
                            const pct = stats.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0;
                            return (
                                <div key={role}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-medium text-slate-700">{roleLabels[role] || role}</span>
                                        <span className="text-sm font-bold text-slate-900">{count}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${roleColors[role] || 'bg-slate-400'} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                        <button onClick={() => onNavigate('admin-users')} className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 mx-auto">
                            View all users <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Popular Destinations */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Popular Destinations</h3>
                        <button onClick={() => onNavigate('admin-destinations')} className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                            View all <ArrowUpRight size={14} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {(stats.popularDestinations || []).map((dest: any, idx: number) => (
                            <div key={dest.name || idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{dest.name}</p>
                                    <p className="text-xs text-slate-400">{dest.reviews || 0} reviews</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                    <span className="font-semibold text-slate-700">{dest.rating?.toFixed(1) || '0.0'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Pending Approvals</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Tour Operators', count: stats.pendingApprovals?.operators || 0, icon: <Briefcase size={18} />, color: 'bg-orange-50 text-orange-600', page: 'admin-operators' },
                            { label: 'Tours', count: stats.pendingApprovals?.tours || 0, icon: <Globe size={18} />, color: 'bg-sky-50 text-sky-600', page: 'admin-tours' },
                            { label: 'Hotels', count: stats.pendingApprovals?.hotels || 0, icon: <Hotel size={18} />, color: 'bg-emerald-50 text-emerald-600', page: 'admin-hotels' },
                        ].map((item) => (
                            <button key={item.label} onClick={() => onNavigate(item.page)} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors text-left">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>{item.icon}</div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                                    <p className="text-xs text-slate-400">{item.count} awaiting review</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.count > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {item.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Add Destination', icon: <MapPin size={20} />, page: 'admin-destinations', color: 'bg-sky-50 text-sky-600 hover:bg-sky-100' },
                        { label: 'Approve Hotels', icon: <Hotel size={20} />, page: 'admin-hotels', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
                        { label: 'Manage Users', icon: <Users size={20} />, page: 'admin-users', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
                        { label: 'View Analytics', icon: <TrendingUp size={20} />, page: 'admin-analytics', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
                    ].map((action) => (
                        <button key={action.label} onClick={() => onNavigate(action.page)} className={`flex items-center gap-3 p-4 rounded-xl font-semibold text-sm transition-colors ${action.color}`}>
                            {action.icon}
                            <span>{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
