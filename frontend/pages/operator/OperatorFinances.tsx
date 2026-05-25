import React, { useState, useEffect } from 'react';
import {
    DollarSign, TrendingUp, ArrowDown, ArrowUp, Download,
    Loader2, AlertCircle, Calendar,
} from 'lucide-react';
import { getRevenueData } from '../../services/operatorApi';

interface OperatorFinancesProps {
    onNavigate: (page: string) => void;
}

const OperatorFinances: React.FC<OperatorFinancesProps> = ({ onNavigate }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getRevenueData();
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

    const monthlyRevenue = data?.monthlyRevenue || {};
    const revenueByTour = data?.revenueByTour || [];
    const paymentHistory = data?.paymentHistory || [];
    const months = Object.keys(monthlyRevenue);
    const maxMonthly = Math.max(...Object.values(monthlyRevenue as Record<string, number>), 1);

    const handleExportCSV = () => {
        const headers = ['Date', 'Tour', 'Amount', 'Status'];
        const rows = paymentHistory.map((p: any) => [
            new Date(p.date).toLocaleDateString(),
            p.tourName,
            p.amount,
            p.status,
        ]);
        const csv = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financials-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="p-4 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Financial Overview</h1>
                <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    <Download size={16} /> Export Report
                </button>
            </div>

            {/* Revenue Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 lg:p-8 text-white">
                <p className="text-emerald-100 font-semibold text-sm uppercase tracking-wider">Total Revenue</p>
                <p className="text-4xl lg:text-5xl font-black mt-2">LKR {(data?.totalRevenue || 0).toLocaleString()}</p>
                <p className="text-emerald-200 text-sm mt-2">From confirmed and completed bookings</p>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Monthly Revenue (Last 12 Months)</h2>
                <div className="flex items-end gap-2 h-48">
                    {months.map((month) => {
                        const val = (monthlyRevenue as any)[month] || 0;
                        const height = (val / maxMonthly) * 100;
                        return (
                            <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-slate-500">{val > 0 ? `${Math.round(val / 1000)}K` : ''}</span>
                                <div
                                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500 min-h-[4px]"
                                    style={{ height: `${Math.max(height, 2)}%` }}
                                />
                                <span className="text-[9px] font-semibold text-slate-400 -rotate-45 origin-center">{month.split('-')[1]}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Revenue by Tour */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Revenue by Tour</h2>
                {revenueByTour.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">No revenue data yet</p>
                ) : (
                    <div className="space-y-3">
                        {revenueByTour.map((tour: any, idx: number) => {
                            const maxRev = Math.max(...revenueByTour.map((t: any) => t.revenue), 1);
                            return (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-slate-700 w-40 truncate">{tour.name}</span>
                                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-full" style={{ width: `${(tour.revenue / maxRev) * 100}%` }} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-800 w-28 text-right">LKR {tour.revenue.toLocaleString()}</span>
                                    <span className="text-xs text-slate-400 w-16 text-right">{tour.bookings} bookings</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Payment History</h2>
                {paymentHistory.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">No payments yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tour</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paymentHistory.map((payment: any) => (
                                    <tr key={payment.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-600">{new Date(payment.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-sm text-slate-700 font-medium">{payment.tourName}</td>
                                        <td className="px-4 py-3 text-sm font-bold text-slate-800">LKR {payment.amount.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${payment.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'
                                                }`}>{payment.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OperatorFinances;
