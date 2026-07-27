"use client";

import React from "react";

interface ViewHtmlModalProps {
  compiledHtml: string;
  onCopyCode: () => void;
  onClose: () => void;
}

/**
 * ViewHtmlModal — presentational component.
 * Displays the compiled HTML source from usePublishState.
 * All state is owned by DashboardPage; this component is purely presentational.
 */
export function ViewHtmlModal({ compiledHtml, onCopyCode, onClose }: ViewHtmlModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-fadeIn">
      <div className="bg-panel border border-panel-border rounded-2xl w-full max-w-[672px] shadow-2xl p-md sm:p-lg flex flex-col gap-md relative overflow-hidden h-[calc(100vh-4rem)]">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-panel-border pb-md shrink-0">
          <div className="flex flex-col">
            <h3 className="text-md font-bold text-foreground">Compiled R2 HTML Build Source</h3>
            <p className="text-[11px] text-text-muted">
              Edge-optimized static layout stream with injected Google Fonts import header.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-foreground cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Code editor / container (Scrollable) */}
        <div className="flex-1 overflow-auto bg-dark-slate border border-panel-border/80 rounded-xl p-md font-mono text-[10px] text-cyan-active/90 select-all custom-scrollbar">
          <pre className="whitespace-pre">{compiledHtml}</pre>
        </div>

        {/* Footer controls */}
        <div className="flex justify-end items-center gap-sm border-t border-panel-border pt-md shrink-0">
          <button
            onClick={onCopyCode}
            className="h-9 px-md rounded-lg text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/95 flex items-center justify-center shadow-md shadow-cyan-active/15 transition-all cursor-pointer"
          >
            Copy Code
          </button>
          <button
            onClick={onClose}
            className="h-9 px-md rounded-lg text-xs font-semibold border border-panel-border text-text-muted hover:bg-accent-soft hover:text-foreground transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
