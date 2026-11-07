"use client";

import React, { useState } from "react";
import { CanvasElement } from "@/types/builder";
import { getResolvedStyles, formatHref } from "@/lib/compiler/style-utils";

interface ImageElementProps {
  element: CanvasElement;
  activeDevice: "desktop" | "tablet" | "mobile";
  customStyles?: React.CSSProperties;
  previewMode?: boolean;
}

export default function ImageElement({
  element: el,
  activeDevice,
  customStyles,
  previewMode,
}: ImageElementProps) {
  const [imageError, setImageError] = useState(false);
  const resolvedStyles = getResolvedStyles(el, activeDevice);

  const src = el.src || "";
  const alt = el.alt || "Image asset";
  const caption = el.caption || "";

  const align = resolvedStyles.align || "center";
  const widthMode = resolvedStyles.imageWidth || "full";
  const aspectRatio = resolvedStyles.aspectRatio || "16/9";
  const objectFit = resolvedStyles.objectFit || "cover";
  const borderRadius = resolvedStyles.borderRadius || "rounded-xl";
  const imageShadow = resolvedStyles.imageShadow || "none";
  const hoverEffect = resolvedStyles.imageHover || "none";
  const loadingStrategy = resolvedStyles.loading || "lazy";

  // Alignment classes
  const containerAlignClass =
    align === "center"
      ? "flex justify-center"
      : align === "right"
      ? "flex justify-end"
      : "flex justify-start";

  // Width classes
  const WIDTH_CLASSES: Record<string, string> = {
    full: "w-full",
    "3/4": "w-full md:w-3/4",
    "1/2": "w-full md:w-1/2",
    "1/3": "w-full md:w-1/3",
    auto: "w-auto max-w-full",
  };
  const widthClass = WIDTH_CLASSES[widthMode] || "w-full";

  // Aspect ratio classes
  const ASPECT_CLASSES: Record<string, string> = {
    auto: "aspect-auto",
    "16/9": "aspect-[16/9]",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "3/4": "aspect-[3/4]",
    "21/9": "aspect-[21/9]",
  };
  const aspectClass = ASPECT_CLASSES[aspectRatio] || "aspect-auto";

  // Object fit classes
  const FIT_CLASSES: Record<string, string> = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  };
  const fitClass = FIT_CLASSES[objectFit] || "object-cover";

  // Shadow classes
  const SHADOW_CLASSES: Record<string, string> = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
    glow: "shadow-[0_0_20px_rgba(2,169,247,0.35)]",
  };
  const shadowClass = SHADOW_CLASSES[imageShadow] || "";

  // Hover effect classes
  let hoverClass = "transition-all duration-300";
  if (hoverEffect === "zoom") {
    hoverClass = "hover:scale-[1.03] transition-transform duration-300 ease-out";
  } else if (hoverEffect === "lift") {
    hoverClass = "hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out";
  } else if (hoverEffect === "glow") {
    hoverClass = "hover:shadow-[0_0_25px_rgba(2,169,247,0.5)] transition-shadow duration-300";
  } else if (hoverEffect === "grayscale") {
    hoverClass = "grayscale hover:grayscale-0 transition-all duration-300 ease-out";
  } else if (hoverEffect === "opacity") {
    hoverClass = "hover:opacity-80 transition-opacity duration-300";
  }

  const borderClass = resolvedStyles.borderStyle && resolvedStyles.borderStyle !== "none"
    ? "border"
    : "";

  const imageElementJsx = (
    <div className={`relative overflow-hidden ${aspectClass} ${borderRadius} ${shadowClass} ${borderClass} bg-panel/40 ${widthClass}`}>
      {(!src || imageError) ? (
        <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center p-md bg-panel/80 border border-dashed border-panel-border text-center select-none gap-xs">
          <svg className="w-8 h-8 text-cyan-active opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-bold text-foreground">
            {!src ? "No Image URL Set" : "Failed to Load Image"}
          </span>
          <span className="text-[10px] text-text-muted max-w-[220px]">
            {!src ? "Enter an image URL in the Content Inspector panel." : "Check the URL format or CORS settings."}
          </span>
          {imageError && (
            <button
              type="button"
              onClick={() => setImageError(false)}
              className="mt-xs text-[9px] font-bold text-cyan-active hover:underline cursor-pointer"
            >
              Retry Loading
            </button>
          )}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loadingStrategy}
          onError={() => setImageError(true)}
          className={`w-full h-full block ${fitClass} ${hoverClass}`}
        />
      )}
    </div>
  );

  return (
    <figure style={customStyles} className={`w-full select-none ${containerAlignClass} m-0`}>
      <div className={`flex flex-col ${widthClass} items-${align === "right" ? "end" : align === "center" ? "center" : "start"}`}>
        {previewMode && el.link ? (
          <a
            href={formatHref(el.link)}
            target={el.linkTarget || "_self"}
            rel={el.linkTarget === "_blank" ? "noopener noreferrer" : undefined}
            className="block w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {imageElementJsx}
          </a>
        ) : (
          imageElementJsx
        )}

        {caption && (
          <figcaption className="text-xs text-text-muted mt-xs text-center font-medium italic leading-normal px-xs">
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
