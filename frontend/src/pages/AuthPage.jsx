import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { loginUser, registerUser, clearAuthError } from '../store/slices/authSlice';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Building2, 
  CheckCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

// Zod validation schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Establishment name must be at least 2 characters'),
  director_name: z.string().min(2, 'Director name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { status, error, user } = useSelector((state) => state.auth);

  // Forms setup
  const { 
    register: registerLogin, 
    handleSubmit: handleLoginSubmit, 
    formState: { errors: loginErrors } 
  } = useForm({ resolver: zodResolver(loginSchema) });

  const { 
    register: registerSignup, 
    handleSubmit: handleSignupSubmit, 
    formState: { errors: signupErrors } 
  } = useForm({ resolver: zodResolver(registerSchema) });

  // Handle API Errors
  useEffect(() => {
    if (error && status === 'failed') {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, status, dispatch]);

  const onLogin = async (data) => {
    const resultAction = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success('Login successful!');
      const loggedInUser = resultAction.payload;
      
      if (loggedInUser.role === 'super_admin') {
        navigate('/superadmin');
      } else if (loggedInUser.role === 'admin') {
        // Check if admin has completed onboarding
        if (loggedInUser.status === 'pending') {
          if (loggedInUser.metadata?.address) {
            navigate('/pending');
          } else {
            navigate('/onboarding');
          }
        } else {
          navigate('/admin');
        }
      } else {
        navigate('/dashboard');
      }
    }
  };

  const onRegister = async (data) => {
    // Add default admin role for new schools based on CDC
    const payload = { ...data, role: 'admin' };
    const resultAction = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Registration successful! Redirecting to setup...');
      navigate('/onboarding');
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    dispatch(clearAuthError());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white flex overflow-hidden">
      
      {/* --- Left Side: Visual & Branding --- */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-slate-950 border-r border-white/5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-slate-950 to-black z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] z-0" />
        
        <div className="relative z-10 flex items-center gap-2">
          <img src="/logo.png" alt="PostResa Logo" className="w-8 h-8 object-contain rounded-lg" />
          <span className="text-xl font-black tracking-tight text-white">
            POST<span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">RESA</span>
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-8 leading-tight">Gérez les ressources de votre établissement en toute simplicité.</h2>
          
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-8 rounded-3xl mb-8 shadow-2xl">
            <div className="flex gap-1 mb-4">
               {[1,2,3,4,5].map(i => <div key={i} className="text-amber-400">★</div>)}
            </div>
            <p className="text-lg text-slate-200 leading-relaxed mb-6">
              "Since implementing PostResa, our reservation conflicts have dropped to zero. It's not just a tool; it's the heartbeat of our campus communication."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold shadow-inner text-white">YA</div>
              <div>
                <h4 className="font-bold text-white">Prof. Youssef Alami</h4>
                <p className="text-sm text-purple-300">Encadrant Pédagogique</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
             <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Real-time Sync</span>
             <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Secure Roles</span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 PostResa Platform. Based on CDC v1.0.
        </div>
      </div>

      {/* --- Right Side: The Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-slate-950">
        <div className="w-full max-w-md">
            
            <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                <img src="/logo.png" alt="PostResa Logo" className="w-8 h-8 object-contain rounded-lg" />
                <span className="text-xl font-black tracking-tight text-white">
                  POST<span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">RESA</span>
                </span>
            </div>

            <div className="text-center mb-8">
                <motion.h2 
                    key={isLogin ? "login-h2" : "signup-h2"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-2 text-white"
                >
                    {isLogin ? "Welcome back" : "Register Establishment"}
                </motion.h2>
                <p className="text-slate-400 text-sm">
                    {isLogin ? "Enter your details to access your dashboard." : "Create a new workspace for your campus."}
                </p>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-2xl relative">
                
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.form 
                            key="login"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
                            onSubmit={handleLoginSubmit(onLogin)} 
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                    <input 
                                      {...registerLogin('email')}
                                      type="email" 
                                      placeholder="nom@ecole.com" 
                                      className={`w-full bg-black/50 border ${loginErrors.email ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 text-white`} 
                                    />
                                </div>
                                {loginErrors.email && <p className="text-xs text-red-400">{loginErrors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                    <input 
                                      {...registerLogin('password')}
                                      type={showPassword ? "text" : "password"} 
                                      placeholder="••••••••" 
                                      className={`w-full bg-black/50 border ${loginErrors.password ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 text-white`} 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {loginErrors.password && <p className="text-xs text-red-400">{loginErrors.password.message}</p>}
                            </div>

                            <div className="flex justify-end">
                                <a href="#" className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">Forgot password?</a>
                            </div>

                            <button 
                              type="submit" 
                              disabled={status === 'loading'}
                              className="w-full py-3.5 mt-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all active:scale-[0.98] group"
                            >
                                {status === 'loading' ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form 
                            key="signup"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                            onSubmit={handleSignupSubmit(onRegister)} 
                            className="space-y-5"
                        >
                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-2">
                              <p className="text-xs text-purple-300 leading-relaxed">
                                <strong className="text-white">Note:</strong> Stagiaires and Professeurs cannot create accounts. You must receive your login credentials directly from your school administration.
                              </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Establishment Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                    <input 
                                      {...registerSignup('name')}
                                      type="text" 
                                      placeholder="Ex: ISTA NTIC Tangier" 
                                      className={`w-full bg-black/50 border ${signupErrors.name ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 text-white`} 
                                    />
                                </div>
                                {signupErrors.name && <p className="text-xs text-red-400">{signupErrors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Director Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                    <input 
                                      {...registerSignup('director_name')}
                                      type="text" 
                                      placeholder="Full Name" 
                                      className={`w-full bg-black/50 border ${signupErrors.director_name ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 text-white`} 
                                    />
                                </div>
                                {signupErrors.director_name && <p className="text-xs text-red-400">{signupErrors.director_name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                    <input 
                                      {...registerSignup('email')}
                                      type="email" 
                                      placeholder="direction@school.ma" 
                                      className={`w-full bg-black/50 border ${signupErrors.email ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 text-white`} 
                                    />
                                </div>
                                {signupErrors.email && <p className="text-xs text-red-400">{signupErrors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Create Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                    <input 
                                      {...registerSignup('password')}
                                      type={showPassword ? "text" : "password"} 
                                      placeholder="••••••••" 
                                      className={`w-full bg-black/50 border ${signupErrors.password ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 text-white`} 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {signupErrors.password && <p className="text-xs text-red-400">{signupErrors.password.message}</p>}
                            </div>

                            <button type="submit" className="w-full py-3.5 mt-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all active:scale-[0.98] group">
                                Next Step <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-400">
                    {isLogin ? "Want to register a new school?" : "Already verified your school?"}
                    <button 
                        onClick={toggleAuthMode}
                        className="ml-2 text-purple-400 hover:text-white font-medium transition-colors focus:outline-none"
                    >
                        {isLogin ? "Sign up here" : "Log in here"}
                    </button>
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;