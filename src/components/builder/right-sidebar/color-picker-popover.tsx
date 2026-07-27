"use client";

import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { PageSettings } from "@/types/builder";
import { HSVA, formatColor, STANDARD_SWATCHES } from "./color-utils";

interface ColorPickerPopoverProps {
  isOpen: boolean;
  popoverPos: { top: number; left: number };
  localHsva: HSVA;
  format: "hex" | "rgb" | "hsl";
  onFormatChange: (format: "hex" | "rgb" | "hsl") => void;
  updateHsva: (newHsva: Partial<HSVA>, isImmediate?: boolean) => void;
  selectColor: (color: string) => void;
  startDrag: (
    container: HTMLDivElement | null,
    callback: (x: number, y: number) => void,
    isTouch?: boolean
  ) => void;
  handleDrag: (
    e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent,
    container: HTMLDivElement,
    callback: (x: number, y: number) => void
  ) => void;
  themePalette?: PageSettings["themePalette"];
  showThemePresets?: boolean;
  value: string;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function ColorPickerPopover({
  isOpen,
  popoverPos,
  localHsva,
  format,
  onFormatChange,
  updateHsva,
  selectColor,
  startDrag,
  handleDrag,
  themePalette,
  showThemePresets = true,
  value,
  onClose,
  triggerRef,
}: ColorPickerPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const sbContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const hueBgColor = `hsl(${localHsva.h}, 100%, 50%)`;

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: "absolute",
        top: `${popoverPos.top}px`,
        left: `${popoverPos.left}px`,
      }}
      className="z-50 w-60 bg-panel border border-panel-border rounded-xl shadow-2xl p-sm flex flex-col gap-sm animate-scaleIn select-none"
    >
      {/* 1. Saturation/Value Area */}
      <div
        ref={sbContainerRef}
        onMouseDown={(e) => {
          const sbBox = sbContainerRef.current;
          if (!sbBox) return;
          const update = (x: number, y: number) => {
            updateHsva({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) });
          };
          handleDrag(e, sbBox, update);
          startDrag(sbBox, update);
        }}
        onTouchStart={(e) => {
          const sbBox = sbContainerRef.current;
          if (!sbBox) return;
          const update = (x: number, y: number) => {
            updateHsva({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) });
          };
          handleDrag(e, sbBox, update);
          startDrag(sbBox, update, true);
        }}
        style={{
          backgroundColor: hueBgColor,
          backgroundImage:
            "linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, transparent)",
        }}
        className="w-full h-28 rounded-lg relative overflow-hidden cursor-crosshair shadow-inner"
      >
        <div
          style={{
            left: `${localHsva.s}%`,
            top: `${100 - localHsva.v}%`,
          }}
          className="absolute w-3 h-3 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg cursor-pointer"
        />
      </div>

      {/* 2. Slide Controls Grid (Hue & Alpha) */}
      <div className="flex items-center gap-sm">
        <div
          className="w-8 h-8 rounded-full border border-panel-border overflow-hidden relative shadow-inner shrink-0 bg-repeat bg-[size:6px_6px]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)",
            backgroundPosition: "0 0, 3px 3px",
            opacity: 0.8,
          }}
        >
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundColor: formatColor(localHsva, "rgb"),
            }}
          />
        </div>

        <div className="flex-1 flex flex-col gap-xs">
          {/* Hue slider */}
          <div
            onMouseDown={(e) => {
              const slider = e.currentTarget;
              const update = (x: number) => updateHsva({ h: Math.round(x * 360) });
              handleDrag(e, slider, update);
              startDrag(slider, update);
            }}
            onTouchStart={(e) => {
              const slider = e.currentTarget;
              const update = (x: number) => updateHsva({ h: Math.round(x * 360) });
              handleDrag(e, slider, update);
              startDrag(slider, update, true);
            }}
            className="h-2.5 rounded-full relative cursor-pointer shadow-inner"
            style={{
              background:
                "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
            }}
          >
            <div
              style={{ left: `${(localHsva.h / 360) * 100}%` }}
              className="absolute w-3.5 h-3.5 bg-white border border-panel-border rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 shadow cursor-pointer"
            />
          </div>

          {/* Alpha slider */}
          <div
            onMouseDown={(e) => {
              const slider = e.currentTarget;
              const update = (x: number) => updateHsva({ a: Math.round(x * 100) / 100 });
              handleDrag(e, slider, update);
              startDrag(slider, update);
            }}
            onTouchStart={(e) => {
              const slider = e.currentTarget;
              const update = (x: number) => updateHsva({ a: Math.round(x * 100) / 100 });
              handleDrag(e, slider, update);
              startDrag(slider, update, true);
            }}
            className="h-2.5 rounded-full relative cursor-pointer shadow-inner bg-repeat bg-[size:6px_6px]"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)",
              backgroundPosition: "0 0, 3px 3px",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(to right, transparent, ${hueBgColor})`,
              }}
            />
            <div
              style={{ left: `${localHsva.a * 100}%` }}
              className="absolute w-3.5 h-3.5 bg-white border border-panel-border rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 shadow cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Text inputs & Format toggle */}
      <div className="flex gap-xs items-center bg-background/50 border border-panel-border/30 rounded-lg p-xs">
        <input
          type="text"
          value={formatColor(localHsva, format)}
          readOnly
          className="w-0 flex-1 text-[10px] text-foreground font-mono bg-transparent border-none text-left p-[2px] focus:outline-none select-all"
        />
        <button
          type="button"
          onClick={() => {
            const nextFormat = format === "hex" ? "rgb" : format === "rgb" ? "hsl" : "hex";
            onFormatChange(nextFormat);
          }}
          className="shrink-0 text-[9px] uppercase tracking-wider font-bold bg-accent-soft text-cyan-active hover:bg-cyan-active/20 px-sm py-[3px] rounded-md transition-colors cursor-pointer"
        >
          {format}
        </button>
      </div>

      {/* 4. Brand Theme Palette presets */}
      {showThemePresets && themePalette && (
        <div className="flex flex-col gap-xs border-t border-panel-border/20 pt-xs">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
            Theme Colors
          </span>
          <div className="grid grid-cols-5 gap-xs">
            {[
              { key: "darkSlate", label: "Dark Background", hex: themePalette.darkSlate },
              { key: "deepTeal", label: "Muted Text", hex: themePalette.deepTeal },
              { key: "cyanActive", label: "Primary Accent", hex: themePalette.cyanActive },
              { key: "skyBlue", label: "Highlight Color", hex: themePalette.skyBlue },
              { key: "iceBlue", label: "Soft Accent", hex: themePalette.iceBlue },
            ].map((color) => {
              const isSelected = value.toLowerCase().trim() === color.hex?.toLowerCase().trim();
              return (
                <button
                  key={color.key}
                  type="button"
                  onClick={() => selectColor(color.hex)}
                  style={{ backgroundColor: color.hex }}
                  className={`h-6 rounded-md border cursor-pointer hover:scale-105 transition-all duration-150 relative ${
                    isSelected
                      ? "border-cyan-active ring-1 ring-cyan-active/40 scale-105"
                      : "border-panel-border/60"
                  }`}
                  title={`${color.label}: ${color.hex}`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                      <span className="mx-auto block w-1.5 h-1.5 rounded-full bg-white shadow" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Standard Presets Grid */}
      <div className="flex flex-col gap-xs border-t border-panel-border/20 pt-xs">
        <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
          Presets
        </span>
        <div className="grid grid-cols-6 gap-xs">
          {STANDARD_SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => selectColor(swatch)}
              className="h-5 rounded-md border border-panel-border/60 relative overflow-hidden cursor-pointer hover:scale-110 transition-transform bg-repeat bg-[size:4px_4px]"
              style={{
                backgroundImage:
                  swatch === "transparent"
                    ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)"
                    : undefined,
                backgroundPosition: "0 0, 2px 2px",
              }}
              title={swatch}
            >
              <div
                className="absolute inset-0 w-full h-full"
                style={{ backgroundColor: swatch }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
