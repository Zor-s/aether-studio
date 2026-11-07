"use client";

import React, { useState, useEffect } from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import SpacingSection from "./sections/spacing-section";
import LayoutSection from "./sections/layout-section";
import TypographySection from "./sections/typography-section";
import AppearanceSection from "./sections/appearance-section";
import ContentInspectorTab from "./content-inspector-tab";

interface StyleInspectorTabProps {
  activeDevice: "desktop" | "tablet" | "mobile";
  selectedElement: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  pageSettings: PageSettings;
  onShowToast?: (message: string, type: "success" | "warning" | "info") => void;
  canvasElements?: CanvasElement[];
}

export type InspectorTabId = "content" | "spacing" | "layout" | "typography" | "appearance";

export default function StyleInspectorTab({
  activeDevice,
  selectedElement,
  onUpdateElement,
  pageSettings,
  onShowToast,
  canvasElements = [],
}: StyleInspectorTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<InspectorTabId>("content");

  const themePalette = pageSettings.themePalette || {
    iceBlue: "#d4f0fc",
    skyBlue: "#89d6fb",
    cyanActive: "#02a9f7",
    deepTeal: "#02577a",
    darkSlate: "#01303f",
  };

  const hasLayout = ["section", "container", "grid-2"].includes(selectedElement.type);
  const hasTypography = ["headline", "subheading", "paragraph", "button", "blockquote", "list"].includes(selectedElement.type);

  // Auto-switch to available tab if element doesn't support the active tab
  useEffect(() => {
    if (activeSubTab === "layout" && !hasLayout) {
      setActiveSubTab("content");
    } else if (activeSubTab === "typography" && !hasTypography) {
      setActiveSubTab("content");
    }
  }, [selectedElement.id, selectedElement.type, hasLayout, hasTypography, activeSubTab]);

  const getStyleValue = (
    key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">
  ): string => {
    const s = selectedElement.styles || {};
    if (activeDevice === "mobile" && s.mobile?.[key] !== undefined) {
      return String(s.mobile[key]);
    }
    if (activeDevice === "tablet" && s.tablet?.[key] !== undefined) {
      return String(s.tablet[key]);
    }
    return s[key] !== undefined ? String(s[key]) : "";
  };

  const isOverridden = (
    key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">
  ) => {
    const s = selectedElement.styles || {};
    if (activeDevice === "mobile") {
      return s.mobile?.[key] !== undefined;
    }
    if (activeDevice === "tablet") {
      return s.tablet?.[key] !== undefined;
    }
    return false;
  };

  const handleClearOverride = (
    key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">
  ) => {
    const updatedStyles = { ...(selectedElement.styles || {}) };

    if (activeDevice === "mobile" && updatedStyles.mobile) {
      const newMobile = { ...updatedStyles.mobile };
      delete newMobile[key as keyof typeof newMobile];

      if (Object.keys(newMobile).length === 0) {
        delete updatedStyles.mobile;
      } else {
        updatedStyles.mobile = newMobile;
      }
    } else if (activeDevice === "tablet" && updatedStyles.tablet) {
      const newTablet = { ...updatedStyles.tablet };
      delete newTablet[key as keyof typeof newTablet];

      if (Object.keys(newTablet).length === 0) {
        delete updatedStyles.tablet;
      } else {
        updatedStyles.tablet = newTablet;
      }
    }

    onUpdateElement(selectedElement.id, {
      styles: updatedStyles,
    });
    if (onShowToast) {
      onShowToast(`Reset ${activeDevice} override for style property: ${key}`, "info");
    }
  };

  const handleStyleChange = (
    key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">,
    value: string
  ) => {
    let updatedStyles = { ...(selectedElement.styles || {}) };

    if (activeDevice === "mobile") {
      updatedStyles.mobile = {
        ...(updatedStyles.mobile || {}),
        [key]: value,
      };
    } else if (activeDevice === "tablet") {
      updatedStyles.tablet = {
        ...(updatedStyles.tablet || {}),
        [key]: value,
      };
    } else {
      updatedStyles = {
        ...updatedStyles,
        [key]: value,
      };
    }

    onUpdateElement(selectedElement.id, {
      styles: updatedStyles,
    });
  };

  const renderLabel = (
    key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">,
    label: string
  ) => {
    const overridden = isOverridden(key);
    return (
      <div className="flex items-center justify-between mb-[4px] w-full">
        <label
          className={`text-[10px] font-semibold transition-colors duration-200 ${
            overridden ? "text-cyan-active font-bold" : "text-text-muted"
          }`}
        >
          {label}
        </label>
        {overridden && (
          <button
            type="button"
            onClick={() => handleClearOverride(key)}
            className="text-[9px] text-cyan-active hover:text-red-500 cursor-pointer flex items-center gap-[2px] transition-colors focus:outline-none"
            title={`Clear ${activeDevice} override (reset to desktop)`}
          >
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Reset
          </button>
        )}
      </div>
    );
  };

  const tabsConfig = [
    {
      id: "content" as const,
      label: "Content",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      show: true,
    },
    {
      id: "spacing" as const,
      label: "Spacing",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      ),
      show: true,
    },
    {
      id: "layout" as const,
      label: "Layout",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      show: hasLayout,
    },
    {
      id: "typography" as const,
      label: "Type",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10M12 3v18M9 7L12 3l3 4"
          />
        </svg>
      ),
      show: hasTypography,
    },
    {
      id: "appearance" as const,
      label: "Style",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      show: true,
    },
  ].filter((t) => t.show);

  return (
    <div className="flex flex-col gap-md">
      {activeDevice !== "desktop" && (
        <div className="p-xs px-sm rounded-lg bg-cyan-active/10 border border-cyan-active/20 text-[10px] text-cyan-active font-semibold flex items-center gap-xs mb-xs animate-fadeIn">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Editing {activeDevice} overrides. Styles apply strictly to {activeDevice}.
        </div>
      )}

      {/* Merged Single-Row Icon Tab Navigation Bar */}
      <div className="flex border-b border-panel-border/40 bg-background/30 p-xs gap-[4px] rounded-lg border border-panel-border/40">
        {tabsConfig.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-xs px-[4px] rounded-md text-[10px] font-semibold transition-all duration-200 cursor-pointer ${
              activeSubTab === tab.id
                ? "bg-cyan-active text-white font-bold shadow-sm"
                : "text-text-muted hover:text-foreground hover:bg-background/40"
            }`}
          >
            <div className="mb-[2px]">{tab.icon}</div>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Options Panel Container */}
      <div className="animate-slideDown">
        {activeSubTab === "content" && (
          <ContentInspectorTab
            selectedElement={selectedElement}
            onUpdateElement={onUpdateElement}
            canvasElements={canvasElements}
          />
        )}

        {activeSubTab === "spacing" && (
          <SpacingSection
            getStyleValue={getStyleValue}
            handleStyleChange={handleStyleChange}
            renderLabel={renderLabel}
          />
        )}

        {activeSubTab === "layout" && hasLayout && (
          <LayoutSection
            selectedElement={selectedElement}
            getStyleValue={getStyleValue}
            handleStyleChange={handleStyleChange}
            renderLabel={renderLabel}
          />
        )}

        {activeSubTab === "typography" && hasTypography && (
          <TypographySection
            selectedElement={selectedElement}
            getStyleValue={getStyleValue}
            handleStyleChange={handleStyleChange}
            renderLabel={renderLabel}
          />
        )}

        {activeSubTab === "appearance" && (
          <AppearanceSection
            selectedElement={selectedElement}
            getStyleValue={getStyleValue}
            handleStyleChange={handleStyleChange}
            renderLabel={renderLabel}
            themePalette={themePalette}
          />
        )}
      </div>
    </div>
  );
}
