import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, Loader2, ChevronDown } from 'lucide-react';
import { ResumeData, LangCode } from '../types';
import { createResumeChat } from '../services/geminiService';
import { Chat } from '@google/genai';

interface AiAssistantProps {
    resumeData: ResumeData;
    lang: LangCode;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ resumeData, lang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'model', text: 'Hi! I am your AI Career Coach. How can I help you improve your resume today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Chat instance ref to persist across renders
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Initialize chat when opened or resume data changes significantly
    useEffect(() => {
        if (isOpen && !chatRef.current) {
            try {
                chatRef.current = createResumeChat(resumeData, lang);
            } catch (e) {
                console.error("Failed to init chat", e);
            }
        }
    }, [isOpen, resumeData, lang]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Re-init chat if needed to ensure context is fresh-ish, 
            // though keeping history is usually better for conversation flow.
            // For now, we rely on the session created at open.
            if (!chatRef.current) {
                 chatRef.current = createResumeChat(resumeData, lang);
            }

            const response = await chatRef.current.sendMessage({ message: userMsg.text });
            const aiText = response.text || "I'm having trouble thinking right now. Try again?";
            
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: aiText }]);
        } catch (error) {
            console.error("Chat error", error);
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: "Connection error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = [
        "Critique my summary",
        "Improve my job descriptions",
        "What skills am I missing?",
        "Suggest a cover letter opening"
    ];

    const handleSuggestionClick = (text: string) => {
        setInput(text);
        // Optional: Auto send
        // handleSend(); 
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl shadow-blue-500/40 hover:scale-110 transition-all z-40 group animate-in slide-in-from-bottom-10"
                >
                    <Bot size={28} className="group-hover:animate-bounce" />
                    <span className="absolute right-full mr-4 bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap top-1/2 -translate-y-1/2 pointer-events-none">
                        AI Career Coach
                    </span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl z-50 flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden font-sans">
                    {/* Header */}
                    <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center relative">
                                <Bot size={20} className="text-white"/>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">JobFlow Coach</h3>
                                <p className="text-[10px] text-indigo-300 flex items-center gap-1">
                                    <Sparkles size={10}/> Powered by Gemini
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => { setMessages([]); chatRef.current = createResumeChat(resumeData, lang); }} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Reset Chat">
                                <Sparkles size={16} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <ChevronDown size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto p-4 bg-slate-50 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Bot size={14} className="text-indigo-600"/>
                                    </div>
                                )}
                                <div 
                                    className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                                        msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User size={14} className="text-slate-500"/>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 mb-4">
                                <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot size={14} className="text-indigo-600"/>
                                </div>
                                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions Area (if chat empty or just started) */}
                    {messages.length < 3 && (
                        <div className="px-4 py-2 bg-slate-50 flex gap-2 overflow-x-auto no-scrollbar">
                            {suggestions.map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => handleSuggestionClick(s)}
                                    className="whitespace-nowrap bg-white border border-indigo-100 text-indigo-600 text-xs px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                        <input 
                            type="text" 
                            className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || isLoading}
                            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};
