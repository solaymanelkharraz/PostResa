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
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AdminSchedule = () => {
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await api.get('/schedules');
      return res.data;
    }
  });

  const { data: planningFiles = [] } = useQuery({
    queryKey: ['planningFiles'],
    queryFn: async () => {
      const res = await api.get('/planning-files');
      return res.data;
    }
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/planning-files/${id}`);
    },
    onSuccess: () => {
      toast.success('Planning supprimé');
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.invalidateQueries({ queryKey: ['planningFiles'] });
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  const handleDeleteFile = (id) => {
    deleteFileMutation.mutate(id);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupName) => {
      const toDelete = schedules.filter(s => s.group_name === groupName);
      await Promise.all(toDelete.map(s => api.delete(`/schedules/${s.id}`)));
    },
    onSuccess: (_, groupName) => {
      toast.success(`Planning de ${groupName} supprimé`);
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.invalidateQueries({ queryKey: ['planningFiles'] });
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    }
  });

  const handleDeleteGroup = (groupName) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le planning du groupe ${groupName} ?`)) return;
    deleteGroupMutation.mutate(groupName);
  };

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await api.post('/schedules/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Fichier uploadé avec succès!');
      setUploadSuccess(true);
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.invalidateQueries({ queryKey: ['planningFiles'] });
    },
    onError: () => {
      toast.error('Erreur lors de l\'upload du fichier');
    }
  });

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    uploadMutation.mutate(formData);
  };

  const isUploading = uploadMutation.isPending;

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
                    <th className="px-3 py-2 font-bold">Group</th>
                    <th className="px-3 py-2 font-bold">Subject</th>
                    <th className="px-3 py-2 font-bold">Teacher Email</th>
                    <th className="px-3 py-2 font-bold">Space</th>
                    <th className="px-3 py-2 font-bold">Day</th>
                    <th className="px-3 py-2 font-bold">Start Time</th>
                    <th className="px-3 py-2 font-bold">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border-b border-blue-500/10">Dev Digital 202</td>
                    <td className="px-3 py-2 border-b border-blue-500/10">React Advanced</td>
                    <td className="px-3 py-2 border-b border-blue-500/10">yassine@razzi.ma</td>
                    <td className="px-3 py-2 border-b border-blue-500/10">Salle Info 1</td>
                    <td className="px-3 py-2 border-b border-blue-500/10">Lundi</td>
                    <td className="px-3 py-2 border-b border-blue-500/10">08:30:00</td>
                    <td className="px-3 py-2 border-b border-blue-500/10">11:00:00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button 
              onClick={() => {
                const csvData = "Group,Subject,Teacher Email,Space,Day,Start Time,End Time,Type,Modality\nDev Digital 202,React Advanced,yassine@razzi.ma,Salle Info 1,Lundi,08:30:00,11:00:00,Cours,Présentiel\n";
                const blob = new Blob([csvData], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'template_planning.csv';
                a.click();
              }}
              className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" /> Télécharger le template .csv
            </button>
          </div>

          {/* Active Schedules List */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="font-bold text-white mb-4">Plannings Actifs</h3>
            
            <div className="space-y-3">
              {planningFiles.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Aucun planning importé.</p>
              ) : (
                planningFiles.map(file => (
                  <div key={file.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><FileSpreadsheet className="w-5 h-5" /></div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{file.filename}</h4>
                        <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Actif • {file.slots_count} Créneaux
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteFile(file.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default AdminSchedule;
