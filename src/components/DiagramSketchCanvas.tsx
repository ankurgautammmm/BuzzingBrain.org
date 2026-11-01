import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Sparkles, Undo2, Trash2, Download, Image as ImageIcon, Check } from 'lucide-react';

interface DiagramSketchCanvasProps {
  blueprintPrompt: string;
  topic: string;
  existingImageUrl?: string;
  onImageGenerated?: (imageUrl: string) => void;
}

export const DiagramSketchCanvas: React.FC<DiagramSketchCanvasProps> = ({
  blueprintPrompt,
  topic,
  existingImageUrl,
  onImageGenerated,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#1e40af'); // blue ink
  const [penWidth, setPenWidth] = useState(2);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(existingImageUrl || null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'canvas'>('ai');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    if (existingImageUrl) {
      setAiImageUrl(existingImageUrl);
    }
  }, [existingImageUrl]);

  // Initialize canvas
  useEffect(() => {
    if (activeTab === 'canvas' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx && history.length === 0) {
        // Draw light ruled paper guidelines
        ctx.fillStyle = '#fffdfa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        for (let y = 24; y < canvas.height; y += 24) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        // Save initial blank state
        setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      }
    }
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save to history for undo
    setHistory((prev) => [...prev.slice(-15), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = history.slice(0, -1);
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#fffdfa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let y = 24; y < canvas.height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const handleGenerateAiDiagram = async () => {
    try {
      setIsGeneratingAi(true);
      setGenerationError(null);
      const res = await fetch('/api/notes/diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          blueprintPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate diagram illustration');
      }

      setAiImageUrl(data.imageUrl);
      if (onImageGenerated) {
        onImageGenerated(data.imageUrl);
      }
      setActiveTab('ai');
    } catch (err: any) {
      setGenerationError(err?.message || 'Could not generate diagram sketch.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(blueprintPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 p-4 sm:p-5 text-[#2c3e50] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/70 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white shadow-sm">
            <Pencil className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-hand-kalam text-lg sm:text-xl font-bold tracking-wide text-sky-950">
              Visual Blueprint & Diagram Sketch
            </h4>
            <p className="text-xs text-sky-800 font-sans-clean">
              Exact structural elements, labels & notebook drawing instructions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-sky-100/80 p-1 font-sans-clean text-xs">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
              activeTab === 'ai'
                ? 'bg-white text-sky-900 shadow-xs font-semibold'
                : 'text-sky-700 hover:text-sky-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            AI Sketch
          </button>
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
              activeTab === 'canvas'
                ? 'bg-white text-sky-900 shadow-xs font-semibold'
                : 'text-sky-700 hover:text-sky-900'
            }`}
          >
            <Pencil className="h-3.5 w-3.5" />
            Hand Sketchpad
          </button>
        </div>
      </div>

      {/* Blueprint Prompt Box */}
      <div className="mt-3 rounded-lg bg-white/80 p-3.5 border border-sky-100 shadow-2xs font-sans-clean">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
          <span className="flex items-center gap-1 text-sky-700 font-semibold uppercase tracking-wider text-[11px]">
            <ImageIcon className="h-3 w-3" /> Note Stylist Blueprint Prompt
          </span>
          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-1 text-slate-500 hover:text-sky-700 transition"
          >
            {copiedPrompt ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <span>Copy Prompt</span>
            )}
          </button>
        </div>
        <p className="font-hand-patrick text-sm sm:text-base leading-relaxed text-slate-700 italic">
          "{blueprintPrompt}"
        </p>
      </div>

      {/* AI View vs Canvas View */}
      <div className="mt-4">
        {activeTab === 'ai' ? (
          <div className="space-y-3">
            {aiImageUrl ? (
              <div className="overflow-hidden rounded-xl border border-sky-200 bg-white shadow-sm">
                <div className="bg-slate-100 px-3 py-1.5 text-[11px] font-sans-clean font-medium text-slate-600 flex items-center justify-between">
                  <span>Topper's Register Handwritten Diagram</span>
                  <a
                    href={aiImageUrl}
                    download={`${topic.replace(/\s+/g, '_')}_diagram.png`}
                    className="flex items-center gap-1 text-sky-700 hover:underline"
                  >
                    <Download className="h-3 w-3" /> Save Image
                  </a>
                </div>
                <img
                  src={aiImageUrl}
                  alt={`Handwritten diagram for ${topic}`}
                  className="w-full max-h-[460px] object-contain bg-[#fdfbf7]"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-200 bg-white/60 p-6 sm:p-8 text-center font-sans-clean">
                <Sparkles className="h-8 w-8 text-sky-500 mb-2 animate-pulse" />
                <h5 className="font-semibold text-slate-800 text-sm sm:text-base">
                  Visualize this Diagram on Lined Register Paper
                </h5>
                <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
                  Generate a hand-drawn ballpoint & highlighter style diagram matching the visual blueprint prompt using Gemini image generation.
                </p>
                <button
                  onClick={handleGenerateAiDiagram}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-sky-700 disabled:opacity-50 transition"
                >
                  {isGeneratingAi ? (
                    <>
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sketching Diagram on Paper...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Realistic Handwritten Diagram
                    </>
                  )}
                </button>
              </div>
            )}

            {generationError && (
              <div className="rounded-md bg-red-50 p-2.5 text-xs text-red-600 border border-red-200 font-sans-clean">
                ⚠️ {generationError}
              </div>
            )}

            {aiImageUrl && (
              <div className="flex justify-end font-sans-clean">
                <button
                  onClick={handleGenerateAiDiagram}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-900 font-medium py-1 px-2"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isGeneratingAi ? 'Regenerating...' : 'Regenerate Diagram Variation'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 font-sans-clean">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white/80 p-2 rounded-lg border border-sky-200 text-xs">
              {/* Color pickers */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[11px] font-medium mr-1">Ink:</span>
                {[
                  { color: '#1e40af', label: 'Gel Blue' },
                  { color: '#111827', label: 'Ballpoint Black' },
                  { color: '#dc2626', label: 'Exam Red' },
                  { color: '#15803d', label: 'Green' },
                  { color: '#eab308', label: 'Highlighter' },
                ].map((item) => (
                  <button
                    key={item.color}
                    onClick={() => {
                      setPenColor(item.color);
                      if (item.color === '#eab308') setPenWidth(8);
                      else if (penWidth > 4) setPenWidth(2);
                    }}
                    title={item.label}
                    className={`h-5 w-5 rounded-full border border-slate-300 transition ${
                      penColor === item.color ? 'ring-2 ring-sky-500 scale-110' : ''
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                ))}
              </div>

              {/* Stroke width */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPenWidth(2)}
                  className={`px-2 py-0.5 rounded text-[11px] ${penWidth === 2 ? 'bg-sky-200 font-bold' : 'bg-slate-100'}`}
                >
                  Fine
                </button>
                <button
                  onClick={() => setPenWidth(4)}
                  className={`px-2 py-0.5 rounded text-[11px] ${penWidth === 4 ? 'bg-sky-200 font-bold' : 'bg-slate-100'}`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setPenWidth(8)}
                  className={`px-2 py-0.5 rounded text-[11px] ${penWidth === 8 ? 'bg-sky-200 font-bold' : 'bg-slate-100'}`}
                >
                  Broad
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={undo}
                  title="Undo last stroke"
                  className="p-1 rounded hover:bg-slate-200 text-slate-700"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={clearCanvas}
                  title="Clear sketchpad"
                  className="p-1 rounded hover:bg-red-100 text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-sky-300 shadow-inner bg-[#fffdfa] touch-none">
              <canvas
                ref={canvasRef}
                width={700}
                height={320}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[280px] sm:h-[320px] cursor-crosshair"
              />
            </div>
            <p className="text-[11px] text-slate-500 italic text-center">
              💡 Use your mouse, stylus, or finger to draw arrows, flowcharts, or formulas right on the notebook paper.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
