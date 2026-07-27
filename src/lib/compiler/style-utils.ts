import React from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import {
  MIN_HEIGHT_MAP,
  LIGHT_BG_VALUES,
  LAYOUT_ELEMENT_TYPES,
} from "./style-maps";

export const getResolvedStyles = (
  el: CanvasElement,
  activeDevice: "desktop" | "tablet" | "mobile"
) => {
  const base = el.styles;
  if (activeDevice === "mobile") return { ...base, ...base.mobile };
  if (activeDevice === "tablet") return { ...base, ...base.tablet };
  return base;
};

export const mapColor = (
  colorVal: string,
  palette?: PageSettings["themePalette"]
) => {
  if (!colorVal) return colorVal;
  const val = colorVal.toLowerCase().trim();

  if (palette) {
    if (palette.iceBlue   && val === palette.iceBlue.toLowerCase().trim())   return "var(--brand-ice-blue)";
    if (palette.skyBlue   && val === palette.skyBlue.toLowerCase().trim())   return "var(--brand-sky-blue)";
    if (palette.cyanActive && val === palette.cyanActive.toLowerCase().trim()) return "var(--brand-cyan-active)";
    if (palette.deepTeal  && val === palette.deepTeal.toLowerCase().trim())  return "var(--brand-deep-teal)";
    if (palette.darkSlate && val === palette.darkSlate.toLowerCase().trim()) return "var(--brand-dark-slate)";
  }

  // Fallback defaults
  if (val === "#d4f0fc") return "var(--brand-ice-blue)";
  if (val === "#89d6fb") return "var(--brand-sky-blue)";
  if (val === "#02a9f7") return "var(--brand-cyan-active)";
  if (val === "#02577a") return "var(--brand-deep-teal)";
  if (val === "#01303f") return "var(--brand-dark-slate)";

  return colorVal;
};

/** CSS class name suffix for each space-* token */
const SPACE_CLASS_SUFFIX: Record<string, string> = {
  "space-none": "none",
  "space-xs":   "xs",
  "space-sm":   "sm",
  "space-md":   "md",
  "space-lg":   "lg",
  "space-xl":   "xl",
  "space-2xl":  "2xl",
};

export const getStyleClasses = (
  el: CanvasElement,
  activeDevice: "desktop" | "tablet" | "mobile"
): string => {
  const s = getResolvedStyles(el, activeDevice);
  const classes: string[] = [];
  const isLayoutComponent = LAYOUT_ELEMENT_TYPES.has(el.type);

  // Margin
  if (s.margin && SPACE_CLASS_SUFFIX[s.margin]) {
    const prefix = isLayoutComponent ? "my-" : "m-";
    classes.push(`${prefix}${SPACE_CLASS_SUFFIX[s.margin]}`);
  }

  // Padding
  if (s.padding && SPACE_CLASS_SUFFIX[s.padding]) {
    classes.push(`p-${SPACE_CLASS_SUFFIX[s.padding]}`);
  }

  if (s.fontSize)      classes.push(s.fontSize);
  if (s.align === "left")   classes.push("text-left");
  else if (s.align === "center") classes.push("text-center");
  else if (s.align === "right")  classes.push("text-right");

  if (s.borderRadius)  classes.push(s.borderRadius);
  if (s.fontWeight)    classes.push(s.fontWeight);
  if (s.letterSpacing) classes.push(s.letterSpacing);

  if (isLayoutComponent) {
    if (el.type === "grid-2") {
      classes.push(activeDevice === "mobile" ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2");
    } else {
      classes.push("flex");
      classes.push(s.direction === "row" ? "flex-row" : "flex-col");

      if (s.justify === "start")        classes.push("justify-start");
      else if (s.justify === "end")     classes.push("justify-end");
      else if (s.justify === "between") classes.push("justify-between");
      else                              classes.push("justify-center");

      if (s.alignItems === "start")   classes.push("items-start");
      else if (s.alignItems === "end")     classes.push("items-end");
      else if (s.alignItems === "stretch") classes.push("items-stretch");
      else                                 classes.push("items-center");
    }

    // Gap
    if (s.gap && SPACE_CLASS_SUFFIX[s.gap]) {
      classes.push(s.gap === "space-none" ? "gap-0" : `gap-${SPACE_CLASS_SUFFIX[s.gap]}`);
    } else {
      classes.push("gap-md");
    }

    // Width mode
    if (s.widthMode === "boxed-sm")     classes.push("max-w-[384px] mx-auto w-full");
    else if (s.widthMode === "boxed-md") classes.push("max-w-[448px] mx-auto w-full");
    else if (s.widthMode === "boxed-lg") classes.push("max-w-[512px] mx-auto w-full");
    else if (s.widthMode === "boxed-xl") classes.push("max-w-[576px] mx-auto w-full");
    else                                 classes.push("w-full");

    if (s.minHeight === "screen") classes.push("min-h-screen");
    else if (s.minHeight === "auto") classes.push("min-h-auto");
  }

  return classes.join(" ");
};

export const getStyleProps = (
  el: CanvasElement,
  activeDevice: "desktop" | "tablet" | "mobile",
  palette?: PageSettings["themePalette"]
): React.CSSProperties => {
  const s = getResolvedStyles(el, activeDevice);
  const props: React.CSSProperties = {};

  if (s.color) {
    const mappedColor = mapColor(s.color, palette);
    if (LAYOUT_ELEMENT_TYPES.has(el.type)) {
      props.backgroundColor = mappedColor;
      const isLightBg = LIGHT_BG_VALUES.has(s.color.toLowerCase().trim());
      props.color = isLightBg ? "var(--brand-dark-slate)" : "#ffffff";
    } else {
      props.color = mappedColor;
    }
  }

  if (s.backgroundColor) {
    props.backgroundColor = mapColor(s.backgroundColor, palette);
  }

  if (s.borderStyle && s.borderStyle !== "none") {
    props.borderStyle = s.borderStyle as React.CSSProperties["borderStyle"];
    props.borderWidth = `${s.borderWidth || 0}px`;
    props.borderColor = s.borderColor ? mapColor(s.borderColor, palette) : "var(--panel-border)";
  }

  if (s.fontFamily) props.fontFamily = s.fontFamily;

  if (s.minHeight && MIN_HEIGHT_MAP[s.minHeight] && ["h-300", "h-500", "h-700"].includes(s.minHeight)) {
    props.minHeight = MIN_HEIGHT_MAP[s.minHeight];
  }

  return props;
};
