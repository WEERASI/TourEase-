import React, { useState, useEffect } from 'react';
import {
    Search, Filter, CalendarCheck, Loader2, AlertCircle,
    CheckCircle2, XCircle, Clock, Mail, Download, ChevronDown,
    User, MapPin, Users, DollarSign, MessageSquare,
} from 'lucide-react';
import { getOperatorBookings, updateBookingStatus } from '../../services/operatorApi';

interface OperatorBookingsProps {
    onNavigate: (page: string) => void;
}

const statusTabs = [
    { value: '', label: 'All', icon: CalendarCheck },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { value: 'completed', label: 'Completed', icon: CheckCircle2 },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle },
];

const OperatorBookings: React.FC<OperatorBookingsProps> = ({ onNavigate }) => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (statusFilter) params.status = statusFilter;
            if (search) params.search = search;
            const res = await getOperatorBookings(params);
            setBookings(res.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, [statusFilter]);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchBookings(); };

    const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
        setActionLoading(bookingId);
        try {
            await updateBookingStatus(bookingId, newStatus);
            await fetchBookings();
            if (selectedBooking?._id === bookingId) {
                setSelectedBooking(null);
            }
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
            confirmed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
            completed: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
            cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-200',
        };
        return colors[status] || 'bg-slate-100 text-slate-600';
    };

    const handleExportCSV = () => {
        const headers = ['Booking ID', 'Tourist Name', 'Email', 'Phone', 'Tour', 'Date', 'Guests', 'Amount', 'Status'];
        const rows = bookings.map((b) => [
            b._id,
            b.contactInfo?.name || '',
            b.contactInfo?.email || '',
            b.contactInfo?.phone || '',
            b.tourName || '',
            new Date(b.bookingDate).toLocaleDateString(),
            `${b.guests?.adults || 0} adults, ${b.guests?.children || 0} children`,
            b.totalPrice,
            b.status,
        ]);
        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Stats
    const totalBookings = bookings.length;
    const pendingCount = bookings.filter((b) => b.status === 'pending').length;
    const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
    const totalRevenue = bookings.filter((b) => b.status !== 'cancelled').reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return (
        <div className="p-4 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Bookings</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage all bookings for your tours</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Bookings', value: totalBookings, color: 'text-slate-900' },
                    { label: 'Pending', value: pendingCount, color: 'text-amber-600' },
                    { label: 'Confirmed', value: confirmedCount, color: 'text-emerald-600' },
                    { label: 'Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, color: 'text-sky-600' },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200/60 p-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase">{s.label}</p>
                        <p className={`text-2xl font-black ${s.color} mt-1`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {statusTabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => setStatusFilter(tab.value)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === tab.value
                                            ? 'bg-emerald-500 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    <Icon size={14} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2.5">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by tourist name or booking ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
                        />
                    </form>
                </div>
            </div>

            {/* Booking List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-emerald-500" />
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
                    <p className="text-slate-500">{error}</p>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60">
                    <CalendarCheck size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No bookings found</h3>
                    <p className="text-slate-400 text-sm">
                        {statusFilter || search ? 'Try adjusting your filters' : 'Bookings will appear when tourists book your tours'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tourist</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tour</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Guests</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-bold text-slate-600">
                                                        {booking.contactInfo?.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{booking.contactInfo?.name || 'Guest'}</p>
                                                    <p className="text-xs text-slate-400">{booking.contactInfo?.email || ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">{booking.tourName || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{(booking.guests?.adults || 0) + (booking.guests?.children || 0)}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">LKR {booking.totalPrice?.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                        disabled={actionLoading === booking._id}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                                    >
                                                        {actionLoading === booking._id ? '...' : 'Confirm'}
                                                    </button>
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                                        disabled={actionLoading === booking._id}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                                                    >
                                                        {actionLoading === booking._id ? '...' : 'Complete'}
                                                    </button>
                                                )}
                                                {['pending', 'confirmed'].includes(booking.status) && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                        disabled={actionLoading === booking._id}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                {booking.contactInfo?.email && (
                                                    <a
                                                        href={`mailto:${booking.contactInfo.email}`}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                                        title="Email tourist"
                                                    >
                                                        <Mail size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden divide-y divide-slate-100">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-slate-600">
                                                {booking.contactInfo?.name?.charAt(0)?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{booking.contactInfo?.name || 'Guest'}</p>
                                            <p className="text-xs text-slate-400">{booking.tourName || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                                    <span className="font-bold text-slate-800">LKR {booking.totalPrice?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {booking.status === 'pending' && (
                                        <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600">
                                            Confirm
                                        </button>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <button onClick={() => handleStatusUpdate(booking._id, 'completed')} className="flex-1 py-2 rounded-lg text-xs font-bold bg-sky-50 text-sky-600">
                                            Complete
                                        </button>
                                    )}
                                    {['pending', 'confirmed'].includes(booking.status) && (
                                        <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="flex-1 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-600">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OperatorBookings;
