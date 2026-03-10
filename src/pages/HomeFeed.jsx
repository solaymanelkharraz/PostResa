import React from 'react';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, 
  Heart, 
  MessageCircle, 
  Share2, 
  Image as ImageIcon, 
  Calendar as EventIcon 
} from 'lucide-react';

// --- Rich Mock Data for Presentation ---
const POSTS = [
  {
    id: 1,
    author: "Administration OFPPT",
    role: "Direction Pédagogique",
    avatarColor: "bg-rose-500",
    time: "4 hours ago",
    content: "🚀 Hackathon 2026 is coming to Tangier! Join us for a 24-hour coding marathon next weekend. Teams of 4. Registration is now open via the reservation tab. Get ready to build something amazing!",
    image: "https://images.unsplash.com/photo-1504384308090-c54be38558bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 156,
    comments: 42,
    tag: "Event"
  },
  {
    id: 2,
    author: "M. El Kharraz",
    role: "Prof. Développement Digital",
    avatarColor: "bg-purple-600",
    time: "1 day ago",
    content: "📢 Reminder: The submission deadline for the React Project (Atelier 4) has been extended to this Sunday at midnight. Please ensure your GitLab repositories are public so I can review the code.",
    image: null,
    likes: 24,
    comments: 5,
    tag: "Announcement"
  },
  {
    id: 3,
    author: "Mme. Bennani",
    role: "Prof. Soft Skills",
    avatarColor: "bg-emerald-500",
    time: "2 days ago",
    content: "Great job to Group A for their presentation today! The communication skills demonstrated were excellent. I have attached the summary slides for those who missed the session.",
    image: null,
    likes: 12,
    comments: 0,
    tag: "Class Material"
  }
];

const HomeFeed = () => {
  return (
    <div className="space-y-6 pb-10">
        
      {/* --- Create Post Input UI --- */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 backdrop-blur-sm shadow-xl"
      >
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 flex-shrink-0 flex items-center justify-center font-bold text-white shadow-lg">
             SE
          </div>
          <input 
            type="text" 
            placeholder="What's happening on campus?" 
            className="bg-transparent w-full text-slate-200 placeholder:text-slate-500 focus:outline-none text-sm"
          />
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
          <div className="flex gap-2 text-purple-400">
            <button className="p-2 hover:bg-purple-500/10 rounded-full transition-colors flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> 
                <span className="text-xs font-medium hidden sm:block">Photo</span>
            </button>
            <button className="p-2 hover:bg-purple-500/10 rounded-full transition-colors flex items-center gap-2">
                <EventIcon className="w-4 h-4" /> 
                <span className="text-xs font-medium hidden sm:block">Event</span>
            </button>
          </div>
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-purple-900/20 active:scale-95">
            Post
          </button>
        </div>
      </motion.div>

      {/* --- The Posts Feed --- */}
      <div className="space-y-6">
        {POSTS.map((post, index) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 shadow-xl group/card"
          >
            {/* Post Header */}
            <div className="p-5 flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className={`w-10 h-10 rounded-full ${post.avatarColor} flex items-center justify-center font-bold text-white text-sm shadow-inner`}>
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm hover:text-purple-400 cursor-pointer transition-colors">
                    {post.author}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{post.role} • {post.time}</p>
                </div>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5">
                  <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-5 pb-4">
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3 tracking-wide uppercase shadow-sm">
                  {post.tag}
                </span>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>
            </div>

            {/* Post Image (Only renders if the post has an image) */}
            {post.image && (
              <div className="w-full h-64 sm:h-80 bg-slate-800 relative border-y border-white/5 overflow-hidden">
                <img 
                  src={post.image} 
                  alt="Post attachment" 
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" 
                />
              </div>
            )}

            {/* Post Actions (Likes, Comments, Share) */}
            <div className="px-5 py-4 flex items-center gap-8 border-t border-white/5 text-slate-400 bg-black/20">
              <button className="flex items-center gap-2 text-sm hover:text-rose-400 transition-colors group">
                <Heart className="w-5 h-5 group-hover:fill-rose-400/20 transition-all" /> 
                <span className="font-medium">{post.likes}</span>
              </button>
              
              <button className="flex items-center gap-2 text-sm hover:text-purple-400 transition-colors group">
                <MessageCircle className="w-5 h-5 group-hover:fill-purple-400/20 transition-all" /> 
                <span className="font-medium">{post.comments}</span>
              </button>
              
              <button className="flex items-center gap-2 text-sm hover:text-emerald-400 transition-colors ml-auto group">
                <Share2 className="w-5 h-5 group-hover:fill-emerald-400/20 transition-all" /> 
                <span className="font-medium hidden sm:block">Share</span>
              </button>
            </div>
            
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomeFeed;