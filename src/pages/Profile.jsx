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
  Camera, 
  Calendar,
  Clock,
  BookOpen
} from 'lucide-react';

const Profile = () => {
  const [notifications, setNotifications] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="pb-10 max-w-5xl mx-auto"
    >
      <div className="mb-10 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
        <p className="text-sm text-slate-400">Gérez votre compte et consultez votre emploi du temps.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Left Column: Identity, Stats & Timetable --- */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* ID Card */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl relative group">
            <div className="h-32 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 relative">
               <button className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100">
                  <Camera className="w-4 h-4" />
               </button>
            </div>
            
            <div className="px-8 pb-8 relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-3xl absolute -top-12 border-4 border-slate-950 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                SE
              </div>
              
              <div className="pt-16">
                <h2 className="text-2xl font-bold text-white tracking-tight">Soulayman Elkharraz</h2>
                <div className="inline-block mt-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                  Stagiaire
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="p-2 bg-white/5 rounded-lg"><Mail className="w-4 h-4 text-slate-300" /></div>
                  <span className="truncate">soulayman@ofppt.ma</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="p-2 bg-white/5 rounded-lg"><Building2 className="w-4 h-4 text-slate-300" /></div>
                  <span className="truncate">ISTA NTIC Tangier</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emploi du Temps (Timetable Widget) */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Mon Emploi du Temps
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-black/20 rounded-xl border border-white/5 border-l-2 border-l-indigo-500">
                <p className="text-xs text-indigo-400 font-bold mb-1">Aujourd'hui • 08:30 - 11:00</p>
                <p className="text-sm font-bold text-white">Développement Front-end</p>
                <p className="text-xs text-slate-400 mt-1">Salle Informatique 1 • M. El Kharraz</p>
              </div>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all border border-white/5">
                Voir tout le planning
              </button>
            </div>
          </div>

          {/* Quick Stats (Only Reservation Data) */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl flex gap-4 text-center">
            <div className="flex-1 p-4 bg-black/20 rounded-2xl border border-white/5">
              <Calendar className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Approuvées</div>
            </div>
            <div className="flex-1 p-4 bg-black/20 rounded-2xl border border-white/5">
              <Clock className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">En attente</div>
            </div>
          </div>

        </div>

        {/* --- Right Column: Settings --- */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
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
              
              <div className="pt-4 flex justify-end">
                <button className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-900/20 active:scale-95">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
              <Shield className="w-5 h-5 text-purple-400" /> Sécurité & Préférences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Bell className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-bold text-white">Notifications</p>
                    <p className="text-xs text-slate-500 mt-1">Soyez alerté quand votre réservation est approuvée.</p>
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
                    <p className="text-xs text-slate-500 mt-1">Modifiez vos accès de sécurité.</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors px-4 py-2 rounded-lg group-hover:bg-white/5">
                  Modifier
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-2">
            <button className="w-full flex items-center justify-center gap-2 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-2xl text-sm font-bold transition-all border border-rose-500/20 group">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Déconnexion
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Profile;