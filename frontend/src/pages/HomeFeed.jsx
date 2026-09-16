import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, 
  Heart, 
  MessageSquare, 
  Share2, 
  Image as ImageIcon, 
  Calendar as EventIcon,
  Loader2
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/axios';

const HomeFeed = () => {
  const [filter, setFilter] = useState('All');
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await api.get('/posts');
      return res.data;
    }
  });

  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await api.get('/schedules');
      return res.data;
    }
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to fetch posts');
    }
  }, [error]);

  const filteredPosts = posts.filter(post => filter === 'All' || post.type === filter);

  const myGroups = Array.from(new Set(schedules?.map(s => s.group_name).filter(Boolean) || []));

  const [newPost, setNewPost] = useState({ title: '', content: '', type: 'announcement', target_group: '' });

  const createPostMutation = useMutation({
    mutationFn: (payload) => api.post('/posts', payload),
    onSuccess: () => {
      toast.success('Post submitted for review! It will appear once approved by an admin.');
      setNewPost({ title: '', content: '', type: 'announcement', target_group: '' });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      toast.error('Failed to create post');
    }
  });

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      toast.error('Title and content are required.');
      return;
    }
    const payload = { ...newPost };
    if (payload.target_group) {
      payload.target_audience = [payload.target_group];
    }
    createPostMutation.mutate(payload);
  };
  const isPosting = createPostMutation.isPending;

  const currentUser = useSelector(state => state.auth.user);
  const [commentingOn, setCommentingOn] = useState(null);
  const [commentText, setCommentText] = useState('');

  const likeMutation = useMutation({
    mutationFn: (postId) => api.post(`/posts/${postId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      toast.error('Failed to like post');
    }
  });

  const handleLike = (postId) => {
    likeMutation.mutate(postId);
  };

  const commentMutation = useMutation({
    mutationFn: ({ postId, content }) => api.post(`/posts/${postId}/comment`, { content }),
    onSuccess: () => {
      setCommentText('');
      setCommentingOn(null);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      toast.error('Failed to post comment');
    }
  });

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    commentMutation.mutate({ postId, content: commentText });
  };

  return (
    <div className="space-y-6 pb-10 max-w-2xl mx-auto">
        
      {/* Header & Filters */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Campus Feed</h1>
        <p className="text-sm text-slate-400 mb-6">Stay updated with the latest news, events, and announcements.</p>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'announcement', 'event', 'ad'].map(f => (
              <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${
                      filter === f 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' 
                      : 'bg-slate-900/40 border border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                  {f === 'ad' ? 'Ads' : f + 's'}
              </button>
          ))}
        </div>
      </div>

      {/* --- Create Post Input UI --- */}
      {user?.role !== 'stagiaire' && (
      <motion.form 
        onSubmit={handlePostSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 backdrop-blur-sm shadow-xl mb-6"
      >
        <div className="flex flex-col gap-3">
          <input 
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="Post Title..."
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 text-sm font-bold"
          />
          <textarea 
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            placeholder="What's happening on campus?" 
            className="bg-transparent w-full text-slate-200 placeholder:text-slate-500 focus:outline-none text-sm resize-none h-16 px-4"
          />
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
          <div className="flex gap-3 text-purple-400 items-center">
            <select 
              value={newPost.type}
              onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
              className="bg-black/50 border border-white/10 rounded-lg text-xs px-2 py-1.5 focus:outline-none text-slate-300"
            >
              <option value="announcement">Announcement</option>
              <option value="event">Event</option>
              <option value="ad">Ad</option>
            </select>
            <select
              value={newPost.target_group}
              onChange={(e) => setNewPost({ ...newPost, target_group: e.target.value })}
              className="bg-black/50 border border-white/10 rounded-lg text-xs px-2 py-1.5 focus:outline-none text-emerald-400"
            >
              <option value="">Tous les groupes</option>
              {myGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <button 
            type="submit"
            disabled={isPosting}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-purple-900/20 active:scale-95 flex items-center gap-2"
          >
            {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
          </button>
        </div>
      </motion.form>
      )}

      {/* --- The Posts Feed --- */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((skeleton) => (
            <motion.div 
              key={skeleton}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-1/6 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="h-48 w-full bg-white/5 rounded-2xl animate-pulse" />
            </motion.div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-slate-900/20 rounded-3xl border border-white/5">
           No posts found.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post, index) => (
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
                  <img src={post.user?.avatar_url || `https://ui-avatars.com/api/?name=${post.user?.name}&background=random`} alt={post.user?.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div>
                    <h3 className="font-bold text-white text-sm hover:text-purple-400 cursor-pointer transition-colors">
                      {post.user?.name || 'Unknown User'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <span className="text-purple-400 font-medium capitalize">{post.type}</span> • {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Content */}
              <div className="px-5 pb-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>
              </div>

              {/* Post Image (Only renders if the post has an image) */}
              {post.image_url && (
                <div className="w-full h-64 sm:h-80 bg-slate-800 relative border-y border-white/5 overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt="Post attachment" 
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" 
                  />
                </div>
              )}

              {/* Post Actions (Likes, Comments, Share) */}
              <div className="px-5 py-4 flex items-center gap-8 border-t border-white/5 text-slate-400 bg-black/20">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 text-sm hover:text-rose-400 transition-colors group ${post.likes?.includes(currentUser?.id) ? 'text-rose-400' : ''}`}
                >
                  <Heart className={`w-5 h-5 group-hover:fill-rose-400/20 transition-all ${post.likes?.includes(currentUser?.id) ? 'fill-rose-400/50 text-rose-400' : ''}`} /> 
                  <span className="font-medium">{post.likes?.length || 0}</span>
                </button>
                
                <button 
                  onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-sm hover:text-purple-400 transition-colors group"
                >
                  <MessageSquare className="w-5 h-5 group-hover:fill-purple-400/20 transition-all" /> 
                  <span className="font-medium">{post.comments?.length || 0}</span>
                </button>
                
                <button className="flex items-center gap-2 text-sm hover:text-emerald-400 transition-colors ml-auto group">
                  <Share2 className="w-5 h-5 group-hover:fill-emerald-400/20 transition-all" /> 
                  <span className="font-medium hidden sm:block">Share</span>
                </button>
              </div>

              {/* Comments Section */}
              {commentingOn === post.id && (
                <div className="px-5 pb-5 pt-2 bg-black/20 border-t border-white/5">
                  <div className="space-y-4 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {post.comments?.length > 0 ? (
                      post.comments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20 shrink-0">
                            {comment.user_name.charAt(0)}
                          </div>
                          <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-2 flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-bold text-white">{comment.user_name}</span>
                              <span className="text-[10px] text-slate-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-300">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-2">No comments yet. Be the first!</p>
                    )}
                  </div>
                  <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex gap-2">
                    <input 
                      type="text" 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..." 
                      className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                    <button type="submit" disabled={!commentText.trim()} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-2 rounded-full text-sm font-bold transition-all">
                      Post
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};

export default HomeFeed;