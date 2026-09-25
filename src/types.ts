export type AccentColor = 'cyan' | 'emerald' | 'violet' | 'rose' | 'amber';

export interface AppDefinition {
  id: string;
  title: string;
  icon: string; // Lucide icon name or emoji
  component: string;
  defaultWidth: number;
  defaultHeight: number;
  isPinned?: boolean;
}

export interface WindowState {
  id: string; // unique instance ID (e.g., notepad-1, terminal-1)
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  snapPosition?: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'fullscreen';
}

export interface VfsFile {
  id: string;
  name: string;
  path: string;
  content: string;
  type: 'file' | 'folder';
  parentId: string | null;
  updatedAt: string;
  size?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface SystemSettings {
  wallpaper: string;
  accentColor: AccentColor;
  taskbarAligned: 'center' | 'left';
  soundEnabled: boolean;
  volume: number;
  nightLight: boolean;
}
