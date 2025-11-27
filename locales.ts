export const content = {
  en: {
    landing: {
      nav: { features: 'Features', pricing: 'Pricing', reviews: 'Reviews', create: 'Create CV' },
      hero: {
        badge: '#1 AI Resume Builder in Europe',
        title: 'Get Hired Faster in',
        titleHighlight: 'Europe',
        subtitle: 'The innovative resume builder optimized for the European job market (NL, BE, ES, PT). AI-written content, local formats, and professional design.',
        cta: 'Build Your CV',
        update_cta: 'Update My CV',
        import_cta: 'Import PDF',
        importing: 'AI is reading your resume...',
        socialProof: 'Used by 10,000+ professionals'
      },
      workflow: {
        title: 'More Than Just a PDF Generator',
        subtitle: 'JobFlow is your personal AI career agent. Here is how it works:',
        steps: [
          { title: '1. Build', desc: 'Create a Europe-optimized CV with AI assistance.' },
          { title: '2. Match', desc: 'Our AI Headhunter scans 500+ jobs to find your match.' },
          { title: '3. Apply', desc: 'Auto-generate cover letters and apply instantly.' }
        ]
      },
      comparison: {
        title: 'Why Choose JobFlow?',
        features: [
          { name: 'AI Resume Writing', us: true, them: true },
          { name: 'Local Formats (Photo, DOB)', us: true, them: false },
          { name: 'AI Headhunter (Finds Jobs)', us: true, them: false },
          { name: 'Auto-Write Cover Letters', us: true, them: false },
          { name: 'Send Application to HR', us: true, them: false }
        ],
        us: 'JobFlow AI',
        them: 'Others'
      },
      testimonials: {
        title: 'Success Stories',
        subtitle: 'See why professionals in Amsterdam, Lisbon, Madrid & Brussels choose JobFlow.',
        reviews: [
            { name: "Sophie van Dijk", role: "Marketing Manager", loc: "Utrecht, NL", text: "I applied to 20 jobs with my old CV and got 0 replies. With JobFlow, I got 3 interviews in my first week!" },
            { name: "João Silva", role: "Software Engineer", loc: "Lisbon, PT", text: "The 'Driving License' and 'Languages' sections are exactly what Portuguese recruiters look for. Got hired by a top tech firm." },
            { name: "Elena Rodriguez", role: "Sales Representative", loc: "Madrid, ES", text: "Simple, fast, and looks expensive. The AI wrote my cover letter in Spanish in seconds. Best €9.90 I ever spent." }
        ]
      },
      features: {
        ai: { title: 'Gemini 2.5 AI', desc: 'Our AI writes your summary and enhances your experience bullet points to match the job description perfectly.' },
        benelux: { title: 'Euro Standard', desc: 'Includes fields for Driving License, Languages, Date of Birth, and Photo - standard requirements in Europe.' },
        profile: { title: 'Complete Profile', desc: "Don't just list jobs. Add Courses, Certifications, References, and Hobbies to create a holistic profile." }
      },
      pricing: {
        title: 'Premium Access',
        bestValue: 'BEST VALUE',
        planName: 'Monthly Access',
        price: '€9.90',
        period: '/ month',
        desc: 'Full access for 30 days. Cancel anytime.',
        features: ['Unlimited PDF Downloads', 'Advanced AI Writer (Unlimited)', 'AI Headhunter (Auto-Apply to Jobs)', 'Edit & Update Anytime (30 Days)'],
        cta: 'Start 30-Day Access',
        secure: 'Secure payment via Stripe.'
      },
      footer: '© 2025 JobFlow AI. Optimised for NL, BE, ES & PT.',
      support: 'Support',
      whatsapp_message: 'Hi, I have a question about JobFlow Premium.'
    },
    builder: {
      score: {
        title: 'Resume Strength',
        improve: 'Improve Score:',
        tip_photo: '+ Add Photo',
        tip_summary: '+ Add Summary',
        tip_exp: '+ Add Experience',
        tip_skills: '+ Add Skills',
        perfect: 'Perfect! Ready to apply.'
      },
      nav: {
        personal: 'Personal Details',
        experience: 'Work History',
        education: 'Education',
        skills: 'Skills',
        languages: 'Languages',
        courses: 'Courses',
        interests: 'Interests',
        references: 'References',
        coverLetter: 'Cover Letter',
        finish: 'Ready to finish?',
        preview: 'Preview CV'
      },
      personal: {
        title: 'Personal Details',
        photoLabel: 'Profile Photo',
        photoHelp: 'Click upload to select an image (Max 2MB)',
        jobTitle: 'Job Title',
        fullName: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        location: 'City, Country',
        dob: 'Date of Birth',
        nationality: 'Nationality',
        license: 'Driving License',
        linkedin: 'LinkedIn / Website',
        summary: 'Professional Summary',
        aiWrite: 'AI Write'
      },
      experience: {
        title: 'Work History',
        add: 'Add Job',
        jobTitle: 'Job Title',
        company: 'Company',
        startDate: 'Start Date',
        endDate: 'End Date',
        current: 'Current',
        responsibilities: 'Responsibilities',
        aiEnhance: 'AI Enhance',
        aiWrite: 'AI Write'
      },
      education: {
        title: 'Education',
        add: 'Add Education',
        school: 'School',
        degree: 'Degree',
        year: 'Year'
      },
      skills: {
        title: 'Skills',
        add: 'Add Skill',
        aiSuggest: 'AI Suggestions',
        selectorTitle: 'AI Skill Suggestions',
        selectorSubtitle: 'Select the skills you want to add to your profile.',
        addSelected: 'Add Selected',
        cancel: 'Cancel'
      },
      languages: {
        title: 'Languages',
        add: 'Add Language'
      },
      courses: {
        title: 'Courses & Certifications',
        add: 'Add Course',
        courseName: 'Course Name',
        institution: 'Institution',
        year: 'Year'
      },
      interests: {
        title: 'Interests',
        add: 'Add Interest'
      },
      references: {
        title: 'References',
        add: 'Add Reference',
        name: 'Name',
        company: 'Company',
        phone: 'Phone',
        email: 'Email',
        empty: 'If left empty, "References available upon request" will be used.'
      },
      coverLetter: {
        title: 'Cover Letter',
        recipientDetails: 'Recipient Details',
        name: 'Hiring Manager Name',
        role: 'Recipient Role',
        company: 'Company Name',
        address: 'Company Address',
        body: 'Letter Content',
        aiWrite: 'AI Write Letter'
      },
      actions: {
        back: 'Exit Editor',
        prev: 'Previous',
        next: 'Next Step'
      }
    },
    preview: {
      back: 'Back to Editor',
      mode: 'Preview Mode • A4 Format',
      download: 'Download PDF',
      headhunter: 'AI Headhunter',
      viewCv: 'View CV',
      viewLetter: 'View Letter',
      customize: 'Color',
      headers: {
        contact: 'Contact',
        personal: 'Personal',
        expertise: 'Expertise',
        languages: 'Languages',
        interests: 'Interests',
        profile: 'Profile',
        experience: 'Experience',
        education: 'Education',
        courses: 'Courses & Certificates',
        references: 'References'
      },
      labels: {
        license: 'License',
        present: 'Present',
        refRequest: 'References available upon request.'
      }
    },
    jobs: {
      title: 'AI Headhunter',
      subtitle: 'We analyzed your CV against 500+ open roles in Europe.',
      searching: 'AI Agent is scanning open vacancies...',
      match: 'Match',
      salary: 'Est. Salary',
      apply: 'Auto-Apply',
      applied: 'Sent to HR',
      why: 'Why you match:',
      review: 'Review Application',
      edit_label: 'AI-Generated Cover Letter (Edit before sending)',
      send: 'Send Application',
      cancel: 'Cancel',
      search: {
        label: 'Search Jobs',
        keywords: 'Keywords (Job Title, Skills)',
        location: 'Location',
        btn: 'Search Jobs'
      }
    },
    payment: {
        title: 'Unlock Premium',
        subtitle: 'Get hired 3x faster with AI tools',
        totalValue: 'Total Value',
        period: '/ month',
        launchOffer: 'Launch Offer • Cancel Anytime',
        features: {
            headhunter: { title: 'AI Headhunter Access', desc: 'Auto-match & apply to jobs' },
            downloads: { title: 'Unlimited PDF Downloads', desc: 'Crea versions unlimited' },
            writer: { title: 'Gemini 2.5 AI Writer', desc: 'Rewrite summaries instantly' }
        },
        secure: 'Secure Payment via',
        cta: 'Complete Payment',
        processing: 'Processing...',
        guarantee: 'SSL Encrypted. 100% Money-Back Guarantee.',
        support: 'Need help?'
    },
    success: {
      title: 'Payment Successful!',
      subtitle: 'Welcome to JobFlow Premium.',
      features: [
        'AI Headhunter Unlocked',
        'Unlimited PDF Downloads',
        'Advanced AI Writing Tools'
      ],
      cta: 'Start Building'
    }
  },
  nl: {
    landing: {
      nav: { features: 'Kenmerken', pricing: 'Prijzen', reviews: 'Reviews', create: 'Maak CV' },
      hero: {
        badge: '#1 AI CV Maker in Benelux',
        title: 'Word Sneller Aangenomen in',
        titleHighlight: 'Europa',
        subtitle: 'De enige innovatieve CV-maker geoptimaliseerd voor de Europese arbeidsmarkt. AI-geschreven content, lokale formaten en professioneel design.',
        cta: 'Maak Je CV',
        update_cta: 'Update Mijn CV',
        import_cta: 'Importeer PDF',
        importing: 'AI leest je CV...',
        socialProof: 'Gebruikt door 10.000+ professionals'
      },
      workflow: {
        title: 'Meer Dan Alleen Een CV Maker',
        subtitle: 'JobFlow is jouw persoonlijke AI carrière-agent. Zo werkt het:',
        steps: [
          { title: '1. Bouw', desc: 'Maak een EU-geoptimaliseerd CV met AI-hulp.' },
          { title: '2. Match', desc: 'Onze AI Headhunter scant 500+ banen voor de beste match.' },
          { title: '3. Solliciteer', desc: 'Genereer automatisch sollicitatiebrieven en solliciteer direct.' }
        ]
      },
      comparison: {
        title: 'Waarom JobFlow?',
        features: [
          { name: 'AI CV Schrijven', us: true, them: true },
          { name: 'Benelux Formaat (Foto, Geb.datum)', us: true, them: false },
          { name: 'AI Headhunter (Vindt Banen)', us: true, them: false },
          { name: 'Auto-Schrijf Sollicitatiebrieven', us: true, them: false },
          { name: 'Verstuur Sollicitatie naar HR', us: true, them: false }
        ],
        us: 'JobFlow AI',
        them: 'Anderen'
      },
      testimonials: {
        title: 'Succesverhalen',
        subtitle: 'Zie waarom professionals in Amsterdam, Lissabon, Madrid en Brussel voor JobFlow kiezen.',
        reviews: [
            { name: "Sophie van Dijk", role: "Marketing Manager", loc: "Utrecht, NL", text: "Ik solliciteerde op 20 banen met mijn oude CV en kreeg 0 reacties. Met JobFlow kreeg ik 3 gesprekken in mijn eerste week!" },
            { name: "João Silva", role: "Software Engineer", loc: "Lissabon, PT", text: "De secties 'Rijbewijs' en 'Talen' zijn precies wat recruiters zoeken. Aangenomen bij een top techbedrijf." },
            { name: "Elena Rodriguez", role: "Sales Representative", loc: "Madrid, ES", text: "Simpel, snel en ziet er duur uit. De AI schreef mijn sollicitatiebrief in seconden." }
        ]
      },
      features: {
        ai: { title: 'Gemini 2.5 AI', desc: 'Onze AI schrijft je samenvatting en verbetert je ervaring bullet points om perfect aan te sluiten bij de vacature.' },
        benelux: { title: 'EU Standaard', desc: 'Bevat velden voor Rijbewijs, Talen, Geboortedatum en Foto - standaard vereisten in Europa.' },
        profile: { title: 'Compleet Profiel', desc: "Som niet alleen banen op. Voeg Cursussen, Certificaten, Referenties en Hobby's toe voor een holistisch profiel." }
      },
      pricing: {
        title: 'Premium Toegang',
        bestValue: 'BESTE WAARDE',
        planName: 'Maandelijkse Toegang',
        price: '€9.90',
        period: '/ maand',
        desc: 'Volledige toegang voor 30 dagen. Annuleer op elk moment.',
        features: ['Onbeperkte PDF Downloads', 'Geavanceerde AI Schrijver (Onbeperkt)', 'AI Headhunter (Auto-Solliciteer)', 'Bewerk & Update Altijd (30 Dagen)'],
        cta: 'Start 30 Dagen Toegang',
        secure: 'Veilig betalen via Stripe.'
      },
      footer: '© 2025 JobFlow AI. Geoptimaliseerd voor NL, BE, ES & PT.',
      support: 'Ondersteuning',
      whatsapp_message: 'Hoi, ik heb een vraag over JobFlow Premium.'
    },
    builder: {
      score: {
        title: 'CV Kracht',
        improve: 'Verbeter Score:',
        tip_photo: '+ Voeg Foto Toe',
        tip_summary: '+ Voeg Samenvatting Toe',
        tip_exp: '+ Voeg Ervaring Toe',
        tip_skills: '+ Voeg Vaardigheden Toe',
        perfect: 'Perfect! Klaar om te solliciteren.'
      },
      nav: {
        personal: 'Persoonlijke Details',
        experience: 'Werkervaring',
        education: 'Opleiding',
        skills: 'Vaardigheden',
        languages: 'Talen',
        courses: 'Cursussen',
        interests: 'Interesses',
        references: 'Referenties',
        coverLetter: 'Sollicitatiebrief',
        finish: 'Klaar om af te ronden?',
        preview: 'Bekijk CV'
      },
      personal: {
        title: 'Persoonlijke Details',
        photoLabel: 'Profielfoto',
        photoHelp: 'Klik op uploaden om een afbeelding te selecteren (Max 2MB)',
        jobTitle: 'Functietitel',
        fullName: 'Volledige Naam',
        email: 'E-mail',
        phone: 'Telefoon',
        location: 'Stad, Land',
        dob: 'Geboortedatum',
        nationality: 'Nationaliteit',
        license: 'Rijbewijs',
        linkedin: 'LinkedIn / Website',
        summary: 'Professionele Samenvatting',
        aiWrite: 'AI Schrijf'
      },
      experience: {
        title: 'Werkervaring',
        add: 'Baan Toevoegen',
        jobTitle: 'Functietitel',
        company: 'Bedrijf',
        startDate: 'Startdatum',
        endDate: 'Einddatum',
        current: 'Huidig',
        responsibilities: 'Verantwoordelijkheden',
        aiEnhance: 'AI Verbeter',
        aiWrite: 'AI Schrijf'
      },
      education: {
        title: 'Opleiding',
        add: 'Opleiding Toevoegen',
        school: 'School/Universiteit',
        degree: 'Diploma',
        year: 'Jaar'
      },
      skills: {
        title: 'Vaardigheden',
        add: 'Vaardigheid Toevoegen',
        aiSuggest: 'AI Suggesties',
        selectorTitle: 'AI Vaardigheid Suggesties',
        selectorSubtitle: 'Selecteer de vaardigheden die je wilt toevoegen.',
        addSelected: 'Voeg Geselecteerde Toe',
        cancel: 'Annuleren'
      },
      languages: {
        title: 'Talen',
        add: 'Taal Toevoegen'
      },
      courses: {
        title: 'Cursussen & Certificaten',
        add: 'Cursus Toevoegen',
        courseName: 'Cursusnaam',
        institution: 'Instituut',
        year: 'Jaar'
      },
      interests: {
        title: 'Interesses',
        add: 'Interesse Toevoegen'
      },
      references: {
        title: 'Referenties',
        add: 'Referentie Toevoegen',
        name: 'Naam',
        company: 'Bedrijf',
        phone: 'Telefoon',
        email: 'E-mail',
        empty: 'Indien leeg gelaten, wordt "Referenties op aanvraag" gebruikt.'
      },
      coverLetter: {
        title: 'Sollicitatiebrief',
        recipientDetails: 'Details Ontvanger',
        name: 'Naam Hiring Manager',
        role: 'Rol Ontvanger',
        company: 'Bedrijfsnaam',
        address: 'Bedrijfsadres',
        body: 'Inhoud Brief',
        aiWrite: 'AI Schrijf Brief'
      },
      actions: {
        back: 'Verlaat Editor',
        prev: 'Vorige',
        next: 'Volgende Stap'
      }
    },
    preview: {
      back: 'Terug naar Editor',
      mode: 'Voorbeeldmodus • A4 Formaat',
      download: 'Download PDF',
      headhunter: 'AI Headhunter',
      viewCv: 'Bekijk CV',
      viewLetter: 'Bekijk Brief',
      customize: 'Kleur',
      headers: {
        contact: 'Contact',
        personal: 'Persoonlijk',
        expertise: 'Expertise',
        languages: 'Talen',
        interests: 'Interesses',
        profile: 'Profiel',
        experience: 'Ervaring',
        education: 'Opleiding',
        courses: 'Cursussen',
        references: 'Referenties'
      },
      labels: {
        license: 'Rijbewijs',
        present: 'Heden',
        refRequest: 'Referenties op aanvraag beschikbaar.'
      }
    },
    jobs: {
      title: 'AI Headhunter',
      subtitle: 'We hebben je CV geanalyseerd tegen 500+ openstaande vacatures in Europa.',
      searching: 'AI Agent scant vacatures...',
      match: 'Match',
      salary: 'Est. Salaris',
      apply: 'Auto-Solliciteer',
      applied: 'Verzonden naar HR',
      why: 'Waarom je matcht:',
      review: 'Beoordeel Sollicitatie',
      edit_label: 'AI-Gegenereerde Sollicitatiebrief',
      send: 'Verstuur Sollicitatie',
      cancel: 'Annuleren',
      search: {
        label: 'Zoek Vacatures',
        keywords: 'Trefwoorden (Functie, Vaardigheden)',
        location: 'Locatie',
        btn: 'Zoek Vacatures'
      }
    },
    payment: {
        title: 'Ontgrendel Premium',
        subtitle: 'Word 3x sneller aangenomen met AI tools',
        totalValue: 'Totale Waarde',
        period: '/ maand',
        launchOffer: 'Lanceeraanbod • Annuleer Altijd',
        features: {
            headhunter: { title: 'AI Headhunter Toegang', desc: 'Auto-match & solliciteer op banen' },
            downloads: { title: 'Onbeperkte PDF Downloads', desc: 'Maak onbeperkte versies' },
            writer: { title: 'Gemini 2.5 AI Schrijver', desc: 'Herschrijf samenvattingen direct' }
        },
        secure: 'Veilig betalen via',
        cta: 'Voltooi Betaling',
        processing: 'Verwerken...',
        guarantee: 'SSL Versleuteld. 100% Geld-Terug Garantie.',
        support: 'Hulp nodig?'
    },
    success: {
      title: 'Betaling Geslaagd!',
      subtitle: 'Welkom bij JobFlow Premium.',
      features: [
        'AI Headhunter Ontgrendeld',
        'Onbeperkte PDF Downloads',
        'Geavanceerde AI Schrijftools'
      ],
      cta: 'Start Met Bouwen'
    }
  },
  es: {
    landing: {
      nav: { features: 'Características', pricing: 'Precios', reviews: 'Opiniones', create: 'Crear CV' },
      hero: {
        badge: '#1 Creador de CV con IA en Europa',
        title: 'Consigue Empleo Rápido en',
        titleHighlight: 'España y Portugal',
        subtitle: 'El único creador de CV optimizado para el mercado laboral de la Península Ibérica. Contenido escrito por IA, formatos locales y diseño profesional.',
        cta: 'Crea Tu CV Ahora',
        update_cta: 'Actualizar mi CV',
        import_cta: 'Importar PDF',
        importing: 'IA leyendo tu CV...',
        socialProof: 'Usado por 10.000+ profesionales'
      },
      workflow: {
        title: 'Más que un Generador de PDF',
        subtitle: 'JobFlow es tu agente de carrera personal con IA. Así funciona:',
        steps: [
          { title: '1. Construye', desc: 'Crea un CV optimizado para España/Portugal con ayuda de IA.' },
          { title: '2. Match', desc: 'Nuestro Headhunter IA escanea 500+ ofertas para ti.' },
          { title: '3. Aplica', desc: 'Genera cartas de presentación y aplica al instante.' }
        ]
      },
      comparison: {
        title: '¿Por qué elegir JobFlow?',
        features: [
          { name: 'Escritura de CV con IA', us: true, them: true },
          { name: 'Formato Local (Foto, Carné)', us: true, them: false },
          { name: 'AI Headhunter (Encuentra Empleo)', us: true, them: false },
          { name: 'Auto-Escribe Cartas de Presentación', us: true, them: false },
          { name: 'Envía Solicitud a RRHH', us: true, them: false }
        ],
        us: 'JobFlow AI',
        them: 'Otros'
      },
      testimonials: {
        title: 'Historias de Éxito',
        subtitle: 'Mira por qué profesionales en Madrid, Lisboa, Barcelona y Oporto eligen JobFlow.',
        reviews: [
            { name: "Sophie van Dijk", role: "Marketing Manager", loc: "Utrecht, NL", text: "Apliqué a 20 trabajos con mi viejo CV y obtuve 0 respuestas. ¡Con JobFlow conseguí 3 entrevistas!" },
            { name: "João Silva", role: "Ingeniero de Software", loc: "Lisboa, PT", text: "Las secciones de 'Carné de Conducir' e 'Idiomas' son exactamente lo que buscan. Contratado por una tech top." },
            { name: "Elena Rodriguez", role: "Representante de Ventas", loc: "Madrid, ES", text: "Simple, rápido y parece caro. La IA escribió mi carta en segundos. Los mejores 9,90€ invertidos." }
        ]
      },
      features: {
        ai: { title: 'Gemini 2.5 IA', desc: 'Nuestra IA escribe tu resumen y mejora tus puntos de experiencia para coincidir perfectamente con la oferta.' },
        benelux: { title: 'Estándar Ibérico', desc: 'Incluye campos para Carné de Conducir, Idiomas, Fecha de Nacimiento y Foto - requisitos estándar aquí.' },
        profile: { title: 'Perfil Completo', desc: "No solo listes trabajos. Añade Cursos, Certificaciones, Referencias y Hobbies." }
      },
      pricing: {
        title: 'Acceso Premium',
        bestValue: 'MEJOR VALOR',
        planName: 'Acceso Mensual',
        price: '€9,90',
        period: '/ mes',
        desc: 'Acceso total por 30 días. Cancela cuando quieras.',
        features: ['Descargas PDF Ilimitadas', 'Escritor IA Avanzado (Ilimitado)', 'AI Headhunter (Auto-Aplicar)', 'Edita y Actualiza (30 Días)'],
        cta: 'Iniciar Acceso 30 Días',
        secure: 'Pago seguro vía Stripe.'
      },
      footer: '© 2025 JobFlow AI. Optimizado para ES, PT, NL & BE.',
      support: 'Soporte',
      whatsapp_message: 'Hola, tengo una pregunta sobre JobFlow Premium.'
    },
    builder: {
      score: {
        title: 'Fuerza del CV',
        improve: 'Mejorar Puntuación:',
        tip_photo: '+ Añadir Foto',
        tip_summary: '+ Añadir Resumen',
        tip_exp: '+ Añadir Experiencia',
        tip_skills: '+ Añadir Habilidades',
        perfect: '¡Perfecto! Listo para aplicar.'
      },
      nav: {
        personal: 'Datos Personales',
        experience: 'Experiencia',
        education: 'Educación',
        skills: 'Habilidades',
        languages: 'Idiomas',
        courses: 'Cursos',
        interests: 'Intereses',
        references: 'Referencias',
        coverLetter: 'Carta Presentación',
        finish: '¿Listo para terminar?',
        preview: 'Ver CV'
      },
      personal: {
        title: 'Datos Personales',
        photoLabel: 'Foto de Perfil',
        photoHelp: 'Haz clic en subir para seleccionar una imagen (Máx. 2MB)',
        jobTitle: 'Título del Trabajo',
        fullName: 'Nombre Completo',
        email: 'Email',
        phone: 'Teléfono',
        location: 'Ciudad, País',
        dob: 'Fecha de Nacimiento',
        nationality: 'Nacionalidad',
        license: 'Carné de Conducir',
        linkedin: 'LinkedIn / Web',
        summary: 'Resumen Profesional',
        aiWrite: 'Escribir con IA'
      },
      experience: {
        title: 'Historial Laboral',
        add: 'Añadir Empleo',
        jobTitle: 'Puesto',
        company: 'Empresa',
        startDate: 'Fecha Inicio',
        endDate: 'Fecha Fin',
        current: 'Actual',
        responsibilities: 'Responsabilidades',
        aiEnhance: 'Mejorar con IA',
        aiWrite: 'Escribir con IA'
      },
      education: {
        title: 'Educación',
        add: 'Añadir Educación',
        school: 'Escuela/Universidad',
        degree: 'Título',
        year: 'Año'
      },
      skills: {
        title: 'Habilidades',
        add: 'Añadir Habilidad',
        aiSuggest: 'Sugerencias IA',
        selectorTitle: 'Sugerencias de IA',
        selectorSubtitle: 'Selecciona las habilidades que deseas añadir.',
        addSelected: 'Añadir Seleccionadas',
        cancel: 'Cancelar'
      },
      languages: {
        title: 'Idiomas',
        add: 'Añadir Idioma'
      },
      courses: {
        title: 'Cursos y Certificados',
        add: 'Añadir Curso',
        courseName: 'Nombre del Curso',
        institution: 'Institución',
        year: 'Año'
      },
      interests: {
        title: 'Intereses',
        add: 'Añadir Interés'
      },
      references: {
        title: 'Referencias',
        add: 'Añadir Referencia',
        name: 'Nombre',
        company: 'Empresa',
        phone: 'Teléfono',
        email: 'Email',
        empty: 'Si se deja vacío, se usará "Referencias disponibles bajo petición".'
      },
      coverLetter: {
        title: 'Carta de Presentación',
        recipientDetails: 'Detalles del Destinatario',
        name: 'Nombre Hiring Manager',
        role: 'Rol Destinatario',
        company: 'Nombre Empresa',
        address: 'Dirección Empresa',
        body: 'Contenido de la Carta',
        aiWrite: 'Escribir Carta con IA'
      },
      actions: {
        back: 'Salir Editor',
        prev: 'Anterior',
        next: 'Siguiente'
      }
    },
    preview: {
      back: 'Volver al Editor',
      mode: 'Modo Vista Previa • A4',
      download: 'Descargar PDF',
      headhunter: 'AI Headhunter',
      viewCv: 'Ver CV',
      viewLetter: 'Ver Carta',
      customize: 'Color',
      headers: {
        contact: 'Contacto',
        personal: 'Personal',
        expertise: 'Experiencia',
        languages: 'Idiomas',
        interests: 'Intereses',
        profile: 'Perfil',
        experience: 'Experiencia',
        education: 'Educación',
        courses: 'Cursos',
        references: 'Referencias'
      },
      labels: {
        license: 'Carné',
        present: 'Presente',
        refRequest: 'Referencias disponibles bajo petición.'
      }
    },
    jobs: {
      title: 'AI Headhunter',
      subtitle: 'Hemos analizado tu CV contra 500+ vacantes en Europa.',
      searching: 'Agente IA escaneando vacantes...',
      match: 'Coincidencia',
      salary: 'Salario Est.',
      apply: 'Auto-Aplicar',
      applied: 'Enviado a RRHH',
      why: 'Por qué encajas:',
      review: 'Revisar Aplicación',
      edit_label: 'Carta Generada por IA',
      send: 'Enviar Solicitud',
      cancel: 'Cancelar',
      search: {
        label: 'Buscar Empleos',
        keywords: 'Palabras clave (Puesto, Habilidades)',
        location: 'Ubicación',
        btn: 'Buscar'
      }
    },
    payment: {
        title: 'Desbloquear Premium',
        subtitle: 'Consigue empleo 3x más rápido',
        totalValue: 'Valor Total',
        period: '/ mes',
        launchOffer: 'Oferta Lanzamiento • Cancela Cuando Quieras',
        features: {
            headhunter: { title: 'Acceso AI Headhunter', desc: 'Auto-match y aplicar a empleos' },
            downloads: { title: 'Descargas PDF Ilimitadas', desc: 'Crea versiones ilimitadas' },
            writer: { title: 'Escritor Gemini 2.5 IA', desc: 'Reescribe resúmenes al instante' }
        },
        secure: 'Pago seguro vía',
        cta: 'Completar Pago',
        processing: 'Procesando...',
        guarantee: 'Encriptación SSL. Garantía de devolución.',
        support: '¿Ayuda?'
    },
    success: {
      title: '¡Pago Exitoso!',
      subtitle: 'Bienvenido a JobFlow Premium.',
      features: [
        'AI Headhunter Desbloqueado',
        'Descargas PDF Ilimitadas',
        'Herramientas de Escritura IA Avanzadas'
      ],
      cta: 'Empezar a Construir'
    }
  },
  pt: {
    landing: {
      nav: { features: 'Funcionalidades', pricing: 'Preços', reviews: 'Avaliações', create: 'Criar CV' },
      hero: {
        badge: '#1 Criador de CV com IA na Europa',
        title: 'Seja Contratado Rápido em',
        titleHighlight: 'Portugal e Espanha',
        subtitle: 'O único criador de CV otimizado para o mercado de trabalho Ibérico. Conteúdo escrito por IA, formatos locais e design profissional.',
        cta: 'Criar Meu CV',
        update_cta: 'Atualizar Meu CV',
        import_cta: 'Importar PDF',
        importing: 'A IA está a ler o seu CV...',
        socialProof: 'Usado por 10.000+ profissionais'
      },
      workflow: {
        title: 'Mais que um Gerador de PDF',
        subtitle: 'JobFlow é o seu agente de carreira pessoal com IA. Como funciona:',
        steps: [
          { title: '1. Construa', desc: 'Crie um CV otimizado para PT/ES com ajuda da IA.' },
          { title: '2. Match', desc: 'Nosso Headhunter IA escaneia 500+ vagas para você.' },
          { title: '3. Aplique', desc: 'Gere cartas de apresentação e aplique instantaneamente.' }
        ]
      },
      comparison: {
        title: 'Por que escolher JobFlow?',
        features: [
          { name: 'Escrita de CV com IA', us: true, them: true },
          { name: 'Formato Local (Foto, Carta)', us: true, them: false },
          { name: 'AI Headhunter (Encontra Vagas)', us: true, them: false },
          { name: 'Auto-Escreve Cartas de Apresentação', us: true, them: false },
          { name: 'Envia Candidatura para RH', us: true, them: false }
        ],
        us: 'JobFlow AI',
        them: 'Outros'
      },
      testimonials: {
        title: 'Histórias de Sucesso',
        subtitle: 'Veja por que profissionais em Lisboa, Porto, Madrid e Amsterdã escolhem o JobFlow.',
        reviews: [
            { name: "Sophie van Dijk", role: "Marketing Manager", loc: "Utrecht, NL", text: "Apliquei para 20 vagas com meu CV antigo e tive 0 respostas. Com JobFlow consegui 3 entrevistas!" },
            { name: "João Silva", role: "Engenheiro de Software", loc: "Lisboa, PT", text: "As seções de 'Carta de Condução' e 'Línguas' são exatamente o que procuram. Contratado por uma tech top." },
            { name: "Elena Rodriguez", role: "Representante de Vendas", loc: "Madrid, ES", text: "Simples, rápido e parece caro. A IA escreveu minha carta em segundos. Os melhores 9,90€ investidos." }
        ]
      },
      features: {
        ai: { title: 'Gemini 2.5 IA', desc: 'Nossa IA escreve seu resumo e melhora seus pontos de experiência para corresponder perfeitamente à vaga.' },
        benelux: { title: 'Padrão Ibérico', desc: 'Inclui campos para Carta de Condução, Línguas, Data de Nascimento e Foto - requisitos padrão aqui.' },
        profile: { title: 'Perfil Completo', desc: "Não liste apenas empregos. Adicione Cursos, Certificaciones, Referências e Hobbies." }
      },
      pricing: {
        title: 'Acesso Premium',
        bestValue: 'MELHOR VALOR',
        planName: 'Acesso Mensual',
        price: '€9,90',
        period: '/ mês',
        desc: 'Acesso total por 30 dias. Cancele quando quiser.',
        features: ['Downloads PDF Ilimitados', 'Escritor IA Avançado (Ilimitado)', 'AI Headhunter (Auto-Aplicar)', 'Edite e Atualize (30 Dias)'],
        cta: 'Iniciar Acesso 30 Dias',
        secure: 'Pagamento seguro via Stripe.'
      },
      footer: '© 2025 JobFlow AI. Otimizado para PT, ES, NL & BE.',
      support: 'Suporte',
      whatsapp_message: 'Olá, tenho uma dúvida sobre o JobFlow Premium.'
    },
    builder: {
      score: {
        title: 'Força do CV',
        improve: 'Melhorar Pontuação:',
        tip_photo: '+ Adicionar Foto',
        tip_summary: '+ Adicionar Resumo',
        tip_exp: '+ Adicionar Experiência',
        tip_skills: '+ Adicionar Competências',
        perfect: 'Perfeito! Pronto para aplicar.'
      },
      nav: {
        personal: 'Dados Pessoais',
        experience: 'Experiência',
        education: 'Educação',
        skills: 'Competências',
        languages: 'Línguas',
        courses: 'Cursos',
        interests: 'Interesses',
        references: 'Referências',
        coverLetter: 'Carta Apresentação',
        finish: 'Pronto para finalizar?',
        preview: 'Ver CV'
      },
      personal: {
        title: 'Dados Pessoais',
        photoLabel: 'Foto de Perfil',
        photoHelp: 'Clique em carregar para selecionar uma imagem (Max 2MB)',
        jobTitle: 'Título Profissional',
        fullName: 'Nome Completo',
        email: 'Email',
        phone: 'Telefone',
        location: 'Cidade, País',
        dob: 'Data de Nascimento',
        nationality: 'Nacionalidade',
        license: 'Carta de Condução',
        linkedin: 'LinkedIn / Site',
        summary: 'Resumo Profissional',
        aiWrite: 'Escrever com IA'
      },
      experience: {
        title: 'Histórico Profissional',
        add: 'Adicionar Emprego',
        jobTitle: 'Cargo',
        company: 'Empresa',
        startDate: 'Data Início',
        endDate: 'Data Fim',
        current: 'Atual',
        responsibilities: 'Responsabilidades',
        aiEnhance: 'Melhorar com IA',
        aiWrite: 'Escrever com IA'
      },
      education: {
        title: 'Educação',
        add: 'Adicionar Educação',
        school: 'Escola/Universidade',
        degree: 'Grau/Diploma',
        year: 'Ano'
      },
      skills: {
        title: 'Competências',
        add: 'Adicionar Competência',
        aiSuggest: 'Sugestões IA',
        selectorTitle: 'Sugestões de Competências IA',
        selectorSubtitle: 'Selecione as competências que deseja adicionar.',
        addSelected: 'Adicionar Selecionadas',
        cancel: 'Cancelar'
      },
      languages: {
        title: 'Línguas',
        add: 'Adicionar Língua'
      },
      courses: {
        title: 'Cursos e Certificados',
        add: 'Adicionar Curso',
        courseName: 'Nome do Curso',
        institution: 'Instituição',
        year: 'Ano'
      },
      interests: {
        title: 'Interesses',
        add: 'Adicionar Interesse'
      },
      references: {
        title: 'Referências',
        add: 'Adicionar Referência',
        name: 'Nome',
        company: 'Empresa',
        phone: 'Telefone',
        email: 'Email',
        empty: 'Se deixado em branco, será usado "Referências disponíveis mediante solicitação".'
      },
      coverLetter: {
        title: 'Carta de Apresentação',
        recipientDetails: 'Detalhes do Destinatário',
        name: 'Nome Hiring Manager',
        role: 'Cargo Destinatário',
        company: 'Nome Empresa',
        address: 'Morada Empresa',
        body: 'Conteúdo da Carta',
        aiWrite: 'Escrever Carta com IA'
      },
      actions: {
        back: 'Sair Editor',
        prev: 'Anterior',
        next: 'Próximo Passo'
      }
    },
    preview: {
      back: 'Voltar ao Editor',
      mode: 'Modo Pré-visualização • A4',
      download: 'Baixar PDF',
      headhunter: 'AI Headhunter',
      viewCv: 'Ver CV',
      viewLetter: 'Ver Carta',
      customize: 'Cor',
      headers: {
        contact: 'Contacto',
        personal: 'Pessoal',
        expertise: 'Experiência',
        languages: 'Línguas',
        interests: 'Interesses',
        profile: 'Perfil',
        experience: 'Experiencia',
        education: 'Educação',
        courses: 'Cursos',
        references: 'Referências'
      },
      labels: {
        license: 'Carta',
        present: 'Presente',
        refRequest: 'Referências disponíveis mediante solicitação.'
      }
    },
    jobs: {
      title: 'AI Headhunter',
      subtitle: 'Analisámos o seu CV contra 500+ vagas na Europa.',
      searching: 'Agente IA a procurar vagas...',
      match: 'Match',
      salary: 'Salário Est.',
      apply: 'Auto-Aplicar',
      applied: 'Enviado para RH',
      why: 'Por que você encaixa:',
      review: 'Rever Candidatura',
      edit_label: 'Carta Gerada por IA',
      send: 'Enviar Candidatura',
      cancel: 'Cancelar',
      search: {
        label: 'Procurar Empregos',
        keywords: 'Palavras-chave (Cargo, Competências)',
        location: 'Localização',
        btn: 'Procurar'
      }
    },
    payment: {
        title: 'Desbloquear Premium',
        subtitle: 'Seja contratado 3x mais rápido',
        totalValue: 'Valor Total',
        period: '/ mês',
        launchOffer: 'Oferta Lançamento • Cancele Quando Quiser',
        features: {
            headhunter: { title: 'Acesso AI Headhunter', desc: 'Auto-match e aplicar a empregos' },
            downloads: { title: 'Downloads PDF Ilimitados', desc: 'Crie versões ilimitadas' },
            writer: { title: 'Escritor Gemini 2.5 IA', desc: 'Reescreva resumos instantaneamente' }
        },
        secure: 'Pagamento seguro via',
        cta: 'Concluir Pagamento',
        processing: 'A processar...',
        guarantee: 'Encriptação SSL. Garantia de devolução.',
        support: 'Precisa de ajuda?'
    },
    success: {
      title: 'Pagamento Com Sucesso!',
      subtitle: 'Bem-vindo ao JobFlow Premium.',
      features: [
        'AI Headhunter Desbloqueado',
        'Downloads PDF Ilimitados',
        'Ferramentas de Escrita IA Avançadas'
      ],
      cta: 'Começar a Construir'
    }
  }
};