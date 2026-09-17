import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, CalendarDays, MapPin, Clock, Plus,
  CheckCircle, Clock as ClockIcon, XCircle, FileText,
  MessageSquare, User, LogOut, Bell, Search, GraduationCap
} from 'lucide-react';
import ProfSchedule from './ProfSchedule';
import ProfFeed from './ProfFeed';

// --- Mock Data for M. Tazi ---
const NEXT_CLASS = { subject: "Bases de Données (MySQL)", group: "Dev Digital 202", room: "Salle Info 3", time: "14:30 - 17:00", type: "Cours" };

const MY_RESERVATIONS = [
  { id: 1, room: "Atelier Réseau", date: "18 Mars 2026", time: "08:30 - 12:30", purpose: "Examen Pratique (DD201)", status: "Approuvée" },
  { id: 2, room: "Amphi A", date: "20 Mars 2026", time: "14:00 - 16:00", purpose: "Conférence Tech", status: "En attente" },
];

const RECENT_POSTS = [
  { id: 1, author: "Direction", role: "Admin", content: "Les notes du premier semestre doivent être saisies avant vendredi.", time: "Il y a 2h" },
];

const ProfDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Helper for reservation status badge
  const getStatusBadge = (status) => {
    if (status === 'Approuvée') return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approuvée</span>;
    if (status === 'En attente') return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><ClockIcon className="w-3 h-3" /> En attente</span>;
    return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><XCircle className="w-3 h-3" /> Refusée</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex selection:bg-blue-500 selection:text-white">

      {/* --- Sidebar --- */}
      <aside className="w-64 bg-slate-900/40 border-r border-white/5 flex-shrink-0 fixed h-full z-20 hidden lg:block backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3 mb-6 border-b border-white/5">
          <img src="/logo.png" alt="PostResa Logo" className="w-10 h-10 object-contain rounded-xl" />
          <div>
            <h1 className="font-bold text-white tracking-tight leading-none">POSTRESA</h1>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Espace Professeur</span>
          </div>
        </div>

        <div className="px-3 space-y-1">
          <SidebarItem icon={<BookOpen />} label="Mon Tableau de Bord" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<CalendarDays />} label="Mon Planning" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
          <SidebarItem icon={<MapPin />} label="Mes Réservations" active={activeTab === 'reservations'} onClick={() => setActiveTab('reservations')} badge="1" />
          <SidebarItem icon={<MessageSquare />} label="Actualités Campus" active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-3 px-4 py-3 bg-black/40 rounded-xl border border-white/5 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">MT</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">M. Tazi</p>
              <p className="text-[10px] text-slate-400 truncate">prof@ecole.com</p>
            </div>
          </div>
          <button onClick={() => window.location.href = '/auth'} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-rose-400 hover:text-white hover:bg-rose-500/10 rounded-xl transition-colors text-xs font-bold">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto h-screen">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {activeTab === 'overview' && 'Bonjour, M. Tazi'}
              {activeTab === 'schedule' && 'Mon Planning Hebdomadaire'}
              {activeTab === 'reservations' && 'Gestion des Réservations'}
              {activeTab === 'feed' && 'Fil d\'Actualités'}
            </h1>
            <p className="text-slate-400 text-sm">Département Développement Digital</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5 border border-white/5">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 border-2 border-slate-950 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

            {/* --- DASHBOARD OVERVIEW --- */}
            {activeTab === 'overview' && (
              <div className="space-y-8">

                {/* Top Row: Next Class & Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Next Class Card (Takes up 2 columns) */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-blue-400 font-bold mb-6">
                        <Clock className="w-5 h-5" /> Prochain Cours
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">{NEXT_CLASS.subject}</h2>
                      <div className="flex flex-wrap items-center gap-6 text-slate-300 mt-6">
                        <span className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl border border-white/5"><GraduationCap className="w-5 h-5 text-indigo-400" /> {NEXT_CLASS.group}</span>
                        <span className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl border border-white/5"><MapPin className="w-5 h-5 text-emerald-400" /> {NEXT_CLASS.room}</span>
                        <span className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl border border-white/5 text-amber-400 font-bold">{NEXT_CLASS.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Box */}
                  <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-center">
                    <h3 className="font-bold text-white mb-4 text-center">Besoin d'une salle ?</h3>
                    <p className="text-sm text-slate-400 text-center mb-6">Réservez un espace pour un examen de rattrapage ou une réunion.</p>
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Nouvelle Réservation
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Recent Reservations & Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* My Reservations */}
                  <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-white flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-400" /> Mes Demandes Récentes</h3>
                      <button onClick={() => setActiveTab('reservations')} className="text-xs text-blue-400 hover:text-white transition-colors">Tout voir</button>
                    </div>
                    <div className="space-y-3">
                      {MY_RESERVATIONS.map(res => (
                        <div key={res.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-white text-sm">{res.room}</h4>
                            <p className="text-xs text-slate-400 mt-1">{res.date} • {res.time}</p>
                          </div>
                          {getStatusBadge(res.status)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Feed */}
                  <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-400" /> Annonces Campus</h3>
                      <button onClick={() => setActiveTab('feed')} className="text-xs text-blue-400 hover:text-white transition-colors">Aller au fil</button>
                    </div>
                    <div className="space-y-4">
                      {RECENT_POSTS.map(post => (
                        <div key={post.id} className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold uppercase">{post.role}</span>
                            <span className="text-xs text-slate-400">{post.time}</span>
                          </div>
                          <p className="text-sm text-slate-200">"{post.content}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- RESERVATIONS TAB --- */}
            {activeTab === 'reservations' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-slate-900/40 border border-white/5 p-6 rounded-3xl shadow-xl">
                  <div>
                    <h2 className="text-lg font-bold text-white">Historique de vos réservations</h2>
                    <p className="text-sm text-slate-400">Suivez l'état de validation de vos demandes par la direction.</p>
                  </div>
                  <button onClick={() => setIsBookingModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all">
                    <Plus className="w-4 h-4" /> Réserver une salle
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {MY_RESERVATIONS.map(res => (
                    <div key={res.id} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-900/60 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusBadge(res.status)}
                          <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-black/30 rounded-md border border-white/5">{res.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{res.room}</h3>
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500" /> {res.time}
                        </p>
                      </div>
                      <div className="bg-black/30 p-3 rounded-xl border border-white/5 w-full sm:w-auto text-sm text-slate-300">
                        <strong className="text-slate-500">Motif:</strong> {res.purpose}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Injected Components */}
            {activeTab === 'schedule' && <ProfSchedule />}
            {activeTab === 'feed' && <ProfFeed />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- NEW RESERVATION MODAL --- */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-slate-900/50">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-400" /> Nouvelle Réservation
                </h3>
                <button onClick={() => setIsBookingModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><XCircle className="w-6 h-6" /></button>
              </div>

              <form className="p-6 space-y-5" onSubmit={(e) => { e.preventDefault(); setIsBookingModalOpen(false); }}>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Espace / Salle souhaitée</label>
                  <select required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none">
                    <option value="">Sélectionnez une salle...</option>
                    <option>Amphi A</option>
                    <option>Atelier Réseau</option>
                    <option>Salle Info 1</option>
                    <option>Salle Info 3</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
                    <input required type="date" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500 style-color-scheme-dark" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Créneau</label>
                    <select required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none">
                      <option>08:30 - 11:00</option>
                      <option>11:00 - 13:30</option>
                      <option>14:30 - 17:00</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Motif de la réservation</label>
                  <input required type="text" placeholder="Ex: Examen de rattrapage, Réunion..." className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 mt-2">
                  <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <p className="text-xs text-blue-200 leading-relaxed">
                    Votre demande sera envoyée à la Direction. Vous recevrez une notification dès qu'elle sera traitée.
                  </p>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsBookingModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all">
                    Annuler
                  </button>
                  <button type="submit" className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
                    Soumettre la demande
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-medium'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
  >
    {React.cloneElement(icon, { size: 18 })}
    <span className="text-sm flex-1 text-left">{label}</span>
    {badge && (
      <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

export default ProfDashboard;