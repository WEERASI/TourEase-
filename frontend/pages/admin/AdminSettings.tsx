import React, { useState, useEffect } from 'react';
import { Settings, Loader2, AlertCircle, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { getSettings, updateSettings } from '../../services/adminApi';

interface AdminSettingsProps { onNavigate: (page: string) => void; }

const AdminSettings: React.FC<AdminSettingsProps> = ({ onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await getSettings();
                setSettings(res.data || {});
            } catch (err: any) { setError(err.message); }
            finally { setLoading(false); }
        })();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSettings(settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) { alert(err.message); }
        finally { setSaving(false); }
    };

    const update = (key: string, value: any) => setSettings({ ...settings, [key]: value });

    if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><Loader2 size={32} className="animate-spin text-sky-500" /></div>;
    if (error) return <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-3"><AlertCircle size={40} className="text-red-400" /><p className="text-slate-500">{error}</p></div>;

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Platform Settings</h1>
                <button onClick={handleSave} disabled={saving}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white hover:bg-sky-600'}`}>
                    <Save size={16} />
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {/* General Settings */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">General</h3>
                <div className="space-y-4">
                    {[
                        { key: 'platformName', label: 'Platform Name', type: 'text' },
                        { key: 'supportEmail', label: 'Support Email', type: 'email' },
                        { key: 'defaultCurrency', label: 'Default Currency', type: 'text' },
                    ].map(({ key, label, type }) => (
                        <div key={key}>
                            <label className="text-xs font-bold text-slate-600 mb-1 block">{label}</label>
                            <input type={type} value={settings[key] || ''} onChange={(e) => update(key, e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Commission & Policies */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Commission & Policies</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Commission Rate (%)</label>
                        <input type="number" value={settings.commissionRate || 0} min={0} max={100}
                            onChange={(e) => update('commissionRate', Number(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Minimum Booking Notice (hours)</label>
                        <input type="number" value={settings.minBookingNotice || 0} min={0}
                            onChange={(e) => update('minBookingNotice', Number(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Max Cancellation Days</label>
                        <input type="number" value={settings.maxCancellationDays || 0} min={0}
                            onChange={(e) => update('maxCancellationDays', Number(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                    </div>
                </div>
            </div>

            {/* Auto-Approval Settings */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Auto-Approval</h3>
                <div className="space-y-4">
                    {[
                        { key: 'autoApproveOperators', label: 'Auto-approve new Tour Operators', desc: 'Operators will be verified automatically upon registration' },
                        { key: 'autoApproveTours', label: 'Auto-approve new Tours', desc: 'Tours submitted by operators will go live immediately' },
                        { key: 'autoApproveHotels', label: 'Auto-approve new Hotels', desc: 'Hotel listings will be approved automatically' },
                    ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{label}</p>
                                <p className="text-xs text-slate-400">{desc}</p>
                            </div>
                            <button onClick={() => update(key, !settings[key])} className="shrink-0">
                                {settings[key]
                                    ? <ToggleRight size={32} className="text-sky-500" />
                                    : <ToggleLeft size={32} className="text-slate-300" />
                                }
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Maintenance */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">System</h3>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50">
                    <div>
                        <p className="text-sm font-semibold text-red-600">Maintenance Mode</p>
                        <p className="text-xs text-slate-400">When enabled, the platform will show a maintenance page to users</p>
                    </div>
                    <button onClick={() => update('maintenanceMode', !settings.maintenanceMode)} className="shrink-0">
                        {settings.maintenanceMode
                            ? <ToggleRight size={32} className="text-red-500" />
                            : <ToggleLeft size={32} className="text-slate-300" />
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
