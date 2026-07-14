"use client";

import React, { useState } from "react";
import ComponentTree from "./component-tree";
import type { CanvasElement } from "./workspace-canvas";

interface ElementType {
  id: string;
  name: string;
  category: "layout" | "basic" | "media" | "forms";
  description: string;
  icon: React.ReactNode;
}

const REGISTRY_ELEMENTS: ElementType[] = [
  // Layouts
  {
    id: "section",
    name: "Section Container",
    category: "layout",
    description: "Full-width section wrapper with padding settings",
    icon: (
      <svg className="w-5 h-5 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: "grid-2",
    name: "Two-Column Grid",
    category: "layout",
    description: "Responsive 50/50 block layout grid",
    icon: (
      <svg className="w-5 h-5 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
      </svg>
    ),
  },
  {
    id: "container",
    name: "Standard Wrapper",
    category: "layout",
    description: "Centered container locked to max widths",
    icon: (
      <svg className="w-5 h-5 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8V4a1 1 0 011-1h16a1 1 0 011 1v4m-18 8v4a1 1 0 001 1h16a1 1 0 001-1v-4M3 8h18v8H3V8z" />
      </svg>
    ),
  },
  // Basic
  {
    id: "headline",
    name: "Large Headline",
    category: "basic",
    description: "Header text block mapping to h1/h2 tags",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    id: "subheading",
    name: "Secondary Subheading",
    category: "basic",
    description: "Subtitle mapping to h3 / h4 tags",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h11" />
      </svg>
    ),
  },
  {
    id: "paragraph",
    name: "Paragraph Block",
    category: "basic",
    description: "Standard body text block with font scales",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: "blockquote",
    name: "Blockquote Testimonial",
    category: "basic",
    description: "Indented text quote block with left border highlights",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "list",
    name: "Bullet List",
    category: "basic",
    description: "Unordered bullet point list container block",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: "button",
    name: "Action Button",
    category: "basic",
    description: "Interactive button mapping to custom urls",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    id: "divider",
    name: "Divider Line",
    category: "basic",
    description: "Horizontal separation rule element",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  },
];

// const CURATED_ASSETS = [
//   { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop", tags: ["abstract", "glassmorphic", "art", "purple"] },
//   { url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop", tags: ["code", "developer", "terminal", "dark"] },
//   { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop", tags: ["laptop", "workspace", "office", "work"] },
//   { url: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&auto=format&fit=crop", tags: ["workspace", "minimalist", "white", "design"] },
//   { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop", tags: ["beach", "sea", "nature", "summer"] },
//   { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop", tags: ["forest", "mountain", "nature", "landscape"] },
//   { url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&auto=format&fit=crop", tags: ["bridge", "city", "golden gate", "landscape"] },
//   { url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop", tags: ["shoes", "product", "minimalist", "red"] },
//   { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop", tags: ["nike", "product", "sneaker", "red"] },
//   { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop", tags: ["watch", "product", "white", "gadget"] },
//   { url: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&auto=format&fit=crop", tags: ["people", "meeting", "workspace", "colleague"] },
//   { url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop", tags: ["wireframe", "design", "ux", "chart"] }
// ];

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
  const [activeCategory, setActiveCategory] = useState<"all" | "layout" | "basic" | "assets">("all");
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

  // const filteredAssets = CURATED_ASSETS.filter((asset) => {
  //   if (!searchQuery) return true;
  //   return asset.tags.some((tag) => tag.includes(searchQuery.toLowerCase()));
  // });

  return (
    <aside className="w-sidebar-w border-r border-panel-border bg-panel flex flex-col shrink-0 relative select-none z-10 transition-colors duration-200">
      {/* Sidebar Header & Search */}
      <div className="p-md border-b border-panel-border flex flex-col gap-sm shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-bold text-foreground">Element Registry</h2>
          <div className="flex rounded-lg border border-panel-border bg-background p-[2px] text-[10px] font-bold uppercase tracking-wide">
            <button
              type="button"
              onClick={() => setActivePanel("blocks")}
              className={`rounded px-sm py-[2px] transition-all duration-200 ${activePanel === "blocks" ? "bg-accent-soft text-cyan-active" : "text-text-muted hover:text-foreground"}`}
            >
              Blocks
            </button>
            <button
              type="button"
              onClick={() => setActivePanel("layers")}
              className={`rounded px-sm py-[2px] transition-all duration-200 ${activePanel === "layers" ? "bg-accent-soft text-cyan-active" : "text-text-muted hover:text-foreground"}`}
            >
              Layers
            </button>
          </div>
        </div>
        
        {/* Search Input Box */}
        {activePanel === "blocks" && <div className="relative">
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
        </div>}
      </div>

      {/* Category Pills */}
      {activePanel === "blocks" && <div className="px-md py-sm border-b border-panel-border bg-background/50 flex gap-xs overflow-x-auto scrollbar-none shrink-0">
        {(["all", "layout", "basic"] as const).map((cat) => (
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
      </div>}

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
        ) : (
          filteredElements.length > 0 ? (
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
                    const topPos = Math.max(12, Math.min(itemCenter - popoverHeight / 2, asideRect.height - popoverHeight - 12));
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
                  <p className="text-[11px] text-text-muted leading-tight">
                    {el.description}
                  </p>
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
          )
        )}
      </div>

      {/* Registry Info Block */}
      <div className="p-md border-t border-panel-border bg-background/30 shrink-0 text-[10px] text-text-muted leading-relaxed font-medium">
        {activePanel === "layers"
          ? "ℹ️ Select a layer to inspect it. Use the layer actions to rename, duplicate, or reorder it among its siblings."
          : activeCategory === "assets"
          ? "ℹ️ Click any image to insert it as a new block, or to update the selected canvas image component."
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
              hoveredElement.category === "layout" ? "bg-cyan-active/10 text-cyan-active" :
              hoveredElement.category === "basic" ? "bg-amber-500/10 text-amber-500" :
              hoveredElement.category === "media" ? "bg-indigo-500/10 text-indigo-500" :
              "bg-emerald-500/10 text-emerald-500"
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

// Custom keyframes and styles isolated for popover elements
const customStyles = `
  @keyframes popover-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes popover-bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes popover-zoom-slow {
    0%, 100% { transform: scale(1.05); }
    50% { transform: scale(1.12); }
  }
  @keyframes popover-pulse-glow {
    0%, 100% { box-shadow: 0 0 0px rgba(2, 169, 247, 0.2); }
    50% { box-shadow: 0 0 12px rgba(2, 169, 247, 0.6); }
  }
  @keyframes popover-check-verify {
    0%, 100% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 1; }
  }
  @keyframes popover-spinner {
    to { transform: rotate(360deg); }
  }
  .popover-shimmer-bg {
    background: linear-gradient(90deg, var(--panel-border) 25%, var(--accent-soft) 50%, var(--panel-border) 75%);
    background-size: 200% 100%;
    animation: popover-shimmer 1.5s infinite linear;
  }
`;

function getElementTag(id: string): string {
  switch (id) {
    case "section": return "<section>";
    case "grid-2": return "<div> (grid)";
    case "container": return "<div> (max-w)";
    case "headline": return "<h1> / <h2>";
    case "paragraph": return "<p>";
    case "button": return "<button>";
    case "image": return "<img>";
    case "video": return "<video>";
    case "contact-form": return "<form>";
    case "turnstile": return "<script>";
    default: return "<div>";
  }
}

function getElementPreviewMockup(id: string) {
  switch (id) {
    case "section":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex flex-col gap-xs overflow-hidden relative">
          <div className="border border-dashed border-cyan-active/40 bg-cyan-active/5 rounded p-xs flex flex-col gap-[3px] relative animate-pulse">
            <span className="text-[6px] text-cyan-active/60 font-semibold absolute top-[2px] right-1">Section Container</span>
            <div className="w-8 h-[2px] bg-cyan-active/20 rounded" />
            <div className="w-full h-4 bg-panel rounded-sm border border-panel-border/30" />
          </div>
          <div className="border border-dashed border-cyan-active/20 bg-accent-soft/10 rounded p-xs flex flex-col gap-[3px]">
            <div className="w-12 h-[2px] bg-text-muted/20 rounded" />
            <div className="w-full h-5 bg-panel rounded-sm border border-panel-border/30" />
          </div>
        </div>
      );
    case "grid-2":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex items-center justify-center gap-xs overflow-hidden">
          <div className="w-1/2 h-16 bg-panel border border-panel-border/50 rounded p-xs flex flex-col gap-xs justify-center items-center shadow-sm">
            <div className="w-6 h-6 rounded-full bg-cyan-active/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="w-10 h-[3px] bg-text-muted/30 rounded" />
          </div>
          <div className="w-1/2 h-16 bg-panel border border-panel-border/50 rounded p-xs flex flex-col gap-xs justify-center items-center shadow-sm">
            <div className="w-12 h-[4px] bg-foreground/20 rounded" />
            <div className="w-10 h-[3px] bg-text-muted/30 rounded" />
            <div className="w-8 h-[3px] bg-text-muted/20 rounded" />
          </div>
        </div>
      );
    case "container":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex items-center justify-between relative overflow-hidden">
          <div className="w-6 h-full bg-amber-500/10 border-r border-dashed border-amber-500/25 flex items-center justify-center">
            <span className="text-[6px] text-amber-500/40 font-bold rotate-90 scale-90">margin</span>
          </div>
          <div className="flex-1 h-full mx-xs bg-panel border border-cyan-active/30 rounded p-xs flex flex-col justify-center gap-xs shadow-inner">
            <div className="w-16 h-2 bg-foreground/15 rounded" />
            <div className="w-full h-1 bg-text-muted/10 rounded" />
            <div className="w-3/4 h-1 bg-text-muted/10 rounded" />
          </div>
          <div className="w-6 h-full bg-amber-500/10 border-l border-dashed border-amber-500/25 flex items-center justify-center">
            <span className="text-[6px] text-amber-500/40 font-bold rotate-90 scale-90">margin</span>
          </div>
        </div>
      );
    case "headline":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex flex-col justify-center gap-xs overflow-hidden">
          <div className="border-b border-panel-border/20 pb-[2px]">
            <span className="text-[7px] font-bold text-cyan-active uppercase tracking-widest">H1 Heading Spec</span>
          </div>
          <div className="h-6 flex items-center">
            <h4 className="text-xs font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-active to-deep-teal dark:to-white">
              Crafting Perfect Portfolios
            </h4>
          </div>
          <div className="w-full h-[2px] bg-gradient-to-r from-cyan-active to-transparent rounded" />
        </div>
      );
    case "paragraph":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex flex-col justify-center gap-xs overflow-hidden">
          <div className="flex flex-col gap-xs p-xs">
            <div className="w-full h-2 rounded popover-shimmer-bg" />
            <div className="w-11/12 h-2 rounded popover-shimmer-bg" />
            <div className="w-4/5 h-2 rounded popover-shimmer-bg" />
            <div className="w-1/2 h-2 rounded popover-shimmer-bg" />
          </div>
        </div>
      );
    case "button":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex items-center justify-center overflow-hidden">
          <div className="px-sm py-xs bg-cyan-active text-white rounded font-bold text-[9px] flex items-center gap-[3px] transition-all duration-300 transform [animation:popover-bounce-slow_2s_infinite_ease-in-out,popover-pulse-glow_2s_infinite_ease-in-out]">
            <span>Get Started</span>
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      );
    case "image":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 overflow-hidden relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 via-teal-900 to-cyan-500 scale-105 [animation:popover-zoom-slow_5s_infinite_ease-in-out]" />
          <div className="absolute inset-0 bg-black/25" />
          <div className="z-10 text-white flex flex-col items-center gap-[2px]">
            <svg className="w-5 h-5 text-sky-blue/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[7px] font-bold tracking-widest uppercase text-sky-blue/90">Asset Frame</span>
          </div>
        </div>
      );
    case "video":
      return (
        <div className="w-full h-24 bg-slate-950 rounded-md border border-panel-border/50 overflow-hidden relative flex items-center justify-center">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-800">
            <div className="h-full w-1/3 bg-cyan-active rounded-r" />
          </div>
          <div className="w-7 h-7 rounded-full bg-cyan-active/90 flex items-center justify-center shadow-lg transform [animation:popover-bounce-slow_1.8s_infinite_ease-in-out]">
            <svg className="w-3.5 h-3.5 text-white fill-current ml-[2px]" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="absolute top-1 right-1 text-[6px] bg-black/75 px-1 py-[2px] rounded text-slate-400 font-semibold">
            02:40
          </div>
        </div>
      );
    case "contact-form":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex flex-col justify-center gap-xs overflow-hidden">
          <div className="flex flex-col gap-[2px]">
            <label className="text-[6px] font-bold text-text-muted">Email</label>
            <div className="w-full h-5 rounded border border-panel-border/30 bg-panel px-xs flex items-center">
              <div className="w-16 h-1 bg-foreground/20 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-full h-5.5 bg-cyan-active text-white rounded text-[8px] font-bold flex items-center justify-center shadow-sm">
            Send Message
          </div>
        </div>
      );
    case "turnstile":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 flex items-center justify-center overflow-hidden">
          <div className="flex items-center gap-xs px-sm py-xs bg-panel border border-panel-border/50 rounded shadow-sm w-36 relative">
            <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
              <div className="absolute w-3.5 h-3.5 border border-slate-300 border-t-cyan-active rounded-full [animation:popover-spinner_1s_infinite_linear]" />
              <div className="absolute w-2.5 h-2.5 text-emerald-500 [animation:popover-check-verify_1.5s_infinite_ease-in-out]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-[1px]">
              <span className="text-[7px] font-bold text-foreground leading-none">Turnstile Verified</span>
              <span className="text-[5px] text-text-muted leading-none">Cloudflare Protection</span>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
