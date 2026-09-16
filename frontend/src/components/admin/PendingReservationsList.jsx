import React from 'react';
import { Clock, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const PendingReservationsList = ({ reservations, onViewAll }) => {
  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-bold text-lg text-white flex items-center gap-2"><Clock className="w-5 h-5 text-amber-400" /> Pending Reservations</h3>
        <button onClick={onViewAll} className="text-xs text-indigo-400 hover:text-white transition-colors">View All</button>
      </div>
      <div className="divide-y divide-white/5">
        {reservations.map((req, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={req.id} 
            className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
          >
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-sm">{req.user.charAt(0)}</div>
               <div>
                  <h4 className="font-medium text-white">{req.room} <span className="text-slate-500 font-normal">for</span> {req.purpose}</h4>
                  <p className="text-sm text-slate-400">{req.user} • {req.date}, {req.time}</p>
                  {req.role === 'Student Org' && <span className="inline-block mt-1 text-[10px] bg-indigo-500/20 text-indigo-300 px-2 rounded border border-indigo-500/20">Student Org</span>}
               </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Approve</button>
              <button className="flex-1 sm:flex-none px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-sm font-medium hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"><X className="w-4 h-4" /> Refuse</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PendingReservationsList;
