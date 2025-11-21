import React, { useState, useRef, useEffect } from 'react';
import { ResumeFile } from '../types';
import { Button } from './Button';
import { createChatSession } from '../services/geminiService';
import { Chat, GenerateContentResponse } from '@google/genai';

interface ChatAssistantProps {
  jobDescription: string;
  files: ResumeFile[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ jobDescription, files }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your HR AI Assistant. I have reviewed the resumes and job description. Ask me anything about the candidates!', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const processedFiles = files.filter(f => f.status === 'done' && f.result);
  const hasData = jobDescription && processedFiles.length > 0;

  useEffect(() => {
    if (hasData && !chatSessionRef.current) {
      const results = processedFiles.map(f => f.result!);
      chatSessionRef.current = createChatSession(jobDescription, results);
    }
  }, [hasData, jobDescription, processedFiles]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !chatSessionRef.current) return;

    const userMsg: Message = { role: 'user', text: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = '';
      const modelMsgIndex = messages.length + 1; // Index for the new model message

      // Initialize empty model message
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

      for await (const chunk of response) {
          const c = chunk as GenerateContentResponse;
          const text = c.text || '';
          fullText += text;
          
          // Update the last message with streamed content
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], text: fullText };
            return newMsgs;
          });
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-2xl font-bold text-[#3C3C3C] mb-2">Assistant Not Ready</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Please upload resumes and a job description in the "Resume Matcher" tab to initialize the AI Assistant with data.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-lg shadow-md border-t-4 border-[#B9A121] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-bold text-[#3C3C3C] flex items-center gap-2">
          <span className="text-2xl">🤖</span> Candidate Intelligence Chat
        </h2>
        <p className="text-xs text-gray-500">Ask about specific skills, comparisons, or interview recommendations.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#B9A121] text-white rounded-br-none' 
                  : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <span className={`text-[10px] block mt-1 opacity-70 ${msg.role === 'user' ? 'text-white' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ex: Who is the best fit for a leadership role?"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B9A121] text-sm"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()} 
            className="rounded-full w-12 h-10 flex items-center justify-center !px-0"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="text-lg">➤</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};