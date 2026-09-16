import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search,
  MessageCircle,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Send,
  ChevronLeft,
  Check,
  CheckCheck,
  Loader2,
  Users,
  User
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
  const { user: currentUser } = useSelector(state => state.auth);
  const location = useLocation();
  const initialActiveChat = location.state?.activeChat || null;

  const [activeChat, setActiveChat] = useState(initialActiveChat);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const queryClient = useQueryClient();

  // Fetch Contacts
  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery({
    queryKey: ['contacts', searchQuery],
    queryFn: async () => {
      const url = searchQuery ? `/users?q=${searchQuery}` : '/messages/contacts';
      const res = await api.get(url);
      return res.data.filter(u => u.id !== currentUser?.id);
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const hasProcessedInitial = useRef(false);
  // Auto-select active chat only ONCE on mount
  useEffect(() => {
    if (initialActiveChat && !hasProcessedInitial.current) {
      setActiveChat(initialActiveChat);
      hasProcessedInitial.current = true;
    }
  }, [initialActiveChat]);

  // Fetch Messages for active chat
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', activeChat?.isGroup ? 'group' : 'direct', activeChat?.isGroup ? activeChat?.groupName : activeChat?.id],
    queryFn: async () => {
      let res;
      if (activeChat.isGroup) {
        res = await api.get(`/group-messages?group_name=${activeChat.groupName}`);
      } else {
        res = await api.get(`/messages?with_user=${activeChat.id}`);
      }
      return res.data;
    },
    enabled: !!activeChat,
    staleTime: 1000 * 30, // 30 seconds
  });

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send Message Mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      if (activeChat.isGroup) {
        return await api.post('/group-messages', {
          group_name: activeChat.groupName,
          content
        });
      } else {
        return await api.post('/messages', {
          receiver_id: activeChat.id,
          content
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setMessageInput('');
    },
    onError: (err) => {
      console.error(err);
      toast.error("Erreur lors de l'envoi du message");
    }
  });

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;
    sendMessageMutation.mutate(messageInput);
  };

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl flex overflow-hidden shadow-xl" style={{ height: 'calc(100vh - 120px)' }}>
      <AnimatePresence mode="wait">
        {!activeChat ? (
          /* --- VIEW 1: CONTACTS LIST --- */
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col h-full bg-slate-950/20 backdrop-blur-sm"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-slate-950/50">
              <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Chercher des utilisateurs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 text-white transition-all"
                />
              </div>
            </div>

            {/* Contact List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-1">
              {isLoadingContacts ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>
              ) : contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <Smile className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm">{currentUser?.role === 'prof' ? 'Démarrez une conversation depuis l\'Annuaire' : 'Envoyez un message à un ami ou à un professeur'}</p>
                </div>
              ) : contacts.map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => setActiveChat(contact)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="relative w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex-shrink-0 flex items-center justify-center font-bold text-white shadow-inner">
                      {contact.isGroup ? <Users className="w-5 h-5 text-emerald-400" /> : contact.name.charAt(0).toUpperCase()}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                    </div>
                    <div className="text-left overflow-hidden">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                        {contact.name}
                      </h3>
                      <p className="text-xs truncate mt-0.5 text-slate-500">
                        {contact.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (

          /* --- VIEW 2: ACTIVE CHAT --- */
          <motion.div 
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full w-full"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveChat(null)}
                  className="p-2 -ml-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-white shadow-inner">
                  {activeChat.isGroup ? <Users className="w-5 h-5 text-emerald-400" /> : activeChat.name.charAt(0).toUpperCase()}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{activeChat.name}</h3>
                  <p className="text-[10px] text-purple-400">{activeChat.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <div className="relative group">
                  <button className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50 p-2">
                    <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Contact</div>
                    {activeChat.isGroup ? (
                      <p className="text-xs text-slate-300 break-words px-2 py-1">Discussion de groupe</p>
                    ) : activeChat.email ? (
                      <p className="text-xs text-emerald-400 font-medium break-words px-2 py-1">{activeChat.email}</p>
                    ) : (
                      <p className="text-xs text-slate-500 break-words px-2 py-1">Email non disponible</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide bg-black/20 flex flex-col">
              {isLoadingMessages ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                  Démarrez la conversation...
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {activeChat.isGroup && !isMe && msg.sender && (
                        <span className="text-xs text-emerald-400 font-bold ml-1 mb-1">{msg.sender.name}</span>
                      )}
                      <div className={`max-w-[80%] p-3 rounded-2xl ${
                        isMe 
                          ? 'bg-purple-600 text-white rounded-tr-sm shadow-lg shadow-purple-900/20' 
                          : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 px-1">
                        <span>{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {isMe && <CheckCheck className={`w-3 h-3 ${msg.read_at ? 'text-purple-400' : 'text-slate-500'}`} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input Area */}
            <div className="p-4 border-t border-white/5 bg-slate-950/50">
              <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-full p-1.5 pl-4 focus-within:border-purple-500/50 transition-colors">
                <button className="text-slate-400 hover:text-purple-400 transition-colors"><Smile className="w-5 h-5" /></button>
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tapez un message..." 
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none px-2"
                />
                <button className="text-slate-400 hover:text-purple-400 transition-colors mr-2"><Paperclip className="w-5 h-5" /></button>
                <button 
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isPending || !messageInput.trim()}
                  className={`p-2 rounded-full flex items-center justify-center transition-all ${
                    messageInput.trim().length > 0 && !sendMessageMutation.isPending
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {sendMessageMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messages;