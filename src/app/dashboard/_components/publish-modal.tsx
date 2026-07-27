"use client";

import React from "react";

interface PublishModalProps {
  publishStep: number;
  copied: boolean;
  onCopyLink: () => void;
  onViewHtml: () => void;
  onClose: () => void;
}

/**
 * PublishModal — presentational component.
 * Receives all state + callbacks from DashboardPage.
 * Displays the 3-step publish progress and success layout.
 */
export function PublishModal({
  publishStep,
  copied,
  onCopyLink,
  onViewHtml,
  onClose,
}: PublishModalProps) {
  const steps = [
    {
      label: "Compile Visual Canvas Layout",
      description: "Serializing workspace nodes to semantic HTML elements.",
    },
    {
      label: "Upload Assets to Cloudflare R2",
      description: "Streaming bundles and HTML payload directly to object storage.",
    },
    {
      label: "Purge Edge CDN Cache Pools",
      description: "Invalidating global caches to reflect latest portfolio changes.",
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-fadeIn">
      <div className="bg-panel border border-panel-border rounded-2xl w-full max-w-[448px] shadow-2xl p-md sm:p-lg flex flex-col gap-md relative overflow-y-auto max-h-[calc(100vh-2rem)] custom-scrollbar">
        {/* Modal Header */}
        <div className="flex flex-col gap-xs">
          <h3 className="text-lg font-bold text-foreground">Publishing to Cloudflare Edge</h3>
          <p className="text-xs text-text-muted">Deploying optimized design payload globally.</p>
        </div>

        {/* Steps Container */}
        <div className="flex flex-col gap-sm my-xs">
          {steps.map((step, idx) => {
            const stepNumber = idx + 1;
            return (
              <div key={stepNumber} className="flex items-start gap-sm">
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-300">
                  {publishStep > stepNumber ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                  ) : publishStep === stepNumber ? (
                    <span className="w-5 h-5 border-2 border-cyan-active border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-background border border-panel-border text-text-muted flex items-center justify-center">
                      {stepNumber}
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col leading-snug">
                  <span className={`text-xs font-bold ${publishStep >= stepNumber ? "text-foreground" : "text-text-muted"}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-text-muted mt-[4px]">{step.description}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        {publishStep < 4 && (
          <div className="w-full h-1.5 bg-background border border-panel-border rounded-full overflow-hidden shrink-0">
            <div
              className="h-full bg-cyan-active transition-all duration-300 ease-out"
              style={{ width: `${(publishStep / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Success Layout */}
        {publishStep === 4 && (
          <div className="flex flex-col gap-sm p-sm bg-emerald-500/5 border border-emerald-500/10 rounded-xl mt-xs animate-slideDown">
            <div className="flex items-center gap-xs text-emerald-500">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-bold">Successfully Published Live!</span>
            </div>

            <div className="flex items-center justify-between gap-sm bg-background border border-panel-border rounded-lg p-xs pl-sm mt-xs">
              <span className="text-xs font-semibold text-foreground truncate select-all">
                alexmercer.aether.studio
              </span>
              <button
                onClick={onCopyLink}
                className={`px-sm py-xs text-[10px] font-bold rounded transition-all duration-200 cursor-pointer ${
                  copied
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/15"
                    : "bg-panel border border-panel-border text-text-muted hover:text-foreground hover:bg-accent-soft"
                }`}
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end gap-sm mt-xs border-t border-panel-border pt-md">
          {publishStep === 4 ? (
            <>
              <button
                onClick={onViewHtml}
                className="h-10 px-md rounded-lg text-xs font-bold text-cyan-active bg-cyan-active/10 hover:bg-cyan-active/15 flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                View HTML
              </button>
              <a
                href="https://alexmercer.aether.studio"
                target="_blank"
                rel="noreferrer"
                className="h-10 px-md rounded-lg text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/95 flex items-center justify-center shadow-md transition-all duration-200"
              >
                Visit Site
              </a>
              <button
                onClick={onClose}
                className="h-10 px-md rounded-lg text-xs font-semibold border border-panel-border text-text-muted hover:bg-accent-soft hover:text-foreground transition-all cursor-pointer"
              >
                Close
              </button>
            </>
          ) : (
            <button
              disabled
              className="h-10 px-md rounded-lg text-xs font-semibold border border-panel-border text-text-muted opacity-50 cursor-not-allowed flex items-center justify-center gap-xs"
            >
              <span className="w-3.5 h-3.5 border border-text-muted border-t-transparent rounded-full animate-spin" />
              Deploying...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
