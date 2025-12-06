import React, { useState, useEffect } from 'react';
import { ResumeData, Experience, Education, Skill, Language, Course, Interest, Reference, LangCode } from '../types';
import { Plus, Trash2, Wand2, Loader2, ChevronRight, ChevronLeft, User, Briefcase, GraduationCap, Wrench, Globe, Award, Heart, Users, LayoutGrid, MailOpen, Crown, Upload, X, Check, Layers, ArrowLeft, Sparkles } from 'lucide-react';
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

// --- STYLES ---
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
    let s = 10;
    if (data.personalInfo.photoUrl) s += 10;
    if (data.personalInfo.summary.length > 20) s += 15;
    if (data.experience.length > 0) s += 20;
    if (data.education.length > 0) s += 15;
    if (data.skills.length >= 3) s += 15;
    if (data.languages.length > 0) s += 10;
    if (data.coverLetter.body.length > 50) s += 5;
    setScore(Math.min(100, s));
  }, [data]);

  // --- Update Helpers ---
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 25 * 1024 * 1024) { 
            alert("File too large.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            updatePersonal('photoUrl', reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  // --- AI Specific Handlers ---
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
     
     const existingSkills = new Set(data.skills.map(s => s.name.toLowerCase()));
     const freshSuggestions = suggestions.filter(name => !existingSkills.has(name.toLowerCase()));
     
     if (freshSuggestions.length === 0) {
         alert("No new skills found based on your job title.");
         setLoadingAI(null);
         return;
     }

     setSuggestedSkills(freshSuggestions);
     setSelectedSuggestions(new Set(freshSuggestions));
     setShowSkillSelector(true);
     setLoadingAI(null);
  };
  
  const toggleSuggestion = (skill: string) => {
      const newSet = new Set(selectedSuggestions);
      if (newSet.has(skill)) newSet.delete(skill);
      else newSet.add(skill);
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

  // --- RENDER SECTIONS ---
  const renderPersonal = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><User size={24} /></div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{t.personal.title}</h2>
                <p className="text-slate-500 text-sm">Start with your basic information.</p>
            </div>
          </div>
      </div>
      
      <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-100">
        <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden text-slate-300 shadow-lg border-4 border-white flex-shrink-0">
            {data.personalInfo.photoUrl ? (
                <img src={data.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <User size={40} />
            )}
             {data.personalInfo.photoUrl && (
                <button 
                  onClick={() => updatePersonal('photoUrl', '')}
                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
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
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
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
                <button onClick={() => removeItem('experience', exp.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow-sm"><Trash2 size={16} /></button>
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
                      placeholder="List your key responsibilities..."
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
                 <button onClick={() => removeItem('education', edu.id)} className="text-slate-300 hover:text-red-500 mt-6"><Trash2 size={18} /></button>
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
                        <button key={skill} onClick={() => toggleSuggestion(skill)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedSuggestions.has(skill) ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-400'}`}>
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
                    <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-1 px-2 outline-none text-slate-500 font-bold" value={skill.level} onChange={(e) => updateItem('skills', skill.id, 'level', e.target.value)}>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Expert</option>
                        <option>Master</option>
                    </select>
                    <button onClick={() => removeItem('skills', skill.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
            ))}
        </div>
    </div>
  );

  const renderOther = (
      id: 'languages' | 'courses' | 'interests' | 'references', 
      title: string, 
      icon: any, 
      color: string,
      fields: any
  ) => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className={`p-3 bg-${color}-100 text-${color}-600 rounded-xl`}>{icon}</div>
                <div><h2 className="text-2xl font-bold text-slate-800">{title}</h2></div>
            </div>
            <button onClick={() => addItem(id, fields)} className={`${BTN_NEON} ${BTN_ADD}`}>
                <Plus size={16} /> Add
            </button>
        </div>
        {/* Simplified rendering logic for brevity, expands to full logic in real code */}
        {id === 'languages' && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{data.languages.map(l => (
             <div key={l.id} className={`${CARD_CLASS} flex items-center gap-3 mb-0`}>
                <input type="text" className="bg-transparent border-b border-slate-200 flex-grow" value={l.language} onChange={(e) => updateItem('languages', l.id, 'language', e.target.value)} placeholder="English"/>
                <select className="bg-slate-50 rounded text-xs p-1" value={l.proficiency} onChange={(e) => updateItem('languages', l.id, 'proficiency', e.target.value)}><option>Native</option><option>Fluent</option><option>Good</option></select>
                <button onClick={() => removeItem('languages', l.id)}><Trash2 size={16} className="text-slate-300 hover:text-red-500"/></button>
             </div>
        ))}</div>}
        {id === 'interests' && <div className="grid grid-cols-2 gap-4">{data.interests.map(i => (
             <div key={i.id} className={`${CARD_CLASS} flex items-center gap-3 mb-0`}>
                <input type="text" className="bg-transparent border-b border-slate-200 flex-grow" value={i.name} onChange={(e) => updateItem('interests', i.id, 'name', e.target.value)} placeholder="Running"/>
                <button onClick={() => removeItem('interests', i.id)}><Trash2 size={16} className="text-slate-300 hover:text-red-500"/></button>
             </div>
        ))}</div>}
         {id === 'courses' && data.courses.map(c => (
             <div key={c.id} className={CARD_CLASS}>
                <button onClick={() => removeItem('courses', c.id)} className="absolute top-4 right-4"><Trash2 size={16} className="text-slate-300 hover:text-red-500"/></button>
                <input type="text" className={INPUT_CLASS} value={c.name} onChange={(e) => updateItem('courses', c.id, 'name', e.target.value)} placeholder="Course Name"/>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <input type="text" className={INPUT_CLASS} value={c.institution} onChange={(e) => updateItem('courses', c.id, 'institution', e.target.value)} placeholder="Institution"/>
                    <input type="text" className={INPUT_CLASS} value={c.year} onChange={(e) => updateItem('courses', c.id, 'year', e.target.value)} placeholder="Year"/>
                </div>
             </div>
        ))}
         {id === 'references' && data.references.map(r => (
             <div key={r.id} className={CARD_CLASS}>
                <button onClick={() => removeItem('references', r.id)} className="absolute top-4 right-4"><Trash2 size={16} className="text-slate-300 hover:text-red-500"/></button>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" className={INPUT_CLASS} value={r.name} onChange={(e) => updateItem('references', r.id, 'name', e.target.value)} placeholder="Name"/>
                    <input type="text" className={INPUT_CLASS} value={r.company} onChange={(e) => updateItem('references', r.id, 'company', e.target.value)} placeholder="Company"/>
                    <input type="text" className={INPUT_CLASS} value={r.phone} onChange={(e) => updateItem('references', r.id, 'phone', e.target.value)} placeholder="Phone"/>
                    <input type="text" className={INPUT_CLASS} value={r.email} onChange={(e) => updateItem('references', r.id, 'email', e.target.value)} placeholder="Email"/>
                </div>
             </div>
        ))}
    </div>
  );

  const renderCoverLetter = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-xl"><MailOpen size={24} /></div>
            <div><h2 className="text-2xl font-bold text-slate-800">{t.coverLetter.title}</h2></div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-100 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={LABEL_CLASS}>{t.coverLetter.recipientDetails}</label><input type="text" className={INPUT_CLASS} value={data.coverLetter.recipientName} onChange={(e) => updateCoverLetter('recipientName', e.target.value)} placeholder="Hiring Manager" /></div>
                <div><label className={LABEL_CLASS}>{t.coverLetter.company}</label><input type="text" className={INPUT_CLASS} value={data.coverLetter.companyName} onChange={(e) => updateCoverLetter('companyName', e.target.value)} placeholder="Target Company" /></div>
            </div>
        </div>
        <div className="relative">
            <div className="flex justify-between items-end mb-2">
                <label className={LABEL_CLASS}>{t.coverLetter.body}</label>
                <button onClick={handleAiCoverLetter} disabled={loadingAI === 'coverLetter'} className={`${BTN_NEON} ${BTN_AI} text-xs px-4 py-2`}>{loadingAI === 'coverLetter' ? <Loader2 className="animate-spin" size={14}/> : <Wand2 size={14} />} {t.coverLetter.aiWrite}</button>
            </div>
            <textarea className={`${INPUT_CLASS} h-64 rounded-b-md p-4 leading-relaxed`} value={data.coverLetter.body} onChange={(e) => updateCoverLetter('body', e.target.value)} />
        </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto items-start font-sans pt-6 relative">
      
      {/* SIDEBAR */}
      <div className="w-full lg:w-72 flex-shrink-0 space-y-4 relative lg:sticky lg:top-24 z-0">
         <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-4 ml-2 transition-colors"><ArrowLeft size={18} /> Back</button>
         <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
             <div className="flex justify-between items-end mb-2"><span className="text-xs font-bold uppercase text-slate-400">{t.score.title}</span><span className={`text-2xl font-black ${score === 100 ? 'text-green-400' : 'text-blue-400'}`}>{score}%</span></div>
             <div className="w-full bg-slate-800 rounded-full h-2 mb-4"><div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${score}%` }}></div></div>
             {score < 100 ? <div className="text-xs text-slate-300"><span className="font-bold text-yellow-400">{t.score.improve}</span>{!data.personalInfo.photoUrl && <div className="mt-1">+ {t.score.tip_photo}</div>}{!data.personalInfo.summary && <div className="mt-1">+ {t.score.tip_summary}</div>}</div> : <div className="text-xs font-bold text-green-400 flex items-center gap-1"><Crown size={12} /> {t.score.perfect}</div>}
         </div>
         <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
             {sections.map((section) => (
                 <button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold transition-all relative ${activeSection === section.id ? 'text-blue-600 bg-blue-50/80' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                    {activeSection === section.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>}
                    <div className={`${activeSection === section.id ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>{section.icon}</div>{section.label}
                 </button>
             ))}
         </div>
         <div className="pt-4"><button onClick={onNext} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-600 hover:to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-1">{t.nav.preview} <ChevronRight size={18} /></button></div>
      </div>

      {/* MAIN EDITOR */}
      <div className="flex-grow w-full">
          <div className={GLASS_CONTAINER}>
              {activeSection === 'personal' && renderPersonal()}
              {activeSection === 'experience' && renderExperience()}
              {activeSection === 'education' && renderEducation()}
              {activeSection === 'skills' && renderSkills()}
              {activeSection === 'languages' && renderOther('languages', t.languages.title, <Globe size={24}/>, 'pink', {id: Math.random().toString(36).substr(2, 9), language: '', proficiency: 'Native'})}
              {activeSection === 'courses' && renderOther('courses', t.courses.title, <Award size={24}/>, 'yellow', {id: Math.random().toString(36).substr(2, 9), name: '', institution: '', year: ''})}
              {activeSection === 'interests' && renderOther('interests', t.interests.title, <Heart size={24}/>, 'red', {id: Math.random().toString(36).substr(2, 9), name: ''})}
              {activeSection === 'references' && renderOther('references', t.references.title, <Users size={24}/>, 'cyan', {id: Math.random().toString(36).substr(2, 9), name: '', company: '', phone: '', email: ''})}
              {activeSection === 'coverLetter' && renderCoverLetter()}
          </div>
      </div>
    </div>
  );
};