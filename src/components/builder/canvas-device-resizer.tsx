"use client";

import React from "react";

interface CanvasDeviceResizerProps {
  activeDevice: "desktop" | "tablet" | "mobile";
  previewMode: boolean;
  isDragging: boolean;
  customWidth: number | null;
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  setCustomWidth: (width: number | null) => void;
}

export default function CanvasDeviceResizer({
  activeDevice,
  previewMode,
  isDragging,
  customWidth,
  handlePointerDown,
  setCustomWidth,
}: CanvasDeviceResizerProps) {
  if (previewMode || activeDevice === "desktop") {
    return null;
  }

  const currentPxWidth =
    customWidth !== null
      ? customWidth
      : activeDevice === "mobile"
      ? 375
      : 768;

  return (
    <>
      {/* Left Resizer Handle */}
      <div
        onPointerDown={handlePointerDown}
        onDoubleClick={() => setCustomWidth(null)}
        className="absolute top-0 bottom-0 -left-[6px] w-[12px] cursor-ew-resize group/resizer z-40 flex items-center justify-center"
        title="Drag to resize, double-click to reset"
      >
        <div className="w-[4px] h-12 rounded-full bg-cyan-active/40 group-hover/resizer:bg-cyan-active group-hover/resizer:h-20 transition-all duration-200" />
      </div>

      {/* Right Resizer Handle */}
      <div
        onPointerDown={handlePointerDown}
        onDoubleClick={() => setCustomWidth(null)}
        className="absolute top-0 bottom-0 -right-[6px] w-[12px] cursor-ew-resize group/resizer z-40 flex items-center justify-center"
        title="Drag to resize, double-click to reset"
      >
        <div className="w-[4px] h-12 rounded-full bg-cyan-active/40 group-hover/resizer:bg-cyan-active group-hover/resizer:h-20 transition-all duration-200" />
      </div>

      {/* Dynamic Width Indicator Tooltip */}
      <div
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-sm py-[3px] rounded bg-dark-slate border border-panel-border text-white text-[10px] font-mono font-bold z-40 transition-opacity duration-200 ${
          isDragging
            ? "opacity-100"
            : "opacity-0 pointer-events-none group-hover/device:opacity-100"
        }`}
      >
        {currentPxWidth}px
      </div>
    </>
  );
}
