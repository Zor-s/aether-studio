"use client";

import React, { useState } from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import { mapColor } from "@/lib/compiler/style-utils";
import { compileLayout } from "@/lib/compiler";
import {
  PAGE_PADDING_MAP,
  PAGE_WIDTH_MAP,
  SPACE_MAP,
} from "@/lib/compiler/style-maps";
import CanvasElementRenderer from "./canvas-element-renderer";
import CanvasDeviceResizer from "./canvas-device-resizer";

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
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [iframeHeight, setIframeHeight] = useState<number | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const themePalette = pageSettings.themePalette;

  const [prevActiveDevice, setPrevActiveDevice] = useState(activeDevice);
  if (activeDevice !== prevActiveDevice) {
    setPrevActiveDevice(activeDevice);
    setCustomWidth(null);
  }

  const uniqueFonts = Array.from(
    new Set(
      [
        pageSettings.fontFamily,
        ...canvasElements.flatMap((el) => [
          el.styles.fontFamily,
          el.styles.mobile?.fontFamily,
          el.styles.tablet?.fontFamily,
        ]),
      ].filter((font): font is string => !!font)
    )
  );

  const googleFontsUrl =
    uniqueFonts.length > 0
      ? `https://fonts.googleapis.com/css2?family=${uniqueFonts
          .map((f) => `${encodeURIComponent(f)}:wght@300;400;500;600;700;800`)
          .join("&family=")}&display=swap`
      : "";

  const compiledHtml = previewMode ? compileLayout(canvasElements, pageSettings) : "";

  React.useEffect(() => {
    setIframeHeight(null);
  }, [previewMode, activeDevice, compiledHtml]);

  const handleIframeLoad = () => {
    if (iframeRef.current?.contentWindow) {
      try {
        const doc = iframeRef.current.contentWindow.document;
        const updateHeight = () => {
          const h = Math.max(
            doc.body?.scrollHeight || 0,
            doc.documentElement?.scrollHeight || 0
          );
          if (h > 0) setIframeHeight(h);
        };
        updateHeight();
        if (doc.body) {
          const observer = new ResizeObserver(updateHeight);
          observer.observe(doc.body);
        }
      } catch (err) {
        console.error("Error measuring iframe content height:", err);
      }
    }
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
      } catch {}
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const getDeviceFrameStyles = () => {
    if (activeDevice === "mobile") {
      return "w-[375px] max-w-full h-full sm:h-[640px] max-h-full rounded-[28px] sm:rounded-[40px] border-[8px] sm:border-[12px] border-dark-slate shadow-2xl relative bg-dark-slate flex flex-col shrink-0 overflow-hidden";
    }
    if (activeDevice === "tablet") {
      return "w-[768px] min-w-[768px] h-full sm:h-[900px] max-h-full rounded-[18px] sm:rounded-[24px] border-[6px] sm:border-[10px] border-dark-slate shadow-xl relative bg-dark-slate flex flex-col shrink-0 overflow-hidden";
    }
    return previewMode
      ? "w-full min-w-[1024px] lg:min-w-0 h-full bg-dark-slate shadow-sm flex flex-col shrink-0 overflow-hidden"
      : "w-full min-w-[1024px] lg:min-w-0 h-full rounded-xl border border-panel-border/30 shadow-xl relative bg-dark-slate flex flex-col shrink-0 overflow-hidden";
  };

  return (
    <div
      className={`light flex-1 h-full bg-background canvas-grid flex justify-start lg:justify-center select-none overflow-x-auto overflow-y-hidden ${
        previewMode && activeDevice === "desktop"
          ? "items-stretch p-0"
          : "items-center p-xs sm:p-md lg:p-xl"
      }`}
      onClick={() => {
        if (!previewMode) {
          setSelectedElementId(null);
        }
      }}
    >
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}

      <div
        className={`group/device relative ${
          isDragging ? "transition-none" : "transition-all duration-300 ease-in-out"
        } ${getDeviceFrameStyles()}`}
        style={
          {
            ...(customWidth !== null && activeDevice !== "desktop"
              ? { width: `${customWidth}px`, minWidth: `${customWidth}px` }
              : {}),
            "--brand-ice-blue": themePalette.iceBlue,
            "--brand-sky-blue": themePalette.skyBlue,
            "--brand-cyan-active": themePalette.cyanActive,
            "--brand-deep-teal": themePalette.deepTeal,
            "--brand-dark-slate": themePalette.darkSlate,
          } as React.CSSProperties
        }
      >
        {activeDevice === "mobile" && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-dark-slate rounded-b-xl z-30 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 mr-2" />
            <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
          </div>
        )}

        {activeDevice === "tablet" && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-slate-900 z-30 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-slate-800" />
          </div>
        )}

        {activeDevice === "desktop" && !previewMode && (
          <div className="w-full h-8 bg-dark-slate border-b border-panel-border/30 px-3 flex items-center justify-between shrink-0 select-none z-30">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-slate-900/60 border border-white/10 text-[10px] text-slate-300 font-mono">
              <svg className="w-3 h-3 text-cyan-active shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11h9" />
              </svg>
              <span className="truncate max-w-[180px] sm:max-w-[320px]">https://workspace.aether.studio/desktop-preview</span>
            </div>
            <div className="w-12 flex justify-end">
              <span className="w-2 h-2 rounded-full bg-cyan-active/60 animate-pulse" />
            </div>
          </div>
        )}

        <CanvasDeviceResizer
          activeDevice={activeDevice}
          previewMode={previewMode}
          isDragging={isDragging}
          customWidth={customWidth}
          handlePointerDown={handlePointerDown}
          setCustomWidth={setCustomWidth}
        />

        <div
          className={`w-full flex-1 min-h-0 ${previewMode ? "flex flex-col overflow-hidden" : "overflow-y-auto overflow-x-auto custom-scrollbar"}`}
          style={{
            padding: previewMode ? 0 : (PAGE_PADDING_MAP[pageSettings.padding ?? ""] ?? "2rem 1.5rem"),
            minHeight: activeDevice === "desktop" ? "100%" : undefined,
            backgroundColor: mapColor(
              pageSettings.backgroundColor || "#ffffff",
              themePalette
            ),
            color: mapColor(pageSettings.textColor || "#01303f", themePalette),
            fontFamily: pageSettings.fontFamily
              ? `'${pageSettings.fontFamily}', sans-serif`
              : undefined,
          }}
        >
          <div className={`w-full h-full ${previewMode ? "flex-1 flex flex-col" : "flex flex-col"}`}>
            {previewMode ? (
              <iframe
                ref={iframeRef}
                srcDoc={compiledHtml}
                className="w-full border-none bg-transparent flex-1"
                style={{
                  height: activeDevice === "desktop"
                    ? (iframeHeight ? `${iframeHeight}px` : "100%")
                    : "100%",
                  minHeight: "100%",
                }}
                title="Portfolio Preview"
                onLoad={handleIframeLoad}
              />
            ) : (
              <div
                className="portfolio-wrapper w-full"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxWidth: PAGE_WIDTH_MAP[pageSettings.widthMode ?? ""] ?? "768px",
                  gap: SPACE_MAP[pageSettings.gap ?? ""] ?? "1.5rem",
                }}
              >
                {canvasElements
                  .filter((el) => !el.parentId || !canvasElements.some((p) => p.id === el.parentId))
                  .map((el) => (
                    <CanvasElementRenderer
                      key={el.id}
                      element={el}
                      canvasElements={canvasElements}
                      activeDevice={activeDevice}
                      selectedElementId={selectedElementId}
                      previewMode={previewMode}
                      onSelectElement={onSelectElement}
                      onDeleteElement={onDeleteElement}
                      onDuplicateElement={onDuplicateElement}
                      onMoveElement={onMoveElement}
                      onReorderElements={onReorderElements}
                      setSelectedElementId={setSelectedElementId}
                      themePalette={themePalette}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
