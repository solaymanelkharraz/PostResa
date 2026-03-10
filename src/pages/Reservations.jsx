import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Plus, CheckCircle, AlertCircle } from 'lucide-react';

const MY_RESERVATIONS = [
  { id: 101, room: "Salle Informatique 1", time: "14:30 - 16:30", status: "Approved", date: "Today", purpose: "Projet Fin de Module", icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
  { id: 102, room: "Atelier Réseau", time: "08:30 - 10:30", status: "Pending", date: "Tomorrow", purpose: "Révision Groupe", icon: <AlertCircle className="w-5 h-5 text-amber-400" /> },
];

const Reservations = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Reservations</h1>
            <p className="text-sm text-slate-400">Track and manage your space requests.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/30 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> New Request
        </button>
      </div>

      <div className="space-y-5">
        {MY_RESERVATIONS.map((res, index) => (
          <motion.div key={res.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 hover:bg-slate-900/60 transition-colors hover:border-purple-500/30 shadow-lg group">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black/50 rounded-xl border border-white/5 shadow-inner">{res.icon}</div>
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{res.room}</h3>
                    <p className="text-sm text-slate-400 font-medium mt-1">Purpose: <span className="text-slate-300">{res.purpose}</span></p>
                </div>
              </div>
              <div className={`text-xs font-bold px-4 py-1.5 rounded-full border tracking-wide uppercase shadow-sm ${res.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>{res.status}</div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-300 bg-black/30 p-4 rounded-xl border border-white/5 w-full sm:w-fit">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400" /> <span className="font-medium">{res.date}</span></div>
              <div className="w-px bg-white/10 hidden sm:block"></div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400" /> <span className="font-medium">{res.time}</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Reservations;