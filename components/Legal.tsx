
import React from 'react';
import { LangCode } from '../types';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

interface LegalProps {
  type: 'privacy' | 'terms';
  lang: LangCode;
  onBack: () => void;
}

export const Legal: React.FC<LegalProps> = ({ type, lang, onBack }) => {
  // Simple content rendering for prototype purposes. In a real app, this would come from locales or a CMS.
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-12">
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 font-medium transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-8">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                        {type === 'privacy' ? <ShieldCheck size={32} /> : <FileText size={32} />}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            {type === 'privacy' ? 'Privacy Policy & GDPR' : 'Terms of Service'}
                        </h1>
                        <p className="text-slate-500">Effective Date: November 27, 2025</p>
                    </div>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                    {type === 'privacy' ? (
                        <>
                            <h3>1. Introduction</h3>
                            <p>JobFlow AI ("we", "our") respects your privacy. This policy explains how we handle your data in compliance with the General Data Protection Regulation (GDPR).</p>
                            
                            <h3>2. Data We Collect</h3>
                            <p>We collect data you provide directly when creating a CV, such as name, contact details, work history, and education. We also collect usage data to improve our services.</p>
                            
                            <h3>3. How We Use Your Data</h3>
                            <p>We use your data solely to generate your resume, cover letters, and provide job matching services. We do not sell your personal data to third parties.</p>
                            
                            <h3>4. AI Processing</h3>
                            <p>Parts of your anonymized data may be processed by AI models (Google Gemini) to generate content. This data is not used to train the models.</p>
                            
                            <h3>5. Your Rights (GDPR)</h3>
                            <p>You have the right to access, rectify, or erase your personal data. You can export your data at any time via the dashboard.</p>
                        </>
                    ) : (
                        <>
                            <h3>1. Acceptance of Terms</h3>
                            <p>By accessing JobFlow AI, you agree to be bound by these Terms of Service.</p>
                            
                            <h3>2. Description of Service</h3>
                            <p>JobFlow AI provides AI-powered resume building and job matching tools. Premium features require a subscription.</p>
                            
                            <h3>3. Subscription & Payments</h3>
                            <p>Subscriptions are billed monthly at €9.90. You may cancel at any time. Payments are processed securely via Stripe.</p>
                            
                            <h3>4. User Content</h3>
                            <p>You retain ownership of the content you create. You grant us a license to process this content to provide the service.</p>
                            
                            <h3>5. Limitation of Liability</h3>
                            <p>JobFlow AI is not responsible for employment outcomes. We provide tools to assist, not guarantee, hiring.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
