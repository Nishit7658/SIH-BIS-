import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Pre-processes raw text to clean up LaTeX math escapes and formatting artifacts
 * so they render cleanly as standard unicode symbols in HTML.
 */
function cleanMarkdown(raw: string): string {
  if (!raw) return "";

  let text = raw;

  // Replace common LaTeX symbols with clean unicode
  text = text.replace(/\\le\b/g, "≤");
  text = text.replace(/\\ge\b/g, "≥");
  text = text.replace(/\\pm\b/g, "±");
  text = text.replace(/\\times\b/g, "×");
  text = text.replace(/\\circ\b/g, "°");
  text = text.replace(/\\text\{([^}]+)\}/g, "$1");
  text = text.replace(/\\mathbf\{([^}]+)\}/g, "$1");
  text = text.replace(/\\mathrm\{([^}]+)\}/g, "$1");
  text = text.replace(/\$([^$]+)\$/g, "$1"); // remove inline dollar signs

  return text;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const cleaned = cleanMarkdown(content);

  return (
    <div className="text-gov-text text-xs sm:text-sm leading-relaxed space-y-3 max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-bold font-serif text-gov-navy border-b border-gov-border pb-2 mt-4 mb-2 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 bg-gov-navy rounded-xs"></span>
              <span>{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-bold font-serif text-gov-navy mt-4 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => {
            const headingText = String(children);
            const isStandard = /IS\s+\d+/i.test(headingText);
            return (
              <div className="mt-5 mb-2.5 pt-3 first:mt-1 first:pt-0">
                <div
                  className={`p-2.5 rounded-sm border flex items-center justify-between gap-2 ${
                    isStandard
                      ? "bg-slate-50 border-slate-300 text-gov-navy"
                      : "bg-gov-paper border-gov-border text-gov-navy"
                  }`}
                >
                  <h3 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wide flex items-center gap-2 m-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                    <span>{children}</span>
                  </h3>
                  {isStandard && (
                    <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-700">
                      Gazetted Standard
                    </span>
                  )}
                </div>
              </div>
            );
          },
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-xs font-bold uppercase tracking-wider text-slate-700 mt-3 mb-1.5 flex items-center gap-1.5">
              <span className="text-amber-700">▸</span>
              <span>{children}</span>
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-2 leading-relaxed text-slate-800 last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gov-navy">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="my-2 space-y-1.5 pl-4 list-disc list-outside text-slate-800 marker:text-slate-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 space-y-1.5 pl-4 list-decimal list-outside text-slate-800 marker:text-slate-500 font-mono text-xs">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-0.5">{children}</li>
          ),
          hr: () => (
            <hr className="my-5 border-t border-dashed border-slate-300" />
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-gov-navy pl-3 py-1 my-2 bg-slate-50 text-slate-700 italic text-xs">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-900 font-mono text-[11px]">
              {children}
            </code>
          ),
          // Styled Responsive Government Table
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded border border-slate-300 shadow-xs bg-white">
              <table className="min-w-full text-left border-collapse text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 border-b border-slate-300 text-gov-navy font-mono font-semibold">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-200">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-amber-50/40 transition-colors even:bg-slate-50/50">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-[11px] font-bold text-gov-navy uppercase tracking-wider border-r border-slate-200 last:border-r-0 whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-[11px] text-slate-800 border-r border-slate-200 last:border-r-0 whitespace-nowrap">
              {children}
            </td>
          ),
        }}
      >
        {cleaned}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
