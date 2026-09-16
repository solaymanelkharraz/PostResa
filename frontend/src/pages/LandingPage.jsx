import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutLocal } from '../store/slices/authSlice';
import { 
  Calendar, ShieldCheck, Bell, Menu, X, ArrowRight, 
  MessageSquare, Sparkles, CheckCircle2, Users, Layers, Zap
} from 'lucide-react';

// Reusable animated container for scroll-reveal
const FadeIn = ({ children, delay = 0, className = "", direction = "up" }) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 }
  };
  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Parallax effects
  const { scrollYProgress } = useScroll();
  const yHeroBg = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDashboardRedirect = () => {
    if (!user) return navigate('/auth');
    if (user.role === 'super_admin') return navigate('/superadmin');
    if (user.role === 'admin') {
      if (user.status === 'pending') {
        if (user.metadata?.address) return navigate('/pending');
        return navigate('/onboarding');
      }
      return navigate('/admin');
    }
    return navigate('/dashboard');
  };

  const handleLogout = () => {
    dispatch(logoutLocal());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden relative">
      
      {/* Global Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-900/10 blur-[120px]" />
      </div>

      {/* --- Navigation --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              P
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors duration-300">PostResa</span>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#roles" className="hover:text-white transition-colors">Pour les Écoles</a>
            <div className="w-px h-4 bg-white/10" />
            
            {isAuthenticated ? (
              <>
                <button onClick={handleLogout} className="hover:text-red-400 transition-colors">Déconnexion</button>
                <button onClick={handleDashboardRedirect} className="relative group px-6 py-2.5 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-600 rounded-full transition-all duration-300 group-hover:opacity-90" />
                  <div className="absolute inset-[1px] bg-[#030712] rounded-full transition-all duration-300 group-hover:bg-opacity-0" />
                  <span className="relative z-10 text-white font-semibold group-hover:text-white transition-colors">Mon Espace</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="hover:text-white transition-colors">Connexion</Link>
                <Link to="/auth" className="relative group px-6 py-2.5 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-600 rounded-full transition-all duration-300 group-hover:opacity-90" />
                  <div className="absolute inset-[1px] bg-[#030712] rounded-full transition-all duration-300 group-hover:bg-opacity-0" />
                  <span className="relative z-10 text-white font-semibold group-hover:text-white transition-colors">Rejoindre</span>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#030712]/95 backdrop-blur-3xl pt-24 px-6 md:hidden flex flex-col gap-6"
          >
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-white border-b border-white/10 pb-4">Fonctionnalités</a>
            <a href="#roles" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-white border-b border-white/10 pb-4">Pour les Écoles</a>
            <Link to="/auth" className="text-2xl font-medium text-indigo-400 mt-4">Se connecter</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <header className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden flex flex-col items-center">
        <motion.div style={{ y: yHeroBg, opacity: opacityHero }} className="absolute inset-0 z-0">
          {/* Animated Mesh Gradient Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-[100%] blur-[150px] mix-blend-screen animate-pulse" />
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-[100%] blur-[120px] mix-blend-screen" />
        </motion.div>

        <div className="container mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 group cursor-pointer hover:bg-white/10 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm font-medium text-slate-200">La nouvelle ère de la gestion scolaire</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tighter mb-8 max-w-5xl leading-[1.1]"
          >
            Synchronisez votre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
              Campus Entier.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg lg:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
          >
            PostResa unifie la <strong>réservation des espaces</strong>, la <strong>communication</strong> et la <strong>vie scolaire</strong> dans une plateforme conçue pour l'excellence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
          >
            <Link to="/auth" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2">
              Démarrer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10 backdrop-blur-md">
              Découvrir la plateforme
            </a>
          </motion.div>

          {/* Hero Abstract Dashboard Visualization */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
            className="mt-24 relative w-full max-w-5xl aspect-[21/9] rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-2xl shadow-2xl p-4 overflow-hidden"
          >
            {/* Window Controls */}
            <div className="flex gap-2 mb-6 ml-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            </div>
            
            <div className="grid grid-cols-12 gap-6 h-[calc(100%-2rem)]">
              {/* Sidebar */}
              <div className="col-span-3 hidden md:flex flex-col gap-4 border-r border-white/5 pr-4">
                <div className="h-8 w-24 bg-white/10 rounded-lg mb-4" />
                {[1,2,3,4].map(i => <div key={i} className="h-10 w-full bg-white/5 rounded-xl" />)}
              </div>
              
              {/* Main Content Area */}
              <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="h-8 w-48 bg-white/10 rounded-lg" />
                  <div className="flex gap-3">
                    <div className="h-10 w-10 bg-white/5 rounded-full" />
                    <div className="h-10 w-32 bg-indigo-500/20 rounded-full" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-24 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
                       <div className="w-8 h-8 rounded-lg bg-white/10" />
                       <div className="h-3 w-16 bg-white/20 rounded" />
                       {i === 2 && <motion.div initial={{ x: '-100%' }} animate={{ x: '200%' }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12" />}
                    </div>
                  ))}
                </div>

                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="h-4 w-32 bg-white/20 rounded mb-6" />
                  <div className="space-y-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="h-3 w-1/3 bg-white/20 rounded" />
                          <div className="h-2 w-full bg-white/10 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Floating Notification */}
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5, type: "spring" }}
                    className="absolute bottom-6 right-6 bg-indigo-600 border border-indigo-400 p-4 rounded-2xl shadow-xl flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-white" />
                    <div>
                      <p className="text-sm font-bold text-white">Réservation Approuvée</p>
                      <p className="text-xs text-indigo-200">Amphi A - 14:00</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Overlap Gradient for smooth fade out at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </header>

      {/* --- Trusted By / Stats --- */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm font-medium text-slate-500 mb-8 uppercase tracking-widest">Conçu pour les universités, écoles et centres de formation</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale">
            {['Informatique', 'Ingénierie', 'Management', 'Direction'].map((dept, i) => (
              <div key={i} className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Layers className="w-6 h-6" /> {dept}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Bento Grid Features --- */}
      <section id="features" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Fonctionnalités Principales</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">Le chaos administratif <br/> appartient au passé.</h3>
            <p className="text-slate-400 text-lg">Une architecture unifiée qui connecte la direction, les formateurs et les stagiaires en temps réel.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Feature 1 (Large) */}
            <FadeIn delay={0.1} className="md:col-span-2 rounded-[2rem] p-8 md:p-12 bg-gradient-to-br from-indigo-900/20 to-[#030712] border border-white/10 hover:border-indigo-500/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-700" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Prévention des Conflits</h3>
                  <p className="text-slate-400 max-w-md text-lg">
                    Notre algorithme bloque instantanément les doubles réservations. Gérez les salles, les amphis et le matériel avec une visibilité parfaite sur les plannings.
                  </p>
                </div>
                {/* Mini UI illustration */}
                <div className="mt-8 flex gap-3">
                  <div className="px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-medium">Déjà réservé</div>
                  <div className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Disponible</div>
                </div>
              </div>
            </FadeIn>

            {/* Feature 2 */}
            <FadeIn delay={0.2} direction="left" className="rounded-[2rem] p-8 md:p-10 bg-gradient-to-br from-fuchsia-900/20 to-[#030712] border border-white/10 hover:border-fuchsia-500/50 transition-colors group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-6 group-hover:scale-110 transition-transform">
                  <Bell className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Fil d'Actualité</h3>
                <p className="text-slate-400">
                  Un mur social dédié à votre campus. Annonces, événements, et documents partagés en un seul endroit.
                </p>
              </div>
            </FadeIn>

            {/* Feature 3 */}
            <FadeIn delay={0.3} direction="right" className="rounded-[2rem] p-8 md:p-10 bg-gradient-to-br from-teal-900/20 to-[#030712] border border-white/10 hover:border-teal-500/50 transition-colors group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Contrôle d'Accès</h3>
                <p className="text-slate-400">
                  Importation massive via CSV. Hiérarchie stricte entre Super Admin, Direction, Professeurs et Stagiaires.
                </p>
              </div>
            </FadeIn>

            {/* Feature 4 (Large) */}
            <FadeIn delay={0.4} className="md:col-span-2 rounded-[2rem] p-8 md:p-12 bg-gradient-to-br from-purple-900/20 to-[#030712] border border-white/10 hover:border-purple-500/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] group-hover:bg-purple-500/20 transition-all duration-700" />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Messagerie Intégrée</h3>
                  <p className="text-slate-400 max-w-md text-lg">
                    Ne cherchez plus les contacts. Une messagerie instantanée intégrée permet aux stagiaires de contacter leurs formateurs en un clic, avec indicateurs de présence.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- Roles Breakdown --- */}
      <section id="roles" className="py-32 border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          <div className="container mx-auto px-6 relative z-10">
              <FadeIn className="text-center max-w-2xl mx-auto mb-20">
                <h3 className="text-sm font-bold text-fuchsia-400 tracking-widest mb-4 uppercase">Un écosystème sur mesure</h3>
                <h2 className="text-4xl font-bold text-white">Pensé pour chaque acteur</h2>
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <FadeIn delay={0.1} className="p-8 rounded-3xl bg-[#030712] border border-white/10 hover:border-white/20 transition-colors shadow-2xl relative group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 border border-white/10">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">Stagiaires</h4>
                      <p className="text-slate-400 leading-relaxed">Réservation d'espaces, consultation du feed de l'école, communication directe avec les formateurs et suivi de l'emploi du temps.</p>
                  </FadeIn>
                  <FadeIn delay={0.2} className="p-8 rounded-3xl bg-[#030712] border border-white/10 hover:border-white/20 transition-colors shadow-2xl relative group transform md:-translate-y-6">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 border border-white/10">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">Professeurs</h4>
                      <p className="text-slate-400 leading-relaxed">Création de publications, priorisation sur les réservations d'amphis, et gestion de la communication avec les différents groupes.</p>
                  </FadeIn>
                  <FadeIn delay={0.3} className="p-8 rounded-3xl bg-[#030712] border border-white/10 hover:border-white/20 transition-colors shadow-2xl relative group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 border border-white/10">
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">Direction (Admin)</h4>
                      <p className="text-slate-400 leading-relaxed">Importation massive des comptes via CSV, validation des réservations conflictuelles et paramétrage des espaces du centre.</p>
                  </FadeIn>
              </div>
          </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <FadeIn className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-[#030712] border border-indigo-500/30 rounded-[3rem] p-12 md:p-24 text-center shadow-[0_0_80px_-20px_rgba(99,102,241,0.3)] relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50" />
              
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">Prêt à moderniser <br/> votre centre ?</h2>
              <p className="text-indigo-200/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                Rejoignez la plateforme qui centralise les réservations et la communication pédagogique.
              </p>
              
              <Link to="/auth" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-[#030712] font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]">
                Créer l'espace de votre école
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 border-t border-white/5 bg-[#030712]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">P</div>
              <span className="font-bold text-white tracking-tight">PostResa Platform</span>
            </div>
            
            <p className="text-slate-500 text-sm text-center md:text-left">
              © 2026 PostResa. Basé sur le cahier des charges de développement.
            </p>
            
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Conditions</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;