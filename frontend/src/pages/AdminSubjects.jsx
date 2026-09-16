import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminSubjects = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const { data: subjects = [], isLoading: loading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      try {
        const res = await api.get('/subjects');
        return res.data;
      } catch (err) {
        toast.error('Erreur lors du chargement des modules');
        throw err;
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await api.post('/subjects', data);
    },
    onSuccess: () => {
      toast.success('Module ajouté');
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setModalOpen(false);
    },
    onError: () => {
      toast.error('Erreur lors de la sauvegarde');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await api.put('/subjects/' + id, data);
    },
    onSuccess: () => {
      toast.success('Module mis à jour');
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setModalOpen(false);
    },
    onError: () => {
      toast.error('Erreur lors de la sauvegarde');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete('/subjects/' + id);
    },
    onSuccess: () => {
      toast.success('Module supprimé');
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (editingSubject) {
      updateMutation.mutate({ id: editingSubject.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce module ?')) return;
    deleteMutation.mutate(id);
  };

  const openModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({ name: subject.name, description: subject.description || '' });
    } else {
      setEditingSubject(null);
      setFormData({ name: '', description: '' });
    }
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Gestion des Modules
          </h2>
          <p className="text-sm text-slate-400 mt-1">Gérez les matières enseignées.</p>
        </div>
        <button onClick={() => openModal()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20">
          <Plus className="w-4 h-4" /> Ajouter un Module
        </button>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(sub => (
              <div key={sub.id} className="bg-black/30 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-colors group">
                <h3 className="font-bold text-white mb-2">{sub.name}</h3>
                <p className="text-sm text-slate-400 mb-4 h-10 overflow-hidden">{sub.description || 'Aucune description'}</p>
                <div className="flex justify-end gap-2 border-t border-white/5 pt-4 mt-auto">
                  <button onClick={() => openModal(sub)} className="p-2 bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(sub.id)} className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {subjects.length === 0 && <p className="text-slate-500 col-span-full text-center py-10">Aucun module configuré.</p>}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-6">{editingSubject ? 'Modifier le Module' : 'Nouveau Module'}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nom du Module</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="ex: Base de Données" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description (Optionnel)</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 h-24 resize-none"></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors">Annuler</button>
                  <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all">Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSubjects;