
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
  helperText?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          disabled={disabled}
          className={`
            w-full appearance-none bg-white border px-4 py-2.5 rounded-[var(--radius-md)] text-sm transition-all duration-200
            text-slate-900 font-medium
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            ${error 
              ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]' 
              : 'border-[var(--color-neutral-200)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]'
            }
            ${disabled ? 'bg-[var(--color-neutral-50)] cursor-not-allowed opacity-75' : 'cursor-pointer'}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-slate-900 bg-white py-2">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-neutral-500)]">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <p className="text-xs text-[var(--color-error)] font-medium mt-0.5">{error}</p>}
      {!error && helperText && <p className="text-xs text-[var(--color-neutral-500)] mt-0.5">{helperText}</p>}
    </div>
  );
};

export default Select;
