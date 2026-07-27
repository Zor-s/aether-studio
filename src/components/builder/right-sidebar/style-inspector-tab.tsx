"use client";

import React from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import CustomSelect from "./custom-select";
import ColorPicker from "./color-picker";
import FontPicker from "./font-picker";

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
    key: Exclude<
      keyof NonNullable<CanvasElement["styles"]>,
      "mobile" | "tablet"
    >,
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
    key: Exclude<
      keyof NonNullable<CanvasElement["styles"]>,
      "mobile" | "tablet"
    >,
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
    key: Exclude<
      keyof NonNullable<CanvasElement["styles"]>,
      "mobile" | "tablet"
    >,
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
      onShowToast(
        `Reset ${activeDevice} override for style property: ${key}`,
        "info",
      );
    }
  };

  const handleStyleChange = (
    key: Exclude<
      keyof NonNullable<CanvasElement["styles"]>,
      "mobile" | "tablet"
    >,
    value: string,
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
    key: Exclude<
      keyof NonNullable<CanvasElement["styles"]>,
      "mobile" | "tablet"
    >,
    label: string,
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
            <svg
              className="w-2.5 h-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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
      {/* Breakpoint Override Active Warning Banner */}
      {activeDevice !== "desktop" && (
        <div className="p-xs px-sm rounded-lg bg-cyan-active/10 border border-cyan-active/20 text-[10px] text-cyan-active font-semibold flex items-center gap-xs mb-sm animate-fadeIn">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Editing {activeDevice} overrides. Styles apply strictly to{" "}
          {activeDevice}.
        </div>
      )}

      {/* Spacing Spacing Controller */}
      <div className="flex flex-col gap-xs">
        <span className="text-xs font-bold text-foreground">
          Concentric Spacing
        </span>

        {/* Outer Margin Box */}
        <div className="border border-panel-border rounded-xl bg-background/50 p-sm relative flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-wider font-bold text-text-muted absolute left-2 top-2">
            Margin
          </span>

          {/* Margin Selector inputs layout */}
          <div className="flex items-center justify-between w-full gap-xs mt-md">
            <div className="flex flex-col items-stretch w-full">
              {renderLabel("margin", "Margin Scale")}
              <CustomSelect
                value={getStyleValue("margin") || "space-md"}
                onChange={(val) => handleStyleChange("margin", val)}
                options={[
                  { value: "space-none", label: "None (0px)" },
                  { value: "space-xs", label: "XS (4px)" },
                  { value: "space-sm", label: "SM (8px)" },
                  { value: "space-md", label: "MD (16px)" },
                  { value: "space-lg", label: "LG (24px)" },
                  { value: "space-xl", label: "XL (32px)" },
                  { value: "space-2xl", label: "2XL (48px)" },
                ]}
                className="bg-panel px-xs py-[4px]"
              />
            </div>
          </div>

          {/* Inner Padding Box */}
          <div className="border border-panel-border border-dashed rounded-lg bg-panel p-sm w-full relative mt-sm flex flex-col items-center shadow-inner">
            <span className="text-[9px] uppercase tracking-wider font-bold text-cyan-active/70 absolute left-2 top-2">
              Padding
            </span>

            <div className="flex items-center justify-between w-full gap-xs mt-md">
              <div className="flex flex-col items-stretch w-full">
                {renderLabel("padding", "Padding Scale")}
                <CustomSelect
                  value={getStyleValue("padding") || "space-md"}
                  onChange={(val) => handleStyleChange("padding", val)}
                  options={[
                    { value: "space-none", label: "None (0px)" },
                    { value: "space-xs", label: "XS (4px)" },
                    { value: "space-sm", label: "SM (8px)" },
                    { value: "space-md", label: "MD (16px)" },
                    { value: "space-lg", label: "LG (24px)" },
                    { value: "space-xl", label: "XL (32px)" },
                    { value: "space-2xl", label: "2XL (48px)" },
                  ]}
                  className="bg-background px-xs py-[4px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Settings Section (Only visible for section / container layout components) */}
      {["section", "container", "grid-2"].includes(selectedElement.type) && (
        <div className="flex flex-col gap-sm border-t border-panel-border/40 pt-sm">
          <span className="text-xs font-bold text-foreground">
            Container Layout Settings
          </span>

          {/* Flex Direction & Gap */}
          <div className="grid grid-cols-2 gap-sm">
            {/* Flex Direction */}
            {selectedElement.type !== "grid-2" && (
              <div className="flex flex-col gap-xs">
                {renderLabel("direction", "Flex Direction")}
                <CustomSelect
                  value={getStyleValue("direction") || "col"}
                  onChange={(val) => handleStyleChange("direction", val)}
                  options={[
                    { value: "col", label: "Vertical (Column)" },
                    { value: "row", label: "Horizontal (Row)" },
                  ]}
                />
              </div>
            )}

            {/* Flex Gap spacing */}
            <div
              className={`flex flex-col gap-xs ${selectedElement.type === "grid-2" ? "col-span-2" : ""}`}
            >
              {renderLabel(
                "gap",
                selectedElement.type === "grid-2"
                  ? "Grid Column Gap"
                  : "Flex Item Gap",
              )}
              <CustomSelect
                value={getStyleValue("gap") || "space-md"}
                onChange={(val) => handleStyleChange("gap", val)}
                options={[
                  { value: "space-none", label: "None (0px)" },
                  { value: "space-xs", label: "XS (4px)" },
                  { value: "space-sm", label: "SM (8px)" },
                  { value: "space-md", label: "MD (16px)" },
                  { value: "space-lg", label: "LG (24px)" },
                  { value: "space-xl", label: "XL (32px)" },
                  { value: "space-2xl", label: "2XL (48px)" },
                ]}
              />
            </div>
          </div>

          {/* Main Axis Align & Cross Axis Align */}
          {selectedElement.type !== "grid-2" && (
            <div className="grid grid-cols-2 gap-sm">
              {/* Main-Axis Alignment (Justify Content) */}
              <div className="flex flex-col gap-xs">
                {renderLabel("justify", "Justify Content")}
                <CustomSelect
                  value={getStyleValue("justify") || "center"}
                  onChange={(val) => handleStyleChange("justify", val)}
                  options={[
                    { value: "center", label: "Center" },
                    { value: "start", label: "Start (Left/Top)" },
                    { value: "end", label: "End (Right/Bottom)" },
                    { value: "between", label: "Space Between" },
                  ]}
                />
              </div>

              {/* Cross-Axis Alignment (Align Items) */}
              <div className="flex flex-col gap-xs">
                {renderLabel("alignItems", "Align Items")}
                <CustomSelect
                  value={getStyleValue("alignItems") || "center"}
                  onChange={(val) => handleStyleChange("alignItems", val)}
                  options={[
                    { value: "center", label: "Center" },
                    { value: "start", label: "Start" },
                    { value: "end", label: "End" },
                    { value: "stretch", label: "Stretch" },
                  ]}
                />
              </div>
            </div>
          )}

          {/* Width containment & Min Height */}
          <div className="grid grid-cols-2 gap-sm">
            {/* Width Containment Mode */}
            <div className="flex flex-col gap-xs">
              {renderLabel("widthMode", "Width Limit")}
              <CustomSelect
                value={getStyleValue("widthMode") || "full"}
                onChange={(val) => handleStyleChange("widthMode", val)}
                options={[
                  { value: "full", label: "Full Width (100%)" },
                  { value: "boxed-sm", label: "Boxed SM (384px)" },
                  { value: "boxed-md", label: "Boxed MD (448px)" },
                  { value: "boxed-lg", label: "Boxed LG (512px)" },
                  { value: "boxed-xl", label: "Boxed XL (576px)" },
                ]}
              />
            </div>

            {/* Height Constraint */}
            <div className="flex flex-col gap-xs">
              {renderLabel("minHeight", "Minimum Height")}
              <CustomSelect
                value={getStyleValue("minHeight") || "auto"}
                onChange={(val) => handleStyleChange("minHeight", val)}
                options={[
                  { value: "auto", label: "Auto (Fit Content)" },
                  { value: "screen", label: "Full Screen (100vh)" },
                  { value: "h-300", label: "Small (300px)" },
                  { value: "h-500", label: "Medium (500px)" },
                  { value: "h-700", label: "Large (700px)" },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* Typography scale (Visible on relevant types) */}
      {["headline", "subheading", "paragraph", "button", "blockquote"].includes(
        selectedElement.type,
      ) && (
        <div className="flex flex-col gap-sm">
          <span className="text-xs font-bold text-foreground">Typography</span>

          <div className="grid grid-cols-2 gap-sm">
            {/* Font Family Picker */}
            <div className="col-span-2">
              {renderLabel("fontFamily", "Font Family")}
              <FontPicker
                value={getStyleValue("fontFamily") as string}
                onChange={(val) => handleStyleChange("fontFamily", val)}
              />
            </div>

            {/* Font Size Selector */}
            <div className="flex flex-col gap-xs">
              {renderLabel("fontSize", "Font Size")}
              <CustomSelect
                value={getStyleValue("fontSize") || "text-md"}
                onChange={(val) => handleStyleChange("fontSize", val)}
                options={[
                  { value: "text-xs", label: "Extra Small (XS)" },
                  { value: "text-sm", label: "Small (SM)" },
                  { value: "text-md", label: "Medium (MD)" },
                  { value: "text-lg", label: "Large (LG)" },
                  { value: "text-xl", label: "Heading SM (XL)" },
                  { value: "text-2xl", label: "Heading MD (2XL)" },
                  { value: "text-3xl", label: "Heading LG (3XL)" },
                ]}
              />
            </div>

            {/* Text Alignment Picker */}
            <div className="flex flex-col gap-xs">
              {renderLabel("align", "Text Align")}
              <CustomSelect
                value={getStyleValue("align") || "left"}
                onChange={(val) => handleStyleChange("align", val)}
                options={[
                  { value: "left", label: "Left Align" },
                  { value: "center", label: "Center Align" },
                  { value: "right", label: "Right Align" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            {/* Font Weight Selector */}
            <div className="flex flex-col gap-xs">
              {renderLabel("fontWeight", "Font Weight")}
              <CustomSelect
                value={getStyleValue("fontWeight") || "font-normal"}
                onChange={(val) => handleStyleChange("fontWeight", val)}
                options={[
                  { value: "font-light", label: "Light (300)" },
                  { value: "font-normal", label: "Normal (400)" },
                  { value: "font-medium", label: "Medium (500)" },
                  { value: "font-semibold", label: "Semibold (600)" },
                  { value: "font-bold", label: "Bold (700)" },
                  { value: "font-extrabold", label: "Extra Bold (800)" },
                ]}
              />
            </div>

            {/* Letter Spacing Selector */}
            <div className="flex flex-col gap-xs">
              {renderLabel("letterSpacing", "Letter Spacing")}
              <CustomSelect
                value={getStyleValue("letterSpacing") || "tracking-normal"}
                onChange={(val) => handleStyleChange("letterSpacing", val)}
                options={[
                  { value: "tracking-tighter", label: "Tighter" },
                  { value: "tracking-tight", label: "Tight" },
                  { value: "tracking-normal", label: "Normal" },
                  { value: "tracking-wide", label: "Wide" },
                  { value: "tracking-wider", label: "Wider" },
                  { value: "tracking-widest", label: "Widest" },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* Colors & Appearance Section */}
      <div className="flex flex-col gap-sm border-t border-panel-border/30 pt-sm">
        <span className="text-xs font-bold text-foreground">
          Colors & Appearance
        </span>

        <div className="flex flex-col gap-sm bg-background/20 border border-panel-border/40 rounded-xl p-sm">
          {/* Main Color Picker (Background for layouts/buttons, Text for others) */}
          <div className="flex items-center justify-between gap-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-foreground leading-snug">
                {["button", "section", "container", "grid-2"].includes(
                  selectedElement.type,
                )
                  ? "Background Color"
                  : "Text Color"}
              </span>
              <span className="text-[8px] text-text-muted mt-[4px] leading-normal">
                {["button", "section", "container", "grid-2"].includes(
                  selectedElement.type,
                )
                  ? "Adjust container fill"
                  : "Adjust typography fill"}
              </span>
            </div>
            <div className="flex items-center gap-xs">
              {/* Preset variables helpers tag */}
              {["#d4f0fc", "#89d6fb", "#02a9f7", "#02577a", "#01303f"].includes(
                getStyleValue("color").toLowerCase(),
              ) && (
                <span className="text-[8px] font-bold px-[4px] py-[2px] bg-cyan-active/10 text-cyan-active rounded uppercase">
                  Theme Preset
                </span>
              )}
              {/* Hex value text inputs */}
              <input
                type="text"
                value={getStyleValue("color")}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                placeholder="e.g. #02a9f7"
                className="w-16 text-[9px] font-mono text-center bg-background border border-panel-border rounded px-xs py-[2px] text-foreground focus:outline-none"
              />
              <ColorPicker
                value={getStyleValue("color")}
                onChange={(val) => handleStyleChange("color", val)}
                themePalette={themePalette}
              />
            </div>
          </div>

          {/* Quote Accent Color (Only visible on blockquotes) */}
          {selectedElement.type === "blockquote" && (
            <div className="flex flex-col gap-sm border-t border-panel-border/30 pt-sm animate-slideDown">
              {/* Style Style Variant Selector Input */}
              <div className="flex flex-col gap-xs">
                {renderLabel("quoteVariant", "Quote Layout Style")}
                <CustomSelect
                  value={getStyleValue("quoteVariant") || "classic"}
                  onChange={(val) => handleStyleChange("quoteVariant", val)}
                  options={[
                    { value: "classic", label: "Classic Left Line" },
                    { value: "callout", label: "Modern Callout Card" },
                    { value: "elegant", label: "Elegant Large Quotes" },
                    { value: "banner", label: "Framed Top & Bottom Lines" },
                  ]}
                />
              </div>

              {/* Existing Quote Accent Color Picker Surface */}
              <div className="flex items-center justify-between gap-sm border-t border-panel-border/20 pt-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-foreground leading-snug">
                    Accent Line Color
                  </span>
                  <span className="text-[8px] text-text-muted mt-[4px] leading-normal">
                    Applies to highlight indicators or frames
                  </span>
                </div>
                <div className="flex items-center gap-xs">
                  <input
                    type="text"
                    value={
                      getStyleValue("quoteLineColor") || themePalette.cyanActive
                    }
                    onChange={(e) =>
                      handleStyleChange("quoteLineColor", e.target.value)
                    }
                    placeholder="e.g. #02a9f7"
                    className="w-16 text-[9px] font-mono text-center bg-background border border-panel-border rounded px-xs py-[2px] text-foreground focus:outline-none"
                  />
                  <ColorPicker
                    value={
                      getStyleValue("quoteLineColor") || themePalette.cyanActive
                    }
                    onChange={(val) => handleStyleChange("quoteLineColor", val)}
                    themePalette={themePalette}
                  />
                </div>
              </div>

              {/* Custom Background Color Picker */}
              <div className="flex items-center justify-between gap-sm border-t border-panel-border/20 pt-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-foreground leading-snug">
                    Background Color
                  </span>
                  <span className="text-[8px] text-text-muted mt-[4px] leading-normal">
                    Adjust blockquote backdrop fill
                  </span>
                </div>
                <div className="flex items-center gap-xs">
                  <input
                    type="text"
                    value={getStyleValue("backgroundColor")}
                    onChange={(e) =>
                      handleStyleChange("backgroundColor", e.target.value)
                    }
                    placeholder="e.g. #02a9f7"
                    className="w-16 text-[9px] font-mono text-center bg-background border border-panel-border rounded px-xs py-[2px] text-foreground focus:outline-none"
                  />
                  <ColorPicker
                    value={getStyleValue("backgroundColor")}
                    onChange={(val) => handleStyleChange("backgroundColor", val)}
                    themePalette={themePalette}
                  />
                </div>
              </div>
            </div>
          )}
          {/* Border Radius (Visible on relevant shapes) */}
          {["button", "section", "container", "grid-2", "blockquote"].includes(
            selectedElement.type,
          ) && (
            <div className="flex items-center justify-between gap-sm border-t border-panel-border/30 pt-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground leading-snug">
                  Border Radius
                </span>
                <span className="text-[8px] text-text-muted mt-[4px] leading-normal">
                  Smooth component corners
                </span>
              </div>
              <div className="w-28 shrink-0">
                <CustomSelect
                  value={getStyleValue("borderRadius") || "rounded-none"}
                  onChange={(val) => handleStyleChange("borderRadius", val)}
                  options={[
                    { value: "rounded-none", label: "Sharp (0px)" },
                    { value: "rounded-sm", label: "Small (2px)" },
                    { value: "rounded-md", label: "Medium (6px)" },
                    { value: "rounded-lg", label: "Large (8px)" },
                    { value: "rounded-xl", label: "Extra Large (12px)" },
                    { value: "rounded-2xl", label: "Double Large (16px)" },
                    { value: "rounded-full", label: "Full Round (Circle)" },
                  ]}
                  className="px-xs py-[4px]"
                />
              </div>
            </div>
          )}

          {/* Border Style Toggle */}
          <div className="flex items-center justify-between gap-sm border-t border-panel-border/30 pt-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-foreground leading-snug">
                Border Style
              </span>
              <span className="text-[8px] text-text-muted mt-[4px] leading-normal">
                Add container outlines
              </span>
            </div>
            <div className="w-28 shrink-0">
              <CustomSelect
                value={getStyleValue("borderStyle") || "none"}
                onChange={(val) => handleStyleChange("borderStyle", val)}
                options={[
                  { value: "none", label: "No Border" },
                  { value: "solid", label: "Solid Line" },
                  { value: "dashed", label: "Dashed Line" },
                  { value: "dotted", label: "Dotted Line" },
                ]}
                className="px-xs py-[4px]"
              />
            </div>
          </div>

          {/* Border Width & Color Picker (Only visible if Border Style is active) */}
          {getStyleValue("borderStyle") &&
            getStyleValue("borderStyle") !== "none" && (
              <div className="flex flex-col gap-sm border-t border-panel-border/20 pt-sm animate-slideDown">
                {/* Border Width slider */}
                <div className="flex items-center justify-between gap-sm">
                  <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">
                    Border Width
                  </span>
                  <div className="flex items-center gap-sm shrink-0">
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={getStyleValue("borderWidth") || "1"}
                      onChange={(e) =>
                        handleStyleChange("borderWidth", e.target.value)
                      }
                      className="w-20 accent-cyan-active cursor-pointer"
                    />
                    <span className="text-[10px] font-mono font-bold text-foreground w-6 text-right">
                      {getStyleValue("borderWidth") || "1"}px
                    </span>
                  </div>
                </div>

                {/* Border Color */}
                <div className="flex items-center justify-between gap-sm">
                  <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">
                    Border Color
                  </span>
                  <div className="flex items-center gap-xs">
                    <input
                      type="text"
                      value={getStyleValue("borderColor")}
                      onChange={(e) =>
                        handleStyleChange("borderColor", e.target.value)
                      }
                      placeholder="e.g. #02a9f7"
                      className="w-16 text-[9px] font-mono text-center bg-background border border-panel-border rounded px-xs py-[2px] text-foreground focus:outline-none"
                    />
                    <ColorPicker
                      value={getStyleValue("borderColor")}
                      onChange={(val) => handleStyleChange("borderColor", val)}
                      themePalette={themePalette}
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
