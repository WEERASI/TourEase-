
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const SkeletonBase: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);

export const TourCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-[var(--radius-xl)] border border-slate-100 overflow-hidden h-full">
    <SkeletonBase className="h-56 w-full" />
    <div className="p-5 space-y-4">
      <div className="flex justify-between items-center">
        <SkeletonBase className="h-4 w-20 rounded" />
        <SkeletonBase className="h-4 w-12 rounded" />
      </div>
      <SkeletonBase className="h-6 w-3/4 rounded" />
      <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBase className="h-6 w-24 rounded" />
          <SkeletonBase className="h-3 w-16 rounded" />
        </div>
        <SkeletonBase className="h-10 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

export const ListItemSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100">
    <SkeletonBase className="w-12 h-12 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <SkeletonBase className="h-4 w-1/3 rounded" />
      <SkeletonBase className="h-3 w-1/2 rounded" />
    </div>
    <SkeletonBase className="h-8 w-20 rounded-lg" />
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <tr className="border-b border-slate-50">
    <td className="px-8 py-5">
      <div className="flex items-center gap-3">
        <SkeletonBase className="w-10 h-10 rounded-lg" />
        <SkeletonBase className="h-4 w-32 rounded" />
      </div>
    </td>
    <td className="px-8 py-5"><SkeletonBase className="h-4 w-20 rounded" /></td>
    <td className="px-8 py-5"><SkeletonBase className="h-6 w-16 rounded-full" /></td>
    <td className="px-8 py-5"><SkeletonBase className="h-4 w-24 rounded" /></td>
    <td className="px-8 py-5"><SkeletonBase className="h-8 w-8 rounded-lg ml-auto" /></td>
  </tr>
);
