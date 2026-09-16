import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Reservations = () => {
  const [filter, setFilter] = useState('All');
  
  const { data: reservations = [], isLoading, error } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const res = await api.get('/reservations');
      return res.data;
    }
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to fetch reservations');
    }
  }, [error]);

  const filtered = reservations.filter(r => filter === 'All' || r.status === filter);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b border-white/5 pb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Reservations</h1>
            <p className="text-sm text-slate-400">Track and manage your room bookings.</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 mb-6">
        {['All', 'approved', 'pending', 'rejected'].map(f => (
            <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                    filter === f 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' 
                    : 'bg-slate-900/40 border border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
                {f}
            </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-slate-900/20 rounded-3xl border border-white/5">
           No reservations found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((res, i) => (
            <motion.div 
              key={res.id} 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                      <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="font-bold text-white mb-1">{res.purpose}</h3>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {res.space?.name || 'Unknown Space'}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(res.start_time).toLocaleString()} - {new Date(res.end_time).toLocaleTimeString()}</span>
                      </div>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      res.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      res.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                      {res.status}
                  </span>
                  <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg">View Details</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Reservations;