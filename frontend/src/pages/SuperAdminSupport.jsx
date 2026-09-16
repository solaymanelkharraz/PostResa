import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Phone, CheckCircle, Clock } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SuperAdminSupport = () => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['support_messages'],
    queryFn: async () => (await api.get('/support')).data
  });

  const resolveMutation = useMutation({
    mutationFn: async (id) => await api.put('/support/' + id),
    onSuccess: () => {
      toast.success('Marque comme resolu !');
      queryClient.invalidateQueries(['support_messages']);
    }
  });

  if (isLoading) return <div className="p-8 text-slate-400">Chargement...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-cyan-400" /> Tickets de Support
      </h2>

      {messages.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
          Aucun message de support pour le moment.
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map(msg => (
            <div key={msg.id} className={'bg-slate-900 border ' + (msg.status === 'resolved' ? 'border-emerald-500/30' : 'border-slate-800') + ' rounded-2xl p-6 transition-all relative overflow-hidden'}>
              {msg.status === 'resolved' && (
                <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Resolu
                </div>
              )}
              {msg.status === 'pending' && (
                <div className="absolute top-0 right-0 bg-orange-500/10 text-orange-400 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Clock className="w-3 h-3" /> En attente
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mt-2">
                <div className="flex-1">
                  <p className="text-white text-lg leading-relaxed mb-4">{msg.message}</p>
                  <p className="text-xs text-slate-500">{new Date(msg.created_at).toLocaleString()}</p>
                </div>

                <div className="bg-slate-950/50 rounded-xl p-4 min-w-[250px] border border-white/5">
                  <p className="text-sm font-bold text-slate-300 mb-1">{msg.admin?.name}</p>
                  <p className="text-xs text-slate-500 mb-3">{msg.admin?.email}</p>
                  
                  {msg.admin?.metadata?.phone ? (
                    <a href={'tel:' + msg.admin.metadata.phone} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg text-sm font-medium transition-colors">
                      <Phone className="w-4 h-4" /> Appeler: {msg.admin.metadata.phone}
                    </a>
                  ) : (
                    <div className="w-full text-center px-4 py-2 bg-slate-800 text-slate-500 rounded-lg text-sm">
                      Aucun numero
                    </div>
                  )}

                  {msg.status === 'pending' && (
                    <button 
                      onClick={() => resolveMutation.mutate(msg.id)}
                      className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Marquer comme resolu
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuperAdminSupport;
