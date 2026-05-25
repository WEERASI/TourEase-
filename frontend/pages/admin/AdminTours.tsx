import React, { useState, useEffect } from 'react';
import { Search, Globe, Loader2, AlertCircle, CheckCircle2, XCircle, Eye, Clock, MapPin } from 'lucide-react';
import { getTours, updateTourStatus } from '../../services/adminApi';

interface AdminToursProps { onNavigate: (page: string) => void; }

const statusTabs = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'draft', label: 'Draft' },
];

const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-sky-50 text-sky-700',
    active: 'bg-emerald-50 text-emerald-700',
    inactive: 'bg-slate-100 text-slate-600',
    rejected: 'bg-red-50 text-red-700',
};

const AdminTours: React.FC<AdminToursProps> = ({ onNavigate }) => {
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [rejectModal, setRejectModal] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const fetchTours = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (filter) params.status = filter;
            if (search) params.search = search;
            const res = await getTours(params);
            setTours(res.data || []);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchTours(); }, [filter]);
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchTours(); };

    const handleStatus = async (id: string, status: string) => {
        setActionLoading(id);
        try { await updateTourStatus(id, status); await fetchTours(); }
        catch (err: any) { alert(err.message); }
        finally { setActionLoading(null); }
    };

    const handleReject = async (id: string) => {
        setActionLoading(id);
        try { await updateTourStatus(id, 'rejected', rejectReason); setRejectModal(null); setRejectReason(''); await fetchTours(); }
        catch (err: any) { alert(err.message); }
        finally { setActionLoading(null); }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Tour Management</h1>

            {/* Filters */}
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
                        <input type="text" placeholder="Search tours..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full" />
                    </form>
                </div>
            </div>

            {/* Tour List */}
            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-sky-500" /></div>
            ) : error ? (
                <div className="text-center py-20"><AlertCircle size={40} className="text-red-400 mx-auto mb-3" /><p className="text-slate-500">{error}</p></div>
            ) : tours.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-100"><Globe size={48} className="text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-slate-700">No tours found</h3></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {tours.map((tour) => (
                        <div key={tour._id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                            {tour.imageUrl && (
                                <div className="h-40 overflow-hidden">
                                    <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-sm font-bold text-slate-900 flex-1">{tour.title}</h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ml-2 ${statusColors[tour.status] || 'bg-slate-100 text-slate-600'}`}>
                                        {tour.status || 'draft'}
                                    </span>
                                </div>

                                <div className="space-y-1 mb-3 text-xs text-slate-500">
                                    <p><strong>Type:</strong> {tour.type} · <strong>Difficulty:</strong> {tour.difficulty}</p>
                                    <p><strong>Duration:</strong> {tour.duration} · <strong>Price:</strong> LKR {tour.price?.toLocaleString()}</p>
                                    {tour.operator && <p><strong>Operator:</strong> {tour.operator?.name || 'Unknown'}</p>}
                                </div>

                                {/* Action buttons based on status */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* Draft → Approve directly or send to Pending */}
                                    {(tour.status === 'draft' || !tour.status) && (
                                        <>
                                            <button onClick={() => handleStatus(tour._id, 'approved')} disabled={actionLoading === tour._id}
                                                className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                                                <CheckCircle2 size={14} className="inline mr-1" /> Approve
                                            </button>
                                            <button onClick={() => handleStatus(tour._id, 'active')} disabled={actionLoading === tour._id}
                                                className="flex-1 py-2 rounded-lg text-xs font-bold bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors">
                                                <Eye size={14} className="inline mr-1" /> Activate
                                            </button>
                                            <button onClick={() => setRejectModal(tour._id)} disabled={actionLoading === tour._id}
                                                className="flex-1 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                                                <XCircle size={14} className="inline mr-1" /> Reject
                                            </button>
                                        </>
                                    )}

                                    {/* Pending → Approve or Reject */}
                                    {tour.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleStatus(tour._id, 'approved')} disabled={actionLoading === tour._id}
                                                className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                                                <CheckCircle2 size={14} className="inline mr-1" /> Approve
                                            </button>
                                            <button onClick={() => setRejectModal(tour._id)} disabled={actionLoading === tour._id}
                                                className="flex-1 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                                                <XCircle size={14} className="inline mr-1" /> Reject
                                            </button>
                                        </>
                                    )}

                                    {/* Approved → Activate or Reject */}
                                    {tour.status === 'approved' && (
                                        <>
                                            <button onClick={() => handleStatus(tour._id, 'active')} disabled={actionLoading === tour._id}
                                                className="flex-1 py-2 rounded-lg text-xs font-bold bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors">
                                                <Eye size={14} className="inline mr-1" /> Activate
                                            </button>
                                            <button onClick={() => setRejectModal(tour._id)} disabled={actionLoading === tour._id}
                                                className="flex-1 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                                                <XCircle size={14} className="inline mr-1" /> Reject
                                            </button>
                                        </>
                                    )}

                                    {/* Active → Deactivate */}
                                    {tour.status === 'active' && (
                                        <button onClick={() => handleStatus(tour._id, 'inactive')} disabled={actionLoading === tour._id}
                                            className="flex-1 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                            <Clock size={14} className="inline mr-1" /> Deactivate
                                        </button>
                                    )}

                                    {/* Inactive → Re-activate */}
                                    {tour.status === 'inactive' && (
                                        <button onClick={() => handleStatus(tour._id, 'active')} disabled={actionLoading === tour._id}
                                            className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                                            <Eye size={14} className="inline mr-1" /> Activate
                                        </button>
                                    )}

                                    {/* Rejected → Re-approve */}
                                    {tour.status === 'rejected' && (
                                        <button onClick={() => handleStatus(tour._id, 'approved')} disabled={actionLoading === tour._id}
                                            className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                                            <CheckCircle2 size={14} className="inline mr-1" /> Re-approve
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Reject Tour</h3>
                        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection..." rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none resize-none mb-4" />
                        <div className="flex gap-3">
                            <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600">Cancel</button>
                            <button onClick={() => handleReject(rejectModal)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white">Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTours;
