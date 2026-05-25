// layouts/AdminLayout.tsx
// Wrapper layout for all admin pages — includes sidebar + navbar

import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';

interface AdminLayoutProps {
    children: React.ReactNode;
    currentPage: string;
    onNavigate: (page: string) => void;
    user: any;
    onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage, onNavigate, user, onLogout }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <AdminSidebar
                currentPage={currentPage}
                onNavigate={onNavigate}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isMobileOpen={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
                onLogout={onLogout}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top navbar */}
                <AdminNavbar
                    onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
                    user={user}
                    onNavigate={onNavigate}
                    onLogout={onLogout}
                />

                {/* Scrollable page content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
