import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, MapPin, Users, BookOpen, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedules } from '../store/slices/scheduleSlice';
import toast from 'react-hot-toast';

const DAYS = [
  { id: 0, label: "Lundi" },
  { id: 1, label: "Mardi" },
  { id: 2, label: "Mercredi" },
  { id: 3, label: "Jeudi" },
  { id: 4, label: "Vendredi" },
  { id: 5, label: "Samedi" }
];

const ProfSchedule = () => {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const { items: schedules, status, error } = useSelector((state) => state.schedules);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSchedules());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === 'failed' && error) {
      toast.error(error);
    }
  }, [status, error]);

  const activeDayLabel = DAYS.find(d => d.id === activeTab).label;

  const dailyClasses = useMemo(() => {
    if (!schedules) return [];
    return schedules
      .filter(s => s.day === activeDayLabel)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [schedules, activeDayLabel]);

  const formatTime = (timeStr) => {
    return timeStr ? timeStr.substring(0, 5) : '';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl">
      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <CalendarDays className="w-6 h-6 text-blue-400" /> Mon Emploi du Temps
        </h2>

        {/* Day Selector */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-8 pb-2 border-b border-white/5">
          {DAYS.map((dayObj) => (
            <button
              key={dayObj.id}
              onClick={() => setActiveTab(dayObj.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === dayObj.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {dayObj.label}
            </button>
          ))}
        </div>

        {/* Classes List */}
        <div className="space-y-4 min-h-[300px]">
          {status === 'loading' ? (
             <div className="flex items-center justify-center h-48">
               <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
             </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                {dailyClasses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-white/5 rounded-2xl bg-black/20 text-center">
                    <BookOpen className="w-10 h-10 text-slate-600 mb-3" />
                    <h3 className="text-white font-bold mb-1">Aucun cours</h3>
                    <p className="text-sm text-slate-500">Vous n'avez pas de cours programmé pour cette journée.</p>
                  </div>
                ) : (
                  dailyClasses.map((session) => (
                    <div key={session.id} className="bg-black/40 border border-white/5 border-l-4 border-l-blue-500 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-black/60 transition-colors">
                      <div className="space-y-3 flex-1">
                        <span className="inline-block px-2.5 py-1 bg-white/5 rounded-md text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                          {session.type} • {session.modality}
                        </span>
                        <h3 className="text-xl font-bold text-white">{session.subject?.name || 'Inconnu'}</h3>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                          <span className="flex items-center gap-2 text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-lg"><Users className="w-4 h-4" /> {session.group_name}</span>
                          <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> {session.space?.name || 'Non assigné'}</span>
                        </div>
                      </div>

                      <div className="flex items-center md:items-start md:border-l border-white/5 md:pl-6">
                        <div className="flex items-center gap-2 text-white font-bold text-lg bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 text-blue-400">
                          <Clock className="w-5 h-5" /> {formatTime(session.start_time)} - {formatTime(session.end_time)}
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
    </motion.div>
  );
};

export default ProfSchedule;