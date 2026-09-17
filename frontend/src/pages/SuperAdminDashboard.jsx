import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Building, Server, Activity, CheckCircle, XCircle, LogOut, 
  ShieldCheck, Database, Search, FileText, Terminal, ArrowUpDown, Filter, Loader2, MessageSquare
} from 'lucide-react';
import api from '../api/axios';
import SuperAdminSupport from './SuperAdminSupport';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

// --- Mock Data ---
// --- Mock Data ---

const GLOBAL_LOGS = [
  { id: 101, date: "2026-03-18 14:30:00", level: "SUCCESS", target: "ISTA Ibn Marfil", action: "École Activée", details: "Validation par SuperAdmin AD", ip: "192.168.1.1" },
  { id: 102, date: "2026-03-18 12:15:22", level: "WARNING", target: "Système Central", action: "Charge CPU Ã‰levée", details: "Pic à 85% sur le cluster principal", ip: "Server-01" },
  { id: 103, date: "2026-03-17 09:00:15", level: "INFO", target: "ISTA NTIC Tanger", action: "Sauvegarde BDD", details: "Backup automatique réussi (450MB)", ip: "Server-DB" },
  { id: 104, date: "2026-03-16 23:45:00", level: "ERROR", target: "Non identifié", action: "Tentative Intrusion", details: "Ã‰chec brute-force route /admin", ip: "45.133.22.11" },
  { id: 105, date: "2026-03-16 10:10:00", level: "INFO", target: "ISTA NTIC Tanger", action: "Nouvel Utilisateur", details: "Création compte Stagiaire (S. Elkharraz)", ip: "105.154.22.10" },
];

const SortableHeader = ({ label, sortKey, align = "left", sortConfig, handleSort }) => (
  <th className={`pb-4 cursor-pointer hover:text-white transition-colors group select-none ${align === 'right' ? 'text-right pr-4' : 'pl-4'}`} onClick={() => handleSort(sortKey)}>
    <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
      {label}
      <ArrowUpDown className={`w-3 h-3 transition-colors ${sortConfig.key === sortKey ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
    </div>
  </th>
);

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('onboarding');

  // --- Logs State (Search, Sort, Filter) ---
  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['superAdminData'],
    queryFn: async () => {
      const [schoolsRes, logsRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/dashboard/logs'),
        api.get('/superadmin/stats')
      ]);
      return {
        schools: schoolsRes.data,
        logs: logsRes.data,
        stats: statsRes.data,
      };
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    onError: () => toast.error('Erreur lors du chargement des écoles'),
  });

  const schools = data?.schools || [];
  const systemLogs = data?.logs || [];
  const stats = data?.stats;

  const platformStats = [
    { label: 'Écoles Actives', value: stats?.active_schools?.toString() || '0', status: 'Opérationnel', icon: <Building className="w-5 h-5 text-cyan-400" />, color: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Utilisateurs Globaux', value: stats?.total_users || '0', status: 'Inscrits', icon: <Globe className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Santé Serveur (Laravel)', value: stats?.server_health || '99.9%', status: '12ms ping', icon: <Server className="w-5 h-5 text-emerald-400" />, color: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Charge BDD (MySQL)', value: stats?.db_load || '24%', status: 'Stable', icon: <Database className="w-5 h-5 text-purple-400" />, color: 'bg-purple-500/10 border-purple-500/20' },
  ];

  const pendingSchools = schools.filter(s => s.status === 'pending');
  const activeSchools = schools.filter(s => s.status === 'verified');

  const handleApproveSchool = async (id) => {
    try {
      await api.put(`/admin/users/${id}/verify`, { status: 'verified' });
      toast.success('École vérifiée et activée avec succès !');
      refetch();
    } catch (err) {
      toast.error('Erreur lors de la vérification');
    }
  };

  const handleRejectSchool = async (id) => {
    try {
      await api.put(`/admin/users/${id}/verify`, { status: 'rejected' });
      toast.success('École rejetée.');
      refetch();
    } catch (err) {
      toast.error('Erreur lors du rejet');
    }
  };

  // --- Logs Processing Logic ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const processedLogs = useMemo(() => {
    let filtered = systemLogs.filter(log => {
      const search = (logSearch || "").toLowerCase();
      const actionStr = (log.action || "").toLowerCase();
      const userStr = (log.user || "").toLowerCase();
      const ipStr = (log.ip || "").toLowerCase();
      
      const matchesSearch = search === "" || actionStr.includes(search) || userStr.includes(search) || ipStr.includes(search);
      const matchesLevel = logFilter === "All" || (log.level || "").toUpperCase() === logFilter;
      return matchesSearch && matchesLevel;
    });

    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [logSearch, logFilter, sortConfig]);

  // --- Styling Helpers ---
  const getLevelStyle = (level) => {
    switch (level) {
      case 'SUCCESS': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'WARNING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'ERROR': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex selection:bg-cyan-500 selection:text-white">
      
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex-shrink-0 fixed h-full z-20 hidden lg:block overflow-y-auto pb-6 custom-scrollbar">
        <div className="p-6 flex items-center gap-3 mb-6 border-b border-slate-800">
          <img src="/logo.png" alt="PostResa Logo" className="w-10 h-10 object-contain rounded-xl" />
          <div>
            <h1 className="font-bold text-white tracking-tight leading-none">POSTRESA</h1>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Super Admin</span>
          </div>
        </div>

        <div className="px-3 space-y-1">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Plateforme SaaS</p>
          <button onClick={() => setActiveTab('onboarding')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'onboarding' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
            <ShieldCheck className="w-4 h-4" /> Demandes d'Acquisition
            {pendingSchools.length > 0 && <span className="ml-auto bg-cyan-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingSchools.length}</span>}
          </button>
          <button onClick={() => setActiveTab('schools')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'schools' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
            <Building className="w-4 h-4" /> Écoles Actives
          </button>
            <button onClick={() => setActiveTab('support')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'support' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
              <MessageSquare className="w-4 h-4" /> Support & Contacts
            </button>

          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-8">Infrastructure</p>
          <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'logs' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
            <Terminal className="w-4 h-4" /> Traces Systèmes (Logs)
          </button>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <button onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/auth';
          }} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white hover:bg-slate-900 rounded-xl transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" /> Quitter la console
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Console Master</h1>
            <p className="text-slate-400 text-sm">Gestion globale de l'infrastructure POSTRESA</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-white text-sm cursor-default">
            SA
          </div>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {platformStats.map((stat, index) => (
            <div key={index} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{stat.status}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 font-mono">{stat.value}</h3>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          
          {/* TAB: ONBOARDING */}
          {activeTab === 'onboarding' && (
            <motion.div key="onboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-cyan-400" /> Demandes d'Acquisition (Étape 5)</h3>
                  <p className="text-sm text-slate-400 mt-1">Écoles en attente de validation après visite physique sur le terrain.</p>
                </div>
              </div>
              <div className="p-6">
                {isLoading ? (
                   <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>
                ) : pendingSchools.length === 0 ? (
                  <div className="text-center py-12 text-slate-600">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Aucune école en attente d'intégration.</p>
                  </div>
                ) : (
                  pendingSchools.map((school) => (
                    <div key={school.id} className="bg-black/40 border border-slate-800 rounded-2xl p-6 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center hover:border-cyan-500/30 transition-colors mb-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <h4 className="text-xl font-bold text-white">{school.name}</h4>
                          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider animate-pulse">{school.status}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
                          <div><strong className="text-slate-300 block mb-1">Email:</strong> {school.email}</div>
                          <div><strong className="text-slate-300 block mb-1">Contact:</strong> {school.metadata?.phone || 'N/A'}</div>
                          <div><strong className="text-slate-300 block mb-1">Adresse:</strong> {school.metadata?.address || 'N/A'}</div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-cyan-400 bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 w-fit">
                          <FileText className="w-4 h-4" /> Document reçu : 
                          {school.metadata?.document_url ? (
                            <a href={school.metadata.document_url} target="_blank" rel="noreferrer" className="underline hover:text-cyan-300">Voir le Document</a>
                          ) : (
                            <span className="text-slate-500">Aucun fichier</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto border-t xl:border-t-0 xl:border-l border-slate-800 pt-6 xl:pt-0 xl:pl-6">
                        <button onClick={() => handleRejectSchool(school.id)} className="flex-1 xl:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"><XCircle className="w-4 h-4 text-rose-400" /> Rejeter</button>
                        <button onClick={() => handleApproveSchool(school.id)} className="flex-1 xl:flex-none px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Activer l'École</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* TAB: ACTIVE SCHOOLS */}
          {activeTab === 'schools' && (
             <motion.div key="schools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm shadow-2xl">
                <h3 className="font-bold text-lg text-white mb-6">Écoles Déployées</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="pb-4 pl-4">Établissement</th>
                        <th className="pb-4">Adresse</th>
                        <th className="pb-4">Stagiaires Prévus</th>
                        <th className="pb-4">Statut</th>
                        <th className="pb-4 text-right pr-4">Date d'inscription</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {activeSchools.map(school => (
                        <tr key={school.id} className="hover:bg-white/[0.02]">
                          <td className="py-4 pl-4 font-bold text-white">{school.name}</td>
                          <td className="py-4 text-slate-400">{school.metadata?.address || '-'}</td>
                          <td className="py-4 font-mono text-cyan-400">{school.metadata?.stagiaires_count || '-'}</td>
                          <td className="py-4"><span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">{school.status}</span></td>
                          <td className="py-4 text-right pr-4 text-slate-500 text-sm">{new Date(school.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </motion.div>
          )}

          {/* TAB: GLOBAL LOGS (NEW) */}
          {activeTab === 'support' && <SuperAdminSupport />}

          {activeTab === 'logs' && (
             <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm shadow-2xl">
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-cyan-400" /> Traces Systèmes (Logs)
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" placeholder="Rechercher par cible, action, IP..." 
                        value={logSearch} onChange={(e) => setLogSearch(e.target.value)}
                        className="w-full bg-black/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-mono"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <select 
                        value={logFilter} onChange={(e) => setLogFilter(e.target.value)}
                        className="bg-black/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none font-mono"
                      >
                        <option value="All">TOUS LES NIVEAUX</option>
                        <option value="INFO">INFO</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="WARNING">WARNING</option>
                        <option value="ERROR">ERROR</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Logs Table */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-sm shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/[0.02] border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          <SortableHeader label="Horodatage" sortKey="timestamp" sortConfig={sortConfig} handleSort={handleSort} />
                          <SortableHeader label="Niveau" sortKey="level" sortConfig={sortConfig} handleSort={handleSort} />
                          <SortableHeader label="Cible / École" sortKey="user" sortConfig={sortConfig} handleSort={handleSort} />
                          <SortableHeader label="Action Système" sortKey="action" sortConfig={sortConfig} handleSort={handleSort} />
                          <SortableHeader label="Adresse IP" sortKey="ip" align="right" sortConfig={sortConfig} handleSort={handleSort} />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        <AnimatePresence mode="popLayout">
                          {processedLogs.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="p-8 text-center text-slate-500 font-mono">
                                &gt;_ Aucun log correspondant trouvé.
                              </td>
                            </tr>
                          ) : (
                            processedLogs.map((log) => (
                              <motion.tr key={log.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-white/[0.02] transition-colors font-mono text-sm">
                                <td className="p-4 pl-4 text-slate-400 text-xs">{log.timestamp}</td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getLevelStyle(log.level)}`}>
                                    {log.level}
                                  </span>
                                </td>
                                <td className="p-4 text-slate-300 truncate max-w-[150px]">{log.user}</td>
                                <td className="p-4">
                                  <span className="text-white block">{log.action}</span>
                                  <span className="text-xs text-slate-500 block mt-0.5 truncate max-w-xs">{log.details}</span>
                                </td>
                                <td className="p-4 pr-4 text-right text-slate-500 text-xs">{log.ip}</td>
                              </motion.tr>
                            ))
                          )}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </div>

             </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default SuperAdminDashboard;