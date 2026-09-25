import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { Terminal as TerminalIcon } from 'lucide-react';

interface LogItem {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'matrix';
  text: string;
}

type TerminalThemeType = 'cyberpunk' | 'matrix' | 'solarized' | 'monokai';

interface ThemeConfig {
  bg: string;
  text: string;
  inputColor: string;
  promptColor: string;
  successColor: string;
  errorColor: string;
}

const THEMES: Record<TerminalThemeType, ThemeConfig> = {
  cyberpunk: {
    bg: 'bg-[#07070a]',
    text: 'text-cyan-400',
    inputColor: 'text-gray-100',
    promptColor: 'text-cyan-400',
    successColor: 'text-cyan-400',
    errorColor: 'text-rose-400'
  },
  matrix: {
    bg: 'bg-[#020d04]',
    text: 'text-emerald-400',
    inputColor: 'text-emerald-200',
    promptColor: 'text-emerald-500',
    successColor: 'text-emerald-300',
    errorColor: 'text-rose-500'
  },
  solarized: {
    bg: 'bg-[#002b36]',
    text: 'text-[#b58900]',
    inputColor: 'text-[#839496]',
    promptColor: 'text-[#2aa198]',
    successColor: 'text-[#859900]',
    errorColor: 'text-[#dc322f]'
  },
  monokai: {
    bg: 'bg-[#1e1f1c]',
    text: 'text-[#a6e22e]',
    inputColor: 'text-[#f8f8f2]',
    promptColor: 'text-[#fd971f]',
    successColor: 'text-[#66d9ef]',
    errorColor: 'text-[#f92672]'
  }
};

export const TerminalApp: React.FC = () => {
  const { vfsFiles, openApp } = useOS();
  const [input, setInput] = useState('');
  const [currentTheme, setCurrentTheme] = useState<TerminalThemeType>('cyberpunk');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [tempInput, setTempInput] = useState('');
  const [logs, setLogs] = useState<LogItem[]>([
    { id: '1', type: 'success', text: 'Windows Black Neo-Terminal v2.5 [Kernel 6.8.0-OBSIDIAN]' },
    { id: '2', type: 'output', text: 'Type "help" for available commands, or "theme <cyberpunk|matrix|solarized|monokai>" to switch color schemes.' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;

      if (historyIndex === -1) {
        // Save current draft and load latest command
        setTempInput(input);
        const nextIndex = history.length - 1;
        setHistoryIndex(nextIndex);
        const prevCmd = history[nextIndex];
        setInput(prevCmd);
        requestAnimationFrame(() => {
          inputRef.current?.setSelectionRange(prevCmd.length, prevCmd.length);
        });
      } else if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        const prevCmd = history[nextIndex];
        setInput(prevCmd);
        requestAnimationFrame(() => {
          inputRef.current?.setSelectionRange(prevCmd.length, prevCmd.length);
        });
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;

      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        const nextCmd = history[nextIndex];
        setInput(nextCmd);
        requestAnimationFrame(() => {
          inputRef.current?.setSelectionRange(nextCmd.length, nextCmd.length);
        });
      } else {
        // Return to the draft input before cycling
        setHistoryIndex(-1);
        setInput(tempInput);
        requestAnimationFrame(() => {
          inputRef.current?.setSelectionRange(tempInput.length, tempInput.length);
        });
      }
    }
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    // Record into command history
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setTempInput('');

    const newLogs: LogItem[] = [...logs, { id: Date.now().toString(), type: 'input', text: `root@windows-black:~$ ${cmd}` }];
    setInput('');

    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (command) {
      case 'help':
        newLogs.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `Available Commands:
  help                    - Show this help menu
  history                 - Display previously typed commands (or use ↑ / ↓)
  ls                      - List virtual file system files
  cat <file>              - Read a virtual file
  theme <name>            - Switch theme (cyberpunk, matrix, solarized, monokai)
  clear                   - Clear terminal screen
  whoami                  - Display current session user
  date                    - Show current system date & time
  sysinfo                 - Display kernel and OS specs
  matrix                  - Initiate matrix rain effect
  ai <prompt>             - Query Copilot AI directly`
        });
        break;

      case 'history':
        if (history.length === 0) {
          newLogs.push({
            id: (Date.now() + 1).toString(),
            type: 'output',
            text: 'No commands in history yet.'
          });
        } else {
          const list = history.map((item, idx) => `  ${(idx + 1).toString().padStart(3, ' ')}  ${item}`).join('\n');
          newLogs.push({
            id: (Date.now() + 1).toString(),
            type: 'output',
            text: `Command History (use ↑ / ↓ arrows):\n${list}`
          });
        }
        break;

      case 'theme':
        const themeArg = arg.toLowerCase().trim() as TerminalThemeType;
        if (['cyberpunk', 'matrix', 'solarized', 'monokai'].includes(themeArg)) {
          setCurrentTheme(themeArg);
          newLogs.push({
            id: (Date.now() + 1).toString(),
            type: 'success',
            text: `[SUCCESS] Terminal theme successfully switched to '${themeArg}'.`
          });
        } else {
          newLogs.push({
            id: (Date.now() + 1).toString(),
            type: 'error',
            text: `Invalid theme. Available themes: cyberpunk, matrix, solarized, monokai.\nExample: theme matrix`
          });
        }
        break;

      case 'ls':
        const fileList = vfsFiles.map(f => `${f.type === 'folder' ? '📁' : '📄'} ${f.path} (${f.size || 0} bytes)`).join('\n');
        newLogs.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: fileList || 'No files found.'
        });
        break;

      case 'cat':
        const found = vfsFiles.find(f => f.name.toLowerCase() === arg.toLowerCase() || f.path.toLowerCase() === arg.toLowerCase());
        if (found) {
          newLogs.push({ id: (Date.now() + 1).toString(), type: 'output', text: found.content });
        } else {
          newLogs.push({ id: (Date.now() + 1).toString(), type: 'error', text: `cat: ${arg}: No such file or directory` });
        }
        break;

      case 'clear':
        setLogs([]);
        return;

      case 'whoami':
        newLogs.push({ id: (Date.now() + 1).toString(), type: 'output', text: 'root@windows-black-admin [Authenticated via Obsidian Security]' });
        break;

      case 'date':
        newLogs.push({ id: (Date.now() + 1).toString(), type: 'output', text: new Date().toString() });
        break;

      case 'sysinfo':
        newLogs.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `OS: Windows Black Pro x64\nKernel: Obsidian 6.8.0-1-ARCH\nActive Theme: ${currentTheme}\nUptime: 4 hours, 22 minutes\nMemory: 3.2 GB / 16.0 GB (20%)\nDisplay: 3840x2160 Mica Glass Compositor`
        });
        break;

      case 'matrix':
        newLogs.push({
          id: (Date.now() + 1).toString(),
          type: 'matrix',
          text: '01010011 01111001 01110011 01110100 01100101 01101110 00100000 01001111 01110011 01101111 01101100 01100101 01110100 01100101'
        });
        break;

      case 'ai':
        if (!arg) {
          newLogs.push({ id: (Date.now() + 1).toString(), type: 'error', text: 'Usage: ai <prompt>' });
          break;
        }
        newLogs.push({ id: (Date.now() + 1).toString(), type: 'output', text: 'Consulting Copilot Black...' });
        setLogs(newLogs);
        try {
          const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: arg })
          });
          const data = await res.json();
          setLogs(prev => [...prev, { id: Date.now().toString(), type: 'success', text: data.response || data.error }]);
        } catch (err: any) {
          setLogs(prev => [...prev, { id: Date.now().toString(), type: 'error', text: `AI Error: ${err.message}` }]);
        }
        return;

      default:
        newLogs.push({ id: (Date.now() + 1).toString(), type: 'error', text: `command not found: ${cmd}. Type "help" for commands.` });
        break;
    }

    setLogs(newLogs);
  };

  const themeStyle = THEMES[currentTheme];

  return (
    <div className={`flex flex-col h-full ${themeStyle.bg} font-mono text-xs ${themeStyle.text} p-4 overflow-y-auto transition-colors duration-300`}>
      <div className="space-y-1.5 mb-4">
        {logs.map(log => (
          <div
            key={log.id}
            className={`${
              log.type === 'input' ? themeStyle.inputColor :
              log.type === 'error' ? themeStyle.errorColor :
              log.type === 'success' ? themeStyle.successColor :
              log.type === 'matrix' ? 'text-emerald-500 font-bold tracking-widest' :
              themeStyle.text
            } whitespace-pre-wrap leading-relaxed`}
          >
            {log.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-2 mt-auto pt-2 border-t border-white/10">
        <span className={`${themeStyle.promptColor} font-bold`}>root@obsidian:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            // If user types while browsing history, reset history browsing index so they don't overwrite unexpected state
            if (historyIndex !== -1) {
              setHistoryIndex(-1);
            }
          }}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent ${themeStyle.inputColor} focus:outline-none font-mono text-xs`}
          autoFocus
          spellCheck={false}
          placeholder="Type a command (e.g., 'help' or 'theme matrix')"
        />
      </form>
    </div>
  );
};
