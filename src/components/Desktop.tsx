import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import { WindowManager } from './WindowManager';
import { Taskbar } from './Taskbar';
import { FileText, Terminal, Folder, Bot, Settings, Globe, Activity, Music, Plus, RefreshCw, Sliders } from 'lucide-react';

export const Desktop: React.FC = () => {
  const { openApp, closeAllFlyouts, saveFile, addNotification, settings } = useOS();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const desktopIcons = [
    { id: 'copilot', title: 'Copilot AI', icon: Bot, color: 'text-violet-400' },
    { id: 'explorer', title: 'File Explorer', icon: Folder, color: 'text-amber-400' },
    { id: 'notepad', title: 'Welcome.txt', icon: FileText, color: 'text-cyan-400' },
    { id: 'terminal', title: 'Neo-Terminal', icon: Terminal, color: 'text-emerald-400' },
    { id: 'browser', title: 'Glass Browser', icon: Globe, color: 'text-indigo-400' },
    { id: 'taskmanager', title: 'System Monitor', icon: Activity, color: 'text-rose-400' },
    { id: 'music', title: 'Ambient Synth', icon: Music, color: 'text-pink-400' },
    { id: 'settings', title: 'OS Settings', icon: Settings, color: 'text-blue-400' },
  ];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    closeAllFlyouts();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    closeAllFlyouts();
    setContextMenu(null);
  };

  const handleCreateNewFile = () => {
    const timestamp = Date.now().toString().slice(-6);
    const fileName = `New_Note_${timestamp}.txt`;
    const path = `/Desktop/${fileName}`;
    saveFile(path, 'New document created via desktop context menu.\n\nType your notes here...', fileName);
    addNotification({
      title: 'File Created',
      message: `Created new file ${fileName} on Desktop.`,
      type: 'success'
    });
    setContextMenu(null);
  };

  const handleRefreshDesktop = () => {
    setIsRefreshing(true);
    addNotification({
      title: 'Desktop Refreshed',
      message: 'System icons and window compositor reloaded.',
      type: 'info'
    });
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
    setContextMenu(null);
  };

  const handleOpenSettings = () => {
    openApp('settings');
    setContextMenu(null);
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-[#070709] transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {/* Wallpaper Background with Cyber Grid & Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050508] via-[#0b0b12] to-[#120f18] pointer-events-none" />
      
      {/* Cyberpunk Neon Glow Circles */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Desktop Grid Icons */}
      <div className="absolute top-6 left-6 grid grid-flow-col grid-rows-4 gap-6 z-10">
        {desktopIcons.map(item => {
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              onDoubleClick={() => openApp(item.id)}
              className="flex flex-col items-center justify-center w-24 p-3 rounded-xl hover:bg-white/10 hover:border-white/15 border border-transparent transition-all group cursor-pointer"
              title="Double-click to open"
            >
              <div className={`w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mb-1.5 ${item.color} shadow-lg group-hover:scale-105 transition-transform`}>
                <IconComp className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-300 text-center drop-shadow truncate w-full">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Right-Click Context Menu */}
      {contextMenu && (
        <div
          className="absolute z-[99999] w-52 bg-black/85 backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl p-1.5 text-gray-200 text-xs font-sans animate-in fade-in zoom-in-95 duration-100"
          style={{ top: Math.min(contextMenu.y, window.innerHeight - 200), left: Math.min(contextMenu.x, window.innerWidth - 220) }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCreateNewFile}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors text-left"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">New Text File</span>
          </button>
          <button
            onClick={handleRefreshDesktop}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors text-left"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">Refresh Desktop</span>
          </button>
          <div className="h-[1px] bg-white/10 my-1" />
          <button
            onClick={handleOpenSettings}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors text-left"
          >
            <Sliders className="w-4 h-4 text-blue-400" />
            <span className="font-medium">OS Settings</span>
          </button>
        </div>
      )}

      {/* Window Manager & Compositor */}
      <WindowManager />

      {/* Taskbar & Flyouts */}
      <Taskbar />
    </div>
  );
};

