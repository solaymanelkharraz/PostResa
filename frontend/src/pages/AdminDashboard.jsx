import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, MessageSquare, Users, Box, CalendarClock, FileText, 
  Activity, Settings, Search, Check, X, ShieldAlert, Clock, Loader2, Home, LogOut, BookOpen
, Layers} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// --- Page Imports ---
import AdminSpaces from './AdminSpaces';
import AdminSchedule from './AdminSchedule';
import AdminUsers from './AdminUsers';
import AdminPosts from './AdminPosts';
import AdminLogs from './AdminLogs';
import AdminSettings from './AdminSettings';
import AdminSubjects from './AdminSubjects';
import AdminGroups from './AdminGroups';
import AdminSupport from './AdminSupport';

// --- Sub-components Imports ---
import StatCard from '../components/admin/StatCard';
import PendingPostsList from '../components/admin/PendingPostsList';
import ActivityLog from '../components/admin/ActivityLog';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data,
    enabled: activeTab === 'dashboard'
  });

  useEffect(() => {
    if (error?.response?.status === 401) {
      window.location.href = '/auth';
    }
  }, [error]);

  useEffect(() => {
    queryClient.prefetchQuery({ queryKey: ['adminStats'], queryFn: async () => (await api.get('/dashboard/stats')).data });
    queryClient.prefetchQuery({ queryKey: ['schoolUsers'], queryFn: async () => (await api.get('/school/users')).data });
    queryClient.prefetchQuery({ queryKey: ['spaces'], queryFn: async () => (await api.get('/spaces')).data });
    queryClient.prefetchQuery({ queryKey: ['schedules'], queryFn: async () => (await api.get('/schedules')).data });
    queryClient.prefetchQuery({ queryKey: ['admin_posts'], queryFn: async () => (await api.get('/posts?admin=1')).data });
    queryClient.prefetchQuery({ queryKey: ['groups'], queryFn: async () => (await api.get('/groups')).data });
    queryClient.prefetchQuery({ queryKey: ['subjects'], queryFn: async () => (await api.get('/subjects')).data });
    queryClient.prefetchQuery({ queryKey: ['logs'], queryFn: async () => (await api.get('/dashboard/logs')).data });
  }, [queryClient]);

  const stats = dashboardData ? [
    { label: "Total Users", value: dashboardData.stats.total_users, change: "Active", icon: <Users className="w-5 h-5 text-indigo-400" />, color: "bg-indigo-500/10 border-indigo-500/20" },
    { label: "Pending Requests", value: dashboardData.stats.pending_requests, change: "Requires Attention", icon: <CalendarClock className="w-5 h-5 text-amber-400" />, color: "bg-amber-500/10 border-amber-500/20" },
    { label: "Active Spaces", value: `${dashboardData.stats.active_spaces}/${dashboardData.stats.total_spaces}`, change: "Available", icon: <Box className="w-5 h-5 text-emerald-400" />, color: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "System Load", value: "Low", change: "stable", icon: <Activity className="w-5 h-5 text-rose-400" />, color: "bg-rose-500/10 border-rose-500/20" },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white flex">
      
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-slate-950 border-r border-white/5 flex-shrink-0 fixed h-full z-20 hidden lg:block overflow-y-auto pb-6 custom-scrollbar">
        <div className="p-6 flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white text-lg">P</div>
          <span className="text-xl font-bold text-white tracking-tight">PostResa</span>
        </div>

        <div className="px-3 space-y-1">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Management</p>
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Users />} label="Users & Roles" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <SidebarItem icon={<MessageSquare />} label="Messages" onClick={() => navigate('/dashboard/messages')} />
          <SidebarItem icon={<BookOpen />} label="Subjects" active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} />
          <SidebarItem icon={<Layers />} label="Groups" active={activeTab === 'groups'} onClick={() => setActiveTab('groups')} />
          <SidebarItem icon={<Box />} label="Spaces & Resources" active={activeTab === 'spaces'} onClick={() => setActiveTab('spaces')} />
          <SidebarItem icon={<CalendarClock />} label="Fixed Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
          
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-8">Validation</p>
          <SidebarItem icon={<FileText />} label="Post Approvals" active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} />

          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-8">System</p>
          <SidebarItem icon={<ShieldAlert />} label="Support Technique" active={activeTab === 'support'} onClick={() => setActiveTab('support')} />
            <SidebarItem icon={<Activity />} label="Activity Logs" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
          <SidebarItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />

          <div className="mt-8 border-t border-white/10 pt-6">
             <SidebarItem icon={<Home />} label="Campus Feed" onClick={() => navigate('/dashboard')} />
             <SidebarItem 
               icon={<LogOut className="text-rose-400" />} 
               label={<span className="text-rose-400">Déconnexion</span>} 
               onClick={() => {
                 localStorage.removeItem('token');
                 window.location.href = '/auth';
               }} 
             />
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto h-screen">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {activeTab === 'dashboard' && 'Admin Overview'}
              {activeTab === 'spaces' && 'Spaces & Resources'}
              {activeTab === 'schedule' && 'Fixed Schedule'}
              {activeTab === 'users' && 'Users & Roles'}
              {activeTab === 'subjects' && 'Subjects'}
              {activeTab === 'groups' && 'Groups'}
              {activeTab === 'posts' && 'Post Moderation'}
              {activeTab === 'logs' && 'System Logs'}
              {activeTab === 'settings' && 'Platform Settings'}
            </h1>
            <p className="text-slate-400 text-sm">Espace d'Administration</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:block relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Search logs or users..." className="bg-slate-900 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-white" />
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-white text-sm border border-white/20 shadow-lg shadow-emerald-900/20 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.location.href = '/dashboard/profile'}>
                AD
             </div>
          </div>
        </header>

        {/* --- ROUTER RENDERING --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Component Injection */}
            {activeTab === 'dashboard' && (
              isLoading ? (
                <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                      <StatCard key={index} stat={stat} />
                    ))}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Validation Queue */}
                    <div className="xl:col-span-2 space-y-8">
                      {/* Posts */}
                      <PendingPostsList posts={dashboardData?.pending_posts || []} />
                    </div>

                    {/* Quick Actions & Logs */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-6">
                        <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                          <button onClick={() => setActiveTab('spaces')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-900/20">
                            <Box className="w-5 h-5" /> <span className="font-medium text-sm">Add New Space</span>
                          </button>
                          <button onClick={() => setActiveTab('users')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all border border-white/5">
                            <Users className="w-5 h-5" /> <span className="font-medium text-sm">Manage Users</span>
                          </button>
                        </div>
                      </div>

                      <ActivityLog 
                        logs={dashboardData?.recent_activity || []} 
                        onViewFullLog={() => setActiveTab('logs')} 
                      />
                    </div>
                  </div>
                </>
              )
            )}

            {/* Injected Pages */}
            {activeTab === 'spaces' && <AdminSpaces />}
            {activeTab === 'schedule' && <AdminSchedule />}
            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'subjects' && <AdminSubjects />}
            {activeTab === 'groups' && <AdminGroups />}
            {activeTab === 'posts' && <AdminPosts />}
            {activeTab === 'support' && <AdminSupport />}
            {activeTab === 'logs' && <AdminLogs />}
            {activeTab === 'settings' && <AdminSettings />}
            
          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, badge = null, alert = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 font-medium' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {React.cloneElement(icon, { size: 18 })}
    <span className="text-sm flex-1 text-left">{label}</span>
    {badge && (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        alert ? 'bg-rose-500 text-white' : 'bg-indigo-400/20 text-indigo-300'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

export default AdminDashboard;