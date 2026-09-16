import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Box, 
  CalendarClock, 
  FileText, 
  Activity, 
  Settings, 
  Bell, 
  Search, 
  Check, 
  X, 
  MoreVertical,
  ArrowUpRight,
  ShieldAlert,
  Clock
} from 'lucide-react';

// --- Mock Data ---

const STATS = [
  { label: "Total Users", value: "1,240", change: "+12%", icon: <Users className="w-5 h-5 text-indigo-400" />, color: "bg-indigo-500/10 border-indigo-500/20" },
  { label: "Pending Requests", value: "18", change: "+5", icon: <CalendarClock className="w-5 h-5 text-amber-400" />, color: "bg-amber-500/10 border-amber-500/20" },
  { label: "Active Spaces", value: "24/30", change: "80%", icon: <Box className="w-5 h-5 text-emerald-400" />, color: "bg-emerald-500/10 border-emerald-500/20" },
  { label: "System Load", value: "Low", change: "stable", icon: <Activity className="w-5 h-5 text-rose-400" />, color: "bg-rose-500/10 border-rose-500/20" },
];

const PENDING_RESERVATIONS = [
  { id: 1, user: "Mme. Bennani", role: "Prof", room: "Salle Conférence", time: "14:00 - 16:00", date: "Today", purpose: "Reunion Pédagogique" },
  { id: 2, user: "Club IT", role: "Student Org", room: "Amphithéâtre", time: "10:00 - 12:00", date: "Tomorrow", purpose: "Workshop React" },
  { id: 3, user: "M. Tazi", role: "Prof", room: "Atelier 3", time: "08:30 - 10:30", date: "Nov 24", purpose: "Exam Rattrapage" },
];

const PENDING_POSTS = [
  { id: 1, user: "Bureau des Stagiaires", content: "Soirée d'intégration next Friday! Tickets available...", type: "Event" },
  { id: 2, user: "Ahmed (DDI 202)", content: "Lost charger in Salle 4. Please DM if found.", type: "Announcement" },
];

const ACTIVITY_LOGS = [
  { id: 1, action: "User Created", detail: "New student account (S. Elkharraz)", time: "2 min ago" },
  { id: 2, action: "Reservation Auto-Blocked", detail: "Conflict detected in Salle 2", time: "15 min ago" },
  { id: 3, action: "Schedule Updated", detail: "Fixed slots for Group 101 added", time: "1 hour ago" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white flex">
      
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-slate-950 border-r border-white/5 flex-shrink-0 fixed h-full z-20 hidden lg:block">
        <div className="p-6 flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white text-lg">P</div>
          <span className="text-xl font-bold text-white tracking-tight">PostResa</span>
        </div>

        <div className="px-3 space-y-1">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Management</p>
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active />
          <SidebarItem icon={<Users />} label="Users & Roles" badge="New" />
          <SidebarItem icon={<Box />} label="Spaces & Resources" />
          <SidebarItem icon={<CalendarClock />} label="Fixed Schedule" />
          
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-8">Validation</p>
          <SidebarItem icon={<Check />} label="Reservations" badge="3" alert />
          <SidebarItem icon={<FileText />} label="Post Approvals" badge="2" alert />

          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-8">System</p>
          <SidebarItem icon={<Activity />} label="Activity Logs" />
          <SidebarItem icon={<Settings />} label="Settings" />
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Overview</h1>
            <p className="text-slate-400 text-sm">School: OFPPT Tangier • Semester 1</p>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Search */}
             <div className="hidden md:block relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Search logs or users..." className="bg-slate-900 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500" />
             </div>
             {/* Profile */}
             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-white text-sm border border-white/20 shadow-lg shadow-emerald-900/20">
                AD
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, index) => (
            <div key={index} className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 backdrop-blur-sm hover:bg-slate-900 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Split View: Validations & Logs */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Column 1: Validation Queue (2/3 width) */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Reservation Requests */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Pending Reservations
                </h3>
                <button className="text-xs text-indigo-400 hover:text-white transition-colors">View All</button>
              </div>
              
              <div className="divide-y divide-white/5">
                {PENDING_RESERVATIONS.map((req) => (
                  <div key={req.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-sm">
                          {req.user.charAt(0)}
                       </div>
                       <div>
                          <h4 className="font-medium text-white">{req.room} <span className="text-slate-500 font-normal">for</span> {req.purpose}</h4>
                          <p className="text-sm text-slate-400">{req.user} • {req.date}, {req.time}</p>
                          {req.role === 'Student Org' && <span className="inline-block mt-1 text-[10px] bg-indigo-500/20 text-indigo-300 px-2 rounded border border-indigo-500/20">Student Org</span>}
                       </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-sm font-medium hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
                        <X className="w-4 h-4" /> Refuse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post Approvals */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Post Moderation
                </h3>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">2 Pending</span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {PENDING_POSTS.map((post) => (
                  <div key={post.id} className="bg-slate-950 border border-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-500">{post.type.toUpperCase()}</span>
                      <span className="text-xs text-slate-400">{post.user}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-4 line-clamp-2">"{post.content}"</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-emerald-500/10 text-emerald-400 rounded text-xs font-bold hover:bg-emerald-500 hover:text-white transition-colors">Publish</button>
                      <button className="flex-1 py-1.5 bg-rose-500/10 text-rose-400 rounded text-xs font-bold hover:bg-rose-500 hover:text-white transition-colors">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column 2: Status & Logs (1/3 width) */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-6">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-900/20">
                  <Box className="w-5 h-5" />
                  <span className="font-medium text-sm">Add New Space</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all border border-white/5">
                  <Users className="w-5 h-5" />
                  <span className="font-medium text-sm">Manage Users</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all border border-white/5">
                  <ShieldAlert className="w-5 h-5" />
                  <span className="font-medium text-sm">Emergency Block</span>
                </button>
              </div>
            </div>

            {/* Live Logs */}
            <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                Live Log
              </h3>
              <div className="space-y-6 relative">
                 {/* Timeline Line */}
                 <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-white/5"></div>
                 
                 {ACTIVITY_LOGS.map((log) => (
                   <div key={log.id} className="relative pl-8">
                     <div className="absolute left-0 top-1 w-4 h-4 bg-slate-900 border-2 border-slate-600 rounded-full z-10"></div>
                     <p className="text-sm font-bold text-slate-300">{log.action}</p>
                     <p className="text-xs text-slate-500 mb-1">{log.detail}</p>
                     <p className="text-[10px] text-indigo-400">{log.time}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-2 text-xs text-slate-500 hover:text-white border-t border-white/5">
                View Full System Log
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, active = false, badge = null, alert = false }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
    active 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 font-medium' 
      : 'text-slate-400 hover:text-white hover:bg-white/5'
  }`}>
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