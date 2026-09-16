import React from 'react';
import { Activity } from 'lucide-react';

const ActivityLog = ({ logs, onViewFullLog }) => {
  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
      <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Activity className="w-4 h-4 text-slate-400" /> Live Log</h3>
      <div className="space-y-6 relative">
         <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-white/5"></div>
         {logs.map((log) => (
           <div key={log.id} className="relative pl-8">
             <div className="absolute left-0 top-1 w-4 h-4 bg-slate-900 border-2 border-slate-600 rounded-full z-10"></div>
             <p className="text-sm font-bold text-slate-300">{log.action}</p>
             <p className="text-xs text-slate-500 mb-1">{log.detail}</p>
             <p className="text-[10px] text-indigo-400">{log.time}</p>
           </div>
         ))}
      </div>
      <button onClick={onViewFullLog} className="w-full mt-6 py-2 text-xs text-slate-500 hover:text-white border-t border-white/5 transition-colors">View Full System Log</button>
    </div>
  );
};

export default ActivityLog;
