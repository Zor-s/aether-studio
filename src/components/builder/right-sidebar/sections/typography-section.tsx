"use client";

import React from "react";
import { CanvasElement } from "@/types/builder";
import CustomSelect from "../custom-select";
import FontPicker from "../font-picker";

interface TypographySectionProps {
  selectedElement: CanvasElement;
  getStyleValue: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">) => string;
  handleStyleChange: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">, value: string) => void;
  renderLabel: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">, label: string) => React.ReactNode;
}

export default function TypographySection({
  selectedElement,
  getStyleValue,
  handleStyleChange,
  renderLabel,
}: TypographySectionProps) {
  if (
    !["headline", "subheading", "paragraph", "button", "blockquote", "list"].includes(
      selectedElement.type
    )
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-sm">
      <span className="text-xs font-bold text-foreground">Typography</span>

      <div className="grid grid-cols-2 gap-sm">
        <div className="col-span-2">
          {renderLabel("fontFamily", "Font Family")}
          <FontPicker
            value={getStyleValue("fontFamily") as string}
            onChange={(val) => handleStyleChange("fontFamily", val)}
          />
        </div>

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
  );
}
