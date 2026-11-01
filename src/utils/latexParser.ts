import katex from 'katex';

/**
 * Safely renders LaTeX string using KaTeX
 */
export function renderLatex(latex: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
    });
  } catch (err) {
    console.warn('KaTeX render error:', err);
    return `<span class="text-red-500 font-mono text-sm">${latex}</span>`;
  }
}

/**
 * Replaces inline $...$ and block $$...$$ with rendered KaTeX markup
 */
export function parseMathInText(text: string): string {
  if (!text) return '';

  // First replace block equations: $$...$$
  let processed = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, equation) => {
    return `<div class="katex-display-wrapper my-3 overflow-x-auto text-center">${renderLatex(equation, true)}</div>`;
  });

  // Then replace inline math: $...$
  // Make sure not to match empty or escaped \$
  processed = processed.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, (_, equation) => {
    return renderLatex(equation, false);
  });

  // Handle bold **text**
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-inherit">$1</strong>');

  // Handle italics *text* or _text_
  processed = processed.replace(/(?<!\*)\*([^\*\n]+?)\*(?!\*)/g, '<em class="italic text-inherit">$1</em>');

  // Handle ==highlight== if present
  processed = processed.replace(/==(.*?)==/g, '<mark class="highlight-yellow">$1</mark>');

  return processed;
}

/**
 * Categorizes and formats lines or blocks for the Topper Register layout
 */
export interface NoteSection {
  type: 'header' | 'learning_objective' | 'section' | 'subsection' | 'bullet' | 'margin_note' | 'formula_key' | 'diagram_blueprint' | 'revision_summary' | 'paragraph';
  content: string;
  rawText: string;
  level?: number;
  alertType?: 'exam_alert' | 'pitfall' | 'mnemonic' | 'five_star' | 'general';
}

export function parseNoteMarkdown(markdown: string): NoteSection[] {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const sections: NoteSection[] = [];

  let inDiagramBlueprint = false;
  let diagramContent: string[] = [];

  let inRevisionSummary = false;
  let revisionItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) continue;

    // Check for Section Headers
    if (trimmed.startsWith('# ')) {
      inDiagramBlueprint = false;
      inRevisionSummary = false;
      sections.push({
        type: 'header',
        content: trimmed.replace(/^#\s+/, ''),
        rawText: trimmed,
      });
      continue;
    }

    // Check for Learning Objective
    if (trimmed.startsWith('*Learning Objective:') || (trimmed.startsWith('*') && trimmed.endsWith('*') && trimmed.toLowerCase().includes('objective'))) {
      sections.push({
        type: 'learning_objective',
        content: trimmed.replace(/^\*+|\*+$/g, ''),
        rawText: trimmed,
      });
      continue;
    }

    // Check for Diagram Blueprint section
    if (trimmed.toLowerCase().includes('visual reference / diagram blueprint') || trimmed.toLowerCase().includes('diagram blueprint')) {
      inDiagramBlueprint = true;
      inRevisionSummary = false;
      diagramContent = [];
      continue;
    }

    // Check for Quick Revision Summary
    if (trimmed.toLowerCase().includes('quick revision summary')) {
      inDiagramBlueprint = false;
      inRevisionSummary = true;
      revisionItems = [];
      continue;
    }

    // If inside diagram blueprint
    if (inDiagramBlueprint) {
      if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
        inDiagramBlueprint = false;
        // flush diagram section
        sections.push({
          type: 'diagram_blueprint',
          content: diagramContent.join('\n'),
          rawText: diagramContent.join('\n'),
        });
        // reprocess header
        i--;
        continue;
      } else {
        diagramContent.push(line);
        continue;
      }
    }

    // If inside revision summary
    if (inRevisionSummary) {
      if (trimmed.startsWith('## ') && !trimmed.toLowerCase().includes('revision')) {
        inRevisionSummary = false;
        sections.push({
          type: 'revision_summary',
          content: revisionItems.join('\n'),
          rawText: revisionItems.join('\n'),
        });
        i--;
        continue;
      } else {
        revisionItems.push(line);
        continue;
      }
    }

    // Check for Red Margin Callouts
    const isAlert = 
      trimmed.includes('[EXAM ALERT]') ||
      trimmed.includes('⚠️ Common Pitfall:') ||
      trimmed.includes('⚠️') ||
      trimmed.includes('💡 Topper\'s Mnemonic:') ||
      trimmed.includes('💡 Mnemonic:') ||
      trimmed.includes('⭐ 5-Mark Question Favorite:') ||
      trimmed.includes('⭐ Exam Favorite:');

    if (isAlert) {
      let alertType: NoteSection['alertType'] = 'general';
      if (trimmed.includes('[EXAM ALERT]') || trimmed.includes('EXAM ALERT')) alertType = 'exam_alert';
      else if (trimmed.includes('Common Pitfall') || trimmed.includes('⚠️')) alertType = 'pitfall';
      else if (trimmed.includes('Mnemonic') || trimmed.includes('💡')) alertType = 'mnemonic';
      else if (trimmed.includes('5-Mark') || trimmed.includes('⭐')) alertType = 'five_star';

      sections.push({
        type: 'margin_note',
        content: trimmed,
        rawText: trimmed,
        alertType,
      });
      continue;
    }

    // Section 2: ##
    if (trimmed.startsWith('## ')) {
      sections.push({
        type: 'section',
        content: trimmed.replace(/^##\s+/, ''),
        rawText: trimmed,
        level: 2,
      });
      continue;
    }

    // Subsection 3: ###
    if (trimmed.startsWith('### ')) {
      sections.push({
        type: 'subsection',
        content: trimmed.replace(/^###\s+/, ''),
        rawText: trimmed,
        level: 3,
      });
      continue;
    }

    // Formula Variable Key
    if (trimmed.startsWith('Where:') || trimmed.startsWith('**Where:**') || trimmed.startsWith('*Where:*')) {
      sections.push({
        type: 'formula_key',
        content: trimmed,
        rawText: trimmed,
      });
      continue;
    }

    // Bullet points
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ') || /^\d+\.\s/.test(trimmed)) {
      sections.push({
        type: 'bullet',
        content: trimmed.replace(/^[-*•]\s+|\d+\.\s+/, ''),
        rawText: trimmed,
      });
      continue;
    }

    // Normal paragraph or block formula
    sections.push({
      type: 'paragraph',
      content: trimmed,
      rawText: trimmed,
    });
  }

  // Flush any lingering blocks
  if (inDiagramBlueprint && diagramContent.length > 0) {
    sections.push({
      type: 'diagram_blueprint',
      content: diagramContent.join('\n'),
      rawText: diagramContent.join('\n'),
    });
  }

  if (inRevisionSummary && revisionItems.length > 0) {
    sections.push({
      type: 'revision_summary',
      content: revisionItems.join('\n'),
      rawText: revisionItems.join('\n'),
    });
  }

  return sections;
}
