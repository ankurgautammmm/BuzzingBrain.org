import React, { useState } from 'react';
import { Download, Sparkles, X, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, suppress button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop Install Flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
        title="Install Buzzing Brain PWA for offline studying"
      >
        <Download className="w-3.5 h-3.5 text-slate-950" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari Flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/20 p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-black text-sm">
                    BB
                  </div>
                  <h3 className="text-base font-bold text-white">Install Buzzing Brain</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>Install on your iPhone or iPad for offline notes reading and instant home-screen access:</p>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0">1</span>
                    <span className="flex items-center gap-1">Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline text-blue-400" /> in Safari.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0">2</span>
                    <span className="flex items-center gap-1">Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-amber-400" />.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-white hover:bg-slate-200 text-slate-950 py-2.5 text-xs font-bold transition shadow-md"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
