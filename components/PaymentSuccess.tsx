import React from 'react';
import { Check, CheckCircle, Sparkles } from 'lucide-react';
import { LangCode } from '../types';
import { content } from '../locales';

interface PaymentSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LangCode;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ isOpen, onClose, lang }) => {
  const t = content[lang].success;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300"></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-500 border border-slate-200">
        
        {/* Header Effect */}
        <div className="bg-green-500 p-8 flex justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-green-600/20 rounded-full scale-150 animate-pulse"></div>
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg z-10 relative">
               <Check size={48} className="text-green-600 stroke-[4]" />
               <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" size={24} fill="currentColor" />
           </div>
        </div>

        <div className="p-8 text-center">
           <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.title}</h2>
           <p className="text-slate-500 text-sm mb-8 leading-relaxed">{t.subtitle}</p>

           <div className="space-y-3 mb-8 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
              {t.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-slate-700 font-bold text-sm">{feature}</span>
                  </div>
              ))}
           </div>

           <button 
              onClick={onClose}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02] active:scale-95"
           >
               {t.cta}
           </button>
        </div>
      </div>
    </div>
  );
};
