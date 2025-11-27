import React, { useState, useEffect } from 'react';
import { ResumeData, Experience, Education, Skill, Language, Course, Interest, Reference, LangCode } from '../types';
import { Plus, Trash2, Wand2, Loader2, ChevronRight, ChevronLeft, User, Briefcase, GraduationCap, Wrench, Globe, Award, Heart, Users, LayoutGrid, MailOpen, Crown, Upload, X, Check } from 'lucide-react';
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

// Styled Components (Tailwind Classes)
const LABEL_CLASS = "block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide";
const INPUT_CLASS = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";
const CARD_CLASS = "bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative group mb-4";
const BTN_ADD_CLASS = "flex items-center gap-2 text-sm font-bold text-primary hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors";
const BTN_AI_CLASS = "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all border";

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
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert("File too large. Please upload an image smaller than 2MB.");
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">{t.personal.title}</h2>
      
      {/* Photo Upload Real */}
      <div className="flex items-center gap-6 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="relative w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center overflow-hidden text-blue-500 border-4 border-white shadow-md flex-shrink-0">
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
                >
                   <Trash2 size={20} />
                </button>
             )}
        </div>
        <div className="flex-grow">
            <label className="block text-sm font-medium text-slate-700 mb-2">{t.personal.photoLabel}</label>
            <div className="flex gap-2 items-center">
                <label className="cursor-pointer bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
                    <Upload size={16} /> 
                    Upload Image
                    <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handlePhotoUpload}
                    />
                </label>
            </div>
            <p className="text-xs text-slate-500 mt-2">{t.personal.photoHelp}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={LABEL_CLASS}>{t.personal.jobTitle}</label>
          <input type="text" className={INPUT_CLASS} placeholder="e.g. Sales Manager" value={data.personalInfo.jobTitle} onChange={(e) => updatePersonal('jobTitle', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_CLASS}>{t.personal.fullName}</label>
          <input type="text" className={INPUT_CLASS} placeholder="e.g. Jan de Vries" value={data.personalInfo.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_CLASS}>{t.personal.email}</label>
          <input type="email" className={INPUT_CLASS} placeholder="jan@example.com" value={data.personalInfo.email} onChange={(e) => updatePersonal('email', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_CLASS}>{t.personal.phone}</label>
          <input type="tel" className={INPUT_CLASS} placeholder="+31 6 12345678" value={data.personalInfo.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_CLASS}>{t.personal.location}</label>
          <input type="text" className={INPUT_CLASS} placeholder="Rotterdam, Netherlands" value={data.personalInfo.location} onChange={(e) => updatePersonal('location', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_CLASS}>{t.personal.dob}</label>
          <input type="date" className={INPUT_CLASS} value={data.personalInfo.dateOfBirth} onChange={(e) => updatePersonal('dateOfBirth', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_CLASS}>{t.personal.nationality}</label>
          <input type="text" className={INPUT_CLASS} placeholder="Dutch" value={data.personalInfo.nationality} onChange={(e) => updatePersonal('nationality', e.target.value)} />
        </div>
         <div>
          <label className={LABEL_CLASS}>{t.personal.license}</label>
          <input type="text" className={INPUT_CLASS} placeholder="B" value={data.personalInfo.drivingLicense} onChange={(e) => updatePersonal('drivingLicense', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>{t.personal.linkedin}</label>
          <input type="text" className={INPUT_CLASS} placeholder="linkedin.com/in/jan" value={data.personalInfo.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} />
        </div>
      </div>
      
      <div className="relative pt-2">
        <div className="flex justify-between items-center mb-1">
            <label className={LABEL_CLASS}>{t.personal.summary}</label>
            <button 
                onClick={handleAiSummary} 
                disabled={loadingAI === 'summary'} 
                className={`${BTN_AI_CLASS} bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200`}
            >
                {loadingAI === 'summary' ? <Loader2 className="animate-spin" size={12}/> : <Wand2 size={12} />} {t.personal.aiWrite}
            </button>
        </div>
        <textarea 
          className={`${INPUT_CLASS} h-32 resize-none`}
          placeholder="Briefly describe your career highlights..." 
          value={data.personalInfo.summary} 
          onChange={(e) => updatePersonal('summary', e.target.value)} 
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">{t.experience.title}</h2>
            <button onClick={() => addItem('experience', { id: Math.random().toString(36).substr(2, 9), title: '', company: '', startDate: '', endDate: '', current: false, description: '' })} className={BTN_ADD_CLASS}>
                <Plus size={16} /> {t.experience.add}
            </button>
        </div>
        {data.experience.map((exp) => (
            <div key={exp.id} className={CARD_CLASS}>
                <button onClick={() => removeItem('experience', exp.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
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
                            <label className="flex items-center gap-1 text-xs font-medium text-slate-600 cursor-pointer whitespace-nowrap mb-0">
                                <input type="checkbox" checked={exp.current} onChange={(e) => updateItem('experience', exp.id, 'current', e.target.checked)} /> {t.experience.current}
                            </label>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="flex justify-between items-center mb-1">
                        <label className={LABEL_CLASS}>{t.experience.responsibilities}</label>
                        <button 
                            onClick={() => handleAiExperience(exp.id, exp.title, exp.description)} 
                            disabled={loadingAI === exp.id} 
                            className={`${BTN_AI_CLASS} bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200`}
                        >
                            {loadingAI === exp.id ? <Loader2 className="animate-spin" size={12}/> : <Wand2 size={12} />} 
                            {exp.description ? t.experience.aiEnhance : t.experience.aiWrite}
                        </button>
                    </div>
                    <textarea 
                      className={`${INPUT_CLASS} h-32`}
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">{t.education.title}</h2>
            <button onClick={() => addItem('education', { id: Math.random().toString(36).substr(2, 9), school: '', degree: '', year: '' })} className={BTN_ADD_CLASS}>
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
                 <button onClick={() => removeItem('education', edu.id)} className="text-slate-400 hover:text-red-500 mt-6"><Trash2 size={18} /></button>
             </div>
        ))}
    </div>
  );

  const renderSkills = () => (
     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">{t.skills.title}</h2>
            <div className="flex gap-2">
                <button onClick={handleAiSkills} disabled={loadingAI === 'skills'} className={`${BTN_AI_CLASS} bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200`}>
                    {loadingAI === 'skills' ? <Loader2 className="animate-spin" size={14}/> : <Wand2 size={14} />} {t.skills.aiSuggest}
                </button>
                <button onClick={() => addItem('skills', { id: Math.random().toString(36).substr(2, 9), name: '', level: 'Intermediate' })} className={BTN_ADD_CLASS}>
                    <Plus size={16} /> {t.skills.add}
                </button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skills.map((skill) => (
                <div key={skill.id} className="flex gap-2 items-center p-2 border border-slate-200 rounded-lg bg-white group hover:border-primary transition-colors">
                    <input type="text" placeholder="Skill" className="flex-grow bg-transparent p-1 outline-none font-medium" value={skill.name} onChange={(e) => updateItem('skills', skill.id, 'name', e.target.value)} />
                    <select className="text-xs bg-slate-50 border border-slate-200 rounded p-1 outline-none" value={skill.level} onChange={(e) => updateItem('skills', skill.id, 'level', e.target.value)}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                        <option value="Master">Master</option>
                    </select>
                    <button onClick={() => removeItem('skills', skill.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
            ))}
        </div>
     </div>
  );

  const renderLanguages = () => (
     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">{t.languages.title}</h2>
            <button onClick={() => addItem('languages', { id: Math.random().toString(36).substr(2, 9), language: '', proficiency: 'Good' })} className={BTN_ADD_CLASS}>
                <Plus size={16} /> {t.languages.add}
            </button>
        </div>
        {data.languages.map((lang) => (
            <div key={lang.id} className={`${CARD_CLASS} flex gap-4 items-center`}>
                 <div className="flex-grow grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Language (e.g. Dutch)" className={INPUT_CLASS} value={lang.language} onChange={(e) => updateItem('languages', lang.id, 'language', e.target.value)} />
                    <select className={INPUT_CLASS} value={lang.proficiency} onChange={(e) => updateItem('languages', lang.id, 'proficiency', e.target.value)}>
                        <option value="Native">Native Speaker</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Good">Good Working Knowledge</option>
                        <option value="Basic">Basic</option>
                    </select>
                 </div>
                 <button onClick={() => removeItem('languages', lang.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
            </div>
        ))}
     </div>
  );

  const renderCourses = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">{t.courses.title}</h2>
            <button onClick={() => addItem('courses', { id: Math.random().toString(36).substr(2, 9), name: '', institution: '', year: '' })} className={BTN_ADD_CLASS}>
                <Plus size={16} /> {t.courses.add}
            </button>
        </div>
        {data.courses.map((course) => (
             <div key={course.id} className={`${CARD_CLASS} flex gap-4 items-start`}>
                 <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={LABEL_CLASS}>{t.courses.courseName}</label>
                        <input type="text" className={INPUT_CLASS} value={course.name} onChange={(e) => updateItem('courses', course.id, 'name', e.target.value)} />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>{t.courses.institution}</label>
                        <input type="text" className={INPUT_CLASS} value={course.institution} onChange={(e) => updateItem('courses', course.id, 'institution', e.target.value)} />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>{t.courses.year}</label>
                        <input type="text" className={INPUT_CLASS} value={course.year} onChange={(e) => updateItem('courses', course.id, 'year', e.target.value)} />
                    </div>
                 </div>
                 <button onClick={() => removeItem('courses', course.id)} className="text-slate-400 hover:text-red-500 mt-6"><Trash2 size={18} /></button>
             </div>
        ))}
    </div>
  );

  const renderInterests = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">{t.interests.title}</h2>
            <button onClick={() => addItem('interests', { id: Math.random().toString(36).substr(2, 9), name: '' })} className={BTN_ADD_CLASS}>
                <Plus size={16} /> {t.interests.add}
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {data.interests.map((int) => (
                <div key={int.id} className="flex gap-2 items-center p-2 border border-slate-200 rounded-lg bg-white">
                    <input type="text" placeholder="Hiking, Reading..." className="flex-grow bg-transparent p-1 outline-none" value={int.name} onChange={(e) => updateItem('interests', int.id, 'name', e.target.value)} />
                    <button onClick={() => removeItem('interests', int.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
            ))}
        </div>
    </div>
  );

  const renderReferences = () => (
     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">{t.references.title}</h2>
            <button onClick={() => addItem('references', { id: Math.random().toString(36).substr(2, 9), name: '', company: '', phone: '', email: '' })} className={BTN_ADD_CLASS}>
                <Plus size={16} /> {t.references.add}
            </button>
        </div>
        {data.references.map((ref) => (
             <div key={ref.id} className={`${CARD_CLASS} flex gap-4 items-start`}>
                 <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <input type="email" className={INPUT_CLASS} value={ref.email} onChange={(e) => updateItem('references', ref.id, 'email', e.target.value)} />
                    </div>
                 </div>
                 <button onClick={() => removeItem('references', ref.id)} className="text-slate-400 hover:text-red-500 mt-6"><Trash2 size={18} /></button>
             </div>
        ))}
        {data.references.length === 0 && <p className="text-slate-400 italic">{t.references.empty}</p>}
    </div>
  );

  const renderCoverLetter = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{t.coverLetter.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100 mb-2">
                <h3 className="text-sm font-bold text-blue-900 mb-2">{t.coverLetter.recipientDetails}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className={LABEL_CLASS}>{t.coverLetter.name}</label>
                        <input type="text" className={INPUT_CLASS} placeholder="e.g. Mr. Van Dijk" value={data.coverLetter.recipientName} onChange={(e) => updateCoverLetter('recipientName', e.target.value)} />
                     </div>
                     <div>
                        <label className={LABEL_CLASS}>{t.coverLetter.role}</label>
                        <input type="text" className={INPUT_CLASS} placeholder="e.g. Hiring Manager" value={data.coverLetter.recipientTitle} onChange={(e) => updateCoverLetter('recipientTitle', e.target.value)} />
                     </div>
                     <div>
                        <label className={LABEL_CLASS}>{t.coverLetter.company}</label>
                        <input type="text" className={INPUT_CLASS} placeholder="Company Name" value={data.coverLetter.companyName} onChange={(e) => updateCoverLetter('companyName', e.target.value)} />
                     </div>
                     <div>
                        <label className={LABEL_CLASS}>{t.coverLetter.address}</label>
                        <input type="text" className={INPUT_CLASS} placeholder="Street, City" value={data.coverLetter.companyAddress} onChange={(e) => updateCoverLetter('companyAddress', e.target.value)} />
                     </div>
                </div>
            </div>
        </div>

        <div className="relative">
             <div className="flex justify-between items-center mb-2">
                <label className={LABEL_CLASS}>{t.coverLetter.body}</label>
                <button 
                    onClick={handleAiCoverLetter} 
                    disabled={loadingAI === 'coverLetter'} 
                    className={`${BTN_AI_CLASS} bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200`}
                >
                    {loadingAI === 'coverLetter' ? <Loader2 className="animate-spin" size={12}/> : <Wand2 size={12} />} {t.coverLetter.aiWrite}
                </button>
            </div>
            <textarea 
                className={`${INPUT_CLASS} h-96 font-serif leading-relaxed`}
                placeholder="Dear Hiring Manager..."
                value={data.coverLetter.body}
                onChange={(e) => updateCoverLetter('body', e.target.value)}
            />
        </div>
    </div>
  );


  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex h-[850px] relative">
      
      {/* Sidebar Navigation */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <LayoutGrid className="text-primary" /> JobFlow
            {isPaid && <span className="bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0.5 rounded font-bold ml-1 flex items-center gap-1"><Crown size={10} fill="currentColor"/> PRO</span>}
          </div>
        </div>
        
        {/* ATS SCORE Widget */}
        <div className="px-4 pt-4 pb-2">
           <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
               <div className="flex justify-between items-end mb-2">
                   <span className="text-xs font-bold text-slate-400 uppercase">{t.score.title}</span>
                   <span className={`text-sm font-bold ${score === 100 ? 'text-green-400' : 'text-orange-400'}`}>{score}%</span>
               </div>
               <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                   <div className={`h-full rounded-full transition-all duration-1000 ${score === 100 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${score}%` }}></div>
               </div>
               <div className="mt-2 text-[10px] text-slate-500">
                   {score < 100 ? (
                       <>
                           {t.score.improve} <br/>
                           {!data.personalInfo.photoUrl && <span className="text-blue-400 block">{t.score.tip_photo}</span>}
                           {data.personalInfo.summary.length < 20 && <span className="text-blue-400 block">{t.score.tip_summary}</span>}
                           {data.experience.length === 0 && <span className="text-blue-400 block">{t.score.tip_exp}</span>}
                       </>
                   ) : (
                       <span className="text-green-400">{t.score.perfect}</span>
                   )}
               </div>
           </div>
        </div>

        <nav className="flex-grow overflow-y-auto py-2 space-y-1 px-3">
          {sections.map((s) => {
             const isActive = activeSection === s.id;
             return (
                <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive 
                        ? 'bg-primary text-white shadow-lg shadow-blue-900/50' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                    style={isActive ? { backgroundColor: data.meta.accentColor } : {}}
                >
                    {s.icon}
                    {s.label}
                </button>
             );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
            <div className="text-xs text-slate-500 text-center mb-3">{t.nav.finish}</div>
             <button onClick={onNext} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-lg">
                {t.nav.preview} <ChevronRight size={16} />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col bg-slate-50 h-full overflow-hidden">
          {/* Header for Mobile/Context */}
          <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center lg:hidden">
              <span className="font-bold text-slate-800 capitalize">{sections.find(s => s.id === activeSection)?.label}</span>
              <button onClick={onBack} className="text-sm text-slate-500">{t.actions.back}</button>
          </div>

          <div className="flex-grow overflow-y-auto p-8">
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

          {/* Desktop Bottom Bar */}
          <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center">
              <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 px-4 py-2 rounded transition">
                 <ChevronLeft size={16} /> {t.actions.back}
              </button>
              
              <div className="flex gap-2">
                 {/* Simple Navigation Logic */}
                 <button 
                    onClick={() => {
                        const idx = sections.findIndex(s => s.id === activeSection);
                        if (idx > 0) setActiveSection(sections[idx - 1].id);
                    }}
                    disabled={activeSection === 'personal'}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30"
                 >
                     {t.actions.prev}
                 </button>
                 <button 
                     onClick={() => {
                         const idx = sections.findIndex(s => s.id === activeSection);
                         if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id);
                         else onNext();
                     }}
                     className="px-6 py-2 bg-slate-800 text-white rounded hover:bg-slate-900 transition flex items-center gap-2"
                     style={{ backgroundColor: data.meta.accentColor }}
                 >
                     {t.actions.next} <ChevronRight size={16} />
                 </button>
              </div>
          </div>
      </div>

      {/* Skill Selector Modal */}
      {showSkillSelector && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                      <div>
                          <h3 className="font-bold text-slate-800">{t.skills.selectorTitle}</h3>
                          <p className="text-xs text-slate-500">{t.skills.selectorSubtitle}</p>
                      </div>
                      <button onClick={() => setShowSkillSelector(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-4 max-h-[300px] overflow-y-auto grid grid-cols-1 gap-2">
                      {suggestedSkills.map((skill) => {
                          const isSelected = selectedSuggestions.has(skill);
                          return (
                              <button
                                  key={skill}
                                  onClick={() => toggleSuggestion(skill)}
                                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                      isSelected 
                                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                              >
                                  <span className="font-medium text-sm">{skill}</span>
                                  {isSelected && <CheckCircleIcon className="text-blue-600" size={16} />}
                              </button>
                          );
                      })}
                  </div>
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                      <button 
                          onClick={() => setShowSkillSelector(false)}
                          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                      >
                          {t.skills.cancel}
                      </button>
                      <button 
                          onClick={confirmAiSkills}
                          disabled={selectedSuggestions.size === 0}
                          className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {t.skills.addSelected} ({selectedSuggestions.size})
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const CheckCircleIcon = ({ className, size }: { className?: string, size?: number }) => (
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${className ? className.replace('text-', 'border-') : 'border-blue-600'}`}>
        <Check size={size ? size - 4 : 12} strokeWidth={3} className={className} />
    </div>
);
