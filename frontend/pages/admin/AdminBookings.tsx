import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Loader2, AlertCircle, Calendar, DollarSign, Users } from 'lucide-react';
import { getBookings, updateBookingStatus } from '../../services/adminApi';

interface AdminBookingsProps { onNavigate: (page: string) => void; }

const statusTabs = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-sky-50 text-sky-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-700',
};

const typeBadge: Record<string, string> = {
    tour: 'bg-purple-50 text-purple-700',
    hotel: 'bg-orange-50 text-orange-700',
    transport: 'bg-sky-50 text-sky-700',
};

const AdminBookings: React.FC<AdminBookingsProps> = ({ onNavigate }) => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (filter) params.status = filter;
            if (search) params.search = search;
            const res = await getBookings(params);
            setBookings(res.data || []);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBookings(); }, [filter]);
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchBookings(); };

    const handleStatusChange = async (id: string, status: string) => {
        setActionLoading(id);
        try { await updateBookingStatus(id, status); await fetchBookings(); }
        catch (err: any) { alert(err.message); }
        finally { setActionLoading(null); }
    };

    // Stats
    const totalRevenue = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').reduce((sum, b) => sum + b.totalPrice, 0);

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Booking Management</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Bookings', value: bookings.length, color: 'text-sky-600' },
                    { label: 'Pending', value: bookings.filter((b) => b.status === 'pending').length, color: 'text-amber-600' },
                    { label: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length, color: 'text-emerald-600' },
                    { label: 'Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, color: 'text-purple-600' },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        {statusTabs.map((tab) => (
                            <button key={tab.value} onClick={() => setFilter(tab.value)}
                                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${filter === tab.value ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full" />
                    </form>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-sky-500" /></div>
            ) : error ? (
                <div className="text-center py-20"><AlertCircle size={40} className="text-red-400 mx-auto mb-3" /><p className="text-slate-500">{error}</p></div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-100"><BookOpen size={48} className="text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-slate-700">No bookings found</h3></div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tourist</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Guests</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bookings.map((b) => (
                                    <tr key={b._id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-slate-800">{b.user?.name || b.contactInfo?.name || 'Unknown'}</p>
                                            <p className="text-xs text-slate-400">{b.user?.email || b.contactInfo?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${typeBadge[b.bookingType] || 'bg-slate-100 text-slate-600'}`}>
                                                {b.bookingType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(b.bookingDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{b.guests?.adults || 0} A, {b.guests?.children || 0} C</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">LKR {b.totalPrice?.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusColors[b.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)}
                                                disabled={actionLoading === b._id}
                                                className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none">
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
