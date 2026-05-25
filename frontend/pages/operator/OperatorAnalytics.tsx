import React, { useState, useEffect } from 'react';
import {
    BarChart3, TrendingUp, Users, Eye, Target,
    Loader2, AlertCircle, Calendar, ArrowUp,
} from 'lucide-react';
import { getAnalytics } from '../../services/operatorApi';

interface OperatorAnalyticsProps {
    onNavigate: (page: string) => void;
}

const OperatorAnalytics: React.FC<OperatorAnalyticsProps> = ({ onNavigate }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getAnalytics();
                setData(res.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><Loader2 size={32} className="animate-spin text-emerald-500" /></div>;
    if (error) return <div className="flex items-center justify-center h-full min-h-[60vh]"><AlertCircle size={32} className="text-red-400" /><p className="ml-3 text-slate-500">{error}</p></div>;

    const bookingsOverTime = data?.bookingsOverTime || {};
    const popularTours = data?.popularTours || [];
    const months = Object.keys(bookingsOverTime);
    const maxBookings = Math.max(...Object.values(bookingsOverTime as Record<string, number>), 1);

    const metricCards = [
        { label: 'Total Bookings', value: data?.totalBookings || 0, icon: Users, color: 'bg-sky-50 text-sky-600' },
        { label: 'Completed', value: data?.completedBookings || 0, icon: Target, color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Cancellation Rate', value: `${data?.cancellationRate || 0}%`, icon: TrendingUp, color: 'bg-red-50 text-red-600' },
        { label: 'Avg Group Size', value: data?.avgGroupSize || 0, icon: Users, color: 'bg-violet-50 text-violet-600' },
        { label: 'Total Tours', value: data?.totalTours || 0, icon: BarChart3, color: 'bg-amber-50 text-amber-600' },
        { label: 'Active Tours', value: data?.activeTours || 0, icon: Eye, color: 'bg-emerald-50 text-emerald-600' },
    ];

    return (
        <div className="p-4 lg:p-8 space-y-6">
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Analytics & Insights</h1>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {metricCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="bg-white rounded-2xl border border-slate-200/60 p-4 hover:shadow-md transition-shadow">
                            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                                <Icon size={20} />
                            </div>
                            <p className="text-2xl font-black text-slate-900">{card.value}</p>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Bookings Over Time Chart */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Bookings Over Time (Last 12 Months)</h2>
                <div className="flex items-end gap-2 h-48">
                    {months.map((month) => {
                        const val = (bookingsOverTime as any)[month] || 0;
                        const height = (val / maxBookings) * 100;
                        return (
                            <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-slate-500">{val > 0 ? val : ''}</span>
                                <div
                                    className="w-full bg-gradient-to-t from-sky-500 to-sky-400 rounded-t-lg transition-all duration-500 hover:from-sky-600 hover:to-sky-500 min-h-[4px]"
                                    style={{ height: `${Math.max(height, 2)}%` }}
                                />
                                <span className="text-[9px] font-semibold text-slate-400 -rotate-45 origin-center">{month.split('-')[1]}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Popular Tours */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Most Popular Tours</h2>
                {popularTours.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">No booking data yet</p>
                ) : (
                    <div className="space-y-3">
                        {popularTours.map((tour: any, idx: number) => {
                            const maxB = Math.max(...popularTours.map((t: any) => t.bookings), 1);
                            return (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="text-lg font-black text-slate-300 w-8">#{idx + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{tour.title}</p>
                                        <div className="mt-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                                                style={{ width: `${(tour.bookings / maxB) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-bold text-slate-800">{tour.bookings} bookings</p>
                                        <p className="text-xs text-slate-400">★ {tour.rating?.toFixed(1) || '0.0'} · LKR {tour.price?.toLocaleString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Insights Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">Booking Performance</h3>
                    <p className="text-3xl font-black">{data?.totalBookings || 0}</p>
                    <p className="text-sky-200 text-sm mt-1">total bookings all time</p>
                    <p className="text-sky-100 text-sm mt-4">
                        {data?.cancellationRate || 0}% cancellation rate · Avg group size: {data?.avgGroupSize || 0}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">Tour Portfolio</h3>
                    <p className="text-3xl font-black">{data?.totalTours || 0} Tours</p>
                    <p className="text-violet-200 text-sm mt-1">{data?.activeTours || 0} currently active</p>
                    <p className="text-violet-100 text-sm mt-4">
                        {popularTours.length > 0 ? `Top tour: ${popularTours[0].title}` : 'Create tours to see analytics'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OperatorAnalytics;
