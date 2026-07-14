import React from "react";
import { CanvasElement, PageSettings } from "@/types/builder";

export const getResolvedStyles = (
  el: CanvasElement,
  activeDevice: "desktop" | "tablet" | "mobile"
) => {
  const base = el.styles;
  if (activeDevice === "mobile") {
    return { ...base, ...base.mobile };
  }
  if (activeDevice === "tablet") {
    return { ...base, ...base.tablet };
  }
  return base;
};

export const mapColor = (
  colorVal: string,
  palette?: PageSettings["themePalette"]
) => {
  if (!colorVal) return colorVal;
  const val = colorVal.toLowerCase().trim();

  if (palette) {
    if (val === palette.iceBlue.toLowerCase().trim()) return "var(--brand-ice-blue)";
    if (val === palette.skyBlue.toLowerCase().trim()) return "var(--brand-sky-blue)";
    if (val === palette.cyanActive.toLowerCase().trim()) return "var(--brand-cyan-active)";
    if (val === palette.deepTeal.toLowerCase().trim()) return "var(--brand-deep-teal)";
    if (val === palette.darkSlate.toLowerCase().trim()) return "var(--brand-dark-slate)";
  }

  // Fallback defaults
  if (val === "#d4f0fc") return "var(--brand-ice-blue)";
  if (val === "#89d6fb") return "var(--brand-sky-blue)";
  if (val === "#02a9f7") return "var(--brand-cyan-active)";
  if (val === "#02577a") return "var(--brand-deep-teal)";
  if (val === "#01303f") return "var(--brand-dark-slate)";

  return colorVal;
};

export const getStyleClasses = (
  el: CanvasElement,
  activeDevice: "desktop" | "tablet" | "mobile"
): string => {
  const s = getResolvedStyles(el, activeDevice);
  const classes: string[] = [];

  const isLayoutComponent = ["section", "container", "grid-2"].includes(el.type);
  const marginPrefix = isLayoutComponent ? "my-" : "m-";
  if (s.margin === "space-none") classes.push(`${marginPrefix}none`);
  else if (s.margin === "space-xs") classes.push(`${marginPrefix}xs`);
  else if (s.margin === "space-sm") classes.push(`${marginPrefix}sm`);
  else if (s.margin === "space-md") classes.push(`${marginPrefix}md`);
  else if (s.margin === "space-lg") classes.push(`${marginPrefix}lg`);
  else if (s.margin === "space-xl") classes.push(`${marginPrefix}xl`);
  else if (s.margin === "space-2xl") classes.push(`${marginPrefix}2xl`);

  if (s.padding === "space-none") classes.push("p-none");
  else if (s.padding === "space-xs") classes.push("p-xs");
  else if (s.padding === "space-sm") classes.push("p-sm");
  else if (s.padding === "space-md") classes.push("p-md");
  else if (s.padding === "space-lg") classes.push("p-lg");
  else if (s.padding === "space-xl") classes.push("p-xl");
  else if (s.padding === "space-2xl") classes.push("p-2xl");

  if (s.fontSize) classes.push(s.fontSize);

  if (s.align === "left") classes.push("text-left");
  else if (s.align === "center") classes.push("text-center");
  else if (s.align === "right") classes.push("text-right");

  if (s.borderRadius) classes.push(s.borderRadius);
  if (s.fontWeight) classes.push(s.fontWeight);
  if (s.letterSpacing) classes.push(s.letterSpacing);

  if (["section", "container"].includes(el.type)) {
    classes.push("flex");

    if (s.direction === "row") {
      classes.push("flex-row");
    } else {
      classes.push("flex-col");
    }

    if (s.justify === "start") classes.push("justify-start");
    else if (s.justify === "end") classes.push("justify-end");
    else if (s.justify === "between") classes.push("justify-between");
    else classes.push("justify-center");

    if (s.alignItems === "start") classes.push("items-start");
    else if (s.alignItems === "end") classes.push("items-end");
    else if (s.alignItems === "stretch") classes.push("items-stretch");
    else classes.push("items-center");

    if (s.gap === "space-none") classes.push("gap-0");
    else if (s.gap === "space-xs") classes.push("gap-xs");
    else if (s.gap === "space-sm") classes.push("gap-sm");
    else if (s.gap === "space-lg") classes.push("gap-lg");
    else if (s.gap === "space-xl") classes.push("gap-xl");
    else if (s.gap === "space-2xl") classes.push("gap-2xl");
    else classes.push("gap-md");

    if (s.widthMode === "boxed-sm") classes.push("max-w-[384px] mx-auto w-full");
    else if (s.widthMode === "boxed-md") classes.push("max-w-[448px] mx-auto w-full");
    else if (s.widthMode === "boxed-lg") classes.push("max-w-[512px] mx-auto w-full");
    else if (s.widthMode === "boxed-xl") classes.push("max-w-[576px] mx-auto w-full");
    else classes.push("w-full");

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
    if (["button", "section", "container", "grid-2"].includes(el.type)) {
      props.backgroundColor = mappedColor;
      const val = s.color.toLowerCase().trim();
      const isLightBg = ["#d4f0fc", "#89d6fb", "var(--brand-ice-blue)", "var(--brand-sky-blue)"].includes(val);
      props.color = isLightBg ? "var(--brand-dark-slate)" : "#ffffff";
    } else {
      props.color = mappedColor;
    }
  }

  if (s.borderStyle && s.borderStyle !== "none") {
    props.borderStyle = s.borderStyle as React.CSSProperties["borderStyle"];
    props.borderWidth = `${s.borderWidth || 0}px`;
    if (s.borderColor) {
      props.borderColor = mapColor(s.borderColor, palette);
    } else {
      props.borderColor = "var(--panel-border)";
    }
  }

  if (s.fontFamily) {
    props.fontFamily = s.fontFamily;
  }

  if (s.minHeight) {
    if (s.minHeight === "h-300") props.minHeight = "300px";
    else if (s.minHeight === "h-500") props.minHeight = "500px";
    else if (s.minHeight === "h-700") props.minHeight = "700px";
  }

  return props;
};
