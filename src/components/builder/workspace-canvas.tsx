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
      return "w-[375px] h-[640px] rounded-[40px] border-[12px] border-dark-slate shadow-2xl relative bg-panel overflow-hidden";
    }
    if (activeDevice === "tablet") {
      return "w-[768px] h-[900px] rounded-[24px] border-[10px] border-dark-slate shadow-xl relative bg-panel overflow-hidden";
    }
    return "w-full min-h-full bg-panel shadow-sm";
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
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}

      <div
        className={`group/device relative ${
          isDragging ? "transition-none" : "transition-all duration-300 ease-in-out"
        } ${getDeviceFrameStyles()}`}
        style={
          {
            ...(customWidth !== null && activeDevice !== "desktop"
              ? { width: `${customWidth}px` }
              : {}),
            "--brand-ice-blue": themePalette.iceBlue,
            "--brand-sky-blue": themePalette.skyBlue,
            "--brand-cyan-active": themePalette.cyanActive,
            "--brand-deep-teal": themePalette.deepTeal,
            "--brand-dark-slate": themePalette.darkSlate,
            backgroundColor: mapColor(
              pageSettings.backgroundColor || "#01303f",
              themePalette
            ),
            color: mapColor(pageSettings.textColor || "#ffffff", themePalette),
            fontFamily: pageSettings.fontFamily
              ? `'${pageSettings.fontFamily}', sans-serif`
              : undefined,
          } as React.CSSProperties
        }
      >
        {activeDevice === "mobile" && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-dark-slate rounded-b-xl z-30 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 mr-2" />
            <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
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
          className="w-full h-full overflow-y-auto"
          style={{
            padding: PAGE_PADDING_MAP[pageSettings.padding ?? ""] ?? "2rem 1.5rem",
            minHeight: activeDevice === "desktop" ? "100%" : undefined,
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
