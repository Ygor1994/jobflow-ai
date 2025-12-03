import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, JobOpportunity, LangCode, INITIAL_RESUME_DATA } from "../types";

const getClient = () => {
  // Guidelines: API key must be obtained exclusively from process.env.API_KEY.
  // We have configured vite.config.ts to inject this value.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("API Key is missing. AI features will not work.");
  }

  return new GoogleGenAI({ apiKey: apiKey || "dummy_key_to_prevent_crash" });
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
    return "Could not generate summary. Please check your API Key.";
  }
};

export const enhanceExperience = async (title: string, rawDescription: string, lang: LangCode): Promise<string> => {
  const client = getClient();

  try {
    let prompt = '';
    if (rawDescription && rawDescription.trim().length > 10) {
        prompt = `You are a hiring manager in ${getContextByLang(lang)}. 
        Rewrite the following job description for a "${title}" role to be more professional, action-oriented, and quantified.
        Use bullet points (•) for readability. Keep it within 3-5 bullet points.
        Write exclusively in ${getLanguageName(lang)}.
        
        Raw Input: "${rawDescription}"`;
    } else {
        prompt = `You are a hiring manager in ${getContextByLang(lang)}. 
        Write a professional job description for a "${title}" role.
        Generate 3-4 impactful bullet points (•) highlighting typical key responsibilities and achievements for this role.
        Keep it concise and professional.
        Write exclusively in ${getLanguageName(lang)}.`;
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
    return "Could not generate cover letter.";
  }
};

export const findMatchingJobs = async (resumeData: ResumeData, lang: LangCode): Promise<JobOpportunity[]> => {
  const client = getClient();

  // Prepare a rich context string from experience to help AI understand seniority and niche
  const experienceContext = resumeData.experience.map(exp => 
    `Role: ${exp.title} at ${exp.company} (${exp.startDate} to ${exp.current ? 'Present' : exp.endDate}). Key Responsibilities: ${exp.description}`
  ).join('\n\n');

  try {
    const prompt = `Act as an expert Technical Recruiter and Headhunter for the ${getContextByLang(lang)} market.
    Analyze the candidate's detailed profile below and identify 5 specific, high-fit job opportunities.
    
    CANDIDATE PROFILE:
    - Target Role: ${resumeData.personalInfo.jobTitle}
    - Location Preference: ${resumeData.personalInfo.location || getContextByLang(lang)}
    - Core Skills: ${resumeData.skills.map(s => s.name).join(', ')}
    
    DETAILED WORK HISTORY (Use this to determine seniority and domain fit):
    ${experienceContext}
    
    TASK:
    Find 5 realistic, active-style job listings that match this specific experience level and skillset in ${getContextByLang(lang)}.
    Prioritize jobs that value the candidate's specific background mentioned in their history.
    
    OUTPUT FORMAT (JSON):
    Return a JSON list. For each job, provide:
    - 'title': The Job Title (in ${getLanguageName(lang)})
    - 'company': A realistic company name in the region
    - 'location': City (e.g. Amsterdam, Brussels, Madrid, Lisbon)
    - 'matchScore': An integer (0-100) based on how well the candidate's history fits the requirements.
    - 'salaryRange': Realistic annual salary range (e.g. €45k - €60k)
    - 'reason': A SPECIFIC explanation of why this fits, referencing their past experience (e.g. "Your 3 years at [Company] makes you a great fit for..."). Write this in ${getLanguageName(lang)}.
    - 'hrEmail': A simulated HR email.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              salaryRange: { type: Type.STRING },
              reason: { type: Type.STRING },
              hrEmail: { type: Type.STRING }
            },
            required: ["title", "company", "location", "matchScore", "reason", "hrEmail", "salaryRange"]
          }
        }
      }
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
    const prompt = `Act as a job search engine for the ${getContextByLang(lang)} market.
    Find 5 realistic, active job opportunities for the query "${query}" in "${location}".
    
    Return a JSON list of jobs. For each job, provide:
    - 'title': Job title
    - 'company': Company name
    - 'location': City
    - 'matchScore': Random relevant match score between 70-99
    - 'salaryRange': Estimated salary (e.g., €40k - €50k)
    - 'reason': A short sentence why this matches the query (in ${getLanguageName(lang)})
    - 'hrEmail': A simulated HR email (e.g. hr@company.com)

    Write the content in ${getLanguageName(lang)}.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              salaryRange: { type: Type.STRING },
              reason: { type: Type.STRING },
              hrEmail: { type: Type.STRING }
            },
            required: ["title", "company", "location", "matchScore", "reason", "hrEmail", "salaryRange"]
          }
        }
      }
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
    const prompt = `Write a short, persuasive email body to HR for a job application in ${getContextByLang(lang)}.
    Job: ${job.title} at ${job.company}.
    Candidate: ${resumeData.personalInfo.fullName}.
    
    Reference this specific experience from my resume to make it personalized:
    ${resumeData.experience[0]?.title} at ${resumeData.experience[0]?.company}.
    
    Key Skill: ${resumeData.skills[0]?.name || 'relevant skills'}.
    Tone: Professional and enthusiastic. Max 100 words.
    Write exclusively in ${getLanguageName(lang)}.`;

    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text || "Please find my CV attached.";
  } catch (e) {
      return "Please find my CV attached.";
  }
};

export const parseResumeFromText = async (text: string): Promise<ResumeData> => {
  const client = getClient();

  try {
    const prompt = `Extract resume data from the following raw text into a strict JSON structure matching the ResumeData interface.
    The text might be unstructured or contain artifacts from PDF conversion. Do your best to identify the sections.
    
    RAW TEXT START:
    "${text}"
    RAW TEXT END.

    TASK:
    Parse this text into the following JSON schema. 
    - Use "generate-random" for IDs.
    - If a field is missing, use empty string.
    - Try to infer dates even if they are in different formats.
    - Split complex skill lists into individual items.
    
    JSON Schema:
    {
      "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "summary": "", "jobTitle": "", "linkedin": "" },
      "experience": [{ "id": "generate-random", "title": "", "company": "", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "current": boolean, "description": "" }],
      "education": [{ "id": "generate-random", "school": "", "degree": "", "year": "" }],
      "skills": [{ "id": "generate-random", "name": "", "level": "Intermediate" }],
      "languages": [{ "id": "generate-random", "language": "", "proficiency": "Good" }]
    }
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    let extractedText = response.text || "{}";
    
    // ⚠️ CRITICAL FIX: Clean Markdown formatting ⚠️
    if (extractedText.startsWith('```json')) {
        extractedText = extractedText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (extractedText.startsWith('```')) {
        extractedText = extractedText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

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