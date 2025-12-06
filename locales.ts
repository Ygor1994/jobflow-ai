
import { LangCode } from './types';

const enContent = {
  landing: {
    nav: { 
        home: 'Home',
        features: 'Features', 
        pricing: 'Pricing', 
        contact: 'Contact',
        create: 'Start Now', 
        login: 'Login' 
    },
    hero: {
      badge: '#1 AI Resume Builder in Europe',
      title: 'Create Professional Resumes for',
      titleHighlight: 'Benelux with AI',
      subtitle: 'Build job-winning CVs tailored for the Netherlands, Belgium, Spain & Portugal in minutes. AI-generated content, local formats, and instant PDF export.',
      cta: 'Start Building',
      update_cta: 'Update My CV',
      import_cta: 'Import PDF',
      importing: 'Reading PDF...',
      socialProof: 'Trusted by 10,000+ job seekers'
    },
    workflow: {
      title: 'How It Works',
      subtitle: 'Simple steps to your next job.',
      steps: [
        { title: '1. Enter Details', desc: 'Fill in your experience or import your old CV.' },
        { title: '2. AI Writing', desc: 'Let AI generate professional summaries and bullet points.' },
        { title: '3. Download PDF', desc: 'Choose a template and export perfect PDF instantly.' }
      ]
    },
    comparison: {
      title: 'Why Choose JobFlow?',
      features: [
        { name: 'AI Text Generation', us: true, them: true },
        { name: 'Benelux Formats (Photo, DOB)', us: true, them: false },
        { name: 'Professional Templates', us: true, them: false },
        { name: 'Instant PDF Export', us: true, them: false },
        { name: 'Auto-Apply to Jobs', us: true, them: false }
      ],
      us: 'JobFlow AI',
      them: 'Others'
    },
    testimonials: {
      title: 'Success Stories',
      subtitle: 'See examples of success from our users.',
      reviews: [
          { name: "Sophie van Dijk", role: "Marketing", loc: "Amsterdam", text: "The templates are beautiful and the PDF export is perfect. Got hired in 2 weeks!" },
          { name: "João Silva", role: "Developer", loc: "Lisbon", text: "The AI wrote my experience section much better than I could. Worth every cent." },
          { name: "Elena Rodriguez", role: "Sales", loc: "Madrid", text: "I love the local formats. It looks exactly like what recruiters in Spain expect." }
      ]
    },
    features: {
      templates: { title: 'Professional Templates', desc: 'Choose from modern, creative, or corporate designs optimized for ATS systems.' },
      export: { title: 'Export to PDF', desc: 'Download your resume in high-quality PDF format instantly, ready to send to recruiters.' },
      ai: { title: 'AI Content Generator', desc: 'Stuck on what to write? Our AI generates professional summaries and skills for you.' }
    },
    pricing: {
      title: 'Simple Pricing',
      subtitle: 'Choose the plan that fits your needs.',
      free: {
        name: 'Free Starter',
        price: '€0',
        period: '/ forever',
        desc: 'Good for creating and previewing.',
        features: ['Create 1 Resume', 'Access Basic Template', 'Web Preview Only', 'Manual Editing'],
        cta: 'Start for Free'
      },
      premium: {
        tag: 'POPULAR',
        name: 'Premium',
        price: '€9.90',
        period: '/ month',
        desc: 'Unlock full power and downloads.',
        features: ['Unlimited PDF Downloads', 'All Professional Templates', 'Advanced AI Writer', 'AI Headhunter Access', 'Priority Support'],
        cta: 'Start Premium',
        secure: 'Secure payment via Stripe.'
      }
    },
    contact: {
        title: 'Contact Us',
        subtitle: 'We are here to help.',
        name: 'Name',
        email: 'Email',
        message: 'Message',
        submit: 'Send',
        success: 'Sent successfully!'
    },
    footer: '© 2025 JobFlow AI. Optimized for Benelux.',
    socials: 'Follow Us',
    support: 'Support',
    whatsapp_message: 'Hi, I need help with JobFlow.',
    legal: { privacy: 'Privacy Policy', terms: 'Terms' },
    cookie: { text: 'We use cookies for better experience.', accept: 'Accept' }
  },
  auth: {
    loginTitle: 'Welcome Back',
    registerTitle: 'Create Account',
    email: 'Email',
    password: 'Password',
    loginBtn: 'Log In',
    registerBtn: 'Sign Up',
    switchLogin: 'Login instead',
    switchRegister: 'Create account',
    google: 'Google'
  },
  builder: {
    score: {
      title: 'Resume Score',
      improve: 'Improve:',
      tip_photo: '+ Photo',
      tip_summary: '+ Summary',
      tip_exp: '+ Experience',
      tip_skills: '+ Skills',
      perfect: 'Perfect!'
    },
    nav: {
      personal: 'Personal',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      languages: 'Languages',
      courses: 'Courses',
      interests: 'Interests',
      references: 'References',
      coverLetter: 'Cover Letter',
      finish: 'Finish',
      preview: 'Preview'
    },
    personal: {
      title: 'Personal Info',
      photoLabel: 'Photo',
      photoHelp: 'Upload (Max 25MB)',
      jobTitle: 'Target Job Title',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      dob: 'Date of Birth',
      nationality: 'Nationality',
      license: 'Driving License',
      linkedin: 'Link',
      summary: 'Summary',
      aiWrite: 'AI Write'
    },
    experience: {
      title: 'Experience',
      add: 'Add Job',
      jobTitle: 'Job Title',
      company: 'Company',
      startDate: 'Start',
      endDate: 'End',
      current: 'Current',
      responsibilities: 'Description',
      aiEnhance: 'AI Enhance',
      aiWrite: 'AI Write'
    },
    education: {
      title: 'Education',
      add: 'Add School',
      school: 'School',
      degree: 'Degree',
      year: 'Year'
    },
    skills: {
      title: 'Skills',
      add: 'Add Skill',
      aiSuggest: 'AI Suggest',
      selectorTitle: 'Select Skills',
      selectorSubtitle: 'Pick skills to add.',
      addSelected: 'Add',
      cancel: 'Cancel'
    },
    languages: {
      title: 'Languages',
      add: 'Add Language'
    },
    courses: {
      title: 'Courses',
      add: 'Add Course',
      courseName: 'Name',
      institution: 'Place',
      year: 'Year'
    },
    interests: {
      title: 'Interests',
      add: 'Add Interest'
    },
    references: {
      title: 'References',
      add: 'Add Ref',
      name: 'Name',
      company: 'Company',
      phone: 'Phone',
      email: 'Email',
      empty: 'Available on request'
    },
    coverLetter: {
      title: 'Cover Letter',
      recipientDetails: 'Recipient',
      name: 'Name',
      role: 'Role',
      company: 'Company',
      address: 'Address',
      body: 'Letter Content',
      aiWrite: 'AI Write'
    },
    actions: {
      back: 'Back',
      prev: 'Prev',
      next: 'Next'
    }
  },
  preview: {
    back: 'Edit',
    mode: 'Preview',
    download: 'Download PDF',
    headhunter: 'AI Headhunter',
    audit: 'AI Audit',
    viewCv: 'CV',
    viewLetter: 'Letter',
    customize: 'Color',
    headers: {
      contact: 'Contact',
      personal: 'Personal',
      expertise: 'Skills',
      languages: 'Languages',
      interests: 'Interests',
      profile: 'Profile',
      experience: 'Experience',
      education: 'Education',
      courses: 'Courses',
      references: 'References'
    },
    labels: {
      license: 'License',
      present: 'Present',
      refRequest: 'References on request'
    },
    auditModal: {
      title: 'AI Resume Audit',
      score: 'ATS Score',
      analyzing: 'Analyzing your resume...',
      strengths: 'Strengths',
      improvements: 'Improvements Needed',
      close: 'Close'
    }
  },
  jobs: {
    title: 'Jobs',
    subtitle: 'Matching jobs found.',
    searching: 'Searching...',
    match: 'Match',
    salary: 'Salary',
    apply: 'Auto-Apply',
    applied: 'Sent',
    why: 'Why match:',
    review: 'Review',
    edit_label: 'Edit Letter',
    send: 'Send',
    cancel: 'Cancel',
    prep: 'Interview Prep',
    tailor: 'Tailor CV to Job',
    tailoring: 'Optimizing CV...',
    tailorSuccess: 'CV Optimized!',
    search: {
      label: 'Search',
      keywords: 'Keywords',
      location: 'Location',
      btn: 'Search'
    },
    interview: {
        title: 'Interview Coach',
        loading: 'Generating questions for this role...',
        question: 'Question',
        why: 'The hidden intent',
        tip: 'Winning answer tip',
        close: 'Close'
    }
  },
  payment: {
      title: 'Get Premium',
      subtitle: 'Unlock features',
      totalValue: 'Value',
      period: '/mo',
      launchOffer: 'Launch Offer',
      features: {
          headhunter: { title: 'Headhunter', desc: 'Find jobs' },
          downloads: { title: 'PDF Downloads', desc: 'Unlimited' },
          writer: { title: 'AI Writer', desc: 'Generate text' }
      },
      secure: 'Secure Payment',
      cta: 'Pay Now',
      processing: 'Processing...',
      guarantee: '30-day Guarantee',
      support: 'Help'
  },
  success: {
    title: 'Success!',
    subtitle: 'Premium Active.',
    features: ['Downloads Unlocked', 'AI Active'],
    cta: 'Start Building'
  }
};

export const content = {
  en: enContent,
  nl: {
    ...enContent,
    preview: { ...enContent.preview, audit: 'AI Audit', auditModal: { ...enContent.preview.auditModal, title: 'AI CV Check', analyzing: 'CV analyseren...', improvements: 'Verbeterpunten', strengths: 'Sterke punten' } }
  },
  es: {
    ...enContent,
    preview: { ...enContent.preview, audit: 'Auditoría IA', auditModal: { ...enContent.preview.auditModal, title: 'Auditoría CV', analyzing: 'Analizando CV...', improvements: 'Mejoras necesarias', strengths: 'Puntos fuertes' } }
  },
  pt: {
    ...enContent,
    preview: { ...enContent.preview, audit: 'Auditoria IA', auditModal: { ...enContent.preview.auditModal, title: 'Auditoria de CV', analyzing: 'A analisar CV...', improvements: 'Melhorias necessárias', strengths: 'Pontos fortes' } }
  }
};
