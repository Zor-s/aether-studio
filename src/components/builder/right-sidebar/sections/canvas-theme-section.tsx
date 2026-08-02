"use client";

import React from "react";
import { PageSettings } from "@/types/builder";
import ColorPicker from "../color-picker";
import FontPicker from "../font-picker";
import SectionHeader, { OptionViewMode, renderSectionIcon } from "./section-header";

interface CanvasThemeSectionProps {
  pageSettings: PageSettings;
  onUpdatePageSettings: (updates: Partial<PageSettings>) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  themePalette: NonNullable<PageSettings["themePalette"]>;
  viewMode?: OptionViewMode;
}

export default function CanvasThemeSection({
  pageSettings,
  onUpdatePageSettings,
  isExpanded = true,
  onToggle = () => {},
  themePalette,
  viewMode = "tabs",
}: CanvasThemeSectionProps) {
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
          title="Canvas Theme Colors & Font"
          subtitle="Base typography and backdrop fill"
          icon="typography"
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
                  {renderSectionIcon("typography")}
                </div>
                <h3 className="text-xs font-bold text-foreground">Canvas Theme & Typography</h3>
              </div>
              <p className="text-[10px] text-text-muted mt-[2px]">Configure default page font, backdrop color, and body text color.</p>
            </div>
          )}

          <div className="flex flex-col gap-xs">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Global Page Font
            </label>
            <FontPicker
              value={pageSettings.fontFamily || ""}
              defaultLabel="Default System Font (Inter)"
              defaultValue="Inter"
              onChange={(val) => onUpdatePageSettings({ fontFamily: val })}
            />
          </div>

          <div className="flex flex-col gap-sm bg-background/30 border border-panel-border/40 rounded-xl p-sm mt-xs">
            <div className="flex items-center justify-between gap-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground leading-snug">Page Background</span>
                <span className="text-[8px] text-text-muted mt-[4px] leading-normal">Overall backdrop color</span>
              </div>
              <div className="flex items-center gap-xs">
                <input
                  type="text"
                  value={pageSettings.backgroundColor || ""}
                  onChange={(e) => onUpdatePageSettings({ backgroundColor: e.target.value })}
                  className="w-14 text-[9px] font-mono text-center bg-background border border-panel-border rounded px-xs py-[2px] text-foreground focus:outline-none"
                />
                <ColorPicker
                  value={pageSettings.backgroundColor || "#ffffff"}
                  onChange={(val) => onUpdatePageSettings({ backgroundColor: val })}
                  themePalette={themePalette}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-sm border-t border-panel-border/20 pt-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground leading-snug">Body Text Color</span>
                <span className="text-[8px] text-[var(--brand-deep-teal)] dark:text-[var(--brand-sky-blue)] mt-[4px] leading-normal">Default text color fill</span>
              </div>
              <div className="flex items-center gap-xs">
                <input
                  type="text"
                  value={pageSettings.textColor || ""}
                  onChange={(e) => onUpdatePageSettings({ textColor: e.target.value })}
                  className="w-14 text-[9px] font-mono text-center bg-background border border-panel-border rounded px-xs py-[2px] text-foreground focus:outline-none"
                />
                <ColorPicker
                  value={pageSettings.textColor || "#01303f"}
                  onChange={(val) => onUpdatePageSettings({ textColor: val })}
                  themePalette={themePalette}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
