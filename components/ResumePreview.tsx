
import React, { useState } from 'react';
import { ResumeData, LangCode, AuditResult } from '../types';
import { MapPin, Phone, Mail, Linkedin, Calendar, Flag, Car, Briefcase, Sparkles, FileText, MailOpen, Palette, Check, Layout, TrendingUp, Download } from 'lucide-react';
import { content } from '../locales';
import { auditResume } from '../services/geminiService';
import { ResumeAuditModal } from './ResumeAuditModal';

interface ResumePreviewProps {
  data: ResumeData;
  onEdit: () => void;
  onDownload: () => void;
  onHeadhunter: () => void;
  lang: LangCode;
}

const COLORS = [
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Slate', hex: '#475569' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Dutch Orange', hex: '#F36B25' },
    { name: 'Purple', hex: '#7c3aed' },
    { name: 'Rose', hex: '#e11d48' },
];

const TEMPLATES = [
  { id: 'modern', name: 'Modern Benelux' },
  { id: 'professional', name: 'Professional' },
  { id: 'elegant', name: 'Elegant Serif' },
  { id: 'creative', name: 'Creative' },
  { id: 'minimal', name: 'Minimalist' },
] as const;

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, onEdit, onDownload, onHeadhunter, lang }) => {
  const [view, setView] = useState<'cv' | 'letter'>('cv');
  const [accentColor, setAccentColor] = useState(data.meta.accentColor || '#2563eb');
  const [template, setTemplate] = useState<string>(data.meta.template || 'modern');
  
  // Audit State
  const [showAudit, setShowAudit] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const t = content[lang].preview;

  // Helper to update visual state
  const handleColorChange = (color: string) => {
      setAccentColor(color);
      data.meta.accentColor = color;
  };

  const handleTemplateChange = (tmpl: string) => {
      setTemplate(tmpl);
      data.meta.template = tmpl as any;
  };

  const handleAuditClick = async () => {
      setShowAudit(true);
      if (!auditResult) { // Only fetch if we haven't already (simple cache)
          setAuditLoading(true);
          const result = await auditResume(data, lang);
          setAuditResult(result);
          setAuditLoading(false);
      }
  };

  // --- Smart Date Formatter ---
  const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return dateStr; // Fallback if not a valid date
          
          let locale = 'en-US';
          if (lang === 'nl') locale = 'nl-NL';
          if (lang === 'es') locale = 'es-ES';
          if (lang === 'pt') locale = 'pt-PT';

          return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
      } catch (e) {
          return dateStr;
      }
  };

  const formatRange = (start: string, end: string, current: boolean) => {
      const s = formatDate(start);
      const e = current ? t.labels.present : formatDate(end);
      return `${s} – ${e}`;
  };

  // --- SUB-COMPONENTS FOR SECTIONS TO REDUCE REPETITION ---
  const ContactItem = ({ icon: Icon, text, link }: { icon: any, text: string, link?: string }) => (
    <div className="flex items-center gap-2 text-sm">
        <Icon size={14} className="flex-shrink-0 opacity-70" style={{ color: template === 'modern' ? 'inherit' : accentColor }} />
        <span className="opacity-90 truncate">{text}</span>
    </div>
  );

  // --- TEMPLATE RENDERERS ---

  // 1. MODERN (Original Left Sidebar)
  const RenderModern = () => (
    <div className="grid grid-cols-[30%_70%] h-full min-h-[297mm]">
        {/* Left Sidebar */}
        <div className="text-white p-8 flex flex-col gap-8" style={{ backgroundColor: '#0f172a' }}> 
            <div className="w-32 h-32 mx-auto bg-slate-700 rounded-full overflow-hidden border-4 shadow-xl mb-2" style={{ borderColor: accentColor }}>
                 {data.personalInfo.photoUrl ? (
                    <img src={data.personalInfo.photoUrl} alt={data.personalInfo.fullName} className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-200 text-4xl font-bold">
                        {data.personalInfo.fullName.charAt(0) || "CV"}
                    </div>
                 )}
            </div>
            <div className="space-y-3 text-sm">
                <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 border-b border-slate-700 pb-2 mb-4">{t.headers.contact}</h3>
                {data.personalInfo.email && <ContactItem icon={Mail} text={data.personalInfo.email} />}
                {data.personalInfo.phone && <ContactItem icon={Phone} text={data.personalInfo.phone} />}
                {data.personalInfo.location && <ContactItem icon={MapPin} text={data.personalInfo.location} />}
                {data.personalInfo.linkedin && <ContactItem icon={Linkedin} text={data.personalInfo.linkedin.replace('https://', '')} />}
            </div>
            <div className="space-y-3 text-sm">
                <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 border-b border-slate-700 pb-2 mb-4">{t.headers.personal}</h3>
                {data.personalInfo.dateOfBirth && <ContactItem icon={Calendar} text={formatDate(data.personalInfo.dateOfBirth)} />}
                {data.personalInfo.nationality && <ContactItem icon={Flag} text={data.personalInfo.nationality} />}
                {data.personalInfo.drivingLicense && <ContactItem icon={Car} text={`${t.labels.license}: ${data.personalInfo.drivingLicense}`} />}
            </div>
            {data.skills.length > 0 && (
                <div>
                     <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 border-b border-slate-700 pb-2 mb-4">{t.headers.expertise}</h3>
                     <div className="flex flex-wrap gap-2">
                         {data.skills.map(s => (
                             <span key={s.id} className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-200 border border-slate-700">{s.name}</span>
                         ))}
                     </div>
                </div>
            )}
             {data.languages.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 border-b border-slate-700 pb-2 mb-4">{t.headers.languages}</h3>
                    <ul className="space-y-2 text-sm">
                        {data.languages.map(l => <li key={l.id} className="flex justify-between"><span>{l.language}</span><span className="opacity-60 text-xs">{l.proficiency}</span></li>)}
                    </ul>
                </div>
            )}
        </div>

        {/* Main Content */}
        <div className="p-10 pt-12">
            <div className="mb-8">
                 <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tight mb-1">{data.personalInfo.fullName}</h1>
                 <p className="text-xl font-medium" style={{ color: accentColor }}>{data.personalInfo.jobTitle}</p>
            </div>
            {data.personalInfo.summary && (
                <div className="mb-8">
                     <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">{t.headers.profile}</h2>
                    <p className="text-slate-700 leading-relaxed text-sm">{data.personalInfo.summary}</p>
                </div>
            )}
            {data.experience.length > 0 && (
                <div className="mb-8">
                    <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">{t.headers.experience}</h2>
                    <div className="space-y-6">
                        {data.experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-800 text-lg">{exp.title}</h3>
                                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{formatRange(exp.startDate, exp.endDate, exp.current)}</span>
                                </div>
                                <div className="font-medium text-sm mb-2" style={{ color: accentColor }}>{exp.company}</div>
                                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             {data.education.length > 0 && (
                <div className="mb-8">
                    <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">{t.headers.education}</h2>
                    <div className="space-y-4">
                        {data.education.map(edu => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline"><h3 className="font-bold text-slate-800">{edu.school}</h3><span className="text-xs font-semibold text-slate-500">{edu.year}</span></div>
                                <div className="text-slate-600 text-sm">{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
  );

  // 2. PROFESSIONAL (Right Sidebar, Top Border)
  const RenderProfessional = () => (
    <div className="flex flex-col h-full min-h-[297mm]">
        {/* Header */}
        <div className="p-8 border-t-8 bg-white" style={{ borderColor: accentColor }}>
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900">{data.personalInfo.fullName}</h1>
                    <p className="text-xl mt-2 font-medium" style={{ color: accentColor }}>{data.personalInfo.jobTitle}</p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                        {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    </div>
                </div>
                {data.personalInfo.photoUrl && (
                    <img src={data.personalInfo.photoUrl} className="w-24 h-24 rounded-lg object-cover shadow-sm" alt="Profile" />
                )}
            </div>
        </div>

        <div className="flex flex-grow">
             {/* Main Left */}
            <div className="w-[65%] p-8 pt-0 pr-6">
                {data.personalInfo.summary && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b pb-2 mb-3" style={{ borderColor: accentColor }}>{t.headers.profile}</h2>
                        <p className="text-slate-700 text-sm leading-relaxed">{data.personalInfo.summary}</p>
                    </div>
                )}
                 {data.experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b pb-2 mb-4" style={{ borderColor: accentColor }}>{t.headers.experience}</h2>
                        <div className="space-y-5">
                            {data.experience.map(exp => (
                                <div key={exp.id}>
                                    <h3 className="font-bold text-slate-800">{exp.title}</h3>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-600">{exp.company}</span>
                                        <span className="text-slate-500 italic">{formatRange(exp.startDate, exp.endDate, exp.current)}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar Right */}
            <div className="w-[35%] bg-slate-50 p-8 pt-4 border-l border-slate-200">
                 <div className="space-y-6">
                    {data.education.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold uppercase text-slate-800 mb-3 border-b border-slate-200 pb-1">{t.headers.education}</h2>
                            {data.education.map(edu => (
                                <div key={edu.id} className="mb-3">
                                    <div className="font-bold text-sm">{edu.school}</div>
                                    <div className="text-xs text-slate-600">{edu.degree}</div>
                                    <div className="text-xs text-slate-400">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {data.skills.length > 0 && (
                        <div>
                             <h2 className="text-sm font-bold uppercase text-slate-800 mb-3 border-b border-slate-200 pb-1">{t.headers.expertise}</h2>
                             <div className="space-y-2">
                                 {data.skills.map(s => (
                                     <div key={s.id}>
                                         <div className="text-xs font-medium flex justify-between">
                                             <span>{s.name}</span>
                                             <span className="text-slate-400">{s.level}</span>
                                         </div>
                                         <div className="h-1 w-full bg-slate-200 rounded-full mt-0.5">
                                             <div className="h-1 rounded-full" style={{ backgroundColor: accentColor, width: s.level === 'Master' ? '100%' : s.level === 'Expert' ? '80%' : '50%' }}></div>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    )}
                     {/* Details & Languages mixed here */}
                     <div>
                        <h2 className="text-sm font-bold uppercase text-slate-800 mb-3 border-b border-slate-200 pb-1">{t.headers.personal}</h2>
                        <div className="space-y-2 text-xs text-slate-600">
                             {data.personalInfo.dateOfBirth && <div><span className="font-semibold">DOB:</span> {formatDate(data.personalInfo.dateOfBirth)}</div>}
                             {data.personalInfo.drivingLicense && <div><span className="font-semibold">{t.labels.license}:</span> {data.personalInfo.drivingLicense}</div>}
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );

  // 3. ELEGANT (Serif, Center Aligned Header)
  const RenderElegant = () => (
    <div className="h-full min-h-[297mm] p-10 font-serif text-slate-800">
        <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
            <h1 className="text-5xl font-bold mb-2">{data.personalInfo.fullName}</h1>
            <p className="text-xl italic text-slate-600 mb-4">{data.personalInfo.jobTitle}</p>
            <div className="flex justify-center gap-4 text-sm font-sans text-slate-500">
                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                <span>•</span>
                {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                <span>•</span>
                {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
             {data.personalInfo.summary && (
                 <div className="text-center max-w-2xl mx-auto mb-4">
                     <p className="text-base leading-relaxed italic">{data.personalInfo.summary}</p>
                 </div>
             )}

             {/* Experience */}
             {data.experience.length > 0 && (
                 <section>
                     <h2 className="text-2xl font-bold text-center mb-6 uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 inline-block w-full">{t.headers.experience}</h2>
                     <div className="space-y-8">
                         {data.experience.map(exp => (
                             <div key={exp.id} className="grid grid-cols-[1fr_3fr] gap-4">
                                 <div className="text-right font-sans text-sm text-slate-500 pt-1">
                                     {formatRange(exp.startDate, exp.endDate, exp.current)}
                                 </div>
                                 <div>
                                     <h3 className="text-lg font-bold">{exp.title}</h3>
                                     <div className="text-slate-600 italic mb-2">{exp.company}</div>
                                     <p className="text-sm font-sans leading-relaxed">{exp.description}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </section>
             )}

             {/* Two Columns for Skills/Education */}
             <div className="grid grid-cols-2 gap-10 mt-4">
                 <section>
                    <h2 className="text-xl font-bold mb-4 uppercase tracking-widest border-b border-slate-200 pb-1">{t.headers.education}</h2>
                    {data.education.map(edu => (
                        <div key={edu.id} className="mb-4">
                            <h3 className="font-bold">{edu.school}</h3>
                            <p className="italic text-slate-600">{edu.degree}</p>
                            <p className="text-sm font-sans text-slate-400">{edu.year}</p>
                        </div>
                    ))}
                 </section>
                 <section>
                    <h2 className="text-xl font-bold mb-4 uppercase tracking-widest border-b border-slate-200 pb-1">{t.headers.expertise}</h2>
                    <div className="flex flex-wrap gap-2 font-sans">
                         {data.skills.map(s => (
                             <span key={s.id} className="px-3 py-1 bg-slate-100 rounded-full text-xs">{s.name}</span>
                         ))}
                    </div>
                 </section>
             </div>
        </div>
    </div>
  );

  // 4. CREATIVE (Bold Header, Grid)
  const RenderCreative = () => (
    <div className="h-full min-h-[297mm] flex flex-col">
         <div className="p-10 text-white" style={{ backgroundColor: accentColor }}>
             <div className="flex justify-between items-end">
                 <div>
                     <h1 className="text-5xl font-bold tracking-tight">{data.personalInfo.fullName}</h1>
                     <p className="text-2xl mt-2 opacity-90">{data.personalInfo.jobTitle}</p>
                 </div>
                 <div className="text-right text-sm font-medium opacity-80 space-y-1">
                     <div>{data.personalInfo.email}</div>
                     <div>{data.personalInfo.phone}</div>
                     <div>{data.personalInfo.location}</div>
                 </div>
             </div>
         </div>

         <div className="p-10 grid grid-cols-3 gap-8 flex-grow">
             {/* Left Column Narrow */}
             <div className="col-span-1 space-y-8 border-r border-slate-100 pr-6">
                 {data.personalInfo.photoUrl && (
                     <img src={data.personalInfo.photoUrl} className="w-full aspect-square object-cover rounded-xl grayscale hover:grayscale-0 transition-all" alt="Me" />
                 )}
                 
                 <div>
                     <h3 className="font-bold text-lg mb-4" style={{ color: accentColor }}>{t.headers.personal}</h3>
                     <div className="space-y-2 text-sm text-slate-600">
                         <p><span className="font-bold text-slate-800">Born:</span> {formatDate(data.personalInfo.dateOfBirth)}</p>
                         <p><span className="font-bold text-slate-800">Nationality:</span> {data.personalInfo.nationality}</p>
                         <p><span className="font-bold text-slate-800">Web:</span> {data.personalInfo.website || 'N/A'}</p>
                     </div>
                 </div>

                 <div>
                     <h3 className="font-bold text-lg mb-4" style={{ color: accentColor }}>{t.headers.expertise}</h3>
                     <div className="grid grid-cols-1 gap-2">
                         {data.skills.map(s => (
                             <div key={s.id} className="bg-slate-50 p-2 rounded border-l-4 border-slate-300 text-xs font-bold text-slate-700" style={{ borderLeftColor: accentColor }}>
                                 {s.name}
                             </div>
                         ))}
                     </div>
                 </div>
             </div>

             {/* Right Column Wide */}
             <div className="col-span-2 space-y-8">
                 {data.personalInfo.summary && (
                     <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                         <p className="text-slate-700 leading-relaxed">{data.personalInfo.summary}</p>
                     </div>
                 )}

                 <div>
                     <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                         <span className="w-2 h-8 rounded" style={{ backgroundColor: accentColor }}></span>
                         {t.headers.experience}
                     </h2>
                     <div className="space-y-8 pl-4 border-l-2 border-slate-100 ml-1">
                         {data.experience.map(exp => (
                             <div key={exp.id} className="relative pl-6">
                                 <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: accentColor }}></div>
                                 <h3 className="text-xl font-bold text-slate-900">{exp.title}</h3>
                                 <div className="text-sm font-bold mb-2 opacity-75" style={{ color: accentColor }}>{exp.company} | {formatRange(exp.startDate, exp.endDate, exp.current)}</div>
                                 <p className="text-slate-600 text-sm">{exp.description}</p>
                             </div>
                         ))}
                     </div>
                 </div>

                 {data.education.length > 0 && (
                     <div>
                         <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                             <span className="w-2 h-8 rounded" style={{ backgroundColor: accentColor }}></span>
                             {t.headers.education}
                         </h2>
                         <div className="grid grid-cols-2 gap-4">
                             {data.education.map(edu => (
                                 <div key={edu.id} className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                                     <h3 className="font-bold text-slate-800">{edu.school}</h3>
                                     <p className="text-sm text-slate-500">{edu.degree}</p>
                                     <p className="text-xs font-bold mt-2" style={{ color: accentColor }}>{edu.year}</p>
                                 </div>
                             ))}
                         </div>
                     </div>
                 )}
             </div>
         </div>
    </div>
  );

  // 5. MINIMAL (Clean, No backgrounds)
  const RenderMinimal = () => (
    <div className="h-full min-h-[297mm] p-12 text-slate-900 font-sans">
        <header className="mb-10 border-b border-slate-900 pb-6">
            <h1 className="text-5xl font-light tracking-tight mb-2">{data.personalInfo.fullName}</h1>
            <div className="flex justify-between items-end">
                <p className="text-xl font-medium uppercase tracking-widest">{data.personalInfo.jobTitle}</p>
                <div className="text-right text-sm text-slate-500">
                    {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}
                </div>
            </div>
        </header>

        <div className="space-y-8">
             {data.personalInfo.summary && (
                 <section>
                     <h3 className="text-sm font-bold uppercase mb-2">Summary</h3>
                     <p className="text-sm text-slate-600 max-w-3xl">{data.personalInfo.summary}</p>
                 </section>
             )}

             {data.experience.length > 0 && (
                 <section>
                     <h3 className="text-sm font-bold uppercase mb-4">Experience</h3>
                     <div className="space-y-6">
                         {data.experience.map(exp => (
                             <div key={exp.id} className="grid grid-cols-[150px_1fr] gap-4">
                                 <div className="text-xs font-bold text-slate-400 pt-1">{formatRange(exp.startDate, exp.endDate, exp.current)}</div>
                                 <div>
                                     <h4 className="font-bold text-base">{exp.title}, {exp.company}</h4>
                                     <p className="text-sm text-slate-600 mt-1">{exp.description}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </section>
             )}

            <div className="grid grid-cols-2 gap-12">
                 {data.education.length > 0 && (
                     <section>
                         <h3 className="text-sm font-bold uppercase mb-4">Education</h3>
                         {data.education.map(edu => (
                             <div key={edu.id} className="mb-3">
                                 <div className="font-bold text-sm">{edu.school}</div>
                                 <div className="text-sm text-slate-600">{edu.degree}</div>
                                 <div className="text-xs text-slate-400">{edu.year}</div>
                             </div>
                         ))}
                     </section>
                 )}
                 {data.skills.length > 0 && (
                     <section>
                         <h3 className="text-sm font-bold uppercase mb-4">Skills</h3>
                         <div className="text-sm text-slate-700 leading-6">
                             {data.skills.map(s => s.name).join(' • ')}
                         </div>
                     </section>
                 )}
            </div>
        </div>
    </div>
  );

  // --- MAIN COMPONENT RENDER ---
  return (
    <div className="flex flex-col items-center py-10 bg-slate-800 min-h-screen overflow-y-auto">
        
        {/* Toolbar */}
        <div className="w-full max-w-5xl flex flex-col lg:flex-row justify-between items-center mb-6 px-4 no-print text-white gap-4">
            <div className="flex flex-wrap gap-4 items-center justify-center">
                <button onClick={onEdit} className="text-slate-300 hover:text-white font-medium flex items-center gap-2">
                    &larr; {t.back}
                </button>
                
                {/* View Toggle */}
                <div className="bg-slate-700 p-1 rounded-lg flex gap-1">
                    <button onClick={() => setView('cv')} className={`px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${view === 'cv' ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}>
                        <FileText size={14} /> {t.viewCv}
                    </button>
                    <button onClick={() => setView('letter')} className={`px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${view === 'letter' ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}>
                        <MailOpen size={14} /> {t.viewLetter}
                    </button>
                </div>

                {/* Template Switcher */}
                {view === 'cv' && (
                    <div className="flex items-center gap-2 bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600">
                         <Layout size={14} className="text-slate-400" />
                         <select 
                            value={template} 
                            onChange={(e) => handleTemplateChange(e.target.value)}
                            className="bg-transparent text-sm font-bold outline-none text-white cursor-pointer"
                         >
                             {TEMPLATES.map(t => <option key={t.id} value={t.id} className="text-slate-900">{t.name}</option>)}
                         </select>
                    </div>
                )}

                {/* Color Picker */}
                <div className="flex items-center gap-2 bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600">
                    <Palette size={14} className="text-slate-400"/>
                    {COLORS.map(c => (
                        <button 
                            key={c.name}
                            onClick={() => handleColorChange(c.hex)}
                            className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${accentColor === c.hex ? 'border-white scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                        />
                    ))}
                </div>
            </div>

            <div className="flex gap-4 items-center">
                {/* AI Audit Button */}
                <button 
                    onClick={handleAuditClick}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2 border border-slate-600 group"
                >
                    <TrendingUp size={16} className="text-blue-400 group-hover:text-blue-300" /> {t.audit}
                </button>

                <button 
                    onClick={onHeadhunter}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-lg font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 animate-pulse hover:animate-none"
                >
                    <Sparkles size={16} /> {t.headhunter}
                </button>
                
                <button 
                    onClick={onDownload}
                    className="text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
                    style={{ backgroundColor: accentColor }}
                >
                    {t.download}
                </button>
            </div>
        </div>

        {/* Paper Container - Added overflow-x-auto for mobile responsiveness */}
        <div className="w-full overflow-x-auto pb-8 flex justify-center">
            <div className="print-area bg-white shadow-2xl w-[210mm] min-h-[297mm] text-slate-800 relative mx-auto overflow-hidden flex-shrink-0">
                {view === 'cv' ? (
                    <>
                        {template === 'modern' && <RenderModern />}
                        {template === 'professional' && <RenderProfessional />}
                        {template === 'elegant' && <RenderElegant />}
                        {template === 'creative' && <RenderCreative />}
                        {template === 'minimal' && <RenderMinimal />}
                    </>
                ) : (
                    // --- COVER LETTER LAYOUT ---
                    <div className="p-16 h-full min-h-[297mm] flex flex-col relative">
                        <div className="border-b-2 pb-6 mb-8 flex justify-between items-end" style={{ borderColor: accentColor }}>
                             <div>
                                <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tight">{data.personalInfo.fullName}</h1>
                                <p className="text-xl font-medium mt-1" style={{ color: accentColor }}>{data.personalInfo.jobTitle}</p>
                             </div>
                             <div className="text-right text-xs text-slate-500 space-y-1">
                                 <p>{data.personalInfo.location}</p>
                                 <p>{data.personalInfo.email}</p>
                                 <p>{data.personalInfo.phone}</p>
                             </div>
                        </div>
                        <div className="mb-12 text-sm text-slate-800">
                            <p className="font-bold">{data.coverLetter.recipientName}</p>
                            <p>{data.coverLetter.recipientTitle}</p>
                            <p>{data.coverLetter.companyName}</p>
                            <p>{data.coverLetter.companyAddress}</p>
                        </div>
                        <div className="mb-8 text-sm text-slate-500">
                            {new Date().toLocaleDateString('en-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex-grow text-sm text-slate-800 leading-7 whitespace-pre-line text-justify font-serif">
                            {data.coverLetter.body || "No cover letter content generated yet. Please go back to the editor to create your cover letter."}
                        </div>
                        <div className="mt-12 mb-12">
                            <p className="text-sm text-slate-800 mb-4">Sincerely,</p>
                            <p className="text-lg font-serif font-bold text-slate-900">{data.personalInfo.fullName}</p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-4" style={{ backgroundColor: accentColor }}></div>
                    </div>
                )}
            </div>
        </div>

        {/* Audit Modal */}
        <ResumeAuditModal 
            isOpen={showAudit}
            onClose={() => setShowAudit(false)}
            results={auditResult}
            isLoading={auditLoading}
            lang={lang}
        />
    </div>
  );
};