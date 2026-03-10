import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ShieldCheck, 
  Bell, 
  Menu, 
  X,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      
      {/* --- Navigation --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-4 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-indigo-400 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-purple-900/50">P</div>
            <span className="text-xl font-bold tracking-tight">PostResa</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#roles" className="hover:text-white transition-colors">For Schools</a>
            <Link to="/auth" className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all">Log In</Link>
            <Link to="/auth" className="px-5 py-2 rounded-full bg-white text-slate-950 hover:bg-slate-200 transition-all font-semibold shadow-lg">Join Platform</Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Eliminate Scheduling Conflicts Forever
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
          >
            The Operating System <br />
            for Modern Campuses.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            PostResa unifies <strong>reservation management</strong> and <strong>campus communication</strong>. 
            Stop the chaos of double-bookings and fragmented announcements.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/auth" className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 group">
              Digitize Your School
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all border border-slate-700">
              Explore Features
            </a>
          </motion.div>

          {/* Hero Dashboard UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-2 shadow-2xl">
              <div className="rounded-lg bg-slate-950 overflow-hidden aspect-video relative flex items-center justify-center border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-purple-900/20" />
                
                {/* Simulated Reservation Conflict UI */}
                <div className="z-10 text-center space-y-4">
                    <div className="bg-slate-900/80 backdrop-blur border border-white/10 p-4 rounded-lg shadow-xl inline-block text-left min-w-[300px]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-400">STATUS</span>
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full"></div> LIVE</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                            <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1.5, delay: 1 }}
                                className="h-full bg-purple-500" 
                            />
                        </div>
                        <p className="text-sm text-slate-300">Space Availability Updated</p>
                    </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* --- Bento Grid Features --- */}
      <section id="features" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">From chaos to <span className="text-purple-400">clarity</span>.</h2>
            <p className="text-slate-400 text-lg">Designed for Stagiaires, Profs, and Admins to work in perfect sync.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-slate-900/40 border border-white/5 hover:border-purple-500/30 transition-colors group relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Active Conflict Prevention</h3>
                <p className="text-slate-400 max-w-md">
                    Never double-book a room again. The system automatically detects overlaps and blocks conflicting requests instantly.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl p-8 bg-slate-900/40 border border-white/5 hover:border-pink-500/30 transition-colors group relative overflow-hidden backdrop-blur-sm">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-6">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Campus Feed</h3>
                <p className="text-slate-400">
                    A unified social wall for school events, ads, and announcements. Like, comment, and stay informed.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl p-8 bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 transition-colors group relative overflow-hidden backdrop-blur-sm">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Multi-Role Access</h3>
                <p className="text-slate-400">
                    Dedicated portals for Stagiaires, Profs, and Admins. Secure data isolation and permissions.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 transition-colors group relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Integrated Connectivity</h3>
                <p className="text-slate-400 max-w-md">
                    Direct communication channels to find your instructors and check their online status without external apps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Roles Breakdown --- */}
      <section id="roles" className="py-20 border-t border-white/5 bg-slate-950/50">
          <div className="container mx-auto px-6 text-center">
              <h3 className="text-sm font-bold text-purple-400 tracking-wider mb-12 uppercase">Tailored for your ecosystem</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="p-6">
                      <div className="text-4xl mb-4">🎓</div>
                      <h4 className="text-xl font-bold text-white mb-2">Stagiaire</h4>
                      <p className="text-slate-400 text-sm">Book spaces, view teacher profiles, and react to campus news.</p>
                  </div>
                  <div className="p-6">
                      <div className="text-4xl mb-4">👨‍🏫</div>
                      <h4 className="text-xl font-bold text-white mb-2">Prof</h4>
                      <p className="text-slate-400 text-sm">Create targeted ads, manage visibility by class, and reserve ateliers.</p>
                  </div>
                  <div className="p-6">
                      <div className="text-4xl mb-4">🛡️</div>
                      <h4 className="text-xl font-bold text-white mb-2">Admin</h4>
                      <p className="text-slate-400 text-sm">Validate requests, block schedule slots, and oversee school logs.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/20 rounded-3xl p-12 md:p-20 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to modernize your center?</h2>
            <p className="text-purple-200 text-lg mb-10 max-w-2xl mx-auto">
                Join the platform that puts reservations and communication in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link to="/auth" className="px-8 py-4 rounded-full bg-white text-purple-900 font-bold hover:bg-slate-200 transition-colors shadow-xl">
                Get Started Now
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 border-t border-white/5 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center text-slate-600 text-sm pt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 opacity-50 text-white">
                <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center font-bold text-xs">P</div>
                <span className="font-bold tracking-tight">PostResa</span>
            </div>
            <p>© 2026 PostResa Platform. All rights reserved. <br/>Based on CDC specifications.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;