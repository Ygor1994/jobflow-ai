import React, { useEffect, useState } from 'react';
import { ResumeData, JobOpportunity, LangCode } from '../types';
import { findMatchingJobs, draftCoverLetter, searchJobs } from '../services/geminiService';
import { content } from '../locales';
import { Loader2, Briefcase, MapPin, CheckCircle, Send, Sparkles, Building2, Euro, ArrowLeft, Frown, X, Edit3, Search } from 'lucide-react';

interface JobMatcherProps {
  resumeData: ResumeData;
  lang: LangCode;
  onBack: () => void;
}

export const JobMatcher: React.FC<JobMatcherProps> = ({ resumeData, lang, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [isGenerating, setIsGenerating] = useState<string | null>(null); // Track which job is generating a draft
  const [applyingTo, setApplyingTo] = useState<string | null>(null); // Track sending state
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Editing State
  const [editingJob, setEditingJob] = useState<JobOpportunity | null>(null);
  const [letterDraft, setLetterDraft] = useState("");

  const t = content[lang].jobs;

  useEffect(() => {
    let mounted = true;
    const fetchJobs = async () => {
      setLoading(true);
      // Artificial delay for "scanning" effect to build anticipation
      await new Promise(r => setTimeout(r, 1500));
      const foundJobs = await findMatchingJobs(resumeData, lang);
      
      if (mounted) {
        setJobs(foundJobs);
        setLoading(false);
      }
    };
    fetchJobs();
    return () => { mounted = false; };
  }, [resumeData, lang]);

  const handleManualSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery && !searchLocation) return;

      setIsSearching(true);
      const foundJobs = await searchJobs(searchQuery, searchLocation, lang);
      setJobs(foundJobs);
      setIsSearching(false);
  };

  const handleStartApply = async (job: JobOpportunity) => {
    setIsGenerating(job.id);
    const draft = await draftCoverLetter(job, resumeData, lang);
    setLetterDraft(draft);
    setEditingJob(job);
    setIsGenerating(null);
  };

  const handleSendApplication = async () => {
    if (!editingJob) return;
    setApplyingTo(editingJob.id);
    setEditingJob(null); // Close modal immediately and show loading on button
    
    // Simulate sending delay
    await new Promise(r => setTimeout(r, 1500));
    
    setAppliedJobs(prev => new Set(prev).add(editingJob.id));
    setApplyingTo(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
        <div className="relative w-32 h-32 mb-8">
           <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-[ping_2s_linear_infinite]"></div>
           <div className="absolute inset-2 border-4 border-blue-400/20 rounded-full animate-[ping_2s_linear_infinite_0.5s]"></div>
           <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <Sparkles className="text-blue-400 animate-pulse" size={40} />
           </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{t.searching}</h2>
        <p className="text-slate-400 text-sm md:text-base max-w-md animate-pulse">Analyzing your skills against 500+ open roles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans relative">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Back to Resume
        </button>

        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide border border-blue-200">Beta</span>
            </div>
            <p className="text-slate-600 max-w-2xl">{t.subtitle}</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-3">{t.search.label}</label>
            <form onSubmit={handleManualSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                    <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={t.search.keywords}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="md:w-1/3 relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={t.search.location}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isSearching}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-70"
                >
                    {isSearching ? <Loader2 className="animate-spin" size={18}/> : <Search size={18}/>}
                    {t.search.btn}
                </button>
            </form>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200 animate-in fade-in">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                 <Frown size={32} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">No matches found</h3>
             <p className="text-slate-500 max-w-md mx-auto mb-6">Try adjusting your search keywords or location.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-8 duration-500">
            {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
                    <div className="p-6 flex flex-col md:flex-row gap-6">
                        
                        {/* Match Score Circle */}
                        <div className="flex-shrink-0 flex md:flex-col items-center gap-4 md:gap-2">
                            <div className="relative w-20 h-20">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={job.matchScore > 85 ? '#22c55e' : '#eab308'} strokeWidth="3" strokeDasharray={`${job.matchScore}, 100`} className="animate-[spin_1s_ease-out_reverse]" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-xl font-bold ${job.matchScore > 85 ? 'text-green-600' : 'text-yellow-600'}`}>{job.matchScore}%</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t.match}</span>
                        </div>

                        {/* Job Details */}
                        <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-sm mt-2">
                                        <span className="flex items-center gap-1.5"><Building2 size={16} className="text-slate-400" /> {job.company}</span>
                                        <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job.location}</span>
                                        <span className="flex items-center gap-1.5 text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100"><Euro size={14} /> {job.salaryRange}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                <p className="text-sm text-slate-700 flex items-start gap-2 relative z-10">
                                    <Sparkles size={16} className="flex-shrink-0 mt-0.5 text-blue-500" />
                                    <span><span className="font-bold text-slate-900">{t.why}</span> {job.reason}</span>
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex flex-col justify-center min-w-[200px] pt-4 md:pt-0 md:border-l border-slate-100 md:pl-6">
                             {appliedJobs.has(job.id) ? (
                                <div className="w-full bg-green-50 text-green-700 border border-green-200 py-3 rounded-lg font-bold flex items-center justify-center gap-2 cursor-default animate-in zoom-in duration-300">
                                    <CheckCircle size={20} /> {t.applied}
                                </div>
                             ) : (
                                <button 
                                    onClick={() => handleStartApply(job)}
                                    disabled={!!applyingTo || !!isGenerating}
                                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                                        ${(applyingTo === job.id || isGenerating === job.id)
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-blue-600 hover:to-blue-500 hover:shadow-blue-500/30 transform hover:scale-[1.02] active:scale-95'
                                        }`}
                                >
                                    {applyingTo === job.id ? (
                                        <><Loader2 className="animate-spin" size={18} /> Sending...</>
                                    ) : isGenerating === job.id ? (
                                        <><Loader2 className="animate-spin" size={18} /> Writing...</>
                                    ) : (
                                        <><Send size={18} /> {t.apply}</>
                                    )}
                                </button>
                             )}
                             {!appliedJobs.has(job.id) && (
                                 <div className="text-[10px] text-center text-slate-400 mt-3">
                                     Auto-generates cover letter & sends to: <br/>
                                     <span className="font-mono text-slate-500 bg-slate-100 px-1 rounded">{job.hrEmail}</span>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {editingJob && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setEditingJob(null)}></div>
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in duration-200 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                         <h3 className="font-bold text-slate-800 flex items-center gap-2">
                             <Edit3 size={18} className="text-blue-600"/> {t.review}
                         </h3>
                         <button onClick={() => setEditingJob(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    </div>
                    
                    <div className="p-6 flex-grow">
                         <div className="mb-2">
                            <p className="text-sm font-bold text-slate-900">{editingJob.title} @ {editingJob.company}</p>
                            <p className="text-xs text-slate-500">To: {editingJob.hrEmail}</p>
                         </div>
                         <label className="block text-xs font-bold uppercase text-slate-400 mb-2">{t.edit_label}</label>
                         <textarea 
                             className="w-full h-64 p-4 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50"
                             value={letterDraft}
                             onChange={(e) => setLetterDraft(e.target.value)}
                         />
                    </div>
                    
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                        <button 
                            onClick={() => setEditingJob(null)}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm"
                        >
                            {t.cancel}
                        </button>
                        <button 
                            onClick={handleSendApplication}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                            <Send size={16} /> {t.send}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
