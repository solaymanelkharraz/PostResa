import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Plus, Loader2, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Spaces = () => {
  const [filter, setFilter] = useState('All');
  const [selectedSpace, setSelectedSpace] = useState(null);
  // Booking Form State
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const queryClient = useQueryClient();

  const { data: spaces = [], isLoading, error } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const response = await api.get('/spaces');
      return response.data;
    }
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to fetch spaces');
    }
  }, [error]);

  const filteredSpaces = spaces.filter(s => filter === 'All' || s.type === filter);

  const bookSpaceMutation = useMutation({
    mutationFn: (payload) => api.post('/reservations', payload),
    onSuccess: () => {
      toast.success('Reservation request submitted successfully!');
      setSelectedSpace(null);
      setPurpose(''); setDate(''); setStartTime(''); setEndTime('');
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit reservation');
    }
  });

  const handleBookSpace = (e) => {
    e.preventDefault();
    const payload = {
      space_id: selectedSpace.id,
      purpose,
      start_time: `${date} ${startTime}:00`,
      end_time: `${date} ${endTime}:00`
    };
    bookSpaceMutation.mutate(payload);
  };
  
  const isBooking = bookSpaceMutation.isPending;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b border-white/5 pb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Campus Spaces</h1>
            <p className="text-sm text-slate-400">Browse and discover available rooms for your next session.</p>
        </div>
        <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
                type="text" 
                placeholder="Search rooms..." 
                className="w-full bg-slate-900/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 transition-all text-white"
            />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Lab', 'Atelier', 'Classroom', 'Amphi'].map(f => (
            <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
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
      ) : filteredSpaces.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-slate-900/20 rounded-3xl border border-white/5">
           No spaces found.
        </div>
      ) : (
        /* Grid of Spaces */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredSpaces.map((space, index) => (
            <motion.div 
              key={space.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 shadow-xl group flex flex-col"
            >
              {/* Image Banner */}
              <div className="h-32 w-full relative overflow-hidden bg-slate-800">
                  <img src={space.metadata?.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80"} alt={space.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                      <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                          {space.type}
                      </span>
                  </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{space.name}</h3>
                      <div className={`w-2.5 h-2.5 rounded-full shadow-sm mt-1.5 ${
                          space.status === 'available' ? 'bg-emerald-400 shadow-emerald-400/50' : 
                          space.status === 'maintenance' ? 'bg-amber-400 shadow-amber-400/50' : 'bg-rose-400 shadow-rose-400/50'
                      }`} title={space.status} />
                  </div>

                  {/* Specs */}
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-4">
                      <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md border border-white/5">
                          <Users className="w-3.5 h-3.5 text-purple-400" /> {space.capacity} Seats
                      </div>
                  </div>

                  <div className="mb-6">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Equipment</p>
                      <div className="flex flex-wrap gap-2">
                          {(space.metadata?.equipment || []).map((eq, i) => (
                              <span key={i} className="text-xs text-slate-300 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                  {eq}
                              </span>
                          ))}
                      </div>
                  </div>

                  {/* Action */}
                  <div className="mt-auto pt-4 border-t border-white/5">
                      <button 
                          onClick={() => setSelectedSpace(space)}
                          disabled={space.status !== 'available'}
                          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                              space.status === 'available' 
                              ? 'bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/20' 
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                      >
                          {space.status === 'available' ? <><Plus className="w-4 h-4" /> Book Space</> : space.status}
                      </button>
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedSpace && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedSpace(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl relative z-10 w-full max-w-md"
            >
              <button 
                onClick={() => setSelectedSpace(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-2">Book Space</h2>
              <p className="text-sm text-slate-400 mb-6">You are requesting to book <span className="text-purple-400 font-bold">{selectedSpace.name}</span></p>

              <form onSubmit={handleBookSpace} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Purpose of Booking</label>
                  <input 
                    required
                    type="text" 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. React.js Workshop"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                      required
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 text-white [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Start Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input 
                        required
                        type="time" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 text-white [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">End Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input 
                        required
                        type="time" 
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 text-white [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isBooking}
                  className="w-full py-3 mt-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all active:scale-[0.98]"
                >
                  {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Request'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Spaces;