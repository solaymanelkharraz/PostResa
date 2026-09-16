import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Check, X, Trash2, MessageSquare, Plus, Send, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminPosts = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('published'); // Default to published/create view
  const [newPostText, setNewPostText] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin_posts'],
    queryFn: async () => {
      const res = await api.get('/posts?admin=1');
      return res.data;
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (text) => {
      const res = await api.post('/posts', {
        title: "Annonce Officielle",
        content: text,
        type: 'announcement'
      });
      await api.put(`/posts/${res.data.id}`, { status: 'published' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_posts'] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Annonce publiée avec succès !');
      setNewPostText("");
      setIsCreating(false);
    },
    onError: () => {
      toast.error('Erreur lors de la publication');
    }
  });

  const moderateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.put(`/posts/${id}`, { status });
      return status;
    },
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: ['admin_posts'] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(status === 'published' ? 'Annonce approuvée' : 'Annonce rejetée');
    },
    onError: () => {
      toast.error('Erreur lors de la modération');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_posts'] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Annonce supprimée');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    createPostMutation.mutate(newPostText);
  };

  const handleModerate = (id, status) => {
    moderateMutation.mutate({ id, status });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;
    deleteMutation.mutate(id);
  };

  const publishedPosts = posts.filter(p => p.status === 'published');
  const pendingPosts = posts.filter(p => p.status === 'pending');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" /> Annonces & Modération
          </h2>
          <p className="text-sm text-slate-400 mt-1">Gérez le fil d'actualité et publiez des annonces officielles.</p>
        </div>
        
        <button 
          onClick={() => {
            setActiveTab('published');
            setIsCreating(!isCreating);
          }}
          className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
        >
          {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isCreating ? "Annuler" : "Nouvelle Annonce"}
        </button>
      </div>

      {/* Custom Tabs */}
      <div className="flex p-1 bg-slate-900/40 border border-white/5 rounded-2xl w-fit backdrop-blur-sm">
        <button 
          onClick={() => { setActiveTab('published'); setIsCreating(false); }}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'published' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white'}`}
        >
          Publications Actives
        </button>
        <button 
          onClick={() => { setActiveTab('pending'); setIsCreating(false); }}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white'}`}
        >
          À Modérer 
          {pendingPosts.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300'}`}>
              {pendingPosts.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          
          {/* --- ADMIN CREATION BOX --- */}
          {activeTab === 'published' && isCreating && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }} 
              animate={{ opacity: 1, height: 'auto', scale: 1 }} 
              exit={{ opacity: 0, height: 0, scale: 0.95 }} 
              className="lg:col-span-2 bg-gradient-to-br from-indigo-900/20 to-slate-900/40 border border-indigo-500/30 rounded-3xl p-6 backdrop-blur-sm shadow-xl mb-2"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                Créer une Annonce Officielle (Direction)
              </h3>
              <textarea 
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Rédigez votre annonce ici... Elle sera publiée immédiatement sur le fil de tous les utilisateurs."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none mb-4"
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleCreatePost}
                  disabled={!newPostText.trim() || createPostMutation.isPending}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-slate-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  {createPostMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} 
                  {createPostMutation.isPending ? "Publication..." : "Publier maintenant"}
                </button>
              </div>
            </motion.div>
          )}

          {/* --- PUBLISHED POSTS --- */}
          {activeTab === 'published' && (
            isLoading ? (
              <div className="lg:col-span-2 flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
            ) : publishedPosts.length === 0 && !isCreating ? (
              <div className="lg:col-span-2 text-center py-12 text-slate-500">Aucune publication active.</div>
            ) : (
              publishedPosts.map(post => {
                const isDirection = post.user?.role === 'admin';
                return (
                  <motion.div key={post.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${isDirection ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20' : 'bg-slate-800 text-white border-white/5'}`}>
                            {post.user?.name ? post.user.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <h4 className="font-bold text-white flex items-center gap-2">
                              {post.user?.name || 'Utilisateur inconnu'}
                              {isDirection && <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">Direction</span>}
                            </h4>
                            <p className="text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-white/5 text-slate-300 border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {post.type}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-200 mb-2">{post.title}</h5>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">"{post.content}"</p>
                    </div>
                    <button onClick={() => handleDelete(post.id)} className="w-full py-2.5 bg-black/40 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-rose-500/20">
                      <Trash2 className="w-4 h-4" /> Retirer la publication
                    </button>
                  </motion.div>
                );
              })
            )
          )}

          {/* --- PENDING MODERATION --- */}
          {activeTab === 'pending' && (
            isLoading ? (
              <div className="lg:col-span-2 flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
            ) : pendingPosts.length === 0 ? (
              <div className="lg:col-span-2 text-center py-12 text-slate-500">Aucune publication en attente.</div>
            ) : (
              pendingPosts.map(post => (
                <motion.div key={post.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-sm">
                          {post.user?.name ? post.user.name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{post.user?.name || 'Utilisateur inconnu'}</h4>
                          <p className="text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        En attente
                      </span>
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5 mb-6 relative">
                      <MessageSquare className="absolute top-4 right-4 w-4 h-4 text-slate-600" />
                      <h5 className="font-bold text-slate-200 mb-1">{post.title}</h5>
                      <p className="text-slate-300 text-sm leading-relaxed pr-6">"{post.content}"</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleModerate(post.id, 'published')} className="flex-1 py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-emerald-500/20">
                      <Check className="w-4 h-4" /> Publier
                    </button>
                    <button onClick={() => handleModerate(post.id, 'rejected')} className="flex-1 py-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-rose-500/20">
                      <X className="w-4 h-4" /> Rejeter
                    </button>
                  </div>
                </motion.div>
              ))
            )
          )}

        </AnimatePresence>
      </div>

    </motion.div>
  );
};

export default AdminPosts;