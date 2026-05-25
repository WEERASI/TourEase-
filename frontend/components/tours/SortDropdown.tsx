
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ArrowUpDown } from 'lucide-react';

export type SortOption = 'Recommended' | 'Price: Low to High' | 'Price: High to Low' | 'Highest Rated' | 'Shortest First' | 'Longest First';

interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const OPTIONS: SortOption[] = [
  'Recommended',
  'Price: Low to High',
  'Price: High to Low',
  'Highest Rated',
  'Shortest First',
  'Longest First'
];

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm hover:border-sky-300 transition-all active:scale-95 group"
      >
        <ArrowUpDown size={16} className="text-slate-400 group-hover:text-sky-500 transition-colors" />
        <div className="text-left">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Sort by</p>
          <p className="text-sm font-bold text-slate-900 leading-none">{value}</p>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full flex items-center justify-between px-6 py-3 text-sm font-bold transition-colors ${
                value === opt ? 'text-sky-600 bg-sky-50/50' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt}
              {value === opt && <Check size={16} className="text-sky-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
