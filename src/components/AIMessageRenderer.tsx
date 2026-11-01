import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface AIMessageRendererProps {
  content: string;
  className?: string;
  onExecuteCommand?: (command: string) => void;
}

/**
 * Clean malformed artifacts like accidental ")!//" or broken delimiters
 */
function sanitizeAiMathText(raw: string): string {
  if (!raw) return '';
  return raw
    // Clean accidental )!// trailing bugs
    .replace(/\)!(\/\/)?/g, ')')
    // Fix isolated single backslash inline math if improperly escaped
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');
}

export const AIMessageRenderer: React.FC<AIMessageRendererProps> = ({
  content,
  className = '',
  onExecuteCommand,
}) => {
  const sanitized = sanitizeAiMathText(content);

  // Check if there is a /handwriting command in the text
  const hwMatch = content.match(/\/handwriting\s+[^\n`]+/i);
  const detectedCommand = hwMatch ? hwMatch[0].replace(/[`"']/g, '').trim() : null;

  return (
    <div className={`ai-message-markdown space-y-2.5 text-xs leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-base font-bold text-amber-300 mt-2 mb-1" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-sm font-bold text-amber-200 mt-2 mb-1" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xs font-bold text-purple-300 mt-1.5 mb-0.5" {...props} />,
          p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 mb-2" {...props} />,
          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-amber-200 dark:text-amber-300" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-3 border-purple-500 bg-purple-500/10 px-3 py-1.5 rounded-r-lg my-2 italic text-purple-200" {...props} />
          ),
          code: ({ node, inline, className: codeClass, children, ...props }: any) => {
            const codeText = String(children || '');
            if (codeText.startsWith('/handwriting') && onExecuteCommand) {
              return (
                <span className="inline-flex items-center gap-1.5 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40 text-purple-200 font-mono text-[11px]">
                  <span>{codeText}</span>
                  <button
                    type="button"
                    onClick={() => onExecuteCommand(codeText)}
                    className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded font-bold text-[9px] hover:bg-amber-300 cursor-pointer"
                  >
                    Run
                  </button>
                </span>
              );
            }
            if (inline) {
              return (
                <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono text-[11px]" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-slate-950 p-3 rounded-xl border border-white/10 overflow-x-auto font-mono text-[11px] text-amber-300 my-2">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-2 rounded-xl border border-white/10">
              <table className="w-full text-left text-xs border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => <th className="bg-white/10 p-2 font-bold border-b border-white/10 text-amber-300" {...props} />,
          td: ({ node, ...props }) => <td className="p-2 border-b border-white/5" {...props} />,
        }}
      >
        {sanitized}
      </ReactMarkdown>

      {/* Detected /handwriting command action card */}
      {detectedCommand && onExecuteCommand && (
        <div className="p-2.5 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/40 rounded-xl flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[10px] bg-purple-800/80 text-purple-200 px-1.5 py-0.5 rounded font-mono">
              Note Command
            </span>
            <span className="text-[11px] font-mono text-purple-300 truncate">
              {detectedCommand}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onExecuteCommand(detectedCommand)}
            className="shrink-0 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-[10px] shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <span>Synthesize Notes</span>
          </button>
        </div>
      )}
    </div>
  );
};
