import React, { useState, useMemo } from 'react';
import { useOS } from '../context/OSContext';
import {
  Folder,
  FileText,
  ChevronRight,
  Plus,
  Trash2,
  HardDrive,
  Search,
  X,
  FileCode,
  File as FileIcon
} from 'lucide-react';

export const FileExplorerApp: React.FC = () => {
  const { vfsFiles, saveFile, deleteFile, moveFile, openApp, addNotification } = useOS();
  const [currentFolder, setCurrentFolder] = useState<string>('/Desktop');
  const [newFileName, setNewFileName] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'size'>('name');
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;
    const path = `${currentFolder}/${newFileName}`;
    saveFile(path, '# New File\n\nCreated in Windows Black VFS.', newFileName);
    addNotification({
      title: 'File Created',
      message: `${newFileName} created successfully in ${currentFolder}`,
      type: 'success'
    });
    setNewFileName('');
    setShowNewModal(false);
  };

  const getFileExtension = (filename: string) => {
    if (!filename.includes('.')) return '';
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const getFileDetails = (file: { name: string; type: string }) => {
    if (file.type === 'folder') {
      return { label: 'Folder', ext: 'DIR', color: 'text-amber-400', bg: 'bg-amber-400/10' };
    }
    const ext = getFileExtension(file.name);
    switch (ext) {
      case 'txt':
        return { label: 'Text Document', ext: 'TXT', color: 'text-cyan-400', bg: 'bg-cyan-400/10' };
      case 'md':
        return { label: 'Markdown Document', ext: 'MD', color: 'text-violet-400', bg: 'bg-violet-400/10' };
      case 'json':
        return { label: 'JSON Document', ext: 'JSON', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
      case 'js':
      case 'ts':
      case 'tsx':
        return { label: 'Code Script', ext: ext.toUpperCase(), color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
      default:
        return { label: 'File', ext: ext ? ext.toUpperCase() : 'FILE', color: 'text-gray-400', bg: 'bg-gray-400/10' };
    }
  };

  // Filtered files based on global search query and type filter
  const displayedFiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const isSearching = query.length > 0 || selectedTypeFilter !== 'all';

    let result = [];
    if (!isSearching) {
      result = vfsFiles.filter(
        f => f.path.startsWith(currentFolder) && f.path.split('/').length === currentFolder.split('/').length + 1
      );
    } else {
      result = vfsFiles.filter(file => {
        const ext = getFileExtension(file.name);
        const details = getFileDetails(file);

        // Check quick type filter
        if (selectedTypeFilter === 'txt' && ext !== 'txt') return false;
        if (selectedTypeFilter === 'md' && ext !== 'md') return false;
        if (selectedTypeFilter === 'folder' && file.type !== 'folder') return false;
        if (selectedTypeFilter === 'file' && file.type === 'folder') return false;

        // Check text query across name, path, extension, and human-readable type
        if (query.length > 0) {
          const matchesName = file.name.toLowerCase().includes(query);
          const matchesPath = file.path.toLowerCase().includes(query);
          const matchesExt = ext && (ext.includes(query) || ('.' + ext).includes(query));
          const matchesType =
            file.type.toLowerCase().includes(query) ||
            details.label.toLowerCase().includes(query) ||
            details.ext.toLowerCase().includes(query);

          return matchesName || matchesPath || matchesExt || matchesType;
        }

        return true;
      });
    }

    // Apply sorting
    return result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'type') {
        const extA = getFileExtension(a.name);
        const extB = getFileExtension(b.name);
        if (a.type !== b.type) return a.type.localeCompare(b.type);
        return extA.localeCompare(extB);
      } else if (sortBy === 'size') {
        const sizeA = a.size || a.content?.length || 0;
        const sizeB = b.size || b.content?.length || 0;
        return sizeB - sizeA; // Descending size
      }
      return 0;
    });
  }, [vfsFiles, currentFolder, searchQuery, selectedTypeFilter, sortBy]);

  const isGlobalSearchActive = searchQuery.trim().length > 0 || selectedTypeFilter !== 'all';

  return (
    <div className="flex h-full bg-[#0a0a0f] text-gray-200">
      {/* Sidebar */}
      <div className="w-56 bg-black/40 border-r border-white/10 p-3 flex flex-col gap-2">
        {/* Global Search Input */}
        <div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1.5 flex items-center justify-between">
            <span>Global Search</span>
            {isGlobalSearchActive && (
              <span className="text-[9px] text-cyan-400 font-mono font-normal">Active</span>
            )}
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or type..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Type Filter Chips */}
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {[
              { id: 'all', label: 'All' },
              { id: 'txt', label: '.txt' },
              { id: 'md', label: '.md' },
              { id: 'folder', label: 'Folders' }
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => setSelectedTypeFilter(chip.id)}
                className={`px-2 py-0.5 text-[10px] rounded-md font-medium transition-all ${
                  selectedTypeFilter === chip.id
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50'
                    : 'bg-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10 border border-transparent'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-white/5 my-1" />

        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-1">Locations</div>
        <button
          onClick={() => {
            setCurrentFolder('/Desktop');
            setSearchQuery('');
            setSelectedTypeFilter('all');
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const fileId = e.dataTransfer.getData('text/plain');
            if (fileId) {
              moveFile(fileId, '/Desktop');
              addNotification({ title: 'Item Moved', message: 'Moved item to /Desktop', type: 'success' });
            }
          }}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            currentFolder === '/Desktop' && !isGlobalSearchActive
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'hover:bg-white/5 text-gray-300'
          }`}
        >
          <Folder className="w-4 h-4 text-amber-400" />
          <span>Desktop</span>
        </button>

        <button
          onClick={() => {
            setCurrentFolder('/Documents');
            setSearchQuery('');
            setSelectedTypeFilter('all');
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const fileId = e.dataTransfer.getData('text/plain');
            if (fileId) {
              moveFile(fileId, '/Documents');
              addNotification({ title: 'Item Moved', message: 'Moved item to /Documents', type: 'success' });
            }
          }}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            currentFolder === '/Documents' && !isGlobalSearchActive
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'hover:bg-white/5 text-gray-300'
          }`}
        >
          <Folder className="w-4 h-4 text-cyan-400" />
          <span>Documents</span>
        </button>

        {/* Virtual Storage info */}
        <div className="mt-auto p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>Virtual Storage</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-cyan-400 w-1/4 h-full" />
          </div>
          <div className="text-[10px] text-gray-500">
            {vfsFiles.length} item{vfsFiles.length === 1 ? '' : 's'} registered
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb Header */}
        <div className="h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
            {isGlobalSearchActive ? (
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-gray-400">Global Search:</span>
                <span className="text-cyan-300 font-semibold">
                  {searchQuery ? `"${searchQuery}"` : `Type: ${selectedTypeFilter}`}
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full border border-cyan-500/30">
                  {displayedFiles.length} result{displayedFiles.length === 1 ? '' : 's'}
                </span>
              </div>
            ) : (
              <>
                <span>Root</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-cyan-400 font-semibold">{currentFolder}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* HTML5 Sorting Dropdown */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1">
              <span className="text-[11px] text-gray-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'type' | 'size')}
                className="bg-transparent text-xs text-cyan-300 font-medium focus:outline-none cursor-pointer"
              >
                <option value="name" className="bg-[#0a0a0f] text-gray-200">Name</option>
                <option value="type" className="bg-[#0a0a0f] text-gray-200">Type</option>
                <option value="size" className="bg-[#0a0a0f] text-gray-200">Size</option>
              </select>
            </div>

            {isGlobalSearchActive && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTypeFilter('all');
                }}
                className="px-2.5 py-1 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              >
                Reset Filter
              </button>
            )}
            <button
              onClick={() => setShowNewModal(true)}
              className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New File</span>
            </button>
          </div>
        </div>

        {/* New File Modal */}
        {showNewModal && (
          <form onSubmit={handleCreateFile} className="p-3 bg-black/60 border-b border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Filename (e.g. notes.txt or spec.md)"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              autoFocus
            />
            <button type="submit" className="px-3 py-1.5 bg-cyan-500 text-black text-xs font-bold rounded-lg hover:bg-cyan-400 transition-colors">
              Create
            </button>
            <button type="button" onClick={() => setShowNewModal(false)} className="px-3 py-1.5 bg-white/10 text-gray-300 text-xs rounded-lg hover:bg-white/20 transition-colors">
              Cancel
            </button>
          </form>
        )}

        {/* File Grid */}
        <div className="flex-1 p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto content-start">
          {displayedFiles.map(file => {
            const details = getFileDetails(file);
            const isTargetFolder = file.type === 'folder';
            const isDragOver = dragOverFolder === file.path;

            return (
              <div
                key={file.id}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', file.id);
                }}
                {...(isTargetFolder
                  ? {
                      onDragOver: (e) => {
                        e.preventDefault();
                        setDragOverFolder(file.path);
                      },
                      onDragLeave: () => setDragOverFolder(null),
                      onDrop: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const fileId = e.dataTransfer.getData('text/plain');
                        if (fileId && fileId !== file.id) {
                          moveFile(fileId, file.path);
                          addNotification({
                            title: 'Item Moved',
                            message: `Moved item into ${file.name}`,
                            type: 'success'
                          });
                        }
                        setDragOverFolder(null);
                      }
                    }
                  : {})}
                onDoubleClick={() => {
                  if (file.type === 'folder') {
                    setCurrentFolder(file.path);
                    setSearchQuery('');
                    setSelectedTypeFilter('all');
                  } else {
                    openApp('notepad', `${file.name} - Notepad`);
                  }
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 border transition-all group cursor-pointer relative ${
                  isDragOver ? 'border-cyan-400 bg-cyan-500/20 scale-105 shadow-lg shadow-cyan-500/20' : 'border-white/5 hover:border-white/15'
                }`}
              >
                {/* Type Badge */}
                <span className={`absolute top-2 left-2 text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${details.bg} ${details.color}`}>
                  {details.ext}
                </span>

                <div className={`w-12 h-12 rounded-xl ${details.bg} flex items-center justify-center ${details.color} mb-2 group-hover:scale-105 transition-transform shadow`}>
                  {file.type === 'folder' ? (
                    <Folder className="w-6 h-6" />
                  ) : details.ext === 'JSON' || details.ext === 'JS' || details.ext === 'TS' ? (
                    <FileCode className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>

                <span className="text-xs font-medium text-gray-200 text-center truncate w-full px-1">
                  {file.name}
                </span>

                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-0.5">
                  {isGlobalSearchActive && (
                    <span className="text-gray-400 truncate max-w-[80px]">
                      {file.path.split('/').slice(0, -1).join('/') || '/'}
                    </span>
                  )}
                  {file.type !== 'folder' && (
                    <span>• {file.size ? `${file.size} B` : `${file.content?.length || 0} B`}</span>
                  )}
                </div>

                {/* Delete File action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.id);
                    addNotification({ title: 'File Deleted', message: `${file.name} deleted`, type: 'info' });
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/40 transition-all"
                  title="Delete File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {displayedFiles.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 text-xs flex flex-col items-center justify-center gap-2">
              <Search className="w-8 h-8 text-gray-600 mb-1" />
              <div className="text-gray-300 font-medium">No files found</div>
              <div className="text-gray-500 max-w-sm">
                {isGlobalSearchActive ? (
                  <>
                    No files matched <span className="text-cyan-400 font-mono">"{searchQuery || selectedTypeFilter}"</span>. Try filtering by another name or extension (e.g. <span className="text-gray-400">txt, md, notes</span>).
                  </>
                ) : (
                  'Folder is empty. Click "New File" to create a document.'
                )}
              </div>
              {isGlobalSearchActive && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTypeFilter('all');
                  }}
                  className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-200 text-xs rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
