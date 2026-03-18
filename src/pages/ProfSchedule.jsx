import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, MapPin, Users, BookOpen } from 'lucide-react';

// Mock Schedule Data for M. Tazi
const MY_SCHEDULE = [
  { day: "Lundi", classes: [
      { time: "08:30 - 11:00", subject: "Bases de Données (MySQL)", group: "Dev Digital 201", room: "Salle Info 2", type: "Cours" },
      { time: "14:30 - 17:00", subject: "Bases de Données (MySQL)", group: "Dev Digital 202", room: "Salle Info 3", type: "Cours" }
    ]
  },
  { day: "Mardi", classes: [] }, // Free day
  { day: "Mercredi", classes: [
      { time: "08:30 - 13:30", subject: "Développement Back-end (Laravel)", group: "Dev Digital 202", room: "Atelier Réseau", type: "Atelier Pratique" }
    ]
  },
  { day: "Jeudi", classes: [
      { time: "14:30 - 17:00", subject: "Développement Back-end (Laravel)", group: "Dev Digital 201", room: "Salle Info 2", type: "Cours" }
    ]
  },
  { day: "Vendredi", classes: [] },
  { day: "Samedi", classes: [] }
];

const ProfSchedule = () => {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl">
      
      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <CalendarDays className="w-6 h-6 text-blue-400" /> Mon Emploi du Temps
        </h2>

        {/* Day Selector */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2 border-b border-white/5">
          {MY_SCHEDULE.map((dayObj, index) => (
            <button
              key={index}
              onClick={() => setActiveDay(index)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeDay === index 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {dayObj.day}
            </button>
          ))}
        </div>

        {/* Classes List */}
        <div className="space-y-4 min-h-[300px]">
          {MY_SCHEDULE[activeDay].classes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-white/5 rounded-2xl bg-black/20 text-center">
              <BookOpen className="w-10 h-10 text-slate-600 mb-3" />
              <h3 className="text-white font-bold mb-1">Aucun cours</h3>
              <p className="text-sm text-slate-500">Vous n'avez pas de cours programmé pour cette journée.</p>
            </div>
          ) : (
            MY_SCHEDULE[activeDay].classes.map((session, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-black/40 border border-white/5 border-l-4 border-l-blue-500 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-black/60 transition-colors">
                
                <div className="space-y-3 flex-1">
                  <span className="inline-block px-2.5 py-1 bg-white/5 rounded-md text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    {session.type}
                  </span>
                  <h3 className="text-xl font-bold text-white">{session.subject}</h3>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                    <span className="flex items-center gap-2 text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-lg"><Users className="w-4 h-4" /> {session.group}</span>
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> {session.room}</span>
                  </div>
                </div>

                <div className="flex items-center md:items-start md:border-l border-white/5 md:pl-6">
                  <div className="flex items-center gap-2 text-white font-bold text-lg bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 text-blue-400">
                    <Clock className="w-5 h-5" /> {session.time}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfSchedule;