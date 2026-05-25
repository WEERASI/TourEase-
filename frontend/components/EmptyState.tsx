
import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2rem] border border-dashed border-slate-200 animate-in fade-in zoom-in-95 duration-500 ${className}`}>
      <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <Button onClick={onAction} variant="ghost" className="rounded-full px-8">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
