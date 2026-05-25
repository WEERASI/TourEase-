
import React, { useState, useCallback } from 'react';
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import HotelsPage from './pages/HotelsPage';
import TransportationPage from './pages/TransportationPage';
import DashboardPage from './pages/DashboardPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import AccountStatusPage from './pages/AccountStatusPage';
import StatesPreviewPage from './pages/StatesPreviewPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';
import ForgotPasswordFlow from './pages/ForgotPasswordFlow';
import DesignSystemPreview from './pages/DesignSystemPreview';
import RoleSelectionPage from './pages/RoleSelectionPage';
import ItinerariesPage from './pages/ItinerariesPage';
import ItineraryDetailPage from './pages/ItineraryDetailPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Operator Dashboard imports
import OperatorLayout from './layouts/OperatorLayout';
import OperatorDashboard from './pages/operator/OperatorDashboard';
import OperatorTours from './pages/operator/OperatorTours';
import OperatorTourForm from './pages/operator/OperatorTourForm';
import OperatorBookings from './pages/operator/OperatorBookings';
import OperatorReviews from './pages/operator/OperatorReviews';
import OperatorProfile from './pages/operator/OperatorProfile';
import OperatorFinances from './pages/operator/OperatorFinances';
import OperatorAnalytics from './pages/operator/OperatorAnalytics';

// Admin Dashboard imports
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOperators from './pages/admin/AdminOperators';
import AdminTours from './pages/admin/AdminTours';
import AdminHotels from './pages/admin/AdminHotels';
import AdminDestinations from './pages/admin/AdminDestinations';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

import { Menu, Home as HomeIcon, Compass, LogIn, UserPlus, MapPin, Briefcase, LayoutDashboard, Settings, Hotel, Car, BookOpen } from 'lucide-react';
import { Itinerary } from './types/itinerary';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'tourist' | 'operator' | 'hotel' | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [selectedTourId, setSelectedTourId] = useState<string | number | null>(null);

  // Auth state — reads from localStorage and re-reads when login/logout happens
  const [loggedInUser, setLoggedInUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });


  const handleAuthChange = useCallback(() => {
    try {
      const stored = localStorage.getItem('user');
      setLoggedInUser(stored ? JSON.parse(stored) : null);
    } catch { setLoggedInUser(null); }
  }, []);

  const handleNavigateToRegister = (role: 'tourist' | 'operator' | 'hotel') => {
    setSelectedRole(role);
    setCurrentPage('register');
  };

  const handleExploreDestination = (destination: any) => {
    setSelectedDestination(destination);
    setCurrentPage('destination-detail');
  };

  const handleViewItinerary = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary);
    setCurrentPage('itinerary-detail');
  };

  // Check if current page is an operator or admin page
  const isOperatorPage = currentPage.startsWith('operator-');
  const isAdminPage = currentPage.startsWith('admin-');

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'destinations': return <DestinationsPage onExplore={handleExploreDestination} />;
      case 'destination-detail': return <DestinationDetailPage destination={selectedDestination} onNavigate={setCurrentPage} />;
      case 'tours': return <ToursPage onNavigateDetail={(id) => { setSelectedTourId(id); setCurrentPage('tour-detail'); }} />;
      case 'tour-detail': return <TourDetailPage tourId={selectedTourId} onNavigate={setCurrentPage} />;
      case 'hotels': return <HotelsPage onNavigate={setCurrentPage} />;
      case 'transportation': return <TransportationPage />;
      case 'itineraries': return <ItinerariesPage onViewDetails={handleViewItinerary} onNavigate={setCurrentPage} />;
      case 'itinerary-detail': return <ItineraryDetailPage itinerary={selectedItinerary} onBack={() => setCurrentPage('itineraries')} onNavigate={setCurrentPage} />;
      case 'profile-settings': return <ProfileSettingsPage onNavigate={setCurrentPage} userRole={selectedRole || 'operator'} />;
      case 'account-status': return <AccountStatusPage onNavigate={setCurrentPage} />;
      case 'states-preview': return <StatesPreviewPage />;
      case 'login': return <LoginPage onNavigate={setCurrentPage} onAuthChange={handleAuthChange} />;
      case 'role-selection': return <RoleSelectionPage onNavigate={setCurrentPage} onSelectRole={handleNavigateToRegister} />;
      case 'register': return <RegisterPage onNavigate={setCurrentPage} initialRole={selectedRole || 'tourist'} onAuthChange={handleAuthChange} />;
      case 'verify': return <VerificationPage onNavigate={setCurrentPage} />;
      case 'forgot-password': return <ForgotPasswordFlow onNavigate={setCurrentPage} />;
      case 'design-system': return <DesignSystemPreview />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  // Render operator pages inside OperatorLayout
  const renderOperatorPage = () => {
    switch (currentPage) {
      case 'operator-dashboard': return <OperatorDashboard onNavigate={setCurrentPage} />;
      case 'operator-tours': return <OperatorTours onNavigate={setCurrentPage} />;
      case 'operator-tour-create': return <OperatorTourForm onNavigate={setCurrentPage} />;
      case 'operator-bookings': return <OperatorBookings onNavigate={setCurrentPage} />;
      case 'operator-reviews': return <OperatorReviews onNavigate={setCurrentPage} />;
      case 'operator-profile': return <OperatorProfile onNavigate={setCurrentPage} />;
      case 'operator-finances': return <OperatorFinances onNavigate={setCurrentPage} />;
      case 'operator-analytics': return <OperatorAnalytics onNavigate={setCurrentPage} />;
      default: return <OperatorDashboard onNavigate={setCurrentPage} />;
    }
  };

  // Render admin pages inside AdminLayout
  const renderAdminPage = () => {
    switch (currentPage) {
      case 'admin-dashboard': return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'admin-users': return <AdminUsers onNavigate={setCurrentPage} />;
      case 'admin-operators': return <AdminOperators onNavigate={setCurrentPage} />;
      case 'admin-tours': return <AdminTours onNavigate={setCurrentPage} />;
      case 'admin-hotels': return <AdminHotels onNavigate={setCurrentPage} />;
      case 'admin-destinations': return <AdminDestinations onNavigate={setCurrentPage} />;
      case 'admin-bookings': return <AdminBookings onNavigate={setCurrentPage} />;
      case 'admin-reviews': return <AdminReviews onNavigate={setCurrentPage} />;
      case 'admin-analytics': return <AdminAnalytics onNavigate={setCurrentPage} />;
      case 'admin-settings': return <AdminSettings onNavigate={setCurrentPage} />;
      default: return <AdminDashboard onNavigate={setCurrentPage} />;
    }
  };

  // If on an operator page, render the operator layout
  if (isOperatorPage) {
    return (
      <OperatorLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={loggedInUser}
        onAuthChange={handleAuthChange}
      >
        {renderOperatorPage()}
      </OperatorLayout>
    );
  }

  // If on an admin page, render the admin layout
  if (isAdminPage) {
    const handleAdminLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      handleAuthChange();
      setCurrentPage('login');
    };
    return (
      <AdminLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={loggedInUser}
        onLogout={handleAdminLogout}
      >
        {renderAdminPage()}
      </AdminLayout>
    );
  }

  const isAuthPage = ['login', 'register', 'role-selection', 'verify', 'forgot-password', 'account-status'].includes(currentPage);
  const isDashboardView = ['profile-settings'].includes(currentPage);
  const showNavbar = !isAuthPage && !isDashboardView;

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-slate-50 ${isDashboardView ? 'overflow-hidden h-screen' : ''}`}>
      {/* Navigation Sidebar */}
      {showNavbar && (
        <aside className={`
          fixed md:relative inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-sm transition-transform duration-300 transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6">
            <div className="hidden md:flex items-center gap-3 mb-8" onClick={() => setCurrentPage('home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200 cursor-pointer">
                <Compass size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 cursor-pointer">TourEase</span>
            </div>

            <nav className="space-y-1">
              <NavItem icon={<HomeIcon size={20} />} label="Home" active={currentPage === 'home'} onClick={() => { setCurrentPage('home'); setIsSidebarOpen(false); }} />
              <NavItem icon={<MapPin size={20} />} label="Destinations" active={currentPage === 'destinations' || currentPage === 'destination-detail'} onClick={() => { setCurrentPage('destinations'); setIsSidebarOpen(false); }} />
              <NavItem icon={<Briefcase size={20} />} label="Tour Packages" active={currentPage === 'tours' || currentPage === 'tour-detail'} onClick={() => { setCurrentPage('tours'); setIsSidebarOpen(false); }} />
              <NavItem icon={<Hotel size={20} />} label="Hotels" active={currentPage === 'hotels'} onClick={() => { setCurrentPage('hotels'); setIsSidebarOpen(false); }} />
              <NavItem icon={<Car size={20} />} label="Transport" active={currentPage === 'transportation'} onClick={() => { setCurrentPage('transportation'); setIsSidebarOpen(false); }} />
              <NavItem icon={<BookOpen size={20} />} label="My Itineraries" active={currentPage === 'itineraries' || currentPage === 'itinerary-detail'} onClick={() => { setCurrentPage('itineraries'); setIsSidebarOpen(false); }} />

              <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Authentication</div>
              <NavItem icon={<LogIn size={20} />} label="Login" active={currentPage === 'login'} onClick={() => { setCurrentPage('login'); setIsSidebarOpen(false); }} />
              <NavItem icon={<UserPlus size={20} />} label="Sign Up" active={currentPage === 'role-selection' || currentPage === 'register'} onClick={() => { setCurrentPage('role-selection'); setIsSidebarOpen(false); }} />
            </nav>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {showNavbar && <Navbar onNavigate={setCurrentPage} user={loggedInUser} onAuthChange={handleAuthChange} />}
        <div className="flex-1">
          {renderPage()}
        </div>
        {showNavbar && <Footer onNavigate={setCurrentPage} />}
      </main>

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && showNavbar && (
        <div className="fixed inset-0 bg-slate-900/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void; }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${active ? 'bg-sky-50 text-sky-600 font-medium shadow-sm ring-1 ring-sky-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
