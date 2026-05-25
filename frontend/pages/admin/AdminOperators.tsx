import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Loader2, AlertCircle, CheckCircle2, XCircle, Clock, Shield, Mail, Globe } from 'lucide-react';
import { getOperators, approveOperator } from '../../services/adminApi';

interface AdminOperatorsProps { onNavigate: (page: string) => void; }

const statusTabs = [
    { value: '', label: 'All' },
    { value: 'not_verified', label: 'Not Verified' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
];

const statusColors: Record<string, string> = {
    not_verified: 'bg-slate-100 text-slate-600',
    pending: 'bg-amber-50 text-amber-700',
    verified: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
};

const AdminOperators: React.FC<AdminOperatorsProps> = ({ onNavigate }) => {
    const [operators, setOperators] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [rejectModal, setRejectModal] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const fetchOperators = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (filter) params.verificationStatus = filter;
            if (search) params.search = search;
            const res = await getOperators(params);
            setOperators(res.data || []);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOperators(); }, [filter]);
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchOperators(); };

    const handleApprove = async (id: string) => {
        setActionLoading(id);
        try { await approveOperator(id, 'approve'); await fetchOperators(); }
        catch (err: any) { alert(err.message); }
        finally { setActionLoading(null); }
    };

    const handleReject = async (id: string) => {
        setActionLoading(id);
        try { await approveOperator(id, 'reject', rejectReason); setRejectModal(null); setRejectReason(''); await fetchOperators(); }
        catch (err: any) { alert(err.message); }
        finally { setActionLoading(null); }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Tour Operators</h1>

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
                        <input type="text" placeholder="Search operators..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full" />
                    </form>
                </div>
            </div>

            {/* Operator Cards */}
            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-sky-500" /></div>
            ) : error ? (
                <div className="text-center py-20"><AlertCircle size={40} className="text-red-400 mx-auto mb-3" /><p className="text-slate-500">{error}</p></div>
            ) : operators.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-100"><Briefcase size={48} className="text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-slate-700">No operators found</h3></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {operators.map((op) => (
                        <div key={op._id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-lg font-bold">
                                        {op.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{op.name}</p>
                                        <p className="text-xs text-slate-400">{op.email}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[op.verificationStatus] || 'bg-slate-100 text-slate-600'}`}>
                                    {(op.verificationStatus || 'not_verified').replace('_', ' ')}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4 text-sm text-slate-600">
                                {op.companyName && <p className="flex items-center gap-2"><Briefcase size={14} className="text-slate-400" /> {op.companyName}</p>}
                                {op.phone && <p className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {op.phone}</p>}
                                <p className="flex items-center gap-2"><Globe size={14} className="text-slate-400" /> {op.tourCount || 0} tours created</p>
                                <p className="text-xs text-slate-400">Joined {new Date(op.createdAt).toLocaleDateString()}</p>
                            </div>

                            {(op.verificationStatus === 'pending' || op.verificationStatus === 'not_verified') && (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleApprove(op._id)} disabled={actionLoading === op._id}
                                        className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                                        <CheckCircle2 size={14} className="inline mr-1" /> Approve
                                    </button>
                                    <button onClick={() => setRejectModal(op._id)} disabled={actionLoading === op._id}
                                        className="flex-1 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100">
                                        <XCircle size={14} className="inline mr-1" /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Reject Operator</h3>
                        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection (optional)..." rows={3}
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

export default AdminOperators;
