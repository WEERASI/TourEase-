import React, { useState, useCallback } from 'react';
import OperatorSidebar from '../components/operator/OperatorSidebar';
import OperatorNavbar from '../components/operator/OperatorNavbar';

interface OperatorLayoutProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    children: React.ReactNode;
    user: any;
    onAuthChange: () => void;
}

const OperatorLayout: React.FC<OperatorLayoutProps> = ({
    currentPage, onNavigate, children, user, onAuthChange,
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        onAuthChange();
        onNavigate('login');
    }, [onNavigate, onAuthChange]);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <OperatorSidebar
                currentPage={currentPage}
                onNavigate={onNavigate}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onLogout={handleLogout}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <OperatorNavbar
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    user={user}
                    onNavigate={onNavigate}
                />

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default OperatorLayout;
