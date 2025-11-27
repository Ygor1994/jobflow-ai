import React, { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { ResumeBuilder } from './components/ResumeBuilder';
import { ResumePreview } from './components/ResumePreview';
import { PaymentModal } from './components/PaymentModal';
import { PaymentSuccess } from './components/PaymentSuccess';
import { JobMatcher } from './components/JobMatcher';
import { ResumeData, INITIAL_RESUME_DATA, AppState, LangCode } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [lang, setLang] = useState<LangCode>('en');
  const [pendingAction, setPendingAction] = useState<'download' | 'jobs' | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);

  // Auto-Load from LocalStorage on Mount
  useEffect(() => {
    const savedData = localStorage.getItem('cvforge_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge with initial to ensure structure updates don't break it
        const merged = { ...INITIAL_RESUME_DATA, ...parsed };
        setResumeData(merged);
        // Check if it's actually modified from initial
        if (JSON.stringify(merged.personalInfo) !== JSON.stringify(INITIAL_RESUME_DATA.personalInfo)) {
            setHasSavedData(true);
        }
      } catch (e) {
        console.error("Failed to load saved CV");
      }
    }
  }, []);

  // Check for Payment Success from Stripe Redirect
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment_success') === 'true') {
      setIsPaid(true);
      setShowPayment(false);
      setShowSuccess(true);
      
      // Clean the URL without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Optional: Navigate straight to builder or preview
      if (state === AppState.LANDING) {
        setState(AppState.PREVIEW);
      }
    }
  }, [state]);

  // Auto-Save to LocalStorage whenever data changes
  useEffect(() => {
    if (resumeData !== INITIAL_RESUME_DATA) {
        localStorage.setItem('cvforge_data', JSON.stringify(resumeData));
    }
  }, [resumeData]);

  const handleStart = () => {
    setState(AppState.BUILDER);
  };

  const handleImport = (importedData: ResumeData) => {
      setResumeData(importedData);
      setState(AppState.BUILDER);
  };

  const handlePreview = () => {
    setState(AppState.PREVIEW);
  };

  const handleBackToBuilder = () => {
    setState(AppState.BUILDER);
  };

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
    setShowSuccess(true);
    
    if (pendingAction === 'download') {
      setTimeout(() => {
        window.print();
      }, 500);
    } else if (pendingAction === 'jobs') {
      setState(AppState.JOBS);
    }
    
    setPendingAction(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {state === AppState.LANDING && (
        <Landing 
            onStart={handleStart} 
            onImport={handleImport}
            lang={lang} 
            setLang={setLang} 
            hasSavedData={hasSavedData}
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
