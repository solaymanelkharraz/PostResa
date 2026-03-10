import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Building2, 
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Toggle between Login and Signup
  const toggleAuthMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white flex overflow-hidden">
      
      {/* --- Left Side: Visual & Branding --- */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-slate-950 border-r border-white/5">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-slate-950 to-black z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] z-0" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-indigo-400 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-purple-900/50">P</div>
          <span className="text-xl font-bold tracking-tight">PostResa</span>
        </div>

        {/* Testimonial / Value Prop */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-8 leading-tight">Manage OFPPT Tangier resources effortlessly.</h2>
          
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-8 rounded-3xl mb-8 shadow-2xl">
            <div className="flex gap-1 mb-4">
               {[1,2,3,4,5].map(i => <div key={i} className="text-amber-400">★</div>)}
            </div>
            <p className="text-lg text-slate-200 leading-relaxed mb-6">
              "Since implementing PostResa, our reservation conflicts have dropped to zero. It's not just a tool; it's the heartbeat of our campus communication."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold shadow-inner text-white">JD</div>
              <div>
                <h4 className="font-bold text-white">John Doe</h4>
                <p className="text-sm text-purple-300">Director at OFPPT</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
             <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Real-time Sync</span>
             <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Secure Roles</span>
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-xs text-slate-500">
          © 2026 PostResa Platform. Based on CDC v1.0.
        </div>
      </div>

      {/* --- Right Side: The Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-slate-950">
        <div className="w-full max-w-md">
            
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-indigo-400 rounded-lg flex items-center justify-center font-bold text-white text-lg">P</div>
                <span className="text-xl font-bold tracking-tight">PostResa</span>
            </div>

            <div className="text-center mb-10">
                <motion.h2 
                    key={isLogin ? "login-h2" : "signup-h2"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-2 text-white"
                >
                    {isLogin ? "Welcome back" : "Create an account"}
                </motion.h2>
                <p className="text-slate-400">
                    {isLogin ? "Enter your details to access your dashboard." : "Join your campus ecosystem today."}
                </p>
            </div>

            {/* Form Container */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    
                    {/* Sign Up Fields (Name & Role) */}
                    <AnimatePresence>
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-5 overflow-hidden"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                        <input 
                                            type="text" 
                                            placeholder="Soulayman Elkharraz" 
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 text-white"
                                        />
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">I am a...</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                        <select className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none text-slate-300">
                                            <option value="student">Stagiaire (Student)</option>
                                            <option value="prof">Prof (Teacher)</option>
                                            <option value="admin">Admin (Staff)</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Common Fields (Email & Password) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                            <input 
                                type="email" 
                                placeholder="name@ofppt.ma" 
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 text-white"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {isLogin && (
                        <div className="flex justify-end">
                            <a href="#" className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">Forgot password?</a>
                        </div>
                    )}

                    {/* Prototype Demo Links */}
                    <div className="pt-4 space-y-3">
                        <Link 
                            to="/dashboard" 
                            className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 group"
                        >
                            {isLogin ? "Sign In (Student/Prof Demo)" : "Create Account"}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        {isLogin && (
                            <Link 
                                to="/admin" 
                                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-white/5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                Login as Admin (Demo)
                            </Link>
                        )}
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button 
                            onClick={toggleAuthMode}
                            className="ml-2 text-purple-400 hover:text-white font-medium transition-colors"
                        >
                            {isLogin ? "Sign up" : "Log in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;