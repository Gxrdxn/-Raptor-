import React from 'react';
import { useOS } from '../context/OSContext';
import { WindowFrame } from './WindowFrame';
import { SnapLayoutsOverlay } from './SnapLayoutsOverlay';

// Apps
import { NotepadApp } from '../apps/NotepadApp';
import { TerminalApp } from '../apps/TerminalApp';
import { FileExplorerApp } from '../apps/FileExplorerApp';
import { CopilotApp } from '../apps/CopilotApp';
import { SettingsApp } from '../apps/SettingsApp';
import { BrowserApp } from '../apps/BrowserApp';
import { TaskManagerApp } from '../apps/TaskManagerApp';
import { MusicApp } from '../apps/MusicApp';

export const WindowManager: React.FC = () => {
  const { windows } = useOS();

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case 'notepad':
        return <NotepadApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'explorer':
        return <FileExplorerApp />;
      case 'copilot':
        return <CopilotApp />;
      case 'settings':
        return <SettingsApp />;
      case 'browser':
        return <BrowserApp />;
      case 'taskmanager':
        return <TaskManagerApp />;
      case 'music':
        return <MusicApp />;
      default:
        return (
          <div className="p-8 flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-lg font-semibold text-gray-200">Application Error</h2>
            <p className="text-sm text-gray-400 mt-2">App ID '{appId}' could not be initialized.</p>
          </div>
        );
    }
  };

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {windows.map((win) => (
          <React.Fragment key={win.id}>
            <WindowFrame window={win}>
              {renderAppContent(win.appId)}
            </WindowFrame>
          </React.Fragment>
        ))}
      </div>
      <SnapLayoutsOverlay />
    </>
  );
};
