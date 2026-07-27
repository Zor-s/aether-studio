"use client";

import React, { useState } from "react";
import { PageSettings } from "@/types/builder";
import ColorPicker from "./color-picker";
import CustomSelect from "./custom-select";
import FontPicker from "./font-picker";
import SeoSettingsSection from "./sections/seo-settings-section";
import ThemePaletteSection from "./sections/theme-palette-section";
import CustomScriptsSection from "./sections/custom-scripts-section";

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
  const [expandedSection, setExpandedSection] = useState<string>("seo");

  const themePalette = pageSettings.themePalette || {
    iceBlue: "#d4f0fc",
    skyBlue: "#89d6fb",
    cyanActive: "#02a9f7",
    deepTeal: "#02577a",
    darkSlate: "#01303f",
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-sm p-xs bg-panel">
      {/* SECTION 1: SEO & Metadata */}
      <SeoSettingsSection
        pageSettings={pageSettings}
        onUpdatePageSettings={onUpdatePageSettings}
        isExpanded={expandedSection === "seo"}
        onToggle={() => toggleSection("seo")}
      />

      {/* SECTION 2: Page Canvas Layout */}
      <div
        className={`border border-panel-border/60 rounded-xl bg-background/20 transition-all duration-200 shrink-0 ${
          expandedSection === "layout" ? "overflow-visible" : "overflow-hidden"
        }`}
      >
        <button
          type="button"
          onClick={() => toggleSection("layout")}
          className="w-full flex items-center justify-between p-md text-xs font-bold text-foreground hover:bg-background/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-sm">
            <span className="text-cyan-active">📐</span>
            <span>Page Layout & Spacing</span>
          </div>
          <span className={`transition-transform duration-200 ${expandedSection === "layout" ? "rotate-90" : ""}`}>
            ▶
          </span>
        </button>

        {expandedSection === "layout" && (
          <div className="p-md border-t border-panel-border/40 flex flex-col gap-md bg-panel/30 animate-slideDown">
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

      {/* SECTION 3: Page Background & Typography */}
      <div
        className={`border border-panel-border/60 rounded-xl bg-background/20 transition-all duration-200 shrink-0 ${
          expandedSection === "typography" ? "overflow-visible" : "overflow-hidden"
        }`}
      >
        <button
          type="button"
          onClick={() => toggleSection("typography")}
          className="w-full flex items-center justify-between p-md text-xs font-bold text-foreground hover:bg-background/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-sm">
            <span className="text-cyan-active">🎨</span>
            <span>Canvas Theme Colors & Font</span>
          </div>
          <span className={`transition-transform duration-200 ${expandedSection === "typography" ? "rotate-90" : ""}`}>
            ▶
          </span>
        </button>

        {expandedSection === "typography" && (
          <div className="p-md border-t border-panel-border/40 flex flex-col gap-md bg-panel/30 animate-slideDown">
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
                    value={pageSettings.backgroundColor || "#01303f"}
                    onChange={(val) => onUpdatePageSettings({ backgroundColor: val })}
                    themePalette={themePalette}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-sm border-t border-panel-border/20 pt-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-foreground leading-snug">Body Text Color</span>
                  <span className="text-[8px] text-text-muted mt-[4px] leading-normal">Default text color fill</span>
                </div>
                <div className="flex items-center gap-xs">
                  <input
                    type="text"
                    value={pageSettings.textColor || ""}
                    onChange={(e) => onUpdatePageSettings({ textColor: e.target.value })}
                    className="w-14 text-[9px] font-mono text-center bg-background border border-panel-border rounded px-xs py-[2px] text-foreground focus:outline-none"
                  />
                  <ColorPicker
                    value={pageSettings.textColor || "#ffffff"}
                    onChange={(val) => onUpdatePageSettings({ textColor: val })}
                    themePalette={themePalette}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: Brand Theme Presets & Palette */}
      <ThemePaletteSection
        pageSettings={pageSettings}
        onUpdatePageSettings={onUpdatePageSettings}
        onShowToast={onShowToast}
        isExpanded={expandedSection === "theme"}
        onToggle={() => toggleSection("theme")}
        themePalette={themePalette}
      />

      {/* SECTION 5: Custom Client Scripts */}
      <CustomScriptsSection
        pageSettings={pageSettings}
        onUpdatePageSettings={onUpdatePageSettings}
        isExpanded={expandedSection === "scripts"}
        onToggle={() => toggleSection("scripts")}
      />
    </div>
  );
}
