import React, { useState } from 'react';
import {
    ArrowLeft, ArrowRight, Save, Send, Image, Video, MapPin,
    Plus, X, Loader2, AlertCircle, CheckCircle2, ChevronDown,
} from 'lucide-react';
import { createTour, updateTour } from '../../services/operatorApi';

interface OperatorTourFormProps {
    onNavigate: (page: string) => void;
    editTour?: any;
}

const tourTypes = ['Cultural', 'Wildlife', 'Beach', 'Adventure', 'Hill Country', 'Tea Plantation'];
const difficulties = ['Easy', 'Moderate', 'Challenging'];

const STEPS = ['Basic Info', 'Itinerary', 'Media', 'Pricing & Details', 'Review & Submit'];

const OperatorTourForm: React.FC<OperatorTourFormProps> = ({ onNavigate, editTour }) => {
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [form, setForm] = useState({
        title: editTour?.title || '',
        description: editTour?.description || '',
        type: editTour?.type || 'Cultural',
        difficulty: editTour?.difficulty || 'Moderate',
        durationDays: editTour?.durationDays || 1,
        durationNights: editTour?.durationNights || 0,
        duration: editTour?.duration || '1 Day',
        minGroupSize: editTour?.minGroupSize || 1,
        maxGroupSize: editTour?.maxGroupSize || 20,
        price: editTour?.price || 0,
        imageUrl: editTour?.imageUrl || '',
        galleryImages: editTour?.galleryImages || [] as string[],
        videoUrl: editTour?.videoUrl || '',
        destinations: editTour?.destinations || [] as string[],
        itinerary: editTour?.itinerary || [{ day: 1, title: 'Day 1', description: '', activities: [''] }],
        inclusions: editTour?.inclusions || [''],
        exclusions: editTour?.exclusions || [''],
        cancellationPolicy: editTour?.cancellationPolicy || '',
        availability: editTour?.availability || 'Year-round',
        notes: editTour?.notes || '',
    });

    const updateField = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // List helpers
    const addListItem = (field: string) => {
        setForm((prev: any) => ({ ...prev, [field]: [...prev[field], ''] }));
    };
    const updateListItem = (field: string, index: number, value: string) => {
        setForm((prev: any) => {
            const arr = [...prev[field]];
            arr[index] = value;
            return { ...prev, [field]: arr };
        });
    };
    const removeListItem = (field: string, index: number) => {
        setForm((prev: any) => ({ ...prev, [field]: prev[field].filter((_: any, i: number) => i !== index) }));
    };

    // Itinerary helpers
    const addDay = () => {
        const newDay = form.itinerary.length + 1;
        setForm((prev) => ({
            ...prev,
            itinerary: [...prev.itinerary, { day: newDay, title: `Day ${newDay}`, description: '', activities: [''] }],
        }));
    };
    const removeDay = (index: number) => {
        setForm((prev) => ({
            ...prev,
            itinerary: prev.itinerary.filter((_: any, i: number) => i !== index).map((d: any, i: number) => ({ ...d, day: i + 1 })),
        }));
    };
    const updateDay = (index: number, field: string, value: any) => {
        setForm((prev) => {
            const itinerary = [...prev.itinerary];
            itinerary[index] = { ...itinerary[index], [field]: value };
            return { ...prev, itinerary };
        });
    };
    const addActivity = (dayIndex: number) => {
        setForm((prev) => {
            const itinerary = [...prev.itinerary];
            itinerary[dayIndex] = { ...itinerary[dayIndex], activities: [...itinerary[dayIndex].activities, ''] };
            return { ...prev, itinerary };
        });
    };
    const updateActivity = (dayIndex: number, actIndex: number, value: string) => {
        setForm((prev) => {
            const itinerary = [...prev.itinerary];
            const activities = [...itinerary[dayIndex].activities];
            activities[actIndex] = value;
            itinerary[dayIndex] = { ...itinerary[dayIndex], activities };
            return { ...prev, itinerary };
        });
    };
    const removeActivity = (dayIndex: number, actIndex: number) => {
        setForm((prev) => {
            const itinerary = [...prev.itinerary];
            itinerary[dayIndex] = {
                ...itinerary[dayIndex],
                activities: itinerary[dayIndex].activities.filter((_: any, i: number) => i !== actIndex),
            };
            return { ...prev, itinerary };
        });
    };

    const handleSave = async (submitForApproval = false) => {
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            // Build duration text
            const durationText = form.durationNights > 0
                ? `${form.durationDays} Days / ${form.durationNights} Nights`
                : `${form.durationDays} Day${form.durationDays > 1 ? 's' : ''}`;

            const tourData = {
                ...form,
                duration: durationText,
                inclusions: form.inclusions.filter((i: string) => i.trim()),
                exclusions: form.exclusions.filter((i: string) => i.trim()),
                destinations: form.destinations.filter((d: string) => d.trim()),
                galleryImages: form.galleryImages.filter((g: string) => g.trim()),
                itinerary: form.itinerary.map((d: any) => ({
                    ...d,
                    activities: d.activities.filter((a: string) => a.trim()),
                })),
                status: submitForApproval ? 'pending' : 'draft',
            };

            if (editTour?._id) {
                await updateTour(editTour._id, tourData);
                setSuccess('Tour updated successfully!');
            } else {
                await createTour(tourData);
                setSuccess(submitForApproval ? 'Tour submitted for approval!' : 'Tour saved as draft!');
            }

            setTimeout(() => onNavigate('operator-tours'), 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to save tour');
        } finally {
            setSaving(false);
        }
    };

    const isStepValid = (s: number) => {
        switch (s) {
            case 0: return form.title.trim() && form.type && form.difficulty && form.durationDays >= 1;
            case 1: return form.itinerary.length > 0;
            case 2: return form.imageUrl.trim();
            case 3: return form.price > 0;
            default: return true;
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onNavigate('operator-tours')}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900">{editTour ? 'Edit Tour' : 'Create New Tour'}</h1>
                    <p className="text-slate-500 text-sm font-medium">Fill in the details below to {editTour ? 'update' : 'create'} your tour package</p>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 lg:p-6">
                <div className="flex items-center justify-between overflow-x-auto">
                    {STEPS.map((label, idx) => (
                        <div key={label} className="flex items-center flex-shrink-0">
                            <button
                                onClick={() => idx <= step ? setStep(idx) : null}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${idx === step ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                        : idx < step ? 'text-emerald-600'
                                            : 'text-slate-400'
                                    }`}
                            >
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx === step ? 'bg-emerald-500 text-white'
                                        : idx < step ? 'bg-emerald-100 text-emerald-600'
                                            : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {idx < step ? <CheckCircle2 size={16} /> : idx + 1}
                                </span>
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                            {idx < STEPS.length - 1 && <div className={`w-8 lg:w-16 h-0.5 mx-1 ${idx < step ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Error / Success */}
            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm font-semibold">
                    <AlertCircle size={18} /> {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-3 text-sm font-semibold">
                    <CheckCircle2 size={18} /> {success}
                </div>
            )}

            {/* Form Content */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 lg:p-8">
                {/* Step 0: Basic Info */}
                {step === 0 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tour Name *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    placeholder="e.g. Cultural Heritage Tour of Kandy"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    placeholder="Describe your tour in detail..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 outline-none transition-all resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                                <select value={form.type} onChange={(e) => updateField('type', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none">
                                    {tourTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level *</label>
                                <select value={form.difficulty} onChange={(e) => updateField('difficulty', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none">
                                    {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (Days) *</label>
                                <input type="number" min={1} value={form.durationDays} onChange={(e) => updateField('durationDays', parseInt(e.target.value) || 1)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (Nights)</label>
                                <input type="number" min={0} value={form.durationNights} onChange={(e) => updateField('durationNights', parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Min Group Size</label>
                                <input type="number" min={1} value={form.minGroupSize} onChange={(e) => updateField('minGroupSize', parseInt(e.target.value) || 1)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Max Group Size</label>
                                <input type="number" min={1} value={form.maxGroupSize} onChange={(e) => updateField('maxGroupSize', parseInt(e.target.value) || 20)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                        </div>

                        {/* Destinations */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Destinations</label>
                            {form.destinations.map((dest: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 mb-2">
                                    <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                                    <input
                                        type="text"
                                        value={dest}
                                        onChange={(e) => updateListItem('destinations', idx, e.target.value)}
                                        placeholder="e.g. Kandy"
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none"
                                    />
                                    <button onClick={() => removeListItem('destinations', idx)} className="p-1.5 text-red-400 hover:text-red-600"><X size={16} /></button>
                                </div>
                            ))}
                            <button onClick={() => addListItem('destinations')} className="text-sm text-emerald-600 font-semibold flex items-center gap-1 mt-1 hover:text-emerald-700">
                                <Plus size={14} /> Add Destination
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 1: Itinerary */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Day-by-Day Itinerary</h2>
                        {form.itinerary.map((day: any, dayIdx: number) => (
                            <div key={dayIdx} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800">Day {day.day}</h3>
                                    {form.itinerary.length > 1 && (
                                        <button onClick={() => removeDay(dayIdx)} className="text-xs text-red-500 font-semibold hover:text-red-600">Remove Day</button>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={day.title}
                                        onChange={(e) => updateDay(dayIdx, 'title', e.target.value)}
                                        placeholder="Day title (e.g. Arrival & Temple Visit)"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm outline-none"
                                    />
                                    <textarea
                                        value={day.description}
                                        onChange={(e) => updateDay(dayIdx, 'description', e.target.value)}
                                        placeholder="Describe what happens on this day..."
                                        rows={2}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm outline-none resize-none"
                                    />
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-2">Activities</p>
                                        {day.activities.map((act: string, actIdx: number) => (
                                            <div key={actIdx} className="flex items-center gap-2 mb-2">
                                                <span className="text-xs text-slate-400 font-bold w-5">{actIdx + 1}.</span>
                                                <input
                                                    type="text"
                                                    value={act}
                                                    onChange={(e) => updateActivity(dayIdx, actIdx, e.target.value)}
                                                    placeholder="Activity description"
                                                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm outline-none"
                                                />
                                                <button onClick={() => removeActivity(dayIdx, actIdx)} className="p-1 text-red-400 hover:text-red-600"><X size={14} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => addActivity(dayIdx)} className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                                            <Plus size={12} /> Add Activity
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={addDay} className="w-full py-3 rounded-xl border-2 border-dashed border-emerald-300 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                            <Plus size={16} /> Add Another Day
                        </button>
                    </div>
                )}

                {/* Step 2: Media */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Media</h2>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Image URL *</label>
                            <div className="flex items-center gap-3">
                                <Image size={18} className="text-slate-400 flex-shrink-0" />
                                <input
                                    type="url"
                                    value={form.imageUrl}
                                    onChange={(e) => updateField('imageUrl', e.target.value)}
                                    placeholder="https://example.com/tour-cover.jpg"
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none"
                                />
                            </div>
                            {form.imageUrl && (
                                <img src={form.imageUrl} alt="Cover preview" className="mt-3 h-40 w-full object-cover rounded-xl border border-slate-200" />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Gallery Images</label>
                            {form.galleryImages.map((url: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 mb-2">
                                    <Image size={16} className="text-slate-400 flex-shrink-0" />
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => updateListItem('galleryImages', idx, e.target.value)}
                                        placeholder="Image URL"
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none"
                                    />
                                    <button onClick={() => removeListItem('galleryImages', idx)} className="p-1.5 text-red-400 hover:text-red-600"><X size={16} /></button>
                                </div>
                            ))}
                            <button onClick={() => addListItem('galleryImages')} className="text-sm text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                                <Plus size={14} /> Add Image
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Video URL (YouTube/Vimeo)</label>
                            <div className="flex items-center gap-3">
                                <Video size={18} className="text-slate-400 flex-shrink-0" />
                                <input
                                    type="url"
                                    value={form.videoUrl}
                                    onChange={(e) => updateField('videoUrl', e.target.value)}
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Pricing & Details */}
                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Pricing & Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (LKR) *</label>
                                <input type="number" min={0} value={form.price} onChange={(e) => updateField('price', parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Availability</label>
                                <input type="text" value={form.availability} onChange={(e) => updateField('availability', e.target.value)} placeholder="e.g. Year-round, Oct-Mar" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                            </div>
                        </div>

                        {/* Inclusions */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">What's Included</label>
                            {form.inclusions.map((item: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                                    <input type="text" value={item} onChange={(e) => updateListItem('inclusions', idx, e.target.value)} placeholder="e.g. Hotel accommodation" className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                                    <button onClick={() => removeListItem('inclusions', idx)} className="p-1.5 text-red-400 hover:text-red-600"><X size={16} /></button>
                                </div>
                            ))}
                            <button onClick={() => addListItem('inclusions')} className="text-sm text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                                <Plus size={14} /> Add Inclusion
                            </button>
                        </div>

                        {/* Exclusions */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">What's NOT Included</label>
                            {form.exclusions.map((item: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 mb-2">
                                    <X size={16} className="text-red-400 flex-shrink-0" />
                                    <input type="text" value={item} onChange={(e) => updateListItem('exclusions', idx, e.target.value)} placeholder="e.g. Flight tickets" className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none" />
                                    <button onClick={() => removeListItem('exclusions', idx)} className="p-1.5 text-red-400 hover:text-red-600"><X size={16} /></button>
                                </div>
                            ))}
                            <button onClick={() => addListItem('exclusions')} className="text-sm text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                                <Plus size={14} /> Add Exclusion
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Cancellation Policy</label>
                            <textarea value={form.cancellationPolicy} onChange={(e) => updateField('cancellationPolicy', e.target.value)} placeholder="Describe your cancellation policy..." rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none resize-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Important Notes</label>
                            <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Any additional notes for tourists..." rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none resize-none" />
                        </div>
                    </div>
                )}

                {/* Step 4: Review & Submit */}
                {step === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Review Your Tour</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 bg-slate-50 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 text-lg">{form.title || 'Untitled Tour'}</h3>
                                <p className="text-sm text-slate-500 mt-1">{form.description || 'No description'}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Details</p>
                                <div className="space-y-1 text-sm text-slate-600">
                                    <p><strong>Category:</strong> {form.type}</p>
                                    <p><strong>Difficulty:</strong> {form.difficulty}</p>
                                    <p><strong>Duration:</strong> {form.durationDays} days / {form.durationNights} nights</p>
                                    <p><strong>Group Size:</strong> {form.minGroupSize} - {form.maxGroupSize}</p>
                                    <p><strong>Price:</strong> LKR {form.price.toLocaleString()}</p>
                                    <p><strong>Availability:</strong> {form.availability}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Content</p>
                                <div className="space-y-1 text-sm text-slate-600">
                                    <p><strong>Destinations:</strong> {form.destinations.filter((d: string) => d.trim()).length}</p>
                                    <p><strong>Itinerary Days:</strong> {form.itinerary.length}</p>
                                    <p><strong>Inclusions:</strong> {form.inclusions.filter((i: string) => i.trim()).length}</p>
                                    <p><strong>Exclusions:</strong> {form.exclusions.filter((i: string) => i.trim()).length}</p>
                                    <p><strong>Gallery Images:</strong> {form.galleryImages.filter((g: string) => g.trim()).length}</p>
                                    <p><strong>Video:</strong> {form.videoUrl ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                        </div>
                        {form.imageUrl && <img src={form.imageUrl} alt="Cover" className="w-full h-48 object-cover rounded-xl" />}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200/60 p-4 lg:p-6">
                <button
                    onClick={() => step > 0 ? setStep(step - 1) : onNavigate('operator-tours')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft size={16} /> {step > 0 ? 'Previous' : 'Cancel'}
                </button>
                <div className="flex items-center gap-3">
                    {step === STEPS.length - 1 ? (
                        <>
                            <button
                                onClick={() => handleSave(false)}
                                disabled={saving}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                <Save size={16} /> {saving ? 'Saving...' : 'Save as Draft'}
                            </button>
                            <button
                                onClick={() => handleSave(true)}
                                disabled={saving}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all"
                            >
                                <Send size={16} /> {saving ? 'Submitting...' : 'Submit for Approval'}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={!isStepValid(step)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isStepValid(step)
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Next <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OperatorTourForm;
