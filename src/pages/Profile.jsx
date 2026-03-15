import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Building2, 
  Bell, 
  Shield, 
  Key, 
  LogOut, 
  Camera
} from 'lucide-react';

const Profile = () => {
  const [notifications, setNotifications] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="pb-10 max-w-4xl mx-auto"
    >
      <div className="mb-8 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
        <p className="text-sm text-slate-400">Gérez vos informations personnelles et vos paramètres de sécurité.</p>
      </div>

      {/* --- Top Section: Spacious Horizontal ID Banner --- */}
      <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl mb-8 relative">
        <div className="h-40 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 relative group">
            <button className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100">
              <Camera className="w-4 h-4" />
            </button>
        </div>
        
        <div className="px-8 pb-8 sm:flex sm:items-end sm:gap-6 relative -mt-12">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-3xl border-8 border-slate-950 flex items-center justify-center text-4xl font-bold text-white shadow-xl flex-shrink-0">
            SE
          </div>
          
          <div className="mt-4 sm:mt-0 pt-2 flex-1">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Soulayman Elkharraz</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <div className="inline-block px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-bold uppercase tracking-wider rounded-lg">
                Stagiaire
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" /> soulayman@ofppt.ma
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" /> ISTA NTIC Tangier
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Section: Stacked Settings --- */}
      <div className="space-y-8">
        
        {/* Personal Info Form */}
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
            <User className="w-5 h-5 text-purple-400" /> Informations Personnelles
          </h3>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Prénom</label>
                <input type="text" defaultValue="Soulayman" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nom</label>
                <input type="text" defaultValue="Elkharraz" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email (Lecture Seule)</label>
              <input type="email" defaultValue="soulayman@ofppt.ma" readOnly className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-600 cursor-not-allowed" />
            </div>
            
            <div className="pt-2 flex justify-end">
              <button className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-900/20 active:scale-95">
                Enregistrer
              </button>
            </div>
          </form>
        </div>

        {/* Security & Preferences */}
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
              <Shield className="w-5 h-5 text-purple-400" /> Sécurité & Préférences
          </h3>
          
          <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Bell className="w-5 h-5" /></div>
                    <div>
                    <p className="text-sm font-bold text-white">Notifications</p>
                    <p className="text-xs text-slate-500 mt-1">Alertes de réservation.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-purple-600' : 'bg-slate-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400"><Key className="w-5 h-5" /></div>
                    <div>
                    <p className="text-sm font-bold text-white">Mot de passe</p>
                    <p className="text-xs text-slate-500 mt-1">Gérer la sécurité.</p>
                    </div>
                </div>
                <button className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors px-4 py-2 rounded-lg group-hover:bg-white/5">
                    Modifier
                </button>
              </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <button className="w-full flex items-center justify-center gap-2 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-3xl text-sm font-bold transition-all border border-rose-500/20 group">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Déconnexion
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default Profile;