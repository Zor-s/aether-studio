"use client";

import React, { useState } from "react";
import ComponentTree from "./component-tree";
import { CanvasElement } from "@/types/builder";
import {
  REGISTRY_ELEMENTS,
  getElementTag,
  getElementPreviewMockup,
  customStyles,
} from "@/components/registry";

interface LeftSidebarProps {
  onAddElement?: (elementId: string) => void;
  onSelectAsset?: (url: string) => void;
  canvasElements?: CanvasElement[];
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
  onRenameElement?: (id: string, name: string) => void;
  onDuplicateElement?: (id: string) => void;
  onMoveElement?: (id: string, direction: "up" | "down") => void;
}

export default function LeftSidebar({
  onAddElement = () => {},
  canvasElements = [],
  selectedElementId = null,
  onSelectElement = () => {},
  onRenameElement = () => {},
  onDuplicateElement = () => {},
  onMoveElement = () => {},
}: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "layout" | "basic" | "media">("all");
  const [activePanel, setActivePanel] = useState<"blocks" | "layers">("blocks");
  const [hoveredElement, setHoveredElement] = useState<{
    id: string;
    name: string;
    category: "layout" | "basic" | "media" | "forms";
    description: string;
    top: number;
  } | null>(null);

  const filteredElements = REGISTRY_ELEMENTS.filter((el) => {
    const matchesSearch = el.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          el.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || el.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <aside className="w-sidebar-w border-r border-panel-border bg-panel flex flex-col shrink-0 relative select-none z-40 transition-colors duration-200">
      {/* Sidebar Header & Search */}
      <div className="p-md border-b border-panel-border flex flex-col gap-sm shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-bold text-foreground">Element Registry</h2>
          <div className="flex rounded-lg border border-panel-border bg-background p-[2px] text-[10px] font-bold uppercase tracking-wide">
            <button
              type="button"
              onClick={() => setActivePanel("blocks")}
              className={`rounded px-sm py-[2px] transition-all duration-200 ${
                activePanel === "blocks" ? "bg-accent-soft text-cyan-active" : "text-text-muted hover:text-foreground"
              }`}
            >
              Blocks
            </button>
            <button
              type="button"
              onClick={() => setActivePanel("layers")}
              className={`rounded px-sm py-[2px] transition-all duration-200 ${
                activePanel === "layers" ? "bg-accent-soft text-cyan-active" : "text-text-muted hover:text-foreground"
              }`}
            >
              Layers
            </button>
          </div>
        </div>
        
        {/* Search Input Box */}
        {activePanel === "blocks" && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-sm rounded-lg border border-panel-border bg-background text-sm text-foreground placeholder-text-muted focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active transition-all duration-200"
            />
            <svg className="w-4 h-4 text-text-muted absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-text-muted hover:text-foreground focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Pills */}
      {activePanel === "blocks" && (
        <div className="px-md py-sm border-b border-panel-border bg-background/50 flex gap-xs overflow-x-auto scrollbar-none shrink-0">
          {(["all", "layout", "basic", "media"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-sm py-xs rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-all duration-250 cursor-pointer ${
                activeCategory === cat
                  ? "bg-cyan-active text-white shadow-sm"
                  : "bg-background text-text-muted hover:text-foreground hover:bg-accent-soft"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Element List container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-md flex flex-col gap-sm">
        {activePanel === "layers" ? (
          <ComponentTree
            canvasElements={canvasElements}
            selectedElementId={selectedElementId}
            onSelectElement={onSelectElement}
            onRenameElement={onRenameElement}
            onDuplicateElement={onDuplicateElement}
            onMoveElement={onMoveElement}
          />
        ) : filteredElements.length > 0 ? (
          filteredElements.map((el) => (
            <div
              key={el.id}
              onClick={() => onAddElement(el.id)}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const asideElement = e.currentTarget.closest("aside");
                if (asideElement) {
                  const asideRect = asideElement.getBoundingClientRect();
                  const itemCenter = rect.top - asideRect.top + rect.height / 2;
                  const popoverHeight = 280; // Estimated height
                  const topPos = Math.max(
                    12,
                    Math.min(itemCenter - popoverHeight / 2, asideRect.height - popoverHeight - 12)
                  );
                  setHoveredElement({
                    id: el.id,
                    name: el.name,
                    category: el.category,
                    description: el.description,
                    top: topPos,
                  });
                }
              }}
              onMouseLeave={() => setHoveredElement(null)}
              className="group relative border border-panel-border hover:border-cyan-active/50 bg-panel hover:bg-accent-soft/20 rounded-xl p-sm flex items-start gap-sm cursor-grab active:cursor-grabbing hover:shadow-sm transition-all duration-200"
            >
              {/* Drag Indicator (Visual only) */}
              <div className="absolute left-[6px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
                <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10-10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </div>

              {/* Element Icon Wrapper */}
              <div className="w-10 h-10 shrink-0 rounded-lg border border-panel-border bg-background group-hover:bg-panel flex items-center justify-center shadow-inner group-hover:shadow-none group-hover:scale-95 group-hover:border-cyan-active/20 transition-all duration-200 ml-xs group-hover:ml-md">
                {el.icon}
              </div>

              {/* Element Label and Info */}
              <div className="flex-1 flex flex-col gap-[2px]">
                <h3 className="text-sm font-bold text-foreground leading-tight group-hover:text-cyan-active transition-colors duration-200">
                  {el.name}
                </h3>
                <p className="text-[11px] text-text-muted leading-tight">{el.description}</p>
              </div>

              {/* Add CTA indicator */}
              <div className="self-center opacity-0 group-hover:opacity-100 p-[2px] rounded bg-cyan-active text-white transition-opacity duration-200 select-none">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-2xl text-center">
            <svg className="w-10 h-10 text-text-muted mb-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-semibold text-foreground">No elements found</p>
            <p className="text-[10px] text-text-muted mt-xs">Try searching for basic tags like text or column.</p>
          </div>
        )}
      </div>

      {/* Registry Info Block */}
      <div className="p-md border-t border-panel-border bg-background/30 shrink-0 text-[10px] text-text-muted leading-relaxed font-medium">
        {activePanel === "layers"
          ? "ℹ️ Select a layer to inspect it. Use the layer actions to rename, duplicate, or reorder it among its siblings."
          : "ℹ️ Click on a component block to insert it directly into the selected slot on the canvas workspace."}
      </div>

      {/* Popover Preview Card */}
      {hoveredElement && (
        <div
          style={{ top: `${hoveredElement.top}px` }}
          className="absolute left-full ml-sm w-[280px] bg-panel border border-panel-border rounded-xl shadow-xl z-50 p-md flex flex-col gap-sm animate-scaleIn pointer-events-none"
        >
          {/* Custom style block for keyframes */}
          <style dangerouslySetInnerHTML={{ __html: customStyles }} />
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-panel-border/40 pb-xs">
            <span className={`text-[9px] font-extrabold px-sm py-[2px] rounded-full uppercase tracking-wider ${
              hoveredElement.category === "layout" ? "bg-cyan-active/10 text-cyan-active" : "bg-amber-500/10 text-amber-500"
            }`}>
              {hoveredElement.category}
            </span>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Preview Spec</span>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-[2px]">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-tight">{hoveredElement.name}</h4>
            <p className="text-[10px] text-text-muted leading-normal">{hoveredElement.description}</p>
          </div>

          {/* Interactive Graphic Mockup */}
          <div className="w-full bg-background/50 rounded-lg p-xs border border-panel-border/30">
            {getElementPreviewMockup(hoveredElement.id)}
          </div>

          {/* Spec details footer */}
          <div className="grid grid-cols-2 gap-xs text-[8px] font-semibold text-text-muted bg-background/30 p-xs rounded border border-panel-border/20">
            <div>HTML Element: <span className="text-foreground font-bold font-mono">{getElementTag(hoveredElement.id)}</span></div>
            <div>Styling: <span className="text-foreground font-bold">Dynamic</span></div>
          </div>
        </div>
      )}
    </aside>
  );
}
