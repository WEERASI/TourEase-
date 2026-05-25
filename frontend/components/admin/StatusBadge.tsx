// components/admin/StatusBadge.tsx
// Colored badge component for displaying status labels

import React from 'react';

type BadgeVariant = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | 'confirmed' | 'cancelled' | 'completed' | 'default';

interface StatusBadgeProps {
    status: string;
    variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-500 border-slate-200',
    default: 'bg-slate-100 text-slate-600 border-slate-200',
};

// Auto-detect variant from status string
function detectVariant(status: string): BadgeVariant {
    const lower = status.toLowerCase();
    if (lower === 'pending') return 'pending';
    if (lower === 'approved' || lower === 'active') return 'active';
    if (lower === 'confirmed') return 'confirmed';
    if (lower === 'completed') return 'completed';
    if (lower === 'rejected' || lower === 'cancelled') return 'cancelled';
    if (lower === 'inactive') return 'inactive';
    return 'default';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
    const v = variant || detectVariant(status);
    const style = variantStyles[v];

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
