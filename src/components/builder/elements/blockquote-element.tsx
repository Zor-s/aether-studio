"use client";

import React from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import { getResolvedStyles, mapColor } from "@/lib/compiler/style-utils";

interface BlockquoteElementProps {
  element: CanvasElement;
  activeDevice: "desktop" | "tablet" | "mobile";
  themePalette: PageSettings["themePalette"];
}

export default function BlockquoteElement({
  element: el,
  activeDevice,
  themePalette,
}: BlockquoteElementProps) {
  const resolvedStyles = getResolvedStyles(el, activeDevice);
  const variant = resolvedStyles.quoteVariant || "classic";
  const quoteLineColorVal = resolvedStyles.quoteLineColor || themePalette.cyanActive;
  const resolvedQuoteLineColor = mapColor(quoteLineColorVal, themePalette);
  const fontModifier = resolvedStyles.fontWeight ? "" : "font-medium";

  switch (variant) {
    case "callout": {
      const alignClass = resolvedStyles.align ? "" : "text-center";
      return (
        <blockquote
          className={`w-full italic select-none relative ${alignClass} ${fontModifier}`}
          style={{ margin: 0, padding: 0 }}
        >
          <span className="absolute text-6xl font-serif text-cyan-active opacity-15 select-none pointer-events-none left-0 -top-2">
            “
          </span>
          <p className="relative z-10 italic font-medium m-0 w-full">{el.content}</p>
        </blockquote>
      );
    }

    case "elegant":
      return (
        <blockquote
          className={`w-full italic select-none relative ${fontModifier}`}
          style={{
            margin: 0,
            paddingLeft: "1.75rem",
            paddingRight: "1.75rem",
            paddingTop: "0.25rem",
            paddingBottom: "0.25rem",
          }}
        >
          <span
            style={{
              left: 0,
              top: 0,
              color: resolvedQuoteLineColor,
            }}
            className="absolute text-5xl font-serif font-black leading-none select-none opacity-60"
          >
            “
          </span>
          <p className="m-0 leading-relaxed font-medium w-full">{el.content}</p>
          <span
            style={{
              right: 0,
              bottom: "-0.5rem",
              color: resolvedQuoteLineColor,
            }}
            className="absolute text-5xl font-serif font-black leading-none select-none opacity-60"
          >
            ”
          </span>
        </blockquote>
      );

    case "banner": {
      const alignClass = resolvedStyles.align ? "" : "text-center";
      return (
        <blockquote
          style={{ margin: 0, padding: 0 }}
          className={`w-full tracking-wide italic select-none ${alignClass} ${fontModifier}`}
        >
          “ {el.content} ”
        </blockquote>
      );
    }

    case "classic":
    default: {
      return (
        <blockquote
          style={{
            paddingLeft: "1rem",
            margin: 0,
          }}
          className={`relative italic w-full select-none ${fontModifier}`}
        >
          <span
            style={{
              backgroundColor: resolvedQuoteLineColor,
              left: 0,
              top: 0,
              bottom: 0,
            }}
            className="absolute w-1 rounded-full"
          />
          {el.content}
        </blockquote>
      );
    }
  }
}
