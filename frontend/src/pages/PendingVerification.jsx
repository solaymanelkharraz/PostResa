import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutLocal } from '../store/slices/authSlice';

const PendingVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutLocal());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-purple-500 selection:text-white relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg bg-slate-900/60 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 text-center"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/20 mb-6">
          <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Compte en Attente de Validation</h1>
        
        <p className="text-slate-400 leading-relaxed mb-8">
          Votre dossier d'établissement a bien été reçu. Vous êtes actuellement en attente de la vérification physique de vos locaux par nos équipes.
        </p>

        <div className="flex items-start gap-3 text-left bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-8">
          <ShieldAlert className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-300">
            Votre tableau de bord complet sera automatiquement déverrouillé dès que le Super Admin aura validé votre école.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all border border-white/10"
          >
            Retour à l'accueil
          </button>
          <button 
            onClick={handleLogout} 
            className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-bold transition-all border border-red-500/20"
          >
            Déconnexion
          </button>
        </div>
      </motion.div>

    </div>
  );
};

export default PendingVerification;
