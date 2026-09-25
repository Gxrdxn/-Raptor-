import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import { Save, FileText, Eye, Edit3, Download, Check } from 'lucide-react';

export const NotepadApp: React.FC = () => {
  const { vfsFiles, saveFile, addNotification } = useOS();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [fileName, setFileName] = useState('Welcome.txt');
  const [content, setContent] = useState(
    vfsFiles.find(f => f.name === 'Welcome.txt')?.content ||
    'Welcome to Windows Black.\n\nAn ultra-prosperous pitch-dark cyberpunk OS shell powered by React and Tailwind CSS.\n\n- Explore the glass apps in the taskbar or Start menu.\n- Try Neo-Terminal for system commands & AI queries.\n- Ask Copilot Black anything using your Gemini API connection.'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveFile(`/Documents/${fileName}`, content, fileName);
    setSaved(true);
    addNotification({
      title: 'File Saved',
      message: `${fileName} saved successfully to Virtual File System.`,
      type: 'success'
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-gray-200">
      {/* Toolbar */}
      <div className="h-11 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-200 border-b border-transparent hover:border-white/20 focus:border-cyan-500 focus:outline-none px-1 py-0.5"
          />
          {saved && <span className="text-[10px] text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Saved</span>}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'editor' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:bg-white/10 text-gray-400'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'preview' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:bg-white/10 text-gray-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            title="Save to VFS"
          >
            <Save className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor / Preview Body */}
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        {activeTab === 'editor' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-transparent font-mono text-xs text-gray-100 placeholder-gray-600 resize-none focus:outline-none leading-relaxed"
            placeholder="Type your notes here..."
            spellCheck={false}
          />
        ) : (
          <div className="w-full h-full overflow-y-auto font-sans text-sm text-gray-200 whitespace-pre-wrap leading-relaxed p-2">
            {content}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-7 bg-black/40 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-gray-500 select-none">
        <div className="flex items-center gap-4">
          <span>Words: {words}</span>
          <span>Characters: {chars}</span>
        </div>
        <span className="text-cyan-400 font-mono">UTF-8</span>
      </div>
    </div>
  );
};
