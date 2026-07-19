"use client";

import React, { useState } from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import { getStyleClasses, getStyleProps, getResolvedStyles, mapColor } from "@/lib/compiler/style-utils";
import { compileLayout } from "@/lib/compiler";

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
  pageSettings: PageSettings;
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
  pageSettings,
}: WorkspaceCanvasProps) {
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const themePalette = pageSettings.themePalette;

  // Reset custom width when changing active device during render
  const [prevActiveDevice, setPrevActiveDevice] = useState(activeDevice);
  if (activeDevice !== prevActiveDevice) {
    setPrevActiveDevice(activeDevice);
    setCustomWidth(null);
  }

  // Get unique Google Fonts used in the canvas elements (including overrides)
  const uniqueFonts = Array.from(
    new Set(
      [
        pageSettings.fontFamily,
        ...canvasElements.flatMap((el) => [
          el.styles.fontFamily,
          el.styles.mobile?.fontFamily,
          el.styles.tablet?.fontFamily,
        ])
      ].filter((font): font is string => !!font)
    )
  );

  const googleFontsUrl = uniqueFonts.length > 0
    ? `https://fonts.googleapis.com/css2?family=${uniqueFonts.map(f => `${encodeURIComponent(f)}:wght@300;400;500;600;700;800`).join("&family=")}&display=swap`
    : "";

  const compiledHtml = previewMode ? compileLayout(canvasElements, pageSettings) : "";

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

  // Device Frame classes calculation
  const getDeviceFrameStyles = () => {
    if (activeDevice === "mobile") {
      return "w-[375px] h-[640px] rounded-[40px] border-[12px] border-dark-slate shadow-2xl relative bg-panel overflow-hidden";
    }
    if (activeDevice === "tablet") {
      return "w-[768px] h-[900px] rounded-[24px] border-[10px] border-dark-slate shadow-xl relative bg-panel overflow-hidden";
    }
    return "w-full min-h-full bg-panel shadow-sm";
  };

  // Recursively render elements
  const renderElement = (el: CanvasElement): React.ReactNode => {
    const isSelected = selectedElementId === el.id;
    const isHovered = hoveredElementId === el.id;
    const styleClasses = getStyleClasses(el, activeDevice);
    const customStyles = getStyleProps(el, activeDevice, themePalette);
    const resolvedStyles = getResolvedStyles(el, activeDevice);
    
    // Find children of this element
    const children = canvasElements.filter(child => child.parentId === el.id);
    const isGridColumn = el.parentId && canvasElements.some(parent => parent.id === el.parentId && parent.type === "grid-2");

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
            {!isGridColumn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateElement(el.id);
                }}
                className="p-[3px] hover:bg-white/10 rounded transition-colors"
                title="Duplicate Element"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  <rect x="9" y="9" width="11" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} />
                </svg>
              </button>
            )}
            {/* Delete */}
            {!isGridColumn && (
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
            )}
          </div>
        )}

        {/* Render components by Type */}
        {el.type === "section" && (
          <>
            {children.length > 0 ? (
              children.map(child => renderElement(child))
            ) : !previewMode ? (
              <div className="w-full flex flex-col gap-md border border-panel-border rounded-xl p-md bg-panel shadow-sm">
                <span className="text-[10px] text-text-muted select-none italic font-medium">Empty Section Container (Choose this as parent in other block settings to nest components)</span>
              </div>
            ) : null}
          </>
        )}

        {el.type === "grid-2" && (
          <>
            {children.length > 0 ? (
              children.map(child => renderElement(child))
            ) : !previewMode ? (
              <>
                <div className="w-full border border-panel-border rounded-xl p-md bg-panel shadow-sm text-center py-lg">
                  <span className="text-[10px] text-text-muted italic">Column A</span>
                </div>
                <div className="w-full border border-panel-border rounded-xl p-md bg-panel shadow-sm text-center py-lg">
                  <span className="text-[10px] text-text-muted italic">Column B</span>
                </div>
              </>
            ) : null}
          </>
        )}

        {el.type === "container" && (
          <>
            {children.length > 0 ? (
              children.map(child => renderElement(child))
            ) : !previewMode ? (
              isGridColumn ? (
                <div className="w-full border border-panel-border rounded-xl p-md bg-panel shadow-sm text-center py-lg">
                  <span className="text-[10px] text-text-muted italic">{el.name || "Column"} (Empty)</span>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-md border border-panel-border rounded-xl p-md bg-panel shadow-sm">
                  <span className="text-[10px] text-text-muted select-none italic font-medium">Standard Content Wrapper (Choose this as parent in other block settings to nest components)</span>
                </div>
              )
            ) : null}
          </>
        )}

        {el.type === "headline" && (
          <h2 className="font-extrabold tracking-tight leading-tight select-none">
            {el.content}
          </h2>
        )}

        {el.type === "paragraph" && (
          <p className="leading-relaxed opacity-80 font-medium select-none">
            {el.content}
          </p>
        )}

        {el.type === "button" && (
          <div className={`${resolvedStyles.align === "center" ? "flex justify-center" : resolvedStyles.align === "right" ? "flex justify-end" : "flex justify-start"}`}>
            <button
              style={customStyles}
              className={`px-lg h-10 select-none font-bold text-xs shadow-md transition-all duration-200 cursor-pointer ${resolvedStyles.borderRadius || "rounded-none"}`}
            >
              {el.content}
            </button>
          </div>
        )}

        {el.type === "subheading" && (
          <h3 className="font-semibold tracking-tight select-none">
            {el.content}
          </h3>
        )}

        {el.type === "blockquote" && (
          <blockquote className="border-l-4 border-cyan-active pl-md italic opacity-85 font-medium select-none bg-accent-soft/10 py-xs rounded-r-md">
            {el.content}
          </blockquote>
        )}

        {el.type === "list" && (
          <ul className="list-disc pl-md opacity-80 select-none flex flex-col gap-xs">
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
      className="light flex-1 bg-background canvas-grid overflow-y-auto custom-scrollbar flex items-start justify-center p-md sm:p-xl select-none"
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
          backgroundColor: mapColor(pageSettings.backgroundColor || "#01303f", themePalette),
          color: mapColor(pageSettings.textColor || "#ffffff", themePalette),
          fontFamily: pageSettings.fontFamily ? `'${pageSettings.fontFamily}', sans-serif` : undefined,
        } as React.CSSProperties}
      >
        {/* Mobile Camera notch and status indicators for simulated device borders */}
        {activeDevice === "mobile" && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-dark-slate rounded-b-xl z-30 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 mr-2" />
            <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
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
        <div
          className="w-full h-full overflow-y-auto"
          style={{
            padding: (() => {
              switch (pageSettings.padding) {
                case "space-none": return "0px";
                case "space-xs": return "0.25rem";
                case "space-sm": return "0.5rem";
                case "space-md": return "1rem";
                case "space-lg": return "2rem 1.5rem";
                case "space-xl": return "3rem 2rem";
                case "space-2xl": return "4rem 3rem";
                default: return "2rem 1.5rem";
              }
            })(),
            minHeight: activeDevice === "desktop" ? "100%" : undefined
          }}
        >
          <div className="flex flex-col w-full h-full">
            {previewMode ? (
              <iframe
                srcDoc={compiledHtml}
                className="w-full h-full border-none bg-transparent"
                title="Portfolio Preview"
              />
            ) : (
              <div
                className="portfolio-wrapper w-full"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxWidth: pageSettings.widthMode === "boxed-md" ? "768px" :
                            pageSettings.widthMode === "boxed-lg" ? "1024px" :
                            pageSettings.widthMode === "boxed-xl" ? "1280px" :
                            pageSettings.widthMode === "full" ? "100%" : "768px",
                  gap: pageSettings.gap === "space-none" ? "0" :
                       pageSettings.gap === "space-xs" ? "0.25rem" :
                       pageSettings.gap === "space-sm" ? "0.5rem" :
                       pageSettings.gap === "space-md" ? "1rem" :
                       pageSettings.gap === "space-lg" ? "1.5rem" :
                       pageSettings.gap === "space-xl" ? "2rem" :
                       pageSettings.gap === "space-2xl" ? "3rem" : "1.5rem",
                }}
              >
                {canvasElements
                  .filter((el) => !el.parentId || !canvasElements.some(p => p.id === el.parentId))
                  .map((el) => renderElement(el))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
