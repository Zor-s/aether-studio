"use client";

import React from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import CustomSelect from "../custom-select";
import ColorPicker from "../color-picker";

interface AppearanceSectionProps {
  selectedElement: CanvasElement;
  getStyleValue: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">) => string;
  handleStyleChange: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">, value: string) => void;
  renderLabel: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">, label: string) => React.ReactNode;
  themePalette: PageSettings["themePalette"];
}

export default function AppearanceSection({
  selectedElement,
  getStyleValue,
  handleStyleChange,
  renderLabel,
  themePalette,
}: AppearanceSectionProps) {
  const isLayoutType = ["button", "section", "container", "grid-2"].includes(selectedElement.type);

  return (
    <div className="flex flex-col gap-sm">
      <span className="text-xs font-bold text-foreground">
        Colors & Appearance
      </span>

      <div className="flex flex-col gap-sm bg-background/20 border border-panel-border/40 rounded-xl p-sm">
        <div className="flex items-center justify-between gap-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-foreground leading-snug">
              {isLayoutType ? "Background Color" : "Text Color"}
            </span>
            <span className="text-[8px] text-text-muted mt-[4px] leading-normal">
              {isLayoutType ? "Adjust container fill" : "Adjust typography fill"}
            </span>
          </div>
          <div className="flex items-center gap-xs">
            {["#d4f0fc", "#89d6fb", "#02a9f7", "#02577a", "#01303f"].includes(
              getStyleValue("color").toLowerCase()
            ) && (
              <span className="text-[8px] font-bold px-[4px] py-[2px] bg-cyan-active/10 text-cyan-active rounded uppercase">
                Theme Preset
              </span>
            )}
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

        {selectedElement.type === "blockquote" && (
          <div className="flex flex-col gap-sm border-t border-panel-border/30 pt-sm animate-slideDown">
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
                  value={getStyleValue("quoteLineColor") || themePalette?.cyanActive}
                  onChange={(e) => handleStyleChange("quoteLineColor", e.target.value)}
                  placeholder="e.g. #02a9f7"
                  className="w-16 text-[9px] font-mono text-center bg-background border border-panel-border rounded px-xs py-[2px] text-foreground focus:outline-none"
                />
                <ColorPicker
                  value={getStyleValue("quoteLineColor") || themePalette?.cyanActive}
                  onChange={(val) => handleStyleChange("quoteLineColor", val)}
                  themePalette={themePalette}
                />
              </div>
            </div>

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
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
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

        {selectedElement.type === "list" && (
          <div className="flex flex-col gap-sm border-t border-panel-border/30 pt-sm animate-slideDown">
            <div className="flex flex-col gap-xs">
              {renderLabel("listStyleType", "Marker Style")}
              <CustomSelect
                value={getStyleValue("listStyleType") || "disc"}
                onChange={(val) => handleStyleChange("listStyleType", val)}
                options={[
                  { value: "disc", label: "● Bullet (Disc)" },
                  { value: "circle", label: "○ Circle (Hollow)" },
                  { value: "square", label: "■ Square (Solid)" },
                  { value: "checkmark", label: "✓ Checkmark Icon" },
                  { value: "dash", label: "– Dash Symbol" },
                  { value: "none", label: "None (Unstyled)" },
                  { value: "decimal", label: "1. 2. 3. Numbered" },
                  { value: "decimal-leading-zero", label: "01. 02. Zero Padded" },
                  { value: "lower-alpha", label: "a. b. c. Lower Alpha" },
                  { value: "upper-alpha", label: "A. B. C. Upper Alpha" },
                  { value: "lower-roman", label: "i. ii. iii. Lower Roman" },
                  { value: "upper-roman", label: "I. II. III. Upper Roman" },
                ]}
              />
            </div>

            <div className="flex items-center justify-between gap-sm border-t border-panel-border/20 pt-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground leading-snug">
                  Item Spacing
                </span>
                <span className="text-[8px] text-text-muted mt-[4px] leading-normal">
                  Vertical gap between list items
                </span>
              </div>
              <div className="w-28 shrink-0">
                <CustomSelect
                  value={getStyleValue("itemSpacing") || "space-xs"}
                  onChange={(val) => handleStyleChange("itemSpacing", val)}
                  options={[
                    { value: "space-none", label: "None (0px)" },
                    { value: "space-xs", label: "XS (4px)" },
                    { value: "space-sm", label: "SM (8px)" },
                    { value: "space-md", label: "MD (16px)" },
                    { value: "space-lg", label: "LG (24px)" },
                  ]}
                  className="px-xs py-[4px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-sm border-t border-panel-border/20 pt-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground leading-snug">
                  Bullet / Marker Color
                </span>
                <span className="text-[8px] text-text-muted mt-[4px] leading-normal">
                  Accent color for bullets or numbers
                </span>
              </div>
              <div className="flex items-center gap-xs">
                <input
                  type="text"
                  value={getStyleValue("markerColor") || themePalette?.cyanActive}
                  onChange={(e) => handleStyleChange("markerColor", e.target.value)}
                  placeholder="e.g. #02a9f7"
                  className="w-16 text-[9px] font-mono text-center bg-background border border-panel-border rounded px-xs py-[2px] text-foreground focus:outline-none"
                />
                <ColorPicker
                  value={getStyleValue("markerColor") || themePalette?.cyanActive}
                  onChange={(val) => handleStyleChange("markerColor", val)}
                  themePalette={themePalette}
                />
              </div>
            </div>

            {["decimal", "decimal-leading-zero", "lower-alpha", "upper-alpha", "lower-roman", "upper-roman"].includes(
              getStyleValue("listStyleType")
            ) && (
              <div className="flex items-center justify-between gap-sm border-t border-panel-border/20 pt-sm animate-slideDown">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-foreground leading-snug">
                    Start Index Number
                  </span>
                  <span className="text-[8px] text-text-muted mt-[4px] leading-normal">
                    Initial number for ordered lists
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={getStyleValue("startNumber") || "1"}
                  onChange={(e) => handleStyleChange("startNumber", e.target.value)}
                  className="w-16 text-[9px] font-mono text-center bg-background border border-panel-border rounded px-xs py-[2px] text-foreground focus:outline-none"
                />
              </div>
            )}
          </div>
        )}

        {selectedElement.type === "button" && (
          <div className="flex flex-col gap-sm border-t border-panel-border/30 pt-sm animate-slideDown">
            <div className="flex flex-col gap-xs">
              {renderLabel("buttonVariant", "Button Visual Style")}
              <CustomSelect
                value={getStyleValue("buttonVariant") || "solid"}
                onChange={(val) => handleStyleChange("buttonVariant", val)}
                options={[
                  { value: "solid", label: "Solid Color Fill" },
                  { value: "outline", label: "Outline Line Border" },
                  { value: "ghost", label: "Ghost Transparent" },
                  { value: "soft", label: "Soft Tint Fill" },
                  { value: "glass", label: "Glassmorphism Blur" },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                {renderLabel("buttonSize", "Button Size")}
                <CustomSelect
                  value={getStyleValue("buttonSize") || "md"}
                  onChange={(val) => handleStyleChange("buttonSize", val)}
                  options={[
                    { value: "sm", label: "Small (SM)" },
                    { value: "md", label: "Medium (MD)" },
                    { value: "lg", label: "Large (LG)" },
                    { value: "xl", label: "Extra Large (XL)" },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-xs">
                {renderLabel("buttonWidth", "Button Width")}
                <CustomSelect
                  value={getStyleValue("buttonWidth") || "auto"}
                  onChange={(val) => handleStyleChange("buttonWidth", val)}
                  options={[
                    { value: "auto", label: "Fit Content" },
                    { value: "full", label: "Full Width (100%)" },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                {renderLabel("buttonIcon", "Button Icon")}
                <CustomSelect
                  value={getStyleValue("buttonIcon") || "none"}
                  onChange={(val) => handleStyleChange("buttonIcon", val)}
                  options={[
                    { value: "none", label: "None" },
                    { value: "arrow-right", label: "Arrow Right →" },
                    { value: "external-link", label: "External Link ↗" },
                    { value: "download", label: "Download ⤓" },
                    { value: "mail", label: "Mail Envelope ✉" },
                    { value: "play", label: "Play Button ▶" },
                    { value: "star", label: "Star Rating ★" },
                    { value: "heart", label: "Heart Like ♥" },
                    { value: "check", label: "Checkmark ✓" },
                    { value: "plus", label: "Plus Add +" },
                    { value: "search", label: "Search 🔍" },
                    { value: "github", label: "GitHub Code 💻" },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-xs">
                {renderLabel("iconPosition", "Icon Position")}
                <CustomSelect
                  value={getStyleValue("iconPosition") || "right"}
                  onChange={(val) => handleStyleChange("iconPosition", val)}
                  options={[
                    { value: "left", label: "Left Side" },
                    { value: "right", label: "Right Side" },
                  ]}
                />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              {renderLabel("hoverEffect", "Hover Animation")}
              <CustomSelect
                value={getStyleValue("hoverEffect") || "none"}
                onChange={(val) => handleStyleChange("hoverEffect", val)}
                options={[
                  { value: "none", label: "Standard Opacity" },
                  { value: "lift", label: "Elevate Up + Shadow" },
                  { value: "scale", label: "Zoom Scale (103%)" },
                  { value: "glow", label: "Glowing Halo Shadow" },
                  { value: "shine", label: "Light Sheen Flash" },
                ]}
              />
            </div>
          </div>
        )}

        {selectedElement.type === "image" && (
          <div className="flex flex-col gap-sm border-t border-panel-border/30 pt-sm animate-slideDown">
            {/* Width & Alignment Grid */}
            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                {renderLabel("imageWidth", "Image Width")}
                <CustomSelect
                  value={getStyleValue("imageWidth") || "full"}
                  onChange={(val) => handleStyleChange("imageWidth", val)}
                  options={[
                    { value: "full", label: "Full Width (100%)" },
                    { value: "3/4", label: "Three Quarters (75%)" },
                    { value: "1/2", label: "Half Width (50%)" },
                    { value: "1/3", label: "One Third (33%)" },
                    { value: "auto", label: "Auto / Fit Content" },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-xs">
                {renderLabel("align", "Alignment")}
                <CustomSelect
                  value={getStyleValue("align") || "center"}
                  onChange={(val) => handleStyleChange("align", val)}
                  options={[
                    { value: "left", label: "Align Left" },
                    { value: "center", label: "Align Center" },
                    { value: "right", label: "Align Right" },
                  ]}
                />
              </div>
            </div>

            {/* Aspect Ratio & Object Fit Grid */}
            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                {renderLabel("aspectRatio", "Aspect Ratio")}
                <CustomSelect
                  value={getStyleValue("aspectRatio") || "16/9"}
                  onChange={(val) => handleStyleChange("aspectRatio", val)}
                  options={[
                    { value: "16/9", label: "16:9 Widescreen" },
                    { value: "4/3", label: "4:3 Standard" },
                    { value: "1/1", label: "1:1 Square" },
                    { value: "3/4", label: "3:4 Portrait" },
                    { value: "21/9", label: "21:9 Ultrawide" },
                    { value: "auto", label: "Auto (Original Ratio)" },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-xs">
                {renderLabel("objectFit", "Object Scaling")}
                <CustomSelect
                  value={getStyleValue("objectFit") || "cover"}
                  onChange={(val) => handleStyleChange("objectFit", val)}
                  options={[
                    { value: "cover", label: "Cover (Crop to Fit)" },
                    { value: "contain", label: "Contain (Fit Inside)" },
                    { value: "fill", label: "Fill (Stretch)" },
                    { value: "none", label: "None (Original Size)" },
                    { value: "scale-down", label: "Scale Down" },
                  ]}
                />
              </div>
            </div>

            {/* Elevation / Drop Shadow */}
            <div className="flex flex-col gap-xs">
              {renderLabel("imageShadow", "Drop Shadow Elevation")}
              <CustomSelect
                value={getStyleValue("imageShadow") || "none"}
                onChange={(val) => handleStyleChange("imageShadow", val)}
                options={[
                  { value: "none", label: "Flat (No Shadow)" },
                  { value: "sm", label: "Subtle Soft (SM)" },
                  { value: "md", label: "Medium Depth (MD)" },
                  { value: "lg", label: "Large Shadow (LG)" },
                  { value: "xl", label: "Extra Large (XL)" },
                  { value: "2xl", label: "Dramatic Depth (2XL)" },
                  { value: "glow", label: "Cyan Glow Halo" },
                ]}
              />
            </div>

            {/* Hover Effects */}
            <div className="flex flex-col gap-xs">
              {renderLabel("imageHover", "Hover Animation")}
              <CustomSelect
                value={getStyleValue("imageHover") || "none"}
                onChange={(val) => handleStyleChange("imageHover", val)}
                options={[
                  { value: "none", label: "Static (No Hover)" },
                  { value: "zoom", label: "Zoom Scale (103%)" },
                  { value: "lift", label: "Elevate Lift + Shadow" },
                  { value: "glow", label: "Glowing Cyan Halo" },
                  { value: "grayscale", label: "Grayscale to Color" },
                  { value: "opacity", label: "Soft Opacity Fade" },
                ]}
              />
            </div>

            {/* Loading Strategy */}
            <div className="flex flex-col gap-xs">
              {renderLabel("loading", "Image Loading Mode")}
              <CustomSelect
                value={getStyleValue("loading") || "lazy"}
                onChange={(val) => handleStyleChange("loading", val)}
                options={[
                  { value: "lazy", label: "Lazy Load (Optimized for speed)" },
                  { value: "eager", label: "Eager Load (Load immediately)" },
                ]}
              />
            </div>
          </div>
        )}

        {["button", "section", "container", "grid-2", "blockquote", "image"].includes(selectedElement.type) && (
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

        {getStyleValue("borderStyle") && getStyleValue("borderStyle") !== "none" && (
          <div className="flex flex-col gap-sm border-t border-panel-border/20 pt-sm animate-slideDown">
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
                  onChange={(e) => handleStyleChange("borderWidth", e.target.value)}
                  className="w-20 accent-cyan-active cursor-pointer"
                />
                <span className="text-[10px] font-mono font-bold text-foreground w-6 text-right">
                  {getStyleValue("borderWidth") || "1"}px
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-sm">
              <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">
                Border Color
              </span>
              <div className="flex items-center gap-xs">
                <input
                  type="text"
                  value={getStyleValue("borderColor")}
                  onChange={(e) => handleStyleChange("borderColor", e.target.value)}
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
  );
}
