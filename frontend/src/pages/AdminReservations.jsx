import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarClock, Search, CheckCircle, XCircle, FileText, Filter, User, Loader2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservations } from '../store/slices/reservationSlice';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminReservations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [updatingId, setUpdatingId] = useState(null);

  const dispatch = useDispatch();
  const { items: reservations, status, error } = useSelector(state => state.reservations);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReservations());
    }
  }, [status, dispatch]);

  const filteredReservations = reservations.filter(res => {
    const userName = res.user?.name || '';
    const roomName = res.space?.name || '';
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) || roomName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Map French statuses to database enum values
    let dbStatus = res.status;
    if (statusFilter === 'En attente' && dbStatus !== 'pending') return false;
    if (statusFilter === 'Approuvée' && dbStatus !== 'approved') return false;
    if (statusFilter === 'Refusée' && dbStatus !== 'rejected') return false;
    
    return matchesSearch;
  });

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.put(`/reservations/${id}`, { status: newStatus });
      toast.success(`Reservation ${newStatus} successfully!`);
      dispatch(fetchReservations());
    } catch (err) {
      toast.error('Failed to update reservation status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-indigo-400" /> Historique des Réservations
          </h2>
          <p className="text-sm text-slate-400 mt-1">Gérez et consultez toutes les demandes de réservation.</p>
        </div>

        <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" placeholder="Rechercher salle ou utilisateur..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <select 
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="En attente">En attente</option>
              <option value="Approuvée">Approuvées</option>
              <option value="Refusée">Refusées</option>
            </select>
          </div>
        </div>
      </div>

      {/* List of Reservations */}
      <div className="space-y-4">
        {status === 'loading' ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-12 text-slate-500">Aucune réservation trouvée pour ces critères.</div>
        ) : (
          filteredReservations.map((res) => (
            <div key={res.id} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:bg-slate-900/60 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusStyle(res.status)}`}>
                    {res.status}
                  </span>
                  <h3 className="text-lg font-bold text-white">{res.space?.name || 'Unknown Space'}</h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> <strong className="text-slate-300">{res.user?.name}</strong> ({res.user?.role})</span>
                  <span className="flex items-center gap-1.5"><CalendarClock className="w-4 h-4" /> {new Date(res.start_time).toLocaleString()} - {new Date(res.end_time).toLocaleTimeString()}</span>
                </div>
                
                <div className="flex items-start gap-2 text-sm text-slate-500 bg-black/20 p-3 rounded-xl border border-white/5">
                  <FileText className="w-4 h-4 mt-0.5 text-indigo-400" />
                  <p>Motif : <span className="italic">"{res.purpose}"</span></p>
                </div>
              </div>

              {/* Quick Actions (Only show if pending) */}
              {res.status === 'pending' && (
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleUpdateStatus(res.id, 'approved')}
                    disabled={updatingId === res.id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors font-bold text-sm border border-emerald-500/20 shadow-lg disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" /> Approuver
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(res.id, 'rejected')}
                    disabled={updatingId === res.id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors font-bold text-sm border border-rose-500/20 shadow-lg disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Refuser
                  </button>
                </div>
              )}
              
            </div>
          ))
        )}
      </div>

    </motion.div>
  );
};

export default AdminReservations;