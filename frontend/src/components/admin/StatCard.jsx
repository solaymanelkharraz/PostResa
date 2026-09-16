import React from 'react';

const StatCard = ({ stat }) => {
  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 backdrop-blur-sm hover:bg-slate-900 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{stat.change}</span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
      <p className="text-slate-400 text-sm">{stat.label}</p>
    </div>
  );
};

export default StatCard;
