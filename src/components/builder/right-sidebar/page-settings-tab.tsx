"use client";

import React from "react";
import { PageSettings } from "@/types/builder";

interface PageSettingsTabProps {
  pageSettings: PageSettings;
  onUpdatePageSettings: (updates: Partial<PageSettings>) => void;
  onShowToast?: (message: string, type: "success" | "warning" | "info") => void;
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

export default function PageSettingsTab({
  pageSettings,
  onUpdatePageSettings,
  onShowToast,
}: PageSettingsTabProps) {
  const themePalette = pageSettings.themePalette || {
    iceBlue: "#d4f0fc",
    skyBlue: "#89d6fb",
    cyanActive: "#02a9f7",
    deepTeal: "#02577a",
    darkSlate: "#01303f",
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-md flex flex-col gap-lg">
      {/* SEO Title */}
      <div className="flex flex-col gap-xs">
        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">SEO Title</label>
        <input
          type="text"
          value={pageSettings.seoTitle}
          onChange={(e) => onUpdatePageSettings({ seoTitle: e.target.value })}
          placeholder="e.g. Alex Mercer | Portfolio"
          className="text-xs bg-background border border-panel-border rounded-lg px-sm py-[8px] text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 transition-all duration-200"
        />
      </div>

      {/* SEO Description */}
      <div className="flex flex-col gap-xs">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">SEO Meta Description</label>
          <span
            className={`text-[9px] font-mono ${
              pageSettings.seoDescription.length > 160 ? "text-amber-500 font-bold" : "text-text-muted"
            }`}
          >
            {pageSettings.seoDescription.length}/160
          </span>
        </div>
        <textarea
          value={pageSettings.seoDescription}
          onChange={(e) => onUpdatePageSettings({ seoDescription: e.target.value })}
          rows={4}
          placeholder="Enter meta description for search engines..."
          className="text-xs bg-background border border-panel-border rounded-lg p-sm text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 transition-all duration-200 resize-none"
        />
      </div>

      {/* Favicon URL */}
      <div className="flex flex-col gap-xs">
        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Favicon URL</label>
        <input
          type="text"
          value={pageSettings.faviconUrl}
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

      {/* Brand Theme Palette */}
      <div className="flex flex-col gap-sm border-t border-panel-border/30 pt-md">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Brand Theme Palette</label>
          <span className="text-[9px] px-sm py-[2px] rounded bg-cyan-active/10 text-cyan-active font-bold uppercase tracking-wider">
            Live Preview
          </span>
        </div>

        {/* Presets Grid */}
        <div className="flex flex-col gap-xs">
          <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Theme Presets</span>
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
                    onUpdatePageSettings({ themePalette: { ...preset.colors } });
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
                  {/* Swatch strip */}
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

        {/* Individual Color Selectors */}
        <div className="flex flex-col gap-xs mt-xs">
          <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Customize Colors</span>
          <div className="flex flex-col gap-sm bg-background/20 border border-panel-border/40 rounded-xl p-sm">
            {[
              { key: "darkSlate", label: "Dark Background", desc: "Main panel & frame backdrops" },
              { key: "deepTeal", label: "Muted Text", desc: "Body copies and subtitles" },
              { key: "cyanActive", label: "Primary Accent", desc: "Buttons, highlights & borders" },
              { key: "skyBlue", label: "Highlight Color", desc: "Selected states and borders" },
              { key: "iceBlue", label: "Soft Accent", desc: "Background panels & hover states" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-foreground leading-none">{label}</span>
                  <span className="text-[8px] text-text-muted mt-[2px] leading-tight">{desc}</span>
                </div>
                <div className="flex items-center gap-xs">
                  {/* Hex input */}
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
                  {/* Color swatch picker */}
                  <div className="relative w-5 h-5 rounded-md overflow-hidden border border-panel-border/80 cursor-pointer shadow-inner">
                    <input
                      type="color"
                      value={themePalette[key as keyof typeof themePalette]}
                      onChange={(e) => {
                        onUpdatePageSettings({
                          themePalette: {
                            ...themePalette,
                            [key]: e.target.value,
                          },
                        });
                      }}
                      className="absolute -inset-1 w-[200%] h-[200%] opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: themePalette[key as keyof typeof themePalette] }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom JS */}
      <div className="flex flex-col gap-xs">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Custom Header JS</label>
          <span className="text-[9px] text-amber-500 font-bold">Client Scripts</span>
        </div>
        <textarea
          value={pageSettings.customJs}
          onChange={(e) => onUpdatePageSettings({ customJs: e.target.value })}
          rows={5}
          placeholder="// Insert custom scripting, analytics, or meta code here..."
          className="text-xs font-mono bg-background border border-panel-border rounded-lg p-sm text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 transition-all duration-200 resize-none"
        />
        <p className="text-[9px] text-text-muted font-medium leading-relaxed">
          ⚠️ Custom scripts are routed through isomorphic-dompurify and sanitized on active build serialization.
        </p>
      </div>
    </div>
  );
}
