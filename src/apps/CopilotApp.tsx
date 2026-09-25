import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { Bot, Send, Sparkles, User, RefreshCw } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const CopilotApp: React.FC = () => {
  const { addNotification } = useOS();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Greetings. I am Copilot Black, your advanced AI assistant embedded in the Windows Black operating system. How may I assist your workflow today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptText = customPrompt || input;
    if (!promptText.trim() || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: promptText }];
    setMessages(newMessages);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          history: messages
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...newMessages, { role: 'model', text: data.response }]);
    } catch (err: any) {
      setMessages([...newMessages, { role: 'model', text: `[Error]: ${err.message || 'Failed to connect to Gemini AI API.'}` }]);
      addNotification({
        title: 'Copilot AI Error',
        message: err.message || 'Failed to generate AI response',
        type: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Write a cyberpunk haiku',
    'Summarize my open tasks',
    'Explain React concurrency',
    'Optimize system performance'
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-gray-200">
      {/* Header */}
      <div className="h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-gray-200">Copilot Black AI</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold">
          Gemini 2.5 Flash
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              m.role === 'user' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-violet-500/20 text-violet-400'
            }`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
              m.role === 'user'
                ? 'bg-cyan-500/15 border border-cyan-500/30 text-gray-100 rounded-tr-none'
                : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none shadow'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Copilot is synthesizing response...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto shrink-0">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(undefined, qp)}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-violet-500/20 hover:border-violet-500/40 border border-white/10 text-[11px] text-gray-300 whitespace-nowrap transition-all"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => handleSend(e)} className="p-3 bg-black/40 border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot Black..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500/60"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-black font-bold transition-all shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
