
import React, { useState, useEffect } from 'react';
import { ResumeData, Experience, Education, Skill, Language, Course, Interest, Reference, LangCode } from '../types';
import { Plus, Trash2, Wand2, Loader2, ChevronRight, ChevronLeft, User, Briefcase, GraduationCap, Wrench, Globe, Award, Heart, Users, LayoutGrid, MailOpen, Crown, Upload, X, Check, Layers, ArrowLeft } from 'lucide-react';
import { generateSummary, enhanceExperience, suggestSkills, generateCoverLetter } from '../services/geminiService';
import { content } from '../locales';

interface ResumeBuilderProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onNext: () => void;
  onBack: () => void;
  lang: LangCode;
  isPaid: boolean;
}

type Section = 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'courses' | 'interests' | 'references' | 'coverLetter';

// --- FUTURISTIC / GLASSMORPHISM STYLES ---
const GLASS_CONTAINER = "bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl shadow-blue-500/5 rounded-2xl p-6 md:p-8 animate-in fade-in duration-500";
const INPUT_CLASS = "w-full bg-slate-50/50 border-b-2 border-slate-200 focus:border-blue-500 px-3 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400 hover:bg-slate-50 rounded-t-md";
const LABEL_CLASS = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1";
const CARD_CLASS = "bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative group mb-4";
const BTN_NEON = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95";
const BTN_AI = "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20";
const BTN_ADD = "bg-slate-100 hover:bg-slate-200 text-slate-700";

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ data, onChange, onNext, onBack, lang, isPaid }) => {
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  
  // Skill Selector State
  const [showSkillSelector, setShowSkillSelector] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  const t = content[lang].builder;

  // --- ATS Score Calculation ---
  useEffect(() => {
    let s = 10; // Base score
    if (data.personalInfo.photoUrl) s += 10;
    if (data.personalInfo.summary.length > 20) s += 15;
    if (data.experience.length > 0) s += 20;
    if (data.education.length > 0) s += 15;
    if (data.skills.length >= 3) s += 15;
    if (data.languages.length > 0) s += 10;
    if (data.coverLetter.body.length > 50) s += 5;
    setScore(Math.min(100, s));
  }, [data]);

  // --- Generic Update Helpers ---
  const updatePersonal = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const updateCoverLetter = (field: keyof ResumeData['coverLetter'], value: string) => {
    onChange({ ...data, coverLetter: { ...data.coverLetter, [field]: value } });
  };

  const addItem = <T extends { id: string }>(field: keyof ResumeData, newItem: T) => {
    onChange({ ...data, [field]: [newItem, ...(data[field] as any[])] });
  };

  const updateItem = (listField: keyof ResumeData, id: string, itemField: string, value: any) => {
    onChange({
      ...data,
      [listField]: (data[listField] as any[]).map((item: any) => item.id === id ? { ...item, [itemField]: value } : item)
    });
  };

  const removeItem = (listField: keyof ResumeData, id: string) => {
    onChange({
      ...data,
      [listField]: (data[listField] as any[]).filter((item: any) => item.id !== id)
    });
  };

  // --- Photo Upload Handler ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // UPDATED: Limit increased to 25MB
        if (file.size > 25 * 1024 * 1024) { 
            alert("File too large. Please upload an image smaller than 25MB.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            updatePersonal('photoUrl', reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  // --- AI Handlers ---
  const handleAiSummary = async () => {
    if (!data.personalInfo.jobTitle) return alert("Please enter a Job Title first.");
    setLoadingAI('summary');
    const expStr = data.experience.map(e => `${e.title} at ${e.company}`).join(", ");
    const summary = await generateSummary(data.personalInfo.jobTitle, expStr, lang);
    updatePersonal('summary', summary);
    setLoadingAI(null);
  };

  const handleAiExperience = async (expId: string, title: string, desc: string) => {
    if (!title) return alert("Please enter a Job Title first.");
    setLoadingAI(expId);
    const enhanced = await enhanceExperience(title, desc, lang);
    updateItem('experience', expId, 'description', enhanced);
    setLoadingAI(null);
  };

  const handleAiSkills = async () => {
     if (!data.personalInfo.jobTitle) return alert("Please enter a Job Title first.");
     setLoadingAI('skills');
     
     const suggestions = await suggestSkills(data.personalInfo.jobTitle, lang);
     
     // Filter out skills that are already in the resume to avoid duplicates
     const existingSkills = new Set(data.skills.map(s => s.name.toLowerCase()));
     const freshSuggestions = suggestions.filter(name => !existingSkills.has(name.toLowerCase()));
     
     if (freshSuggestions.length === 0) {
         alert("No new skills found based on your job title.");
         setLoadingAI(null);
         return;
     }

     setSuggestedSkills(freshSuggestions);
     setSelectedSuggestions(new Set(freshSuggestions)); // Select all by default
     setShowSkillSelector(true);
     setLoadingAI(null);
  };
  
  const toggleSuggestion = (skill: string) => {
      const newSet = new Set(selectedSuggestions);
      if (newSet.has(skill)) {
          newSet.delete(skill);
      } else {
          newSet.add(skill);
      }
      setSelectedSuggestions(newSet);
  };

  const confirmAiSkills = () => {
      const newSkills: Skill[] = Array.from(selectedSuggestions).map((name: string) => ({
         id: Math.random().toString(36).substr(2, 9),
         name,
         level: 'Intermediate'
      }));
      
      onChange({ ...data, skills: [...data.skills, ...newSkills] });
      setShowSkillSelector(false);
      setSuggestedSkills([]);
  };

  const handleAiCoverLetter = async () => {
    if (!data.personalInfo.jobTitle) return alert("Please enter a Job Title in Personal Details.");
    setLoadingAI('coverLetter');
    const letter = await generateCoverLetter(data, lang);
    updateCoverLetter('body', letter);
    setLoadingAI(null);
  };

  // --- Navigation Config ---
  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'personal', label: t.nav.personal, icon: <User size={18} /> },
    { id: 'experience', label: t.nav.experience, icon: <Briefcase size={18} /> },
    { id: 'education', label: t.nav.education, icon: <GraduationCap size={18} /> },
    { id: 'skills', label: t.nav.skills, icon: <Wrench size={18} /> },
    { id: 'languages', label: t.nav.languages, icon: <Globe size={18} /> },
    { id: 'courses', label: t.nav.courses, icon: <Award size={18} /> },
    { id: 'interests', label: t.nav.interests, icon: <Heart size={18} /> },
    { id: 'references', label: t.nav.references, icon: <Users size={18} /> },
    { id: 'coverLetter', label: t.nav.coverLetter, icon: <MailOpen size={18} /> },
  ];

  // --- Render Methods ---
  const renderPersonal = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <User size={24} />
          </div>
          <div>
              <h2 className="text-2xl font-bold text-slate-800">{t.personal.title}</h2>
              <p className="text-slate-500 text-sm">Start with your basic information.</p>
          </div>
      </div>
      
      {/* Photo Upload Real */}
      <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-100">
        <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden text-slate-300 shadow-lg border-4 border-white flex-shrink-0">
            {data.personalInfo.photoUrl ? (
                <img src={data.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <User size={40} />
            )}
             {/* Remove Button if photo exists */}
             {data.personalInfo.photoUrl && (
                <button 
                  onClick={() => updatePersonal('photoUrl', '')}
                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                >
                   <Trash2 size={20} />
                </button>
             )}
        </div>
        <div className="flex-grow">
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.personal.photoLabel}</label>
            <div className="flex gap-2 items-center">
                <label className="cursor-pointer bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95">
                    <Upload size={16} /> 
                    Upload Image
                    <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        aria-label="Upload profile photo"
                    />
                </label>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">{t.personal.photoHelp}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="group">
          <label className={LABEL_CLASS}>{t.personal.jobTitle}</label>
          <input type="text" className={INPUT_CLASS} placeholder="e.g. Sales Manager" value={data.personalInfo.jobTitle} onChange={(e) => updatePersonal('jobTitle', e.target.value)} />
        </div>
        <div className="group">
          <label className={LABEL_CLASS}>{t.personal.fullName}</label>
          <input type="text" className={INPUT_CLASS} placeholder="e.g. Jan de Vries" value={data.personalInfo.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} />
        </div>
        <div className="group">
          <label className={LABEL_CLASS}>{t.personal.email}</label>
          <input type="email" className={INPUT_CLASS} placeholder="jan@example.com" value={data.personalInfo.email} onChange={(e) => updatePersonal('email', e.target.value)} />
        </div>
        <div className="group">
          <label className={LABEL_CLASS}>{t.personal.phone}</label>
          <input type="tel" className={INPUT_CLASS} placeholder="+31 6 12345678" value={data.personalInfo.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
        </div>
        <div className="group">
          <label className={LABEL_CLASS}>{t.personal.location}</label>
          <input type="text" className={INPUT_CLASS} placeholder="Rotterdam, Netherlands" value={data.personalInfo.location} onChange={(e) => updatePersonal('location', e.target.value)} />
        </div>
        <div className="group">
          <label className={LABEL_CLASS}>{t.personal.dob}</label>
          <input type="date" className={INPUT_CLASS} value={data.personalInfo.dateOfBirth} onChange={(e) => updatePersonal('dateOfBirth', e.target.value)} />
        </div>
        <div className="group">
          <label className={LABEL_CLASS}>{t.personal.nationality}</label>
          <input type="text" className={INPUT_CLASS} placeholder="Dutch" value={data.personalInfo.nationality} onChange={(e) => updatePersonal('nationality', e.target.value)} />
        </div>
         <div className="group">
          <label className={LABEL_CLASS}>{t.personal.license}</label>
          <input type="text" className={INPUT_CLASS} placeholder="B" value={data.personalInfo.drivingLicense} onChange={(e) => updatePersonal('drivingLicense', e.target.value)} />
        </div>
        <div className="md:col-span-2 group">
          <label className={LABEL_CLASS}>{t.personal.linkedin}</label>
          <input type="text" className={INPUT_CLASS} placeholder="linkedin.com/in/jan" value={data.personalInfo.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} />
        </div>
      </div>
      
      <div className="relative pt-4">
        <div className="flex justify-between items-end mb-2">
            <label className={LABEL_CLASS}>{t.personal.summary}</label>
            <button 
                onClick={handleAiSummary} 
                disabled={loadingAI === 'summary'} 
                className={`${BTN_NEON} ${BTN_AI} text-xs px-3 py-1.5`}
            >
                {loadingAI === 'summary' ? <Loader2 className="animate-spin" size={12}/> : <Wand2 size={12} />} {t.personal.aiWrite}
            </button>
        </div>
        <textarea 
          className={`${INPUT_CLASS} h-32 resize-none rounded-b-md`}
          placeholder="Briefly describe your career highlights..." 
          value={data.personalInfo.summary} 
          onChange={(e) => updatePersonal('summary', e.target.value)} 
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Briefcase size={24} /></div>
                <div><h2 className="text-2xl font-bold text-slate-800">{t.experience.title}</h2></div>
            </div>
            <button onClick={() => addItem('experience', { id: Math.random().toString(36).substr(2, 9), title: '', company: '', startDate: '', endDate: '', current: false, description: '' })} className={`${BTN_NEON} ${BTN_ADD}`}>
                <Plus size={16} /> {t.experience.add}
            </button>
        </div>
        {data.experience.map((exp) => (
            <div key={exp.id} className={CARD_CLASS}>
                <button onClick={() => removeItem('experience', exp.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow-sm" aria-label="Remove experience"><Trash2 size={16} /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className={LABEL_CLASS}>{t.experience.jobTitle}</label>
                        <input type="text" className={INPUT_CLASS} value={exp.title} onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)} />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>{t.experience.company}</label>
                        <input type="text" className={INPUT_CLASS} value={exp.company} onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>{t.experience.startDate}</label>
                        <input type="date" className={INPUT_CLASS} value={exp.startDate} onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)} />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>{t.experience.endDate}</label>
                        <div className="flex gap-2 items-center">
                            <input type="date" className={`${INPUT_CLASS} disabled:opacity-50`} value={exp.endDate} onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)} disabled={exp.current} />
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer whitespace-nowrap bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors select-none">
                                <input type="checkbox" checked={exp.current} onChange={(e) => updateItem('experience', exp.id, 'current', e.target.checked)} className="accent-blue-600" /> {t.experience.current}
                            </label>
                        </div>
                    </div>
                </div>
                <div className="relative mt-4">
                    <div className="flex justify-between items-end mb-2">
                        <label className={LABEL_CLASS}>{t.experience.responsibilities}</label>
                        <button 
                            onClick={() => handleAiExperience(exp.id, exp.title, exp.description)} 
                            disabled={loadingAI === exp.id} 
                            className={`${BTN_NEON} ${BTN_AI} text-xs px-3 py-1.5`}
                        >
                            {loadingAI === exp.id ? <Loader2 className="animate-spin" size={12}/> : <Wand2 size={12} />} 
                            {exp.description ? t.experience.aiEnhance : t.experience.aiWrite}
                        </button>
                    </div>
                    <textarea 
                      className={`${INPUT_CLASS} h-32 rounded-b-md`}
                      value={exp.description} 
                      onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)} 
                      placeholder="List your key responsibilities and achievements..."
                    />
                </div>
            </div>
        ))}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><GraduationCap size={24} /></div>
                <div><h2 className="text-2xl font-bold text-slate-800">{t.education.title}</h2></div>
            </div>
            <button onClick={() => addItem('education', { id: Math.random().toString(36).substr(2, 9), school: '', degree: '', year: '' })} className={`${BTN_NEON} ${BTN_ADD}`}>
                <Plus size={16} /> {t.education.add}
            </button>
        </div>
        {data.education.map((edu) => (
             <div key={edu.id} className={`${CARD_CLASS} flex gap-4 items-start`}>
                 <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={LABEL_CLASS}>{t.education.school}</label>
                        <input type="text" className={INPUT_CLASS} value={edu.school} onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)} />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>{t.education.degree}</label>
                        <input type="text" className={INPUT_CLASS} value={edu.degree} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>{t.education.year}</label>
                        <input type="text" className={INPUT_CLASS} value={edu.year} onChange={(e) => updateItem('education', edu.id, 'year', e.target.value)} />
                    </div>
                 </div>
                 <button onClick={() => removeItem('education', edu.id)} className="text-slate-300 hover:text-red-500 mt-6" aria-label="Remove education"><Trash2 size={18} /></button>
             </div>
        ))}
    </div>
  );

  const renderSkills = () => (
     <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Wrench size={24} /></div>
                <div><h2 className="text-2xl font-bold text-slate-800">{t.skills.title}</h2></div>
            </div>
            <div className="flex gap-2">
                <button onClick={handleAiSkills} disabled={loadingAI === 'skills'} className={`${BTN_NEON} ${BTN_AI}`}>
                    {loadingAI === 'skills' ? <Loader2 className="animate-spin" size={14}/> : <Wand2 size={14} />} {t.skills.aiSuggest}
                </button>
                <button onClick={() => addItem('skills', { id: Math.random().toString(36).substr(2, 9), name: '', level: 'Intermediate' })} className={`${BTN_NEON} ${BTN_ADD}`}>
                    <Plus size={16} /> {t.skills.add}
                </button>
            </div>
        </div>

        {showSkillSelector && (
            <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-xl mb-6 animate-in zoom-in duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500"></div>
                <h3 className="font-bold text-lg mb-1">{t.skills.selectorTitle}</h3>
                <p className="text-slate-500 text-xs mb-4">{t.skills.selectorSubtitle}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    {suggestedSkills.map(skill => (
                        <button
                            key={skill}
                            onClick={() => toggleSuggestion(skill)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                selectedSuggestions.has(skill)
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-400'
                            }`}
                        >
                            {skill} {selectedSuggestions.has(skill) && <Check size={12} className="inline ml-1"/>}
                        </button>
                    ))}
                </div>
                
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowSkillSelector(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm">{t.skills.cancel}</button>
                    <button onClick={confirmAiSkills} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20">{t.skills.addSelected}</button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skills.map((skill) => (
                <div key={skill.id} className={`${CARD_CLASS} flex items-center gap-3 mb-0`}>
                    <input type="text" className="bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none flex-grow font-medium text-slate-700" value={skill.name} onChange={(e) => updateItem('skills', skill.id, 'name', e.target.value)} />
                    <select 
                        className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-1 px-2 outline-none text-slate-500 font-bold"
                        value={skill.level}
                        onChange={(e) => updateItem('skills', skill.id, 'level', e.target.value)}
                    >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Expert</option>
                        <option>Master</option>
                    </select>
                    <button onClick={() => removeItem('skills', skill.id)} className="text-slate-300 hover:text-red-500" aria-label="Remove skill"><Trash2 size={16} /></button>
                </div>
            ))}
        </div>
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-100 text-pink-600 rounded-xl"><Globe size={24} /></div>
                <div><h2 className="text-2xl font-bold text-slate-800">{t.languages.title}</h2></div>
            </div>
            <button onClick={() => addItem('languages', { id: Math.random().toString(36).substr(2, 9), language: '', proficiency: 'Native' })} className={`${BTN_NEON} ${BTN_ADD}`}>
                <Plus size={16} /> {t.languages.add}
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.languages.map((langItem) => (
                <div key={langItem.id} className={`${CARD_CLASS} flex items-center gap-3 mb-0`}>
                    <input type="text" className="bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none flex-grow font-medium text-slate-700" value={langItem.language} onChange={(e) => updateItem('languages', langItem.id, 'language', e.target.value)} placeholder="e.g. English" />
                    <select 
                        className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-1 px-2 outline-none text-slate-500 font-bold"
                        value={langItem.proficiency}
                        onChange={(e) => updateItem('languages', langItem.id, 'proficiency', e.target.value)}
                    >
                        <option>Native</option>
                        <option>Fluent</option>
                        <option>Good</option>
                        <option>Basic</option>
                    </select>
                    <button onClick={() => removeItem('languages', langItem.id)} className="text-slate-300 hover:text-red-500" aria-label="Remove language"><Trash2 size={16} /></button>
                </div>
            ))}
        </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl"><Award size={24} /></div>
                <div><h2 className="text-2xl font-bold text-slate-800">{t.courses.title}</h2></div>
            </div>
            <button onClick={() => addItem('courses', { id: Math.random().toString(36).substr(2, 9), name: '', institution: '', year: '' })} className={`${BTN_NEON} ${BTN_ADD}`}>
                <Plus size={16} /> {t.courses.add}
            </button>
        </div>
        {data.courses.map((course) => (
             <div key={course.id} className={CARD_CLASS}>
                 <button onClick={() => removeItem('courses', course.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500" aria-label="Remove course"><Trash2 size={16} /></button>
                 <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className={LABEL_CLASS}>{t.courses.courseName}</label>
                        <input type="text" className={INPUT_CLASS} value={course.name} onChange={(e) => updateItem('courses', course.id, 'name', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL_CLASS}>{t.courses.institution}</label>
                            <input type="text" className={INPUT_CLASS} value={course.institution} onChange={(e) => updateItem('courses', course.id, 'institution', e.target.value)} />
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>{t.courses.year}</label>
                            <input type="text" className={INPUT_CLASS} value={course.year} onChange={(e) => updateItem('courses', course.id, 'year', e.target.value)} />
                        </div>
                    </div>
                 </div>
             </div>
        ))}
    </div>
  );

  const renderInterests = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl"><Heart size={24} /></div>
                <div><h2 className="text-2xl font-bold text-slate-800">{t.interests.title}</h2></div>
            </div>
            <button onClick={() => addItem('interests', { id: Math.random().toString(36).substr(2, 9), name: '' })} className={`${BTN_NEON} ${BTN_ADD}`}>
                <Plus size={16} /> {t.interests.add}
            </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.interests.map((interest) => (
                <div key={interest.id} className={`${CARD_CLASS} flex items-center gap-2 mb-0`}>
                    <input type="text" className="bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none flex-grow font-medium text-slate-700" value={interest.name} onChange={(e) => updateItem('interests', interest.id, 'name', e.target.value)} placeholder="e.g. Photography" />
                    <button onClick={() => removeItem('interests', interest.id)} className="text-slate-300 hover:text-red-500" aria-label="Remove interest"><Trash2 size={16} /></button>
                </div>
            ))}
        </div>
    </div>
  );

  const renderReferences = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl"><Users size={24} /></div>
                <div><h2 className="text-2xl font-bold text-slate-800">{t.references.title}</h2></div>
            </div>
            <button onClick={() => addItem('references', { id: Math.random().toString(36).substr(2, 9), name: '', company: '', phone: '', email: '' })} className={`${BTN_NEON} ${BTN_ADD}`}>
                <Plus size={16} /> {t.references.add}
            </button>
        </div>
        
        {data.references.length === 0 && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-sm italic text-center">
                {t.references.empty}
            </div>
        )}

        {data.references.map((ref) => (
             <div key={ref.id} className={CARD_CLASS}>
                 <button onClick={() => removeItem('references', ref.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500" aria-label="Remove reference"><Trash2 size={16} /></button>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={LABEL_CLASS}>{t.references.name}</label>
                        <input type="text" className={INPUT_CLASS} value={ref.name} onChange={(e) => updateItem('references', ref.id, 'name', e.target.value)} />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>{t.references.company}</label>
                        <input type="text" className={INPUT_CLASS} value={ref.company} onChange={(e) => updateItem('references', ref.id, 'company', e.target.value)} />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>{t.references.phone}</label>
                        <input type="text" className={INPUT_CLASS} value={ref.phone} onChange={(e) => updateItem('references', ref.id, 'phone', e.target.value)} />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>{t.references.email}</label>
                        <input type="text" className={INPUT_CLASS} value={ref.email} onChange={(e) => updateItem('references', ref.id, 'email', e.target.value)} />
                    </div>
                 </div>
             </div>
        ))}
    </div>
  );

  const renderCoverLetter = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-xl"><MailOpen size={24} /></div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{t.coverLetter.title}</h2>
                <p className="text-slate-500 text-sm">Create a tailored letter for your application.</p>
            </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-100 shadow-sm mb-6">
            <h3 className="font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">{t.coverLetter.recipientDetails}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={LABEL_CLASS}>{t.coverLetter.name}</label>
                    <input type="text" className={INPUT_CLASS} value={data.coverLetter.recipientName} onChange={(e) => updateCoverLetter('recipientName', e.target.value)} placeholder="e.g. Mr. Smith" />
                </div>
                <div>
                    <label className={LABEL_CLASS}>{t.coverLetter.role}</label>
                    <input type="text" className={INPUT_CLASS} value={data.coverLetter.recipientTitle} onChange={(e) => updateCoverLetter('recipientTitle', e.target.value)} placeholder="e.g. Hiring Manager" />
                </div>
                <div>
                    <label className={LABEL_CLASS}>{t.coverLetter.company}</label>
                    <input type="text" className={INPUT_CLASS} value={data.coverLetter.companyName} onChange={(e) => updateCoverLetter('companyName', e.target.value)} placeholder="Target Company B.V." />
                </div>
                <div>
                    <label className={LABEL_CLASS}>{t.coverLetter.address}</label>
                    <input type="text" className={INPUT_CLASS} value={data.coverLetter.companyAddress} onChange={(e) => updateCoverLetter('companyAddress', e.target.value)} placeholder="Amsterdam" />
                </div>
            </div>
        </div>

        <div className="relative">
            <div className="flex justify-between items-end mb-2">
                <label className={LABEL_CLASS}>{t.coverLetter.body}</label>
                <button 
                    onClick={handleAiCoverLetter} 
                    disabled={loadingAI === 'coverLetter'} 
                    className={`${BTN_NEON} ${BTN_AI} text-xs px-4 py-2`}
                >
                    {loadingAI === 'coverLetter' ? <Loader2 className="animate-spin" size={14}/> : <Wand2 size={14} />} {t.coverLetter.aiWrite}
                </button>
            </div>
            <textarea 
                className={`${INPUT_CLASS} h-64 rounded-b-md p-4 leading-relaxed`}
                value={data.coverLetter.body} 
                onChange={(e) => updateCoverLetter('body', e.target.value)} 
                placeholder="Content will be generated here..."
            />
        </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto items-start font-sans pt-6">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-full lg:w-72 flex-shrink-0 space-y-4 relative lg:sticky lg:top-24 z-0">
         <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-4 ml-2 transition-colors">
             <ArrowLeft size={18} /> Back
         </button>

         {/* Score Widget */}
         <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl shadow-slate-900/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <div className="relative z-10">
                 <div className="flex justify-between items-end mb-2">
                     <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.score.title}</span>
                     <span className={`text-2xl font-black ${score === 100 ? 'text-green-400' : 'text-blue-400'}`}>{score}%</span>
                 </div>
                 <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                     <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${score}%` }}>
                        <div className="absolute right-0 top-0 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                     </div>
                 </div>
                 {score < 100 ? (
                     <div className="text-xs text-slate-300">
                         <span className="font-bold text-yellow-400">{t.score.improve}</span>
                         {!data.personalInfo.photoUrl && <div className="mt-1 flex items-center gap-1"><Plus size={10}/> {t.score.tip_photo}</div>}
                         {!data.personalInfo.summary && <div className="mt-1 flex items-center gap-1"><Plus size={10}/> {t.score.tip_summary}</div>}
                         {data.experience.length === 0 && <div className="mt-1 flex items-center gap-1"><Plus size={10}/> {t.score.tip_exp}</div>}
                         {data.skills.length < 3 && <div className="mt-1 flex items-center gap-1"><Plus size={10}/> {t.score.tip_skills}</div>}
                     </div>
                 ) : (
                     <div className="text-xs font-bold text-green-400 flex items-center gap-1">
                         <Crown size={12} /> {t.score.perfect}
                     </div>
                 )}
             </div>
         </div>

         {/* Navigation Items */}
         <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
             {sections.map((section) => (
                 <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold transition-all relative
                        ${activeSection === section.id 
                            ? 'text-blue-600 bg-blue-50/80' 
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                 >
                    {activeSection === section.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>}
                    <div className={`${activeSection === section.id ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
                        {section.icon}
                    </div>
                    {section.label}
                    {/* Completion indicators */}
                    {section.id === 'personal' && data.personalInfo.fullName && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400"></div>}
                    {section.id === 'experience' && data.experience.length > 0 && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400"></div>}
                 </button>
             ))}
         </div>
         
         <div className="pt-4">
             <button 
                onClick={onNext}
                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-600 hover:to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
             >
                 {t.nav.preview} <ChevronRight size={18} />
             </button>
         </div>
      </div>

      {/* MAIN EDITOR AREA */}
      <div className="flex-grow w-full">
          <div className={GLASS_CONTAINER}>
              {activeSection === 'personal' && renderPersonal()}
              {activeSection === 'experience' && renderExperience()}
              {activeSection === 'education' && renderEducation()}
              {activeSection === 'skills' && renderSkills()}
              {activeSection === 'languages' && renderLanguages()}
              {activeSection === 'courses' && renderCourses()}
              {activeSection === 'interests' && renderInterests()}
              {activeSection === 'references' && renderReferences()}
              {activeSection === 'coverLetter' && renderCoverLetter()}
          </div>
          
          <div className="flex justify-between mt-6 px-2">
                <button 
                    onClick={() => {
                        const idx = sections.findIndex(s => s.id === activeSection);
                        if (idx > 0) setActiveSection(sections[idx-1].id);
                    }}
                    disabled={activeSection === sections[0].id}
                    className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                    <ChevronLeft size={20} /> {t.actions.prev}
                </button>

                <button 
                    onClick={() => {
                        const idx = sections.findIndex(s => s.id === activeSection);
                        if (idx < sections.length - 1) setActiveSection(sections[idx+1].id);
                        else onNext();
                    }}
                    className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
                >
                    {activeSection === sections[sections.length-1].id ? t.nav.finish : t.actions.next} <ChevronRight size={20} />
                </button>
          </div>
      </div>

    </div>
  );
};