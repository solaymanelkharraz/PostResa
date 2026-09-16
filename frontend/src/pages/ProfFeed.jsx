import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Users, Globe, FileText, Paperclip } from 'lucide-react';

// Mock Data
const FEED_POSTS = [
  { id: 1, author: "M. Tazi", role: "Vous", audience: "Dev Digital 202", content: "N'oubliez pas d'installer XAMPP avant le TP de demain. Le lien est sur le portail Moodle.", time: "Il y a 10 min", isMine: true },
  { id: 2, author: "Direction", role: "Admin", audience: "Tout le Campus", content: "Les emplois du temps officiels sont mis à jour.", time: "Il y a 2h", isMine: false },
  { id: 3, author: "Mme. Bennani", role: "Professeur", audience: "Tout le Campus", content: "Rappel : La conférence sur les Soft Skills commence à 14h à l'Amphi A.", time: "Hier", isMine: false },
];

const ProfFeed = () => {
  const [newPost, setNewPost] = useState("");
  const [audience, setAudience] = useState("Dev Digital 201"); // Default to one of his groups

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      
      {/* Creation Box */}
      <div className="bg-gradient-to-br from-blue-900/20 to-slate-900/40 border border-blue-500/30 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" /> Publier une annonce
        </h3>
        
        <div className="space-y-4">
          <textarea 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Partagez une information, un rappel ou un document..."
            className="w-full h-24 bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/5 pt-4">
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-400 uppercase">Visibilité :</label>
              <div className="relative flex-1 sm:w-48">
                {audience === "Tout le Campus" ? <Globe className="absolute left-3 top-2.5 w-4 h-4 text-blue-400" /> : <Users className="absolute left-3 top-2.5 w-4 h-4 text-indigo-400" />}
                <select 
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <optgroup label="Mes Classes">
                    <option value="Dev Digital 201">Dev Digital 201</option>
                    <option value="Dev Digital 202">Dev Digital 202</option>
                  </optgroup>
                  <optgroup label="Général">
                    <option value="Tout le Campus">Tout le Campus (Public)</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button 
                disabled={!newPost.trim()}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-slate-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Publier
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Feed Timeline */}
      <div className="space-y-4">
        {FEED_POSTS.map(post => (
          <div key={post.id} className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${post.isMine ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-slate-800 text-white border-white/5'}`}>
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    {post.author}
                    {post.role === 'Admin' && <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">Direction</span>}
                  </h4>
                  <p className="text-xs text-slate-500">{post.time}</p>
                </div>
              </div>
              
              {/* Target Audience Badge */}
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                post.audience === 'Tout le Campus' ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}>
                {post.audience === 'Tout le Campus' ? <Globe className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                {post.audience}
              </span>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>
          </div>
        ))}
      </div>

    </motion.div>
  );
};

export default ProfFeed;