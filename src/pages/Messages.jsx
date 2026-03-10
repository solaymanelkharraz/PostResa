import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  ChevronLeft, 
  Phone, 
  Video, 
  MoreVertical,
  Check,
  CheckCheck
} from 'lucide-react';

// --- Static Data ---
const CONTACTS = [
  {
    id: 1,
    name: "Mme. Bennani",
    role: "Prof. Soft Skills",
    avatar: "bg-emerald-500",
    lastMessage: "I've uploaded the slides for tomorrow's session.",
    time: "10:42 AM",
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: "Club IT (Groupe)",
    role: "14 Members",
    avatar: "bg-purple-600",
    lastMessage: "Ahmed: Who is booking the Amphi for the Hackathon?",
    time: "Yesterday",
    unread: 0,
    online: false
  },
  {
    id: 3,
    name: "M. Tazi",
    role: "Prof. Back-end",
    avatar: "bg-indigo-500",
    lastMessage: "Your Laravel API structure looks solid. Proceed.",
    time: "Monday",
    unread: 0,
    online: true
  }
];

const CHAT_HISTORY = [
  { id: 1, sender: 'them', text: "Hello! Did you finish the React UI for PostResa?", time: "10:30 AM" },
  { id: 2, sender: 'me', text: "Yes Madame! I just finished the Spaces and Reservations pages.", time: "10:35 AM" },
  { id: 3, sender: 'them', text: "Excellent work. I've uploaded the slides for tomorrow's session.", time: "10:42 AM" }
];

const Messages = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  return (
    <div className="h-[calc(100vh-8rem)] bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl relative flex flex-col">
      
      <AnimatePresence mode="wait">
        
        {/* --- VIEW 1: CONTACTS LIST --- */}
        {!activeChat ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-slate-950/50">
              <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search messages or people..." 
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 text-white transition-all"
                />
              </div>
            </div>

            {/* Contact List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-1">
              {CONTACTS.map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => setActiveChat(contact)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`relative w-12 h-12 rounded-full ${contact.avatar} flex-shrink-0 flex items-center justify-center font-bold text-white shadow-inner`}>
                      {contact.name.charAt(0)}
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                      )}
                    </div>
                    <div className="text-left overflow-hidden">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                        {contact.name}
                      </h3>
                      <p className={`text-xs truncate mt-0.5 ${contact.unread > 0 ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>
                        {contact.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                    <span className="text-[10px] text-slate-500">{contact.time}</span>
                    {contact.unread > 0 && (
                      <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-purple-900/50">
                        {contact.unread}
                      </span>
                    )}
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
            className="flex flex-col h-full"
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
                <div className={`relative w-10 h-10 rounded-full ${activeChat.avatar} flex items-center justify-center font-bold text-white shadow-inner`}>
                  {activeChat.name.charAt(0)}
                  {activeChat.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{activeChat.name}</h3>
                  <p className="text-[10px] text-purple-400">{activeChat.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors"><Phone className="w-4 h-4" /></button>
                <button className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors"><Video className="w-4 h-4" /></button>
                <button className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide bg-black/20">
              <div className="text-center mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">Today</span>
              </div>
              
              {CHAT_HISTORY.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      isMe 
                        ? 'bg-purple-600 text-white rounded-tr-sm shadow-lg shadow-purple-900/20' 
                        : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 px-1">
                      <span>{msg.time}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-purple-400" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Area */}
            <div className="p-4 border-t border-white/5 bg-slate-950/50">
              <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-full p-1.5 pl-4 focus-within:border-purple-500/50 transition-colors">
                <button className="text-slate-400 hover:text-purple-400 transition-colors"><Smile className="w-5 h-5" /></button>
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none px-2"
                />
                <button className="text-slate-400 hover:text-purple-400 transition-colors mr-2"><Paperclip className="w-5 h-5" /></button>
                <button 
                  className={`p-2 rounded-full flex items-center justify-center transition-all ${
                    messageInput.trim().length > 0 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Send className="w-4 h-4 ml-0.5" />
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