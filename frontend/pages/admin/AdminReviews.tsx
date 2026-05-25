import React, { useState, useEffect } from 'react';
import { Search, Star, Loader2, AlertCircle, Trash2, MessageSquare, Filter } from 'lucide-react';
import { getReviews, deleteReview } from '../../services/adminApi';

interface AdminReviewsProps { onNavigate: (page: string) => void; }

const typeFilters = [
    { value: '', label: 'All Types' },
    { value: 'tour', label: 'Tours' },
    { value: 'hotel', label: 'Hotels' },
    { value: 'destination', label: 'Destinations' },
    { value: 'transport', label: 'Transport' },
];

const ratingFilters = [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' },
];

const AdminReviews: React.FC<AdminReviewsProps> = ({ onNavigate }) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (typeFilter) params.targetType = typeFilter;
            if (ratingFilter) params.rating = ratingFilter;
            const res = await getReviews(params);
            setReviews(res.data || []);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchReviews(); }, [typeFilter, ratingFilter]);

    const handleDelete = async (id: string) => {
        setActionLoading(id);
        try { await deleteReview(id); setDeleteConfirm(null); await fetchReviews(); }
        catch (err: any) { alert(err.message); }
        finally { setActionLoading(null); }
    };

    // Stats
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews : 0;
    const ratingDist = [1, 2, 3, 4, 5].map((r) => reviews.filter((rv) => rv.rating === r).length);

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Review Moderation</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center"><Star size={24} className="text-amber-500 fill-amber-500" /></div>
                    <div><p className="text-2xl font-bold text-slate-900">{avgRating.toFixed(1)}</p><p className="text-xs text-slate-500">Average Rating</p></div>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center"><MessageSquare size={24} className="text-sky-500" /></div>
                    <div><p className="text-2xl font-bold text-slate-900">{totalReviews}</p><p className="text-xs text-slate-500">Total Reviews</p></div>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-600 mb-2">Rating Distribution</p>
                    <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map((r) => (
                            <div key={r} className="flex items-center gap-2">
                                <span className="text-[10px] w-3 text-slate-500">{r}</span>
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 rounded-full" style={{ width: totalReviews > 0 ? `${(ratingDist[r - 1] / totalReviews) * 100}%` : '0%' }} />
                                </div>
                                <span className="text-[10px] w-5 text-right text-slate-400">{ratingDist[r - 1]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 outline-none border-none">
                    {typeFilters.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
                </select>
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 outline-none border-none">
                    {ratingFilters.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
                </select>
            </div>

            {/* Review List */}
            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-sky-500" /></div>
            ) : error ? (
                <div className="text-center py-20"><AlertCircle size={40} className="text-red-400 mx-auto mb-3" /><p className="text-slate-500">{error}</p></div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-100"><Star size={48} className="text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-slate-700">No reviews found</h3></div>
            ) : (
                <div className="space-y-3">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sm font-bold text-sky-600 shrink-0">
                                        {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-bold text-slate-900">{review.user?.name || 'Unknown'}</p>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 uppercase">{review.targetType}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={12} className={s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                                            ))}
                                            <span className="text-xs text-slate-400 ml-1">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-600">{review.comment}</p>
                                        {review.operatorReply && (
                                            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Operator Reply</p>
                                                <p className="text-sm text-slate-600">{review.operatorReply.text}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    {deleteConfirm === review._id ? (
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleDelete(review._id)} disabled={actionLoading === review._id}
                                                className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-lg">Delete</button>
                                            <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg">Cancel</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setDeleteConfirm(review._id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
