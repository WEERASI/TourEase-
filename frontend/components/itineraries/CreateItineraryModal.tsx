
import React, { useState } from 'react';
import { X, Calendar, Users, Target, ArrowRight, Save, Info } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import Textarea from '../Textarea';
import { Itinerary } from '../../types/itinerary';

interface CreateItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (itinerary: Itinerary) => void;
}

const CreateItineraryModal: React.FC<CreateItineraryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 150000,
    type: 'Cultural' as const
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Construct mock new itinerary
    const newItinerary: Itinerary = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      status: 'Draft',
      coverImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=1200',
      destinationsCount: 0,
      hotelsCount: 0,
      toursCount: 0,
      days: [] // In a real app, generate days based on date range
    };
    onSuccess(newItinerary);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900">New Itinerary</h2>
            <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mt-1">Step {step} of 2: {step === 1 ? 'Basic Details' : 'Preferences'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"><X size={24} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10">
          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <Input 
                label="Trip Name" 
                placeholder="e.g. My Summer Lanka Adventure" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <Textarea 
                label="Trip Description (Optional)" 
                placeholder="What is the goal of this trip?" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Start Date" 
                  type="date" 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  leftIcon={<Calendar size={18} />} 
                />
                <Input 
                  label="End Date" 
                  type="date" 
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                  leftIcon={<Calendar size={18} />} 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Number of Travelers</label>
                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                       <button onClick={() => setFormData({...formData, travelers: Math.max(1, formData.travelers - 1)})} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-sky-600">-</button>
                       <span className="text-lg font-black text-slate-900">{formData.travelers}</span>
                       <button onClick={() => setFormData({...formData, travelers: formData.travelers + 1})} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-sky-600">+</button>
                    </div>
                 </div>
                 <Select 
                   label="Trip Category" 
                   options={[
                     {value: 'Cultural', label: 'Cultural Heritage'},
                     {value: 'Beach', label: 'Beach & Coastal'},
                     {value: 'Adventure', label: 'Adventure & Wildlife'},
                     {value: 'Honeymoon', label: 'Romantic Honeymoon'},
                     {value: 'Family', label: 'Family Friendly'},
                   ]} 
                   value={formData.type}
                   onChange={e => setFormData({...formData, type: e.target.value as any})}
                 />
              </div>
              
              <Input 
                label="Target Budget (LKR)" 
                type="number" 
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: parseInt(e.target.value)})}
                leftIcon={<Target size={18} />}
                helperText="We'll help you track costs against this limit."
              />

              <div className="p-6 bg-sky-50 rounded-3xl border border-sky-100 flex items-start gap-4">
                 <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-sky-500 shadow-sm shrink-0">
                    <Info size={20} />
                 </div>
                 <p className="text-xs text-sky-800 leading-relaxed font-medium">
                   You can always change these details later. Next, you'll be able to start adding hotels, tours, and transportation to your daily schedule.
                 </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between shrink-0 bg-slate-50/30">
          <Button variant="ghost" onClick={step === 1 ? onClose : () => setStep(1)} className="rounded-xl px-8">
            {step === 1 ? 'Cancel' : 'Previous'}
          </Button>
          <Button 
            variant="secondary" 
            className="rounded-xl px-12 shadow-xl shadow-orange-500/20"
            onClick={step === 1 ? () => setStep(2) : handleSubmit}
            rightIcon={step === 1 ? <ArrowRight size={18} /> : <Save size={18} />}
            disabled={step === 1 && !formData.name}
          >
            {step === 1 ? 'Continue' : 'Create Itinerary'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateItineraryModal;
