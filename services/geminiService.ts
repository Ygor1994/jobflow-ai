import { GoogleGenAI } from "@google/genai";
import { ResumeData, JobOpportunity, LangCode, INITIAL_RESUME_DATA } from "../types";

const getClient = () => {
  // Fixed: Use process.env.API_KEY exclusively as per guidelines.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
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

// Helper to extract JSON from markdown or conversational text
const extractJSON = (text: string): string => {
    if (!text) return "[]";
    
    // 1. Try to find a JSON code block
    const codeBlockMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
        return codeBlockMatch[1];
    }
    
    // 2. Try to find an array pattern [...]
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
        return arrayMatch[0];
    }
    
    // 3. Try to find an object pattern {...}
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
        return objectMatch[0];
    }

    return text;
};

export const generateSummary = async (jobTitle: string, experienceStr: string, lang: LangCode): Promise<string> => {
  const client = getClient();
  try {
    const prompt = `Write a professional resume summary for a "${jobTitle}" in ${getLanguageName(lang)}. Highlights: "${experienceStr}". Max 4 sentences.`;
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    return "";
  }
};

export const enhanceExperience = async (title: string, rawDescription: string, lang: LangCode): Promise<string> => {
  const client = getClient();
  try {
    let prompt = `Rewrite this job description for a "${title}" to be professional and action-oriented in ${getLanguageName(lang)}. Use bullet points. Input: "${rawDescription}"`;
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || rawDescription;
  } catch (error) {
    return rawDescription;
  }
};

export const suggestSkills = async (jobTitle: string, lang: LangCode): Promise<string[]> => {
  const client = getClient();
  try {
    const prompt = `List 8 top technical skills for a "${jobTitle}". Return ONLY comma-separated list in ${getLanguageName(lang)}.`;
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const text = response.text || "";
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    return [];
  }
};

export const generateCoverLetter = async (resumeData: ResumeData, lang: LangCode): Promise<string> => {
  const client = getClient();
  try {
    const prompt = `Write a cover letter body in ${getLanguageName(lang)} for ${resumeData.personalInfo.jobTitle}. 
    Candidate: ${resumeData.personalInfo.fullName}. 
    Company: ${resumeData.coverLetter.companyName}.
    Summary: ${resumeData.personalInfo.summary}.
    Tone: Professional.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    return "";
  }
};

// --- UPDATED: REAL JOB SEARCH WITH GOOGLE GROUNDING ---
export const findMatchingJobs = async (resumeData: ResumeData, lang: LangCode): Promise<JobOpportunity[]> => {
  const client = getClient();

  const targetRole = resumeData.personalInfo.jobTitle || "Professional";
  const location = resumeData.personalInfo.location || getContextByLang(lang);
  const skills = resumeData.skills.map(s => s.name).join(', ');

  try {
    // Use Google Search Tool to find REAL jobs
    // PROMPT OPTIMIZED FOR REAL URLS
    const prompt = `Using Google Search, find 5 REAL, ACTIVE job listings for a "${targetRole}" in "${location}".
    Candidate Skills: ${skills}.
    
    CRITICAL: You MUST find the direct application URL (LinkedIn, Indeed, Glassdoor, or Company Career Page).
    
    Return a JSON list. For each job, provide:
    - title
    - company
    - location
    - salaryRange (estimate if not found)
    - matchScore (0-100 based on fit)
    - reason (1 short sentence why it fits)
    - hrEmail (guess standard format like careers@company.com if not found)
    - url (The direct link to the job posting found in search)
    
    Write content in ${getLanguageName(lang)}.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { 
          // responseMimeType: "application/json", // Prohibited with googleSearch
          tools: [{googleSearch: {}}] // ENABLE REAL SEARCH
      }
    });

    const text = extractJSON(response.text || "");

    // Attempt to parse JSON.
    try {
        const jobs = JSON.parse(text);
        return Array.isArray(jobs) ? jobs.map((j: any) => ({ ...j, id: Math.random().toString(36).substr(2, 9) })) : [];
    } catch (e) {
        console.warn("JSON Parse failed, returning empty list or falling back", text);
        return searchJobs(targetRole, location, lang);
    }

  } catch (error) {
    console.error("Gemini Job Match Error:", error);
    // Fallback to hallucination if search fails
    return searchJobs(targetRole, location, lang); 
  }
};

export const searchJobs = async (query: string, location: string, lang: LangCode): Promise<JobOpportunity[]> => {
  const client = getClient();

  try {
    const prompt = `Find 5 REAL job listings for "${query}" in "${location}".
    Use Google Search to find active URLs.
    Return JSON: title, company, location, matchScore, salaryRange, reason, hrEmail, url.
    Language: ${getLanguageName(lang)}.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { 
          // responseMimeType: "application/json", // Prohibited with googleSearch
          tools: [{googleSearch: {}}] 
      }
    });

    const text = extractJSON(response.text || "");
    const jobs = JSON.parse(text);
    return Array.isArray(jobs) ? jobs.map((j: any) => ({ ...j, id: Math.random().toString(36).substr(2, 9) })) : [];
  } catch (error) {
    console.error("Gemini Job Search Error:", error);
    return [];
  }
};

export const draftCoverLetter = async (job: JobOpportunity, resumeData: ResumeData, lang: LangCode): Promise<string> => {
  const client = getClient();
  try {
    const prompt = `Write a short application email for ${job.title} at ${job.company}.
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

export const generateInterviewPrep = async (title: string, company: string, lang: LangCode): Promise<any[]> => {
  const client = getClient();
  try {
    const prompt = `You are an expert interview coach. Generate 3 likely interview questions for a "${title}" role at "${company}".
    Language: ${getLanguageName(lang)}.
    Return STRICT JSON array with objects containing:
    - question (The question text)
    - whyItIsAsked (The hidden intent behind the question, max 1 sentence)
    - answerTip (A specific tip on how to answer using the STAR method, max 2 sentences)
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = extractJSON(response.text || "");
    return JSON.parse(text);
  } catch (e) {
    return [];
  }
};

// --- NEW: RESUME TAILORING ---
export const tailorResume = async (resumeData: ResumeData, jobTitle: string, company: string, lang: LangCode): Promise<{summary: string, skills: {name: string, level: string}[]}> => {
  const client = getClient();
  try {
    const currentSkills = resumeData.skills.map(s => s.name).join(", ");
    const prompt = `You are an expert ATS Optimization specialist.
    I want to apply for the role of "${jobTitle}" at "${company}".
    
    Current Summary: "${resumeData.personalInfo.summary}"
    Current Skills: "${currentSkills}"
    
    Task:
    1. Rewrite the summary to be highly relevant to this specific role and company (max 4 sentences).
    2. Suggest 6 key hard skills that this role likely requires (mix of current skills + 2-3 new relevant keywords).
    3. For each skill, infer the required proficiency level (Beginner, Intermediate, Expert, Master) based on the job requirements.
    
    Language: ${getLanguageName(lang)}.
    
    Return STRICT JSON:
    {
       "summary": "Rewritten summary...",
       "skills": [
          {"name": "Skill 1", "level": "Expert"},
          {"name": "Skill 2", "level": "Intermediate"}
       ]
    }
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = extractJSON(response.text || "");
    return JSON.parse(text);
  } catch (e) {
    // Return original data on failure to prevent data loss
    return { summary: resumeData.personalInfo.summary, skills: [] };
  }
};

export const parseResumeFromText = async (text: string): Promise<ResumeData> => {
  const client = getClient();

  try {
    const prompt = `Extract resume data from text to JSON.
    TEXT: "${text.substring(0, 30000)}"
    SCHEMA: Standard ResumeData schema.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const extractedText = extractJSON(response.text || "");
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
    return INITIAL_RESUME_DATA;
  }
};