import React, { useState, useEffect } from 'react';
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
  Wifi,
  Volume2,
  Bell,
  Battery
} from 'lucide-react';
import { StartMenu } from './StartMenu';
import { QuickSettings } from './QuickSettings';
import { NotificationCenter } from './NotificationCenter';

export const Taskbar: React.FC = () => {
  const {
    windows,
    activeWindowId,
    openApp,
    focusWindow,
    toggleStartMenu,
    toggleQuickSettings,
    toggleNotificationCenter,
    startMenuOpen,
    quickSettingsOpen,
    notificationCenterOpen,
    settings,
    notifications
  } = useOS();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pinnedApps = [
    { id: 'copilot', title: 'Copilot AI', icon: Bot, color: 'text-violet-400' },
    { id: 'explorer', title: 'File Explorer', icon: Folder, color: 'text-amber-400' },
    { id: 'notepad', title: 'Cyber Notepad', icon: FileText, color: 'text-cyan-400' },
    { id: 'terminal', title: 'Neo-Terminal', icon: Terminal, color: 'text-emerald-400' },
    { id: 'browser', title: 'Glass Browser', icon: Globe, color: 'text-indigo-400' },
    { id: 'taskmanager', title: 'System Monitor', icon: Activity, color: 'text-rose-400' },
    { id: 'music', title: 'Ambient Synth', icon: Music, color: 'text-pink-400' },
    { id: 'settings', title: 'Settings', icon: Settings, color: 'text-blue-400' },
  ];

  const renderAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'Folder': return <Folder className="w-5 h-5 text-amber-400" />;
      case 'Bot': return <Bot className="w-5 h-5 text-violet-400" />;
      case 'Settings': return <Settings className="w-5 h-5 text-blue-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-indigo-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-rose-400" />;
      case 'Music': return <Music className="w-5 h-5 text-pink-400" />;
      default: return <FileText className="w-5 h-5 text-gray-300" />;
    }
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="absolute bottom-3 left-0 right-0 h-14 flex items-center justify-center z-40 px-4 pointer-events-none">
        <div className="pointer-events-auto h-12 px-3 mica-glass rounded-2xl taskbar-glow flex items-center gap-2">
          
          {/* Windows Start Button */}
          <button
            onClick={toggleStartMenu}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              startMenuOpen ? 'bg-white/20 shadow-lg scale-95' : 'hover:bg-white/10'
            }`}
            title="Start Menu"
          >
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <div className="bg-cyan-400 rounded-sm" />
              <div className="bg-cyan-400 rounded-sm" />
              <div className="bg-cyan-400 rounded-sm" />
              <div className="bg-cyan-400 rounded-sm" />
            </div>
          </button>

          <div className="w-[1px] h-6 bg-white/10 mx-1" />

          {/* Pinned / Running Apps */}
          <div className="flex items-center gap-1.5">
            {pinnedApps.map(app => {
              const IconComp = app.icon;
              const isOpen = windows.some(w => w.appId === app.id);
              const isActive = windows.some(w => w.appId === app.id && w.id === activeWindowId && !w.isMinimized);

              return (
                <button
                  key={app.id}
                  onClick={() => {
                    const existing = windows.find(w => w.appId === app.id);
                    if (existing) {
                      focusWindow(existing.id);
                    } else {
                      openApp(app.id);
                    }
                  }}
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group ${
                    isActive ? 'bg-white/15 shadow-md' : 'hover:bg-white/10'
                  }`}
                  title={app.title}
                >
                  <IconComp className={`w-5 h-5 ${app.color} group-hover:scale-110 transition-transform`} />
                  
                  {/* Running indicator dot / dash */}
                  {isOpen && (
                    <span
                      className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full transition-all ${
                        isActive ? 'bg-cyan-400 w-3' : 'bg-gray-400/80'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-[1px] h-6 bg-white/10 mx-1" />

          {/* System Tray & Quick Settings / Notification Triggers */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleQuickSettings}
              className={`h-9 px-2.5 rounded-xl flex items-center gap-2 transition-all ${
                quickSettingsOpen ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              title="Quick Settings (Wi-Fi, Volume, Theme)"
            >
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <Volume2 className="w-3.5 h-3.5 text-gray-300" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            <button
              onClick={toggleNotificationCenter}
              className={`relative h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-medium text-gray-200 transition-all ${
                notificationCenterOpen ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              title="Notification Center"
            >
              <span className="font-mono">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-black text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      <StartMenu />
      <QuickSettings />
      <NotificationCenter />
    </>
  );
};
