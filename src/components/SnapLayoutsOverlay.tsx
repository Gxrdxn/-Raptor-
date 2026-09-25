import React from 'react';
import { useOS } from '../context/OSContext';

export const SnapLayoutsOverlay: React.FC = () => {
  const { snapLayoutPicker, setSnapLayoutPicker, snapWindow } = useOS();

  if (!snapLayoutPicker) return null;

  const windowId = snapLayoutPicker;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] p-4 bg-[#121218]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150"
      onMouseLeave={() => setSnapLayoutPicker(null)}
    >
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
        Snap Layouts
      </div>
      
      <div className="grid grid-cols-2 gap-2 w-64 h-44">
        {/* Left Half */}
        <button
          onClick={() => snapWindow(windowId, 'left')}
          className="bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/60 border border-white/10 rounded-xl transition-all flex items-center justify-center group"
          title="Snap Left"
        >
          <div className="w-1/2 h-4/5 bg-white/20 group-hover:bg-cyan-400/60 rounded-md transition-colors" />
        </button>

        {/* Right Half */}
        <button
          onClick={() => snapWindow(windowId, 'right')}
          className="bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/60 border border-white/10 rounded-xl transition-all flex items-center justify-center group"
          title="Snap Right"
        >
          <div className="w-1/2 h-4/5 bg-white/20 group-hover:bg-cyan-400/60 rounded-md transition-colors ml-auto" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 w-64 h-24">
        {/* Top-Left */}
        <button
          onClick={() => snapWindow(windowId, 'top-left')}
          className="bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/60 border border-white/10 rounded-lg transition-all group"
          title="Top Left"
        />
        {/* Top-Right */}
        <button
          onClick={() => snapWindow(windowId, 'top-right')}
          className="bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/60 border border-white/10 rounded-lg transition-all group"
          title="Top Right"
        />
        {/* Bottom-Left */}
        <button
          onClick={() => snapWindow(windowId, 'bottom-left')}
          className="bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/60 border border-white/10 rounded-lg transition-all group"
          title="Bottom Left"
        />
        {/* Bottom-Right */}
        <button
          onClick={() => snapWindow(windowId, 'bottom-right')}
          className="bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/60 border border-white/10 rounded-lg transition-all group"
          title="Bottom Right"
        />
      </div>

      <button
        onClick={() => snapWindow(windowId, 'fullscreen')}
        className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-xs font-medium rounded-lg transition-colors text-gray-200"
      >
        Maximize Fullscreen
      </button>
    </div>
  );
};
