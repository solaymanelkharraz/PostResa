import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    auto_approve_prof: false,
    maintenance_mode: false,
    email_alerts: true,
    max_reservation_days: 7
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (Object.keys(res.data).length > 0) {
          setSettings({
            auto_approve_prof: res.data.auto_approve_prof === "true",
            maintenance_mode: res.data.maintenance_mode === "true",
            email_alerts: res.data.email_alerts === "true",
            max_reservation_days: parseInt(res.data.max_reservation_days || 7)
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/settings', {
        auto_approve_prof: settings.auto_approve_prof,
        maintenance_mode: settings.maintenance_mode,
        email_alerts: settings.email_alerts,
        max_reservation_days: settings.max_reservation_days
      });
      toast.success("Paramètres mis à jour avec succès");
    } catch (error) {
      console.error("Failed to save settings", error);
      toast.error("Échec de la mise à jour des paramètres");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

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
                onClick={() => toggleSetting('auto_approve_prof')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.auto_approve_prof ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.auto_approve_prof ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <p className="font-bold text-white">Délai maximum de réservation</p>
                <p className="text-xs text-slate-500 mt-1">Combien de jours à l'avance un étudiant peut-il réserver ?</p>
              </div>
              <select 
                value={settings.max_reservation_days}
                onChange={(e) => setSettings(prev => ({ ...prev, max_reservation_days: parseInt(e.target.value) }))}
                className="bg-black/50 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={7}>7 Jours</option>
                <option value={14}>14 Jours</option>
                <option value={30}>1 Mois</option>
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
                onClick={() => toggleSetting('maintenance_mode')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenance_mode ? 'bg-rose-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.maintenance_mode ? 'translate-x-7' : 'translate-x-1'}`} />
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
                onClick={() => toggleSetting('email_alerts')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.email_alerts ? 'bg-indigo-600' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.email_alerts ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Sauvegarder les paramètres
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default AdminSettings;