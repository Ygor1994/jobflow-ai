
import React, { useRef, useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Sparkles, Globe, ShieldCheck, Star, Quote, X, LayoutGrid, Briefcase, Zap, Check, Minus, Lock, Mail, MessageCircle, Upload, Loader2, Pencil, Layers, Cookie, Menu, Linkedin, Twitter, Instagram, Layout, Download, FileText, User, MapPin, Phone, Bot, Crown } from 'lucide-react';
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
  onLogin: () => void;
  onLegal: (type: 'privacy' | 'terms') => void;
  onImport: (data: ResumeData) => void;
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  hasSavedData: boolean;
}

export const Landing: React.FC<LandingProps> = ({ onStart, onLogin, onLegal, onImport, lang, setLang, hasSavedData }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = content[lang].landing;

  useEffect(() => {
      const consent = localStorage.getItem('jobflow_cookie_consent');
      if (!consent) setShowCookies(true);
  }, []);

  const acceptCookies = () => {
      localStorage.setItem('jobflow_cookie_consent', 'true');
      setShowCookies(false);
  };

  const handleWhatsAppClick = () => {
     const phoneNumber = '31615346763';
     const message = encodeURIComponent(t.whatsapp_message);
     window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setIsMenuOpen(false);
      } else if (id === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setIsMenuOpen(false);
      }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setContactSent(true);
      setTimeout(() => setContactSent(false), 3000);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsImporting(true);
      try {
          const arrayBuffer = await file.arrayBuffer();
          if (!window.pdfjsLib) throw new Error("PDF Library not loaded");
          
          const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              // IMPORTANT: Join with newline to preserve structure for AI
              const pageText = textContent.items.map((item: any) => item.str).join('\n');
              fullText += pageText + '\n';
          }

          if (fullText.trim().length < 50) {
              alert("Could not read text from this PDF. It might be an image scan. Please try a text-based PDF or enter details manually.");
              setIsImporting(false);
              return;
          }

          const parsedData = await parseResumeFromText(fullText);
          onImport(parsedData);
      } catch (error) {
          console.error("Import Failed", error);
          alert("Could not import PDF. Please try creating manually.");
          setIsImporting(false);
      }
  };

  // --- VISUAL COMPONENTS FOR RESUME MOCKUP ---
  const MiniResume = ({ variant = 'modern' }: { variant?: 'modern' | 'classic' | 'bold' }) => (
      <div className={`w-full h-full bg-white rounded-lg overflow-hidden flex flex-col text-[4px] leading-tight shadow-sm border border-slate-100 ${variant === 'bold' ? 'font-serif' : 'font-sans'}`}>
          {variant === 'modern' && (
              <div className="flex h-full">
                  <div className="w-[30%] bg-slate-800 h-full p-2 flex flex-col gap-1">
                      <div className="w-6 h-6 bg-slate-600 rounded-full mb-1 mx-auto"></div>
                      <div className="h-0.5 w-full bg-slate-700 mb-1"></div>
                      <div className="h-0.5 w-2/3 bg-slate-700"></div>
                      <div className="h-0.5 w-3/4 bg-slate-700 mt-2"></div>
                      <div className="h-0.5 w-1/2 bg-slate-700"></div>
                  </div>
                  <div className="w-[70%] p-2 flex flex-col gap-1.5">
                      <div className="h-2 w-3/4 bg-blue-600 rounded-sm mb-1"></div>
                      <div className="h-1 w-1/2 bg-slate-200 rounded-sm mb-2"></div>
                      <div className="h-0.5 w-full bg-slate-100"></div>
                      <div className="h-0.5 w-full bg-slate-100"></div>
                      <div className="h-0.5 w-full bg-slate-100"></div>
                      <div className="h-1 w-1/3 bg-slate-300 rounded-sm mt-1"></div>
                      <div className="h-0.5 w-full bg-slate-100"></div>
                  </div>
              </div>
          )}
          {variant === 'classic' && (
              <div className="p-2 flex flex-col gap-1 h-full">
                  <div className="text-center border-b border-slate-200 pb-1 mb-1">
                      <div className="h-1.5 w-1/2 bg-slate-800 mx-auto mb-0.5"></div>
                      <div className="h-0.5 w-1/3 bg-slate-400 mx-auto"></div>
                  </div>
                  <div className="flex gap-2 h-full">
                      <div className="w-2/3 flex flex-col gap-1">
                          <div className="h-1 w-1/3 bg-slate-300"></div>
                          <div className="h-0.5 w-full bg-slate-100"></div>
                          <div className="h-0.5 w-full bg-slate-100"></div>
                          <div className="h-1 w-1/3 bg-slate-300 mt-1"></div>
                          <div className="h-0.5 w-full bg-slate-100"></div>
                      </div>
                      <div className="w-1/3 bg-slate-50 p-1 rounded">
                          <div className="h-1 w-1/2 bg-slate-300 mb-1"></div>
                          <div className="h-0.5 w-full bg-slate-200 mb-0.5"></div>
                          <div className="h-0.5 w-full bg-slate-200 mb-0.5"></div>
                      </div>
                  </div>
              </div>
          )}
          {variant === 'bold' && (
              <div className="flex flex-col h-full">
                  <div className="h-6 bg-emerald-600 p-2 text-white">
                      <div className="h-1.5 w-1/2 bg-white/90 mb-0.5"></div>
                      <div className="h-0.5 w-1/3 bg-white/70"></div>
                  </div>
                  <div className="p-2 grid grid-cols-2 gap-2">
                      <div className="col-span-1 flex flex-col gap-1">
                          <div className="h-1 w-1/2 bg-slate-300"></div>
                          <div className="h-0.5 w-full bg-slate-100"></div>
                          <div className="h-0.5 w-full bg-slate-100"></div>
                      </div>
                      <div className="col-span-1 flex flex-col gap-1">
                          <div className="h-1 w-1/2 bg-slate-300"></div>
                          <div className="h-0.5 w-full bg-slate-100"></div>
                          <div className="h-0.5 w-full bg-slate-100"></div>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden relative">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection('home')}>
             <div className="bg-gradient-to-br from-blue-600 to-emerald-500 text-white p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-emerald-500/30 transition-all duration-500">
                <Layers size={22} strokeWidth={2.5} />
             </div>
             <span className="font-extrabold text-xl tracking-tight text-slate-900">JobFlow<span className="text-emerald-600">.AI</span></span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('home')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">{t.nav.home}</button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">{t.nav.features}</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">{t.nav.pricing}</button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">{t.nav.contact}</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200">
                {(['en', 'nl', 'es', 'pt'] as LangCode[]).map((l) => (
                    <button 
                        key={l}
                        onClick={() => setLang(l)} 
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all uppercase ${lang === l ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        {l}
                    </button>
                ))}
            </div>
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <button onClick={onLogin} className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
                {t.nav.login}
            </button>

            <button onClick={onStart} className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-slate-900/20 hover:shadow-emerald-600/30 transform hover:-translate-y-0.5">
              {hasSavedData ? t.hero.update_cta : t.nav.create}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-700 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-100 p-6 absolute w-full shadow-2xl animate-in slide-in-from-top-5 duration-200">
                <div className="flex flex-col space-y-6">
                    <button onClick={() => scrollToSection('home')} className="text-left font-bold text-lg text-slate-700">{t.nav.home}</button>
                    <button onClick={() => scrollToSection('features')} className="text-left font-bold text-lg text-slate-700">{t.nav.features}</button>
                    <button onClick={() => scrollToSection('pricing')} className="text-left font-bold text-lg text-slate-700">{t.nav.pricing}</button>
                    <button onClick={() => scrollToSection('contact')} className="text-left font-bold text-lg text-slate-700">{t.nav.contact}</button>
                    <div className="h-px bg-slate-100 w-full my-2"></div>
                    <button onClick={onLogin} className="text-left font-bold text-lg text-emerald-600">{t.nav.login}</button>
                    <button onClick={() => { setIsMenuOpen(false); onStart(); }} className="bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg">
                        {t.nav.create}
                    </button>
                    <div className="flex justify-center gap-3 pt-4 border-t border-slate-100">
                        {(['en', 'nl', 'es', 'pt'] as LangCode[]).map((l) => (
                            <button key={l} onClick={() => setLang(l)} className={`uppercase text-xs font-bold p-3 rounded-lg border ${lang === l ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500'}`}>{l}</button>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-16 pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8 shadow-sm">
            <Sparkles size={14} className="text-emerald-500" fill="currentColor" />
            {t.hero.badge}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
            {t.hero.title} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 animate-gradient-x">{t.hero.titleHighlight}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-16">
            <button 
                onClick={onStart} 
                className="group relative bg-slate-900 hover:bg-slate-800 text-white text-lg px-8 py-4 rounded-full font-bold shadow-2xl shadow-blue-900/20 transition-all hover:-translate-y-1 w-full md:w-auto flex items-center justify-center gap-2"
            >
              {hasSavedData ? <Pencil size={20} /> : null}
              {hasSavedData ? t.hero.update_cta : t.hero.cta}
              {!hasSavedData && <ArrowRight className="inline ml-1 group-hover:translate-x-1 transition-transform" size={20} />}
            </button>

            <div className="relative w-full md:w-auto">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 text-lg px-8 py-4 rounded-full font-bold shadow-lg shadow-slate-200/50 transition-all hover:-translate-y-1 w-full md:w-auto flex items-center justify-center gap-2"
                >
                    {isImporting ? <Loader2 className="animate-spin" size={20}/> : <Upload size={20} />}
                    {isImporting ? t.hero.importing : t.hero.import_cta}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handlePdfUpload} />
            </div>
          </div>

          {/* REALISTIC VISUAL RESUME MOCKUP */}
          <div className="relative w-full max-w-4xl mx-auto mt-12 perspective-1000">
              {/* Floating Decorative Elements */}
              <div className="absolute top-20 -left-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:flex items-center gap-3 animate-float z-20">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><CheckCircle size={20} /></div>
                  <div>
                      <div className="text-xs text-slate-400 font-bold uppercase">ATS Score</div>
                      <div className="text-lg font-bold text-slate-800">98/100</div>
                  </div>
              </div>

              <div className="absolute bottom-40 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:flex items-center gap-3 animate-float animation-delay-2000 z-20">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Bot size={20} /></div>
                  <div>
                      <div className="text-xs text-slate-400 font-bold uppercase">AI Writer</div>
                      <div className="text-lg font-bold text-slate-800">Active</div>
                  </div>
              </div>

              {/* Resume Paper */}
              <div className="bg-white rounded-t-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200/60 overflow-hidden relative mx-auto w-full md:w-[75%] aspect-[210/250] flex flex-col transform rotate-x-12 origin-bottom transition-transform hover:scale-[1.02] duration-500">
                  
                  {/* Decorative Header */}
                  <div className="bg-slate-900 h-24 w-full p-6 flex items-center gap-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 opacity-20"></div>
                      <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 flex-shrink-0 backdrop-blur-sm"></div>
                      <div className="space-y-2 w-full z-10">
                          <div className="h-4 w-1/2 bg-white/80 rounded-full"></div>
                          <div className="h-2 w-1/3 bg-white/40 rounded-full"></div>
                      </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-grow flex p-8 gap-8">
                      {/* Sidebar */}
                      <div className="w-[25%] space-y-6 hidden sm:block">
                          <div className="space-y-3">
                              <div className="h-2 w-16 bg-slate-300 rounded-full"></div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full"></div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full"></div>
                          </div>
                          <div className="space-y-3">
                              <div className="h-2 w-16 bg-slate-300 rounded-full"></div>
                              <div className="flex flex-wrap gap-2">
                                  <div className="h-6 w-full bg-blue-50 rounded-lg border border-blue-100"></div>
                                  <div className="h-6 w-full bg-blue-50 rounded-lg border border-blue-100"></div>
                              </div>
                          </div>
                      </div>

                      {/* Main Area */}
                      <div className="flex-1 space-y-8">
                          {/* Summary */}
                          <div className="space-y-3">
                              <div className="h-2 w-24 bg-slate-800 rounded-full"></div>
                              <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                              <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                              <div className="h-2 w-2/3 bg-slate-100 rounded-full"></div>
                          </div>

                          {/* Experience */}
                          <div className="space-y-6">
                              <div className="h-2 w-24 bg-slate-800 rounded-full"></div>
                              
                              <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                                  <div className="flex justify-between">
                                      <div className="h-3 w-1/3 bg-slate-700 rounded-full"></div>
                                      <div className="h-3 w-16 bg-emerald-100 text-emerald-600 rounded-full"></div>
                                  </div>
                                  <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                  <div className="h-2 w-5/6 bg-slate-100 rounded-full"></div>
                              </div>

                              <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                                  <div className="flex justify-between">
                                      <div className="h-3 w-1/3 bg-slate-700 rounded-full"></div>
                                      <div className="h-3 w-16 bg-emerald-100 rounded-full"></div>
                                  </div>
                                  <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          
          <div className="mt-16 flex justify-center items-center gap-3 text-sm text-slate-500 font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] overflow-hidden shadow-sm">
                           <img src={`https://randomuser.me/api/portraits/thumb/men/${i*12}.jpg`} alt="User" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                </div>
                <span className="text-slate-600">{t.hero.socialProof}</span>
          </div>
        </div>
      </section>

      {/* TEMPLATE SHOWCASE */}
      <section id="features" className="py-24 bg-slate-50 border-y border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/50 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div className="max-w-2xl">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{t.features.templates.title}</h2>
                      <p className="text-slate-600 text-lg">{t.features.templates.desc}</p>
                  </div>
                  <button onClick={onStart} className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                      View all templates <ArrowRight size={20} />
                  </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {['modern', 'classic', 'bold', 'modern'].map((v, i) => (
                      <div key={i} className="group relative bg-white p-3 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer" onClick={onStart}>
                          <div className="aspect-[210/297] bg-slate-50 rounded-xl border border-slate-100 overflow-hidden relative">
                              <MiniResume variant={v as any} />
                              
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                      <span className="bg-white text-slate-900 px-5 py-2.5 rounded-full font-bold text-xs shadow-xl flex items-center gap-2">
                                          <Pencil size={12} /> Use Template
                                      </span>
                                  </div>
                              </div>
                          </div>
                          <div className="mt-4 text-center">
                              <span className="text-sm font-bold text-slate-700 capitalize group-hover:text-blue-600 transition-colors">{v} Style</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* WORKFLOW SECTION with AI Icons */}
      <section className="py-24 bg-white relative">
          <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">{t.workflow.title}</h2>
                  <p className="text-slate-600 max-w-2xl mx-auto text-lg">{t.workflow.subtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                  {/* Connector Line */}
                  <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-100 via-emerald-100 to-blue-100 -z-10"></div>
                  
                  {t.workflow.steps.map((step, index) => (
                      <div key={index} className="flex flex-col items-center text-center group">
                          <div className="w-24 h-24 bg-white border border-slate-100 rounded-3xl shadow-lg shadow-slate-200/50 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 z-10 relative overflow-hidden">
                              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-emerald-600' : 'bg-orange-500'}`}></div>
                              {index === 0 && <Briefcase size={32} className="text-blue-600" strokeWidth={1.5} />}
                              {index === 1 && <Sparkles size={32} className="text-emerald-500" strokeWidth={1.5} />}
                              {index === 2 && <Download size={32} className="text-orange-500" strokeWidth={1.5} />}
                          </div>
                          <div className="bg-slate-50 px-3 py-1 rounded-full text-xs font-bold text-slate-500 mb-3 border border-slate-100">STEP {index + 1}</div>
                          <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* COMPARISON */}
      <section className="py-24 bg-slate-50/50">
          <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{t.comparison.title}</h2>
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/40">
                  <div className="grid grid-cols-3 p-6 border-b border-slate-100 bg-slate-50/50">
                      <div className="col-span-1"></div>
                      <div className="col-span-1 text-center font-extrabold text-xl text-emerald-600 tracking-tight">{t.comparison.us}</div>
                      <div className="col-span-1 text-center font-bold text-slate-400">{t.comparison.them}</div>
                  </div>
                  {t.comparison.features.map((item, i) => (
                      <div key={i} className="grid grid-cols-3 p-5 border-b border-slate-50 last:border-0 items-center hover:bg-slate-50/80 transition-colors">
                          <div className="col-span-1 font-medium text-slate-700 text-sm md:text-base pr-4">{item.name}</div>
                          <div className="col-span-1 flex justify-center">
                              {item.us ? (
                                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                                      <Check size={18} strokeWidth={3} />
                                  </div>
                              ) : <Minus className="text-slate-300"/>}
                          </div>
                          <div className="col-span-1 flex justify-center">
                              {item.them ? <Check size={18} className="text-slate-300"/> : <X size={18} className="text-red-200"/>}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.testimonials.title}</h2>
                  <p className="text-slate-600 max-w-2xl mx-auto">{t.testimonials.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {t.testimonials.reviews.map((review, index) => (
                      <div key={index} className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100 relative hover:shadow-md transition-shadow duration-300">
                          <Quote className="text-blue-100 absolute top-6 right-6" size={48} />
                          <div className="flex items-center gap-1 mb-6 text-yellow-400">
                              {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                          </div>
                          <p className="text-slate-700 mb-8 italic leading-relaxed text-sm">"{review.text}"</p>
                          <div className="flex items-center gap-4 mt-auto">
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-slate-600 text-lg shadow-sm border border-slate-200">
                                  {review.name.charAt(0)}
                              </div>
                              <div>
                                  <div className="font-bold text-slate-900 text-sm">{review.name}</div>
                                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mt-0.5">{review.loc}</div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* PRICING (TIERS) */}
      <section id="pricing" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-50"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{t.pricing.title}</h2>
              <p className="text-slate-400 text-lg">{t.pricing.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* FREE TIER */}
              <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700 hover:border-slate-600 transition-all">
                  <h3 className="text-xl font-bold text-white mb-2">{t.pricing.free.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-extrabold text-white">{t.pricing.free.price}</span>
                      <span className="text-slate-500">{t.pricing.free.period}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-slate-700">{t.pricing.free.desc}</p>
                  <ul className="space-y-4 mb-8">
                      {t.pricing.free.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                              <CheckCircle size={16} className="text-slate-500" /> {feat}
                          </li>
                      ))}
                  </ul>
                  <button onClick={onLogin} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold transition-all border border-slate-600">
                      {t.pricing.free.cta}
                  </button>
              </div>

              {/* PREMIUM TIER */}
              <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-blue-500/20 border-4 border-blue-600 relative overflow-hidden transform md:-translate-y-6">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider shadow-sm">
                      {t.pricing.premium.tag}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                      {t.pricing.premium.name} <Crown size={18} className="text-yellow-500 fill-yellow-500" />
                  </h3>
                  <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-5xl font-extrabold text-slate-900">{t.pricing.premium.price}</span>
                      <span className="text-slate-500 font-medium">{t.pricing.premium.period}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-8 pb-8 border-b border-slate-100">{t.pricing.premium.desc}</p>
                  <ul className="space-y-4 mb-8">
                      {t.pricing.premium.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check size={14} className="text-emerald-600 stroke-[3]" />
                              </div>
                              {feat}
                          </li>
                      ))}
                  </ul>
                  <button onClick={onStart} className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 mb-4">
                      {t.pricing.premium.cta}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                      <Lock size={10} /> {t.pricing.premium.secure}
                  </p>
              </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4">
              <div className="bg-slate-50 rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                  <div className="bg-slate-900 p-10 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
                      {/* Decoration */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                      
                      <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-4">{t.contact.title}</h3>
                          <p className="text-slate-400 text-sm mb-8 leading-relaxed">{t.contact.subtitle}</p>
                          <div className="space-y-6">
                              <div className="flex items-center gap-4 group">
                                  <div className="w-12 h-12 bg-white/10 group-hover:bg-blue-600 transition-colors rounded-2xl flex items-center justify-center"><Mail size={20}/></div>
                                  <div>
                                      <div className="text-xs text-slate-400 uppercase font-bold mb-0.5">Email Us</div>
                                      <div className="text-sm font-medium">support@jobflowai.xyz</div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4 group">
                                  <div className="w-12 h-12 bg-white/10 group-hover:bg-green-600 transition-colors rounded-2xl flex items-center justify-center"><MessageCircle size={20}/></div>
                                  <div>
                                      <div className="text-xs text-slate-400 uppercase font-bold mb-0.5">Chat</div>
                                      <div className="text-sm font-medium">WhatsApp Support</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="p-10 md:w-3/5">
                      {contactSent ? (
                          <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm">
                                  <Check size={40} strokeWidth={3} />
                              </div>
                              <h4 className="text-2xl font-bold text-slate-900 mb-2">{t.contact.success}</h4>
                              <p className="text-slate-500">We'll get back to you shortly.</p>
                          </div>
                      ) : (
                          <form onSubmit={handleContactSubmit} className="space-y-5">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">{t.contact.name}</label>
                                  <input type="text" required className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" placeholder="Your Name" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">{t.contact.email}</label>
                                  <input type="email" required className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" placeholder="you@company.com" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">{t.contact.message}</label>
                                  <textarea required rows={4} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none" placeholder="How can we help?"></textarea>
                              </div>
                              <button type="submit" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/30 w-full transform active:scale-95">
                                  {t.contact.submit}
                              </button>
                          </form>
                      )}
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                        <div className="bg-slate-900 text-white p-2 rounded-lg">
                            <Layers size={20} />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-slate-900">JobFlow AI</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        The ultimate AI-powered career tool optimized for the European job market.
                    </p>
                    <div className="flex justify-center md:justify-start gap-4">
                        <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all"><Linkedin size={18} /></a>
                        <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-400 hover:text-white transition-all"><Twitter size={18} /></a>
                        <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18} /></a>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-bold text-slate-900 mb-6">Product</h4>
                    <ul className="space-y-4 text-sm text-slate-600">
                        <li><button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Features</button></li>
                        <li><button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Pricing</button></li>
                        <li><button onClick={onStart} className="hover:text-blue-600 transition-colors">Templates</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm text-slate-600">
                        <li><button onClick={() => onLegal('privacy')} className="hover:text-blue-600 transition-colors">{t.legal.privacy}</button></li>
                        <li><button onClick={() => onLegal('terms')} className="hover:text-blue-600 transition-colors">{t.legal.terms}</button></li>
                        <li><button className="hover:text-blue-600 transition-colors">Cookie Policy</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 mb-6">Contact</h4>
                    <ul className="space-y-4 text-sm text-slate-600">
                        <li className="flex items-center justify-center md:justify-start gap-2">
                            <Mail size={16} className="text-blue-600"/> 
                            <a href="mailto:support@jobflowai.xyz" className="hover:underline">support@jobflowai.xyz</a>
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-2">
                            <MapPin size={16} className="text-blue-600"/> 
                            <span>Amsterdam, NL</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-8 text-center text-sm text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>{t.footer}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Systems Operational</span>
                </div>
            </div>
        </div>
      </footer>

       {/* Floating WhatsApp */}
       <button onClick={handleWhatsAppClick} className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl shadow-green-500/30 hover:bg-[#20bd5a] hover:scale-110 transition-all z-50 group">
          <MessageCircle size={28} fill="white" className="group-hover:animate-wiggle" />
          <span className="absolute right-full mr-4 bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap top-1/2 -translate-y-1/2 pointer-events-none">
              Chat with us
          </span>
       </button>

       {/* Cookie Banner (GDPR) */}
       {showCookies && (
           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[60] animate-in slide-in-from-bottom-full duration-500">
               <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="flex items-start gap-4">
                       <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0"><Cookie size={24} /></div>
                       <div>
                           <h4 className="font-bold text-slate-900 text-sm mb-1">Cookie Preferences</h4>
                           <p className="text-sm text-slate-500 font-medium">{t.cookie.text}</p>
                       </div>
                   </div>
                   <div className="flex gap-3 w-full sm:w-auto">
                       <button onClick={acceptCookies} className="flex-1 sm:flex-none bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg">
                           {t.cookie.accept}
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};