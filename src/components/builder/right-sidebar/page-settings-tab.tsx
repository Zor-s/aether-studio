"use client";

import React, { useState } from "react";
import { PageSettings } from "@/types/builder";
import SeoSettingsSection from "./sections/seo-settings-section";
import LayoutSettingsSection from "./sections/layout-settings-section";
import CanvasThemeSection from "./sections/canvas-theme-section";
import ThemePaletteSection from "./sections/theme-palette-section";
import CustomScriptsSection from "./sections/custom-scripts-section";
import { renderSectionIcon } from "./sections/section-header";

interface PageSettingsTabProps {
  pageSettings: PageSettings;
  onUpdatePageSettings: (updates: Partial<PageSettings>) => void;
  onShowToast?: (message: string, type: "success" | "warning" | "info") => void;
}

export default function PageSettingsTab({
  pageSettings,
  onUpdatePageSettings,
  onShowToast,
}: PageSettingsTabProps) {
  const [activeTabSection, setActiveTabSection] = useState<string>("seo");

  const themePalette = pageSettings.themePalette || {
    iceBlue: "#d4f0fc",
    skyBlue: "#89d6fb",
    cyanActive: "#02a9f7",
    deepTeal: "#02577a",
    darkSlate: "#01303f",
  };

  const sectionsList = [
    { id: "seo", title: "SEO", icon: "seo" as const },
    { id: "layout", title: "Layout", icon: "layout" as const },
    { id: "typography", title: "Canvas", icon: "typography" as const },
    { id: "theme", title: "Palette", icon: "theme" as const },
    { id: "scripts", title: "Scripts", icon: "scripts" as const },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-panel">
      {/* Segmented Sub-Tabs Bar */}
      <div className="flex border-b border-panel-border/40 bg-background/30 p-xs gap-[4px] shrink-0">
        {sectionsList.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveTabSection(sec.id)}
            className={`flex-1 flex flex-col items-center justify-center py-xs px-[4px] rounded-lg text-[10px] font-semibold transition-all duration-200 cursor-pointer ${
              activeTabSection === sec.id
                ? "bg-cyan-active text-white font-bold shadow-sm"
                : "text-text-muted hover:text-foreground hover:bg-background/40"
            }`}
          >
            <div className="mb-[2px]">{renderSectionIcon(sec.icon)}</div>
            <span>{sec.title}</span>
          </button>
        ))}
      </div>

      {/* Options Content Area */}
      <div className="flex-1 p-md flex flex-col">
        {activeTabSection === "seo" && (
          <SeoSettingsSection
            pageSettings={pageSettings}
            onUpdatePageSettings={onUpdatePageSettings}
            isExpanded={true}
            onToggle={() => {}}
            viewMode="tabs"
          />
        )}

        {activeTabSection === "layout" && (
          <LayoutSettingsSection
            pageSettings={pageSettings}
            onUpdatePageSettings={onUpdatePageSettings}
            isExpanded={true}
            onToggle={() => {}}
            viewMode="tabs"
          />
        )}

        {activeTabSection === "typography" && (
          <CanvasThemeSection
            pageSettings={pageSettings}
            onUpdatePageSettings={onUpdatePageSettings}
            isExpanded={true}
            onToggle={() => {}}
            themePalette={themePalette}
            viewMode="tabs"
          />
        )}

        {activeTabSection === "theme" && (
          <ThemePaletteSection
            pageSettings={pageSettings}
            onUpdatePageSettings={onUpdatePageSettings}
            onShowToast={onShowToast}
            isExpanded={true}
            onToggle={() => {}}
            themePalette={themePalette}
            viewMode="tabs"
          />
        )}

        {activeTabSection === "scripts" && (
          <CustomScriptsSection
            pageSettings={pageSettings}
            onUpdatePageSettings={onUpdatePageSettings}
            isExpanded={true}
            onToggle={() => {}}
            viewMode="tabs"
          />
        )}
      </div>
    </div>
  );
}
