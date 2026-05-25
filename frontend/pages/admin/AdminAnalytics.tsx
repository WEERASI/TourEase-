import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, TrendingUp, Users, BookOpen, DollarSign, Star, MapPin } from 'lucide-react';
import { getAnalytics } from '../../services/adminApi';

interface AdminAnalyticsProps { onNavigate: (page: string) => void; }

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await getAnalytics();
                setData(res.data);
            } catch (err: any) { setError(err.message); }
            finally { setLoading(false); }
        })();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><Loader2 size={32} className="animate-spin text-sky-500" /></div>;
    if (error) return <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-3"><AlertCircle size={40} className="text-red-400" /><p className="text-slate-500">{error}</p></div>;

    const monthlyRevenue = data?.monthlyRevenue || {};
    const monthlyUsers = data?.monthlyUsers || {};
    const monthlyBookings = data?.monthlyBookings || {};
    const bookingStatusDist = data?.bookingStatusDist || {};
    const bookingTypeDist = data?.bookingTypeDist || {};
    const topTours = data?.topTours || [];
    const topDestinations = data?.topDestinations || [];

    const revenueEntries = Object.entries(monthlyRevenue);
    const maxRevenue = Math.max(...revenueEntries.map(([, v]: any) => v), 1);
    const totalRevenue = revenueEntries.reduce((s, [, v]: any) => s + v, 0);
    const totalUsers = Object.values(monthlyUsers).reduce((s: any, v: any) => s + v, 0);
    const totalBookings = Object.values(monthlyBookings).reduce((s: any, v: any) => s + v, 0);

    const statusColors: Record<string, string> = { pending: 'bg-amber-400', confirmed: 'bg-sky-400', completed: 'bg-emerald-400', cancelled: 'bg-red-400' };
    const totalStatusBookings = Object.values(bookingStatusDist).reduce((s: any, v: any) => s + v, 0) || 1;

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Analytics</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { icon: <DollarSign size={22} />, title: 'Total Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, color: 'bg-emerald-50 text-emerald-600' },
                    { icon: <Users size={22} />, title: 'New Users (12m)', value: totalUsers, color: 'bg-sky-50 text-sky-600' },
                    { icon: <BookOpen size={22} />, title: 'Bookings (12m)', value: totalBookings, color: 'bg-purple-50 text-purple-600' },
                    { icon: <TrendingUp size={22} />, title: 'Avg Monthly Rev', value: `LKR ${Math.round(totalRevenue / Math.max(revenueEntries.length, 1)).toLocaleString()}`, color: 'bg-orange-50 text-orange-600' },
                ].map((m) => (
                    <div key={m.title} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${m.color}`}>{m.icon}</div>
                        <p className="text-2xl font-bold text-slate-900">{m.value}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{m.title}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Monthly Revenue</h3>
                <div className="flex items-end gap-2 h-48">
                    {revenueEntries.map(([month, value]: any) => {
                        const label = month.split('-')[1];
                        return (
                            <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] text-slate-500 font-semibold">{(value / 1000).toFixed(0)}K</span>
                                <div className="w-full bg-gradient-to-t from-sky-500 to-sky-400 rounded-t-lg transition-all hover:from-sky-600 hover:to-sky-500"
                                    style={{ height: `${(value / maxRevenue) * 100}%`, minHeight: '4px' }} />
                                <span className="text-[10px] text-slate-400">{label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Booking Status Distribution */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Status</h3>
                    <div className="h-4 rounded-full overflow-hidden flex mb-4">
                        {Object.entries(bookingStatusDist).map(([status, count]: any) => (
                            <div key={status} className={`${statusColors[status] || 'bg-slate-300'}`} style={{ width: `${(Number(count) / Number(totalStatusBookings)) * 100}%` }} />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(bookingStatusDist).map(([status, count]: any) => (
                            <div key={status} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${statusColors[status] || 'bg-slate-300'}`} />
                                <span className="text-sm text-slate-600 capitalize">{status}</span>
                                <span className="text-sm font-bold text-slate-900 ml-auto">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Booking Type Distribution */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Types</h3>
                    <div className="space-y-4">
                        {Object.entries(bookingTypeDist).map(([type, count]: any) => {
                            const total = Object.values(bookingTypeDist).reduce((s: number, v: any) => s + Number(v), 0) || 1;
                            const pct = Math.round((Number(count) / Number(total)) * 100);
                            return (
                                <div key={type}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-600 capitalize">{type}</span>
                                        <span className="text-sm font-bold text-slate-900">{count} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-sky-400 rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Top Tours */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Top Tours by Bookings</h3>
                    <div className="space-y-3">
                        {topTours.map((tour: any, idx: number) => (
                            <div key={tour.id || idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                                <span className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{tour.title}</p>
                                    <p className="text-xs text-slate-400">{tour.bookings} bookings · LKR {tour.revenue?.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                        {topTours.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No data available</p>}
                    </div>
                </div>

                {/* Top Destinations */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Top Destinations</h3>
                    <div className="space-y-3">
                        {topDestinations.map((dest: any, idx: number) => (
                            <div key={dest._id || idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                                <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{dest.name}</p>
                                    <p className="text-xs text-slate-400">{dest.reviews || 0} reviews</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-bold text-slate-700">{dest.rating?.toFixed(1)}</span>
                                </div>
                            </div>
                        ))}
                        {topDestinations.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No data available</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
