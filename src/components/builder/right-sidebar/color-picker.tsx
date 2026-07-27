"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PageSettings } from "@/types/builder";
import {
  HSVA,
  parseColor,
  rgbaToHsva,
  formatColor,
  isValidColor,
} from "./color-utils";
import ColorPickerPopover from "./color-picker-popover";

interface ColorPickerProps {
  value?: string;
  onChange: (value: string) => void;
  themePalette?: PageSettings["themePalette"];
  showThemePresets?: boolean;
}

export default function ColorPicker({
  value = "",
  onChange,
  themePalette,
  showThemePresets = true,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<"hex" | "rgb" | "hsl">("hex");
  const [, setRecentColors] = useState<string[]>(() => {
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

  const getHsvaFromValue = useCallback(
    (val: string) => {
      const resolved =
        val && typeof val === "string" && val.startsWith("var")
          ? themePalette?.[
              val.replace("var(--brand-", "").replace(")", "") as keyof typeof themePalette
            ] || val
          : val;
      return rgbaToHsva(parseColor(resolved));
    },
    [themePalette]
  );

  const [localHsva, setLocalHsva] = useState<HSVA>(() => getHsvaFromValue(value));

  const localHsvaRef = useRef<HSVA>(localHsva);
  useEffect(() => {
    localHsvaRef.current = localHsva;
  }, [localHsva]);

  const isDraggingRef = useRef(false);
  const latestFormattedColorRef = useRef<string>("");
  const pendingValueRef = useRef<string | null>(null);
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isDraggingRef.current) {
      const nextHsva = getHsvaFromValue(value);
      setLocalHsva(nextHsva);
      latestFormattedColorRef.current = formatColor(nextHsva, format);
    }
  }, [value, themePalette, format, getHsvaFromValue]);

  useEffect(() => {
    return () => {
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, []);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const addRecentColor = useCallback((color: string) => {
    if (!color || color === "transparent" || color.startsWith("var") || !isValidColor(color)) return;
    const normalized = color.toLowerCase().trim();
    setRecentColors((prev) => {
      let updated = [normalized, ...prev.filter((c) => c !== normalized)];
      updated = updated.slice(0, 8);
      try {
        localStorage.setItem("aether-recent-colors", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  }, []);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 240;
      const spaceLeft = rect.left;
      const spaceRight = window.innerWidth - rect.right;

      let left = rect.left + window.scrollX;
      if (spaceLeft > popoverWidth + 16) {
        left = rect.left - popoverWidth - 8 + window.scrollX;
      } else if (spaceRight > popoverWidth + 16) {
        left = rect.right + 8 + window.scrollX;
      } else {
        left = Math.max(8, rect.left + (rect.width - popoverWidth) / 2) + window.scrollX;
      }

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

  const throttledOnChange = useCallback(
    (formattedColor: string) => {
      const limit = 60;
      const now = Date.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= limit) {
        onChange(formattedColor);
        lastTimeRef.current = now;
        if (throttleTimerRef.current) {
          clearTimeout(throttleTimerRef.current);
          throttleTimerRef.current = null;
        }
        pendingValueRef.current = null;
      } else {
        pendingValueRef.current = formattedColor;
        if (!throttleTimerRef.current) {
          throttleTimerRef.current = setTimeout(() => {
            if (pendingValueRef.current !== null) {
              onChange(pendingValueRef.current);
              lastTimeRef.current = Date.now();
              pendingValueRef.current = null;
            }
            throttleTimerRef.current = null;
          }, limit - elapsed);
        }
      }
    },
    [onChange]
  );

  const flushOnChange = useCallback(
    (finalColor: string) => {
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
        throttleTimerRef.current = null;
      }
      onChange(finalColor);
      lastTimeRef.current = Date.now();
      pendingValueRef.current = null;
    },
    [onChange]
  );

  const updateHsva = useCallback(
    (newHsva: Partial<HSVA>, isImmediate = false) => {
      const merged = { ...localHsvaRef.current, ...newHsva };
      setLocalHsva(merged);
      const formatted = formatColor(merged, format);
      latestFormattedColorRef.current = formatted;
      if (isImmediate) {
        flushOnChange(formatted);
      } else {
        throttledOnChange(formatted);
      }
    },
    [format, throttledOnChange, flushOnChange]
  );

  const selectColor = useCallback(
    (color: string) => {
      const nextHsva = getHsvaFromValue(color);
      setLocalHsva(nextHsva);
      const formatted = formatColor(nextHsva, format);
      latestFormattedColorRef.current = formatted;
      flushOnChange(formatted);
      addRecentColor(color);
    },
    [getHsvaFromValue, format, flushOnChange, addRecentColor]
  );

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    if (pendingValueRef.current !== null) {
      flushOnChange(pendingValueRef.current);
    }
    if (latestFormattedColorRef.current) {
      addRecentColor(latestFormattedColorRef.current);
    }
  }, [flushOnChange, addRecentColor]);

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

  const startDrag = (
    container: HTMLDivElement | null,
    callback: (x: number, y: number) => void,
    isTouch: boolean = false
  ) => {
    if (!container) return;
    isDraggingRef.current = true;
    if (isTouch) {
      const moveListener = (e: TouchEvent) => handleDrag(e, container, callback);
      const upListener = () => {
        window.removeEventListener("touchmove", moveListener);
        window.removeEventListener("touchend", upListener);
        handleDragEnd();
      };
      window.addEventListener("touchmove", moveListener, { passive: false });
      window.addEventListener("touchend", upListener);
    } else {
      const moveListener = (e: MouseEvent) => handleDrag(e, container, callback);
      const upListener = () => {
        window.removeEventListener("mousemove", moveListener);
        window.removeEventListener("mouseup", upListener);
        handleDragEnd();
      };
      window.addEventListener("mousemove", moveListener);
      window.addEventListener("mouseup", upListener);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-5 h-5 rounded-md overflow-hidden border border-panel-border/80 hover:border-cyan-active/80 cursor-pointer shadow-sm shrink-0 transition-colors focus:outline-none"
        title="Open color palette details"
      >
        <div
          className="absolute inset-0 bg-repeat bg-[size:4px_4px]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)",
            backgroundPosition: "0 0, 2px 2px",
            opacity: 0.4,
          }}
        />
        <div
          className="absolute inset-0 w-full h-full transition-transform active:scale-95"
          style={{
            backgroundColor:
              value && typeof value === "string" && value.startsWith("var")
                ? themePalette?.[
                    value.replace("var(--brand-", "").replace(")", "") as keyof typeof themePalette
                  ] || value
                : value || "transparent",
          }}
        />
      </button>

      <ColorPickerPopover
        isOpen={isOpen}
        popoverPos={popoverPos}
        localHsva={localHsva}
        format={format}
        onFormatChange={setFormat}
        updateHsva={updateHsva}
        selectColor={selectColor}
        startDrag={startDrag}
        handleDrag={handleDrag}
        themePalette={themePalette}
        showThemePresets={showThemePresets}
        value={value}
        onClose={() => {
          setIsOpen(false);
          if (latestFormattedColorRef.current) {
            addRecentColor(latestFormattedColorRef.current);
          }
        }}
        triggerRef={triggerRef}
      />
    </>
  );
}
