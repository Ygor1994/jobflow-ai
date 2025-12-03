import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, JobOpportunity, LangCode, INITIAL_RESUME_DATA } from "../types";

const getClient = () => {
  // CRITICAL FIX: Try multiple ways to get the key to ensure it works in all environments (Local Windows, Vercel Linux, etc)
  const apiKey = import.meta.env.VITE_API_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    console.error("CRITICAL: API Key is missing. Check .env file or Vercel Settings.");
    // Return a dummy client that will fail gracefully instead of crashing
    return new GoogleGenAI({ apiKey: "missing_key" });
  }

  return new GoogleGenAI({ apiKey: apiKey });
};

const getContextByLang = (lang: LangCode) => {
  switch(lang) {
    case 'nl': return "Netherlands and Belgium";
    case 'es': return "Spain";
    case 'pt': return "Portugal";
    default: return "Europe (specifically Netherlands, Belgium, Spain, Portugal)";
  }
};

const getLanguageName = (lang: LangCode) => {
  switch(lang) {
    case 'nl': return "Dutch";
    case 'es': return "Spanish";
    case 'pt': return "Portuguese";
    default: return "English";
  }
};

export const generateSummary = async (jobTitle: string, experienceStr: string, lang: LangCode): Promise<string> => {
  const client = getClient();

  try {
    const prompt = `You are an expert CV writer for the ${getContextByLang(lang)} job market. 
    Write a professional, concise, and impactful resume summary (max 4 sentences) for a "${jobTitle}".
    The candidate has the following experience highlights: "${experienceStr}".
    Focus on value, results, and adaptability. Write exclusively in ${getLanguageName(lang)}.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return ""; // Fail silently so UI handles it
  }
};

export const enhanceExperience = async (title: string, rawDescription: string, lang: LangCode): Promise<string> => {
  const client = getClient();

  try {
    let prompt = '';
    
    // Aggressive check: If description is short or empty, generate from scratch
    if (!rawDescription || rawDescription.trim().length < 5) {
        prompt = `You are a professional resume writer for the ${getContextByLang(lang)} market.
        The candidate has the job title: "${title}".
        They have not provided a description. 
        
        TASK: Generate a robust, professional list of 4-5 bullet points describing typical high-impact responsibilities and achievements for a "${title}".
        Use strong action verbs.
        Write exclusively in ${getLanguageName(lang)}.`;
    } else {
        prompt = `You are a hiring manager in ${getContextByLang(lang)}. 
        Rewrite the following job description for a "${title}" role to be more professional, action-oriented, and quantified.
        Use bullet points (•) for readability. Keep it within 3-5 bullet points.
        Write exclusively in ${getLanguageName(lang)}.
        
        Raw Input: "${rawDescription}"`;
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || rawDescription;
  } catch (error) {
    console.error("Gemini Enhance Error:", error);
    return rawDescription;
  }
};

export const suggestSkills = async (jobTitle: string, lang: LangCode): Promise<string[]> => {
  const client = getClient();

  try {
    const prompt = `List 8 top technical and soft skills required for a "${jobTitle}" in 2025. Return ONLY a comma-separated list. 
    Write the skills in ${getLanguageName(lang)}.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "";
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    console.error("Gemini Skills Error:", error);
    return [];
  }
};

export const generateCoverLetter = async (resumeData: ResumeData, lang: LangCode): Promise<string> => {
  const client = getClient();

  try {
    const prompt = `Write a professional, persuasive cover letter (body only) for a job application in ${getContextByLang(lang)}.
    
    Candidate: ${resumeData.personalInfo.fullName}
    Target Role: ${resumeData.personalInfo.jobTitle}
    Company Name: ${resumeData.coverLetter.companyName || "Hiring Company"}
    
    Key Highlights to include:
    - ${resumeData.personalInfo.summary}
    - Top Skills: ${resumeData.skills.slice(0, 3).map(s => s.name).join(', ')}
    
    Tone: Professional, enthusiastic, and confident.
    Format: 3-4 paragraphs. Do NOT include the header or date (I will render those). Start with the appropriate greeting in ${getLanguageName(lang)}.
    Write exclusively in ${getLanguageName(lang)}.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Cover Letter Error:", error);
    return "";
  }
};

export const findMatchingJobs = async (resumeData: ResumeData, lang: LangCode): Promise<JobOpportunity[]> => {
  const client = getClient();

  // Fallback values if resume is empty, to force AI to return SOMETHING
  const targetRole = resumeData.personalInfo.jobTitle || "Professional";
  const location = resumeData.personalInfo.location || getContextByLang(lang);
  
  const experienceContext = resumeData.experience.map(exp => 
    `Role: ${exp.title} at ${exp.company} (${exp.startDate} to ${exp.current ? 'Present' : exp.endDate}). Key Responsibilities: ${exp.description}`
  ).join('\n\n');

  try {
    const prompt = `Act as an expert Technical Recruiter for ${getContextByLang(lang)}.
    I need you to find 5 REALISTIC job opportunities for this candidate.
    
    PROFILE:
    - Role: ${targetRole}
    - Location: ${location}
    - Skills: ${resumeData.skills.map(s => s.name).join(', ') || "General"}
    
    HISTORY:
    ${experienceContext.length > 10 ? experienceContext : "No history provided. Infer from target role."}
    
    TASK:
    Generate a list of 5 active-style job listings that would be a good fit.
    Make sure the companies exist in ${getContextByLang(lang)} or are global.
    
    OUTPUT JSON:
    [
      {
        "title": "Job Title",
        "company": "Company Name",
        "location": "City",
        "matchScore": 85,
        "salaryRange": "€XXk - €XXk",
        "reason": "Why it fits...",
        "hrEmail": "hr@company.com"
      }
    ]`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    let text = response.text || "[]";
    if (text.startsWith('```json')) {
        text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (text.startsWith('```')) {
        text = text.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const jobs = JSON.parse(text);
    return jobs.map((j: any) => ({ ...j, id: Math.random().toString(36).substr(2, 9) }));
  } catch (error) {
    console.error("Gemini Job Match Error:", error);
    return [];
  }
};

export const searchJobs = async (query: string, location: string, lang: LangCode): Promise<JobOpportunity[]> => {
  const client = getClient();

  try {
    const prompt = `Act as a job search engine. Find 5 jobs for "${query}" in "${location}".
    Context: ${getContextByLang(lang)}.
    Output JSON list with title, company, location, matchScore(70-99), salaryRange, reason, hrEmail.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    let text = response.text || "[]";
    if (text.startsWith('```json')) {
        text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (text.startsWith('```')) {
        text = text.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const jobs = JSON.parse(text);
    return jobs.map((j: any) => ({ ...j, id: Math.random().toString(36).substr(2, 9) }));
  } catch (error) {
    console.error("Gemini Job Search Error:", error);
    return [];
  }
};

export const draftCoverLetter = async (job: JobOpportunity, resumeData: ResumeData, lang: LangCode): Promise<string> => {
  const client = getClient();
  try {
    const prompt = `Write a short email to HR applying for ${job.title} at ${job.company}.
    Candidate: ${resumeData.personalInfo.fullName}.
    Language: ${getLanguageName(lang)}.`;
    
    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text || "Attached is my CV.";
  } catch (e) {
      return "Attached is my CV.";
  }
};

export const parseResumeFromText = async (text: string): Promise<ResumeData> => {
  const client = getClient();

  try {
    const prompt = `Extract resume data from this text into JSON.
    TEXT: "${text.substring(0, 30000)}"
    
    SCHEMA:
    {
      "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "summary": "", "jobTitle": "", "linkedin": "" },
      "experience": [{ "id": "gen", "title": "", "company": "", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "current": false, "description": "" }],
      "education": [{ "id": "gen", "school": "", "degree": "", "year": "" }],
      "skills": [{ "id": "gen", "name": "", "level": "Intermediate" }],
      "languages": [{ "id": "gen", "language": "", "proficiency": "Good" }]
    }`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    let extractedText = response.text || "{}";
    if (extractedText.startsWith('```json')) extractedText = extractedText.replace(/^```json\n/, '').replace(/\n```$/, '');
    else if (extractedText.startsWith('```')) extractedText = extractedText.replace(/^```\n/, '').replace(/\n```$/, '');

    const extracted = JSON.parse(extractedText);
    
    return {
        ...INITIAL_RESUME_DATA,
        personalInfo: { ...INITIAL_RESUME_DATA.personalInfo, ...extracted.personalInfo },
        experience: Array.isArray(extracted.experience) ? extracted.experience.map((e: any) => ({...e, id: Math.random().toString(36).substr(2,9)})) : [],
        education: Array.isArray(extracted.education) ? extracted.education.map((e: any) => ({...e, id: Math.random().toString(36).substr(2,9)})) : [],
        skills: Array.isArray(extracted.skills) ? extracted.skills.map((e: any) => ({...e, id: Math.random().toString(36).substr(2,9)})) : [],
        languages: Array.isArray(extracted.languages) ? extracted.languages.map((e: any) => ({...e, id: Math.random().toString(36).substr(2,9)})) : [],
    };
  } catch (error) {
    console.error("Parse Error:", error);
    return INITIAL_RESUME_DATA;
  }
};