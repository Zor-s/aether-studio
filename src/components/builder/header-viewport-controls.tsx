"use client";

import React from "react";

interface HeaderViewportControlsProps {
  activeDevice: "desktop" | "tablet" | "mobile";
  setActiveDevice: (device: "desktop" | "tablet" | "mobile") => void;
  previewMode: boolean;
}

export default function HeaderViewportControls({
  activeDevice,
  setActiveDevice,
  previewMode,
}: HeaderViewportControlsProps) {
  return (
    <div className="flex items-center gap-xs sm:gap-sm shrink-0">
      {previewMode && (
        <div className="hidden lg:flex items-center gap-xs text-xs font-medium text-cyan-active bg-cyan-active/10 border border-cyan-active/20 px-sm py-xs rounded-lg select-none">
          <span className="w-2 h-2 rounded-full bg-cyan-active animate-pulse" />
          Live Interactive Preview Mode
        </div>
      )}
      <div className="flex items-center bg-background border border-panel-border rounded-lg p-[2px] sm:p-[3px] shadow-inner">
        <button
          type="button"
          onClick={() => setActiveDevice("desktop")}
          className={`px-1.5 sm:px-sm py-1 sm:py-xs rounded-md flex items-center gap-xs text-xs font-medium transition-all duration-200 cursor-pointer ${
            activeDevice === "desktop"
              ? "bg-panel text-cyan-active shadow-sm"
              : "text-text-muted hover:text-foreground"
          }`}
          title="Desktop View (100% width)"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="hidden md:inline">Desktop</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveDevice("tablet")}
          className={`px-1.5 sm:px-sm py-1 sm:py-xs rounded-md flex items-center gap-xs text-xs font-medium transition-all duration-200 cursor-pointer ${
            activeDevice === "tablet"
              ? "bg-panel text-cyan-active shadow-sm"
              : "text-text-muted hover:text-foreground"
          }`}
          title="Tablet View (768px width)"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span className="hidden md:inline">Tablet</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveDevice("mobile")}
          className={`px-1.5 sm:px-sm py-1 sm:py-xs rounded-md flex items-center gap-xs text-xs font-medium transition-all duration-200 cursor-pointer ${
            activeDevice === "mobile"
              ? "bg-panel text-cyan-active shadow-sm"
              : "text-text-muted hover:text-foreground"
          }`}
          title="Mobile View (375px width)"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span className="hidden md:inline">Mobile</span>
        </button>
      </div>
    </div>
  );
}
