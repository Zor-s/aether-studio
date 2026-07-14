"use client";

import React, { useState } from "react";
import type { CanvasElement } from "./workspace-canvas";

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

const GOOGLE_FONTS_LIST = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Lato",
  "Poppins",
  "Oswald",
  "Raleway",
  "Nunito",
  "Georgia",
  "Playfair Display",
  "Lora",
  "Merriweather",
  "PT Sans",
  "Rubik",
  "Ubuntu",
  "Outfit",
  "Syne",
  "Cormorant Garamond",
  "Cabin",
  "Archivo",
  "Roboto Mono",
  "Source Code Pro",
  "Courier Prime",
  "Space Grotesk"
];

const ALL_FONTS_STYLESHEET = "https://fonts.googleapis.com/css2?family=Inter&family=Roboto&family=Open+Sans&family=Montserrat&family=Lato&family=Poppins&family=Oswald&family=Raleway&family=Nunito&family=Georgia&family=Playfair+Display&family=Lora&family=Merriweather&family=PT+Sans&family=Rubik&family=Ubuntu&family=Outfit&family=Syne&family=Cormorant+Garamond&family=Cabin&family=Archivo&family=Roboto+Mono&family=Source+Code+Pro&family=Courier+Prime&family=Space+Grotesk&display=swap";

interface RightSidebarProps {
  activeDevice: "desktop" | "tablet" | "mobile";
  selectedElement: CanvasElement | null;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
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
  onDeselect?: () => void;
  canvasElements?: CanvasElement[];
}

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

function CustomSelect({ value, onChange, options, placeholder, className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-xs bg-background border border-panel-border rounded-lg px-sm py-[8px] text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 cursor-pointer transition-all duration-200 ${className}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder || "Select..."}
        </span>
        <svg
          className={`w-3 h-3 text-text-muted transition-transform duration-200 shrink-0 ml-xs ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Backdrop for closing */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 cursor-default"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        />
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-[38px] left-0 right-0 bg-panel border border-panel-border rounded-lg shadow-xl z-50 flex flex-col overflow-hidden animate-fadeIn max-h-48">
          <div className="overflow-y-auto custom-scrollbar py-xs flex flex-col bg-panel">
            {options.map((opt) => {
              const isActive = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-sm py-[6px] text-xs transition-colors cursor-pointer ${
                    isActive
                      ? "text-cyan-active bg-cyan-active/10 font-bold"
                      : "text-foreground hover:bg-accent-soft hover:text-cyan-active"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RightSidebar({
  activeDevice,
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
  onDeselect,
  canvasElements = [],
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<"styles" | "content">("styles");
  const [fontSearch, setFontSearch] = useState("");
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);

  const themePalette = pageSettings.themePalette || {
    iceBlue: "#d4f0fc",
    skyBlue: "#89d6fb",
    cyanActive: "#02a9f7",
    deepTeal: "#02577a",
    darkSlate: "#01303f",
  };

  const getStyleValue = (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">) => {
    if (!selectedElement) return "";
    const s = selectedElement.styles;
    if (activeDevice === "mobile") {
      return s.mobile?.[key] !== undefined ? s.mobile[key] : (s[key] || "");
    }
    if (activeDevice === "tablet") {
      return s.tablet?.[key] !== undefined ? s.tablet[key] : (s[key] || "");
    }
    return s[key] || "";
  };

  const isOverridden = (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">) => {
    if (!selectedElement) return false;
    if (activeDevice === "mobile") {
      return selectedElement.styles.mobile?.[key] !== undefined;
    }
    if (activeDevice === "tablet") {
      return selectedElement.styles.tablet?.[key] !== undefined;
    }
    return false;
  };

  const handleClearOverride = (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">) => {
    if (!selectedElement) return;
    
    const updatedStyles = { ...selectedElement.styles };
    
    if (activeDevice === "mobile" && updatedStyles.mobile) {
      const newMobile = { ...updatedStyles.mobile };
      delete newMobile[key as keyof typeof newMobile];
      
      // If mobile object is empty, clean it up completely
      if (Object.keys(newMobile).length === 0) {
        delete updatedStyles.mobile;
      } else {
        updatedStyles.mobile = newMobile;
      }
    } else if (activeDevice === "tablet" && updatedStyles.tablet) {
      const newTablet = { ...updatedStyles.tablet };
      delete newTablet[key as keyof typeof newTablet];
      
      if (Object.keys(newTablet).length === 0) {
        delete updatedStyles.tablet;
      } else {
        updatedStyles.tablet = newTablet;
      }
    }
    
    onUpdateElement(selectedElement.id, {
      styles: updatedStyles,
    });
    if (onShowToast) {
      onShowToast(`Reset ${activeDevice} override for style property: ${key}`, "info");
    }
  };

  const handleStyleChange = (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">, value: string) => {
    if (!selectedElement) return;
    
    let updatedStyles = { ...selectedElement.styles };
    
    if (activeDevice === "mobile") {
      updatedStyles.mobile = {
        ...(updatedStyles.mobile || {}),
        [key]: value,
      };
    } else if (activeDevice === "tablet") {
      updatedStyles.tablet = {
        ...(updatedStyles.tablet || {}),
        [key]: value,
      };
    } else {
      // Desktop
      updatedStyles = {
        ...updatedStyles,
        [key]: value,
      };
    }

    onUpdateElement(selectedElement.id, {
      styles: updatedStyles,
    });
  };

  const handleContentChange = (key: string, value: string) => {
    if (!selectedElement) return;
    onUpdateElement(selectedElement.id, {
      [key]: value,
    });
  };

  // const handleUploadSimulate = () => {
  //   if (onShowToast) {
  //     onShowToast("Uploading asset to Cloudflare R2...", "info");
  //     setTimeout(() => {
  //       handleContentChange("content", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop");
  //       onShowToast("Successfully uploaded to R2 Object Storage!", "success");
  //     }, 1000);
  //   } else {
  //     alert("Simulating pre-signed direct upload to Cloudflare R2. File is uploaded directly to storage bypass, resolving with R2 URL.");
  //     handleContentChange("content", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop");
  //   }
  // };

  const renderLabel = (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">, label: string) => {
    const overridden = isOverridden(key);
    return (
      <div className="flex items-center justify-between mb-[2px] w-full">
        <label className={`text-[10px] font-semibold transition-colors duration-200 ${overridden ? "text-cyan-active font-bold" : "text-text-muted"}`}>
          {label}
        </label>
        {overridden && (
          <button
            type="button"
            onClick={() => handleClearOverride(key)}
            className="text-[9px] text-cyan-active hover:text-red-500 cursor-pointer flex items-center gap-[2px] transition-colors focus:outline-none"
            title={`Clear ${activeDevice} override (reset to desktop)`}
          >
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset
          </button>
        )}
      </div>
    );
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
      {/* Load Google Fonts stylesheet so the inspector list items can preview the fonts */}
      <link rel="stylesheet" href={ALL_FONTS_STYLESHEET} />
      {/* Element Inspector Header */}
      <div className="p-md border-b border-panel-border shrink-0">
        <div className="flex justify-between items-center mb-sm">
          <div className="flex items-center gap-xs font-semibold">
            <span className="text-[10px] uppercase font-extrabold px-sm py-[2px] rounded bg-cyan-active/15 text-cyan-active tracking-wider">
              {selectedElement.type}
            </span>
            <span className="text-[9px] font-mono text-text-muted">#{selectedElement.id.slice(0, 6)}</span>
          </div>
          {onDeselect && (
            <button
              onClick={onDeselect}
              className="text-[10px] font-bold text-cyan-active hover:text-cyan-active/85 cursor-pointer flex items-center gap-[4px] transition-all duration-200 focus:outline-none bg-cyan-active/10 hover:bg-cyan-active/20 px-sm py-[4px] rounded-md border border-cyan-active/20"
              title="Back to Page Settings"
            >
              <span>✕</span>
              <span>Deselect</span>
            </button>
          )}
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
            {/* Breakpoint Override Active Warning Banner */}
            {activeDevice !== "desktop" && (
              <div className="p-xs px-sm rounded-lg bg-cyan-active/10 border border-cyan-active/20 text-[10px] text-cyan-active font-semibold flex items-center gap-xs mb-sm animate-fadeIn">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Editing {activeDevice} overrides. Styles apply strictly to {activeDevice}.
              </div>
            )}

            {/* Visual Spacing Box Controller */}
            <div className="flex flex-col gap-xs">
              <span className="text-xs font-bold text-foreground">Concentric Spacing</span>
              
              {/* Outer Margin Box */}
              <div className="border border-panel-border rounded-xl bg-background/50 p-sm relative flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-wider font-bold text-text-muted absolute left-2 top-2">Margin</span>
                
                {/* Margin Selector inputs layout */}
                <div className="flex items-center justify-between w-full gap-xs mt-md">
                  <div className="flex flex-col items-stretch w-full">
                    {renderLabel("margin", "Margin Scale")}
                    <CustomSelect
                      value={getStyleValue("margin") || "space-md"}
                      onChange={(val) => handleStyleChange("margin", val)}
                      options={[
                        { value: "space-none", label: "None (0px)" },
                        { value: "space-xs", label: "XS (4px)" },
                        { value: "space-sm", label: "SM (8px)" },
                        { value: "space-md", label: "MD (16px)" },
                        { value: "space-lg", label: "LG (24px)" },
                        { value: "space-xl", label: "XL (32px)" },
                        { value: "space-2xl", label: "2XL (48px)" },
                      ]}
                      className="bg-panel px-xs py-[4px]"
                    />
                  </div>
                </div>

                {/* Inner Padding Box */}
                <div className="border border-panel-border border-dashed rounded-lg bg-panel p-sm w-full relative mt-sm flex flex-col items-center shadow-inner">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-cyan-active/70 absolute left-2 top-2">Padding</span>
                  
                  <div className="flex items-center justify-between w-full gap-xs mt-md">
                    <div className="flex flex-col items-stretch w-full">
                      {renderLabel("padding", "Padding Scale")}
                      <CustomSelect
                        value={getStyleValue("padding") || "space-md"}
                        onChange={(val) => handleStyleChange("padding", val)}
                        options={[
                          { value: "space-none", label: "None (0px)" },
                          { value: "space-xs", label: "XS (4px)" },
                          { value: "space-sm", label: "SM (8px)" },
                          { value: "space-md", label: "MD (16px)" },
                          { value: "space-lg", label: "LG (24px)" },
                          { value: "space-xl", label: "XL (32px)" },
                          { value: "space-2xl", label: "2XL (48px)" },
                        ]}
                        className="bg-background px-xs py-[4px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Settings Section (Only visible for section / container layout components) */}
            {["section", "container"].includes(selectedElement.type) && (
              <div className="flex flex-col gap-sm border-t border-panel-border/40 pt-sm">
                <span className="text-xs font-bold text-foreground">Container Layout Settings</span>

                {/* Flex Direction & Gap */}
                <div className="grid grid-cols-2 gap-sm">
                  {/* Flex Direction */}
                  {/* Flex Direction */}
                  <div className="flex flex-col gap-xs">
                    {renderLabel("direction", "Flex Direction")}
                    <CustomSelect
                      value={getStyleValue("direction") || "col"}
                      onChange={(val) => handleStyleChange("direction", val)}
                      options={[
                        { value: "col", label: "Vertical (Column)" },
                        { value: "row", label: "Horizontal (Row)" },
                      ]}
                    />
                  </div>

                  {/* Flex Gap spacing */}
                  <div className="flex flex-col gap-xs">
                    {renderLabel("gap", "Flex Item Gap")}
                    <CustomSelect
                      value={getStyleValue("gap") || "space-md"}
                      onChange={(val) => handleStyleChange("gap", val)}
                      options={[
                        { value: "space-none", label: "None (0px)" },
                        { value: "space-xs", label: "XS (4px)" },
                        { value: "space-sm", label: "SM (8px)" },
                        { value: "space-md", label: "MD (16px)" },
                        { value: "space-lg", label: "LG (24px)" },
                        { value: "space-xl", label: "XL (32px)" },
                        { value: "space-2xl", label: "2XL (48px)" },
                      ]}
                    />
                  </div>
                </div>

                {/* Main Axis Align & Cross Axis Align */}
                <div className="grid grid-cols-2 gap-sm">
                  {/* Main-Axis Alignment (Justify Content) */}
                  <div className="flex flex-col gap-xs">
                    {renderLabel("justify", "Justify Content")}
                    <CustomSelect
                      value={getStyleValue("justify") || "center"}
                      onChange={(val) => handleStyleChange("justify", val)}
                      options={[
                        { value: "center", label: "Center" },
                        { value: "start", label: "Start (Left/Top)" },
                        { value: "end", label: "End (Right/Bottom)" },
                        { value: "between", label: "Space Between" },
                      ]}
                    />
                  </div>

                  {/* Cross-Axis Alignment (Align Items) */}
                  <div className="flex flex-col gap-xs">
                    {renderLabel("alignItems", "Align Items")}
                    <CustomSelect
                      value={getStyleValue("alignItems") || "center"}
                      onChange={(val) => handleStyleChange("alignItems", val)}
                      options={[
                        { value: "center", label: "Center" },
                        { value: "start", label: "Start" },
                        { value: "end", label: "End" },
                        { value: "stretch", label: "Stretch" },
                      ]}
                    />
                  </div>
                </div>

                {/* Width containment & Min Height */}
                <div className="grid grid-cols-2 gap-sm">
                  {/* Width Containment Mode */}
                  <div className="flex flex-col gap-xs">
                    {renderLabel("widthMode", "Width Limit")}
                    <CustomSelect
                      value={getStyleValue("widthMode") || "full"}
                      onChange={(val) => handleStyleChange("widthMode", val)}
                      options={[
                        { value: "full", label: "Full Width (100%)" },
                        { value: "boxed-sm", label: "Boxed SM (384px)" },
                        { value: "boxed-md", label: "Boxed MD (448px)" },
                        { value: "boxed-lg", label: "Boxed LG (512px)" },
                        { value: "boxed-xl", label: "Boxed XL (576px)" },
                      ]}
                    />
                  </div>

                  {/* Height Constraint */}
                  <div className="flex flex-col gap-xs">
                    {renderLabel("minHeight", "Minimum Height")}
                    <CustomSelect
                      value={getStyleValue("minHeight") || "auto"}
                      onChange={(val) => handleStyleChange("minHeight", val)}
                      options={[
                        { value: "auto", label: "Auto (Fit Content)" },
                        { value: "screen", label: "Full Screen (100vh)" },
                        { value: "h-300", label: "Small (300px)" },
                        { value: "h-500", label: "Medium (500px)" },
                        { value: "h-700", label: "Large (700px)" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Typography scale (Visible on relevant types) */}
            {["headline", "paragraph", "button"].includes(selectedElement.type) && (
              <div className="flex flex-col gap-sm">
                <span className="text-xs font-bold text-foreground">Typography</span>
                
                <div className="grid grid-cols-2 gap-sm">
                  {/* Font Family Picker */}
                  <div className="col-span-2 flex flex-col gap-xs relative">
                    {renderLabel("fontFamily", "Font Family")}
                    
                    {/* Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                      className="w-full flex items-center justify-between text-xs bg-background border border-panel-border rounded-md px-sm py-[6px] text-foreground focus:outline-none focus:border-cyan-active cursor-pointer"
                    >
                      <span style={{ fontFamily: getStyleValue("fontFamily") || 'inherit' }}>
                        {getStyleValue("fontFamily") || "Default (System Font)"}
                      </span>
                      <svg className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${fontDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Backdrop for closing */}
                    {fontDropdownOpen && (
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => {
                          setFontDropdownOpen(false);
                          setFontSearch("");
                        }}
                      />
                    )}

                    {/* Dropdown Panel */}
                    {fontDropdownOpen && (
                      <div className="absolute top-[52px] left-0 right-0 bg-panel border border-panel-border rounded-lg shadow-xl z-50 flex flex-col overflow-hidden animate-fadeIn">
                        {/* Search Input */}
                        <div className="p-xs border-b border-panel-border/60 bg-background/50">
                          <input
                            type="text"
                            placeholder="Search Google fonts..."
                            value={fontSearch}
                            onChange={(e) => setFontSearch(e.target.value)}
                            className="w-full text-xs bg-panel border border-panel-border rounded px-xs py-1 text-foreground focus:outline-none focus:border-cyan-active"
                            autoFocus
                          />
                        </div>

                        {/* Fonts List */}
                        <div className="max-h-48 overflow-y-auto custom-scrollbar py-xs flex flex-col bg-panel">
                          <button
                            type="button"
                            onClick={() => {
                              handleStyleChange("fontFamily", "");
                              setFontDropdownOpen(false);
                              setFontSearch("");
                            }}
                            className="w-full text-left px-sm py-xs text-xs hover:bg-accent-soft hover:text-cyan-active text-text-muted transition-colors cursor-pointer"
                          >
                            Default (System Font)
                          </button>
                          
                          {GOOGLE_FONTS_LIST
                            .filter(font => font.toLowerCase().includes(fontSearch.toLowerCase()))
                            .map(font => (
                              <button
                                key={font}
                                type="button"
                                onClick={() => {
                                  handleStyleChange("fontFamily", font);
                                  setFontDropdownOpen(false);
                                  setFontSearch("");
                                }}
                                style={{ fontFamily: font }}
                                className={`w-full text-left px-sm py-xs text-xs hover:bg-accent-soft hover:text-cyan-active transition-colors cursor-pointer ${
                                  getStyleValue("fontFamily") === font ? "text-cyan-active bg-cyan-active/5 font-bold" : "text-foreground"
                                }`}
                              >
                                {font}
                              </button>
                            ))
                          }
                          {GOOGLE_FONTS_LIST.filter(font => font.toLowerCase().includes(fontSearch.toLowerCase())).length === 0 && (
                            <span className="text-[10px] text-text-muted text-center py-sm">No fonts found</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Font Size Selector */}
                  <div className="flex flex-col gap-xs">
                    {renderLabel("fontSize", "Font Size Scale")}
                    <CustomSelect
                      value={getStyleValue("fontSize") || "text-md"}
                      onChange={(val) => handleStyleChange("fontSize", val)}
                      options={[
                        { value: "text-xs", label: "XS (12px)" },
                        { value: "text-sm", label: "SM (14px)" },
                        { value: "text-md", label: "MD/Base (16px)" },
                        { value: "text-lg", label: "LG (18px)" },
                        { value: "text-xl", label: "XL (20px)" },
                        { value: "text-2xl", label: "2XL (24px)" },
                        { value: "text-3xl", label: "3XL (30px)" },
                      ]}
                    />
                  </div>

                  {/* Alignment toggles */}
                  <div className="flex flex-col gap-xs">
                    {renderLabel("align", "Alignment")}
                    <div className="flex bg-background border border-panel-border rounded-md p-[2px]">
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => handleStyleChange("align", align)}
                          className={`flex-1 py-[2px] rounded text-xs flex items-center justify-center hover:text-foreground transition-all duration-200 cursor-pointer ${
                            getStyleValue("align") === align
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
                    {renderLabel("fontWeight", "Font Weight")}
                    <CustomSelect
                      value={getStyleValue("fontWeight") || "font-normal"}
                      onChange={(val) => handleStyleChange("fontWeight", val)}
                      options={[
                        { value: "font-light", label: "Light (300)" },
                        { value: "font-normal", label: "Normal (400)" },
                        { value: "font-medium", label: "Medium (500)" },
                        { value: "font-semibold", label: "Semibold (600)" },
                        { value: "font-bold", label: "Bold (700)" },
                        { value: "font-extrabold", label: "Extrabold (800)" },
                      ]}
                    />
                  </div>

                  {/* Letter Spacing Selector */}
                  <div className="flex flex-col gap-xs">
                    {renderLabel("letterSpacing", "Letter Spacing")}
                    <CustomSelect
                      value={getStyleValue("letterSpacing") || "tracking-normal"}
                      onChange={(val) => handleStyleChange("letterSpacing", val)}
                      options={[
                        { value: "tracking-tighter", label: "Tighter (-0.05em)" },
                        { value: "tracking-tight", label: "Tight (-0.025em)" },
                        { value: "tracking-normal", label: "Normal (0)" },
                        { value: "tracking-wide", label: "Wide (0.025em)" },
                        { value: "tracking-wider", label: "Wider (0.05em)" },
                        { value: "tracking-widest", label: "Widest (0.1em)" },
                      ]}
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Border radius scale (Visual alignment) */}
            <div className="flex flex-col gap-xs">
              {renderLabel("borderRadius", "Corner Radius Scale")}
              <CustomSelect
                value={getStyleValue("borderRadius") || "rounded-lg"}
                onChange={(val) => handleStyleChange("borderRadius", val)}
                options={[
                  { value: "rounded-none", label: "Sharp Corners (0px)" },
                  { value: "rounded-sm", label: "Rounded SM (4px)" },
                  { value: "rounded-md", label: "Rounded MD (6px)" },
                  { value: "rounded-lg", label: "Rounded LG (8px)" },
                  { value: "rounded-xl", label: "Rounded XL (12px)" },
                  { value: "rounded-2xl", label: "Rounded 2XL (16px)" },
                  { value: "rounded-full", label: "Fully Rounded (Pill)" },
                ]}
              />
            </div>

            {/* Border Styling Section */}
            <div className="flex flex-col gap-sm border-t border-panel-border/40 pt-sm">
              <span className="text-xs font-bold text-foreground">Border Styling</span>
              
              <div className="grid grid-cols-2 gap-sm">
                {/* Border Style */}
                <div className="flex flex-col gap-xs">
                  {renderLabel("borderStyle", "Border Style")}
                  <CustomSelect
                    value={getStyleValue("borderStyle") || "none"}
                    onChange={(val) => handleStyleChange("borderStyle", val)}
                    options={[
                      { value: "none", label: "None" },
                      { value: "solid", label: "Solid" },
                      { value: "dashed", label: "Dashed" },
                      { value: "dotted", label: "Dotted" },
                    ]}
                  />
                </div>

                {/* Border Width */}
                <div className="flex flex-col gap-xs">
                  {renderLabel("borderWidth", `Border Width (${getStyleValue("borderWidth") || "0"}px)`)}
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="1"
                    value={parseInt(getStyleValue("borderWidth") || "0", 10)}
                    onChange={(e) => handleStyleChange("borderWidth", e.target.value)}
                    className="w-full accent-cyan-active cursor-pointer mt-[6px]"
                  />
                </div>
              </div>

              {/* Border Color (Visible only if borderStyle is not 'none') */}
              {getStyleValue("borderStyle") && getStyleValue("borderStyle") !== "none" && (
                <div className="flex flex-col gap-xs mt-xs">
                  {renderLabel("borderColor", "Border Color")}
                  <div className="flex items-center gap-sm">
                    {[
                      { hex: themePalette.iceBlue, original: "#d4f0fc", name: "Ice Blue" },
                      { hex: themePalette.skyBlue, original: "#89d6fb", name: "Sky Blue" },
                      { hex: themePalette.cyanActive, original: "#02a9f7", name: "Cyan Active" },
                      { hex: themePalette.deepTeal, original: "#02577a", name: "Deep Teal" },
                      { hex: themePalette.darkSlate, original: "#01303f", name: "Dark Slate" },
                    ].map((color) => {
                      const currentVal = getStyleValue("borderColor");
                      const isActive = currentVal && (
                        currentVal.toLowerCase().trim() === color.original.toLowerCase() ||
                        currentVal.toLowerCase().trim() === color.hex.toLowerCase() ||
                        currentVal.toLowerCase().trim() === `var(--brand-${color.name.toLowerCase().replace(" ", "-")})`
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
              {renderLabel("color", "Design Color Palette")}
              <div className="flex items-center gap-sm">
                {[
                  { hex: themePalette.iceBlue, original: "#d4f0fc", name: "Ice Blue" },
                  { hex: themePalette.skyBlue, original: "#89d6fb", name: "Sky Blue" },
                  { hex: themePalette.cyanActive, original: "#02a9f7", name: "Cyan Active" },
                  { hex: themePalette.deepTeal, original: "#02577a", name: "Deep Teal" },
                  { hex: themePalette.darkSlate, original: "#01303f", name: "Dark Slate" },
                ].map((color) => {
                  const currentVal = getStyleValue("color");
                  const isActive = currentVal && (
                    currentVal.toLowerCase().trim() === color.original.toLowerCase() ||
                    currentVal.toLowerCase().trim() === color.hex.toLowerCase() ||
                    currentVal.toLowerCase().trim() === `var(--brand-${color.name.toLowerCase().replace(" ", "-")})`
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
              {/* Parent Container Selector (Visible for all non-section components to allow nesting inside layout components) */}
              {!["section"].includes(selectedElement.type) && (
                <div className="flex flex-col gap-xs">
                  <label className="text-xs font-bold text-foreground">Parent Container</label>
                  <CustomSelect
                    value={selectedElement.parentId || ""}
                    onChange={(val) => handleContentChange("parentId", val)}
                    options={[
                      { value: "", label: "None (Root Page)" },
                      ...canvasElements
                        .filter((el) => ["section", "container"].includes(el.type) && el.id !== selectedElement.id)
                        .map((el) => ({
                          value: el.id,
                          label: el.name || `${el.type.charAt(0).toUpperCase() + el.type.slice(1)} (${el.id.slice(0, 6)})`,
                        })),
                    ]}
                  />
                  <span className="text-[9px] text-text-muted mt-[2px] leading-relaxed">
                    Choose a section or container block to nest this component inside.
                  </span>
                </div>
              )}

              {/* Text area for element content (Hidden for layout wrappers) */}
              {!["section", "container", "grid-2"].includes(selectedElement.type) && (
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
              )}

              {/* Layout helper info for sections/containers */}
              {["section", "container"].includes(selectedElement.type) && (
                <div className="p-sm bg-background/30 border border-panel-border rounded-lg flex flex-col gap-xs text-[10px] text-text-muted leading-relaxed">
                  <span className="font-bold text-foreground">Layout Container Settings</span>
                  <span>This block acts as a structural row or container wrapper. To add components inside it:</span>
                  <ol className="list-decimal pl-sm flex flex-col gap-[2px]">
                    <li>Select the component you want to nest (e.g. text, button, list).</li>
                    <li>Go to its <span className="font-bold text-foreground">Content</span> tab.</li>
                    <li>Choose this {selectedElement.type} in the <span className="font-bold text-foreground">Parent Container</span> selector.</li>
                  </ol>
                </div>
              )}

              {/* Link URLs (Visible on buttons) */}
              {["button"].includes(selectedElement.type) && (
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
