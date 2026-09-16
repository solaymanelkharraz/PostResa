import React, { useState } from 'react';
import { Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminSupport = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post('/support', { message });
      toast.success(res.data.message || "Message envoye avec succes !");
      setMessage('');
    } catch (err) {
      toast.error("Erreur lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Contacter le Super Admin</h2>
            <p className="text-slate-400 mt-1">Besoin d'aide technique ou d'une nouvelle fonctionnalite ?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Votre Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[150px] resize-none"
              placeholder="Decrivez votre probleme ou votre besoin ici..."
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Nous vous contacterons par telephone dans les plus brefs delais.
            </p>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Envoi...' : (
                <>Envoyer <Send className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSupport;
