
import React, { useRef, useState } from 'react';
import { CheckCircle, ArrowRight, Sparkles, Globe, ShieldCheck, Star, Quote, X, LayoutGrid, Briefcase, Zap, Check, Minus, Lock, Mail, MessageCircle, Upload, Loader2, Pencil } from 'lucide-react';
import { LangCode, ResumeData } from '../types';
import { content } from '../locales';
import { parseResumeFromText } from '../services/geminiService';

// Declare PDFJS global from CDN
declare global {
    interface Window {
        pdfjsLib: any;
    }
}

interface LandingProps {
  onStart: () => void;
  onImport: (data: ResumeData) => void;
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  hasSavedData: boolean;
}

export const Landing: React.FC<LandingProps> = ({ onStart, onImport, lang, setLang, hasSavedData }) => {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = content[lang].landing;

  const handleWhatsAppClick = () => {
     const phoneNumber = '31615346763';
     const message = encodeURIComponent(t.whatsapp_message);
     window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsImporting(true);
      try {
          // Read PDF Text
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map((item: any) => item.str).join(' ');
              fullText += pageText + ' ';
          }

          // Send to AI for parsing
          const parsedData = await parseResumeFromText(fullText);
          onImport(parsedData);
      } catch (error) {
          console.error("Import Failed", error);
          alert("Could not read PDF. Please try again or create manually.");
          setIsImporting(false);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                <LayoutGrid size={20} />
             </div>
             <span className="font-bold text-xl tracking-tight text-slate-900">JobFlow AI</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200 overflow-x-auto max-w-[150px] md:max-w-none">
                <button 
                    onClick={() => setLang('en')} 
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    EN
                </button>
                <button 
                    onClick={() => setLang('nl')} 
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === 'nl' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    NL
                </button>
                <button 
                    onClick={() => setLang('es')} 
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === 'es' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    ES
                </button>
                <button 
                    onClick={() => setLang('pt')} 
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === 'pt' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    PT
                </button>
            </div>
            <button onClick={onStart} className="hidden md:flex bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
              {hasSavedData ? t.nav.create : t.nav.create}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-white -z-10"></div>
        
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8 animate-in fade-in zoom-in duration-500">
            <Sparkles size={14} className="text-blue-500" fill="currentColor" />
            {t.hero.badge}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight animate-in slide-in-from-bottom-4 duration-700">
            {t.hero.title} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t.hero.titleHighlight}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-100">
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-in slide-in-from-bottom-8 duration-700 delay-200">
            
            {/* Primary CTA (Create or Update) */}
            <button 
                onClick={onStart} 
                className="group relative bg-blue-600 hover:bg-blue-500 text-white text-lg px-8 py-4 rounded-full font-bold shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 w-full md:w-auto flex items-center justify-center gap-2"
            >
              {hasSavedData ? <Pencil size={20} /> : null}
              {hasSavedData ? t.hero.update_cta : t.hero.cta}
              {!hasSavedData && <ArrowRight className="inline ml-1 group-hover:translate-x-1 transition-transform" size={20} />}
            </button>

            {/* Secondary CTA (Import) */}
            <div className="relative w-full md:w-auto">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-lg px-8 py-4 rounded-full font-bold shadow-sm transition-all hover:-translate-y-1 w-full md:w-auto flex items-center justify-center gap-2"
                >
                    {isImporting ? <Loader2 className="animate-spin" size={20}/> : <Upload size={20} />}
                    {isImporting ? t.hero.importing : t.hero.import_cta}
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf"
                    onChange={handlePdfUpload}
                />
            </div>

          </div>
          
          <div className="mt-8 flex justify-center items-center gap-2 text-sm text-slate-500 font-medium animate-in fade-in duration-700 delay-300">
                <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] overflow-hidden">
                           <img src={`https://randomuser.me/api/portraits/thumb/men/${i*10}.jpg`} alt="User" />
                        </div>
                    ))}
                </div>
                {t.hero.socialProof}
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION (How it works) */}
      <section className="py-20 bg-white border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.workflow.title}</h2>
                  <p className="text-slate-600 max-w-2xl mx-auto">{t.workflow.subtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-slate-100 -z-10"></div>

                  {t.workflow.steps.map((step, index) => (
                      <div key={index} className="flex flex-col items-center text-center group">
                          <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 z-10">
                              {index === 0 && <Briefcase size={32} className="text-blue-600" />}
                              {index === 1 && <Sparkles size={32} className="text-purple-600" />}
                              {index === 2 && <Zap size={32} className="text-yellow-500" fill="currentColor" />}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t.features.ai.title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.features.ai.desc}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t.features.benelux.title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.features.benelux.desc}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t.features.profile.title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.features.profile.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{t.comparison.title}</h2>
              
              <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="grid grid-cols-3 p-6 border-b border-slate-200 bg-slate-100">
                      <div className="col-span-1"></div>
                      <div className="col-span-1 text-center font-bold text-xl text-blue-600">{t.comparison.us}</div>
                      <div className="col-span-1 text-center font-bold text-slate-500">{t.comparison.them}</div>
                  </div>
                  
                  {/* Rows */}
                  {t.comparison.features.map((item, i) => (
                      <div key={i} className="grid grid-cols-3 p-4 border-b border-slate-200 last:border-0 items-center hover:bg-white transition-colors">
                          <div className="col-span-1 font-medium text-slate-700 text-sm md:text-base">{item.name}</div>
                          <div className="col-span-1 flex justify-center">
                              {item.us ? <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Check size={18} strokeWidth={3} /></div> : <Minus className="text-slate-300"/>}
                          </div>
                          <div className="col-span-1 flex justify-center">
                              {item.them ? <Check size={18} className="text-slate-400"/> : <X size={18} className="text-red-300"/>}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">{t.testimonials.title}</h2>
              <p className="text-slate-400 max-w-xl mx-auto">{t.testimonials.subtitle}</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {t.testimonials.reviews.map((review, i) => (
                   <div key={i} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative">
                       <Quote className="absolute top-6 right-6 text-slate-600 opacity-50" size={40} />
                       <div className="flex gap-1 text-yellow-400 mb-4">
                           {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                       </div>
                       <p className="text-slate-300 mb-6 leading-relaxed italic">"{review.text}"</p>
                       <div>
                           <p className="font-bold text-white">{review.name}</p>
                           <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">{review.role} • {review.loc}</p>
                       </div>
                   </div>
               ))}
           </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.pricing.title}</h2>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-blue-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
              {t.pricing.bestValue}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t.pricing.planName}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-extrabold text-slate-900">{t.pricing.price}</span>
              <span className="text-slate-500">{t.pricing.period}</span>
            </div>
            <p className="text-sm text-slate-600 mb-8 border-b border-slate-100 pb-8">{t.pricing.desc}</p>
            
            <ul className="space-y-4 mb-8">
              {t.pricing.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                  <span className="text-slate-700 text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button onClick={onStart} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 mb-4">
              {t.pricing.cta}
            </button>
            
            <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
               <Lock size={10} /> {t.pricing.secure}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
                 <LayoutGrid size={24} />
                 <span className="font-bold text-xl tracking-tight">JobFlow AI</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">
                {t.footer}
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-slate-500 text-sm border border-slate-200 hover:bg-slate-200 transition-colors">
                <Mail size={16} />
                <span className="font-bold">{t.support}:</span>
                <a href="mailto:ygorsilveira065@gmail.com" className="hover:text-blue-600 transition-colors">ygorsilveira065@gmail.com</a>
            </div>
        </div>
      </footer>

       {/* Floating WhatsApp Button */}
       <button 
         onClick={handleWhatsAppClick}
         className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl shadow-green-500/40 hover:bg-green-400 hover:scale-110 transition-all animate-bounce z-50"
         title="Chat on WhatsApp"
       >
          <MessageCircle size={28} fill="white" className="text-green-500" />
       </button>
    </div>
  );
};
