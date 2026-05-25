import React, { useState, useEffect } from 'react';
import {
    User, Building2, FileCheck, CreditCard, Bell, Save,
    Loader2, CheckCircle2, AlertCircle, Camera, Globe,
    Facebook, Instagram,
} from 'lucide-react';
import { apiRequest } from '../../services/api';
import { updateOperatorProfile } from '../../services/operatorApi';

interface OperatorProfileProps {
    onNavigate: (page: string) => void;
}

const tabs = ['Personal Info', 'Business Info', 'Verification', 'Banking', 'Notifications'];

const OperatorProfile: React.FC<OperatorProfileProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [profile, setProfile] = useState<any>({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiRequest('/auth/me');
                setProfile(res.data || {});
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await updateOperatorProfile(profile);
            setSuccess('Profile updated successfully!');
            // Update localStorage
            const stored = localStorage.getItem('user');
            if (stored) {
                const user = JSON.parse(stored);
                user.name = profile.name;
                localStorage.setItem('user', JSON.stringify(user));
            }
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const updateProfile = (field: string, value: any) => {
        setProfile((prev: any) => ({ ...prev, [field]: value }));
    };

    const updateNested = (parent: string, field: string, value: any) => {
        setProfile((prev: any) => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value },
        }));
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full min-h-[60vh]"><Loader2 size={32} className="animate-spin text-emerald-500" /></div>;
    }

    return (
        <div className="p-4 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Profile & Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all"
                >
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {success && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold flex items-center gap-2"><CheckCircle2 size={16} /> {success}</div>}
            {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-semibold flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto bg-white rounded-xl border border-slate-200/60 p-1">
                {tabs.map((tab, idx) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(idx)}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === idx ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 lg:p-8">
                {/* Personal Info Tab */}
                {activeTab === 0 && (
                    <div className="space-y-6 max-w-2xl">
                        <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                                {profile.name?.charAt(0)?.toUpperCase() || 'O'}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{profile.name}</p>
                                <p className="text-sm text-slate-400">{profile.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                <input type="text" value={profile.name || ''} onChange={(e) => updateProfile('name', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input type="email" value={profile.email || ''} disabled className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-sm outline-none text-slate-400 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                                <input type="text" value={profile.phone || ''} onChange={(e) => updateProfile('phone', e.target.value)} placeholder="+94 7X XXX XXXX" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Avatar URL</label>
                                <input type="url" value={profile.avatar || ''} onChange={(e) => updateProfile('avatar', e.target.value)} placeholder="https://..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                                <textarea value={profile.bio || ''} onChange={(e) => updateProfile('bio', e.target.value)} placeholder="Tell tourists about yourself and your experience..." rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none resize-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Business Info Tab */}
                {activeTab === 1 && (
                    <div className="space-y-6 max-w-2xl">
                        <h2 className="text-lg font-bold text-slate-900">Business Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                                <input type="text" value={profile.companyName || ''} onChange={(e) => updateProfile('companyName', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Business License No.</label>
                                <input type="text" value={profile.businessLicense || ''} onChange={(e) => updateProfile('businessLicense', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Business Address</label>
                                <input type="text" value={profile.businessAddress || ''} onChange={(e) => updateProfile('businessAddress', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                        </div>
                        <h3 className="text-md font-bold text-slate-800 pt-4">Social Media Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                                <input type="url" value={profile.socialLinks?.website || ''} onChange={(e) => updateNested('socialLinks', 'website', e.target.value)} placeholder="https://..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Facebook</label>
                                <input type="url" value={profile.socialLinks?.facebook || ''} onChange={(e) => updateNested('socialLinks', 'facebook', e.target.value)} placeholder="https://facebook.com/..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram</label>
                                <input type="url" value={profile.socialLinks?.instagram || ''} onChange={(e) => updateNested('socialLinks', 'instagram', e.target.value)} placeholder="https://instagram.com/..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">LinkedIn</label>
                                <input type="url" value={profile.socialLinks?.linkedin || ''} onChange={(e) => updateNested('socialLinks', 'linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Verification Tab */}
                {activeTab === 2 && (
                    <div className="space-y-6 max-w-2xl">
                        <h2 className="text-lg font-bold text-slate-900">Verification Status</h2>
                        <div className={`p-4 rounded-xl border ${profile.verificationStatus === 'verified' ? 'bg-emerald-50 border-emerald-200' :
                                profile.verificationStatus === 'pending' ? 'bg-amber-50 border-amber-200' :
                                    'bg-slate-50 border-slate-200'
                            }`}>
                            <p className="text-sm font-bold capitalize">
                                Status: {profile.verificationStatus || 'Not Verified'}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {profile.verificationStatus === 'verified'
                                    ? 'Your business is verified. This badge appears on your tours.'
                                    : 'Upload your business documents to get verified.'}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-slate-700">Required Documents</p>
                            {['Business License', 'Tourism Certification', 'Insurance'].map((doc) => (
                                <div key={doc} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <FileCheck size={18} className="text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700">{doc}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 uppercase">Not Uploaded</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Banking Tab */}
                {activeTab === 3 && (
                    <div className="space-y-6 max-w-2xl">
                        <h2 className="text-lg font-bold text-slate-900">Bank Account Details</h2>
                        <p className="text-sm text-slate-500">Your payment will be transferred to this account.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Bank Name</label>
                                <input type="text" value={profile.bankDetails?.bankName || ''} onChange={(e) => updateNested('bankDetails', 'bankName', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Account Name</label>
                                <input type="text" value={profile.bankDetails?.accountName || ''} onChange={(e) => updateNested('bankDetails', 'accountName', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Account Number</label>
                                <input type="text" value={profile.bankDetails?.accountNumber || ''} onChange={(e) => updateNested('bankDetails', 'accountNumber', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Branch Code</label>
                                <input type="text" value={profile.bankDetails?.branchCode || ''} onChange={(e) => updateNested('bankDetails', 'branchCode', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 4 && (
                    <div className="space-y-6 max-w-2xl">
                        <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
                        <div className="space-y-4">
                            {[
                                { key: 'newBooking', label: 'New Booking', desc: 'Get notified when a tourist books your tour' },
                                { key: 'cancellation', label: 'Cancellations', desc: 'Get notified when a booking is cancelled' },
                                { key: 'payment', label: 'Payments', desc: 'Get notified when you receive a payment' },
                                { key: 'approval', label: 'Tour Approvals', desc: 'Get notified when your tour is approved or rejected' },
                                { key: 'reviews', label: 'New Reviews', desc: 'Get notified when a tourist reviews your tour' },
                            ].map((pref) => (
                                <div key={pref.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800">{pref.label}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">{pref.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={profile.notificationPreferences?.[pref.key] !== false}
                                            onChange={(e) => updateNested('notificationPreferences', pref.key, e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OperatorProfile;
