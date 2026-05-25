
import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] shadow-sm hover:shadow focus:ring-[var(--color-primary-500)]",
    secondary: "bg-[var(--color-secondary-500)] text-white hover:bg-[var(--color-secondary-600)] shadow-sm hover:shadow focus:ring-[var(--color-secondary-500)]",
    ghost: "bg-transparent border border-[var(--color-primary-500)] text-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)] focus:ring-[var(--color-primary-500)]",
    danger: "bg-[var(--color-error)] text-white hover:bg-red-600 focus:ring-[var(--color-error)]",
    icon: "p-2 rounded-full text-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-100)] focus:ring-[var(--color-primary-500)]"
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-[var(--radius-sm)]",
    md: "px-4 py-2 text-base rounded-[var(--radius-md)]",
    lg: "px-6 py-3 text-lg rounded-[var(--radius-lg)]"
  };

  const iconSizeStyles = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const isIconOnly = variant === 'icon';
  const combinedClassName = `
    ${baseStyles} 
    ${isIconOnly ? iconSizeStyles[size] : sizeStyles[size]} 
    ${variantStyles[variant]} 
    ${className}
  `;

  return (
    <button className={combinedClassName} disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <Loader2 className="animate-spin h-5 w-5" />
      ) : (
        <>
          {leftIcon && <span className={children ? "mr-2" : ""}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={children ? "ml-2" : ""}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
