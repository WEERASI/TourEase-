
import React, { useState } from 'react';
import { 
  LayoutDashboard, Briefcase, Star, BarChart3, Settings, LogOut, 
  Menu, Bell, Search, User, TrendingUp, Calendar, ChevronRight,
  TrendingDown, MapPin, Clock, DollarSign, Package
} from 'lucide-react';
import Button from '../components/Button';

const DashboardPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* 1. Sidebar Navigation */}
      <aside 
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200 shrink-0">
              <BarChart3 size={24} />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl tracking-tight text-slate-900 truncate animate-in fade-in duration-300">
                TourEase <span className="text-[10px] text-sky-500 bg-sky-50 px-1.5 py-0.5 rounded ml-1">ADMIN</span>
              </span>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              active={activeMenu === 'Dashboard'} 
              isSidebarOpen={isSidebarOpen}
              onClick={() => setActiveMenu('Dashboard')}
            />
            <NavItem 
              icon={<Briefcase size={20} />} 
              label="My Tours" 
              active={activeMenu === 'My Tours'} 
              isSidebarOpen={isSidebarOpen}
              onClick={() => setActiveMenu('My Tours')}
            />
            <NavItem 
              icon={<Star size={20} />} 
              label="Reviews" 
              active={activeMenu === 'Reviews'} 
              isSidebarOpen={isSidebarOpen}
              onClick={() => setActiveMenu('Reviews')}
            />
            <NavItem 
              icon={<BarChart3 size={20} />} 
              label="Analytics" 
              active={activeMenu === 'Analytics'} 
              isSidebarOpen={isSidebarOpen}
              onClick={() => setActiveMenu('Analytics')}
            />
            <div className="pt-8 pb-2 px-3">
              <span className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest ${!isSidebarOpen && 'hidden'}`}>Account</span>
            </div>
            <NavItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={activeMenu === 'Settings'} 
              isSidebarOpen={isSidebarOpen}
              onClick={() => setActiveMenu('Settings')}
            />
          </nav>

          {/* User Section at Bottom */}
          <div className="p-4 border-t border-slate-100">
            <button className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all
              ${!isSidebarOpen && 'justify-center'}
            `}>
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg lg:block"
            >
              <Menu size={20} className="text-slate-500" />
            </button>
            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 w-72 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search data..." className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">Suraj Perera</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Elite Operator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-sky-100 border-2 border-white shadow-sm flex items-center justify-center text-sky-600 font-bold overflow-hidden group-hover:ring-2 group-hover:ring-sky-500 transition-all">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
          {/* Welcome Message */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Operator Dashboard</h1>
              <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening with your tours today.</p>
            </div>
            <Button variant="secondary" className="rounded-xl shadow-lg shadow-orange-500/20 px-6 py-2.5" leftIcon={<Calendar size={18} />}>
              Schedule New Tour
            </Button>
          </div>

          {/* 3. KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard 
              title="Total Bookings" 
              value="1,284" 
              trend="+12.5%" 
              trendType="up"
              icon={<Briefcase size={24} />} 
              color="bg-sky-500" 
            />
            <KPICard 
              title="Upcoming Trips" 
              value="42" 
              trend="+4" 
              trendType="up"
              icon={<Calendar size={24} />} 
              color="bg-emerald-500" 
            />
            <KPICard 
              title="Revenue (LKR)" 
              value="2.4M" 
              trend="-2.4%" 
              trendType="down"
              icon={<DollarSign size={24} />} 
              color="bg-orange-500" 
            />
            <KPICard 
              title="Avg. Rating" 
              value="4.85" 
              trend="+0.02" 
              trendType="up"
              icon={<Star size={24} />} 
              color="bg-amber-500" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 4. Chart Placeholder Area */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Booking Trends</h3>
                  <p className="text-sm text-slate-400">Monthly overview of reservations</p>
                </div>
                <select className="bg-slate-50 border-none rounded-lg text-sm font-bold text-slate-600 px-3 py-2 outline-none">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              
              {/* Simple CSS-based Mock Chart */}
              <div className="h-64 flex items-end justify-between gap-4 px-2">
                {[45, 60, 40, 85, 55, 75, 95].map((h, i) => (
                  <div key={i} className="flex-1 group relative">
                    <div 
                      className="w-full bg-sky-100 group-hover:bg-sky-500 rounded-t-lg transition-all duration-500 cursor-pointer relative"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h} Bookings
                      </div>
                    </div>
                    <div className="mt-4 text-[10px] font-bold text-slate-400 text-center uppercase">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Recent Activity */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                <button className="text-sky-600 text-xs font-bold hover:underline">View All</button>
              </div>
              <div className="space-y-6 flex-1">
                <ActivityItem 
                  icon={<User size={16} />} 
                  title="New booking from Maria G." 
                  time="2 mins ago" 
                  desc="Cultural Triangle Heritage Tour"
                  color="bg-sky-50 text-sky-500"
                />
                <ActivityItem 
                  icon={<Star size={16} />} 
                  title="New 5-star review" 
                  time="1 hour ago" 
                  desc="Aman P. left feedback on Sigiriya"
                  color="bg-amber-50 text-amber-500"
                />
                <ActivityItem 
                  icon={<DollarSign size={16} />} 
                  title="Payment Received" 
                  time="3 hours ago" 
                  desc="LKR 120,000 via Visa Card"
                  color="bg-emerald-50 text-emerald-500"
                />
                <ActivityItem 
                  icon={<Clock size={16} />} 
                  title="Trip Cancelled" 
                  time="5 hours ago" 
                  desc="James L. cancelled Ella train tour"
                  color="bg-red-50 text-red-500"
                />
              </div>
            </div>
          </div>

          {/* Table Area (Bottom) */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Top Performing Packages</h3>
              <Button variant="ghost" size="sm" className="rounded-xl">Report</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Package Name</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Popularity</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <TableRow name="Sigiriya Day Expedition" revenue="LKR 845k" status="Active" popularity={92} />
                  <TableRow name="Ella Scenic Train Journey" revenue="LKR 620k" status="Active" popularity={88} />
                  <TableRow name="Mirissa Whale Watching" revenue="LKR 540k" status="Paused" popularity={76} />
                  <TableRow name="Galle Fort Walking Tour" revenue="LKR 410k" status="Active" popularity={81} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  isSidebarOpen: boolean;
  onClick: () => void;
}> = ({ icon, label, active, isSidebarOpen, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200
      ${active 
        ? 'bg-sky-500 text-white shadow-lg shadow-sky-200 font-bold' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
      ${!isSidebarOpen && 'justify-center px-0'}
    `}
  >
    <span className="shrink-0">{icon}</span>
    {isSidebarOpen && <span className="text-sm tracking-tight">{label}</span>}
    {active && isSidebarOpen && <ChevronRight size={16} className="ml-auto" />}
  </button>
);

const KPICard: React.FC<{ 
  title: string; 
  value: string; 
  trend: string; 
  trendType: 'up' | 'down';
  icon: React.ReactNode; 
  color: string;
}> = ({ title, value, trend, trendType, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} text-white shadow-lg shadow-black/5`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
        trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
      }`}>
        {trendType === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {trend}
      </div>
    </div>
    <div>
      <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const ActivityItem: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  time: string; 
  desc: string;
  color: string;
}> = ({ icon, title, time, desc, color }) => (
  <div className="flex gap-4">
    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{time}</span>
      </div>
      <p className="text-xs text-slate-500 truncate">{desc}</p>
    </div>
  </div>
);

const TableRow: React.FC<{ 
  name: string; 
  revenue: string; 
  status: string; 
  popularity: number;
}> = ({ name, revenue, status, popularity }) => (
  <tr className="group hover:bg-slate-50 transition-colors">
    <td className="px-8 py-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
          <Package size={20} />
        </div>
        <span className="text-sm font-bold text-slate-900">{name}</span>
      </div>
    </td>
    <td className="px-8 py-5">
      <span className="text-sm font-black text-sky-600">{revenue}</span>
    </td>
    <td className="px-8 py-5">
      <span className={`
        text-[10px] font-bold px-2.5 py-1 rounded-full 
        ${status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}
      `}>
        {status}
      </span>
    </td>
    <td className="px-8 py-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
          <div className="h-full bg-sky-500" style={{ width: `${popularity}%` }} />
        </div>
        <span className="text-[10px] font-bold text-slate-500">{popularity}%</span>
      </div>
    </td>
    <td className="px-8 py-5 text-right">
      <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-white rounded-lg transition-all">
        <ChevronRight size={18} />
      </button>
    </td>
  </tr>
);

export default DashboardPage;
