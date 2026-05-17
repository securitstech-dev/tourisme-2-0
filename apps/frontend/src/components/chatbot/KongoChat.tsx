/** Widget flottant du guide Kongo pour la vitrine publique. */
'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, MessageCircle, Minimize2, Send } from 'lucide-react';

import api from '@/lib/api';

type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
};

const initialMessages: ChatMessage[] = [
  {
    role: 'bot',
    text: 'Mbote. Je suis Kongo, votre guide pour decouvrir le Congo. Posez-moi une question sur un sejour, une region ou une activite.',
  },
];

export default function KongoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const userMessage = input.trim();

    if (!userMessage || isLoading) {
      return;
    }

    setInput('');
    setMessages((current) => [...current, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot/ask', { message: userMessage });
      const botMessage =
        typeof response.data?.response === 'string' && response.data.response.trim()
          ? response.data.response
          : 'Je n ai pas encore une reponse exploitable pour cette question.';

      setMessages((current) => [...current, { role: 'bot', text: botMessage }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'bot',
          text: 'Le service de chat n est pas encore disponible. La vitrine publique reste utilisable pendant que nous branchons le backend.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex max-w-[calc(100vw-2rem)] flex-col items-end md:bottom-8 md:right-8">
      {isOpen ? (
        <div className="mb-4 flex h-[32rem] w-[24rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[30px] border border-black/6 bg-white shadow-2xl shadow-black/10">
          <div className="flex items-center justify-between bg-[#16231d] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/12 p-2.5">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Kongo</p>
                <p className="text-xs text-white/60">Guide touristique conversationnel</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 transition hover:bg-white/14"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-background/70 px-4 py-5">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[84%] rounded-[22px] px-4 py-3 text-sm leading-7 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'border border-black/6 bg-white text-foreground'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-[22px] border border-black/6 bg-white px-4 py-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-black/6 bg-white p-4">
            <div className="flex items-center gap-3 rounded-[24px] border border-black/6 bg-background px-4 py-3">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void handleSend();
                  }
                }}
                placeholder="Demandez une idee de sejour ou une destination"
                className="w-full bg-transparent text-sm outline-none placeholder:text-subtext/55"
              />
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={!input.trim() || isLoading}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white transition hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex h-15 items-center gap-3 rounded-full bg-primary px-5 py-3 text-white shadow-2xl shadow-primary/25 transition hover:-translate-y-0.5"
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/14">
          <MessageCircle className="h-5 w-5" />
        </span>
        <span className="pr-1 text-sm font-bold">Parler avec Kongo</span>
      </button>
    </div>
  );
}
