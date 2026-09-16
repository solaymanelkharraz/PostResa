import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, UserPlus, Shield, GraduationCap, User as UserIcon,
  Edit2, Trash2, Lock, Mail, UploadCloud, FileSpreadsheet, Download, CheckCircle, X, ArrowUpDown, FileOutput, Loader2, Ban
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['schoolUsers'],
    queryFn: async () => {
      const res = await api.get('/school/users');
      return res.data;
    }
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await api.get('/subjects');
      return res.data;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [viewTab, setViewTab] = useState("stagiaire");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // --- Modals State ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Add Modal specifics
  const [modalTab, setModalTab] = useState('student');
  const [csvFile, setCsvFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // New Teacher form
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    last_name: '',
    email: '',
    department: 'React Advanced',
    role: 'prof'
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData) => {
      await api.put(`/school/users/${userData.id}`, userData.data);
    },
    onSuccess: () => {
      toast.success('Utilisateur mis à jour');
      setIsEditModalOpen(false);
      setEditingUser(null);
      queryClient.invalidateQueries({ queryKey: ['schoolUsers'] });
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    }
  });

  const handleUpdateUser = (e) => {
    e.preventDefault();
    updateUserMutation.mutate({
      id: editingUser.id,
      data: {
        name: editingUser.name,
        email: editingUser.email,
        group: editingUser.group,
        department: editingUser.department
      }
    });
  };

  const createTeacherMutation = useMutation({
    mutationFn: async (teacherData) => {
      await api.post('/school/users', teacherData);
    },
    onSuccess: () => {
      toast.success('Professeur créé avec succès !');
      setIsAddModalOpen(false);
      setNewTeacher({ name: '', last_name: '', email: '', department: 'React Advanced', role: 'prof' });
      queryClient.invalidateQueries({ queryKey: ['schoolUsers'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la création');
    }
  });

  const handleCreateTeacher = (e) => {
    e.preventDefault();
    createTeacherMutation.mutate({
      name: `${newTeacher.name} ${newTeacher.last_name}`,
      email: newTeacher.email,
      role: 'prof',
      department: newTeacher.department
    });
  };

  const resetPasswordMutation = useMutation({
    mutationFn: async (userId) => {
      const res = await api.post(`/school/users/${userId}/reset-password`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Mot de passe réinitialisé: ${data.new_password}`);
    },
    onError: () => {
      toast.error('Erreur lors de la réinitialisation');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.put(`/school/users/${id}`, { status });
    },
    onSuccess: (_, variables) => {
      toast.success(`Utilisateur ${variables.status === 'active' ? 'débloqué' : 'bloqué'}.`);
      queryClient.invalidateQueries({ queryKey: ['schoolUsers'] });
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      await api.delete(`/school/users/${userId}`);
    },
    onSuccess: () => {
      toast.success('Utilisateur supprimé.');
      queryClient.invalidateQueries({ queryKey: ['schoolUsers'] });
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  const importStagiairesMutation = useMutation({
    mutationFn: async (file) => {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const startIndex = lines[0].toLowerCase().includes('email') ? 1 : 0;
      
      let successCount = 0;
      for (let i = startIndex; i < lines.length; i++) {
        const [name, email, group] = lines[i].split(',');
        if (name && email) {
          try {
            await api.post('/school/users', {
              name: name.trim(),
              email: email.trim(),
              group: group ? group.trim() : 'Général',
              role: 'stagiaire'
            });
            successCount++;
          } catch (err) {
            console.error('Erreur ligne', i, err);
          }
        }
      }
      return successCount;
    },
    onSuccess: (successCount) => {
      toast.success(`${successCount} stagiaires importés avec succès !`);
      setUploadSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['schoolUsers'] });
    },
    onError: () => {
      toast.error('Erreur lors de la lecture du fichier CSV');
    }
  });

  // Export Modal specifics
  const [exportGroup, setExportGroup] = useState("All");

  // Dynamically get unique groups for Stagiaires only
  const stagiaireGroups = useMemo(() => {
    const groups = users.filter(u => u.role === 'stagiaire').map(u => u.group);
    return [...new Set(groups)].sort();
  }, [users]);

  // --- Sorting & Filtering Logic ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const processedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = user.role === viewTab;
      return matchesSearch && matchesRole;
    });

    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, viewTab, sortConfig]);

  // --- Styling Helpers ---
  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Shield className="w-3 h-3" /> };
      case 'prof': return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <UserIcon className="w-3 h-3" /> };
      case 'stagiaire': return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <GraduationCap className="w-3 h-3" /> };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: <UserIcon className="w-3 h-3" /> };
    }
  };

  const SortableHeader = ({ label, sortKey }) => (
    <th className="p-4 cursor-pointer hover:bg-white/5 transition-colors group select-none" onClick={() => handleSort(sortKey)}>
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown className={`w-3 h-3 transition-colors ${sortConfig.key === sortKey ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
      </div>
    </th>
  );

  // --- Real CSV Download ---
  const handleDownloadCSV = () => {
    let exportUsers = users.filter(u => u.role === 'stagiaire');
    if (exportGroup !== 'All') {
      exportUsers = exportUsers.filter(u => u.group === exportGroup);
    }
    
    let csvContent = "data:text/csv;charset=utf-8,Nom,Email,Groupe\n";
    exportUsers.forEach(u => {
      csvContent += `"${u.name}","${u.email}","${u.group}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stagiaires_${exportGroup}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExportModalOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 relative">
      
      {/* --- Header & Actions --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" /> Gestion des Utilisateurs
          </h2>
          <p className="text-sm text-slate-400 mt-1">Gérez les comptes et les permissions de l'établissement.</p>
        </div>

        <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          
          {/* Export Button (Only visible on Stagiaire Tab) */}
          <AnimatePresence>
            {viewTab === 'stagiaire' && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setIsExportModalOpen(true)}
                className="flex-shrink-0 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
              >
                <FileOutput className="w-4 h-4" /> <span className="hidden sm:inline">Exporter Identifiants</span>
              </motion.button>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
          >
            <UserPlus className="w-4 h-4" /> <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>

      {/* --- Table View Tabs --- */}
      <div className="flex p-1 bg-slate-900/40 border border-white/5 rounded-2xl w-fit backdrop-blur-sm">
        <button 
          onClick={() => setViewTab('stagiaire')}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewTab === 'stagiaire' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white'}`}
        >
          <GraduationCap className="w-4 h-4" /> Stagiaires ({users.filter(u => u.role === "stagiaire").length})
        </button>
        <button 
          onClick={() => setViewTab('prof')}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewTab === 'prof' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white'}`}
        >
          <UserIcon className="w-4 h-4" /> Professeurs ({users.filter(u => u.role === "prof").length})
        </button>
        <button 
          onClick={() => setViewTab('admin')}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewTab === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white'}`}
        >
          <Shield className="w-4 h-4" /> Administration
        </button>
      </div>

      {/* --- Users Table --- */}
      <div className="bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <SortableHeader label="Utilisateur" sortKey="name" />
                <SortableHeader label={viewTab === 'stagiaire' ? "Groupe" : "Matière"} sortKey={viewTab === 'stagiaire' ? "group" : "department"} />
                <SortableHeader label="Statut" sortKey="status" />
                <SortableHeader label="Date d'inscription" sortKey="created_at" />
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-500">
                      <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-indigo-400" />
                      Chargement des utilisateurs...
                    </td>
                  </tr>
                ) : processedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      Aucun {viewTab === 'stagiaire' ? 'stagiaire' : viewTab === 'prof' ? 'professeur' : 'administrateur'} trouvé.
                    </td>
                  </tr>
                ) : (
                  processedUsers.map((user) => (
                    <motion.tr key={user.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${getRoleStyle(user.role).bg} ${getRoleStyle(user.role).color} ${getRoleStyle(user.role).border}`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white">{user.name}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-300 font-medium">{viewTab === 'stagiaire' ? user.group : user.department || user.group || '-'}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-2 text-sm text-slate-300">
                          <span className={`w-2 h-2 rounded-full ${user.status === 'Actif' || user.status === 'verified' || user.status === 'active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-500'}`}></span>
                          {user.status || 'Actif'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400 font-mono">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingUser(user); setIsEditModalOpen(true); }} className="p-2 bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors" title="Modifier l'utilisateur"><Edit2 className="w-4 h-4" /></button>
                          <button 
                            onClick={() => {
                              if (!window.confirm(`Générer un nouveau mot de passe pour ${user.name} ?`)) return;
                              resetPasswordMutation.mutate(user.id);
                            }}
                            className="p-2 bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 rounded-lg transition-colors" 
                            title="Nouveau mot de passe"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                          <button onClick={() => {
                            const isBlocked = user.status === 'blocked';
                            if(!window.confirm(`Voulez-vous vraiment ${isBlocked ? 'débloquer' : 'bloquer'} ${user.name} ?`)) return;
                            toggleStatusMutation.mutate({ id: user.id, status: isBlocked ? 'active' : 'blocked' });
                          }} className="p-2 bg-white/5 hover:bg-orange-500/20 text-slate-400 hover:text-orange-400 rounded-lg transition-colors" title="Bloquer/Débloquer"><Ban className="w-4 h-4" /></button>
                          <button onClick={() => {
                            if(!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
                            deleteUserMutation.mutate(user.id);
                          }} className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      

      {/* --- EDIT USER MODAL --- */}
      <AnimatePresence>
        {isEditModalOpen && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-6 h-6 text-indigo-400" /> Modifier Utilisateur
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Nom complet</label>
                  <input required type="text" value={editingUser.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                  <input required type="email" value={editingUser.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                {editingUser.role === 'stagiaire' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Groupe</label>
                    <input type="text" value={editingUser.group || ''} onChange={e => setEditingUser({...editingUser, group: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Matière</label>
                    <select value={editingUser.department || ''} onChange={e => setEditingUser({...editingUser, department: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
                        <option value="">Sélectionner une matière...</option>
                        {subjects.map(s => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                  </div>
                )}
                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors">Annuler</button>
                  <button type="submit" disabled={updateUserMutation.isPending} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all disabled:opacity-50">Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EXPORT MODAL --- */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileOutput className="w-6 h-6 text-emerald-400" /> Exporter Identifiants
                </h3>
                <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-slate-300">
                  Générez un fichier CSV contenant les emails et mots de passe des stagiaires pour les distribuer aux formateurs.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sélectionner un Groupe</label>
                  <select 
                    value={exportGroup} 
                    onChange={(e) => setExportGroup(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-emerald-500 appearance-none"
                  >
                    <option value="All">Tous les groupes (Fichier global)</option>
                    {stagiaireGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleDownloadCSV}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 transition-all"
                >
                  <Download className="w-5 h-5" /> Télécharger .CSV
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* --- ADD USERS MODAL --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white">Création de Comptes</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex border-b border-white/5 bg-black/20">
                <button onClick={() => setModalTab('student')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${modalTab === 'student' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>
                  <GraduationCap className="w-4 h-4" /> Import Stagiaires (CSV)
                </button>
                <button onClick={() => setModalTab('teacher')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${modalTab === 'teacher' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>
                  <UserIcon className="w-4 h-4" /> Ajout Professeur (Manuel)
                </button>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {modalTab === 'student' && (
                    <motion.div key="student-tab" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                      {!uploadSuccess ? (
                        <>
                          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-200">
                            <strong>Workflow :</strong> Upload du CSV. Le système créera les comptes et générera des mots de passe. Vous pourrez ensuite utiliser le bouton d'exportation pour télécharger les identifiants.
                          </div>
                          <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${csvFile ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-indigo-500/50 bg-black/20 hover:bg-black/40'}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                              {csvFile ? <FileSpreadsheet className="w-10 h-10 text-indigo-400 mb-3" /> : <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-indigo-400 mb-3 transition-colors" />}
                              <p className="text-sm text-slate-300 font-medium mb-1">{csvFile ? csvFile.name : "Glissez-déposez le fichier CSV des stagiaires"}</p>
                            </div>
                            <input type="file" className="hidden" accept=".csv" onChange={(e) => { if(e.target.files[0]) setCsvFile(e.target.files[0]); }} />
                          </label>
                            <button 
                              onClick={() => {
                                const csvData = "name,email,group\nAli Benmoussa,ali@razzi.ma,Dev Digital 202\nSara Amrani,sara@razzi.ma,Dev Digital 201\n";
                                const blob = new Blob([csvData], { type: 'text/csv' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'template_stagiaires.csv';
                                a.click();
                              }}
                              className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-white transition-colors mt-2 mb-4 ml-1"
                            >
                              <Download className="w-4 h-4" /> Télécharger le template .csv
                            </button>
                            <button 
                              onClick={() => {
                                if(!csvFile) return;
                                importStagiairesMutation.mutate(csvFile);
                              }} 
                              disabled={!csvFile || importStagiairesMutation.isPending}
                              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!csvFile ? 'bg-white/5 text-slate-500' : importStagiairesMutation.isPending ? 'bg-indigo-600/50 text-white cursor-wait' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                            >
                            {importStagiairesMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lancer l'importation"}
                          </button>
                        </>
                      ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-6 flex flex-col items-center text-center">
                          <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" />
                          <h3 className="text-xl font-bold text-white mb-2">Importation Terminée !</h3>
                          <p className="text-sm text-slate-400 mb-8 max-w-sm">Les comptes stagiaires ont été créés. Les mots de passe générés sont enregistrés dans le système.</p>
                          <button onClick={() => { setIsAddModalOpen(false); setUploadSuccess(false); setCsvFile(null); }} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all">
                            Fermer la fenêtre
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {modalTab === 'teacher' && (
                    <motion.div key="teacher-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                      <form className="space-y-4" onSubmit={handleCreateTeacher}>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Prénom</label>
                            <input required type="text" placeholder="Ex: Ahmed" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Nom</label>
                            <input required type="text" placeholder="Ex: Tazi" value={newTeacher.last_name} onChange={e => setNewTeacher({...newTeacher, last_name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase">Email Professionnel</label>
                          <input required type="email" placeholder="nom.prenom@ecole.ma" value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2 pb-4">
                          <label className="text-xs font-bold text-slate-400 uppercase">Matière</label>
                          <select required value={newTeacher.department} onChange={e => setNewTeacher({...newTeacher, department: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none">
                              <option value="">Sélectionner une matière...</option>
                              {subjects.map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                              ))}
                            </select>
                        </div>
                        <button type="submit" disabled={createTeacherMutation.isPending} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                          {createTeacherMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer le compte Professeur"}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AdminUsers;