import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  Monitor, 
  Wifi, 
  Projector,
  MoreVertical
} from 'lucide-react';

// --- Mock Data simulating your MySQL 'spaces' table ---
const INITIAL_SPACES = [
  { id: 1, name: "Salle Info 1", type: "Laboratoire", capacity: 24, status: "Active", equipment: ["PCs", "Projector", "Wifi"] },
  { id: 2, name: "Salle Info 2", type: "Laboratoire", capacity: 24, status: "Maintenance", equipment: ["PCs", "Wifi"] },
  { id: 3, name: "Atelier Réseau", type: "Atelier", capacity: 20, status: "Active", equipment: ["Routers", "Projector"] },
  { id: 4, name: "Salle 4", type: "Salle de cours", capacity: 30, status: "Active", equipment: ["Tableau"] },
  { id: 5, name: "Amphithéâtre A", type: "Amphi", capacity: 120, status: "Active", equipment: ["Projector", "Mic", "Wifi"] },
];

const AdminSpaces = () => {
  const [spaces, setSpaces] = useState(INITIAL_SPACES);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSpaces = spaces.filter(space => 
    space.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* --- Header & Actions --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-indigo-400" />
            Gestion des Espaces
          </h2>
          <p className="text-sm text-slate-400 mt-1">Gérez les salles, ateliers et laboratoires du campus.</p>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher une salle..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>

      {/* --- Spaces Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpaces.map((space) => (
          <div key={space.id} className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm hover:bg-slate-900/60 transition-colors group relative overflow-hidden">
            
            {/* Top Row: Type & Options */}
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/5 text-slate-300 rounded-md">
                {space.type}
              </span>
              <button className="text-slate-500 hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Main Info */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                {space.name}
              </h3>
              <p className="text-sm text-slate-400">Capacité: <strong className="text-slate-200">{space.capacity} places</strong></p>
            </div>

            {/* Equipment Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {space.equipment.map((item, idx) => (
                <span key={idx} className="flex items-center gap-1.5 text-xs text-slate-400 bg-black/30 border border-white/5 px-2 py-1 rounded-lg">
                  {item === "PCs" && <Monitor className="w-3 h-3 text-indigo-400" />}
                  {item === "Wifi" && <Wifi className="w-3 h-3 text-emerald-400" />}
                  {item === "Projector" && <Projector className="w-3 h-3 text-amber-400" />}
                  {item}
                </span>
              ))}
            </div>

            {/* Bottom Row: Status & Quick Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
              {space.status === "Active" ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> Active
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  <AlertTriangle className="w-3 h-3" /> Maintenance
                </span>
              )}

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </motion.div>
  );
};

export default AdminSpaces;