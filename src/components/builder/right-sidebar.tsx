"use client";

import React, { useState } from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import PageSettingsTab from "./right-sidebar/page-settings-tab";
import StyleInspectorTab from "./right-sidebar/style-inspector-tab";
import ContentInspectorTab from "./right-sidebar/content-inspector-tab";

const ALL_FONTS_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=Inter&family=Roboto&family=Open+Sans&family=Montserrat&family=Lato&family=Poppins&family=Oswald&family=Raleway&family=Nunito&family=Georgia&family=Playfair+Display&family=Lora&family=Merriweather&family=PT+Sans&family=Rubik&family=Ubuntu&family=Outfit&family=Syne&family=Cormorant+Garamond&family=Cabin&family=Archivo&family=Roboto+Mono&family=Source+Code+Pro&family=Courier+Prime&family=Space+Grotesk&display=swap";

interface RightSidebarProps {
  activeDevice: "desktop" | "tablet" | "mobile";
  selectedElement: CanvasElement | null;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  pageSettings?: PageSettings;
  onUpdatePageSettings?: (updates: Partial<PageSettings>) => void;
  onShowToast?: (message: string, type: "success" | "warning" | "info") => void;
  onDeselect?: () => void;
  canvasElements?: CanvasElement[];
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

        <PageSettingsTab
          pageSettings={pageSettings}
          onUpdatePageSettings={onUpdatePageSettings}
          onShowToast={onShowToast}
        />

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
      <div className="flex-1 overflow-y-auto custom-scrollbar p-md flex flex-col gap-lg bg-panel">
        {activeTab === "styles" ? (
          <StyleInspectorTab
            activeDevice={activeDevice}
            selectedElement={selectedElement}
            onUpdateElement={onUpdateElement}
            pageSettings={pageSettings}
            onShowToast={onShowToast}
          />
        ) : (
          <ContentInspectorTab
            selectedElement={selectedElement}
            onUpdateElement={onUpdateElement}
            canvasElements={canvasElements}
          />
        )}
      </div>

      {/* Info Status footer */}
      <div className="p-md border-t border-panel-border bg-background/30 shrink-0 text-[10px] text-text-muted font-medium leading-relaxed">
        🛠️ State changes are stored in client memory. Click preview in the header to view live compiled behavior.
      </div>
    </aside>
  );
}
