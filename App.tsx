
import React, { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { ResumeBuilder } from './components/ResumeBuilder';
import { ResumePreview } from './components/ResumePreview';
import { PaymentModal } from './components/PaymentModal';
import { PaymentSuccess } from './components/PaymentSuccess';
import { JobMatcher } from './components/JobMatcher';
import { Auth } from './components/Auth';
import { Legal } from './components/Legal';
import { ResumeData, INITIAL_RESUME_DATA, AppState, LangCode } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [legalType, setLegalType] = useState<'privacy' | 'terms'>('privacy');
  
  // Initialize Premium status
  const [isPaid, setIsPaid] = useState<boolean>(() => {
    return localStorage.getItem('jobflow_is_paid') === 'true';
  });

  const [lang, setLang] = useState<LangCode>('en');
  const [pendingAction, setPendingAction] = useState<'download' | 'jobs' | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);

  // Auto-Load from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem('cvforge_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const merged = { ...INITIAL_RESUME_DATA, ...parsed };
        setResumeData(merged);
        if (JSON.stringify(merged.personalInfo) !== JSON.stringify(INITIAL_RESUME_DATA.personalInfo)) {
            setHasSavedData(true);
        }
      } catch (e) {
        console.error("Failed to load saved CV");
      }
    }
  }, []);

  // Check for Payment Success
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment_success') === 'true') {
      setIsPaid(true);
      localStorage.setItem('jobflow_is_paid', 'true');
      setShowPayment(false);
      setShowSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      if (state === AppState.LANDING) {
        setState(AppState.PREVIEW);
      }
    }
  }, [state]);

  // Auto-Save
  useEffect(() => {
    if (resumeData !== INITIAL_RESUME_DATA) {
        localStorage.setItem('cvforge_data', JSON.stringify(resumeData));
    }
  }, [resumeData]);

  const handleStart = () => setState(AppState.BUILDER);
  const handleImport = (importedData: ResumeData) => {
      setResumeData(importedData);
      setState(AppState.BUILDER);
  };
  const handlePreview = () => setState(AppState.PREVIEW);
  const handleBackToBuilder = () => setState(AppState.BUILDER);
  
  const handleDownloadClick = () => {
    if (isPaid) {
      window.print();
    } else {
      setPendingAction('download');
      setShowPayment(true);
    }
  };

  const handleHeadhunterClick = () => {
    if (isPaid) {
      setState(AppState.JOBS);
    } else {
      setPendingAction('jobs');
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsPaid(true);
    localStorage.setItem('jobflow_is_paid', 'true');
    setShowSuccess(true);
    if (pendingAction === 'download') {
      setTimeout(() => window.print(), 500);
    } else if (pendingAction === 'jobs') {
      setState(AppState.JOBS);
    }
    setPendingAction(null);
  };

  // Auth & Legal Handlers
  const handleLoginClick = () => setState(AppState.AUTH);
  const handleLegalClick = (type: 'privacy' | 'terms') => {
      setLegalType(type);
      setState(AppState.LEGAL);
  };
  const handleLoginSuccess = () => setState(AppState.BUILDER);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {state === AppState.LANDING && (
        <Landing 
            onStart={handleStart} 
            onLogin={handleLoginClick}
            onLegal={handleLegalClick}
            onImport={handleImport}
            lang={lang} 
            setLang={setLang} 
            hasSavedData={hasSavedData}
        />
      )}

      {state === AppState.AUTH && (
          <Auth 
            lang={lang} 
            onLogin={handleLoginSuccess}
            onBack={() => setState(AppState.LANDING)}
          />
      )}

      {state === AppState.LEGAL && (
          <Legal 
            type={legalType}
            lang={lang}
            onBack={() => setState(AppState.LANDING)}
          />
      )}

      {state === AppState.BUILDER && (
        <div className="py-10 px-4 bg-slate-100 min-h-screen">
          <ResumeBuilder 
            data={resumeData} 
            onChange={setResumeData} 
            onNext={handlePreview}
            onBack={() => setState(AppState.LANDING)}
            lang={lang}
            isPaid={isPaid}
          />
        </div>
      )}

      {state === AppState.PREVIEW && (
        <ResumePreview 
          data={resumeData} 
          onEdit={handleBackToBuilder}
          onDownload={handleDownloadClick}
          onHeadhunter={handleHeadhunterClick}
          lang={lang}
        />
      )}

      {state === AppState.JOBS && (
        <JobMatcher 
           resumeData={resumeData} 
           onUpdateData={setResumeData}
           lang={lang} 
           onBack={() => setState(AppState.PREVIEW)} 
        />
      )}

      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        lang={lang}
      />

      <PaymentSuccess
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        lang={lang}
      />

    </div>
  );
};

export default App;