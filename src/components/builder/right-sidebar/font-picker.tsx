"use client";

import React, { useState, useRef, useEffect } from "react";
import { GOOGLE_FONTS_LIST } from "@/types/builder";

interface FontPickerProps {
  /** Currently selected font family, or empty string for the default. */
  value: string;
  onChange: (fontFamily: string) => void;
  /** Label shown in the trigger button when no font is selected. */
  defaultLabel?: string;
  /** Value passed to onChange when the user picks the default option. */
  defaultValue?: string;
}

/**
 * Reusable Google Fonts search-and-select dropdown.
 *
 * Encapsulates:
 * - Searchable font list
 * - Smart directional positioning (opens upward when near the bottom of the
 *   viewport)
 * - Click-outside backdrop to close
 *
 * Used by both `StyleInspectorTab` and `PageSettingsTab`.
 */
export default function FontPicker({
  value,
  onChange,
  defaultLabel = "Default System Font",
  defaultValue = "",
}: FontPickerProps) {
  const [fontSearch, setFontSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Font dropdown max-h is max-h-56 (224px); threshold at 240px
      setOpenUpward(spaceBelow < 240 && spaceAbove > spaceBelow);
    }
  }, [isOpen]);

  const filteredFonts = GOOGLE_FONTS_LIST.filter((font) =>
    font.toLowerCase().includes(fontSearch.toLowerCase())
  );

  const handleSelect = (fontName: string) => {
    onChange(fontName);
    setIsOpen(false);
    setFontSearch("");
  };

  return (
    <div ref={containerRef} className="col-span-2 flex flex-col gap-xs relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs bg-background border border-panel-border rounded-lg px-sm py-[8px] text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 cursor-pointer transition-all duration-200"
      >
        <span
          style={{ fontFamily: value || "inherit" }}
          className="truncate font-semibold text-foreground"
        >
          {value || defaultLabel}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 shrink-0 ml-xs ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Click-outside Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 cursor-default"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        />
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute ${openUpward ? "bottom-[38px]" : "top-[38px]"} left-0 right-0 bg-panel border border-panel-border rounded-xl shadow-xl z-50 flex flex-col overflow-hidden animate-fadeIn max-h-56`}
        >
          {/* Search */}
          <div className="p-xs bg-background/30 border-b border-panel-border shrink-0">
            <input
              type="text"
              placeholder="Search Google Fonts..."
              value={fontSearch}
              onChange={(e) => setFontSearch(e.target.value)}
              className="w-full h-8 px-sm rounded-md border border-panel-border bg-background text-[11px] text-foreground focus:outline-none"
            />
          </div>

          {/* Font List */}
          <div className="overflow-y-auto custom-scrollbar p-xs flex flex-col gap-[2px] bg-panel">
            {/* Default option */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(defaultValue);
              }}
              className="w-full text-left px-sm py-[6px] rounded-lg text-xs transition-colors cursor-pointer text-foreground hover:bg-accent-soft"
            >
              {defaultLabel}
            </button>

            {filteredFonts.map((fontName) => {
              const isActive = value === fontName;
              return (
                <button
                  key={fontName}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(fontName);
                  }}
                  style={{ fontFamily: fontName }}
                  className={`w-full text-left px-sm py-[6px] rounded-lg text-xs transition-colors cursor-pointer ${
                    isActive
                      ? "text-cyan-active bg-cyan-active/10 font-bold"
                      : "text-foreground hover:bg-accent-soft hover:text-cyan-active"
                  }`}
                >
                  {fontName}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
