import React, { useState, useEffect } from 'react';
import { Search, Users, Loader2, AlertCircle, Shield, UserCheck, UserX, Trash2, ChevronDown } from 'lucide-react';
import { getUsers, updateUserRole, updateUserStatus, deleteUser } from '../../services/adminApi';

interface AdminUsersProps { onNavigate: (page: string) => void; }

const roleTabs = [
    { value: '', label: 'All Users' },
    { value: 'tourist', label: 'Tourists' },
    { value: 'tour_operator', label: 'Operators' },
    { value: 'hotel_partner', label: 'Hotel Partners' },
    { value: 'admin', label: 'Admins' },
];

const roleColors: Record<string, string> = {
    tourist: 'bg-sky-50 text-sky-700',
    tour_operator: 'bg-orange-50 text-orange-700',
    hotel_partner: 'bg-emerald-50 text-emerald-700',
    admin: 'bg-purple-50 text-purple-700',
};

const AdminUsers: React.FC<AdminUsersProps> = ({ onNavigate }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (roleFilter) params.role = roleFilter;
            if (search) params.search = search;
            const res = await getUsers(params);
            setUsers(res.data || []);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, [roleFilter]);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchUsers(); };

    const handleRoleChange = async (userId: string, newRole: string) => {
        setActionLoading(userId);
        try { await updateUserRole(userId, newRole); await fetchUsers(); }
        catch (err: any) { alert(err.message); }
        finally { setActionLoading(null); }
    };

    const handleStatusToggle = async (userId: string, isActive: boolean) => {
        setActionLoading(userId);
        try { await updateUserStatus(userId, !isActive); await fetchUsers(); }
        catch (err: any) { alert(err.message); }
        finally { setActionLoading(null); }
    };

    const handleDelete = async (userId: string) => {
        setActionLoading(userId);
        try { await deleteUser(userId); setDeleteConfirm(null); await fetchUsers(); }
        catch (err: any) { alert(err.message); }
        finally { setActionLoading(null); }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">User Management</h1>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        {roleTabs.map((tab) => (
                            <button key={tab.value} onClick={() => setRoleFilter(tab.value)}
                                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${roleFilter === tab.value ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full" />
                    </form>
                </div>
            </div>

            {/* User List */}
            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-sky-500" /></div>
            ) : error ? (
                <div className="text-center py-20"><AlertCircle size={40} className="text-red-400 mx-auto mb-3" /><p className="text-slate-500">{error}</p></div>
            ) : users.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-100"><Users size={48} className="text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-slate-700">No users found</h3></div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-sky-100 rounded-full flex items-center justify-center text-sm font-bold text-sky-600">
                                                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                                                    <p className="text-xs text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                disabled={actionLoading === user._id}
                                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border-none outline-none cursor-pointer ${roleColors[user.role] || 'bg-slate-100 text-slate-600'}`}>
                                                <option value="tourist">Tourist</option>
                                                <option value="tour_operator">Tour Operator</option>
                                                <option value="hotel_partner">Hotel Partner</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleStatusToggle(user._id, user.isActive !== false)}
                                                disabled={actionLoading === user._id}
                                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${user.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                {user.isActive !== false ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            {deleteConfirm === user._id ? (
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleDelete(user._id)} className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-lg">Confirm</button>
                                                    <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg">Cancel</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setDeleteConfirm(user._id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
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

export default AdminUsers;
