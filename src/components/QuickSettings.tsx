import React from 'react';
import { useOS } from '../context/OSContext';
import {
  Wifi,
  Bluetooth,
  Moon,
  Volume2,
  VolumeX,
  Sun,
  Palette,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { AccentColor } from '../types';

export const QuickSettings: React.FC = () => {
  const { quickSettingsOpen, settings, updateSettings, openApp } = useOS();

  if (!quickSettingsOpen) return null;

  const accents: { id: AccentColor; name: string; colorClass: string }[] = [
    { id: 'cyan', name: 'Cyan Glow', colorClass: 'bg-cyan-500' },
    { id: 'emerald', name: 'Emerald Neo', colorClass: 'bg-emerald-500' },
    { id: 'violet', name: 'Cyber Violet', colorClass: 'bg-violet-500' },
    { id: 'rose', name: 'Neon Rose', colorClass: 'bg-rose-500' },
    { id: 'amber', name: 'Amber Gold', colorClass: 'bg-amber-500' },
  ];

  return (
    <div className="absolute bottom-16 right-6 w-88 bg-[#0c0c10]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 flex flex-col p-5 animate-in fade-in slide-in-from-bottom-6 duration-200">
      {/* Quick Action Tiles */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <button
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            settings.soundEnabled
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
              : 'bg-white/5 border-white/10 text-gray-400'
          }`}
        >
          {settings.soundEnabled ? <Volume2 className="w-5 h-5 mb-1.5" /> : <VolumeX className="w-5 h-5 mb-1.5" />}
          <span className="text-[11px] font-medium">Sound</span>
        </button>

        <button
          onClick={() => updateSettings({ nightLight: !settings.nightLight })}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            settings.nightLight
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-white/5 border-white/10 text-gray-400'
          }`}
        >
          {settings.nightLight ? <Sun className="w-5 h-5 mb-1.5" /> : <Moon className="w-5 h-5 mb-1.5" />}
          <span className="text-[11px] font-medium">Night Light</span>
        </button>

        <button
          onClick={() => openApp('copilot')}
          className="flex flex-col items-center justify-center p-3 rounded-xl border bg-violet-500/20 border-violet-500/50 text-violet-300 hover:bg-violet-500/30 transition-all"
        >
          <Bot className="w-5 h-5 mb-1.5" />
          <span className="text-[11px] font-medium">Copilot</span>
        </button>
      </div>

      {/* Volume Slider */}
      <div className="mb-5 bg-white/5 p-3.5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Master Volume</span>
          </div>
          <span className="text-xs text-cyan-400 font-semibold">{settings.volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.volume}
          onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
          className="w-full accent-cyan-400 bg-white/10 rounded-lg h-1.5 cursor-pointer"
        />
      </div>

      {/* Accent Color Picker */}
      <div className="mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Accent Theme</span>
        </div>
        <div className="flex items-center justify-between">
          {accents.map(acc => (
            <button
              key={acc.id}
              onClick={() => updateSettings({ accentColor: acc.id })}
              className={`w-9 h-9 rounded-full ${acc.colorClass} flex items-center justify-center transition-transform ${
                settings.accentColor === acc.id ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'
              }`}
              title={acc.name}
            />
          ))}
        </div>
      </div>

      {/* System Status info */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secured by Windows Black Kernel</span>
        </div>
        <span>v2.5 Pro</span>
      </div>
    </div>
  );
};
