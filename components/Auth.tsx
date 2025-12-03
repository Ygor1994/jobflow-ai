
import React, { useState } from 'react';
import { LangCode } from '../types';
import { content } from '../locales';
import { ArrowLeft, Mail, Lock, Layers, CheckCircle } from 'lucide-react';

interface AuthProps {
  lang: LangCode;
  onLogin: () => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ lang, onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(false); // Default to Sign Up for growth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const t = content[lang].auth;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    if (email && password) {
        onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-3xl"></div>

      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium z-10">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-8 animate-in slide-in-from-bottom-4 duration-500 relative z-10">
        <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-blue-500/20 mb-4">
                <Layers size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{isLogin ? t.loginTitle : t.registerTitle}</h1>
            <p className="text-slate-500 text-sm mt-1">JobFlow AI • Benelux Edition</p>
        </div>

        <button className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors mb-6 shadow-sm">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            {t.google}
        </button>

        <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-grow"></div>
            <span className="text-xs text-slate-400 font-bold uppercase">Or</span>
            <div className="h-px bg-slate-200 flex-grow"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">{t.email}</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl pl-11 pr-4 py-3 outline-none transition-all font-medium"
                        placeholder="name@example.com"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">{t.password}</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl pl-11 pr-4 py-3 outline-none transition-all font-medium"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>

            {!isLogin && (
                <div className="flex flex-col gap-2 py-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle size={12} className="text-green-500"/> Free monthly resume analysis
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle size={12} className="text-green-500"/> Benelux templates included
                    </div>
                </div>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95">
                {isLogin ? t.loginBtn : t.registerBtn}
            </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
                {isLogin ? t.switchRegister : t.switchLogin}
            </button>
        </div>
      </div>
    </div>
  );
};