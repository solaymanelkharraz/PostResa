import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, User, BookOpen, Monitor, CalendarDays, Loader2, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/axios';

const DAYS = [
  { id: 0, label: "Lundi" },
  { id: 1, label: "Mardi" },
  { id: 2, label: "Mercredi" },
  { id: 3, label: "Jeudi" },
  { id: 4, label: "Vendredi" },
  { id: 5, label: "Samedi" }
];

const Schedule = () => {
  const [activeTab, setActiveTab] = useState(0);

  const { data: schedules = [], isLoading, error } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await api.get('/schedules');
      return res.data;
    }
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to fetch schedules');
    }
  }, [error]);

  const activeDayLabel = DAYS.find(d => d.id === activeTab).label;

  // Filter schedules for the active day
  const dailyClasses = useMemo(() => {
    if (!schedules) return [];
    return schedules
      .filter(s => s.day === activeDayLabel)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [schedules, activeDayLabel]);

  // Extract unique teachers from the user's overall schedule
  const myTeachers = useMemo(() => {
    if (!schedules) return [];
    const teachersMap = new Map();
    schedules.forEach(s => {
      if (s.teacher && !teachersMap.has(s.teacher.id)) {
        teachersMap.set(s.teacher.id, {
          ...s.teacher,
          subject: s.subject?.name
        });
      }
    });
    return Array.from(teachersMap.values());
  }, [schedules]);

  const formatTime = (timeStr) => {
    return timeStr ? timeStr.substring(0, 5) : '';
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'Cours': return 'border-purple-500';
      case 'Atelier': return 'border-emerald-500';
      case 'Pratique': return 'border-amber-500';
      default: return 'border-blue-500';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="pb-10 max-w-4xl mx-auto space-y-8">
      
      {/* --- Header --- */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <CalendarDays className="w-8 h-8 text-purple-500" /> Emploi du Temps
        </h1>
        <p className="text-sm text-slate-400">Consultez votre planning hebdomadaire dynamique.</p>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
        {/* --- Day Clicker (Tabs) --- */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-8 pb-2 border-b border-white/5">
          {DAYS.map((dayObj) => (
            <button
              key={dayObj.id}
              onClick={() => setActiveTab(dayObj.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === dayObj.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {dayObj.label}
            </button>
          ))}
        </div>

        {/* --- Dynamic Content Area --- */}
        <div className="min-h-[300px]">
          {isLoading ? (
             <div className="flex items-center justify-center h-48">
               <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
             </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-4">
                {dailyClasses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-white/5 rounded-2xl bg-black/20 text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4"><BookOpen className="w-5 h-5 text-slate-500" /></div>
                    <h3 className="text-white font-bold mb-1">Journée Libre</h3>
                    <p className="text-sm text-slate-500">Vous n'avez aucun cours programmé pour ce jour.</p>
                  </div>
                ) : (
                  dailyClasses.map((session, i) => (
                    <div key={session.id || i} className={`bg-black/40 border border-white/5 border-l-4 ${getBorderColor(session.type)} rounded-2xl p-6 hover:bg-black/60 transition-colors`}>
                      <div className="flex flex-col sm:flex-row justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="inline-block px-2.5 py-1 bg-white/5 rounded-md text-[10px] font-bold text-slate-300 uppercase tracking-wider">{session.type}</span>
                              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                session.modality === 'À distance' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {session.modality === 'À distance' ? <Monitor className="w-3 h-3" /> : <MapPin className="w-3 h-3" />} {session.modality}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{session.subject?.name || 'Inconnu'}</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                            <span className="flex items-center gap-2"><User className="w-4 h-4 text-slate-500" /> {session.teacher?.name || 'À définir'}</span>
                            <span className="flex items-center gap-2">
                              {session.modality === 'À distance' ? <Monitor className="w-4 h-4 text-blue-400" /> : <MapPin className="w-4 h-4 text-emerald-400" />}
                              <span className={session.modality === 'À distance' ? 'text-blue-400 font-medium' : ''}>{session.space?.name || 'Non assigné'}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6">
                          <div className="flex items-center gap-2 text-white font-bold text-lg">
                            <Clock className="w-5 h-5 text-purple-400" /> {formatTime(session.start_time)} - {formatTime(session.end_time)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* --- My Teachers Section --- */}
      {myTeachers.length > 0 && (
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-emerald-400" /> Mes Professeurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myTeachers.map((teacher) => (
              <div key={teacher.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold text-white border border-white/10">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{teacher.name}</h4>
                  <p className="text-xs text-slate-400">{teacher.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Schedule;