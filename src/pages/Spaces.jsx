import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Monitor, Wifi, Projector, Plus } from 'lucide-react';

const SPACES_DATA = [
  {
    id: 1,
    name: "Salle Informatique 1",
    type: "Lab",
    capacity: 30,
    status: "Occupied",
    equipment: ["30 PCs", "Projector", "Fiber Wifi"],
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Atelier Réseau",
    type: "Atelier",
    capacity: 20,
    status: "Free",
    equipment: ["Cisco Racks", "20 PCs", "Whiteboard"],
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Salle de Conférence",
    type: "Amphi",
    capacity: 120,
    status: "Free",
    equipment: ["Dual Projectors", "Microphones", "Stage"],
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Salle de Cours 4",
    type: "Classroom",
    capacity: 40,
    status: "Maintenance",
    equipment: ["Projector", "Whiteboard"],
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const Spaces = () => {
  const [filter, setFilter] = useState('All');

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

      {/* Grid of Spaces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SPACES_DATA.filter(s => filter === 'All' || s.type === filter).map((space, index) => (
          <motion.div 
            key={space.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 shadow-xl group flex flex-col"
          >
            {/* Image Banner */}
            <div className="h-32 w-full relative overflow-hidden bg-slate-800">
                <img src={space.image} alt={space.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
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
                        space.status === 'Free' ? 'bg-emerald-400 shadow-emerald-400/50' : 
                        space.status === 'Occupied' ? 'bg-rose-400 shadow-rose-400/50' : 'bg-amber-400 shadow-amber-400/50'
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
                        {space.equipment.map((eq, i) => (
                            <span key={i} className="text-xs text-slate-300 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                {eq}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Action */}
                <div className="mt-auto pt-4 border-t border-white/5">
                    <button 
                        disabled={space.status !== 'Free'}
                        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                            space.status === 'Free' 
                            ? 'bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/20' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                        {space.status === 'Free' ? <><Plus className="w-4 h-4" /> Book Space</> : space.status}
                    </button>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Spaces;