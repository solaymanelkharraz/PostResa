import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Plus, Search, Edit2, Trash2, AlertTriangle, 
  Monitor, Wifi, Projector, MoreVertical, X, Loader2
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminSpaces = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Salle de cours',
    capacity: 30,
    status: 'available',
    equipment: []
  });

  const { data: spaces = [], isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const res = await api.get('/spaces');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newSpace) => {
      await api.post('/spaces', newSpace);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      toast.success('Espace créé avec succès');
      setIsAddModalOpen(false);
      setEditingSpace(null);
      setFormData({ name: '', type: 'Salle de cours', capacity: 30, equipment: [], status: 'available' });
    },
    onError: () => {
      toast.error('Erreur lors de la sauvegarde');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedSpace }) => {
      await api.put(`/spaces/${id}`, updatedSpace);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      toast.success('Espace mis à jour');
      setIsAddModalOpen(false);
      setEditingSpace(null);
      setFormData({ name: '', type: 'Salle de cours', capacity: 30, equipment: [], status: 'available' });
    },
    onError: () => {
      toast.error('Erreur lors de la sauvegarde');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/spaces/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      toast.success('Espace supprimé.');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.put(`/spaces/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      toast.success('Statut mis à jour.');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  });

  const handleCreateSpace = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      type: formData.type,
      capacity: parseInt(formData.capacity),
      status: formData.status,
      metadata: { equipment: formData.equipment }
    };
    if (editingSpace) {
      updateMutation.mutate({ id: editingSpace.id, updatedSpace: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDeleteSpace = (id) => {
    if(!window.confirm('Voulez-vous vraiment supprimer cet espace ?')) return;
    deleteMutation.mutate(id);
  };

  const handleToggleStatus = (space) => {
    const newStatus = space.status === 'available' ? 'maintenance' : 'available';
    toggleStatusMutation.mutate({ id: space.id, status: newStatus });
  };

  const toggleEquipment = (item) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item) 
        ? prev.equipment.filter(e => e !== item)
        : [...prev.equipment, item]
    }));
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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
          <button 
            onClick={() => { setEditingSpace(null); setFormData({ name: "", type: "Salle de cours", capacity: 30, equipment: [], status: "available" }); setIsAddModalOpen(true); }}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>

      {/* --- Spaces Grid --- */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : filteredSpaces.length === 0 ? (
        <div className="text-center py-12 text-slate-500">Aucun espace trouvé.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpaces.map((space) => {
            const equipment = space.metadata?.equipment || [];
            return (
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
                  {equipment.length > 0 ? equipment.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 text-xs text-slate-400 bg-black/30 border border-white/5 px-2 py-1 rounded-lg">
                      {item === "PCs" && <Monitor className="w-3 h-3 text-indigo-400" />}
                      {item === "Wifi" && <Wifi className="w-3 h-3 text-emerald-400" />}
                      {item === "Projector" && <Projector className="w-3 h-3 text-amber-400" />}
                      {item}
                    </span>
                  )) : (
                    <span className="text-xs text-slate-600">Aucun équipement</span>
                  )}
                </div>

                {/* Bottom Row: Status & Quick Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                  {space.status === "available" ? (
                    <button onClick={() => handleToggleStatus(space)} className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/20 transition-colors cursor-pointer">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> Disponible
                    </button>
                  ) : (
                    <button onClick={() => handleToggleStatus(space)} className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/20 transition-colors cursor-pointer">
                      <AlertTriangle className="w-3 h-3" /> {space.status === 'maintenance' ? 'Maintenance' : 'Verrouillé'}
                    </button>
                  )}

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingSpace(space); setFormData({ name: space.name, type: space.type, capacity: space.capacity, equipment: space.metadata?.equipment || [], status: space.status || "available" }); setIsAddModalOpen(true); }} className="p-2 bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteSpace(space.id)} className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* --- ADD MODAL --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-bold text-white">{editingSpace ? "Modifier l'Espace" : "Ajouter un Espace"}</h3>
                <button onClick={() => { setIsAddModalOpen(false); setEditingSpace(null); setFormData({ name: "", type: "Salle de cours", capacity: 30, equipment: [], status: "available" }); }} className="text-slate-400 hover:text-white p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSpace} className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nom de la salle</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: Salle 402" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="mt-1 w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
                      <option value="Salle de cours">Salle de cours</option>
                      <option value="Laboratoire">Laboratoire</option>
                      <option value="Atelier">Atelier</option>
                      <option value="Amphithéâtre">Amphithéâtre</option>
                      <option value="Salle de réunion">Salle de réunion</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Capacité</label>
                    <input required type="number" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="mt-1 w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2 block">Équipements inclus</label>
                  <div className="flex flex-wrap gap-2">
                    {["PCs", "Wifi", "Projector", "Tableau Interactif", "Mic"].map(item => (
                      <button 
                        key={item} type="button"
                        onClick={() => toggleEquipment(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${formData.equipment.includes(item) ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors">Annuler</button>
                  <button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer l'espace"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AdminSpaces;