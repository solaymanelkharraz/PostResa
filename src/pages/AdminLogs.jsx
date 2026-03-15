import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Search, Filter, ShieldAlert, CheckCircle, Clock, Server } from 'lucide-react';

// --- Mock Data ---
const SYSTEM_LOGS = [
  { id: 101, timestamp: "15-03-2026 14:32:01", user: "Karim Azeggouar", role: "Admin", action: "Réservation Approuvée", details: "Salle Info 1 validée pour Soulayman E.", type: "success", ip: "192.168.1.45" },
  { id: 102, timestamp: "15-03-2026 14:15:22", user: "Système", role: "Auto", action: "Synchronisation Planning", details: "Fichier 'Semaine_18.xlsx' importé", type: "info", ip: "Server" },
  { id: 103, timestamp: "15-03-2026 11:05:00", user: "Omar Etudiant", role: "Stagiaire", action: "Connexion Échouée", details: "Mot de passe incorrect (3ème tentative)", type: "warning", ip: "105.154.22.10" },
  { id: 104, timestamp: "14-03-2026 09:30:15", user: "Système", role: "Auto", action: "Blocage Sécurité", details: "Tentative d'accès non autorisé (/admin)", type: "danger", ip: "45.22.19.102" },
  { id: 105, timestamp: "14-03-2026 08:15:00", user: "M. Tazi", role: "Professeur", action: "Demande Réservation", details: "Atelier Réseau demandé", type: "info", ip: "192.168.1.12" },
];

const AdminLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const getTypeStyle = (type) => {
    switch(type) {
      case 'success': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'danger': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-indigo-400" /> Journaux Système (Logs)
          </h2>
          <p className="text-sm text-slate-400 mt-1">Traçabilité complète des actions effectuées sur la plateforme.</p>
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" placeholder="Rechercher IP, utilisateur, action..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-mono"
            />
          </div>
          <button className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors border border-white/10">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Horodatage</th>
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Action</th>
                <th className="p-4">Détails</th>
                <th className="p-4 pr-6 text-right">Adresse IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-sm">
              {SYSTEM_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 pl-6 text-slate-400 text-xs">
                    {log.timestamp}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-300 font-sans">{log.user}</span>
                    <span className="ml-2 text-[10px] text-slate-500 uppercase tracking-wider font-sans bg-white/5 px-1.5 py-0.5 rounded">{log.role}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getTypeStyle(log.type)} font-sans`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-sans text-xs truncate max-w-xs">
                    {log.details}
                  </td>
                  <td className="p-4 pr-6 text-right text-slate-500 text-xs">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/5 text-center">
          <button className="text-xs text-indigo-400 hover:text-white font-bold transition-colors">
            Charger l'historique complet
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogs;