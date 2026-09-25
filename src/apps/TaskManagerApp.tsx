import React, { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { Activity, Cpu, HardDrive, Zap, XCircle } from 'lucide-react';

export const TaskManagerApp: React.FC = () => {
  const { windows, closeWindow } = useOS();
  const [cpuUsage, setCpuUsage] = useState(18);
  const [ramUsage, setRamUsage] = useState(3.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(12 + Math.random() * 28));
      setRamUsage(Number((3.2 + Math.random() * 0.4).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-gray-200 p-6 overflow-y-auto">
      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Processor (CPU)</div>
            <div className="text-lg font-bold text-gray-100">{cpuUsage}%</div>
            <div className="text-[10px] text-emerald-400">3.80 GHz 8-Core</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Memory (RAM)</div>
            <div className="text-lg font-bold text-gray-100">{ramUsage} GB</div>
            <div className="text-[10px] text-cyan-400">21% in use (16 GB total)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400">GPU / Glass Engine</div>
            <div className="text-lg font-bold text-gray-100">60 FPS</div>
            <div className="text-[10px] text-emerald-400">Mica Acceleration Active</div>
          </div>
        </div>
      </div>

      {/* Active Windows / Processes */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Processes ({windows.length})</span>
          <span className="text-xs text-cyan-400 font-medium">Windows Black Kernel</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 bg-white/5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">
            <div className="col-span-5">App Name</div>
            <div className="col-span-3">Instance ID</div>
            <div className="col-span-2">CPU</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          <div className="divide-y divide-white/5">
            {windows.map(win => (
              <div key={win.id} className="grid grid-cols-12 px-4 py-3 items-center text-xs">
                <div className="col-span-5 font-medium text-gray-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {win.title}
                </div>
                <div className="col-span-3 font-mono text-[11px] text-gray-500 truncate">{win.id}</div>
                <div className="col-span-2 text-cyan-400 font-mono">0.4%</div>
                <div className="col-span-2 text-right">
                  <button
                    onClick={() => closeWindow(win.id)}
                    className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 text-[11px] font-medium transition-all"
                  >
                    End Task
                  </button>
                </div>
              </div>
            ))}
            {windows.length === 0 && (
              <div className="py-12 text-center text-gray-500 text-xs">
                No active processes running.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
