import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarClock, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Trash2,
  Info
} from 'lucide-react';

const AdminSchedule = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Simulating the drag and drop / file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  // Simulating the upload process to Laravel
  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    
    // Fake a 2-second upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setFile(null); // Clear the file after success
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* --- Header --- */}
      <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-indigo-400" />
          Emplois du Temps Fixes
        </h2>
        <p className="text-sm text-slate-400 mt-1">Importez le planning officiel pour bloquer automatiquement les salles occupées.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- Left Column: Upload Area --- */}
        <div className="space-y-6">
          
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl text-center relative overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-6">Importer un Planning</h3>

            <AnimatePresence mode="wait">
              {!uploadSuccess ? (
                <motion.div 
                  key="upload-zone"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Drop Zone */}
                  <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${
                    file ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-indigo-500/50 bg-black/20 hover:bg-black/40'
                  }`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                      {file ? (
                        <FileSpreadsheet className="w-12 h-12 text-indigo-400 mb-3" />
                      ) : (
                        <UploadCloud className="w-12 h-12 text-slate-500 group-hover:text-indigo-400 mb-3 transition-colors" />
                      )}
                      
                      <p className="text-sm text-slate-300 font-medium mb-1">
                        {file ? file.name : "Cliquez ou glissez-déposez votre fichier"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {file ? `${(file.size / 1024).toFixed(1)} KB` : "Excel (.xlsx) ou CSV pris en charge"}
                      </p>
                    </div>
                    <input type="file" className="hidden" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} />
                  </label>

                  <button 
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      !file 
                        ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                        : isUploading 
                          ? 'bg-indigo-600/50 text-white cursor-wait' 
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/30 active:scale-[0.98]'
                    }`}
                  >
                    {isUploading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Traitement en cours...</>
                    ) : (
                      <><UploadCloud className="w-4 h-4" /> Envoyer vers la base de données</>
                    )}
                  </button>
                </motion.div>
              ) : (
                /* Success Message */
                <motion.div 
                  key="success-zone"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="py-10 flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Importation Réussie !</h3>
                  <p className="text-sm text-slate-400 mb-6">142 créneaux ont été générés et bloqués dans le système.</p>
                  <button 
                    onClick={() => setUploadSuccess(false)}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Importer un autre fichier
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* --- Right Column: Instructions & History --- */}
        <div className="space-y-6">
          
          {/* Format Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-400" /> Format Requis (Template)
            </h3>
            <p className="text-sm text-blue-200/70 mb-4 leading-relaxed">
              Pour que le système reconnaisse automatiquement les créneaux, votre fichier Excel doit contenir les colonnes exactes suivantes :
            </p>
            <div className="bg-black/30 border border-blue-500/10 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs text-blue-100 whitespace-nowrap">
                <thead>
                  <tr className="bg-blue-500/20 border-b border-blue-500/20">
                    <th className="px-3 py-2 font-bold">Jour</th>
                    <th className="px-3 py-2 font-bold">Heure_Debut</th>
                    <th className="px-3 py-2 font-bold">Heure_Fin</th>
                    <th className="px-3 py-2 font-bold">Salle</th>
                    <th className="px-3 py-2 font-bold">Professeur</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border-b border-blue-500/10">Lundi</td>
                    <td className="px-3 py-2 border-b border-blue-500/10">08:30</td>
                    <td className="px-3 py-2 border-b border-blue-500/10">11:00</td>
                    <td className="px-3 py-2 border-b border-blue-500/10">Salle Info 1</td>
                    <td className="px-3 py-2 border-b border-blue-500/10">El Kharraz</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Mardi</td>
                    <td className="px-3 py-2">14:30</td>
                    <td className="px-3 py-2">17:00</td>
                    <td className="px-3 py-2">Atelier Réseau</td>
                    <td className="px-3 py-2">Tazi</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-white transition-colors">
              <Download className="w-4 h-4" /> Télécharger le template .xlsx
            </button>
          </div>

          {/* Active Schedules List */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="font-bold text-white mb-4">Plannings Actifs</h3>
            
            <div className="space-y-3">
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><FileSpreadsheet className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Planning_Semaine_18Mars.xlsx</h4>
                    <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> Actif • 142 Créneaux
                    </p>
                  </div>
                </div>
                <button className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-500/10 rounded-lg text-slate-500"><FileSpreadsheet className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 line-through">Planning_Semaine_11Mars.xlsx</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Expiré / Archivé</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default AdminSchedule;