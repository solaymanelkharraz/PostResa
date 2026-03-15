import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, User, BookOpen, Monitor, CalendarDays } from 'lucide-react';

// Updated data with "modality" (Présentiel / À distance)
const WEEKLY_SCHEDULE = [
  {
    id: 0,
    day: "Lundi",
    classes: [
      { time: "08:30 - 11:00", subject: "Développement Front-end", teacher: "M. El Kharraz", room: "Salle Info 1", type: "Cours", modality: "Présentiel", color: "border-purple-500" },
      { time: "11:30 - 13:30", subject: "Atelier UI/UX", teacher: "M. El Kharraz", room: "Salle Info 1", type: "Atelier", modality: "Présentiel", color: "border-purple-500" },
    ]
  },
  {
    id: 1,
    day: "Mardi",
    classes: [
      { time: "08:30 - 11:00", subject: "Soft Skills", teacher: "Mme. Bennani", room: "Microsoft Teams", type: "Cours", modality: "À distance", color: "border-emerald-500" },
      { time: "14:30 - 17:00", subject: "Bases de Données", teacher: "M. Tazi", room: "Salle Info 3", type: "Cours", modality: "Présentiel", color: "border-indigo-500" },
    ]
  },
  {
    id: 2,
    day: "Mercredi",
    classes: [
      { time: "08:30 - 13:30", subject: "Projet PFE", teacher: "M. Azeggouar", room: "Atelier Réseau", type: "Pratique", modality: "Présentiel", color: "border-amber-500" },
    ]
  },
  {
    id: 3,
    day: "Jeudi",
    classes: [] // Empty day
  },
  {
    id: 4,
    day: "Vendredi",
    classes: [
      { time: "08:30 - 11:00", subject: "Développement Back-end", teacher: "M. Tazi", room: "Google Meet", type: "Cours", modality: "À distance", color: "border-rose-500" },
    ]
  },
  {
    id: 5,
    day: "Samedi",
    classes: [
      { time: "09:00 - 12:00", subject: "Anglais Technique", teacher: "M. Alaoui", room: "Amphi A", type: "Cours", modality: "Présentiel", color: "border-blue-500" },
    ]
  }
];

const Schedule = () => {
  // State to track which day is currently clicked (defaults to 0 -> Lundi)
  const [activeTab, setActiveTab] = useState(0);

  // Find the data for the currently selected day
  const activeDayData = WEEKLY_SCHEDULE.find(day => day.id === activeTab);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="pb-10 max-w-4xl mx-auto"
    >
      {/* --- Header --- */}
      <div className="mb-8 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <CalendarDays className="w-8 h-8 text-purple-500" />
          Emploi du Temps
        </h1>
        <p className="text-sm text-slate-400">Consultez votre planning hebdomadaire.</p>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
        
        {/* --- Day Clicker (Tabs) --- */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2 border-b border-white/5">
          {WEEKLY_SCHEDULE.map((dayObj) => (
            <button
              key={dayObj.id}
              onClick={() => setActiveTab(dayObj.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === dayObj.id 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {dayObj.day}
            </button>
          ))}
        </div>

        {/* --- Dynamic Content Area --- */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab} // This key makes the animation run every time the tab changes
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              
              {activeDayData.classes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-white/5 rounded-2xl bg-black/20 text-center">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="text-white font-bold mb-1">Journée Libre</h3>
                  <p className="text-sm text-slate-500">Vous n'avez aucun cours programmé pour ce jour.</p>
                </div>
              ) : (
                activeDayData.classes.map((session, i) => (
                  <div key={i} className={`bg-black/40 border border-white/5 border-l-4 ${session.color} rounded-2xl p-6 hover:bg-black/60 transition-colors`}>
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      
                      {/* Left: Class Info */}
                      <div className="space-y-4 flex-1">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="inline-block px-2.5 py-1 bg-white/5 rounded-md text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                              {session.type}
                            </span>
                            {/* Modality Badge (Présentiel / À distance) */}
                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              session.modality === 'À distance' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {session.modality === 'À distance' ? <Monitor className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                              {session.modality}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-1">
                            {session.subject}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                          <span className="flex items-center gap-2"><User className="w-4 h-4 text-slate-500" /> {session.teacher}</span>
                          <span className="flex items-center gap-2">
                            {session.modality === 'À distance' ? <Monitor className="w-4 h-4 text-blue-400" /> : <MapPin className="w-4 h-4 text-emerald-400" />}
                            <span className={session.modality === 'À distance' ? 'text-blue-400 font-medium' : ''}>{session.room}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Time Info */}
                      <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6">
                        <div className="flex items-center gap-2 text-white font-bold text-lg">
                          <Clock className="w-5 h-5 text-purple-400" /> {session.time}
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};

export default Schedule;