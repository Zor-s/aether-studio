"use client";

import React, { useState } from "react";

const THEME_PRESETS = {
  aether: {
    name: "Aether Cyan",
    colors: {
      iceBlue: "#d4f0fc",
      skyBlue: "#89d6fb",
      cyanActive: "#02a9f7",
      deepTeal: "#02577a",
      darkSlate: "#01303f",
    }
  },
  emerald: {
    name: "Emerald Forest",
    colors: {
      iceBlue: "#e6fcf5",
      skyBlue: "#96f2d7",
      cyanActive: "#0ca678",
      deepTeal: "#097969",
      darkSlate: "#0b2921",
    }
  },
  sunset: {
    name: "Sunset Coral",
    colors: {
      iceBlue: "#fff0e6",
      skyBlue: "#ffd8a8",
      cyanActive: "#ff922b",
      deepTeal: "#d9480f",
      darkSlate: "#1a0c00",
    }
  },
  midnight: {
    name: "Midnight Purple",
    colors: {
      iceBlue: "#f3f0ff",
      skyBlue: "#d0bfff",
      cyanActive: "#845ef7",
      deepTeal: "#5f3dc4",
      darkSlate: "#120b2e",
    }
  },
  amber: {
    name: "Warm Amber",
    colors: {
      iceBlue: "#fff9db",
      skyBlue: "#ffe066",
      cyanActive: "#f59f00",
      deepTeal: "#d97706",
      darkSlate: "#1c1917",
    }
  },
};

interface RightSidebarProps {
  selectedElement: {
    id: string;
    type: string;
    content: string;
    styles: {
      padding?: string;
      margin?: string;
      fontSize?: string;
      color?: string;
      borderRadius?: string;
      align?: "left" | "center" | "right";
      fontWeight?: string;
      letterSpacing?: string;
      borderStyle?: string;
      borderWidth?: string;
      borderColor?: string;
    };
    link?: string;
  } | null;
  onUpdateElement?: (id: string, updates: Partial<NonNullable<RightSidebarProps["selectedElement"]>>) => void;
  pageSettings?: {
    seoTitle: string;
    seoDescription: string;
    customJs: string;
    faviconUrl: string;
    themePalette: {
      iceBlue: string;
      skyBlue: string;
      cyanActive: string;
      deepTeal: string;
      darkSlate: string;
    };
  };
  onUpdatePageSettings?: (updates: Partial<NonNullable<RightSidebarProps["pageSettings"]>>) => void;
  onShowToast?: (message: string, type: "success" | "warning" | "info") => void;
}

export default function RightSidebar({
  selectedElement,
  onUpdateElement = () => {},
  pageSettings = {
    seoTitle: "Alex Mercer Portfolio",
    seoDescription: "Lead Software Architect and Developer based in San Francisco.",
    customJs: "",
    faviconUrl: "",
    themePalette: {
      iceBlue: "#d4f0fc",
      skyBlue: "#89d6fb",
      cyanActive: "#02a9f7",
      deepTeal: "#02577a",
      darkSlate: "#01303f",
    },
  },
  onUpdatePageSettings = () => {},
  onShowToast,
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<"styles" | "content">("styles");

  const themePalette = pageSettings.themePalette || {
    iceBlue: "#d4f0fc",
    skyBlue: "#89d6fb",
    cyanActive: "#02a9f7",
    deepTeal: "#02577a",
    darkSlate: "#01303f",
  };

  const handleStyleChange = (key: string, value: string) => {
    if (!selectedElement) return;
    onUpdateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [key]: value,
      },
    });
  };

  const handleContentChange = (key: string, value: string) => {
    if (!selectedElement) return;
    onUpdateElement(selectedElement.id, {
      [key]: value,
    });
  };

  const handleUploadSimulate = () => {
    if (onShowToast) {
      onShowToast("Uploading asset to Cloudflare R2...", "info");
      setTimeout(() => {
        handleContentChange("content", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop");
        onShowToast("Successfully uploaded to R2 Object Storage!", "success");
      }, 1000);
    } else {
      alert("Simulating pre-signed direct upload to Cloudflare R2. File is uploaded directly to storage bypass, resolving with R2 URL.");
      handleContentChange("content", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop");
    }
  };

  if (!selectedElement) {
    return (
      <aside className="w-sidebar-w border-l border-panel-border bg-panel flex flex-col shrink-0 overflow-hidden select-none z-10 transition-colors duration-200">
        {/* Header */}
        <div className="p-md border-b border-panel-border shrink-0">
          <div className="flex justify-between items-center mb-xs">
            <h2 className="text-md font-bold text-foreground">Page Settings</h2>
            <span className="text-[10px] font-bold px-sm py-[2px] rounded-full bg-cyan-active/10 text-cyan-active uppercase tracking-wide">
              Global
            </span>
          </div>
          <p className="text-[11px] text-text-muted">Configure SEO tags and general settings for this page.</p>
        </div>

        {/* Inputs list */}
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
              <span className={`text-[9px] font-mono ${pageSettings.seoDescription.length > 160 ? "text-amber-500 font-bold" : "text-text-muted"}`}>
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
              <span className="text-[9px] px-sm py-[2px] rounded bg-cyan-active/10 text-cyan-active font-bold uppercase tracking-wider">Live Preview</span>
            </div>

            {/* Presets Grid */}
            <div className="flex flex-col gap-xs">
              <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Theme Presets</span>
              <div className="grid grid-cols-2 gap-xs">
                {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                  const isActive = Object.keys(preset.colors).every(
                    (colorKey) => preset.colors[colorKey as keyof typeof preset.colors].toLowerCase() === themePalette[colorKey as keyof typeof themePalette]?.toLowerCase()
                  );
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        onUpdatePageSettings({ themePalette: { ...preset.colors } });
                        if (onShowToast) {
                          onShowToast(`Applied ${preset.name} theme preset!`, "success");
                        }
                      }}
                      className={`flex flex-col text-left p-xs border rounded-lg hover:border-cyan-active transition-all duration-200 cursor-pointer ${
                        isActive ? "border-cyan-active bg-cyan-active/5 ring-1 ring-cyan-active/20" : "border-panel-border bg-background/20"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-foreground mb-[3px] truncate">{preset.name}</span>
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
                        <div className="w-full h-full" style={{ backgroundColor: themePalette[key as keyof typeof themePalette] }} />
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

        {/* Footer */}
        <div className="p-md border-t border-panel-border bg-background/30 shrink-0 text-[10px] text-text-muted font-medium leading-relaxed">
          🌐 Click on any canvas element to switch editing fields back to block styling controls.
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-sidebar-w border-l border-panel-border bg-panel flex flex-col shrink-0 overflow-hidden select-none z-10 transition-colors duration-200">
      {/* Element Inspector Header */}
      <div className="p-md border-b border-panel-border shrink-0">
        <div className="flex justify-between items-center mb-sm">
          <div className="flex items-center gap-xs">
            <span className="text-[10px] uppercase font-extrabold px-sm py-[2px] rounded bg-cyan-active/15 text-cyan-active tracking-wider">
              {selectedElement.type}
            </span>
          </div>
          <span className="text-[10px] font-mono text-text-muted">ID: #{selectedElement.id.slice(0, 6)}</span>
        </div>
        
        {/* Settings / Style Tab Toggles */}
        <div className="flex bg-background border border-panel-border rounded-lg p-[3px] shadow-inner">
          <button
            onClick={() => setActiveTab("styles")}
            className={`flex-1 py-xs rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "styles"
                ? "bg-panel text-cyan-active shadow-sm"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            Styles
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 py-xs rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "content"
                ? "bg-panel text-cyan-active shadow-sm"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            Content
          </button>
        </div>
      </div>

      {/* Configuration Controls (Scrollable) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-md flex flex-col gap-lg">
        {activeTab === "styles" ? (
          <>
            {/* Visual Spacing Box Controller */}
            <div className="flex flex-col gap-xs">
              <span className="text-xs font-bold text-foreground">Concentric Spacing</span>
              
              {/* Outer Margin Box */}
              <div className="border border-panel-border rounded-xl bg-background/50 p-sm relative flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-wider font-bold text-text-muted absolute left-2 top-2">Margin</span>
                
                {/* Margin Selector inputs layout */}
                <div className="flex items-center justify-between w-full gap-xs mt-md">
                  <div className="flex flex-col items-center flex-1">
                    <label className="text-[9px] text-text-muted mb-[2px]">Margin Scale</label>
                    <select
                      value={selectedElement.styles.margin || "space-md"}
                      onChange={(e) => handleStyleChange("margin", e.target.value)}
                      className="w-full text-xs bg-panel border border-panel-border rounded-md px-xs py-1 text-foreground focus:outline-none focus:border-cyan-active cursor-pointer"
                    >
                      <option value="space-none">None (0px)</option>
                      <option value="space-xs">XS (4px)</option>
                      <option value="space-sm">SM (8px)</option>
                      <option value="space-md">MD (16px)</option>
                      <option value="space-lg">LG (24px)</option>
                      <option value="space-xl">XL (32px)</option>
                      <option value="space-2xl">2XL (48px)</option>
                    </select>
                  </div>
                </div>

                {/* Inner Padding Box */}
                <div className="border border-panel-border border-dashed rounded-lg bg-panel p-sm w-full relative mt-sm flex flex-col items-center shadow-inner">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-cyan-active/70 absolute left-2 top-2">Padding</span>
                  
                  <div className="flex items-center justify-between w-full gap-xs mt-md">
                    <div className="flex flex-col items-center flex-1">
                      <label className="text-[9px] text-text-muted mb-[2px]">Padding Scale</label>
                      <select
                        value={selectedElement.styles.padding || "space-md"}
                        onChange={(e) => handleStyleChange("padding", e.target.value)}
                        className="w-full text-xs bg-background border border-panel-border rounded-md px-xs py-1 text-foreground focus:outline-none focus:border-cyan-active cursor-pointer"
                      >
                        <option value="space-none">None (0px)</option>
                        <option value="space-xs">XS (4px)</option>
                        <option value="space-sm">SM (8px)</option>
                        <option value="space-md">MD (16px)</option>
                        <option value="space-lg">LG (24px)</option>
                        <option value="space-xl">XL (32px)</option>
                        <option value="space-2xl">2XL (48px)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography scale (Visible on relevant types) */}
            {["headline", "paragraph", "button"].includes(selectedElement.type) && (
              <div className="flex flex-col gap-sm">
                <span className="text-xs font-bold text-foreground">Typography</span>
                
                <div className="grid grid-cols-2 gap-sm">
                  {/* Font Size Selector */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-[10px] font-semibold text-text-muted">Font Size Scale</label>
                    <select
                      value={selectedElement.styles.fontSize || "text-md"}
                      onChange={(e) => handleStyleChange("fontSize", e.target.value)}
                      className="text-xs bg-background border border-panel-border rounded-md px-sm py-[6px] text-foreground focus:outline-none focus:border-cyan-active cursor-pointer"
                    >
                      <option value="text-xs">XS (12px)</option>
                      <option value="text-sm">SM (14px)</option>
                      <option value="text-md">MD/Base (16px)</option>
                      <option value="text-lg">LG (18px)</option>
                      <option value="text-xl">XL (20px)</option>
                      <option value="text-2xl">2XL (24px)</option>
                      <option value="text-3xl">3XL (30px)</option>
                    </select>
                  </div>

                  {/* Alignment toggles */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-[10px] font-semibold text-text-muted">Align</label>
                    <div className="flex bg-background border border-panel-border rounded-md p-[2px]">
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => handleStyleChange("align", align)}
                          className={`flex-1 py-[2px] rounded text-xs flex items-center justify-center hover:text-foreground transition-all duration-200 cursor-pointer ${
                            selectedElement.styles.align === align
                              ? "bg-panel text-cyan-active shadow-sm"
                              : "text-text-muted"
                          }`}
                        >
                          {align === "left" && (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                          {align === "center" && (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm-3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                          {align === "right" && (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm6 5a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm-6 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Font Weight & Letter Spacing */}
                <div className="grid grid-cols-2 gap-sm mt-xs">
                  {/* Font Weight Selector */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-[10px] font-semibold text-text-muted">Font Weight</label>
                    <select
                      value={selectedElement.styles.fontWeight || "font-normal"}
                      onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
                      className="text-xs bg-background border border-panel-border rounded-md px-sm py-[6px] text-foreground focus:outline-none focus:border-cyan-active cursor-pointer"
                    >
                      <option value="font-light">Light (300)</option>
                      <option value="font-normal">Normal (400)</option>
                      <option value="font-medium">Medium (500)</option>
                      <option value="font-semibold">Semibold (600)</option>
                      <option value="font-bold">Bold (700)</option>
                      <option value="font-extrabold">Extrabold (800)</option>
                    </select>
                  </div>

                  {/* Letter Spacing Selector */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-[10px] font-semibold text-text-muted">Letter Spacing</label>
                    <select
                      value={selectedElement.styles.letterSpacing || "tracking-normal"}
                      onChange={(e) => handleStyleChange("letterSpacing", e.target.value)}
                      className="text-xs bg-background border border-panel-border rounded-md px-sm py-[6px] text-foreground focus:outline-none focus:border-cyan-active cursor-pointer"
                    >
                      <option value="tracking-tighter">Tighter (-0.05em)</option>
                      <option value="tracking-tight">Tight (-0.025em)</option>
                      <option value="tracking-normal">Normal (0)</option>
                      <option value="tracking-wide">Wide (0.025em)</option>
                      <option value="tracking-wider">Wider (0.05em)</option>
                      <option value="tracking-widest">Widest (0.1em)</option>
                    </select>
                  </div>
                </div>

              </div>
            )}

            {/* Border radius scale (Visual alignment) */}
            <div className="flex flex-col gap-xs">
              <label className="text-xs font-bold text-foreground">Corner Radius Scale</label>
              <select
                value={selectedElement.styles.borderRadius || "rounded-lg"}
                onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                className="text-xs bg-background border border-panel-border rounded-md px-sm py-[6px] text-foreground focus:outline-none focus:border-cyan-active cursor-pointer"
              >
                <option value="rounded-none">Sharp Corners (0px)</option>
                <option value="rounded-sm">Rounded SM (4px)</option>
                <option value="rounded-md">Rounded MD (6px)</option>
                <option value="rounded-lg">Rounded LG (8px)</option>
                <option value="rounded-xl">Rounded XL (12px)</option>
                <option value="rounded-2xl">Rounded 2XL (16px)</option>
                <option value="rounded-full">Fully Rounded (Pill)</option>
              </select>
            </div>

            {/* Border Styling Section */}
            <div className="flex flex-col gap-sm border-t border-panel-border/40 pt-sm">
              <span className="text-xs font-bold text-foreground">Border Styling</span>
              
              <div className="grid grid-cols-2 gap-sm">
                {/* Border Style */}
                <div className="flex flex-col gap-xs">
                  <label className="text-[10px] font-semibold text-text-muted">Border Style</label>
                  <select
                    value={selectedElement.styles.borderStyle || "none"}
                    onChange={(e) => handleStyleChange("borderStyle", e.target.value)}
                    className="text-xs bg-background border border-panel-border rounded-md px-sm py-[6px] text-foreground focus:outline-none focus:border-cyan-active cursor-pointer"
                  >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                </div>

                {/* Border Width */}
                <div className="flex flex-col gap-xs">
                  <label className="text-[10px] font-semibold text-text-muted">Border Width ({selectedElement.styles.borderWidth || "0"}px)</label>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="1"
                    value={parseInt(selectedElement.styles.borderWidth || "0", 10)}
                    onChange={(e) => handleStyleChange("borderWidth", e.target.value)}
                    className="w-full accent-cyan-active cursor-pointer mt-[6px]"
                  />
                </div>
              </div>

              {/* Border Color (Visible only if borderStyle is not 'none') */}
              {selectedElement.styles.borderStyle && selectedElement.styles.borderStyle !== "none" && (
                <div className="flex flex-col gap-xs mt-xs">
                  <label className="text-[10px] font-semibold text-text-muted">Border Color</label>
                  <div className="flex items-center gap-sm">
                    {[
                      { hex: themePalette.iceBlue, original: "#d4f0fc", name: "Ice Blue" },
                      { hex: themePalette.skyBlue, original: "#89d6fb", name: "Sky Blue" },
                      { hex: themePalette.cyanActive, original: "#02a9f7", name: "Cyan Active" },
                      { hex: themePalette.deepTeal, original: "#02577a", name: "Deep Teal" },
                      { hex: themePalette.darkSlate, original: "#01303f", name: "Dark Slate" },
                    ].map((color) => {
                      const isActive = selectedElement.styles.borderColor && (
                        selectedElement.styles.borderColor.toLowerCase().trim() === color.original.toLowerCase() ||
                        selectedElement.styles.borderColor.toLowerCase().trim() === color.hex.toLowerCase() ||
                        selectedElement.styles.borderColor.toLowerCase().trim() === `var(--brand-${color.name.toLowerCase().replace(" ", "-")})`
                      );
                      return (
                        <button
                          key={color.original}
                          onClick={() => handleStyleChange("borderColor", color.original)}
                          style={{ backgroundColor: color.hex }}
                          className={`w-6 h-6 rounded-full border shadow-sm transition-all duration-200 scale-100 hover:scale-110 active:scale-95 cursor-pointer ${
                            isActive
                              ? "border-cyan-active ring-2 ring-cyan-active/20 ring-offset-2 ring-offset-panel"
                              : "border-panel-border"
                          }`}
                          title={color.name}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
 
            {/* Accent Theme Picker (Strict brand palette colors) */}
            <div className="flex flex-col gap-sm">
              <span className="text-xs font-bold text-foreground">Design Color Palette</span>
              <div className="flex items-center gap-sm">
                {[
                  { hex: themePalette.iceBlue, original: "#d4f0fc", name: "Ice Blue" },
                  { hex: themePalette.skyBlue, original: "#89d6fb", name: "Sky Blue" },
                  { hex: themePalette.cyanActive, original: "#02a9f7", name: "Cyan Active" },
                  { hex: themePalette.deepTeal, original: "#02577a", name: "Deep Teal" },
                  { hex: themePalette.darkSlate, original: "#01303f", name: "Dark Slate" },
                ].map((color) => {
                  const isActive = selectedElement.styles.color && (
                    selectedElement.styles.color.toLowerCase().trim() === color.original.toLowerCase() ||
                    selectedElement.styles.color.toLowerCase().trim() === color.hex.toLowerCase() ||
                    selectedElement.styles.color.toLowerCase().trim() === `var(--brand-${color.name.toLowerCase().replace(" ", "-")})`
                  );
                  return (
                    <button
                      key={color.original}
                      onClick={() => handleStyleChange("color", color.original)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-7 h-7 rounded-full border shadow-sm transition-all duration-200 scale-100 hover:scale-110 active:scale-95 cursor-pointer ${
                        isActive
                          ? "border-cyan-active ring-2 ring-cyan-active/20 ring-offset-2 ring-offset-panel"
                          : "border-panel-border"
                      }`}
                      title={color.name}
                    />
                  );
                })}
              </div>
              <div className="text-[10px] text-text-muted font-medium mt-[2px]">
                ⚠️ Style color selections are restricted to the validated Aether brand palettes to prevent visual noise.
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Content Input Fields */}
            <div className="flex flex-col gap-md">
              {/* Text area for element content */}
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-foreground">Display Content / Label</label>
                <textarea
                  value={selectedElement.content}
                  onChange={(e) => handleContentChange("content", e.target.value)}
                  rows={4}
                  className="w-full text-xs p-sm bg-background border border-panel-border rounded-lg text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active transition-all duration-200 resize-none"
                  placeholder="Enter text value..."
                />
              </div>

              {/* Link URLs (Visible on buttons or images) */}
              {["button", "image"].includes(selectedElement.type) && (
                <div className="flex flex-col gap-xs">
                  <label className="text-xs font-bold text-foreground">Action Destination Link</label>
                  <input
                    type="text"
                    value={selectedElement.link || ""}
                    onChange={(e) => handleContentChange("link", e.target.value)}
                    className="w-full h-10 px-sm rounded-lg border border-panel-border bg-background text-xs text-foreground placeholder-text-muted focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active transition-all duration-200"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {/* Image R2 Pre-signed Mock Uploader */}
              {selectedElement.type === "image" && (
                <div className="flex flex-col gap-xs">
                  <label className="text-xs font-bold text-foreground">Image Resource</label>
                  <div className="border border-dashed border-panel-border rounded-lg bg-background p-md flex flex-col items-center justify-center text-center gap-xs">
                    <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <button
                      onClick={handleUploadSimulate}
                      className="px-sm py-xs rounded bg-deep-teal hover:bg-deep-teal/95 active:scale-95 text-[11px] font-semibold text-white shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      Upload Direct to R2
                    </button>
                    <span className="text-[9px] text-text-muted font-medium">Bypasses LocalStorage limit</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Info Status footer */}
      <div className="p-md border-t border-panel-border bg-background/30 shrink-0 text-[10px] text-text-muted font-medium leading-relaxed">
        🛠️ State changes are stored in client memory. Click preview in the header to view live compiled behavior.
      </div>
    </aside>
  );
}
