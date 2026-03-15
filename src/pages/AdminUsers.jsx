import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, UserPlus, Shield, GraduationCap, User as UserIcon,
  Edit2, Trash2, Lock, Mail, UploadCloud, FileSpreadsheet, Download, CheckCircle, X, ArrowUpDown, FileOutput
} from 'lucide-react';

// --- Mock Data ---
const INITIAL_USERS = [
  { id: 1, name: "Soulayman Elkharraz", email: "soulayman@ofppt.ma", role: "Stagiaire", status: "Actif", group: "Dev Digital 202", joined: "2025-09-12" },
  { id: 2, name: "Karim Azeggouar", email: "k.azeggouar@ofppt.ma", role: "Admin", status: "Actif", group: "Direction", joined: "2025-09-01" },
  { id: 3, name: "M. Tazi", email: "tazi.dev@ofppt.ma", role: "Professeur", status: "Actif", group: "Dépt IT", joined: "2025-09-05" },
  { id: 4, name: "Mme. Bennani", email: "bennani.soft@ofppt.ma", role: "Professeur", status: "Actif", group: "Dépt Soft Skills", joined: "2025-09-05" },
  { id: 5, name: "Omar Etudiant", email: "omar@ofppt.ma", role: "Stagiaire", status: "Inactif", group: "Dev Digital 201", joined: "2025-09-15" },
  { id: 6, name: "Amina Stagiaire", email: "amina@ofppt.ma", role: "Stagiaire", status: "Actif", group: "Infra Réseau 101", joined: "2025-09-10" },
  { id: 7, name: "Youssef Dev", email: "youssef@ofppt.ma", role: "Stagiaire", status: "Actif", group: "Dev Digital 202", joined: "2025-09-12" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewTab, setViewTab] = useState("Stagiaire");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // --- Modals State ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Add Modal specifics
  const [modalTab, setModalTab] = useState('student');
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Export Modal specifics
  const [exportGroup, setExportGroup] = useState("All");

  // Dynamically get unique groups for Stagiaires only
  const stagiaireGroups = useMemo(() => {
    const groups = users.filter(u => u.role === 'Stagiaire').map(u => u.group);
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
      case 'Admin': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Shield className="w-3 h-3" /> };
      case 'Professeur': return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <UserIcon className="w-3 h-3" /> };
      case 'Stagiaire': return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <GraduationCap className="w-3 h-3" /> };
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

  // --- Simulated CSV Download ---
  const handleDownloadCSV = () => {
    // In production, this will trigger a download link from Laravel
    alert(`Téléchargement du fichier CSV pour : ${exportGroup === 'All' ? 'Tous les groupes' : exportGroup}`);
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
            {viewTab === 'Stagiaire' && (
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
          onClick={() => setViewTab('Stagiaire')}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewTab === 'Stagiaire' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white'}`}
        >
          <GraduationCap className="w-4 h-4" /> Liste des Stagiaires
        </button>
        <button 
          onClick={() => setViewTab('Professeur')}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewTab === 'Professeur' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white'}`}
        >
          <UserIcon className="w-4 h-4" /> Liste des Professeurs
        </button>
        <button 
          onClick={() => setViewTab('Admin')}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewTab === 'Admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white'}`}
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
                <SortableHeader label={viewTab === 'Stagiaire' ? "Groupe" : "Département"} sortKey="group" />
                <SortableHeader label="Statut" sortKey="status" />
                <SortableHeader label="Date d'inscription" sortKey="joined" />
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {processedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      Aucun {viewTab.toLowerCase()} trouvé.
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
                      <td className="p-4 text-sm text-slate-300 font-medium">{user.group}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-2 text-sm text-slate-300">
                          <span className={`w-2 h-2 rounded-full ${user.status === 'Actif' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-500'}`}></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400 font-mono">{user.joined}</td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors" title="Modifier"><Edit2 className="w-4 h-4" /></button>
                          <button className="p-2 bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 rounded-lg transition-colors" title="Nouveau mot de passe"><Lock className="w-4 h-4" /></button>
                          <button className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors" title="Désactiver"><Trash2 className="w-4 h-4" /></button>
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
                                if(!csvFile) return;
                                setIsUploading(true);
                                setTimeout(() => { setIsUploading(false); setUploadSuccess(true); }, 2000);
                            }} 
                            disabled={!csvFile || isUploading}
                            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!csvFile ? 'bg-white/5 text-slate-500' : isUploading ? 'bg-indigo-600/50 text-white cursor-wait' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                          >
                            {isUploading ? "Génération en cours..." : "Lancer l'importation"}
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
                      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Prénom</label>
                            <input required type="text" placeholder="Ex: Ahmed" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Nom</label>
                            <input required type="text" placeholder="Ex: Tazi" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase">Email Professionnel</label>
                          <input required type="email" placeholder="nom.prenom@ofppt.ma" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2 pb-4">
                          <label className="text-xs font-bold text-slate-400 uppercase">Département</label>
                          <select className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none">
                            <option>Développement Digital</option>
                            <option>Infrastructure Digitale</option>
                            <option>Soft Skills</option>
                          </select>
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
                          Créer le compte Professeur
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