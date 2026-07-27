"use client";

import React from "react";
import { CanvasElement } from "@/types/builder";
import CustomSelect from "../custom-select";

interface SpacingSectionProps {
  getStyleValue: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">) => string;
  handleStyleChange: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">, value: string) => void;
  renderLabel: (key: Exclude<keyof NonNullable<CanvasElement["styles"]>, "mobile" | "tablet">, label: string) => React.ReactNode;
}

export default function SpacingSection({
  getStyleValue,
  handleStyleChange,
  renderLabel,
}: SpacingSectionProps) {
  return (
    <div className="flex flex-col gap-xs">
      <span className="text-xs font-bold text-foreground">
        Concentric Spacing
      </span>

      <div className="border border-panel-border rounded-xl bg-background/50 p-sm relative flex flex-col items-center">
        <span className="text-[9px] uppercase tracking-wider font-bold text-text-muted absolute left-2 top-2">
          Margin
        </span>

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
  );
}
