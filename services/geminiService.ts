
import { GoogleGenAI, Chat } from "@google/genai";
import { ResumeData, JobOpportunity, LangCode, INITIAL_RESUME_DATA, AuditResult } from "../types";

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
    
    // 1. Try to find a JSON code block with ```json
    const jsonBlock = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonBlock) return jsonBlock[1];

    // 2. Try to find a code block without language specifier
    const codeBlock = text.match(/```\n([\s\S]*?)\n```/);
    if (codeBlock) return codeBlock[1];
    
    // 3. Robust object search: Find the first '{' and the last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        return text.substring(firstBrace, lastBrace + 1);
    }
    
    // 4. Robust array search
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        return text.substring(firstBracket, lastBracket + 1);
    }

    return text;
};

// --- HELPER: NORMALIZE DATE FOR HTML INPUTS ---
// HTML <input type="date"> REQUIRES 'YYYY-MM-DD'. 
// If we have 'YYYY-MM', append '-01'. If 'YYYY', append '-01-01'.
const normalizeDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "";
    
    const cleanStr = String(dateStr).trim();
    
    // Check if it matches YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) return cleanStr;
    
    // Check if matches YYYY-MM
    if (/^\d{4}-\d{2}$/.test(cleanStr)) return `${cleanStr}-01`;
    
    // Check if matches YYYY
    if (/^\d{4}$/.test(cleanStr)) return `${cleanStr}-01-01`;

    // Try to parse typical text dates (e.g. "Jan 2020")
    // Note: Date.parse might be inconsistent, but better than nothing
    const timestamp = Date.parse(cleanStr);
    if (!isNaN(timestamp)) {
        const d = new Date(timestamp);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return "";
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

export const auditResume = async (resumeData: ResumeData, lang: LangCode): Promise<AuditResult | null> => {
    const client = getClient();
    try {
        const prompt = `Act as a senior technical recruiter for the Benelux market (Netherlands, Belgium).
        Review the following resume data:
        ${JSON.stringify(resumeData)}

        Analyze it for:
        1. Action verbs usage.
        2. Quantification of results (numbers/metrics).
        3. Clarity and brevity.
        4. Benelux standards (Directness, professional photo if present).

        Return a STRICT JSON object:
        {
            "score": 0-100 (integer),
            "summary": "A 2 sentence overview of the resume quality.",
            "strengths": ["Strength 1", "Strength 2", "Strength 3"],
            "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"]
        }
        
        Language: ${getLanguageName(lang)}.
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const text = extractJSON(response.text || "");
        return JSON.parse(text);
    } catch (e) {
        console.error("Audit failed", e);
        return null;
    }
};

export const parseResumeFromText = async (text: string): Promise<ResumeData> => {
  const client = getClient();

  try {
    // UPDATED PROMPT: Specific rules for dates and numbers to fix the user's issue
    const prompt = `Act as a Data Extraction AI. Convert the following Resume / CV text into a structured JSON object.
    
    --- START OF RESUME TEXT ---
    ${text.substring(0, 30000)}
    --- END OF RESUME TEXT ---
    
    CRITICAL EXTRACTION RULES:
    1. **Dates**: You MUST extract Start and End dates for Experience and Education. 
       - **IMPORTANT**: Output dates strictly in 'YYYY-MM-DD' format (ISO 8601).
       - If only Month/Year is available (e.g. "Jan 2020"), convert to "2020-01-01".
       - If only Year is available (e.g. "2020"), convert to "2020-01-01".
       - If the job is current (e.g., "Present", "Now", "Current"), set "endDate" to "Present" and "current" boolean to true.
       - Look for "Date of Birth" or "Born" in personal info and format as "YYYY-MM-DD".
    
    2. **Phone Numbers**: PDF text often creates spaces between digits (e.g., "+ 3 1 6 ..."). 
       - You MUST merge these into a standard format (e.g., "+31 6 12345678").
       - Look for patterns like "+31", "06", "+34" near the top.
    
    3. **Metrics/Numbers**: In the 'description' fields, preserve all numbers (e.g., "Increased sales by 20%", "Managed $50k budget"). Do not remove specific metrics.

    4. **Links**: Look for LinkedIn and website URLs.
    
    REQUIRED JSON STRUCTURE:
    {
      "personalInfo": { 
          "fullName": "Name", 
          "email": "Email", 
          "phone": "Phone (cleaned)", 
          "location": "City, Country", 
          "jobTitle": "Target Job Title or Current Role", 
          "summary": "Professional summary...",
          "dateOfBirth": "YYYY-MM-DD",
          "linkedin": "url",
          "website": "url"
      },
      "experience": [
          { 
            "title": "Role", 
            "company": "Company", 
            "startDate": "YYYY-MM-DD", 
            "endDate": "YYYY-MM-DD", 
            "current": boolean,
            "description": "Bullet points with numbers preserved..." 
          }
      ],
      "education": [
          { "school": "University", "degree": "Degree Name", "year": "YYYY" }
      ],
      "skills": [
          { "name": "Skill Name", "level": "Intermediate" }
      ],
      "languages": [
          { "language": "Language Name", "proficiency": "Fluent" }
      ]
    }`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const extractedText = extractJSON(response.text || "");
    let extracted;
    
    try {
        extracted = JSON.parse(extractedText);
    } catch (jsonError) {
        console.error("JSON Parse failed in parseResumeFromText", jsonError);
        console.log("Raw Response:", response.text);
        return INITIAL_RESUME_DATA; // Fail gracefully
    }
    
    // Safely convert potentially null fields to empty strings to avoid "Cannot read properties of null (reading 'length')"
    const safeString = (val: any) => (val === null || val === undefined) ? "" : String(val);
    const p = extracted.personalInfo || {};
    
    return {
        ...INITIAL_RESUME_DATA,
        personalInfo: {
            fullName: safeString(p.fullName),
            email: safeString(p.email),
            phone: safeString(p.phone),
            location: safeString(p.location),
            linkedin: safeString(p.linkedin),
            website: safeString(p.website),
            summary: safeString(p.summary),
            jobTitle: safeString(p.jobTitle),
            dateOfBirth: normalizeDate(p.dateOfBirth), // Normalize DoB
            nationality: safeString(p.nationality),
            drivingLicense: safeString(p.drivingLicense),
            photoUrl: safeString(p.photoUrl),
        },
        experience: Array.isArray(extracted.experience) ? extracted.experience.map((e: any) => ({
            id: Math.random().toString(36).substr(2,9),
            title: safeString(e.title),
            company: safeString(e.company),
            startDate: normalizeDate(e.startDate), // Normalize Start
            endDate: e.current || String(e.endDate).toLowerCase().includes('present') ? '' : normalizeDate(e.endDate), // Normalize End
            current: !!e.current || String(e.endDate).toLowerCase().includes('present'),
            description: safeString(e.description)
        })) : [],
        education: Array.isArray(extracted.education) ? extracted.education.map((e: any) => ({
            id: Math.random().toString(36).substr(2,9),
            school: safeString(e.school),
            degree: safeString(e.degree),
            year: safeString(e.year)
        })) : [],
        skills: Array.isArray(extracted.skills) ? extracted.skills.map((e: any) => ({
            id: Math.random().toString(36).substr(2,9),
            name: safeString(e.name),
            level: safeString(e.level) || 'Intermediate'
        })) : [],
        languages: Array.isArray(extracted.languages) ? extracted.languages.map((e: any) => ({
            id: Math.random().toString(36).substr(2,9),
            language: safeString(e.language),
            proficiency: safeString(e.proficiency) || 'Native'
        })) : [],
        courses: [], 
        interests: [],
        references: [],
        coverLetter: INITIAL_RESUME_DATA.coverLetter,
        jobMatches: [],
        meta: INITIAL_RESUME_DATA.meta
    };
  } catch (error) {
    console.error("Resume Parse Error", error);
    return INITIAL_RESUME_DATA;
  }
};

// --- NEW: CHAT ASSISTANT ---
export const createResumeChat = (resumeData: ResumeData, lang: LangCode): Chat => {
  const client = getClient();
  const context = JSON.stringify(resumeData);
  const langName = getLanguageName(lang);
  
  return client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are JobFlow AI, an expert career coach and resume writer. 
      
      CURRENT RESUME CONTEXT (JSON): 
      ${context}
      
      GOAL:
      Help the user improve their resume, answer career questions, or suggest improvements.
      
      GUIDELINES:
      - Be concise, professional, and encouraging.
      - If they ask for suggestions (e.g., "rewrite my summary"), provide specific text they can copy.
      - If they ask about gaps or missing skills, analyze the provided JSON.
      - Language: Respond in ${langName}.
      - Use Markdown for formatting (bold, lists).
      `
    }
  });
};