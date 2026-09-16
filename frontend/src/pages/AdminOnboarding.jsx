import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Phone, Users, MonitorPlay, UploadCloud, CheckCircle, Clock, ShieldAlert, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminOnboarding = () => {
  const { user } = useSelector(state => state.auth);
  const [step, setStep] = useState(3); 
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    stagiaires_count: '',
    profs_count: '',
    spaces_count: ''
  });

  useEffect(() => {
    // If they have completed onboarding, move them directly to the pending page
    if (user?.status === 'pending' && user?.metadata?.address) {
      navigate('/pending');
    }
  }, [user, navigate]);

  const handleFileUpload = (e) => {
    if(e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Veuillez uploader le document d\'autorisation.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData to send file and data directly to our Laravel backend
      const submitData = new FormData();
      submitData.append('address', formData.address);
      submitData.append('phone', formData.phone);
      submitData.append('stagiaires_count', formData.stagiaires_count);
      submitData.append('profs_count', formData.profs_count);
      submitData.append('spaces_count', formData.spaces_count);
      submitData.append('document', file);
      
      // In Laravel, to submit files via PUT, we use a POST request with _method=PUT
      submitData.append('_method', 'PUT');

      await api.post('/onboarding', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Demande soumise avec succès !');
      navigate('/pending');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
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
                  <input 
                    required type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Ex: Quartier Administratif, Tanger" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all" 
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Téléphone Direction</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input 
                    required type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+212 6XX XX XX XX" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all" 
                  />
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
                  <input 
                    required type="number" min="1" 
                    value={formData.stagiaires_count}
                    onChange={(e) => setFormData({...formData, stagiaires_count: e.target.value})}
                    placeholder="Ex: 1200" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 mt-1" 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 ml-1">Nombre de Profs</label>
                  <input 
                    required type="number" min="1" 
                    value={formData.profs_count}
                    onChange={(e) => setFormData({...formData, profs_count: e.target.value})}
                    placeholder="Ex: 45" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 mt-1" 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 ml-1">Nombre d'Espaces</label>
                  <input 
                    required type="number" min="1" 
                    value={formData.spaces_count}
                    onChange={(e) => setFormData({...formData, spaces_count: e.target.value})}
                    placeholder="Ex: 30" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 mt-1" 
                  />
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
                <input required={!file} type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} />
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Soumettre pour vérification"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AdminOnboarding;