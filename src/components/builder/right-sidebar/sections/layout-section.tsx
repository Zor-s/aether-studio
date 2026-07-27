"use client";

import React from "react";
import { CanvasElement } from "@/types/builder";
import CustomSelect from "../custom-select";

interface LayoutSectionProps {
  selectedElement: CanvasElement;
  getStyleValue: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">) => string;
  handleStyleChange: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">, value: string) => void;
  renderLabel: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">, label: string) => React.ReactNode;
}

export default function LayoutSection({
  selectedElement,
  getStyleValue,
  handleStyleChange,
  renderLabel,
}: LayoutSectionProps) {
  if (!["section", "container", "grid-2"].includes(selectedElement.type)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-sm border-t border-panel-border/40 pt-sm">
      <span className="text-xs font-bold text-foreground">
        Container Layout Settings
      </span>

      <div className="grid grid-cols-2 gap-sm">
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

        <div
          className={`flex flex-col gap-xs ${selectedElement.type === "grid-2" ? "col-span-2" : ""}`}
        >
          {renderLabel(
            "gap",
            selectedElement.type === "grid-2"
              ? "Grid Column Gap"
              : "Flex Item Gap"
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

      {selectedElement.type !== "grid-2" && (
        <div className="grid grid-cols-2 gap-sm">
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

      <div className="grid grid-cols-2 gap-sm">
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
  );
}
