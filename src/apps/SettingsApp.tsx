import React from 'react';
import { useOS } from '../context/OSContext';
import { Settings, Palette, Volume2, Shield, Monitor, Sparkles } from 'lucide-react';
import { AccentColor } from '../types';

export const SettingsApp: React.FC = () => {
  const { settings, updateSettings, addNotification } = useOS();

  const accents: { id: AccentColor; name: string; color: string }[] = [
    { id: 'cyan', name: 'Cyan Glow (Default)', color: 'bg-cyan-500' },
    { id: 'emerald', name: 'Emerald Neo', color: 'bg-emerald-500' },
    { id: 'violet', name: 'Cyber Violet', color: 'bg-violet-500' },
    { id: 'rose', name: 'Neon Rose', color: 'bg-rose-500' },
    { id: 'amber', name: 'Amber Gold', color: 'bg-amber-500' },
  ];

  return (
    <div className="flex h-full bg-[#0a0a0f] text-gray-200">
      {/* Sidebar */}
      <div className="w-56 bg-black/40 border-r border-white/10 p-3 space-y-1">
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">System Settings</div>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>Personalization</span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-white/5 text-gray-300">
          <Monitor className="w-4 h-4 text-violet-400" />
          <span>Display & Glass</span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-white/5 text-gray-300">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span>Sound & Audio</span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-white/5 text-gray-300">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>Security & Kernel</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-100 mb-1">Personalization</h2>
          <p className="text-xs text-gray-400">Customize your Windows Black desktop atmosphere and neon accents.</p>
        </div>

        {/* Accent Colors */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">Accent Color Theme</div>
          <div className="grid grid-cols-2 gap-3">
            {accents.map(acc => (
              <button
                key={acc.id}
                onClick={() => {
                  updateSettings({ accentColor: acc.id });
                  addNotification({ title: 'Theme Updated', message: `Accent changed to ${acc.name}`, type: 'success' });
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  settings.accentColor === acc.id
                    ? 'bg-white/10 border-cyan-500/60 shadow-lg'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${acc.color}`} />
                <span className="text-xs font-medium text-gray-200">{acc.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Taskbar Alignment */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-200 mb-0.5">Taskbar Alignment</div>
            <div className="text-[11px] text-gray-400">Choose centered Windows 11 style or left alignment.</div>
          </div>
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => updateSettings({ taskbarAligned: 'center' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                settings.taskbarAligned === 'center' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Center
            </button>
            <button
              onClick={() => updateSettings({ taskbarAligned: 'left' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                settings.taskbarAligned === 'left' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Left
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">About Windows Black</div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Version: 2.5 Pro (Build 26100.obsidian)</div>
            <div>Architecture: x64 Cybernetic Mica Compositor</div>
            <div>License: Fully Prosperous & Unlimited</div>
          </div>
        </div>
      </div>
    </div>
  );
};
