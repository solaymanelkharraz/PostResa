import React from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const PendingPostsList = ({ posts }) => {
  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-bold text-lg text-white flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-400" /> Post Moderation</h3>
        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">{posts.length} Pending</span>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post, index) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            key={post.id} 
            className="bg-slate-950 border border-white/5 rounded-xl p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500">{post.type.toUpperCase()}</span>
              <span className="text-xs text-slate-400">{post.user}</span>
            </div>
            <p className="text-sm text-slate-300 mb-4 line-clamp-2">"{post.content}"</p>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 bg-emerald-500/10 text-emerald-400 rounded text-xs font-bold hover:bg-emerald-500 hover:text-white transition-colors">Publish</button>
              <button className="flex-1 py-1.5 bg-rose-500/10 text-rose-400 rounded text-xs font-bold hover:bg-rose-500 hover:text-white transition-colors">Reject</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PendingPostsList;
