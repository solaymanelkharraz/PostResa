import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Building, 
  Server, 
  Activity, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  ShieldCheck, 
  Database,
  Search,
  FileText
} from 'lucide-react';

// --- Mock Data simulating the Platform Database ---
const PLATFORM_STATS = [
  { label: "Écoles Actives", value: "1", status: "Opérationnel", icon: <Building className="w-5 h-5 text-cyan-400" />, color: "bg-cyan-500/10 border-cyan-500/20" },
  { label: "Utilisateurs Globaux", value: "1,240", status: "+12% ce mois", icon: <Globe className="w-5 h-5 text-blue-400" />, color: "bg-blue-500/10 border-blue-500/20" },
  { label: "Santé Serveur (Laravel)", value: "99.9%", status: "12ms ping", icon: <Server className="w-5 h-5 text-emerald-400" />, color: "bg-emerald-500/10 border-emerald-500/20" },
  { label: "Charge Base de Données", value: "24%", status: "Stable (MySQL+Mongo)", icon: <Database className="w-5 h-5 text-purple-400" />, color: "bg-purple-500/10 border-purple-500/20" },
];

const PENDING_SCHOOLS = [
  { 
    id: 1, 
    name: "ISTA Ibn Marfil", 
    city: "Tanger", 
    director: "M. Alaoui", 
    phone: "+212 600 11 22 33", 
    date: "14 Mars 2026", 
    doc: "autorisation_ibnmarfil.pdf",
    status: "Attente Visite Physique" 
  },
];

const ACTIVE_SCHOOLS = [
  { id: 2, name: "ISTA NTIC Tanger", city: "Tanger", users: 1240, status: "Active", joined: "01 Sep 2025" },
];

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('onboarding');
  const [pendingSchools, setPendingSchools] = useState(PENDING_SCHOOLS);

  const handleApproveSchool = (id) => {
    // In production: Laravel changes school status to 'active', emails the Director their password.
    setPendingSchools(pendingSchools.filter(school => school.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex selection:bg-cyan-500 selection:text-white">
      
      {/* --- Sidebar (Super Admin) --- */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex-shrink-0 fixed h-full z-20 hidden lg:block">
        <div className="p-6 flex items-center gap-3 mb-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]">S</div>
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

          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-8">Infrastructure</p>
          <button onClick={() => setActiveTab('servers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'servers' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
            <Activity className="w-4 h-4" /> Santé Système
          </button>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <button onClick={() => window.location.href = '/auth'} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white hover:bg-slate-900 rounded-xl transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" /> Quitter la console
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Console Master</h1>
            <p className="text-slate-400 text-sm">Gestion globale de l'infrastructure POSTRESA</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:block relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Rechercher école ou ID..." className="bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 text-white" />
             </div>
          </div>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {PLATFORM_STATS.map((stat, index) => (
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
          {activeTab === 'onboarding' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" /> Demandes d'Acquisition (Étape 5)
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Écoles en attente de validation après visite physique sur le terrain.</p>
                  </div>
                </div>
                
                <div className="p-6">
                  {pendingSchools.length === 0 ? (
                    <div className="text-center py-12 text-slate-600">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Aucune école en attente d'intégration.</p>
                    </div>
                  ) : (
                    pendingSchools.map((school) => (
                      <div key={school.id} className="bg-black/40 border border-slate-800 rounded-2xl p-6 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center hover:border-cyan-500/30 transition-colors">
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <h4 className="text-xl font-bold text-white">{school.name}</h4>
                            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider animate-pulse">
                              {school.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
                            <div><strong className="text-slate-300 block mb-1">Directeur:</strong> {school.director}</div>
                            <div><strong className="text-slate-300 block mb-1">Contact:</strong> {school.phone}</div>
                            <div><strong className="text-slate-300 block mb-1">Ville:</strong> {school.city}</div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-cyan-400 bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 w-fit">
                            <FileText className="w-4 h-4" /> Document reçu : <a href="#" className="underline hover:text-cyan-300">{school.doc}</a>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto border-t xl:border-t-0 xl:border-l border-slate-800 pt-6 xl:pt-0 xl:pl-6">
                          <button className="flex-1 xl:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                            <XCircle className="w-4 h-4 text-rose-400" /> Rejeter
                          </button>
                          <button 
                            onClick={() => handleApproveSchool(school.id)}
                            className="flex-1 xl:flex-none px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" /> Activer l'École
                          </button>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'schools' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm shadow-2xl">
                <h3 className="font-bold text-lg text-white mb-6">Écoles Déployées</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="pb-4 pl-4">Établissement</th>
                        <th className="pb-4">Ville</th>
                        <th className="pb-4">Utilisateurs</th>
                        <th className="pb-4">Statut</th>
                        <th className="pb-4 text-right pr-4">Déploiement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {ACTIVE_SCHOOLS.map(school => (
                        <tr key={school.id} className="hover:bg-white/[0.02]">
                          <td className="py-4 pl-4 font-bold text-white">{school.name}</td>
                          <td className="py-4 text-slate-400">{school.city}</td>
                          <td className="py-4 font-mono text-cyan-400">{school.users}</td>
                          <td className="py-4"><span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">{school.status}</span></td>
                          <td className="py-4 text-right pr-4 text-slate-500 text-sm">{school.joined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default SuperAdminDashboard;