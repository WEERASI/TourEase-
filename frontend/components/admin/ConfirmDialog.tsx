// components/admin/ConfirmDialog.tsx
// Modal confirmation dialog for dangerous actions (delete, deactivate, etc.)

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    const btnColor = variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700';
    const iconColor = variant === 'danger' ? 'text-red-600 bg-red-100' : variant === 'warning' ? 'text-amber-600 bg-amber-100' : 'text-blue-600 bg-blue-100';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />

            {/* Dialog panel */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Close dialog"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`w-14 h-14 rounded-full ${iconColor} flex items-center justify-center mb-4`}>
                        <AlertTriangle size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{title}</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">{message}</p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-5 py-2.5 rounded-xl text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${btnColor}`}
                        >
                            {isLoading && (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
