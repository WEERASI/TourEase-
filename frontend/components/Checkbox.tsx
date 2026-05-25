import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', checked, ...props }) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative flex items-center justify-center">
        <input 
          type="checkbox" 
          className="peer sr-only" 
          checked={checked}
          {...props} 
        />
        {/* Visual Checkbox */}
        <div className={`
          w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center
          peer-focus:ring-2 peer-focus:ring-sky-100
          peer-checked:bg-sky-500 peer-checked:border-sky-500
          bg-white border-slate-200 group-hover:border-sky-500
        `}>
          <Check 
            size={14} 
            className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" 
            strokeWidth={4} 
          />
        </div>
      </div>
      {label && <span className="text-sm text-slate-700 select-none font-medium">{label}</span>}
    </label>
  );
};

export default Checkbox;