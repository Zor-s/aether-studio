"use client";

import React, { useState, useRef, useEffect } from "react";
import { PageSettings, GOOGLE_FONTS_LIST } from "@/types/builder";
import ColorPicker from "./color-picker";
import CustomSelect from "./custom-select";

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
  const [expandedSection, setExpandedSection] = useState<string>("seo");
  const [fontSearch, setFontSearch] = useState("");
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [fontOpenUpward, setFontOpenUpward] = useState(false);
  const fontContainerRef = useRef<HTMLDivElement>(null);

  const themePalette = pageSettings.themePalette || {
    iceBlue: "#d4f0fc",
    skyBlue: "#89d6fb",
    cyanActive: "#02a9f7",
    deepTeal: "#02577a",
    darkSlate: "#01303f",
  };

  useEffect(() => {
    if (fontDropdownOpen && fontContainerRef.current) {
      const rect = fontContainerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Font dropdown max height is max-h-56 (224px), let's threshold at 240px
      if (spaceBelow < 240 && spaceAbove > spaceBelow) {
        setFontOpenUpward(true);
      } else {
        setFontOpenUpward(false);
      }
    }
  }, [fontDropdownOpen]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  const filteredFonts = GOOGLE_FONTS_LIST.filter((font) =>
    font.toLowerCase().includes(fontSearch.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-sm p-xs bg-panel">
      {/* SECTION 1: SEO & Metadata */}
      <div className={`border border-panel-border/60 rounded-xl bg-background/20 transition-all duration-200 shrink-0 ${expandedSection === "seo" ? "overflow-visible" : "overflow-hidden"}`}>
        <button
          type="button"
          onClick={() => toggleSection("seo")}
          className="w-full flex items-center justify-between p-md text-xs font-bold text-foreground hover:bg-background/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-sm">
            <span className="text-cyan-active">🌐</span>
            <span>SEO & Metadata Settings</span>
          </div>
          <span className={`transition-transform duration-200 ${expandedSection === "seo" ? "rotate-90" : ""}`}>
            ▶
          </span>
        </button>

        {expandedSection === "seo" && (
          <div className="p-md border-t border-panel-border/40 flex flex-col gap-md bg-panel/30 animate-slideDown">
            {/* SEO Title */}
            <div className="flex flex-col gap-xs">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">SEO Title</label>
              <input
                type="text"
                value={pageSettings.seoTitle || ""}
                onChange={(e) => onUpdatePageSettings({ seoTitle: e.target.value })}
                placeholder="e.g. Alex Mercer | Portfolio"
                className="text-xs bg-background border border-panel-border rounded-lg px-sm py-[8px] text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 transition-all duration-200"
              />
            </div>

            {/* SEO Description */}
            <div className="flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">SEO Description</label>
                <span
                  className={`text-[9px] font-mono ${(pageSettings.seoDescription || "").length > 160 ? "text-amber-500 font-bold" : "text-text-muted"}`}
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

            {/* Favicon URL */}
            <div className="flex flex-col gap-xs">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Favicon URL</label>
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

      {/* SECTION 2: Page Canvas Layout */}
      <div className={`border border-panel-border/60 rounded-xl bg-background/20 transition-all duration-200 shrink-0 ${expandedSection === "layout" ? "overflow-visible" : "overflow-hidden"}`}>
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
            {/* Global Width Limit */}
            <div className="flex flex-col gap-xs">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Page Containment Width</label>
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

            {/* Page Outer Padding */}
            <div className="flex flex-col gap-xs">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Page Outer Padding</label>
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

            {/* Root Elements Gap */}
            <div className="flex flex-col gap-xs">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Vertical Layout Gap</label>
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
      <div className={`border border-panel-border/60 rounded-xl bg-background/20 transition-all duration-200 shrink-0 ${expandedSection === "typography" ? "overflow-visible" : "overflow-hidden"}`}>
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
            {/* Global Page Font */}
            <div ref={fontContainerRef} className="flex flex-col gap-xs relative">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Global Page Font</label>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                className="w-full flex items-center justify-between text-xs bg-background border border-panel-border rounded-lg px-sm py-[8px] text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 cursor-pointer transition-all duration-200"
              >
                <span
                  style={{ fontFamily: pageSettings.fontFamily || "inherit" }}
                  className="truncate font-semibold text-foreground"
                >
                  {pageSettings.fontFamily || "Default System Font"}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 shrink-0 ml-xs ${
                    fontDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Backdrop */}
              {fontDropdownOpen && (
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFontDropdownOpen(false);
                  }}
                />
              )}

              {/* Dropdown Panel */}
              {fontDropdownOpen && (
                <div className={`absolute ${fontOpenUpward ? "bottom-[38px]" : "top-[38px]"} left-0 right-0 bg-panel border border-panel-border rounded-xl shadow-xl z-50 flex flex-col overflow-hidden animate-fadeIn max-h-56`}>
                  {/* Search box inside panel */}
                  <div className="p-xs bg-background/30 border-b border-panel-border shrink-0">
                    <input
                      type="text"
                      placeholder="Search Google Fonts..."
                      value={fontSearch}
                      onChange={(e) => setFontSearch(e.target.value)}
                      className="w-full h-8 px-sm rounded-md border border-panel-border bg-background text-[11px] text-foreground focus:outline-none"
                    />
                  </div>

                  {/* Fonts lists */}
                  <div className="overflow-y-auto custom-scrollbar p-xs flex flex-col gap-[2px] bg-panel">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePageSettings({ fontFamily: "Inter" });
                        setFontDropdownOpen(false);
                      }}
                      className="w-full text-left px-sm py-[6px] rounded-lg text-xs transition-colors cursor-pointer text-foreground hover:bg-accent-soft"
                    >
                      Default System Font (Inter)
                    </button>
                    {filteredFonts.map((fontName) => {
                      const isActive = pageSettings.fontFamily === fontName;
                      return (
                        <button
                          key={fontName}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdatePageSettings({ fontFamily: fontName });
                            setFontDropdownOpen(false);
                          }}
                          style={{ fontFamily: fontName }}
                          className={`w-full text-left px-sm py-[6px] rounded-lg text-xs transition-colors cursor-pointer ${
                            isActive
                              ? "text-cyan-active bg-cyan-active/10 font-bold"
                              : "text-foreground hover:bg-accent-soft hover:text-cyan-active"
                          }`}
                        >
                          {fontName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Global Colors Box */}
            <div className="flex flex-col gap-sm bg-background/30 border border-panel-border/40 rounded-xl p-sm mt-xs">
              {/* Page Background Selector */}
              <div className="flex items-center justify-between gap-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-foreground leading-none">Page Background</span>
                  <span className="text-[8px] text-text-muted mt-[2px] leading-tight">Overall backdrop color</span>
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

              {/* Page Base Text Selector */}
              <div className="flex items-center justify-between gap-sm border-t border-panel-border/20 pt-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-foreground leading-none">Body Text Color</span>
                  <span className="text-[8px] text-text-muted mt-[2px] leading-tight">Default text color fill</span>
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
      <div className={`border border-panel-border/60 rounded-xl bg-background/20 transition-all duration-200 shrink-0 ${expandedSection === "theme" ? "overflow-visible" : "overflow-hidden"}`}>
        <button
          type="button"
          onClick={() => toggleSection("theme")}
          className="w-full flex items-center justify-between p-md text-xs font-bold text-foreground hover:bg-background/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-sm">
            <span className="text-cyan-active">🎨</span>
            <span>Brand Palette & Presets</span>
          </div>
          <span className={`transition-transform duration-200 ${expandedSection === "theme" ? "rotate-90" : ""}`}>
            ▶
          </span>
        </button>

        {expandedSection === "theme" && (
          <div className="p-md border-t border-panel-border/40 flex flex-col gap-md bg-panel/30 animate-slideDown">
            {/* Presets Grid */}
            <div className="flex flex-col gap-xs">
              <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Apply Preset Theme</span>
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
                        // Intelligent background color shift
                        const isBgSlate = pageSettings.backgroundColor === themePalette.darkSlate || pageSettings.backgroundColor === "#01303f";
                        
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

            {/* Individual Customizers */}
            <div className="flex flex-col gap-xs mt-xs">
              <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Customize Palette Swatches</span>
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
                      <span className="text-[10px] font-bold text-foreground leading-none">{label}</span>
                      <span className="text-[8px] text-text-muted mt-[2px] leading-tight">{desc}</span>
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

      {/* SECTION 5: Custom Client Scripts */}
      <div className={`border border-panel-border/60 rounded-xl bg-background/20 transition-all duration-200 shrink-0 ${expandedSection === "scripts" ? "overflow-visible" : "overflow-hidden"}`}>
        <button
          type="button"
          onClick={() => toggleSection("scripts")}
          className="w-full flex items-center justify-between p-md text-xs font-bold text-foreground hover:bg-background/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-sm">
            <span className="text-cyan-active">⚡</span>
            <span>Custom Scripts (JS)</span>
          </div>
          <span className={`transition-transform duration-200 ${expandedSection === "scripts" ? "rotate-90" : ""}`}>
            ▶
          </span>
        </button>

        {expandedSection === "scripts" && (
          <div className="p-md border-t border-panel-border/40 flex flex-col gap-md bg-panel/30 animate-slideDown">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Custom Header JS</label>
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
    </div>
  );
}
