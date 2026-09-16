import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layers, Plus, Edit, Trash2, Loader2, Users } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminGroups = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [expandedGroupId, setExpandedGroupId] = useState(null);

  const queryClient = useQueryClient();

  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await api.get('/groups');
      return res.data;
    }
  });

  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['schoolUsers'],
    queryFn: async () => {
      const res = await api.get('/school/users');
      return res.data.filter(u => u.role === 'stagiaire');
    }
  });

  const loading = isLoadingGroups || isLoadingStudents;

  const createMutation = useMutation({
    mutationFn: async (data) => await api.post('/groups', data),
    onSuccess: () => {
      toast.success('Nouveau groupe créé');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setModalOpen(false);
    },
    onError: () => toast.error('Erreur lors de la sauvegarde')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => await api.put(`/groups/${id}`, data),
    onSuccess: () => {
      toast.success('Groupe mis à jour');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setModalOpen(false);
    },
    onError: () => toast.error('Erreur lors de la sauvegarde')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/groups/${id}`),
    onSuccess: () => {
      toast.success('Groupe supprimé');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: () => toast.error('Erreur de suppression')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingGroup) {
      updateMutation.mutate({ id: editingGroup.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce groupe ?')) {
      deleteMutation.mutate(id);
    }
  };

  const openModal = (group = null) => {
    if (group) {
      setEditingGroup(group);
      setFormData({ name: group.name });
    } else {
      setEditingGroup(null);
      setFormData({ name: '' });
    }
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Gestion des Groupes
          </h2>
          <p className="text-sm text-slate-400 mt-1">Gérez les classes et les groupes d'étudiants.</p>
        </div>
        <button onClick={() => openModal()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20">
          <Plus className="w-4 h-4" /> Ajouter un Groupe
        </button>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : (
          <div className="space-y-4">
            {groups.map(group => {
              const groupStudents = students.filter(s => s.group === group.name);
              const isExpanded = expandedGroupId === group.id;
              
              return (
                <div key={group.id} className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden transition-all">
                  <div 
                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-white/[0.02]"
                    onClick={() => setExpandedGroupId(isExpanded ? null : group.id)}
                  >
                    <div>
                      <h3 className="font-bold text-white text-lg">{group.name}</h3>
                      <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                        <Users className="w-4 h-4" /> {groupStudents.length} Étudiants
                      </p>
                    </div>
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => openModal(group)} className="p-2 bg-black/50 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-xl transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(group.id)} className="p-2 bg-black/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-black/10"
                      >
                        <div className="p-5">
                          {groupStudents.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">Aucun étudiant dans ce groupe.</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {groupStudents.map(student => (
                                <div key={student.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase">
                                    {student.name.substring(0, 2)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-white">{student.name}</p>
                                    <p className="text-xs text-slate-400">{student.email}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            
            {groups.length === 0 && (
              <div className="text-center py-10">
                <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">Aucun groupe trouvé</p>
                <p className="text-xs text-slate-500 mt-1">Créez votre premier groupe pour commencer</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-slate-900 border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">
                {editingGroup ? 'Modifier le Groupe' : 'Nouveau Groupe'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Nom du groupe</label>
                  <input required type="text" placeholder="Ex: 1BAC-ScMath" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all">
                    Annuler
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/20">
                    {editingGroup ? 'Sauvegarder' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGroups;