"use client";

import React from "react";
import { PageSettings } from "@/types/builder";
import CustomSelect from "../custom-select";
import SectionHeader, { OptionViewMode, renderSectionIcon } from "./section-header";

interface LayoutSettingsSectionProps {
  pageSettings: PageSettings;
  onUpdatePageSettings: (updates: Partial<PageSettings>) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  viewMode?: OptionViewMode;
}

export default function LayoutSettingsSection({
  pageSettings,
  onUpdatePageSettings,
  isExpanded = true,
  onToggle = () => {},
  viewMode = "tabs",
}: LayoutSettingsSectionProps) {
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
          title="Page Layout & Spacing"
          subtitle="Width containment, gaps & padding"
          icon="layout"
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
                  {renderSectionIcon("layout")}
                </div>
                <h3 className="text-xs font-bold text-foreground">Page Layout & Spacing</h3>
              </div>
              <p className="text-[10px] text-text-muted mt-[2px]">Configure layout width limits, outer padding, and element gaps.</p>
            </div>
          )}

          <div className="flex flex-col gap-xs">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Page Containment Width
            </label>
            <CustomSelect
              value={pageSettings.widthMode || "boxed-md"}
              onChange={(val) => onUpdatePageSettings({ widthMode: val as PageSettings["widthMode"] })}
              options={[
                { value: "boxed-md", label: "Boxed Portfolio (768px)" },
                { value: "boxed-lg", label: "Boxed Showcase (1024px)" },
                { value: "boxed-xl", label: "Wide Desktop (1280px)" },
                { value: "full", label: "Full Width (100%)" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Page Outer Padding
            </label>
            <CustomSelect
              value={pageSettings.padding || "space-lg"}
              onChange={(val) => onUpdatePageSettings({ padding: val })}
              options={[
                { value: "space-none", label: "No Padding (0px)" },
                { value: "space-xs", label: "Extra Small (4px)" },
                { value: "space-sm", label: "Small (8px)" },
                { value: "space-md", label: "Medium (16px)" },
                { value: "space-lg", label: "Standard (24px)" },
                { value: "space-xl", label: "Large (32px)" },
                { value: "space-2xl", label: "Extra Large (48px)" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Vertical Layout Gap
            </label>
            <CustomSelect
              value={pageSettings.gap || "space-lg"}
              onChange={(val) => onUpdatePageSettings({ gap: val })}
              options={[
                { value: "space-none", label: "No Gap (0px)" },
                { value: "space-xs", label: "Extra Small (4px)" },
                { value: "space-sm", label: "Small (8px)" },
                { value: "space-md", label: "Medium (16px)" },
                { value: "space-lg", label: "Standard (24px)" },
                { value: "space-xl", label: "Large (32px)" },
                { value: "space-2xl", label: "Extra Large (48px)" },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
