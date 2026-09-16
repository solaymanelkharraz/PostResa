import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Search, MessageCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const StudentGroup = () => {
  const { user } = useSelector(state => state.auth);
  const [search, setSearch] = useState("");

  const userGroup = user?.group;

  const { data: classmates = [], isLoading: loading } = useQuery({
    queryKey: ['classmates', userGroup],
    queryFn: async () => {
      const res = await api.get(`/users?group=${userGroup}`);
      return res.data.filter(u => u.id !== user.id);
    },
    enabled: !!userGroup && !!user,
  });

  const filteredClassmates = classmates.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-400" /> Mon Groupe: {user?.group}
        </h1>
        <p className="text-sm text-slate-400 mb-6">Retrouvez tous vos camarades de classe.</p>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Camarades de Classe ({classmates.length})</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Chercher..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 bg-black/50 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-emerald-500 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredClassmates.map(c => (
            <div key={c.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 flex-shrink-0 rounded-full bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 flex items-center justify-center font-bold text-base">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors truncate">{c.name}</p>
                  <p className="text-xs text-slate-400 truncate">{c.email}</p>
                </div>
              </div>
              <Link to="/dashboard/messages" state={{ activeChat: c }} className="p-2.5 flex-shrink-0 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-emerald-500 transition-all" title="Message">
                <MessageCircle className="w-4 h-4" />
              </Link>
            </div>
          ))}
          {filteredClassmates.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-500 text-sm">Aucun camarade trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentGroup;