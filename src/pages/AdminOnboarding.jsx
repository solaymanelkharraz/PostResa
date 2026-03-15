import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Phone, Users, MonitorPlay, UploadCloud, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

const AdminOnboarding = () => {
  // State to simulate moving from Step 3 (Form) to Step 4 (Waiting for physical visit)
  const [step, setStep] = useState(3); 
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    if(e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, Omar will eventually wire this up to Laravel to update the school's status
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-purple-500 selection:text-white">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-slate-900/60 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* Decorative background glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-900/50">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-3">
            Espace Établissement
          </h1>
          {step === 3 ? (
            <p className="text-slate-400 max-w-lg mx-auto">
              Bienvenue ! Pour débloquer l'espace de travail de votre école sur POSTRESA, veuillez compléter votre vérification légale.
            </p>
          ) : (
            <p className="text-emerald-400 font-medium flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" /> Documents reçus avec succès
            </p>
          )}
        </div>

        {/* Step 3: Digital Verification Form */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Adresse Physique</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input required type="text" placeholder="Ex: Quartier Administratif, Tanger" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Téléphone Direction</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input required type="tel" placeholder="+212 6XX XX XX XX" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all" />
                </div>
              </div>
            </div>

            {/* Estimates Grid */}
            <div className="bg-black/30 border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" /> Estimations de la capacité
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-500 ml-1">Nombre de Stagiaires</label>
                  <input required type="number" min="1" placeholder="Ex: 1200" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 ml-1">Nombre de Profs</label>
                  <input required type="number" min="1" placeholder="Ex: 45" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 ml-1">Nombre d'Espaces</label>
                  <input required type="number" min="1" placeholder="Ex: 30" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 mt-1" />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Document d'autorisation (PDF ou Image)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl cursor-pointer bg-black/20 hover:bg-black/40 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-purple-400 mb-3 transition-colors" />
                  <p className="text-sm text-slate-400">
                    {fileName ? <span className="text-purple-400 font-medium">{fileName}</span> : "Cliquez pour uploader le papier officiel de l'établissement"}
                  </p>
                </div>
                <input required type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} />
              </label>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-900/30 active:scale-[0.98] transition-all">
              Soumettre pour vérification
            </button>
          </form>
        )}

        {/* Step 4: The Physical Visit & Contract Screen */}
        {step === 4 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 py-8 relative z-10"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/20 mb-2">
              <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
            </div>
            
            <div className="space-y-3 max-w-lg mx-auto bg-black/30 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white">Vérification Physique en Cours</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Un représentant de POSTRESA visitera prochainement vos locaux à l'adresse indiquée pour vérifier les installations et procéder à la signature du contrat final.
              </p>
            </div>

            <div className="flex items-start gap-3 text-left bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl max-w-lg mx-auto">
              <ShieldAlert className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-300">
                Votre tableau de bord complet (gestion des réservations, emplois du temps, et professeurs) sera automatiquement déverrouillé dès que le Super Admin aura validé la visite sur le terrain.
              </p>
            </div>

            <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all border border-white/10">
              Retour à l'accueil
            </button>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
};

export default AdminOnboarding;