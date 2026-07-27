"use client";

import React from "react";
import { PageSettings } from "@/types/builder";

interface SeoSettingsSectionProps {
  pageSettings: PageSettings;
  onUpdatePageSettings: (updates: Partial<PageSettings>) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function SeoSettingsSection({
  pageSettings,
  onUpdatePageSettings,
  isExpanded,
  onToggle,
}: SeoSettingsSectionProps) {
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
          <span className="text-cyan-active">🌐</span>
          <span>SEO & Metadata Settings</span>
        </div>
        <span className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
          ▶
        </span>
      </button>

      {isExpanded && (
        <div className="p-md border-t border-panel-border/40 flex flex-col gap-md bg-panel/30 animate-slideDown">
          <div className="flex flex-col gap-xs">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              SEO Title
            </label>
            <input
              type="text"
              value={pageSettings.seoTitle || ""}
              onChange={(e) => onUpdatePageSettings({ seoTitle: e.target.value })}
              placeholder="e.g. Alex Mercer | Portfolio"
              className="text-xs bg-background border border-panel-border rounded-lg px-sm py-[8px] text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                SEO Description
              </label>
              <span
                className={`text-[9px] font-mono ${
                  (pageSettings.seoDescription || "").length > 160
                    ? "text-amber-500 font-bold"
                    : "text-text-muted"
                }`}
              >
                {(pageSettings.seoDescription || "").length}/160
              </span>
            </div>
            <textarea
              value={pageSettings.seoDescription || ""}
              onChange={(e) => onUpdatePageSettings({ seoDescription: e.target.value })}
              rows={3}
              placeholder="Enter search engine meta description..."
              className="text-xs bg-background border border-panel-border rounded-lg p-sm text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 transition-all duration-200 resize-none"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Favicon URL
            </label>
            <input
              type="text"
              value={pageSettings.faviconUrl || ""}
              onChange={(e) => onUpdatePageSettings({ faviconUrl: e.target.value })}
              placeholder="https://example.com/favicon.ico"
              className="text-xs bg-background border border-panel-border rounded-lg px-sm py-[8px] text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 transition-all duration-200"
            />
            {pageSettings.faviconUrl && (
              <div className="flex items-center gap-xs mt-xs p-xs border border-panel-border rounded-lg bg-background/30 max-w-max">
                <span className="text-[9px] text-text-muted font-medium">Preview:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pageSettings.faviconUrl}
                  alt="Favicon preview"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                  className="w-4 h-4 object-contain rounded"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
