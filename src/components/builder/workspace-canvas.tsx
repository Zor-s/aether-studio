"use client";

import React, { useState } from "react";

export interface CanvasElement {
  id: string;
  name?: string;
  parentId?: string;
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
    fontFamily?: string;
    direction?: string;
    justify?: string;
    alignItems?: string;
    gap?: string;
    widthMode?: string;
    minHeight?: string;
    mobile?: {
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
      fontFamily?: string;
      direction?: string;
      justify?: string;
      alignItems?: string;
      gap?: string;
      widthMode?: string;
      minHeight?: string;
    };
    tablet?: {
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
      fontFamily?: string;
      direction?: string;
      justify?: string;
      alignItems?: string;
      gap?: string;
      widthMode?: string;
      minHeight?: string;
    };
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

  // Get unique Google Fonts used in the canvas elements (including overrides)
  const uniqueFonts = Array.from(
    new Set(
      canvasElements
        .flatMap((el) => [
          el.styles.fontFamily,
          el.styles.mobile?.fontFamily,
          el.styles.tablet?.fontFamily,
        ])
        .filter((font): font is string => !!font)
    )
  );

  const googleFontsUrl = uniqueFonts.length > 0
    ? `https://fonts.googleapis.com/css2?family=${uniqueFonts.map(f => `${encodeURIComponent(f)}:wght@300;400;500;600;700;800`).join("&family=")}&display=swap`
    : "";

  const getResolvedStyles = (el: CanvasElement) => {
    const base = el.styles;
    if (activeDevice === "mobile") {
      return { ...base, ...base.mobile };
    }
    if (activeDevice === "tablet") {
      return { ...base, ...base.tablet };
    }
    return base;
  };

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
    const s = getResolvedStyles(el);
    const classes: string[] = [];

    // Margin mapping
    const isLayoutComponent = ["section", "container", "grid-2"].includes(el.type);
    const marginPrefix = isLayoutComponent ? "my-" : "m-";
    if (s.margin === "space-none") classes.push(`${marginPrefix}none`);
    else if (s.margin === "space-xs") classes.push(`${marginPrefix}xs`);
    else if (s.margin === "space-sm") classes.push(`${marginPrefix}sm`);
    else if (s.margin === "space-md") classes.push(`${marginPrefix}md`);
    else if (s.margin === "space-lg") classes.push(`${marginPrefix}lg`);
    else if (s.margin === "space-xl") classes.push(`${marginPrefix}xl`);
    else if (s.margin === "space-2xl") classes.push(`${marginPrefix}2xl`);

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

    // Flex layout container base class and mappings (for section / container)
    if (["section", "container"].includes(el.type)) {
      classes.push("flex");

      // Flex direction mapping
      if (s.direction === "row") {
        classes.push("flex-row");
      } else {
        classes.push("flex-col"); // Default to flex-col
      }

      // Justify content mapping
      if (s.justify === "start") classes.push("justify-start");
      else if (s.justify === "end") classes.push("justify-end");
      else if (s.justify === "between") classes.push("justify-between");
      else classes.push("justify-center"); // Default to justify-center

      // Align items mapping
      if (s.alignItems === "start") classes.push("items-start");
      else if (s.alignItems === "end") classes.push("items-end");
      else if (s.alignItems === "stretch") classes.push("items-stretch");
      else classes.push("items-center"); // Default to items-center

      // Gap mapping
      if (s.gap === "space-none") classes.push("gap-0");
      else if (s.gap === "space-xs") classes.push("gap-xs");
      else if (s.gap === "space-sm") classes.push("gap-sm");
      else if (s.gap === "space-lg") classes.push("gap-lg");
      else if (s.gap === "space-xl") classes.push("gap-xl");
      else if (s.gap === "space-2xl") classes.push("gap-2xl");
      else classes.push("gap-md"); // Default to gap-md (gap-6)

      // Width containment mode mapping
      if (s.widthMode === "boxed-sm") classes.push("max-w-[384px] mx-auto w-full");
      else if (s.widthMode === "boxed-md") classes.push("max-w-[448px] mx-auto w-full");
      else if (s.widthMode === "boxed-lg") classes.push("max-w-[512px] mx-auto w-full");
      else if (s.widthMode === "boxed-xl") classes.push("max-w-[576px] mx-auto w-full");
      else classes.push("w-full"); // Default to w-full

      // Min height class mapping
      if (s.minHeight === "screen") classes.push("min-h-screen");
      else if (s.minHeight === "auto") classes.push("min-h-auto");
    }

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
    const s = getResolvedStyles(el);
    const props: React.CSSProperties = {};
    if (s.color) {
      const mappedColor = mapColor(s.color);
      if (["button", "section", "container", "grid-2"].includes(el.type)) {
        props.backgroundColor = mappedColor;
        // Contrast calculation for text (simple rule)
        const val = s.color.toLowerCase().trim();
        const isLightBg = ["#d4f0fc", "#89d6fb", "var(--brand-ice-blue)", "var(--brand-sky-blue)"].includes(val);
        props.color = isLightBg ? "var(--brand-dark-slate)" : "#ffffff";
      } else {
        props.color = mappedColor;
      }
    }

    // Border style properties mapping
    if (s.borderStyle && s.borderStyle !== "none") {
      props.borderStyle = s.borderStyle as React.CSSProperties["borderStyle"];
      props.borderWidth = `${s.borderWidth || 0}px`;
      if (s.borderColor) {
        props.borderColor = mapColor(s.borderColor);
      } else {
        props.borderColor = "var(--panel-border)"; // Default fallback color
      }
    }

    // Font family mapping
    if (s.fontFamily) {
      props.fontFamily = s.fontFamily;
    }

    // Min height custom pixel mapping
    if (s.minHeight) {
      if (s.minHeight === "h-300") props.minHeight = "300px";
      else if (s.minHeight === "h-500") props.minHeight = "500px";
      else if (s.minHeight === "h-700") props.minHeight = "700px";
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

  // Recursively render elements
  const renderElement = (el: CanvasElement): React.ReactNode => {
    const isSelected = selectedElementId === el.id;
    const isHovered = hoveredElementId === el.id;
    const styleClasses = getStyleClasses(el);
    const customStyles = getStyleProps(el);
    
    // Find children of this element
    const children = canvasElements.filter(child => child.parentId === el.id);

    return (
      <div
        key={el.id}
        draggable={!previewMode}
        onDragStart={(e) => {
          if (previewMode) return;
          e.stopPropagation();
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
          e.stopPropagation();
          const sourceId = e.dataTransfer.getData("text/plain");
          if (sourceId && sourceId !== el.id) {
            onReorderElements(sourceId, el.id);
          }
        }}
        onMouseEnter={(e) => {
          if (previewMode) return;
          e.stopPropagation();
          setHoveredElementId(el.id);
        }}
        onMouseLeave={(e) => {
          if (previewMode) return;
          e.stopPropagation();
          setHoveredElementId(null);
        }}
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
          <>
            {children.length > 0 ? (
              children.map(child => renderElement(child))
            ) : !previewMode ? (
              <div className="w-full flex flex-col gap-md justify-center items-center border border-dashed border-panel-border/40 rounded-xl bg-background/20 p-md min-h-[80px]">
                <span className="text-[10px] text-text-muted select-none italic font-medium">Empty Section Container (Choose this as parent in other block settings to nest components)</span>
              </div>
            ) : null}
          </>
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
          <>
            {children.length > 0 ? (
              children.map(child => renderElement(child))
            ) : !previewMode ? (
              <div className="w-full flex flex-col gap-md border border-panel-border rounded-xl p-md bg-panel shadow-sm">
                <span className="text-[10px] text-text-muted select-none italic font-medium">Standard Content Wrapper (Choose this as parent in other block settings to nest components)</span>
              </div>
            ) : null}
          </>
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

        {el.type === "subheading" && (
          <h3 className="font-semibold tracking-tight text-foreground select-none">
            {el.content}
          </h3>
        )}

        {el.type === "blockquote" && (
          <blockquote className="border-l-4 border-cyan-active pl-md italic text-text-muted font-medium select-none bg-accent-soft/10 py-xs rounded-r-md">
            {el.content}
          </blockquote>
        )}

        {el.type === "list" && (
          <ul className="list-disc pl-md text-text-muted select-none flex flex-col gap-xs">
            {el.content.split('\n').filter(Boolean).map((item, idx) => (
              <li key={idx} className="font-medium">{item}</li>
            ))}
          </ul>
        )}

        {el.type === "divider" && (
          <hr className="w-full border-t border-panel-border my-sm select-none" />
        )}
      </div>
    );
  };

  return (
    <div
      className="flex-1 bg-background canvas-grid overflow-y-auto custom-scrollbar flex items-start justify-center p-md sm:p-xl select-none"
      onClick={() => {
        if (!previewMode) {
          setSelectedElementId(null);
        }
      }}
    >
      {/* Load selected Google Fonts dynamically */}
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
      
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
            {canvasElements
              .filter((el) => !el.parentId || !canvasElements.some(p => p.id === el.parentId))
              .map((el) => renderElement(el))}
          </div>
        </div>
      </div>
    </div>
  );
}
