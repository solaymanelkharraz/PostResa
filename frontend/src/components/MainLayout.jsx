import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { 
  Home, 
  MessageSquare, 
  User, 
  Bell, 
  Search, 
  BookOpen,
  MessageCircle,
  Users,
    UserSquare2, ShieldAlert
} from 'lucide-react';

const MainLayout = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  
  const { data: schedules } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => (await api.get('/schedules')).data
  });

  const [classmates, setClassmates] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Prefetch data in background
  useEffect(() => {
    // Prefetch Messages Contacts
    queryClient.prefetchQuery({
      queryKey: ['contacts', ''],
      queryFn: async () => {
        const res = await api.get('/messages/contacts');
        return res.data.filter(u => u.id !== user?.id);
      },
      staleTime: 1000 * 60 * 5
    });

    if (user?.role === 'stagiaire') {
      // Prefetch Classmates
      queryClient.prefetchQuery({
        queryKey: ['classmates', user.group],
        queryFn: async () => {
          const res = await api.get(`/users?group=${user.group}`);
          return res.data.filter(u => u.id !== user?.id);
        },
        staleTime: 1000 * 60 * 5
      });
    }

    if (['prof', 'admin', 'super_admin'].includes(user?.role)) {
      // Prefetch Staff Directory
      queryClient.prefetchQuery({
        queryKey: ['staff'],
        queryFn: async () => {
          const res = await api.get('/users?role=staff');
          return res.data;
        },
        staleTime: 1000 * 60 * 5
      });
    }
  }, [user, queryClient]);

  useEffect(() => {
    if (user?.role === 'stagiaire' && user?.group) {
      api.get(`/users?group=${user.group}`).then(res => {
        // filter out the current user and get top 4
        setClassmates(res.data.filter(u => u.id !== user.id).slice(0, 4));
      }).catch(err => console.error(err));
    }
  }, [user]);

  // Extract unique teachers dynamically
  const myTeachers = useMemo(() => {
    if (!schedules) return [];
    const teachersMap = new Map();
    schedules.forEach(s => {
      if (s.teacher && !teachersMap.has(s.teacher.id)) {
        teachersMap.set(s.teacher.id, {
          ...s.teacher,
          subject: s.subject?.name,
          isOnline: Math.random() > 0.5 // Mock online status
        });
      }
    });
    return Array.from(teachersMap.values());
  }, [schedules]);

  const mySubjects = useMemo(() => {
    if (!schedules) return [];
    const subjectsMap = new Map();
    schedules.forEach(s => {
      if (s.subject && !subjectsMap.has(s.subject.id)) {
        subjectsMap.set(s.subject.id, s.subject);
      }
    });
    return Array.from(subjectsMap.values());
  }, [schedules]);

  const myGroups = useMemo(() => {
    if (!schedules) return [];
    const groupsSet = new Set();
    schedules.forEach(s => {
      if (s.group_name) groupsSet.add(s.group_name);
    });
    return Array.from(groupsSet);
  }, [schedules]);

  const navItems = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Campus Feed' },
    { path: '/dashboard/schedule', icon: <BookOpen size={20} />, label: 'Emploi du Temps' },
    { path: '/dashboard/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    ...(user?.role === 'stagiaire' ? [
      { path: '/dashboard/group', icon: <Users size={20} />, label: 'Mon Groupe' },
      { path: '/dashboard/teachers', icon: <UserSquare2 size={20} />, label: 'Mes Cours' }
    ] : []),
    ...(user?.role === 'prof' || user?.role === 'admin' || user?.role === 'super_admin' ? [{ path: '/dashboard/directory', icon: <Users size={20} />, label: 'Annuaire' }] : []),
    ...(user?.role === 'admin' ? [{ path: '/admin', icon: <ShieldAlert size={20} />, label: 'Administration' }] : []),
    ...(user?.role === 'super_admin' ? [{ path: '/superadmin', icon: <ShieldAlert size={20} />, label: 'Super Administration' }] : []),
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
              <input type="text" placeholder="Rechercher dans l'établissement..." className="w-full bg-black/50 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white" />
            </div>
          </div>

                      <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {/* <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span> */}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-white text-sm">Notifications</h3>
                      <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-white text-xs">Fermer</button>
                    </div>
                    <div className="p-6 text-center text-slate-400">
                      <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">Aucune nouvelle notification.</p>
                    </div>
                  </div>
                )}
              </div>
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
        </aside>

        {/* --- Center Column (Dynamic Pages load here) --- */}
        <main className="w-full max-w-xl lg:ml-64 lg:mr-80 min-h-[500px]">
          <Outlet /> 
        </main>

        {/* --- Right Sidebar (Widgets) --- */}
        <aside className="w-80 hidden xl:block fixed right-[max(0px,calc(50%-640px))] top-24 h-[calc(100vh-6rem)] space-y-6 overflow-y-auto pb-10 scrollbar-hide">
            
            {/* Widget 1: My Instructors (Stagiaire Only) */}
            {user?.role === 'stagiaire' && (
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-300">Mes Professeurs</h3>
                  <Link to="/dashboard/teachers" className="text-xs text-purple-400 hover:text-purple-300">Voir tout</Link>
                </div>
                <div className="space-y-4">
                {myTeachers.length > 0 ? myTeachers.slice(0, 3).map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className={`relative w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-inner`}>
                        {teacher.name.charAt(0)}
                        {teacher.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" title="En ligne"></span>}
                        </div>
                        <div>
                        <p className="text-sm font-medium text-slate-200 group-hover:text-purple-400 transition-colors cursor-pointer">{teacher.name}</p>
                        <p className="text-[11px] text-slate-500">{teacher.subject}</p>
                        </div>
                    </div>
                    <Link to="/dashboard/messages" state={{ activeChat: teacher }} className="p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors" title="Message"><MessageCircle className="w-4 h-4" /></Link>
                    </div>
                )) : (
                   <p className="text-xs text-slate-500">Aucun professeur trouvé pour votre groupe.</p>
                )}
                </div>
            </div>
            )}

            {/* Widget 2: My Subjects (Stagiaire & Prof) */}
            {(user?.role === 'stagiaire' || user?.role === 'prof') && (
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-300">Mes Modules</h3>
                    {user?.role === 'stagiaire' && (
                      <Link to="/dashboard/teachers" className="text-xs text-purple-400 hover:text-purple-300">Voir tout</Link>
                    )}
                  </div>
                <div className="space-y-3">
                {mySubjects.length > 0 ? mySubjects.slice(0, 3).map((subject) => (
                    <div key={subject.id} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{subject.name}</p>
                    </div>
                )) : (
                   <p className="text-xs text-slate-500">Aucun module trouvé pour votre groupe.</p>
                )}
                </div>
            </div>
            )}

            {/* Widget 3: Ma Classe (Stagiaire Only) */}
            {user?.role === 'stagiaire' && (
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-300">Ma Classe: <span className="text-emerald-400">{user.group}</span></h3>
                  <Link to="/dashboard/group" className="text-xs text-emerald-400 hover:text-emerald-300">Voir tout</Link>
                </div>
                <div className="space-y-4">
                {classmates.length > 0 ? classmates.map((classmate) => (
                    <div key={classmate.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className={`relative w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 flex items-center justify-center text-xs font-bold shadow-inner`}>
                        {classmate.name.charAt(0).toUpperCase()}
                        {classmate.is_online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" title="En ligne"></span>}
                        </div>
                        <div>
                        <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors cursor-pointer">{classmate.name}</p>
                        <p className="text-[11px] text-slate-500">Stagiaire</p>
                        </div>
                    </div>
                    <Link to="/dashboard/messages" state={{ activeChat: classmate }} className="p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors" title="Message"><MessageCircle className="w-4 h-4" /></Link>
                    </div>
                )) : (
                   <p className="text-xs text-slate-500">Aucun camarade trouvé.</p>
                )}
                </div>
            </div>
            )}

            {/* Widget 4: My Groups (Prof Only) */}
            {user?.role === 'prof' && (
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-300">Mes Groupes</h3>
                </div>
                <div className="space-y-3">
                {myGroups.length > 0 ? myGroups.map((group) => (
                    <div key={group} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20 group-hover:bg-pink-500/20 transition-colors">
                            <Users className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{group}</p>
                    </div>
                )) : (
                   <p className="text-xs text-slate-500">Aucun groupe assigné.</p>
                )}
                </div>
            </div>
            )}

            <div className="text-xs text-slate-600 px-2 pb-4 text-center mt-10">
                <p>© 2026 PostResa Platform</p>
            </div>
        </aside>

      </div>
    </div>
  );
};

export default MainLayout;