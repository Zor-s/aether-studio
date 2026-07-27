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
    <div className="flex flex-col gap-sm border-t border-panel-border/30 pt-sm">
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

        {["button", "section", "container", "grid-2", "blockquote"].includes(selectedElement.type) && (
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
