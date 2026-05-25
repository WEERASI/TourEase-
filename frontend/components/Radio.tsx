
import React from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Radio: React.FC<RadioProps> = ({ label, checked, className = '', ...props }) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative flex items-center justify-center">
        <input 
          type="radio" 
          className="peer sr-only" 
          checked={checked}
          {...props} 
        />
        <div className={`
          w-5 h-5 border-2 rounded-full transition-all duration-200 flex items-center justify-center
          peer-focus:ring-2 peer-focus:ring-[var(--color-primary-100)]
          ${checked 
            ? 'border-[var(--color-primary-500)]' 
            : 'border-[var(--color-neutral-200)] group-hover:border-[var(--color-primary-500)]'
          }
        `}>
          <div className={`w-2.5 h-2.5 rounded-full bg-[var(--color-primary-500)] transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} />
        </div>
      </div>
      {label && <span className="text-sm text-[var(--color-neutral-800)] select-none">{label}</span>}
    </label>
  );
};

export default Radio;
