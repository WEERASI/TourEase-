import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, Map, Eye, Edit3, Trash2, Play,
    Pause, Send, Loader2, AlertCircle, ChevronDown, X,
    Star, Users, Calendar,
} from 'lucide-react';
import { getOperatorTours, deleteTour, updateTourStatus } from '../../services/operatorApi';

interface OperatorToursProps {
    onNavigate: (page: string) => void;
    onEditTour?: (tourId: string) => void;
}

const statusFilters = ['all', 'draft', 'pending', 'approved', 'rejected', 'active', 'inactive'];
const typeFilters = ['All Types', 'Cultural', 'Wildlife', 'Beach', 'Adventure', 'Hill Country', 'Tea Plantation'];

const OperatorTours: React.FC<OperatorToursProps> = ({ onNavigate, onEditTour }) => {
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (search) params.search = search;
            if (statusFilter !== 'all') params.status = statusFilter;
            if (typeFilter !== 'All Types') params.type = typeFilter;
            const res = await getOperatorTours(params);
            setTours(res.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load tours');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTours(); }, [statusFilter, typeFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTours();
    };

    const handleStatusChange = async (tourId: string, newStatus: string) => {
        setActionLoading(tourId);
        try {
            await updateTourStatus(tourId, newStatus);
            await fetchTours();
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (tourId: string) => {
        setActionLoading(tourId);
        try {
            await deleteTour(tourId);
            setShowDeleteConfirm(null);
            await fetchTours();
        } catch (err: any) {
            alert(err.message || 'Failed to delete tour');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: 'bg-slate-100 text-slate-600 ring-slate-200',
            pending: 'bg-amber-50 text-amber-700 ring-amber-200',
            approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
            rejected: 'bg-red-50 text-red-700 ring-red-200',
            active: 'bg-sky-50 text-sky-700 ring-sky-200',
            inactive: 'bg-slate-50 text-slate-500 ring-slate-200',
        };
        return colors[status] || 'bg-slate-100 text-slate-600';
    };

    const getActions = (tour: any) => {
        const actions: { label: string; icon: any; onClick: () => void; color: string }[] = [];
        const status = tour.status || 'draft';

        // View is always available
        actions.push({ label: 'View', icon: Eye, onClick: () => { }, color: 'text-slate-600 hover:bg-slate-50' });

        // Edit: only draft or rejected
        if (['draft', 'rejected'].includes(status)) {
            actions.push({ label: 'Edit', icon: Edit3, onClick: () => onEditTour?.(tour._id), color: 'text-sky-600 hover:bg-sky-50' });
        }

        // Submit for approval: draft only
        if (status === 'draft') {
            actions.push({ label: 'Submit', icon: Send, onClick: () => handleStatusChange(tour._id, 'pending'), color: 'text-emerald-600 hover:bg-emerald-50' });
        }

        // Revise rejected tours back to draft
        if (status === 'rejected') {
            actions.push({ label: 'Revise', icon: Edit3, onClick: () => handleStatusChange(tour._id, 'draft'), color: 'text-amber-600 hover:bg-amber-50' });
        }

        // Activate/Deactivate approved tours
        if (status === 'approved' || status === 'inactive') {
            actions.push({ label: 'Activate', icon: Play, onClick: () => handleStatusChange(tour._id, 'active'), color: 'text-emerald-600 hover:bg-emerald-50' });
        }
        if (status === 'active') {
            actions.push({ label: 'Deactivate', icon: Pause, onClick: () => handleStatusChange(tour._id, 'inactive'), color: 'text-amber-600 hover:bg-amber-50' });
        }

        // Delete: only draft
        if (status === 'draft') {
            actions.push({ label: 'Delete', icon: Trash2, onClick: () => setShowDeleteConfirm(tour._id), color: 'text-red-600 hover:bg-red-50' });
        }

        return actions;
    };

    return (
        <div className="p-4 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-black text-slate-900">My Tours</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage and monitor all your tour packages</p>
                </div>
                <button
                    onClick={() => onNavigate('operator-tour-create')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    <Plus size={18} />
                    Create New Tour
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2.5">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tours by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
                        />
                    </form>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {statusFilters.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === s
                                        ? 'bg-emerald-500 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2.5 bg-slate-100 rounded-xl text-sm text-slate-700 outline-none border-0 cursor-pointer"
                    >
                        {typeFilters.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* Tour List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-emerald-500" />
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
                    <p className="text-slate-500">{error}</p>
                </div>
            ) : tours.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60">
                    <Map size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No tours found</h3>
                    <p className="text-slate-400 text-sm mb-4">
                        {statusFilter !== 'all' || search ? 'Try adjusting your filters' : 'Create your first tour to get started'}
                    </p>
                    {!search && statusFilter === 'all' && (
                        <button
                            onClick={() => onNavigate('operator-tour-create')}
                            className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold text-sm"
                        >
                            Create Your First Tour
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {tours.map((tour) => (
                        <div key={tour._id} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                            {/* Image */}
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={tour.imageUrl}
                                    alt={tour.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ${getStatusColor(tour.status || 'draft')}`}>
                                        {tour.status || 'draft'}
                                    </span>
                                </div>
                                {tour.badge && (
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white">
                                            {tour.badge}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{tour.title}</h3>
                                <p className="text-xs text-slate-400 font-medium mb-3">{tour.type} · {tour.difficulty} · {tour.duration}</p>

                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Star size={14} className="text-amber-400 fill-amber-400" />
                                        {tour.reviewStats?.avgRating?.toFixed(1) || '0.0'} ({tour.reviewStats?.count || 0})
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users size={14} />
                                        {tour.bookingCount || 0} bookings
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-lg font-black text-emerald-600">LKR {tour.price?.toLocaleString()}</span>
                                    <div className="flex items-center gap-1">
                                        {getActions(tour).map((action, idx) => {
                                            const Icon = action.icon;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={action.onClick}
                                                    disabled={actionLoading === tour._id}
                                                    title={action.label}
                                                    className={`p-2 rounded-lg transition-colors ${action.color} ${actionLoading === tour._id ? 'opacity-50' : ''}`}
                                                >
                                                    {actionLoading === tour._id ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Tour?</h3>
                        <p className="text-sm text-slate-500 mb-6">This action cannot be undone. The tour will be permanently removed.</p>
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                disabled={actionLoading !== null}
                                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25"
                            >
                                {actionLoading ? 'Deleting...' : 'Delete Tour'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OperatorTours;
