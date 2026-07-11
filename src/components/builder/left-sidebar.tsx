"use client";

import React, { useState } from "react";

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
  // Media
  {
    id: "image",
    name: "Image Box",
    category: "media",
    description: "R2-backed asset image with aspect ratios",
    icon: (
      <svg className="w-5 h-5 text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "video",
    name: "Video Player",
    category: "media",
    description: "Custom embedded stream or youtube link",
    icon: (
      <svg className="w-5 h-5 text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  // Forms
  {
    id: "contact-form",
    name: "Contact Form",
    category: "forms",
    description: "Edge-forms compatible input fields panel",
    icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-4.666a2 2 0 012.22 0l8 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.77M21 19l-6.75-4.77M14 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: "turnstile",
    name: "Turnstile Shield",
    category: "forms",
    description: "Cloudflare anti-spam verification token blocker",
    icon: (
      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const CURATED_ASSETS = [
  { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop", tags: ["abstract", "glassmorphic", "art", "purple"] },
  { url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop", tags: ["code", "developer", "terminal", "dark"] },
  { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop", tags: ["laptop", "workspace", "office", "work"] },
  { url: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&auto=format&fit=crop", tags: ["workspace", "minimalist", "white", "design"] },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop", tags: ["beach", "sea", "nature", "summer"] },
  { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop", tags: ["forest", "mountain", "nature", "landscape"] },
  { url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&auto=format&fit=crop", tags: ["bridge", "city", "golden gate", "landscape"] },
  { url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop", tags: ["shoes", "product", "minimalist", "red"] },
  { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop", tags: ["nike", "product", "sneaker", "red"] },
  { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop", tags: ["watch", "product", "white", "gadget"] },
  { url: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&auto=format&fit=crop", tags: ["people", "meeting", "workspace", "colleague"] },
  { url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop", tags: ["wireframe", "design", "ux", "chart"] }
];

interface LeftSidebarProps {
  onAddElement?: (elementId: string) => void;
  onSelectAsset?: (url: string) => void;
}

export default function LeftSidebar({
  onAddElement = () => {},
  onSelectAsset = () => {},
}: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "layout" | "basic" | "media" | "forms" | "assets">("all");

  const filteredElements = REGISTRY_ELEMENTS.filter((el) => {
    const matchesSearch = el.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          el.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || el.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredAssets = CURATED_ASSETS.filter((asset) => {
    if (!searchQuery) return true;
    return asset.tags.some((tag) => tag.includes(searchQuery.toLowerCase()));
  });

  return (
    <aside className="w-sidebar-w border-r border-panel-border bg-panel flex flex-col shrink-0 overflow-hidden select-none z-10 transition-colors duration-200">
      {/* Sidebar Header & Search */}
      <div className="p-md border-b border-panel-border flex flex-col gap-sm shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-bold text-foreground">Element Registry</h2>
          <span className="text-[10px] font-bold px-sm py-[2px] rounded-full bg-accent-soft text-cyan-active uppercase tracking-wide">
            Blocks
          </span>
        </div>
        
        {/* Search Input Box */}
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
      </div>

      {/* Category Pills */}
      <div className="px-md py-sm border-b border-panel-border bg-background/50 flex gap-xs overflow-x-auto scrollbar-none shrink-0">
        {(["all", "layout", "basic", "media", "forms", "assets"] as const).map((cat) => (
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

      {/* Element List container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-md flex flex-col gap-sm">
        {activeCategory === "assets" ? (
          filteredAssets.length > 0 ? (
            <div className="grid grid-cols-2 gap-sm">
              {filteredAssets.map((asset, index) => (
                <div
                  key={index}
                  onClick={() => onSelectAsset(asset.url)}
                  className="group relative border border-panel-border hover:border-cyan-active bg-background rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 aspect-video flex flex-col justify-end"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={`curated-stock-${index}`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="p-xs z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-wrap gap-[2px]">
                    {asset.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[8px] font-bold bg-cyan-active text-white px-1 rounded-sm uppercase tracking-wide">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2xl text-center">
              <svg className="w-10 h-10 text-text-muted mb-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-semibold text-foreground">No matching stock photos</p>
              <p className="text-[10px] text-text-muted mt-xs">{'Try tags like "workspace", "code", "nature", "product".'}</p>
            </div>
          )
        ) : (
          filteredElements.length > 0 ? (
            filteredElements.map((el) => (
              <div
                key={el.id}
                onClick={() => onAddElement(el.id)}
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
        {activeCategory === "assets"
          ? "ℹ️ Click any image to insert it as a new block, or to update the selected canvas image component."
          : "ℹ️ Click on a component block to insert it directly into the selected slot on the canvas workspace."}
      </div>
    </aside>
  );
}
