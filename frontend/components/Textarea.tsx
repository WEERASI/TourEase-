
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
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
      <textarea
        disabled={disabled}
        className={`
          w-full bg-white border px-4 py-3 rounded-[var(--radius-md)] text-sm transition-all duration-200 min-h-[120px] resize-y
          text-slate-900 font-medium placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-opacity-20
          ${error 
            ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]' 
            : 'border-[var(--color-neutral-200)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]'
          }
          ${disabled ? 'bg-[var(--color-neutral-50)] cursor-not-allowed opacity-75' : ''}
        `}
        {...props}
      />
      {error && <p className="text-xs text-[var(--color-error)] font-medium mt-0.5">{error}</p>}
      {!error && helperText && <p className="text-xs text-[var(--color-neutral-500)] mt-0.5">{helperText}</p>}
    </div>
  );
};

export default Textarea;
