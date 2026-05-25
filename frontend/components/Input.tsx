import React, { useRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  success,
  leftIcon,
  rightElement,
  className = '',
  disabled,
  type,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const getBorderColor = () => {
    if (error) return 'border-[var(--color-error)] focus:ring-[var(--color-error)]';
    if (success) return 'border-[var(--color-success)] focus:ring-[var(--color-success)]';
    return 'border-[var(--color-neutral-200)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]';
  };

  /**
   * Triggers the native browser picker for date, time, and color inputs.
   * Uses the modern showPicker() API with focus/click fallbacks.
   */
  const handleIconClick = (e: React.MouseEvent) => {
    if (disabled) return;
    
    const input = inputRef.current;
    if (!input) return;

    // showPicker() is the standard way to programmatically open browser pickers
    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker();
      } catch (err) {
        // Fallback for security restrictions or older implementations
        input.focus();
      }
    } else {
      // Legacy fallback
      input.focus();
      input.click();
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center h-12">
        {leftIcon && (
          <div className="absolute left-3 text-[var(--color-neutral-500)] z-10 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={inputRef}
          disabled={disabled}
          type={type}
          className={`
            w-full h-full transition-all duration-200 bg-white
            ${leftIcon ? 'pl-10' : 'pl-4'}
            ${rightElement ? 'pr-12' : 'pr-4'}
            rounded-[var(--radius-md)] border text-sm
            text-slate-900 font-medium placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            ${getBorderColor()}
            ${disabled ? 'bg-[var(--color-neutral-50)] cursor-not-allowed opacity-75' : ''}
            box-border flex items-center m-0
          `}
          {...props}
        />
        {rightElement && (
          <div 
            onClick={handleIconClick}
            className={`
              absolute right-0 top-0 h-full w-12 flex items-center justify-center text-slate-400
              ${!disabled ? 'cursor-pointer hover:text-sky-600 active:scale-90' : 'cursor-not-allowed'}
              transition-all z-20 pointer-events-auto
            `}
          >
            {/* We ensure the child icon doesn't eat the click event if it has its own padding */}
            <div className="pointer-events-none flex items-center justify-center">
              {rightElement}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[var(--color-error)] font-medium mt-0.5">{error}</p>}
      {!error && helperText && <p className="text-xs text-[var(--color-neutral-500)] mt-0.5">{helperText}</p>}
    </div>
  );
};

export default Input;