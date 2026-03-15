import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar as CalendarIcon, 
  MapPin, 
  MessageSquare, 
  User, 
  Bell, 
  Search, 
  MessageCircle,
  Plus,
  CheckCircle,
  Clock,
  BookOpen
} from 'lucide-react';

// --- Static Data for Widgets ---
const ROOM_STATUS = [
  { name: "Salle Info 1", status: "Occupied", color: "text-rose-400" },
  { name: "Salle Info 2", status: "Free", color: "text-emerald-400" },
  { name: "Atelier Réseau", status: "Free", color: "text-emerald-400" },
];

const MY_TEACHERS = [
  { id: 1, name: "M. El Kharraz", subject: "Dev Digital", isOnline: true, avatar: "bg-purple-600" },
  { id: 2, name: "Mme. Bennani", subject: "Soft Skills", isOnline: false, avatar: "bg-emerald-500" },
  { id: 3, name: "M. Tazi", subject: "Back-end", isOnline: true, avatar: "bg-indigo-500" },
];

const UPCOMING_RESERVATIONS = [
  { id: 101, room: "Salle Info 1", time: "14:30", status: "Approved", date: "Aujourd'hui" },
  { id: 102, room: "Atelier Réseau", time: "08:30", status: "Pending", date: "Demain" },
];

const MainLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Campus Feed' },
    { path: '/dashboard/schedule', icon: <BookOpen size={20} />, label: 'Emploi du Temps' },
    { path: '/dashboard/reservations', icon: <CalendarIcon size={20} />, label: 'Mes Réservations' },
    { path: '/dashboard/spaces', icon: <MapPin size={20} />, label: 'Espaces & Salles' },
    { path: '/dashboard/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { path: '/dashboard/profile', icon: <User size={20} />, label: 'Mon Profil' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* --- Top Navigation Bar --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 h-16">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-indigo-400 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-purple-900/50">P</div>
            <span className="text-lg font-bold text-white tracking-tight hidden sm:block">PostResa</span>
          </Link>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input type="text" placeholder="Rechercher OFPPT Tangier..." className="w-full bg-black/50 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span>
            </button>
            <Link to="/dashboard/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-lg cursor-pointer hover:opacity-80 transition-opacity">
              SE
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Main Layout Grid --- */}
      <div className="container mx-auto px-4 pt-24 pb-10 flex gap-8 justify-center">
        
        {/* --- Left Sidebar (Navigation) --- */}
        <aside className="w-64 hidden lg:block fixed left-[max(0px,calc(50%-640px))] top-24 h-[calc(100vh-6rem)]">
          <div className="space-y-1">
            {navItems.map((item) => {
              // Highlight the active tab
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
              return (
                <Link key={item.path} to={item.path} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  {item.icon} <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions Button */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Actions Rapides</h3>
            <Link to="/dashboard/reservations" className="w-full mx-auto flex items-center gap-2 justify-center py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-900/20 group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Nouvelle Réservation</span>
            </Link>
          </div>
        </aside>

        {/* --- Center Column (Dynamic Pages load here) --- */}
        <main className="w-full max-w-xl lg:ml-64 lg:mr-80 min-h-[500px]">
          <Outlet /> 
        </main>

        {/* --- Right Sidebar (Widgets) --- */}
        <aside className="w-80 hidden xl:block fixed right-[max(0px,calc(50%-640px))] top-24 h-[calc(100vh-6rem)] space-y-6 overflow-y-auto pb-10 scrollbar-hide">
            
            {/* Widget 1: My Instructors */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-300">Mes Professeurs</h3>
                  <Link to="/dashboard/messages" className="text-xs text-purple-400 hover:text-purple-300">Voir tout</Link>
                </div>
                <div className="space-y-4">
                {MY_TEACHERS.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className={`relative w-9 h-9 rounded-full ${teacher.avatar} flex items-center justify-center text-xs font-bold text-white shadow-inner`}>
                        {teacher.name.charAt(0)}
                        {teacher.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" title="En ligne"></span>}
                        </div>
                        <div>
                        <p className="text-sm font-medium text-slate-200 group-hover:text-purple-400 transition-colors cursor-pointer">{teacher.name}</p>
                        <p className="text-[11px] text-slate-500">{teacher.subject}</p>
                        </div>
                    </div>
                    <Link to="/dashboard/messages" className="p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors" title="Message"><MessageCircle className="w-4 h-4" /></Link>
                    </div>
                ))}
                </div>
            </div>

            {/* Widget 2: Live Spaces Status */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
                <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                Espaces en Direct
                </h3>
                <div className="space-y-3">
                {ROOM_STATUS.map((room, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-400">{room.name}</span>
                    <span className={`font-bold ${room.color} text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-black/50 border border-white/5`}>{room.status}</span>
                    </div>
                ))}
                </div>
            </div>

            {/* Widget 3: Mini Reservations View */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-300">Mes Réservations</h3>
                <Link to="/dashboard/reservations" className="text-xs text-purple-400 hover:text-purple-300">Voir tout</Link>
                </div>
                
                <div className="space-y-3">
                {UPCOMING_RESERVATIONS.map((res) => (
                    <div key={res.id} className="p-3 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-white">{res.room}</span>
                        {res.status === 'Approved' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mb-2">
                        <CalendarIcon className="w-3 h-3 text-purple-400" /> {res.date} • {res.time}
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider ${
                        res.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                        {res.status}
                    </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="text-xs text-slate-600 px-2 pb-4 text-center">
                <p>© 2026 PostResa Platform</p>
            </div>

        </aside>

      </div>
    </div>
  );
};

export default MainLayout;