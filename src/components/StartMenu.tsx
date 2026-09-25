import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import {
  FileText,
  Terminal,
  Folder,
  Bot,
  Settings,
  Globe,
  Activity,
  Music,
  Search,
  Power,
  RotateCw,
  User,
  ExternalLink
} from 'lucide-react';

export const StartMenu: React.FC = () => {
  const { startMenuOpen, toggleStartMenu, openApp, vfsFiles } = useOS();
  const [searchTerm, setSearchTerm] = useState('');

  if (!startMenuOpen) return null;

  const apps = [
    { id: 'copilot', title: 'Copilot Black', icon: Bot, color: 'text-violet-400 bg-violet-500/10' },
    { id: 'explorer', title: 'File Explorer', icon: Folder, color: 'text-amber-400 bg-amber-500/10' },
    { id: 'notepad', title: 'Cyber Notepad', icon: FileText, color: 'text-cyan-400 bg-cyan-500/10' },
    { id: 'terminal', title: 'Neo-Terminal', icon: Terminal, color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'browser', title: 'Glass Browser', icon: Globe, color: 'text-indigo-400 bg-indigo-500/10' },
    { id: 'taskmanager', title: 'System Monitor', icon: Activity, color: 'text-rose-400 bg-rose-500/10' },
    { id: 'music', title: 'Ambient Synth', icon: Music, color: 'text-pink-400 bg-pink-500/10' },
    { id: 'settings', title: 'OS Settings', icon: Settings, color: 'text-blue-400 bg-blue-500/10' },
  ];

  const filteredApps = apps.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[540px] h-[580px] bg-[#0c0c10]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 flex flex-col p-6 animate-in fade-in slide-in-from-bottom-6 duration-200">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search apps, settings, or files..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:bg-white/10 transition-all"
          autoFocus
        />
      </div>

      {/* Pinned Section */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Pinned Applications</span>
          <span className="text-xs text-cyan-400 font-medium">All apps &gt;</span>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {filteredApps.map(app => {
            const IconComp = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${app.color} group-hover:scale-105 transition-transform shadow-lg`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-300 text-center truncate w-full">
                  {app.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Recommended Files */}
        <div>
          <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-3">Recommended & Recent</div>
          <div className="space-y-1.5">
            {vfsFiles.filter(f => f.type === 'file').slice(0, 3).map(file => (
              <button
                key={file.id}
                onClick={() => {
                  openApp('notepad', `${file.name} - Notepad`);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 truncate">
                  <div className="text-xs font-medium text-gray-200 group-hover:text-cyan-300 transition-colors">{file.name}</div>
                  <div className="text-[10px] text-gray-500">{file.path}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Profile & Power */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow">
            WB
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-200">Administrator</div>
            <div className="text-[10px] text-cyan-400">Windows Black OS</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Restart OS"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleStartMenu()}
            className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
            title="Lock OS"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
