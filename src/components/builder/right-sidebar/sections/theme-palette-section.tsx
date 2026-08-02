"use client";

import React from "react";
import { PageSettings } from "@/types/builder";
import ColorPicker from "../color-picker";
import SectionHeader, { OptionViewMode, renderSectionIcon } from "./section-header";

interface ThemePaletteSectionProps {
  pageSettings: PageSettings;
  onUpdatePageSettings: (updates: Partial<PageSettings>) => void;
  onShowToast?: (message: string, type: "success" | "warning" | "info") => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  themePalette: NonNullable<PageSettings["themePalette"]>;
  viewMode?: OptionViewMode;
}

const THEME_PRESETS = {
  aether: {
    name: "Aether Cyan",
    colors: {
      iceBlue: "#d4f0fc",
      skyBlue: "#89d6fb",
      cyanActive: "#02a9f7",
      deepTeal: "#02577a",
      darkSlate: "#01303f",
    },
  },
  emerald: {
    name: "Emerald Forest",
    colors: {
      iceBlue: "#e6fcf5",
      skyBlue: "#96f2d7",
      cyanActive: "#0ca678",
      deepTeal: "#097969",
      darkSlate: "#0b2921",
    },
  },
  sunset: {
    name: "Sunset Coral",
    colors: {
      iceBlue: "#fff0e6",
      skyBlue: "#ffd8a8",
      cyanActive: "#ff922b",
      deepTeal: "#d9480f",
      darkSlate: "#1a0c00",
    },
  },
  midnight: {
    name: "Midnight Purple",
    colors: {
      iceBlue: "#f3f0ff",
      skyBlue: "#d0bfff",
      cyanActive: "#845ef7",
      deepTeal: "#5f3dc4",
      darkSlate: "#120b2e",
    },
  },
  amber: {
    name: "Warm Amber",
    colors: {
      iceBlue: "#fff9db",
      skyBlue: "#ffe066",
      cyanActive: "#f59f00",
      deepTeal: "#d97706",
      darkSlate: "#1c1917",
    },
  },
};

export default function ThemePaletteSection({
  pageSettings,
  onUpdatePageSettings,
  onShowToast,
  isExpanded = true,
  onToggle = () => {},
  themePalette,
  viewMode = "tabs",
}: ThemePaletteSectionProps) {
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
          title="Brand Palette & Presets"
          subtitle="Theme swatches & color tokens"
          icon="theme"
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
                  {renderSectionIcon("theme")}
                </div>
                <h3 className="text-xs font-bold text-foreground">Brand Palette & Presets</h3>
              </div>
              <p className="text-[10px] text-text-muted mt-[2px]">Apply curated color presets or configure brand color tokens.</p>
            </div>
          )}

          <div className="flex flex-col gap-xs">
            <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">
              Apply Preset Theme
            </span>
            <div className="grid grid-cols-2 gap-xs">
              {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                const isActive = Object.keys(preset.colors).every(
                  (colorKey) =>
                    preset.colors[colorKey as keyof typeof preset.colors].toLowerCase() ===
                    themePalette[colorKey as keyof typeof themePalette]?.toLowerCase()
                );
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      const isBgSlate =
                        pageSettings.backgroundColor === themePalette.darkSlate ||
                        pageSettings.backgroundColor === "#01303f";

                      onUpdatePageSettings({
                        themePalette: { ...preset.colors },
                        ...(isBgSlate ? { backgroundColor: preset.colors.darkSlate } : {}),
                      });
                      if (onShowToast) {
                        onShowToast(`Applied ${preset.name} theme preset!`, "success");
                      }
                    }}
                    className={`flex flex-col text-left p-xs border rounded-lg hover:border-cyan-active transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "border-cyan-active bg-cyan-active/5 ring-1 ring-cyan-active/20"
                        : "border-panel-border bg-background/20"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-foreground mb-[3px] truncate">
                      {preset.name}
                    </span>
                    <div className="flex h-2.5 rounded-sm overflow-hidden border border-panel-border/40">
                      <div className="flex-1" style={{ backgroundColor: preset.colors.darkSlate }} />
                      <div className="flex-1" style={{ backgroundColor: preset.colors.deepTeal }} />
                      <div className="flex-1" style={{ backgroundColor: preset.colors.cyanActive }} />
                      <div className="flex-1" style={{ backgroundColor: preset.colors.skyBlue }} />
                      <div className="flex-1" style={{ backgroundColor: preset.colors.iceBlue }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-xs mt-xs">
            <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">
              Customize Palette Swatches
            </span>
            <div className="flex flex-col gap-sm bg-background/30 border border-panel-border/40 rounded-xl p-sm">
              {[
                { key: "darkSlate", label: "Dark Slate Backdrop", desc: "Base dark paneling" },
                { key: "deepTeal", label: "Deep Teal Contrast", desc: "Muted text/subtitles" },
                { key: "cyanActive", label: "Cyan Active Accent", desc: "Active states/highlights" },
                { key: "skyBlue", label: "Sky Blue Accent", desc: "High-contrast borders" },
                { key: "iceBlue", label: "Ice Blue Base", desc: "Soft backgrounds & highlights" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between gap-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-foreground leading-snug">{label}</span>
                    <span className="text-[8px] text-text-muted mt-[4px] leading-normal">{desc}</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <input
                      type="text"
                      value={themePalette[key as keyof typeof themePalette]}
                      onChange={(e) => {
                        const val = e.target.value;
                        onUpdatePageSettings({
                          themePalette: {
                            ...themePalette,
                            [key]: val,
                          },
                        });
                      }}
                      className="w-14 text-[9px] font-mono text-center bg-background border border-panel-border rounded px-xs py-[2px] text-foreground focus:outline-none"
                    />
                    <ColorPicker
                      value={themePalette[key as keyof typeof themePalette] || "#ffffff"}
                      onChange={(val) => {
                        onUpdatePageSettings({
                          themePalette: {
                            ...themePalette,
                            [key]: val,
                          },
                        });
                      }}
                      showThemePresets={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
