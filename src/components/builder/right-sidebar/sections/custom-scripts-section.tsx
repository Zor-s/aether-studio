"use client";

import React from "react";
import { PageSettings } from "@/types/builder";
import SectionHeader, { OptionViewMode, renderSectionIcon } from "./section-header";

interface CustomScriptsSectionProps {
  pageSettings: PageSettings;
  onUpdatePageSettings: (updates: Partial<PageSettings>) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  viewMode?: OptionViewMode;
}

export default function CustomScriptsSection({
  pageSettings,
  onUpdatePageSettings,
  isExpanded = true,
  onToggle = () => {},
  viewMode = "tabs",
}: CustomScriptsSectionProps) {
  const containerClasses =
    viewMode === "tabs"
      ? "flex flex-col gap-md"
      : viewMode === "glass"
      ? `border border-panel-border/60 rounded-xl bg-background/20 transition-all duration-200 shrink-0 ${
          isExpanded ? "overflow-visible shadow-sm border-cyan-active/30" : "overflow-hidden hover:border-panel-border"
        }`
      : `border-b border-panel-border/30 transition-all duration-200 shrink-0 ${
          isExpanded ? "bg-panel/40" : ""
        }`;

  return (
    <div className={containerClasses}>
      {viewMode !== "tabs" && (
        <SectionHeader
          title="Custom Scripts (JS)"
          subtitle="Inject header scripts & analytics"
          icon="scripts"
          isExpanded={isExpanded}
          onToggle={onToggle}
          viewMode={viewMode}
        />
      )}

      {(isExpanded || viewMode === "tabs") && (
        <div className={`flex flex-col gap-md animate-slideDown ${viewMode !== "tabs" ? "p-md border-t border-panel-border/20 bg-panel/30" : ""}`}>
          {viewMode === "tabs" && (
            <div className="flex flex-col gap-[2px] pb-xs border-b border-panel-border/30">
              <div className="flex items-center gap-xs">
                <div className="p-xs rounded-lg bg-cyan-active/10 text-cyan-active shrink-0">
                  {renderSectionIcon("scripts")}
                </div>
                <h3 className="text-xs font-bold text-foreground">Custom Client Scripts (JS)</h3>
              </div>
              <p className="text-[10px] text-text-muted mt-[2px]">Inject header scripts, analytics tags, or custom tracking code.</p>
            </div>
          )}

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
