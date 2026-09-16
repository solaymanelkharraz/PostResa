import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Search, MessageCircle, ShieldAlert, UserSquare2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ProfDirectory = () => {
  const { user: currentUser } = useSelector(state => state.auth);
  const [search, setSearch] = useState("");

  const { data: staff = [], isLoading: loading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const res = await api.get('/users?role=staff');
      return res.data;
    }
  });

  const filteredStaff = staff.filter(u => u.id !== currentUser?.id && (u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase())));

  const admins = filteredStaff.filter(u => u.role === 'admin');
  const teachers = filteredStaff.filter(u => u.role === 'prof');

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <UserSquare2 className="w-8 h-8 text-indigo-400" /> Annuaire du Personnel
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          {currentUser?.role === 'admin' 
            ? "Annuaire complet de l'établissement." 
            : "Contactez l'administration et vos collègues enseignants."}
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Rechercher par nom..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-white shadow-inner"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Chargement...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Admins Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" /> Administration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              {admins.map(admin => (
                <div key={admin.id} className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-rose-500/30 transition-colors shadow-lg">
                  <div className="flex items-center gap-4 flex-1 min-w-0 mr-3">
                    <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-500 border border-rose-500/20 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {admin.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate">{admin.name}</p>
                      <p className="text-xs text-rose-400 font-medium truncate">Administrateur</p>
                    </div>
                  </div>
                  <Link to="/dashboard/messages" state={{ activeChat: admin }} className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-rose-500 transition-all flex-shrink-0" title="Contacter">
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                </div>
              ))}
              {admins.length === 0 && <p className="text-sm text-slate-500">Aucun administrateur trouvé.</p>}
            </div>
          </div>

          {/* Teachers Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <UserSquare2 className="w-5 h-5 text-indigo-400" /> Corps Professoral
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              {teachers.map(prof => (
                <div key={prof.id} className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-indigo-500/30 transition-colors shadow-lg">
                  <div className="flex items-center gap-4 flex-1 min-w-0 mr-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {prof.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate">{prof.name}</p>
                      <p className="text-xs text-slate-400 truncate">Professeur</p>
                    </div>
                  </div>
                  <Link to="/dashboard/messages" state={{ activeChat: prof }} className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-indigo-500 transition-all flex-shrink-0" title="Contacter">
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                </div>
              ))}
              {teachers.length === 0 && <p className="text-sm text-slate-500">Aucun professeur trouvé.</p>}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ProfDirectory;