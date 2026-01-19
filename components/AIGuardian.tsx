
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { UserSettings } from '../types';

interface AIGuardianProps {
  settings: UserSettings;
  onBack: () => void;
}

const AIGuardian: React.FC<AIGuardianProps> = ({ settings, onBack }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    {role: 'model', text: "I'm with you. Start talking or typing whenever you feel uneasy. I'll maintain a conversation so it sounds like you're talking to a friend."}
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are a real-time safety companion for a woman named ${settings.name} walking home alone. 
          Your goal is to sound like a close, protective friend or sibling. 
          Keep your responses concise, supportive, and engaging. 
          If she mentions a specific threat, advise her to go to a well-lit area or store. 
          Act as if you are on a voice call with her. Use natural conversational filler words like 'Yeah', 'I hear you', 'Totally'.`,
        }
      });
      
      setMessages(prev => [...prev, {role: 'model', text: response.text || "I'm right here with you."}]);
    } catch (e) {
      setMessages(prev => [...prev, {role: 'model', text: "I'm still here, I lost connection for a second. Tell me more about your day."}]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-indigo-900 text-white">
      <header className="p-6 flex items-center gap-4 bg-indigo-950 border-b border-indigo-800">
        <button onClick={onBack} className="p-2 bg-indigo-800 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-black uppercase tracking-tighter">AI Rakshak</h2>
          <p className="text-[10px] text-indigo-400 font-bold uppercase">Simulation Active</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium ${m.role === 'user' ? 'bg-indigo-600' : 'bg-indigo-800 border border-indigo-700'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-indigo-800 p-4 rounded-3xl flex gap-1">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 bg-indigo-950">
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-indigo-900 border border-indigo-800 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Talk to me..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGuardian;