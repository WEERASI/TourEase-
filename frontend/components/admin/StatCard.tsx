// components/admin/StatCard.tsx
// Reusable statistics card for the admin dashboard overview

import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
    trend?: { value: number; isPositive: boolean };
}

const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-500', text: 'text-blue-600' },
    green: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-600' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-500', text: 'text-orange-600' },
    red: { bg: 'bg-red-50', icon: 'bg-red-500', text: 'text-red-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-600' },
};

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, color = 'blue', trend }) => {
    const c = colorMap[color];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-sm font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                )}
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
    );
};

export default StatCard;
