'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import api from '@/lib/api';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'Mbote ! Je suis Kongo, votre guide expert du tourisme au Congo. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot/ask', { message: userMessage });
      setChatHistory(prev => [...prev, { role: 'bot', content: response.data.response }]);
    } catch {
      setChatHistory(prev => [...prev, { role: 'bot', content: 'Désolé, j\'ai un petit souci technique. Kongo se repose un instant, réessayez plus tard !' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group relative"
      >
        {isOpen ? <X className="w-6 h-6 md:w-8 md:h-8" /> : <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary"></span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 md:bottom-20 right-0 w-[calc(100vw-32px)] sm:w-[350px] md:w-[400px] h-[70vh] md:h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-primary p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold">Kongo</h3>
              <p className="text-white/60 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span> En ligne
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-accent/10">
            {chatHistory.map((chat, i) => (
              <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  chat.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' 
                  : 'bg-white text-foreground rounded-tl-none border border-gray-100 shadow-sm'
                }`}>
                  {chat.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question à Kongo..."
                className="w-full pl-4 pr-12 py-3 bg-accent/20 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
              />
              <button
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
