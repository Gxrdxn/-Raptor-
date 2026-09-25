import React from 'react';
import { useOS } from '../context/OSContext';
import { Bell, CheckCheck, Trash2, Bot, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { notificationCenterOpen, notifications, markNotificationRead, clearNotifications } = useOS();

  if (!notificationCenterOpen) return null;

  return (
    <div className="absolute bottom-16 right-6 w-96 max-h-[500px] bg-[#0c0c10]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 flex flex-col p-5 animate-in fade-in slide-in-from-bottom-6 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Notifications</span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
            {notifications.filter(n => !n.read).length}
          </span>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-xs">
            No new notifications
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-white/5 border-white/5 opacity-70'
                  : 'bg-white/10 border-white/15 shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-2 rounded-lg ${
                  n.type === 'ai' ? 'bg-violet-500/20 text-violet-400' :
                  n.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                  n.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {n.type === 'ai' ? <Bot className="w-4 h-4" /> :
                   n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                   <Bell className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-200">{n.title}</span>
                    <span className="text-[10px] text-gray-500">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
