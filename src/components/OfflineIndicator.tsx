import React from 'react';
import { WifiOff, Database, Check } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 border border-amber-500/50 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="relative flex items-center justify-center">
        <WifiOff className="w-4 h-4 text-amber-400" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 animate-ping" />
      </div>
      <div className="flex flex-col">
        <span className="text-amber-300 flex items-center gap-1">
          <span>Offline Study Mode</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-mono">PWA Cache</span>
        </span>
        <span className="text-[11px] text-slate-300 font-normal">
          Viewing local notes library without internet
        </span>
      </div>
    </div>
  );
};
