import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Type, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  ZapOff, 
  Sliders, 
  Check, 
  RotateCcw,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface AccessibilitySettings {
  textSize: 'normal' | 'large' | 'xl';
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  focusMode: boolean;
  theme: 'dark' | 'high_contrast_dark';
}

const STORAGE_KEY = 'buzzing_brain_accessibility_settings';

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return {
      textSize: 'normal',
      dyslexiaFont: false,
      reducedMotion: false,
      highContrast: false,
      focusMode: false,
      theme: 'dark',
    };
  });

  // Save settings across sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Apply settings to document root
  useEffect(() => {
    const root = document.documentElement;

    // Text size
    root.classList.remove('text-size-large', 'text-size-xl');
    if (settings.textSize === 'large') root.classList.add('text-size-large');
    if (settings.textSize === 'xl') root.classList.add('text-size-xl');

    // Dyslexia friendly font
    if (settings.dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Focus mode
    if (settings.focusMode) {
      root.classList.add('focus-study-mode');
    } else {
      root.classList.remove('focus-study-mode');
    }
  }, [settings]);

  // Speech Reader for Selected Text or Page Summary
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const selectedText = window.getSelection()?.toString().trim();
    const textToSpeak = selectedText || 
      'Buzzing Brain — Free Education for All. Open NCERT Digital Books, Authentic Handwritten Notes Engine, YouTube Learning, and Student Study Portal.';

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleReset = () => {
    setSettings({
      textSize: 'normal',
      dyslexiaFont: false,
      reducedMotion: false,
      highContrast: false,
      focusMode: false,
      theme: 'dark',
    });
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 print:hidden">
      {/* Floating Toggle Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/20 shadow-xl backdrop-blur-md text-xs font-semibold transition-all cursor-pointer"
        title="Accessibility, Text Size, Dyslexia Font & Read Aloud Settings"
      >
        <Eye className="w-4 h-4 text-amber-400" />
        <span className="hidden sm:inline">Accessibility</span>
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div className="absolute bottom-12 left-0 w-80 p-4 rounded-3xl bg-slate-950/95 border border-white/20 shadow-2xl backdrop-blur-xl space-y-4 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Inclusive Learning Tools</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="text-[10px] text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                title="Reset to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Text Size Scale */}
          <div className="space-y-1.5">
            <span className="text-slate-400 font-semibold block">Text Size &amp; Readability:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['normal', 'large', 'xl'] as const).map(sz => (
                <button
                  key={sz}
                  onClick={() => setSettings(s => ({ ...s, textSize: sz }))}
                  className={`py-1.5 px-2 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                    settings.textSize === sz
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {sz === 'normal' ? 'Normal' : sz === 'large' ? 'Large A+' : 'Extra A++'}
                </button>
              ))}
            </div>
          </div>

          {/* Text to Speech Read-Aloud */}
          <div className="flex items-center justify-between py-1 bg-white/5 p-2 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-white font-medium block">Text-to-Speech (TTS):</span>
              <span className="text-[10px] text-slate-400">Select any text or click to read</span>
            </div>
            <button
              onClick={handleToggleSpeech}
              className={`p-2 rounded-xl font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                isSpeaking 
                  ? 'bg-amber-400 text-slate-950 animate-pulse' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Dyslexia-Friendly High-Legibility Font Toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-300">Dyslexia-Friendly Font:</span>
            <button
              onClick={() => setSettings(s => ({ ...s, dyslexiaFont: !s.dyslexiaFont }))}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.dyslexiaFont ? 'bg-amber-400' : 'bg-white/20'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                settings.dyslexiaFont ? 'left-5.5' : 'left-0.5'
              }`} />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-300">Reduced Motion:</span>
            <button
              onClick={() => setSettings(s => ({ ...s, reducedMotion: !s.reducedMotion }))}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.reducedMotion ? 'bg-amber-400' : 'bg-white/20'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                settings.reducedMotion ? 'left-5.5' : 'left-0.5'
              }`} />
            </button>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-300">High Contrast Mode:</span>
            <button
              onClick={() => setSettings(s => ({ ...s, highContrast: !s.highContrast }))}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.highContrast ? 'bg-amber-400' : 'bg-white/20'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                settings.highContrast ? 'left-5.5' : 'left-0.5'
              }`} />
            </button>
          </div>

          {/* Deep Focus Study Mode (Hide starfield backgrounds for zero distraction) */}
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-300">Deep Focus (Zero Distractions):</span>
            <button
              onClick={() => setSettings(s => ({ ...s, focusMode: !s.focusMode }))}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.focusMode ? 'bg-amber-400' : 'bg-white/20'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                settings.focusMode ? 'left-5.5' : 'left-0.5'
              }`} />
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] text-slate-500 font-mono text-center">
            Settings persist automatically in local storage
          </div>
        </div>
      )}
    </div>
  );
};
