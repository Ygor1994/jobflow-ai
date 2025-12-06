
export type LangCode = 'en' | 'nl' | 'es' | 'pt';

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert' | 'Master';
}

export interface Language {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Good' | 'Basic';
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  year: string;
}

export interface Interest {
  id: string;
  name: string;
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    summary: string;
    jobTitle: string;
    dateOfBirth: string;
    nationality: string;
    drivingLicense: string;
    photoUrl: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  courses: Course[];
  interests: Interest[];
  references: Reference[];
  coverLetter: {
    recipientName: string;
    recipientTitle: string;
    companyName: string;
    companyAddress: string;
    body: string;
  };
  jobMatches: JobOpportunity[]; // Added for persistence
  meta: {
    accentColor: string;
    template: 'modern' | 'professional' | 'elegant' | 'creative' | 'minimal';
  };
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  salaryRange: string;
  reason: string;
  hrEmail: string;
  url?: string;
  applied?: boolean; // Track application status
}

export const INITIAL_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
    jobTitle: '',
    dateOfBirth: '',
    nationality: '',
    drivingLicense: '',
    photoUrl: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  courses: [],
  interests: [],
  references: [],
  coverLetter: {
    recipientName: '',
    recipientTitle: '',
    companyName: '',
    companyAddress: '',
    body: '',
  },
  jobMatches: [],
  meta: {
    accentColor: '#2563eb', // Default Blue
    template: 'modern'
  }
};

export enum AppState {
  LANDING = 'LANDING',
  BUILDER = 'BUILDER',
  PREVIEW = 'PREVIEW',
  JOBS = 'JOBS',
  AUTH = 'AUTH',
  LEGAL = 'LEGAL'
}