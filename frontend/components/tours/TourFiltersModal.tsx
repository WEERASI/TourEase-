
import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, RotateCcw } from 'lucide-react';
import Button from '../Button';
import Checkbox from '../Checkbox';
import { TourFilters, TourType, TourDifficulty } from '../../types/tour';

interface TourFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TourFilters;
  onApply: (filters: TourFilters) => void;
  matchCount: number;
}

const TOUR_TYPES: TourType[] = ['Cultural', 'Wildlife', 'Beach', 'Adventure', 'Hill Country', 'Tea Plantation'];
const DIFFICULTIES: TourDifficulty[] = ['Easy', 'Moderate', 'Challenging'];
const DURATIONS = ['1-2 Days', '3-4 Days', '5-7 Days', '8+ Days'];
const RATINGS = [4.5, 4.0, 3.5, 3.0];

const TourFiltersModal: React.FC<TourFiltersModalProps> = ({ isOpen, onClose, filters: initialFilters, onApply, matchCount }) => {
  const [localFilters, setLocalFilters] = useState<TourFilters>(initialFilters);

  if (!isOpen) return null;

  const toggleArrayItem = (key: keyof TourFilters, item: any) => {
    setLocalFilters(prev => {
      const current = prev[key] as any[];
      const next = current.includes(item) 
        ? current.filter(i => i !== item) 
        : [...current, item];
      return { ...prev, [key]: next };
    });
  };

  const handleReset = () => {
    setLocalFilters({
      priceRange: [0, 500000],
      durations: [],
      types: [],
      ratings: [],
      difficulties: [],
      features: []
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Filters</h2>
            <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mt-1">{matchCount} matching tours</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
              title="Reset all"
            >
              <RotateCcw size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"><X size={24} /></button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Price Range */}
          <section className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Price Range (LKR)</label>
            <div className="space-y-6 px-2">
              <input 
                type="range" 
                min="0" 
                max="500000" 
                step="5000" 
                value={localFilters.priceRange[1]}
                onChange={e => setLocalFilters({...localFilters, priceRange: [0, parseInt(e.target.value)]})}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex items-center justify-between">
                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-sm font-bold text-slate-700">LKR 0</div>
                <div className="h-px flex-1 mx-4 bg-slate-100" />
                <div className="bg-sky-50 px-4 py-2 rounded-xl border border-sky-100 text-sm font-black text-sky-600">LKR {localFilters.priceRange[1].toLocaleString()}</div>
              </div>
            </div>
          </section>

          {/* Duration */}
          <section className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tour Duration</label>
            <div className="grid grid-cols-2 gap-3">
              {DURATIONS.map(d => (
                <Checkbox 
                  key={d} 
                  label={d} 
                  checked={localFilters.durations.includes(d)}
                  onChange={() => toggleArrayItem('durations', d)}
                />
              ))}
            </div>
          </section>

          {/* Tour Type */}
          <section className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tour Category</label>
            <div className="flex flex-wrap gap-2">
              {TOUR_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleArrayItem('types', type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    localFilters.types.includes(type)
                      ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-200'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-sky-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          {/* Difficulty */}
          <section className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Experience Level</label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  onClick={() => toggleArrayItem('difficulties', diff)}
                  className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    localFilters.difficulties.includes(diff)
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </section>

          {/* Ratings */}
          <section className="space-y-4 pb-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Minimum Rating</label>
            <div className="space-y-3">
              {RATINGS.map(r => (
                <Checkbox 
                  key={r} 
                  label={`${r}+ Stars`} 
                  checked={localFilters.ratings.includes(r)}
                  onChange={() => toggleArrayItem('ratings', r)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 sticky bottom-0 z-10">
          <Button variant="ghost" onClick={onClose} className="rounded-xl px-6 flex-1">Cancel</Button>
          <Button 
            variant="secondary" 
            onClick={() => { onApply(localFilters); onClose(); }} 
            className="rounded-xl px-10 flex-[2] shadow-xl shadow-orange-500/20"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourFiltersModal;
