"use client";

import React, { useState } from "react";

export interface CanvasElement {
  id: string;
  type: string;
  content: string;
  category: "layout" | "basic" | "media" | "forms";
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
}

interface WorkspaceCanvasProps {
  activeDevice: "desktop" | "tablet" | "mobile";
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  previewMode: boolean;
  canvasElements: CanvasElement[];
  onSelectElement: (element: CanvasElement) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  onMoveElement?: (id: string, direction: "up" | "down") => void;
  onReorderElements?: (sourceId: string, targetId: string) => void;
  themePalette?: {
    iceBlue: string;
    skyBlue: string;
    cyanActive: string;
    deepTeal: string;
    darkSlate: string;
  };
}

export default function WorkspaceCanvas({
  activeDevice,
  selectedElementId,
  setSelectedElementId,
  previewMode,
  canvasElements,
  onSelectElement,
  onDeleteElement = () => {},
  onDuplicateElement = () => {},
  onMoveElement = () => {},
  onReorderElements = () => {},
  themePalette = {
    iceBlue: "#d4f0fc",
    skyBlue: "#89d6fb",
    cyanActive: "#02a9f7",
    deepTeal: "#02577a",
    darkSlate: "#01303f",
  },
}: WorkspaceCanvasProps) {
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Reset custom width when changing active device during render
  const [prevActiveDevice, setPrevActiveDevice] = useState(activeDevice);
  if (activeDevice !== prevActiveDevice) {
    setPrevActiveDevice(activeDevice);
    setCustomWidth(null);
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (previewMode) return;
    e.preventDefault();
    const handle = e.currentTarget;
    const wrapper = handle.parentElement;
    if (!wrapper) return;
    
    setIsDragging(true);
    handle.setPointerCapture(e.pointerId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      let newWidth = Math.round(2 * Math.abs(moveEvent.clientX - centerX));

      // Enforce limits
      const minWidth = activeDevice === "mobile" ? 320 : 480;
      const maxWidth = activeDevice === "mobile" ? 480 : 1024;
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;

      setCustomWidth(newWidth);
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      setIsDragging(false);
      try {
        handle.releasePointerCapture(upEvent.pointerId);
      } catch {
      }
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  // Helper to translate style classes to Tailwind classes
  const getStyleClasses = (el: CanvasElement) => {
    const s = el.styles;
    const classes: string[] = [];

    // Margin mapping
    if (s.margin === "space-none") classes.push("m-none");
    else if (s.margin === "space-xs") classes.push("m-xs");
    else if (s.margin === "space-sm") classes.push("m-sm");
    else if (s.margin === "space-md") classes.push("m-md");
    else if (s.margin === "space-lg") classes.push("m-lg");
    else if (s.margin === "space-xl") classes.push("m-xl");
    else if (s.margin === "space-2xl") classes.push("m-2xl");

    // Padding mapping
    if (s.padding === "space-none") classes.push("p-none");
    else if (s.padding === "space-xs") classes.push("p-xs");
    else if (s.padding === "space-sm") classes.push("p-sm");
    else if (s.padding === "space-md") classes.push("p-md");
    else if (s.padding === "space-lg") classes.push("p-lg");
    else if (s.padding === "space-xl") classes.push("p-xl");
    else if (s.padding === "space-2xl") classes.push("p-2xl");

    // Font size mapping
    if (s.fontSize) classes.push(s.fontSize);

    // Text Alignment mapping
    if (s.align === "left") classes.push("text-left");
    else if (s.align === "center") classes.push("text-center");
    else if (s.align === "right") classes.push("text-right");

    // Border Radius mapping
    if (s.borderRadius) classes.push(s.borderRadius);

    // Font weight mapping
    if (s.fontWeight) classes.push(s.fontWeight);

    // Letter spacing mapping
    if (s.letterSpacing) classes.push(s.letterSpacing);

    return classes.join(" ");
  };

  const mapColor = (colorVal: string) => {
    if (!colorVal) return colorVal;
    
    // Normalize to lowercase for robust matching
    const val = colorVal.toLowerCase().trim();

    // Map base/original aether hexes to variables so presets and customized colors work
    if (val === "#d4f0fc") return "var(--brand-ice-blue)";
    if (val === "#89d6fb") return "var(--brand-sky-blue)";
    if (val === "#02a9f7") return "var(--brand-cyan-active)";
    if (val === "#02577a") return "var(--brand-deep-teal)";
    if (val === "#01303f") return "var(--brand-dark-slate)";

    return colorVal;
  };

  const getStyleProps = (el: CanvasElement) => {
    const props: React.CSSProperties = {};
    if (el.styles.color) {
      const mappedColor = mapColor(el.styles.color);
      if (el.type === "button") {
        props.backgroundColor = mappedColor;
        // Contrast calculation for text (simple rule)
        const val = el.styles.color.toLowerCase().trim();
        const isLightBg = ["#d4f0fc", "#89d6fb", "var(--brand-ice-blue)", "var(--brand-sky-blue)"].includes(val);
        props.color = isLightBg ? "var(--brand-dark-slate)" : "#ffffff";
      } else {
        props.color = mappedColor;
      }
    }

    // Border style properties mapping
    if (el.styles.borderStyle && el.styles.borderStyle !== "none") {
      props.borderStyle = el.styles.borderStyle as React.CSSProperties["borderStyle"];
      props.borderWidth = `${el.styles.borderWidth || 0}px`;
      if (el.styles.borderColor) {
        props.borderColor = mapColor(el.styles.borderColor);
      } else {
        props.borderColor = "var(--panel-border)"; // Default fallback color
      }
    }
    return props;
  };

  // Device Frame classes calculation
  const getDeviceFrameStyles = () => {
    if (activeDevice === "mobile") {
      return "w-[375px] min-h-[640px] rounded-[40px] border-[12px] border-dark-slate shadow-2xl relative bg-panel";
    }
    if (activeDevice === "tablet") {
      return "w-[768px] min-h-[900px] rounded-[24px] border-[10px] border-dark-slate shadow-xl relative bg-panel";
    }
    return "w-full min-h-full bg-panel shadow-sm";
  };

  return (
    <div className="flex-1 bg-background canvas-grid overflow-y-auto custom-scrollbar flex items-start justify-center p-md sm:p-xl select-none">
      {/* Dynamic Device Wrapper */}
      <div
        className={`group/device relative ${isDragging ? "transition-none" : "transition-all duration-300 ease-in-out"} ${getDeviceFrameStyles()}`}
        style={{
          ...(customWidth !== null && activeDevice !== "desktop" ? { width: `${customWidth}px` } : {}),
          "--brand-ice-blue": themePalette.iceBlue,
          "--brand-sky-blue": themePalette.skyBlue,
          "--brand-cyan-active": themePalette.cyanActive,
          "--brand-deep-teal": themePalette.deepTeal,
          "--brand-dark-slate": themePalette.darkSlate,
        } as React.CSSProperties}
      >
        {/* Mobile Camera notch and status indicators for simulated device borders */}
        {activeDevice === "mobile" && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-dark-slate rounded-b-xl z-30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
            <div className="w-12 h-1 bg-slate-800 rounded-full" />
          </div>
        )}

        {/* Left Resizer Handle (Visible only in non-preview mode for Mobile/Tablet) */}
        {!previewMode && activeDevice !== "desktop" && (
          <div
            onPointerDown={handlePointerDown}
            onDoubleClick={() => setCustomWidth(null)}
            className="absolute top-0 bottom-0 -left-[6px] w-[12px] cursor-ew-resize group/resizer z-40 flex items-center justify-center"
            title="Drag to resize, double-click to reset"
          >
            <div className="w-[4px] h-12 rounded-full bg-cyan-active/40 group-hover/resizer:bg-cyan-active group-hover/resizer:h-20 transition-all duration-200" />
          </div>
        )}

        {/* Right Resizer Handle (Visible only in non-preview mode for Mobile/Tablet) */}
        {!previewMode && activeDevice !== "desktop" && (
          <div
            onPointerDown={handlePointerDown}
            onDoubleClick={() => setCustomWidth(null)}
            className="absolute top-0 bottom-0 -right-[6px] w-[12px] cursor-ew-resize group/resizer z-40 flex items-center justify-center"
            title="Drag to resize, double-click to reset"
          >
            <div className="w-[4px] h-12 rounded-full bg-cyan-active/40 group-hover/resizer:bg-cyan-active group-hover/resizer:h-20 transition-all duration-200" />
          </div>
        )}

        {/* Dynamic Width Indicator Tooltip */}
        {!previewMode && activeDevice !== "desktop" && (
          <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-sm py-[3px] rounded bg-dark-slate border border-panel-border text-white text-[10px] font-mono font-bold z-40 transition-opacity duration-200 ${
            isDragging ? "opacity-100" : "opacity-0 pointer-events-none group-hover/device:opacity-100"
          }`}>
            {customWidth !== null ? customWidth : activeDevice === "mobile" ? 375 : 768}px
          </div>
        )}

        {/* Scrollable Inside Viewport */}
        <div className={`w-full h-full ${activeDevice !== "desktop" ? "py-md px-sm overflow-hidden" : ""}`}>
          <div className="flex flex-col w-full h-full">
            {canvasElements.map((el) => {
              const isSelected = selectedElementId === el.id;
              const isHovered = hoveredElementId === el.id;
              const styleClasses = getStyleClasses(el);
              const customStyles = getStyleProps(el);

              // Render dynamic elements
              return (
                <div
                  key={el.id}
                  draggable={!previewMode}
                  onDragStart={(e) => {
                    if (previewMode) return;
                    e.dataTransfer.setData("text/plain", el.id);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    if (previewMode) return;
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    if (previewMode) return;
                    e.preventDefault();
                    const sourceId = e.dataTransfer.getData("text/plain");
                    if (sourceId && sourceId !== el.id) {
                      onReorderElements(sourceId, el.id);
                    }
                  }}
                  onMouseEnter={() => !previewMode && setHoveredElementId(el.id)}
                  onMouseLeave={() => !previewMode && setHoveredElementId(null)}
                  onClick={(e) => {
                    if (previewMode) return;
                    e.stopPropagation();
                    onSelectElement(el);
                  }}
                  style={el.type !== "button" ? customStyles : undefined}
                  className={`group/item relative transition-all duration-200 ${
                    !previewMode
                      ? `cursor-pointer ${
                          isSelected
                            ? "outline outline-2 outline-cyan-active outline-offset-[2px] z-20"
                            : isHovered
                            ? "outline outline-dashed outline-1 outline-sky-blue outline-offset-[2px]"
                            : ""
                        }`
                      : ""
                  } ${styleClasses}`}
                >
                  {/* Dropzone Guideline Indicators (Only in Edit Mode & if Hovered & NOT Selected) */}
                  {!previewMode && isHovered && !isSelected && (
                    <>
                      {/* Top Dropzone Guideline */}
                      <div className="absolute top-0 left-0 right-0 h-0 flex items-center justify-center z-10 pointer-events-none animate-fadeIn">
                        <div className="w-full border-t border-dashed border-cyan-active/60 relative">
                          <div className="absolute -translate-y-1/2 left-1/2 -translate-x-1/2 bg-cyan-active text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md scale-90 hover:scale-100 transition-transform">
                            +
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Dropzone Guideline */}
                      <div className="absolute bottom-0 left-0 right-0 h-0 flex items-center justify-center z-10 pointer-events-none animate-fadeIn">
                        <div className="w-full border-b border-dashed border-cyan-active/60 relative">
                          <div className="absolute -translate-y-1/2 left-1/2 -translate-x-1/2 bg-cyan-active text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md scale-90 hover:scale-100 transition-transform">
                            +
                          </div>
                        </div>
                      </div>

                      {/* Left & Right Vertical drop ticks */}
                      <div className="absolute top-0 bottom-0 left-0 w-0 border-l border-dashed border-cyan-active/30 pointer-events-none" />
                      <div className="absolute top-0 bottom-0 right-0 w-0 border-r border-dashed border-cyan-active/30 pointer-events-none" />
                    </>
                  )}

                  {/* Element Action menu overlays (Only in Edit Mode & if Selected) */}
                  {!previewMode && isSelected && (
                    <div className="absolute -top-9 right-0 bg-cyan-active text-white text-[10px] font-bold rounded-lg shadow-md flex items-center px-1 py-[3px] z-30 select-none animate-fadeIn">
                      <span className="px-xs border-r border-white/20 mr-1 opacity-90 select-none uppercase tracking-wide">
                        {el.type}
                      </span>
                      {/* Move Up */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveElement(el.id, "up");
                        }}
                        className="p-[3px] hover:bg-white/10 rounded transition-colors"
                        title="Move Up"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      {/* Move Down */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveElement(el.id, "down");
                        }}
                        className="p-[3px] hover:bg-white/10 rounded transition-colors"
                        title="Move Down"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {/* Duplicate */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateElement(el.id);
                        }}
                        className="p-[3px] hover:bg-white/10 rounded transition-colors"
                        title="Duplicate Element"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7v8a2 2 0 002 2h6M8 7a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H10a2 2 0 01-2-2V7z" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteElement(el.id);
                          setSelectedElementId(null);
                        }}
                        className="p-[3px] hover:bg-red-500 rounded transition-colors"
                        title="Delete Element"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Render components by Type */}
                  {el.type === "section" && (
                    <div className="border border-dashed border-panel-border/40 rounded-xl bg-background/20 p-md min-h-[80px] flex flex-col justify-center items-center">
                      <span className="text-[10px] text-text-muted select-none italic font-medium">Empty Section Container</span>
                    </div>
                  )}

                  {el.type === "grid-2" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md w-full">
                      <div className="border border-dashed border-panel-border/30 rounded-lg p-md text-center bg-background/10">
                        <span className="text-[10px] text-text-muted italic">Column A</span>
                      </div>
                      <div className="border border-dashed border-panel-border/30 rounded-lg p-md text-center bg-background/10">
                        <span className="text-[10px] text-text-muted italic">Column B</span>
                      </div>
                    </div>
                  )}

                  {el.type === "container" && (
                    <div className="border border-panel-border rounded-xl p-md bg-panel shadow-sm w-full">
                      <span className="text-[10px] text-text-muted select-none italic font-medium">Standard Content Wrapper</span>
                    </div>
                  )}

                  {el.type === "headline" && (
                    <h2 className="font-extrabold tracking-tight leading-tight leading-none text-foreground select-none">
                      {el.content}
                    </h2>
                  )}

                  {el.type === "paragraph" && (
                    <p className="leading-relaxed text-text-muted font-medium select-none">
                      {el.content}
                    </p>
                  )}

                  {el.type === "button" && (
                    <div className={`${el.styles.align === "center" ? "flex justify-center" : el.styles.align === "right" ? "flex justify-end" : "flex justify-start"}`}>
                      <button
                        style={customStyles}
                        className="px-lg h-10 select-none font-bold text-xs shadow-md transition-all duration-200 cursor-pointer"
                      >
                        {el.content}
                      </button>
                    </div>
                  )}

                  {el.type === "image" && (
                    <div className="overflow-hidden rounded-xl bg-slate-100 max-h-[300px] border border-panel-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={el.content || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop"}
                        alt="Canvas visual"
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                    </div>
                  )}

                  {el.type === "video" && (
                    <div className="aspect-video w-full rounded-xl bg-slate-900 border border-panel-border flex items-center justify-center text-white relative">
                      <svg className="w-12 h-12 text-sky-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 px-xs py-[2px] rounded text-zinc-300 font-mono">
                        Embedded Video Stream
                      </span>
                    </div>
                  )}

                  {el.type === "contact-form" && (
                    <div className="border border-panel-border rounded-2xl bg-panel p-md shadow-md w-full flex flex-col gap-sm">
                      <span className="text-[10px] font-bold text-cyan-active uppercase tracking-wide">Contact Form Component</span>
                      <div className="flex flex-col gap-xs">
                        <input
                          disabled
                          type="text"
                          placeholder="Your Name"
                          className="w-full h-9 px-sm rounded-lg border border-panel-border text-xs bg-background placeholder-text-muted focus:outline-none"
                        />
                        <input
                          disabled
                          type="email"
                          placeholder="your.email@example.com"
                          className="w-full h-9 px-sm rounded-lg border border-panel-border text-xs bg-background placeholder-text-muted focus:outline-none"
                        />
                        <textarea
                          disabled
                          placeholder="Message content..."
                          rows={2}
                          className="w-full p-sm rounded-lg border border-panel-border text-xs bg-background placeholder-text-muted focus:outline-none resize-none"
                        />
                      </div>
                      <button
                        disabled
                        className="w-full h-9 rounded-lg bg-deep-teal text-white text-xs font-bold transition-all"
                      >
                        Submit Query
                      </button>
                    </div>
                  )}

                  {el.type === "turnstile" && (
                    <div className="flex items-center gap-sm border border-panel-border rounded-xl bg-background/50 p-sm select-none w-full max-w-[300px]">
                      <svg className="w-5 h-5 text-emerald-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div className="flex-1 flex flex-col leading-none">
                        <span className="text-[10px] font-bold text-foreground">Turnstile Verification Shield</span>
                        <span className="text-[8px] text-text-muted mt-[2px]">Cloudflare bot verification active</span>
                      </div>
                      <span className="w-3.5 h-3.5 rounded-full border border-emerald-500 flex items-center justify-center text-emerald-500 font-bold text-[8px]">
                        ✓
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
