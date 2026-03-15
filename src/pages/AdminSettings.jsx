import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminSettings = () => {
  const [autoApproveProf, setAutoApproveProf] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" /> Paramètres de la Plateforme
        </h2>
        <p className="text-sm text-slate-400 mt-1">Configurez les règles globales et les préférences de sécurité de l'établissement.</p>
      </div>

      <div className="space-y-6">
        
        {/* Reservation Rules */}
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <CheckCircle className="w-5 h-5 text-emerald-400" /> Règles de Réservation
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Approbation Auto (Professeurs)</p>
                <p className="text-xs text-slate-500 mt-1">Valider automatiquement les demandes faites par le corps professoral.</p>
              </div>
              <button 
                onClick={() => setAutoApproveProf(!autoApproveProf)}
                className={`w-12 h-6 rounded-full transition-colors relative ${autoApproveProf ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${autoApproveProf ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <p className="font-bold text-white">Délai maximum de réservation</p>
                <p className="text-xs text-slate-500 mt-1">Combien de jours à l'avance un étudiant peut-il réserver ?</p>
              </div>
              <select className="bg-black/50 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-indigo-500">
                <option value="7">7 Jours</option>
                <option value="14">14 Jours</option>
                <option value="30">1 Mois</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & System */}
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <Shield className="w-5 h-5 text-rose-400" /> Sécurité & Système
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Mode Maintenance (Vacances)</p>
                <p className="text-xs text-slate-500 mt-1">Bloque toutes les nouvelles réservations. Affiche un message aux utilisateurs.</p>
              </div>
              <button 
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-rose-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <p className="font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-400" /> Alertes Email (Direction)
                </p>
                <p className="text-xs text-slate-500 mt-1">Recevoir un email pour chaque nouvelle demande de réservation.</p>
              </div>
              <button 
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-12 h-6 rounded-full transition-colors relative ${emailAlerts ? 'bg-indigo-600' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${emailAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/20">
            Sauvegarder les paramètres
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default AdminSettings;