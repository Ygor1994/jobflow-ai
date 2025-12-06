import React from 'react';
import { AuditResult, LangCode } from '../types';
import { content } from '../locales';
import { CheckCircle, AlertTriangle, X, TrendingUp } from 'lucide-react';

interface ResumeAuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    results: AuditResult | null;
    isLoading: boolean;
    lang: LangCode;
}

export const ResumeAuditModal: React.FC<ResumeAuditModalProps> = ({ isOpen, onClose, results, isLoading, lang }) => {
    if (!isOpen) return null;
    
    const t = content[lang].preview.auditModal;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={isLoading ? undefined : onClose}></div>
             <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-300">
                 
                 {/* Header */}
                 <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
                     <h2 className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp size={24} className="text-blue-400"/>
                        {t.title}
                     </h2>
                     {!isLoading && (
                         <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20}/></button>
                     )}
                 </div>

                 {isLoading ? (
                     <div className="p-12 flex flex-col items-center justify-center text-center">
                         <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                         <h3 className="text-xl font-bold text-slate-800 animate-pulse">{t.analyzing}</h3>
                         <p className="text-slate-500 mt-2">Checking ATS compatibility & readability...</p>
                     </div>
                 ) : results ? (
                     <div className="p-6 overflow-y-auto custom-scrollbar">
                         {/* Score Section */}
                         <div className="flex flex-col items-center justify-center mb-8">
                             <div className="relative w-32 h-32 flex items-center justify-center">
                                 <svg className="w-full h-full transform -rotate-90">
                                     <circle cx="64" cy="64" r="60" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                                     <circle 
                                        cx="64" cy="64" r="60" 
                                        stroke={results.score >= 80 ? '#22c55e' : results.score >= 60 ? '#eab308' : '#ef4444'} 
                                        strokeWidth="8" 
                                        fill="transparent" 
                                        strokeDasharray={`${results.score * 3.77} 377`}
                                        className="transition-all duration-1000 ease-out"
                                     />
                                 </svg>
                                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                                     <span className="text-3xl font-bold text-slate-800">{results.score}</span>
                                     <span className="text-[10px] text-slate-400 uppercase font-bold">Score</span>
                                 </div>
                             </div>
                             <p className="text-center text-slate-600 mt-4 max-w-md italic">"{results.summary}"</p>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Strengths */}
                             <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                 <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                     <CheckCircle size={18}/> {t.strengths}
                                 </h3>
                                 <ul className="space-y-3">
                                     {results.strengths.map((str, i) => (
                                         <li key={i} className="flex gap-2 text-sm text-green-700">
                                             <span className="font-bold">•</span> {str}
                                         </li>
                                     ))}
                                 </ul>
                             </div>

                             {/* Improvements */}
                             <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                                 <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                                     <AlertTriangle size={18}/> {t.improvements}
                                 </h3>
                                 <ul className="space-y-3">
                                     {results.improvements.map((imp, i) => (
                                         <li key={i} className="flex gap-2 text-sm text-amber-800">
                                             <span className="font-bold text-amber-500">!</span> {imp}
                                         </li>
                                     ))}
                                 </ul>
                             </div>
                         </div>
                     </div>
                 ) : (
                    <div className="p-8 text-center text-red-500">Analysis failed. Please try again.</div>
                 )}

                 <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex justify-end">
                     {!isLoading && (
                         <button onClick={onClose} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                            {t.close}
                         </button>
                     )}
                 </div>
             </div>
        </div>
    );
};