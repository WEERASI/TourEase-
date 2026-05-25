import React, { useState, useEffect } from 'react';
import {
    Star, MessageSquare, Loader2, AlertCircle, Filter, Send, Edit3, X,
} from 'lucide-react';
import { getOperatorReviews, replyToReview } from '../../services/operatorApi';

interface OperatorReviewsProps {
    onNavigate: (page: string) => void;
}

const OperatorReviews: React.FC<OperatorReviewsProps> = ({ onNavigate }) => {
    const [reviewData, setReviewData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [replyLoading, setReplyLoading] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (ratingFilter) params.rating = ratingFilter;
            const res = await getOperatorReviews(params);
            setReviewData(res.data);
        } catch (err: any) {
            setError(err.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, [ratingFilter]);

    const handleReply = async (reviewId: string) => {
        if (!replyText.trim()) return;
        setReplyLoading(true);
        try {
            await replyToReview(reviewId, replyText);
            setReplyingTo(null);
            setReplyText('');
            await fetchReviews();
        } catch (err: any) {
            alert(err.message || 'Failed to post reply');
        } finally {
            setReplyLoading(false);
        }
    };

    const stats = reviewData?.stats || { total: 0, avgRating: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    const reviews = reviewData?.reviews || [];
    const maxDist = Math.max(...Object.values(stats.ratingDistribution as Record<string, number>), 1);

    if (loading) {
        return <div className="flex items-center justify-center h-full min-h-[60vh]"><Loader2 size={32} className="animate-spin text-emerald-500" /></div>;
    }

    return (
        <div className="p-4 lg:p-8 space-y-6">
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Reviews</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 text-center">
                    <p className="text-5xl font-black text-slate-900">{stats.avgRating}</p>
                    <div className="flex items-center justify-center gap-1 mt-2 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={18} className={s <= Math.round(stats.avgRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                        ))}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">{stats.total} total reviews</p>
                </div>
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-4">Rating Distribution</h3>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((r) => {
                            const count = (stats.ratingDistribution as any)?.[r] || 0;
                            return (
                                <button
                                    key={r}
                                    onClick={() => setRatingFilter(ratingFilter === r ? null : r)}
                                    className={`w-full flex items-center gap-3 group ${ratingFilter === r ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                                >
                                    <span className="text-sm font-bold text-slate-600 w-6">{r}★</span>
                                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${r >= 4 ? 'bg-emerald-400' : r === 3 ? 'bg-amber-400' : 'bg-red-400'}`}
                                            style={{ width: `${(count / maxDist) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-500 w-8 text-right">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Review List */}
            {reviews.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
                    <Star size={40} className="text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No reviews yet</h3>
                    <p className="text-slate-400 text-sm">Reviews will appear when tourists review your tours</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review: any) => (
                        <div key={review._id} className="bg-white rounded-2xl border border-slate-200/60 p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-slate-600">{review.user?.name?.charAt(0)?.toUpperCase() || '?'}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-slate-800">{review.user?.name || 'Anonymous'}</h4>
                                            <span className="text-xs text-slate-400">·</span>
                                            <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-emerald-600 font-semibold mb-2">{review.tourName}</p>
                                        <div className="flex items-center gap-0.5 mb-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={14} className={s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Operator Reply */}
                            {review.operatorReply?.text && (
                                <div className="mt-4 ml-14 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <p className="text-xs font-bold text-emerald-700 mb-1">Your Reply · {review.operatorReply.repliedAt ? new Date(review.operatorReply.repliedAt).toLocaleDateString() : ''}</p>
                                    <p className="text-sm text-emerald-800">{review.operatorReply.text}</p>
                                </div>
                            )}

                            {/* Reply Form */}
                            {replyingTo === review._id ? (
                                <div className="mt-4 ml-14 space-y-3">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write a professional reply..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-500/30"
                                    />
                                    <div className="flex items-center gap-2 justify-end">
                                        <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                                        <button
                                            onClick={() => handleReply(review._id)}
                                            disabled={replyLoading || !replyText.trim()}
                                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                                        >
                                            <Send size={14} /> {replyLoading ? 'Posting...' : 'Post Reply'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                !review.operatorReply?.text && (
                                    <button
                                        onClick={() => setReplyingTo(review._id)}
                                        className="mt-3 ml-14 text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                    >
                                        <MessageSquare size={14} /> Reply
                                    </button>
                                )
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OperatorReviews;
