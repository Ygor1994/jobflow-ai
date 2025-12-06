
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
    premiumFeatures: {
        title: 'New & Premium Features',
        subtitle: 'Everything you need to land your dream job faster.',
        items: [
            {
                title: 'AI Headhunter',
                desc: 'Real-time job search that finds roles matching your skills and applies automatically.',
                badge: 'NEW',
                color: 'blue'
            },
            {
                title: 'Resume Audit',
                desc: 'Get an instant score (0-100) and detailed feedback to pass ATS filters.',
                badge: 'PREMIUM',
                color: 'purple'
            },
            {
                title: 'GitHub Export',
                desc: 'Turn your CV into a perfect GitHub README profile with one click.',
                badge: 'DEV',
                color: 'slate'
            },
            {
                title: 'Interview Prep',
                desc: 'AI generates custom interview questions based on the specific job description.',
                badge: 'AI',
                color: 'emerald'
            }
        ]
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
    landing: {
      nav: { 
          home: 'Home',
          features: 'Functies', 
          pricing: 'Prijzen', 
          contact: 'Contact',
          create: 'Start Nu', 
          login: 'Inloggen' 
      },
      hero: {
        badge: '#1 AI CV Maker in Europa',
        title: 'Maak Professionele CV\'s voor',
        titleHighlight: 'Benelux met AI',
        subtitle: 'Bouw CV\'s op maat voor Nederland, België, Spanje & Portugal in minuten. AI-content, lokale formaten en directe PDF-export.',
        cta: 'Bouw CV',
        update_cta: 'Update Mijn CV',
        import_cta: 'Importeer PDF',
        importing: 'PDF Lezen...',
        socialProof: 'Vertrouwd door 10.000+ werkzoekenden'
      },
      premiumFeatures: {
        title: 'Nieuwe & Premium Functies',
        subtitle: 'Alles wat je nodig hebt voor je droombaan.',
        items: [
            {
                title: 'AI Headhunter',
                desc: 'Real-time zoekopdracht die banen vindt die bij je skills passen en automatisch solliciteert.',
                badge: 'NIEUW',
                color: 'blue'
            },
            {
                title: 'CV Audit',
                desc: 'Krijg direct een score (0-100) en gedetailleerde feedback voor ATS-filters.',
                badge: 'PREMIUM',
                color: 'purple'
            },
            {
                title: 'GitHub Export',
                desc: 'Zet je CV om in een perfect GitHub README-profiel met één klik.',
                badge: 'DEV',
                color: 'slate'
            },
            {
                title: 'Interview Prep',
                desc: 'AI genereert sollicitatievragen op maat op basis van de vacature.',
                badge: 'AI',
                color: 'emerald'
            }
        ]
      },
      workflow: {
        title: 'Hoe het werkt',
        subtitle: 'Simpele stappen naar je volgende baan.',
        steps: [
          { title: '1. Gegevens Invoeren', desc: 'Vul je ervaring in of importeer je oude CV.' },
          { title: '2. AI Schrijven', desc: 'Laat AI professionele samenvattingen en bulletpoints maken.' },
          { title: '3. PDF Downloaden', desc: 'Kies een sjabloon en exporteer direct een perfecte PDF.' }
        ]
      },
      comparison: {
        title: 'Waarom JobFlow?',
        features: [
          { name: 'AI Tekstgeneratie', us: true, them: true },
          { name: 'Benelux Formaten (Foto, Geb.datum)', us: true, them: false },
          { name: 'Professionele Sjablonen', us: true, them: false },
          { name: 'Directe PDF Export', us: true, them: false },
          { name: 'Auto-Solliciteren', us: true, them: false }
        ],
        us: 'JobFlow AI',
        them: 'Anderen'
      },
      testimonials: {
        title: 'Succesverhalen',
        subtitle: 'Zie voorbeelden van succes van onze gebruikers.',
        reviews: [
            { name: "Sophie van Dijk", role: "Marketing", loc: "Amsterdam", text: "De sjablonen zijn prachtig en de PDF-export is perfect. Binnen 2 weken aangenomen!" },
            { name: "João Silva", role: "Developer", loc: "Lissabon", text: "De AI schreef mijn ervaringsgedeelte veel beter dan ik kon. Elke cent waard." },
            { name: "Elena Rodriguez", role: "Sales", loc: "Madrid", text: "Ik hou van de lokale formaten. Het ziet er precies uit zoals recruiters in Spanje verwachten." }
        ]
      },
      features: {
        templates: { title: 'Professionele Sjablonen', desc: 'Kies uit moderne, creatieve of zakelijke ontwerpen geoptimaliseerd voor ATS.' },
        export: { title: 'Export naar PDF', desc: 'Download je CV direct in hoge kwaliteit PDF.' },
        ai: { title: 'AI Content Generator', desc: 'Weet je niet wat te schrijven? Onze AI genereert samenvattingen en skills.' }
      },
      pricing: {
        title: 'Eenvoudige Prijzen',
        subtitle: 'Kies het plan dat bij je past.',
        free: {
          name: 'Gratis Start',
          price: '€0',
          period: '/ altijd',
          desc: 'Goed voor maken en bekijken.',
          features: ['Maak 1 CV', 'Basis Sjabloon', 'Alleen Web Preview', 'Handmatig Bewerken'],
          cta: 'Start Gratis'
        },
        premium: {
          tag: 'POPULAIR',
          name: 'Premium',
          price: '€9.90',
          period: '/ maand',
          desc: 'Ontgrendel volledige kracht en downloads.',
          features: ['Onbeperkte PDF Downloads', 'Alle Prof. Sjablonen', 'Geavanceerde AI Schrijver', 'AI Headhunter Toegang', 'Prioriteit Support'],
          cta: 'Start Premium',
          secure: 'Veilig betalen via Stripe.'
        }
      },
      contact: {
          title: 'Contact',
          subtitle: 'Wij zijn er om te helpen.',
          name: 'Naam',
          email: 'E-mail',
          message: 'Bericht',
          submit: 'Verstuur',
          success: 'Succesvol verzonden!'
      },
      footer: '© 2025 JobFlow AI. Geoptimaliseerd voor Benelux.',
      socials: 'Volg Ons',
      support: 'Support',
      whatsapp_message: 'Hoi, ik heb hulp nodig met JobFlow.',
      legal: { privacy: 'Privacybeleid', terms: 'Voorwaarden' },
      cookie: { text: 'Wij gebruiken cookies voor een betere ervaring.', accept: 'Accepteer' }
    },
    preview: { 
        ...enContent.preview, 
        audit: 'AI Audit', 
        auditModal: { 
            ...enContent.preview.auditModal, 
            title: 'AI CV Check', 
            analyzing: 'CV analyseren...', 
            improvements: 'Verbeterpunten', 
            strengths: 'Sterke punten',
            score: 'ATS Score',
            close: 'Sluiten'
        } 
    }
  },
  es: {
    ...enContent,
    landing: {
      nav: { 
          home: 'Inicio',
          features: 'Funciones', 
          pricing: 'Precios', 
          contact: 'Contacto',
          create: 'Empezar', 
          login: 'Entrar' 
      },
      hero: {
        badge: '#1 Creador de CV con IA en Europa',
        title: 'Crea Currículums Profesionales para',
        titleHighlight: 'Benelux con IA',
        subtitle: 'Crea CVs ganadores adaptados para Holanda, Bélgica, España y Portugal en minutos. Contenido IA, formatos locales y exportación PDF instantánea.',
        cta: 'Crear CV',
        update_cta: 'Actualizar mi CV',
        import_cta: 'Importar PDF',
        importing: 'Leyendo PDF...',
        socialProof: 'Confiado por 10,000+ candidatos'
      },
      premiumFeatures: {
        title: 'Novedades y Funciones Premium',
        subtitle: 'Todo lo que necesitas para conseguir el trabajo de tus sueños.',
        items: [
            {
                title: 'AI Headhunter',
                desc: 'Búsqueda de empleo en tiempo real que encuentra puestos y aplica automáticamente.',
                badge: 'NUEVO',
                color: 'blue'
            },
            {
                title: 'Auditoría de CV',
                desc: 'Obtén una puntuación (0-100) y feedback detallado para pasar filtros ATS.',
                badge: 'PREMIUM',
                color: 'purple'
            },
            {
                title: 'Exportar a GitHub',
                desc: 'Convierte tu CV en un perfil README de GitHub perfecto con un clic.',
                badge: 'DEV',
                color: 'slate'
            },
            {
                title: 'Prep. Entrevista',
                desc: 'La IA genera preguntas de entrevista personalizadas basadas en la vacante.',
                badge: 'IA',
                color: 'emerald'
            }
        ]
      },
      workflow: {
        title: 'Cómo Funciona',
        subtitle: 'Pasos simples para tu próximo trabajo.',
        steps: [
          { title: '1. Ingresa Detalles', desc: 'Rellena tu experiencia o importa tu viejo CV.' },
          { title: '2. Escritura IA', desc: 'Deja que la IA genere resúmenes y viñetas profesionales.' },
          { title: '3. Descargar PDF', desc: 'Elige una plantilla y exporta un PDF perfecto al instante.' }
        ]
      },
      comparison: {
        title: '¿Por qué JobFlow?',
        features: [
          { name: 'Generación de Texto IA', us: true, them: true },
          { name: 'Formatos Benelux (Foto, Fechas)', us: true, them: false },
          { name: 'Plantillas Profesionales', us: true, them: false },
          { name: 'Exportación PDF Instantánea', us: true, them: false },
          { name: 'Auto-Apply a Empleos', us: true, them: false }
        ],
        us: 'JobFlow AI',
        them: 'Otros'
      },
      testimonials: {
        title: 'Historias de Éxito',
        subtitle: 'Mira ejemplos de éxito de nuestros usuarios.',
        reviews: [
            { name: "Sophie van Dijk", role: "Marketing", loc: "Ámsterdam", text: "Las plantillas son hermosas y la exportación PDF perfecta. ¡Contratada en 2 semanas!" },
            { name: "João Silva", role: "Developer", loc: "Lisboa", text: "La IA escribió mi sección de experiencia mucho mejor que yo. Vale cada céntimo." },
            { name: "Elena Rodriguez", role: "Ventas", loc: "Madrid", text: "Me encantan los formatos locales. Se ve exactamente como esperan los reclutadores en España." }
        ]
      },
      features: {
        templates: { title: 'Plantillas Profesionales', desc: 'Elige diseños modernos, creativos o corporativos optimizados para ATS.' },
        export: { title: 'Exportar a PDF', desc: 'Descarga tu currículum en formato PDF de alta calidad al instante.' },
        ai: { title: 'Generador de Contenido IA', desc: '¿Atascado? Nuestra IA genera resúmenes y habilidades profesionales para ti.' }
      },
      pricing: {
        title: 'Precios Simples',
        subtitle: 'Elige el plan que se adapte a ti.',
        free: {
          name: 'Inicio Gratis',
          price: '€0',
          period: '/ siempre',
          desc: 'Bueno para crear y previsualizar.',
          features: ['Crear 1 Currículum', 'Acceso Plantilla Básica', 'Solo Vista Web', 'Edición Manual'],
          cta: 'Empezar Gratis'
        },
        premium: {
          tag: 'POPULAR',
          name: 'Premium',
          price: '€9.90',
          period: '/ mes',
          desc: 'Desbloquea todo el poder y descargas.',
          features: ['Descargas PDF Ilimitadas', 'Todas las Plantillas', 'Escritor IA Avanzado', 'Acceso AI Headhunter', 'Soporte Prioritario'],
          cta: 'Empezar Premium',
          secure: 'Pago seguro vía Stripe.'
        }
      },
      contact: {
          title: 'Contacto',
          subtitle: 'Estamos aquí para ayudar.',
          name: 'Nombre',
          email: 'Email',
          message: 'Mensaje',
          submit: 'Enviar',
          success: '¡Enviado con éxito!'
      },
      footer: '© 2025 JobFlow AI. Optimizado para Benelux.',
      socials: 'Síguenos',
      support: 'Soporte',
      whatsapp_message: 'Hola, necesito ayuda con JobFlow.',
      legal: { privacy: 'Política de Privacidad', terms: 'Términos' },
      cookie: { text: 'Usamos cookies para una mejor experiencia.', accept: 'Aceptar' }
    },
    preview: { 
        ...enContent.preview, 
        audit: 'Auditoría IA', 
        auditModal: { 
            ...enContent.preview.auditModal, 
            title: 'Auditoría CV', 
            analyzing: 'Analizando CV...', 
            improvements: 'Mejoras necesarias', 
            strengths: 'Puntos fuertes',
            score: 'Puntuación ATS',
            close: 'Cerrar'
        } 
    }
  },
  pt: {
    ...enContent,
    landing: {
      nav: { 
          home: 'Início',
          features: 'Funcionalidades', 
          pricing: 'Preços', 
          contact: 'Contato',
          create: 'Começar', 
          login: 'Entrar' 
      },
      hero: {
        badge: '#1 Criador de CV com IA na Europa',
        title: 'Crie Currículos Profissionais para',
        titleHighlight: 'Benelux com IA',
        subtitle: 'Construa CVs vencedores adaptados para Holanda, Bélgica, Espanha e Portugal em minutos. Conteúdo IA, formatos locais e exportação PDF instantânea.',
        cta: 'Criar Currículo',
        update_cta: 'Atualizar Meu CV',
        import_cta: 'Importar PDF',
        importing: 'Lendo PDF...',
        socialProof: 'Aprovado por 10.000+ candidatos'
      },
      premiumFeatures: {
          title: 'Novidades e Funcionalidades Premium',
          subtitle: 'Tudo o que você precisa para conseguir o emprego dos sonhos.',
          items: [
              {
                  title: 'AI Headhunter',
                  desc: 'Busca de vagas em tempo real que correspondem às suas habilidades e candidaturas automáticas.',
                  badge: 'NOVO',
                  color: 'blue'
              },
              {
                  title: 'Auditoria de CV',
                  desc: 'Receba uma nota (0-100) e feedback detalhado para passar nos filtros ATS.',
                  badge: 'PREMIUM',
                  color: 'purple'
              },
              {
                  title: 'Exportação GitHub',
                  desc: 'Transforme seu currículo em um perfil README perfeito para GitHub com um clique.',
                  badge: 'DEV',
                  color: 'slate'
              },
              {
                  title: 'Preparação Entrevista',
                  desc: 'A IA gera perguntas de entrevista personalizadas com base na descrição da vaga.',
                  badge: 'IA',
                  color: 'emerald'
              }
          ]
      },
      workflow: {
        title: 'Como Funciona',
        subtitle: 'Passos simples para seu próximo emprego.',
        steps: [
          { title: '1. Insira Detalhes', desc: 'Preencha sua experiência ou importe seu CV antigo.' },
          { title: '2. Escrita IA', desc: 'Deixe a IA gerar resumos e tópicos profissionais.' },
          { title: '3. Baixar PDF', desc: 'Escolha um modelo e exporte um PDF perfeito instantaneamente.' }
        ]
      },
      comparison: {
        title: 'Por que JobFlow?',
        features: [
          { name: 'Geração de Texto IA', us: true, them: true },
          { name: 'Formatos Benelux (Foto, Datas)', us: true, them: false },
          { name: 'Modelos Profissionais', us: true, them: false },
          { name: 'Exportação PDF Instantânea', us: true, them: false },
          { name: 'Auto-Candidatura', us: true, them: false }
        ],
        us: 'JobFlow AI',
        them: 'Outros'
      },
      testimonials: {
        title: 'Histórias de Sucesso',
        subtitle: 'Veja exemplos de sucesso de nossos usuários.',
        reviews: [
            { name: "Sophie van Dijk", role: "Marketing", loc: "Amsterdã", text: "Os modelos são lindos e a exportação PDF é perfeita. Contratada em 2 semanas!" },
            { name: "João Silva", role: "Developer", loc: "Lisboa", text: "A IA escreveu minha seção de experiência muito melhor do que eu poderia. Vale cada centavo." },
            { name: "Elena Rodriguez", role: "Vendas", loc: "Madri", text: "Adoro os formatos locais. Parece exatamente o que os recrutadores na Espanha esperam." }
        ]
      },
      features: {
        templates: { title: 'Modelos Profissionais', desc: 'Escolha designs modernos, criativos ou corporativos otimizados para ATS.' },
        export: { title: 'Exportar para PDF', desc: 'Baixe seu currículo em formato PDF de alta qualidade instantaneamente.' },
        ai: { title: 'Gerador de Conteúdo IA', desc: 'Travado no que escrever? Nossa IA gera resumos e habilidades profissionais para você.' }
      },
      pricing: {
        title: 'Preços Simples',
        subtitle: 'Escolha o plano ideal para você.',
        free: {
          name: 'Início Grátis',
          price: '€0',
          period: '/ sempre',
          desc: 'Bom para criar e visualizar.',
          features: ['Criar 1 Currículo', 'Acesso Modelo Básico', 'Apenas Visualização Web', 'Edição Manual'],
          cta: 'Começar Grátis'
        },
        premium: {
          tag: 'POPULAR',
          name: 'Premium',
          price: '€9.90',
          period: '/ mês',
          desc: 'Desbloqueie todo o poder e downloads.',
          features: ['Downloads PDF Ilimitados', 'Todos os Modelos', 'Escritor IA Avançado', 'Acesso AI Headhunter', 'Suporte Prioritário'],
          cta: 'Começar Premium',
          secure: 'Pagamento seguro via Stripe.'
        }
      },
      contact: {
          title: 'Contato',
          subtitle: 'Estamos aqui para ajudar.',
          name: 'Nome',
          email: 'Email',
          message: 'Mensagem',
          submit: 'Enviar',
          success: 'Enviado com sucesso!'
      },
      footer: '© 2025 JobFlow AI. Otimizado para Benelux.',
      socials: 'Siga-nos',
      support: 'Suporte',
      whatsapp_message: 'Olá, preciso de ajuda com o JobFlow.',
      legal: { privacy: 'Política de Privacidade', terms: 'Termos' },
      cookie: { text: 'Usamos cookies para uma melhor experiência.', accept: 'Aceitar' }
    },
    preview: { 
        ...enContent.preview, 
        audit: 'Auditoria IA', 
        auditModal: { 
            ...enContent.preview.auditModal, 
            title: 'Auditoria de CV', 
            analyzing: 'A analisar CV...', 
            improvements: 'Melhorias necessárias', 
            strengths: 'Pontos fortes',
            score: 'Pontuação ATS',
            close: 'Fechar'
        } 
    }
  }
};
