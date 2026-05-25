import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, AlertCircle, Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import { getDestinations, createDestination, updateDestination, deleteDestination } from '../../services/adminApi';

interface AdminDestinationsProps { onNavigate: (page: string) => void; }

const emptyForm = { name: '', location: '', province: '', categories: '', description: '', longDescription: '', imageUrl: '', bestTime: '', weather: '', activities: '' };

const AdminDestinations: React.FC<AdminDestinationsProps> = ({ onNavigate }) => {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            const res = await getDestinations();
            let data = res.data || [];
            if (search) {
                const s = search.toLowerCase();
                data = data.filter((d: any) => d.name?.toLowerCase().includes(s) || d.province?.toLowerCase().includes(s));
            }
            setDestinations(data);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchDestinations(); }, []);

    const openCreate = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (dest: any) => {
        setEditId(dest._id);
        setForm({
            name: dest.name || '', location: dest.location || '', province: dest.province || '',
            categories: (dest.categories || []).join(', '), description: dest.description || '',
            longDescription: dest.longDescription || '', imageUrl: dest.imageUrl || '',
            bestTime: dest.bestTime || '', weather: dest.weather || '',
            activities: (dest.activities || []).join(', '),
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const data = {
                ...form,
                categories: form.categories.split(',').map((s) => s.trim()).filter(Boolean),
                activities: form.activities.split(',').map((s) => s.trim()).filter(Boolean),
            };
            if (editId) { await updateDestination(editId, data); }
            else { await createDestination(data); }
            setShowModal(false);
            await fetchDestinations();
        } catch (err: any) { alert(err.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        try { await deleteDestination(id); setDeleteConfirm(null); await fetchDestinations(); }
        catch (err: any) { alert(err.message); }
    };

    const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); fetchDestinations(); };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Destinations</h1>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 text-white text-sm font-semibold rounded-xl hover:bg-sky-600 transition-colors">
                    <Plus size={16} /> Add Destination
                </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-2">
                <Search size={18} className="text-slate-400" />
                <input type="text" placeholder="Search destinations..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full" />
            </form>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-sky-500" /></div>
            ) : error ? (
                <div className="text-center py-20"><AlertCircle size={40} className="text-red-400 mx-auto mb-3" /><p className="text-slate-500">{error}</p></div>
            ) : destinations.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-100"><MapPin size={48} className="text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-slate-700">No destinations found</h3></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {destinations.map((dest) => (
                        <div key={dest._id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden group">
                            <div className="h-40 overflow-hidden relative">
                                <img src={dest.imageUrl || 'https://placehold.co/600x400?text=No+Image'} alt={dest.name} className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(dest)} className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-sky-50"><Pencil size={14} className="text-sky-600" /></button>
                                    {deleteConfirm === dest._id ? (
                                        <div className="flex gap-1">
                                            <button onClick={() => handleDelete(dest._id)} className="px-2 py-1 text-[10px] font-bold bg-red-500 text-white rounded-lg">Yes</button>
                                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-[10px] font-bold bg-slate-200 rounded-lg">No</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setDeleteConfirm(dest._id)} className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50"><Trash2 size={14} className="text-red-500" /></button>
                                    )}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-bold text-slate-900 mb-1">{dest.name}</h3>
                                <p className="text-xs text-slate-500 mb-2">{dest.province} · {dest.location}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /><span className="text-xs font-bold text-slate-700">{dest.rating?.toFixed(1) || '0.0'}</span></div>
                                    <span className="text-xs text-slate-400">{dest.reviews || 0} reviews</span>
                                </div>
                                {dest.categories?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {dest.categories.slice(0, 3).map((c: string) => (
                                            <span key={c} className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-bold">{c}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">{editId ? 'Edit' : 'Add'} Destination</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { key: 'name', label: 'Name', placeholder: 'e.g. Sigiriya Rock Fortress' },
                                { key: 'location', label: 'Location', placeholder: 'e.g. Matale District' },
                                { key: 'province', label: 'Province', placeholder: 'e.g. Central Province' },
                                { key: 'categories', label: 'Categories (comma-separated)', placeholder: 'e.g. Historical, UNESCO, Nature' },
                                { key: 'imageUrl', label: 'Image URL', placeholder: 'https://...' },
                                { key: 'bestTime', label: 'Best Time to Visit', placeholder: 'e.g. January to April' },
                                { key: 'weather', label: 'Weather', placeholder: 'e.g. Tropical, 25-30°C' },
                                { key: 'activities', label: 'Activities (comma-separated)', placeholder: 'e.g. Hiking, Photography' },
                            ].map(({ key, label, placeholder }) => (
                                <div key={key}>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">{label}</label>
                                    <input type="text" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none resize-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">Long Description</label>
                                <textarea value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none resize-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600">Cancel</button>
                            <button onClick={handleSave} disabled={saving || !form.name || !form.location || !form.province || !form.description || !form.imageUrl}
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50">
                                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDestinations;
