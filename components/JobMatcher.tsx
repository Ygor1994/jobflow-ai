
import React, { useEffect, useState } from 'react';
import { ResumeData, JobOpportunity, LangCode, Skill } from '../types';
import { findMatchingJobs, draftCoverLetter, searchJobs, generateInterviewPrep, tailorResume, analyzeInterviewAnswer } from '../services/geminiService';
import { content } from '../locales';
import { Loader2, Briefcase, MapPin, CheckCircle, Send, Sparkles, Building2, Euro, ArrowLeft, Frown, X, Edit3, Search, ExternalLink, Globe, RotateCcw, Save, MessageSquare, Lightbulb, GraduationCap, Wand2, Zap, Undo2, BrainCircuit } from 'lucide-react';

interface JobMatcherProps {
  resumeData: ResumeData;
  onUpdateData: (data: ResumeData) => void;
  lang: LangCode;
  onBack: () => void;
}

export const JobMatcher: React.FC<JobMatcherProps> = ({ resumeData, onUpdateData, lang, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [isPrepping, setIsPrepping] = useState<string | null>(null);
  const [isTailoring, setIsTailoring] = useState<string | null>(null);
  const [tailorSuccess, setTailorSuccess] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [editingJob, setEditingJob] = useState<JobOpportunity | null>(null);
  const [letterDraft, setLetterDraft] = useState("");

  const [prepData, setPrepData] = useState<any[] | null>(null);
  const [prepJobTitle, setPrepJobTitle] = useState<string>("");

  // Answer Analysis State
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [aiFeedback, setAiFeedback] = useState<Record<number, string>>({});
  const [analyzingIndex, setAnalyzingIndex] = useState<number | null>(null);

  const [backupData, setBackupData] = useState<ResumeData | null>(null);

  const t = content[lang].jobs;
  
  // Use jobs from resumeData or empty array
  const jobs = resumeData.jobMatches || [];

  useEffect(() => {
    // Only fetch automatically if we have NO jobs saved
    if (jobs.length === 0 && !loading) {
        performAutoMatch();
    }
  }, []);

  useEffect(() => {
      if (tailorSuccess) {
          const timer = setTimeout(() => {
              // Only auto-clear if we haven't undid it already
              if (tailorSuccess) setTailorSuccess(null);
          }, 6000); // Give user 6 seconds to undo
          return () => clearTimeout(timer);
      }
  }, [tailorSuccess]);

  const performAutoMatch = async () => {
      setLoading(true);
      try {
        const foundJobs = await findMatchingJobs(resumeData, lang);
        onUpdateData({ ...resumeData, jobMatches: foundJobs });
      } catch (e) {
          console.error(e);
      } finally {
        setLoading(false);
      }
  };

  const handleRefresh = () => {
      performAutoMatch();
  };

  const handleManualSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery && !searchLocation) return;
      setIsSearching(true);
      try {
          const foundJobs = await searchJobs(searchQuery, searchLocation, lang);
          // Prepend new search results to existing matches
          onUpdateData({ ...resumeData, jobMatches: [...foundJobs, ...jobs] });
      } finally {
          setIsSearching(false);
      }
  };

  const markAsApplied = (jobId: string) => {
      const updatedJobs = jobs.map(j => j.id === jobId ? { ...j, applied: true } : j);
      onUpdateData({ ...resumeData, jobMatches: updatedJobs });
  };

  const handleStartApply = async (job: JobOpportunity) => {
    if (job.url) {
        window.open(job.url, '_blank');
        markAsApplied(job.id);
    } else {
        setIsGenerating(job.id);
        const draft = await draftCoverLetter(job, resumeData, lang);
        setLetterDraft(draft);
        setEditingJob(job);
        setIsGenerating(null);
    }
  };

  const handleSendApplication = async () => {
    if (!editingJob) return;
    setApplyingTo(editingJob.id);
    setEditingJob(null);
    await new Promise(r => setTimeout(r, 1500));
    markAsApplied(editingJob.id);
    setApplyingTo(null);
  };

  const handleSaveToResume = () => {
      if (!editingJob) return;
      
      onUpdateData({
          ...resumeData,
          coverLetter: {
              ...resumeData.coverLetter,
              companyName: editingJob.company,
              recipientName: "Hiring Manager", 
              body: letterDraft
          }
      });
      
      setEditingJob(null);
      markAsApplied(editingJob.id);
      onBack(); // Go back to preview so they can see/download it
  };

  const handleInterviewPrep = async (job: JobOpportunity) => {
      setIsPrepping(job.id);
      setPrepJobTitle(`${job.title} @ ${job.company}`);
      setPrepData(null);
      setUserAnswers({});
      setAiFeedback({});
      try {
          const questions = await generateInterviewPrep(job.title, job.company, lang);
          setPrepData(questions);
      } catch (e) {
          alert("Could not generate interview prep.");
      } finally {
          setIsPrepping(null);
      }
  };

  const handleAnalyzeAnswer = async (index: number, question: string) => {
      const answer = userAnswers[index];
      if (!answer) return;

      setAnalyzingIndex(index);
      try {
          const feedback = await analyzeInterviewAnswer(question, answer, lang);
          setAiFeedback(prev => ({...prev, [index]: feedback}));
      } catch(e) {
          console.error(e);
      } finally {
          setAnalyzingIndex(null);
      }
  };

  const handleTailorCv = async (job: JobOpportunity) => {
      setBackupData(JSON.parse(JSON.stringify(resumeData))); // Deep copy for backup
      setIsTailoring(job.id);
      try {
          const result = await tailorResume(resumeData, job.title, job.company, lang);
          
          if (result && result.summary) {
              const newSkills: Skill[] = Array.isArray(result.skills) 
                ? result.skills.map((s: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    name: typeof s === 'string' ? s : s.name, 
                    level: (typeof s === 'object' && s.level) ? s.level as any : 'Intermediate'
                  }))
                : [];

              // Merge logic: Replace summary, Append new skills if not exist
              const existingSkillNames = new Set(resumeData.skills.map(s => s.name.toLowerCase()));
              const filteredNewSkills = newSkills.filter(s => !existingSkillNames.has(s.name.toLowerCase()));

              onUpdateData({
                  ...resumeData,
                  personalInfo: {
                      ...resumeData.personalInfo,
                      summary: result.summary,
                      jobTitle: job.title // Also align job title
                  },
                  skills: [...resumeData.skills, ...filteredNewSkills]
              });
              setTailorSuccess(job.id);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsTailoring(null);
      }
  };

  const handleUndoTailor = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (backupData) {
          onUpdateData(backupData);
          setTailorSuccess(null);
          setBackupData(null);
          // Optional: Show "Undone" toast logic here if needed
      }
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
        <p className="text-slate-400 text-sm md:text-base max-w-md animate-pulse">Searching the web for REAL open roles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans relative">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Back to Resume
            </button>
            <button onClick={handleRefresh} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                <RotateCcw size={16}/> Refresh Matches
            </button>
        </div>

        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide border border-green-200 flex items-center gap-1"><ExternalLink size={12}/> Live Google Search</span>
            </div>
            <p className="text-slate-600 max-w-2xl">{t.subtitle}</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-3">{t.search.label}</label>
            <form onSubmit={handleManualSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                    <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="text" placeholder={t.search.keywords} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="md:w-1/3 relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="text" placeholder={t.search.location} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
                </div>
                <button type="submit" disabled={isSearching} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-70">
                    {isSearching ? <Loader2 className="animate-spin" size={18}/> : <Search size={18}/>}
                    {t.search.btn}
                </button>
            </form>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200 animate-in fade-in">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400"><Frown size={32} /></div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">No active jobs found</h3>
             <p className="text-slate-500 max-w-md mx-auto mb-6">Try adjusting your search keywords or location.</p>
             <button onClick={handleRefresh} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">Run AI Search Again</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-8 duration-500">
            {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
                    <div className="p-6 flex flex-col md:flex-row gap-6">
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
                        <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <a href={job.url} target="_blank" rel="noreferrer" className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2 hover:underline">
                                        {job.title} 
                                        {job.url && <ExternalLink size={16} className="text-blue-500"/>}
                                    </a>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-sm mt-2">
                                        <span className="flex items-center gap-1.5"><Building2 size={16} className="text-slate-400" /> {job.company}</span>
                                        <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job.location}</span>
                                        {job.salaryRange && <span className="flex items-center gap-1.5 text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100"><Euro size={14} /> {job.salaryRange}</span>}
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
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                                <button 
                                    onClick={() => handleInterviewPrep(job)}
                                    disabled={isPrepping === job.id}
                                    className="text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg border border-violet-200 flex items-center gap-1.5 transition-colors"
                                >
                                    {isPrepping === job.id ? <Loader2 size={12} className="animate-spin"/> : <MessageSquare size={12}/>}
                                    {t.prep}
                                </button>
                                
                                {tailorSuccess === job.id ? (
                                    <div className="flex items-center gap-1 bg-green-100 border border-green-200 rounded-lg p-0.5 overflow-hidden animate-in fade-in zoom-in duration-300">
                                        <span className="text-xs font-bold text-green-700 px-2 flex items-center gap-1">
                                            <CheckCircle size={12}/> {t.tailorSuccess}
                                        </span>
                                        <button 
                                            onClick={handleUndoTailor}
                                            className="bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors border-l border-green-200"
                                            title="Undo Changes"
                                        >
                                            <Undo2 size={12}/>
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleTailorCv(job)}
                                        disabled={isTailoring === job.id}
                                        className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 flex items-center gap-1.5 transition-all"
                                    >
                                        {isTailoring === job.id 
                                            ? <><Loader2 size={12} className="animate-spin"/> {t.tailoring}</>
                                            : <><Zap size={12} className={isTailoring === job.id ? '' : 'fill-orange-500'}/> {t.tailor}</>
                                        }
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center min-w-[200px] pt-4 md:pt-0 md:border-l border-slate-100 md:pl-6">
                             {job.applied ? (
                                <div className="w-full bg-green-50 text-green-700 border border-green-200 py-3 rounded-lg font-bold flex items-center justify-center gap-2 cursor-default animate-in zoom-in duration-300"><CheckCircle size={20} /> {t.applied}</div>
                             ) : (
                                <button 
                                    onClick={() => handleStartApply(job)} 
                                    disabled={!!applyingTo || !!isGenerating} 
                                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                                        applyingTo === job.id || isGenerating === job.id 
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                        : job.url 
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 transform hover:scale-[1.02]' 
                                            : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700'
                                    }`}
                                >
                                    {applyingTo === job.id 
                                        ? <><Loader2 className="animate-spin" size={18} /> Sending...</> 
                                        : isGenerating === job.id 
                                            ? <><Loader2 className="animate-spin" size={18} /> Writing...</> 
                                            : job.url 
                                                ? <><Globe size={18} /> Apply on Site</> 
                                                : <><Send size={18} /> {t.apply}</>
                                    }
                                </button>
                             )}
                             {job.url && !job.applied && <div className="text-xs text-center text-slate-400 mt-2 font-medium flex items-center justify-center gap-1"><ExternalLink size={10}/> Direct Link</div>}
                        </div>
                    </div>
                </div>
            ))}
          </div>
        )}

        {/* --- MODAL: EDIT COVER LETTER --- */}
        {editingJob && !editingJob.url && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setEditingJob(null)}></div>
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in duration-200 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                         <h3 className="font-bold text-slate-800 flex items-center gap-2"><Edit3 size={18} className="text-blue-600"/> {t.review}</h3>
                         <button onClick={() => setEditingJob(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    </div>
                    <div className="p-6 flex-grow">
                         <div className="mb-2"><p className="text-sm font-bold text-slate-900">{editingJob.title} @ {editingJob.company}</p><p className="text-xs text-slate-500">To: {editingJob.hrEmail}</p></div>
                         <label className="block text-xs font-bold uppercase text-slate-400 mb-2">{t.edit_label}</label>
                         <textarea className="w-full h-64 p-4 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50" value={letterDraft} onChange={(e) => setLetterDraft(e.target.value)} />
                    </div>
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between gap-3">
                         <button onClick={handleSaveToResume} className="px-4 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
                            <Save size={16} /> Save to Resume & PDF
                         </button>
                         <div className="flex gap-2">
                             <button onClick={() => setEditingJob(null)} className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm">{t.cancel}</button>
                             <button onClick={handleSendApplication} className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-sm shadow-lg flex items-center gap-2"><Send size={16} /> {t.send}</button>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- MODAL: INTERVIEW PREP WITH INTERACTIVE AI COACHING --- */}
        {prepData && (
             <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                 <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setPrepData(null)}></div>
                 <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">
                     <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white flex justify-between items-start shrink-0">
                         <div>
                             <h3 className="text-2xl font-bold flex items-center gap-2"><GraduationCap size={24}/> {t.interview.title}</h3>
                             <p className="text-violet-200 text-sm mt-1">{prepJobTitle}</p>
                         </div>
                         <button onClick={() => setPrepData(null)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20}/></button>
                     </div>
                     <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50">
                         {prepData.map((item, idx) => (
                             <div key={idx} className="mb-8 last:mb-0 border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                                 {/* Question Header */}
                                 <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                    <h4 className="font-bold text-lg text-slate-800 flex gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                                        {item.question}
                                    </h4>
                                 </div>
                                 
                                 {/* Static Hints */}
                                 <div className="p-5 space-y-4">
                                    <div className="flex gap-3">
                                        <div className="mt-0.5"><Search size={16} className="text-slate-400" /></div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.interview.why}</span>
                                            <p className="text-slate-600 text-sm leading-relaxed">{item.whyItIsAsked}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="mt-0.5"><Lightbulb size={16} className="text-yellow-500" /></div>
                                        <div>
                                            <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">{t.interview.tip}</span>
                                            <p className="text-slate-800 font-medium text-sm leading-relaxed bg-yellow-50 p-3 rounded-xl border border-yellow-100 mt-1">{item.answerTip}</p>
                                        </div>
                                    </div>

                                    {/* INTERACTIVE PRACTICE AREA */}
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <label className="block text-xs font-bold text-violet-600 uppercase mb-2 flex items-center gap-1">
                                            <BrainCircuit size={14}/> Practice your answer
                                        </label>
                                        <div className="relative">
                                            <textarea 
                                                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none bg-slate-50 focus:bg-white transition-all placeholder:text-slate-300"
                                                rows={3}
                                                placeholder="Type your answer here to get AI feedback..."
                                                value={userAnswers[idx] || ''}
                                                onChange={(e) => setUserAnswers(prev => ({...prev, [idx]: e.target.value}))}
                                            />
                                            <button 
                                                onClick={() => handleAnalyzeAnswer(idx, item.question)}
                                                disabled={!userAnswers[idx] || analyzingIndex === idx}
                                                className="absolute bottom-2 right-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                            >
                                                {analyzingIndex === idx ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                                                Analyze
                                            </button>
                                        </div>

                                        {/* AI Feedback Display */}
                                        {aiFeedback[idx] && (
                                            <div className="mt-3 bg-violet-50 border border-violet-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-white p-1.5 rounded-full shadow-sm"><Wand2 size={14} className="text-violet-600"/></div>
                                                    <div>
                                                        <h5 className="text-xs font-bold text-violet-800 mb-1">AI Coach Feedback</h5>
                                                        <p className="text-sm text-slate-700 leading-relaxed">{aiFeedback[idx]}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                     <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
                         <button onClick={() => setPrepData(null)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">{t.interview.close}</button>
                     </div>
                 </div>
             </div>
        )}

      </div>
    </div>
  );
};
