
import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  light?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '', light = false }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 
        className={`animate-spin ${sizeMap[size]} ${light ? 'text-white' : 'text-sky-500'}`} 
        strokeWidth={2.5}
      />
    </div>
  );
};

export default Spinner;
