"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { PageSettings } from "@/types/builder";

// --- Color Conversion Helpers ---

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface HSVA {
  h: number;
  s: number;
  v: number;
  a: number;
}

interface HSLA {
  h: number;
  s: number;
  l: number;
  a: number;
}

// Convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r = 0, g = 0, b = 0;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): HSLA {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: 1,
  };
}

// Convert RGB to HSV
function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

// Convert HSV to RGB
function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  // Normalize hue to [0, 360) range
  h = (h % 360 + 360) % 360;
  s /= 100;
  v /= 100;
  let r = 0, g = 0, b = 0;
  const i = Math.floor((h / 60) % 6);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Validate if string is a valid color format we support
function isValidColor(color: string): boolean {
  const str = color.trim().toLowerCase();
  if (str === "transparent") return true;
  if (/^#([a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/.test(str)) return true;
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/.test(str)) return true;
  if (/^hsla?\(\s*\d+\s*,\s*[\d.]+\s*%\s*,\s*[\d.]+\s*%\s*(?:,\s*[\d.]+\s*)?\)$/.test(str)) return true;
  return false;
}

// Parse string color (Hex, RGB, RGBA, HSL, HSLA, transparent) to RGBA object
function parseColor(color: string | undefined | null): RGBA {
  if (typeof color !== "string") {
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  const str = color.trim().toLowerCase();
  if (!str || str === "transparent") {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  // Hex (strictly 3, 4, 6, 8 chars)
  const hexMatch = str.match(/^#?([a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    } else if (hex.length === 4) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    let a = 1;
    if (hex.length === 8) {
      a = parseInt(hex.substring(6, 8), 16) / 255;
    }
    return { r, g, b, a };
  }

  // RGB/RGBA with space tolerance
  const rgbaMatch = str.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (rgbaMatch) {
    return {
      r: Math.min(255, Math.max(0, parseInt(rgbaMatch[1], 10))),
      g: Math.min(255, Math.max(0, parseInt(rgbaMatch[2], 10))),
      b: Math.min(255, Math.max(0, parseInt(rgbaMatch[3], 10))),
      a: rgbaMatch[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(rgbaMatch[4]))) : 1,
    };
  }

  // HSL/HSLA with space tolerance
  const hslaMatch = str.match(/^hsla?\(\s*(\d+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (hslaMatch) {
    const h = (parseInt(hslaMatch[1], 10) % 360 + 360) % 360;
    const s = Math.min(100, Math.max(0, parseFloat(hslaMatch[2])));
    const l = Math.min(100, Math.max(0, parseFloat(hslaMatch[3])));
    const a = hslaMatch[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(hslaMatch[4]))) : 1;
    const { r, g, b } = hslToRgb(h, s, l);
    return { r, g, b, a };
  }

  // Default fallback
  return { r: 255, g: 255, b: 255, a: 1 };
}

function rgbaToHsva({ r, g, b, a }: RGBA): HSVA {
  const { h, s, v } = rgbToHsv(r, g, b);
  return { h, s, v, a };
}

function hsvaToRgba({ h, s, v, a }: HSVA): RGBA {
  const { r, g, b } = hsvToRgb(h, s, v);
  return { r, g, b, a };
}

function rgbaToHex({ r, g, b, a }: RGBA): string {
  const toHex = (x: number) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  let hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a < 1) {
    hex += toHex(a * 255);
  }
  return hex;
}

function hsvaToRgbString({ h, s, v, a }: HSVA): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  if (a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function hsvaToHslString({ h, s, v, a }: HSVA): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  const hsl = rgbToHsl(r, g, b);
  if (a < 1) {
    return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a.toFixed(2)})`;
  }
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

// Convert current color selection to designated format string
function formatColor(hsva: HSVA, format: "hex" | "rgb" | "hsl"): string {
  if (hsva.a === 0) return "transparent";
  const rgba = hsvaToRgba(hsva);
  if (format === "hex") return rgbaToHex(rgba);
  if (format === "rgb") return hsvaToRgbString(hsva);
  return hsvaToHslString(hsva);
}

// Standard Color Swatches preset
const STANDARD_SWATCHES = [
  "#ffffff",
  "#000000",
  "transparent",
  "#64748b",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

// --- ColorPicker Component Props ---

interface ColorPickerProps {
  value?: string;
  onChange: (value: string) => void;
  themePalette?: PageSettings["themePalette"];
  showThemePresets?: boolean;
}

// --- Reusable ColorPicker Component ---

export default function ColorPicker({
  value = "",
  onChange,
  themePalette,
  showThemePresets = true,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<"hex" | "rgb" | "hsl">("hex");
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("aether-recent-colors");
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });
  // Parse color to internal HSVA representation after resolving CSS variables
  const resolvedValue = (value && typeof value === "string" && value.startsWith("var"))
    ? themePalette?.[value.replace("var(--brand-", "").replace(")", "") as keyof typeof themePalette] || value
    : value;
  const rgba = parseColor(resolvedValue);
  const hsva = rgbaToHsva(rgba);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const sbContainerRef = useRef<HTMLDivElement>(null);

  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  // Update recent colors list
  const addRecentColor = useCallback((color: string) => {
    if (!color || color === "transparent" || color.startsWith("var") || !isValidColor(color)) return;
    const normalized = color.toLowerCase().trim();
    setRecentColors((prev) => {
      let updated = [normalized, ...prev.filter((c) => c !== normalized)];
      updated = updated.slice(0, 8); // limit to 8 colors
      try {
        localStorage.setItem("aether-recent-colors", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  }, []);

  // Position popover relative to trigger button
  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 240;
      const spaceLeft = rect.left;
      const spaceRight = window.innerWidth - rect.right;

      let left = rect.left + window.scrollX;
      // Prefer placing on the left side of the sidebar (since sidebar is on the right)
      if (spaceLeft > popoverWidth + 16) {
        left = rect.left - popoverWidth - 8 + window.scrollX;
      } else if (spaceRight > popoverWidth + 16) {
        left = rect.right + 8 + window.scrollX;
      } else {
        // Fallback to center/inline align
        left = Math.max(8, rect.left + (rect.width - popoverWidth) / 2) + window.scrollX;
      }

      // Check height constraints
      const popoverHeight = 360;
      let top = rect.top + window.scrollY;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;

      if (spaceBelow < popoverHeight && rect.top > popoverHeight) {
        top = rect.top - popoverHeight - 8 + window.scrollY;
      } else {
        top = rect.bottom + 8 + window.scrollY;
      }

      setPopoverPos({ top, left });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, { capture: true });
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, { capture: true });
    };
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        addRecentColor(value);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, value, addRecentColor]);

  // Change handlers
  const updateHsva = (newHsva: Partial<HSVA>) => {
    const merged = { ...hsva, ...newHsva };
    const formatted = formatColor(merged, format);
    onChange(formatted);
  };



  // Drag handler utility for coordinates
  const handleDrag = (
    e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent,
    container: HTMLDivElement,
    callback: (x: number, y: number) => void
  ) => {
    const rect = container.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    callback(x, y);
  };

  // Drag listeners
  const startDrag = (
    container: HTMLDivElement | null,
    callback: (x: number, y: number) => void,
    isTouch: boolean = false
  ) => {
    if (!container) return;
    if (isTouch) {
      const moveListener = (e: TouchEvent) => handleDrag(e, container, callback);
      const upListener = () => {
        window.removeEventListener("touchmove", moveListener);
        window.removeEventListener("touchend", upListener);
      };
      window.addEventListener("touchmove", moveListener, { passive: false });
      window.addEventListener("touchend", upListener);
    } else {
      const moveListener = (e: MouseEvent) => handleDrag(e, container, callback);
      const upListener = () => {
        window.removeEventListener("mousemove", moveListener);
        window.removeEventListener("mouseup", upListener);
      };
      window.addEventListener("mousemove", moveListener);
      window.addEventListener("mouseup", upListener);
    }
  };



  // Selected hue base color HSL for Saturation-Value background
  const hueBgColor = `hsl(${hsva.h}, 100%, 50%)`;

  return (
    <>
      {/* Swatch Picker Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-5 h-5 rounded-md overflow-hidden border border-panel-border/80 hover:border-cyan-active/80 cursor-pointer shadow-sm shrink-0 transition-colors focus:outline-none"
        title="Open color palette details"
      >
        {/* Transparency checkerboard fallback */}
        <div
          className="absolute inset-0 bg-repeat bg-[size:4px_4px]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)",
            backgroundPosition: "0 0, 2px 2px",
            opacity: 0.4,
          }}
        />
        {/* True active color layer */}
        <div
          className="absolute inset-0 w-full h-full transition-transform active:scale-95"
          style={{
            backgroundColor: (value && typeof value === "string" && value.startsWith("var"))
              ? themePalette?.[value.replace("var(--brand-", "").replace(")", "") as keyof typeof themePalette] || value
              : (value || "transparent"),
          }}
        />
      </button>

      {/* Portal Popover Dialog */}
      {isOpen &&
        createPortal(
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
              {/* Draggable Circle pointer */}
              <div
                style={{
                  left: `${hsva.s}%`,
                  top: `${100 - hsva.v}%`,
                }}
                className="absolute w-3 h-3 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg cursor-pointer"
              />
            </div>

            {/* 2. Slide Controls Grid (Hue & Alpha) */}
            <div className="flex items-center gap-sm">
              {/* Circular Preview Swatch */}
              <div className="w-8 h-8 rounded-full border border-panel-border overflow-hidden relative shadow-inner shrink-0 bg-repeat bg-[size:6px_6px]"
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
                    backgroundColor: formatColor(hsva, "rgb"),
                  }}
                />
              </div>

              {/* Sliders Container */}
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
                    style={{ left: `${(hsva.h / 360) * 100}%` }}
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
                    style={{ left: `${hsva.a * 100}%` }}
                    className="absolute w-3.5 h-3.5 bg-white border border-panel-border rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 shadow cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 3. Text inputs & Format toggle */}
            <div className="flex gap-xs items-center bg-background/50 border border-panel-border/30 rounded-lg p-xs">
              <input
                type="text"
                value={formatColor(hsva, format)}
                readOnly
                className="flex-1 text-[10px] text-foreground font-mono bg-transparent border-none text-left p-[2px] focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={() => {
                  const nextFormat = format === "hex" ? "rgb" : format === "rgb" ? "hsl" : "hex";
                  setFormat(nextFormat);
                }}
                className="text-[9px] uppercase tracking-wider font-bold bg-accent-soft text-cyan-active hover:bg-cyan-active/20 px-sm py-[3px] rounded-md transition-colors cursor-pointer"
              >
                {format}
              </button>
            </div>

            {/* 4. Brand Theme Palette presets (Only if themePalette is passed) */}
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
                        onClick={() => {
                          onChange(color.hex);
                          addRecentColor(color.hex);
                        }}
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
                {STANDARD_SWATCHES.map((color, idx) => {
                  const isSelected = value.toLowerCase().trim() === color.toLowerCase().trim();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onChange(color);
                        addRecentColor(color);
                      }}
                      className={`h-5 rounded-md border cursor-pointer hover:scale-105 transition-all relative bg-repeat bg-[size:4px_4px] ${
                        isSelected ? "border-cyan-active scale-105 ring-1 ring-cyan-active/30" : "border-panel-border/40"
                      }`}
                      style={{
                        backgroundImage:
                          color === "transparent"
                            ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)"
                            : "none",
                        backgroundPosition: "0 0, 2px 2px",
                      }}
                      title={color}
                    >
                      {color !== "transparent" && (
                        <div
                          className="absolute inset-0 rounded-[5px]"
                          style={{ backgroundColor: color }}
                        />
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center pointer-events-none">
                          <span className="mx-auto block w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Recent Colors grid */}
            {recentColors.length > 0 && (
              <div className="flex flex-col gap-xs border-t border-panel-border/20 pt-xs">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                  Recents
                </span>
                <div className="flex gap-xs flex-wrap">
                  {recentColors.map((color, idx) => {
                    const isSelected = value.toLowerCase().trim() === color.toLowerCase().trim();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onChange(color)}
                        style={{ backgroundColor: color }}
                        className={`w-5 h-5 rounded-full border cursor-pointer hover:scale-105 transition-all duration-150 relative ${
                          isSelected
                            ? "border-cyan-active ring-1 ring-cyan-active/30"
                            : "border-panel-border/40"
                        }`}
                        title={color}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center pointer-events-none">
                            <span className="mx-auto block w-1 h-1 rounded-full bg-white shadow-sm" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
