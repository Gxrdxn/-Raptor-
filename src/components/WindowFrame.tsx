import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../types';
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
  AppWindow,
  Minus,
  Square,
  X,
  Maximize2
} from 'lucide-react';

interface WindowFrameProps {
  window: WindowState;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: winState, children }) => {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
    snapWindow,
    setSnapLayoutPicker
  } = useOS();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialRect, setInitialRect] = useState({ x: winState.x, y: winState.y, width: winState.width, height: winState.height });
  const [dragSnapPreview, setDragSnapPreview] = useState<WindowState['snapPosition'] | null>(null);

  const windowRef = useRef<HTMLDivElement>(null);
  const isActive = activeWindowId === winState.id;

  const renderIcon = (name: string) => {
    switch (name) {
      case 'FileText': return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'Terminal': return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'Folder': return <Folder className="w-4 h-4 text-amber-400" />;
      case 'Bot': return <Bot className="w-4 h-4 text-violet-400" />;
      case 'Settings': return <Settings className="w-4 h-4 text-blue-400" />;
      case 'Globe': return <Globe className="w-4 h-4 text-indigo-400" />;
      case 'Activity': return <Activity className="w-4 h-4 text-rose-400" />;
      case 'Music': return <Music className="w-4 h-4 text-pink-400" />;
      default: return <AppWindow className="w-4 h-4 text-gray-300" />;
    }
  };

  // Dragging logic
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (winState.isMaximized || winState.snapPosition) return;
    focusWindow(winState.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - winState.x,
      y: e.clientY - winState.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const edgeThreshold = 15;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight - 64;

        // Check edge snap triggers
        if (e.clientX <= edgeThreshold) {
          if (e.clientY <= screenHeight * 0.45) setDragSnapPreview('top-left');
          else if (e.clientY >= screenHeight * 0.55) setDragSnapPreview('bottom-left');
          else setDragSnapPreview('left');
        } else if (e.clientX >= screenWidth - edgeThreshold) {
          if (e.clientY <= screenHeight * 0.45) setDragSnapPreview('top-right');
          else if (e.clientY >= screenHeight * 0.55) setDragSnapPreview('bottom-right');
          else setDragSnapPreview('right');
        } else if (e.clientY <= edgeThreshold) {
          setDragSnapPreview('fullscreen');
        } else {
          setDragSnapPreview(null);
        }

        const newX = Math.max(-winState.width + 100, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
        updateWindowPosition(winState.id, newX, newY, winState.width, winState.height);
      } else if (isResizing) {
        let dx = e.clientX - (initialRect.x + initialRect.width);
        let dy = e.clientY - (initialRect.y + initialRect.height);
        let newWidth = Math.max(300, initialRect.width + dx);
        let newHeight = Math.max(200, initialRect.height + dy);
        updateWindowPosition(winState.id, winState.x, winState.y, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      if (dragSnapPreview) {
        snapWindow(winState.id, dragSnapPreview);
      }
      setIsDragging(false);
      setIsResizing(null);
      setDragSnapPreview(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, winState, initialRect, dragSnapPreview, snapWindow]);

  if (winState.isMinimized) return null;

  // Determine styles based on maximize or snap position
  let containerStyle: React.CSSProperties = {
    zIndex: winState.zIndex,
  };

  let positionClasses = '';
  if (winState.isMaximized) {
    positionClasses = 'top-0 left-0 w-screen h-[calc(100vh-64px)] rounded-none border-none';
  } else if (winState.snapPosition === 'left') {
    positionClasses = 'top-0 left-0 w-1/2 h-[calc(100vh-64px)] rounded-none';
  } else if (winState.snapPosition === 'right') {
    positionClasses = 'top-0 left-1/2 w-1/2 h-[calc(100vh-64px)] rounded-none';
  } else if (winState.snapPosition === 'top-left') {
    positionClasses = 'top-0 left-0 w-1/2 h-[calc(50vh-32px)] rounded-none';
  } else if (winState.snapPosition === 'top-right') {
    positionClasses = 'top-0 left-1/2 w-1/2 h-[calc(50vh-32px)] rounded-none';
  } else if (winState.snapPosition === 'bottom-left') {
    positionClasses = 'top-[calc(50vh-32px)] left-0 w-1/2 h-[calc(50vh-32px)] rounded-none';
  } else if (winState.snapPosition === 'bottom-right') {
    positionClasses = 'top-[calc(50vh-32px)] left-1/2 w-1/2 h-[calc(50vh-32px)] rounded-none';
  } else if (winState.snapPosition === 'fullscreen') {
    positionClasses = 'top-0 left-0 w-screen h-[calc(100vh-64px)] rounded-none';
  } else {
    containerStyle = {
      ...containerStyle,
      transform: `translate(${winState.x}px, ${winState.y}px)`,
      width: `${winState.width}px`,
      height: `${winState.height}px`,
    };
    positionClasses = 'absolute top-0 left-0';
  }

  return (
    <div
      ref={windowRef}
      onClick={() => focusWindow(winState.id)}
      className={`flex flex-col mica-glass rounded-xl overflow-hidden shadow-2xl transition-shadow duration-200 ${
        isActive ? 'ring-1 ring-cyan-500/40 shadow-cyan-950/50' : 'opacity-95'
      } ${positionClasses}`}
      style={containerStyle}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-black/40 border-b border-white/10 flex items-center justify-between px-3 select-none cursor-default"
        onMouseDown={handleMouseDownHeader}
        onDoubleClick={() => maximizeWindow(winState.id)}
      >
        <div className="flex items-center gap-2.5">
          {renderIcon(winState.icon)}
          <span className="text-xs font-medium text-gray-200 tracking-wide truncate max-w-[240px]">
            {winState.title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(winState.id);
            }}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Maximize with Snap Layouts Hover */}
          <div className="relative group/maximize">
            <button
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(winState.id);
              }}
              onMouseEnter={() => setSnapLayoutPicker(winState.id)}
              className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
              title="Maximize / Snap Layouts"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(winState.id);
            }}
            className="w-7 h-7 flex items-center justify-center hover:bg-red-500/80 hover:text-white rounded-md text-gray-400 transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0f]/80 text-gray-100 relative">
        {children}
      </div>

      {/* Resize Handle */}
      {!winState.isMaximized && !winState.snapPosition && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 flex items-end justify-end p-1 text-gray-600 hover:text-gray-300"
          onMouseDown={(e) => {
            e.stopPropagation();
            focusWindow(winState.id);
            setIsResizing('bottom-right');
            setInitialRect({ x: winState.x, y: winState.y, width: winState.width, height: winState.height });
          }}
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-white/30" />
        </div>
      )}

      {/* Drag Snap Preview Overlay */}
      {dragSnapPreview && (
        <div
          className={`fixed pointer-events-none z-[9998] transition-all duration-150 bg-cyan-500/20 border-2 border-cyan-400 backdrop-blur-md shadow-2xl ${
            dragSnapPreview === 'left' ? 'top-0 left-0 w-1/2 h-[calc(100vh-64px)]' :
            dragSnapPreview === 'right' ? 'top-0 left-1/2 w-1/2 h-[calc(100vh-64px)]' :
            dragSnapPreview === 'top-left' ? 'top-0 left-0 w-1/2 h-[calc(50vh-32px)]' :
            dragSnapPreview === 'top-right' ? 'top-0 left-1/2 w-1/2 h-[calc(50vh-32px)]' :
            dragSnapPreview === 'bottom-left' ? 'top-[calc(50vh-32px)] left-0 w-1/2 h-[calc(50vh-32px)]' :
            dragSnapPreview === 'bottom-right' ? 'top-[calc(50vh-32px)] left-1/2 w-1/2 h-[calc(50vh-32px)]' :
            'top-0 left-0 w-screen h-[calc(100vh-64px)]'
          }`}
        />
      )}
    </div>
  );
};
