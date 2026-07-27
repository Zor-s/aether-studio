"use client";

import React from "react";
import { PageSettings } from "@/types/builder";

interface CustomScriptsSectionProps {
  pageSettings: PageSettings;
  onUpdatePageSettings: (updates: Partial<PageSettings>) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function CustomScriptsSection({
  pageSettings,
  onUpdatePageSettings,
  isExpanded,
  onToggle,
}: CustomScriptsSectionProps) {
  return (
    <div
      className={`border border-panel-border/60 rounded-xl bg-background/20 transition-all duration-200 shrink-0 ${
        isExpanded ? "overflow-visible" : "overflow-hidden"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-md text-xs font-bold text-foreground hover:bg-background/40 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-sm">
          <span className="text-cyan-active">⚡</span>
          <span>Custom Scripts (JS)</span>
        </div>
        <span className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
          ▶
        </span>
      </button>

      {isExpanded && (
        <div className="p-md border-t border-panel-border/40 flex flex-col gap-md bg-panel/30 animate-slideDown">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Custom Header JS
            </label>
            <span className="text-[9px] text-amber-500 font-bold">Client Scripts</span>
          </div>
          <textarea
            value={pageSettings.customJs || ""}
            onChange={(e) => onUpdatePageSettings({ customJs: e.target.value })}
            rows={4}
            placeholder="// Insert custom scripting, analytics, or meta code here..."
            className="text-xs font-mono bg-background border border-panel-border rounded-lg p-sm text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 transition-all duration-200 resize-none"
          />
        </div>
      )}
    </div>
  );
}
