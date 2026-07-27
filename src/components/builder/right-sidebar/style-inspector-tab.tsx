"use client";

import React from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import SpacingSection from "./sections/spacing-section";
import LayoutSection from "./sections/layout-section";
import TypographySection from "./sections/typography-section";
import AppearanceSection from "./sections/appearance-section";

interface StyleInspectorTabProps {
  activeDevice: "desktop" | "tablet" | "mobile";
  selectedElement: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  pageSettings: PageSettings;
  onShowToast?: (message: string, type: "success" | "warning" | "info") => void;
}

export default function StyleInspectorTab({
  activeDevice,
  selectedElement,
  onUpdateElement,
  pageSettings,
  onShowToast,
}: StyleInspectorTabProps) {
  const themePalette = pageSettings.themePalette || {
    iceBlue: "#d4f0fc",
    skyBlue: "#89d6fb",
    cyanActive: "#02a9f7",
    deepTeal: "#02577a",
    darkSlate: "#01303f",
  };

  const getStyleValue = (
    key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">
  ) => {
    const s = selectedElement.styles || {};
    if (activeDevice === "mobile") {
      return s.mobile?.[key] !== undefined ? s.mobile[key] : s[key] || "";
    }
    if (activeDevice === "tablet") {
      return s.tablet?.[key] !== undefined ? s.tablet[key] : s[key] || "";
    }
    return s[key] || "";
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

  return (
    <div className="flex flex-col gap-lg">
      {activeDevice !== "desktop" && (
        <div className="p-xs px-sm rounded-lg bg-cyan-active/10 border border-cyan-active/20 text-[10px] text-cyan-active font-semibold flex items-center gap-xs mb-sm animate-fadeIn">
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

      <SpacingSection
        getStyleValue={getStyleValue}
        handleStyleChange={handleStyleChange}
        renderLabel={renderLabel}
      />

      <LayoutSection
        selectedElement={selectedElement}
        getStyleValue={getStyleValue}
        handleStyleChange={handleStyleChange}
        renderLabel={renderLabel}
      />

      <TypographySection
        selectedElement={selectedElement}
        getStyleValue={getStyleValue}
        handleStyleChange={handleStyleChange}
        renderLabel={renderLabel}
      />

      <AppearanceSection
        selectedElement={selectedElement}
        getStyleValue={getStyleValue}
        handleStyleChange={handleStyleChange}
        renderLabel={renderLabel}
        themePalette={themePalette}
      />
    </div>
  );
}
