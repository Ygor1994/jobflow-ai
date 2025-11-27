
import React, { useState } from 'react';
import { X, Check, Lock, CreditCard, Zap, Star, ExternalLink } from 'lucide-react';
import { content } from '../locales';
import { LangCode } from '../types';

// ==========================================================================
// 🟢 CONFIGURAÇÃO: LINK DE PAGAMENTO STRIPE
// ==========================================================================
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVq00lgJOeSm0zc6Ku24000";
// ==========================================================================

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: LangCode;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, lang }) => {
  const t = content[lang].payment;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
        
        {/* Header with Value Prop */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
                {t.title} <Zap size={18} className="text-yellow-400 fill-yellow-400"/>
            </h3>
            <p className="text-slate-300 text-xs mt-1">{t.subtitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6">
          {/* Pricing Display with Anchor */}
          <div className="flex flex-col items-center justify-center mb-6 border-b border-slate-100 pb-6">
            <span className="text-slate-400 text-sm font-medium line-through decoration-red-500 mb-1">{t.totalValue}: €24.90</span>
            <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-slate-900 tracking-tight">€9.90</span>
                <span className="text-slate-500 font-medium mb-2">{t.period}</span>
            </div>
            <div className="mt-2 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                {t.launchOffer}
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Star size={16} fill="currentColor" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.features.headhunter.title}</h4>
                    <p className="text-xs text-slate-500">{t.features.headhunter.desc}</p>
                </div>
            </div>
            <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                    <Check size={16} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.features.downloads.title}</h4>
                    <p className="text-xs text-slate-500">{t.features.downloads.desc}</p>
                </div>
            </div>
            <div className="flex gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 flex-shrink-0">
                    <Check size={16} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.features.writer.title}</h4>
                    <p className="text-xs text-slate-500">{t.features.writer.desc}</p>
                </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-3 text-center">{t.secure}</label>
            <div className="grid grid-cols-3 gap-2 opacity-90">
              <div className="border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center gap-1 h-12 bg-slate-50">
                <CreditCard size={18} className="text-slate-600"/>
              </div>
              <div className="border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center gap-1 h-12 bg-pink-50">
                 <span className="font-bold italic text-sm text-pink-600">iDEAL</span>
              </div>
              <div className="border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center gap-1 h-12 bg-yellow-50">
                 <span className="font-bold text-[10px] text-blue-800">Bancontact</span>
              </div>
            </div>
          </div>

          <a 
            href={STRIPE_PAYMENT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 no-underline cursor-pointer"
          >
            <ExternalLink size={18} />
            {t.cta}
          </a>
          
          <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Lock size={10} /> {t.guarantee}
              </p>
              <p className="text-[10px] text-slate-400">
                  {t.support}: <a href="mailto:ygorsilveira065@gmail.com" className="text-blue-500 hover:underline">ygorsilveira065@gmail.com</a>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};
