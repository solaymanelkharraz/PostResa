import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Building2,
    Bell,
    Shield,
    Key,
    LogOut,
    Camera,
    Calendar,
    MessageSquare
} from 'lucide-react';

const Profile = () => {
    const [notifications, setNotifications] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="pb-10"
        >
            <div className="mb-8 border-b border-white/5 pb-6">
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-sm text-slate-400">Manage your account settings and preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">

                {/* --- Left Column: Identity & Stats --- */}
                <div className="w-full md:w-1/3 space-y-6">

                    {/* ID Card */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl relative group">
                        <div className="h-24 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 relative">
                            <button className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="px-6 pb-6 relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-2xl absolute -top-10 border-4 border-slate-950 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                SE
                            </div>

                            <div className="pt-12">
                                <h2 className="text-xl font-bold text-white">Soulayman Elkharraz</h2>
                                <div className="inline-block mt-1 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                    Stagiaire
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <Mail className="w-4 h-4 text-slate-500" />
                                    <span>soulayman@ofppt.ma</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <Building2 className="w-4 h-4 text-slate-500" />
                                    <span>ISTA NTIC Tangier</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                            <Calendar className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">12</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Bookings</div>
                        </div>
                        <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                            <MessageSquare className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">34</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Posts</div>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Settings --- */}
                <div className="w-full md:w-2/3 space-y-6">

                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-400" /> Personal Information
                        </h3>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-400 ml-1">First Name</label>
                                    <input type="text" defaultValue="Soulayman" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-400 ml-1">Last Name</label>
                                    <input type="text" defaultValue="Elkharraz" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-400 ml-1">Email Address (Read Only)</label>
                                <input type="email" defaultValue="soulayman@ofppt.ma" readOnly className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-slate-500 cursor-not-allowed" />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-900/20">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-purple-400" /> Security & Preferences
                        </h3>

                        <div className="space-y-4">
                            {/* Toggle Setting */}
                            <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Bell className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Push Notifications</p>
                                        <p className="text-xs text-slate-500">Get alerted when your reservations are approved.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotifications(!notifications)}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-purple-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {/* Action Setting */}
                            <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><Key className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Change Password</p>
                                        <p className="text-xs text-slate-500">Update your security credentials.</p>
                                    </div>
                                </div>
                                <button className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Update</button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-4">
                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl text-sm font-bold transition-all border border-rose-500/20">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default Profile;