import React, { useState, useEffect } from 'react';
import { Search, Hotel, Loader2, AlertCircle, CheckCircle2, XCircle, Star, MapPin } from 'lucide-react';
import { getHotels, approveHotel } from '../../services/adminApi';

interface AdminHotelsProps { onNavigate: (page: string) => void; }

const statusTabs = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
};

const AdminHotels: React.FC<AdminHotelsProps> = ({ onNavigate }) => {
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [rejectModal, setRejectModal] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (filter) params.approvalStatus = filter;
            if (search) params.search = search;
            const res = await getHotels(params);
            setHotels(res.data || []);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchHotels(); }, [filter]);
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchHotels(); };

    const handleApprove = async (id: string) => {
        setActionLoading(id);
        try { await approveHotel(id, 'approve'); await fetchHotels(); }
        catch (err: any) { alert(err.message); }
        finally { setActionLoading(null); }
    };

    const handleReject = async (id: string) => {
        setActionLoading(id);
        try { await approveHotel(id, 'reject', rejectReason); setRejectModal(null); setRejectReason(''); await fetchHotels(); }
        catch (err: any) { alert(err.message); }
        finally { setActionLoading(null); }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Hotel Management</h1>

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
                        <input type="text" placeholder="Search hotels..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full" />
                    </form>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-sky-500" /></div>
            ) : error ? (
                <div className="text-center py-20"><AlertCircle size={40} className="text-red-400 mx-auto mb-3" /><p className="text-slate-500">{error}</p></div>
            ) : hotels.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-100"><Hotel size={48} className="text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-slate-700">No hotels found</h3></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {hotels.map((hotel) => (
                        <div key={hotel._id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                            {hotel.imageUrl && (
                                <div className="h-40 overflow-hidden">
                                    <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-sm font-bold text-slate-900 flex-1">{hotel.name}</h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ml-2 ${statusColors[hotel.approvalStatus] || 'bg-slate-100 text-slate-600'}`}>
                                        {hotel.approvalStatus || 'pending'}
                                    </span>
                                </div>
                                <div className="space-y-1 mb-3 text-xs text-slate-500">
                                    <p className="flex items-center gap-1"><MapPin size={12} /> {hotel.city}, {hotel.location}</p>
                                    <p className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /> {hotel.stars} stars · {hotel.type}</p>
                                    <p><strong>Price:</strong> LKR {hotel.price?.toLocaleString()} · <strong>Rooms:</strong> {hotel.rooms?.length || 0} types</p>
                                    {hotel.partner && <p><strong>Partner:</strong> {hotel.partner?.name || 'Unknown'}</p>}
                                </div>
                                {hotel.rejectionReason && hotel.approvalStatus === 'rejected' && (
                                    <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg mb-3">Reason: {hotel.rejectionReason}</p>
                                )}
                                {hotel.approvalStatus === 'pending' && (
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleApprove(hotel._id)} disabled={actionLoading === hotel._id}
                                            className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                                            <CheckCircle2 size={14} className="inline mr-1" /> Approve
                                        </button>
                                        <button onClick={() => setRejectModal(hotel._id)} disabled={actionLoading === hotel._id}
                                            className="flex-1 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100">
                                            <XCircle size={14} className="inline mr-1" /> Reject
                                        </button>
                                    </div>
                                )}
                                {hotel.approvalStatus === 'rejected' && (
                                    <button onClick={() => handleApprove(hotel._id)} disabled={actionLoading === hotel._id}
                                        className="w-full py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                                        Re-approve
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {rejectModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Reject Hotel</h3>
                        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason for rejection..." rows={3}
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

export default AdminHotels;
