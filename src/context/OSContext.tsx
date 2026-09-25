import React, { createContext, useContext, useState, useEffect } from 'react';
import { WindowState, VfsFile, NotificationItem, SystemSettings, AccentColor } from '../types';

interface OSContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  startMenuOpen: boolean;
  quickSettingsOpen: boolean;
  notificationCenterOpen: boolean;
  snapLayoutPicker: string | null; // windowId being snapped
  settings: SystemSettings;
  vfsFiles: VfsFile[];
  notifications: NotificationItem[];
  
  // Actions
  toggleStartMenu: () => void;
  closeAllFlyouts: () => void;
  toggleQuickSettings: () => void;
  toggleNotificationCenter: () => void;
  
  openApp: (appId: string, title?: string, initialProps?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number, width: number, height: number) => void;
  snapWindow: (id: string, position: WindowState['snapPosition']) => void;
  setSnapLayoutPicker: (id: string | null) => void;

  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  
  // VFS Actions
  saveFile: (path: string, content: string, name?: string) => void;
  deleteFile: (id: string) => void;
  moveFile: (fileId: string, targetFolderPath: string) => void;
  
  // Notifications
  addNotification: (notification: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const initialVfsFiles: VfsFile[] = [
  { id: '1', name: 'Desktop', path: '/Desktop', content: '', type: 'folder', parentId: null, updatedAt: new Date().toISOString() },
  { id: '2', name: 'Documents', path: '/Documents', content: '', type: 'folder', parentId: null, updatedAt: new Date().toISOString() },
  { id: '3', name: 'Welcome.txt', path: '/Desktop/Welcome.txt', content: 'Welcome to Windows Black.\n\nAn ultra-prosperous pitch-dark cyberpunk OS shell powered by React and Tailwind CSS.\n\n- Explore the glass apps in the taskbar or Start menu.\n- Try Neo-Terminal for system commands & AI queries.\n- Ask Copilot Black anything using your Gemini API connection.', type: 'file', parentId: '1', updatedAt: new Date().toISOString(), size: 342 },
  { id: '4', name: 'SystemNotes.md', path: '/Documents/SystemNotes.md', content: '# Windows Black Architecture\n\n- Fluent Mica Glass\n- Real-time Compositor & Snap Layouts\n- Virtual File System (VFS)\n- Copilot Black AI Integration', type: 'file', parentId: '2', updatedAt: new Date().toISOString(), size: 210 },
];

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'welcome-notepad',
      appId: 'notepad',
      title: 'Welcome.txt - Notepad',
      icon: 'FileText',
      x: window.innerWidth > 1000 ? window.innerWidth / 2 - 350 : 50,
      y: window.innerHeight > 800 ? window.innerHeight / 2 - 250 : 50,
      width: 700,
      height: 480,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10
    }
  ]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>('welcome-notepad');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [snapLayoutPicker, setSnapLayoutPicker] = useState<string | null>(null);

  const [settings, setSettings] = useState<SystemSettings>({
    wallpaper: 'obsidian',
    accentColor: 'cyan',
    taskbarAligned: 'center',
    soundEnabled: true,
    volume: 80,
    nightLight: false,
  });

  const [vfsFiles, setVfsFiles] = useState<VfsFile[]>(initialVfsFiles);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'System Boot Complete',
      message: 'Windows Black kernel online. All security protocols and glass compositors active.',
      time: 'Just now',
      read: false,
      type: 'success'
    },
    {
      id: 'notif-2',
      title: 'Copilot Black Ready',
      message: 'Gemini AI assistant connection established. Press Win+C or click Copilot in the taskbar.',
      time: '1m ago',
      read: false,
      type: 'ai'
    }
  ]);

  let topZIndex = 100;

  const toggleStartMenu = () => {
    setStartMenuOpen(prev => !prev);
    setQuickSettingsOpen(false);
    setNotificationCenterOpen(false);
  };

  const toggleQuickSettings = () => {
    setQuickSettingsOpen(prev => !prev);
    setStartMenuOpen(false);
    setNotificationCenterOpen(false);
  };

  const toggleNotificationCenter = () => {
    setNotificationCenterOpen(prev => !prev);
    setStartMenuOpen(false);
    setQuickSettingsOpen(false);
  };

  const closeAllFlyouts = () => {
    setStartMenuOpen(false);
    setQuickSettingsOpen(false);
    setNotificationCenterOpen(false);
    setSnapLayoutPicker(null);
  };

  const focusWindow = (id: string) => {
    topZIndex += 1;
    setWindows(prev =>
      prev.map(win => (win.id === id ? { ...win, zIndex: topZIndex, isMinimized: false } : win))
    );
    setActiveWindowId(id);
  };

  const openApp = (appId: string, title?: string, initialProps?: any) => {
    closeAllFlyouts();
    const instanceId = `${appId}-${Date.now()}`;
    
    // Check if already open for single-instance apps if needed, or allow multiple
    let defaultTitle = title || appId.charAt(0).toUpperCase() + appId.slice(1);
    let icon = 'AppWindow';
    let width = 750;
    let height = 500;

    switch (appId) {
      case 'notepad':
        icon = 'FileText';
        width = 680;
        height = 450;
        break;
      case 'terminal':
        icon = 'Terminal';
        width = 720;
        height = 460;
        break;
      case 'explorer':
        icon = 'Folder';
        width = 800;
        height = 520;
        break;
      case 'copilot':
        icon = 'Bot';
        width = 420;
        height = 650;
        break;
      case 'settings':
        icon = 'Settings';
        width = 750;
        height = 520;
        break;
      case 'browser':
        icon = 'Globe';
        width = 900;
        height = 600;
        break;
      case 'taskmanager':
        icon = 'Activity';
        width = 700;
        height = 480;
        break;
      case 'music':
        icon = 'Music';
        width = 400;
        height = 450;
        break;
    }

    const offset = (windows.length % 5) * 30;
    const newWin: WindowState = {
      id: instanceId,
      appId,
      title: defaultTitle,
      icon,
      x: Math.max(50, (window.innerWidth - width) / 2 + offset),
      y: Math.max(40, (window.innerHeight - height) / 2 + offset),
      width,
      height,
      isMinimized: false,
      isMaximized: false,
      zIndex: ++topZIndex
    };

    setWindows(prev => [...prev, newWin]);
    setActiveWindowId(instanceId);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id);
      if (remaining.length > 0) {
        const nextActive = remaining.reduce((prev, curr) => (curr.zIndex > prev.zIndex ? curr : prev));
        setActiveWindowId(nextActive.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w)));
    if (activeWindowId === id) {
      const visible = windows.filter(w => w.id !== id && !w.isMinimized);
      if (visible.length > 0) {
        const nextActive = visible.reduce((prev, curr) => (curr.zIndex > prev.zIndex ? curr : prev));
        setActiveWindowId(nextActive.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMaximized: !w.isMaximized, snapPosition: undefined } : w))
    );
    focusWindow(id);
  };

  const updateWindowPosition = (id: string, x: number, y: number, width: number, height: number) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, x, y, width, height, isMaximized: false, snapPosition: undefined } : w))
    );
  };

  const snapWindow = (id: string, position: WindowState['snapPosition']) => {
    setSnapLayoutPicker(null);
    setWindows(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        if (!position) return { ...w, snapPosition: undefined };
        return { ...w, snapPosition: position, isMaximized: false };
      })
    );
    focusWindow(id);
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const saveFile = (path: string, content: string, name?: string) => {
    setVfsFiles(prev => {
      const existing = prev.find(f => f.path === path);
      if (existing) {
        return prev.map(f => (f.id === existing.id ? { ...f, content, updatedAt: new Date().toISOString() } : f));
      } else {
        const fileName = name || path.split('/').pop() || 'Untitled.txt';
        const newFile: VfsFile = {
          id: Date.now().toString(),
          name: fileName,
          path,
          content,
          type: 'file',
          parentId: '2', // default Documents folder
          updatedAt: new Date().toISOString(),
          size: content.length
        };
        return [...prev, newFile];
      }
    });
  };

  const deleteFile = (id: string) => {
    setVfsFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFile = (fileId: string, targetFolderPath: string) => {
    setVfsFiles(prev => {
      const fileToMove = prev.find(f => f.id === fileId);
      if (!fileToMove) return prev;

      const oldPath = fileToMove.path;
      const newPath = `${targetFolderPath}/${fileToMove.name}`;

      if (oldPath === newPath || newPath.startsWith(oldPath + '/')) return prev;

      const existing = prev.find(f => f.path === newPath);
      if (existing) return prev;

      return prev.map(f => {
        if (f.id === fileId) {
          return { ...f, path: newPath, updatedAt: new Date().toISOString() };
        }
        if (fileToMove.type === 'folder' && f.path.startsWith(oldPath + '/')) {
          const relativePath = f.path.substring(oldPath.length);
          return { ...f, path: `${newPath}${relativePath}`, updatedAt: new Date().toISOString() };
        }
        return f;
      });
    });
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: Date.now().toString(),
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <OSContext.Provider
      value={{
        windows,
        activeWindowId,
        startMenuOpen,
        quickSettingsOpen,
        notificationCenterOpen,
        snapLayoutPicker,
        settings,
        vfsFiles,
        notifications,
        toggleStartMenu,
        closeAllFlyouts,
        toggleQuickSettings,
        toggleNotificationCenter,
        openApp,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowPosition,
        snapWindow,
        setSnapLayoutPicker,
        updateSettings,
        saveFile,
        deleteFile,
        moveFile,
        addNotification,
        markNotificationRead,
        clearNotifications
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within an OSProvider');
  return context;
};
