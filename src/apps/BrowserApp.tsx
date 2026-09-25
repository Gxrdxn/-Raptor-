import React, { useState } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, Shield, Star, Lock } from 'lucide-react';

export const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [inputUrl, setInputUrl] = useState('https://www.google.com');

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    setUrl(inputUrl);
  };

  return (
    <div className="flex flex-col h-full bg-[#07070a] text-gray-200">
      {/* Browser Navigation Toolbar */}
      <div className="h-12 bg-white/5 border-b border-white/10 flex items-center gap-3 px-4">
        <div className="flex items-center gap-1 text-gray-400">
          <button className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors" title="Back">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors" title="Forward">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors" title="Reload">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 gap-2 focus-within:border-cyan-500 transition-all">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-100 focus:outline-none font-mono"
          />
          <Star className="w-3.5 h-3.5 text-gray-400 hover:text-amber-400 cursor-pointer transition-colors" />
        </form>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 bg-[#0c0c12] overflow-y-auto p-8 flex flex-col items-center justify-center">
        {url.includes('google') ? (
          <div className="w-full max-w-lg flex flex-col items-center">
            <div className="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mb-8">
              WINDOWS<span className="text-white">BLACK</span>
            </div>
            <div className="w-full relative mb-6">
              <input
                type="text"
                placeholder="Search the web or type a URL..."
                className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 shadow-xl"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setUrl('https://github.com')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium">
                GitHub
              </button>
              <button onClick={() => setUrl('https://wikipedia.org')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium">
                Wikipedia
              </button>
              <button onClick={() => setUrl('https://ai.studio')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium">
                AI Studio
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <Globe className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-lg font-bold text-gray-100 mb-2">Simulated Browser View</h2>
            <p className="text-xs text-gray-400 mb-6">You navigated to <span className="text-cyan-400 font-mono">{url}</span> inside the Windows Black glass container.</p>
            <button
              onClick={() => { setUrl('https://www.google.com'); setInputUrl('https://www.google.com'); }}
              className="px-4 py-2 bg-cyan-500 text-black font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
