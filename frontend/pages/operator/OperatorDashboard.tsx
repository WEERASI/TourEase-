import React, { useState, useEffect } from 'react';
import {
    Map, CalendarCheck, DollarSign, Clock, TrendingUp, TrendingDown,
    Plus, Eye, Star, ArrowRight, BarChart3, AlertCircle,
    CheckCircle2, XCircle, Loader2,
} from 'lucide-react';
import { getOperatorDashboard } from '../../services/operatorApi';

interface OperatorDashboardProps {
    onNavigate: (page: string) => void;
}

const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dashData, setDashData] = useState<any>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const res = await getOperatorDashboard();
                setDashData(res.data);
            } catch (err: any) {
                setError(err.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-emerald-500 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <div className="text-center max-w-md">
                    <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Failed to Load Dashboard</h3>
                    <p className="text-slate-500 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const stats = dashData?.stats || {};
    const recentTours = dashData?.recentTours || [];
    const recentBookings = dashData?.recentBookings || [];

    const statCards = [
        {
            label: 'Total Tours',
            value: stats.totalTours || 0,
            sub: `${stats.activeTours || 0} active`,
            icon: Map,
            color: 'from-sky-400 to-sky-600',
            bgColor: 'bg-sky-50',
            textColor: 'text-sky-600',
        },
        {
            label: 'Total Bookings',
            value: stats.totalBookings || 0,
            sub: `${stats.pendingBookings || 0} pending`,
            icon: CalendarCheck,
            color: 'from-emerald-400 to-emerald-600',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600',
        },
        {
            label: 'Total Revenue',
            value: `LKR ${(stats.totalRevenue || 0).toLocaleString()}`,
            sub: 'From confirmed bookings',
            icon: DollarSign,
            color: 'from-amber-400 to-amber-600',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600',
        },
        {
            label: 'Pending Approvals',
            value: stats.pendingApprovals || 0,
            sub: 'Tours awaiting review',
            icon: Clock,
            color: 'from-violet-400 to-violet-600',
            bgColor: 'bg-violet-50',
            textColor: 'text-violet-600',
        },
    ];

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: 'bg-slate-100 text-slate-600',
            pending: 'bg-amber-100 text-amber-700',
            approved: 'bg-emerald-100 text-emerald-700',
            rejected: 'bg-red-100 text-red-700',
            active: 'bg-sky-100 text-sky-700',
            inactive: 'bg-slate-100 text-slate-500',
            confirmed: 'bg-emerald-100 text-emerald-700',
            completed: 'bg-sky-100 text-sky-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return colors[status] || 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="p-4 lg:p-8 space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1 font-medium">Welcome back! Here's what's happening with your tours.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onNavigate('operator-tour-create')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <Plus size={18} />
                        Create Tour
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={22} className={card.textColor} />
                                </div>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-black text-slate-900">{card.value}</h3>
                            <p className="text-sm font-semibold text-slate-500 mt-1">{card.label}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions + Rating Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                            onClick={() => onNavigate('operator-tour-create')}
                            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 transition-all duration-200 group"
                        >
                            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus size={24} className="text-white" />
                            </div>
                            <span className="font-semibold text-sm">Create New Tour</span>
                        </button>
                        <button
                            onClick={() => onNavigate('operator-bookings')}
                            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 transition-all duration-200 group"
                        >
                            <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <CalendarCheck size={24} className="text-white" />
                            </div>
                            <span className="font-semibold text-sm">View Bookings</span>
                        </button>
                        <button
                            onClick={() => onNavigate('operator-analytics')}
                            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-100 text-violet-700 transition-all duration-200 group"
                        >
                            <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BarChart3 size={24} className="text-white" />
                            </div>
                            <span className="font-semibold text-sm">View Analytics</span>
                        </button>
                    </div>
                </div>

                {/* Rating Overview */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Overall Rating</h2>
                    <div className="text-center py-4">
                        <div className="text-5xl font-black text-slate-900">{stats.avgRating || '0.0'}</div>
                        <div className="flex items-center justify-center gap-1 mt-2 mb-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    size={20}
                                    className={s <= Math.round(stats.avgRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 font-medium">{stats.totalReviews || 0} total reviews</p>
                    </div>
                </div>
            </div>

            {/* Recent Tours + Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tours */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-slate-900">Recent Tours</h2>
                        <button
                            onClick={() => onNavigate('operator-tours')}
                            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                        >
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    {recentTours.length === 0 ? (
                        <div className="text-center py-8">
                            <Map size={32} className="text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-400 font-medium text-sm">No tours created yet</p>
                            <button
                                onClick={() => onNavigate('operator-tour-create')}
                                className="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                Create your first tour →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTours.map((tour: any) => (
                                <div key={tour._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <img
                                        src={tour.imageUrl}
                                        alt={tour.title}
                                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-slate-800 truncate">{tour.title}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {tour.type} · {tour.duration} · LKR {tour.price?.toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(tour.status || 'draft')}`}>
                                        {tour.status || 'draft'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
                        <button
                            onClick={() => onNavigate('operator-bookings')}
                            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                        >
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    {recentBookings.length === 0 ? (
                        <div className="text-center py-8">
                            <CalendarCheck size={32} className="text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-400 font-medium text-sm">No bookings yet</p>
                            <p className="text-xs text-slate-300 mt-1">Bookings will appear when tourists book your tours</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentBookings.map((booking: any) => (
                                <div key={booking._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-slate-600">
                                            {booking.contactInfo?.name?.charAt(0)?.toUpperCase() || '?'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-slate-800 truncate">{booking.contactInfo?.name || 'Guest'}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            LKR {booking.totalPrice?.toLocaleString()} · {new Date(booking.bookingDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OperatorDashboard;
