"use client";

import React from "react";
import { CanvasElement } from "@/types/builder";
import { getResolvedStyles } from "@/lib/compiler/style-utils";

interface AtomicElementProps {
  element: CanvasElement;
  activeDevice: "desktop" | "tablet" | "mobile";
  customStyles: React.CSSProperties;
}

export default function AtomicElement({
  element: el,
  activeDevice,
  customStyles,
}: AtomicElementProps) {
  const resolvedStyles = getResolvedStyles(el, activeDevice);

  switch (el.type) {
    case "headline":
      return (
        <h2
          className={`${resolvedStyles.fontWeight ? "" : "font-extrabold"} ${
            resolvedStyles.letterSpacing ? "" : "tracking-tight"
          } leading-tight select-none`}
        >
          {el.content}
        </h2>
      );

    case "paragraph":
      return (
        <p
          className={`leading-relaxed opacity-80 ${
            resolvedStyles.fontWeight ? "" : "font-medium"
          } select-none`}
        >
          {el.content}
        </p>
      );

    case "button":
      return (
        <div
          className={`${
            resolvedStyles.align === "center"
              ? "flex justify-center"
              : resolvedStyles.align === "right"
              ? "flex justify-end"
              : "flex justify-start"
          }`}
        >
          <button
            type="button"
            style={customStyles}
            className={`px-lg h-10 select-none font-bold text-xs shadow-md transition-all duration-200 cursor-pointer ${
              resolvedStyles.borderRadius || "rounded-none"
            }`}
          >
            {el.content}
          </button>
        </div>
      );

    case "subheading":
      return (
        <h3
          className={`${resolvedStyles.fontWeight ? "" : "font-semibold"} ${
            resolvedStyles.letterSpacing ? "" : "tracking-tight"
          } select-none`}
        >
          {el.content}
        </h3>
      );

    case "list":
      return (
        <ul className="list-disc pl-md opacity-80 select-none flex flex-col gap-xs">
          {el.content
            .split("\n")
            .filter(Boolean)
            .map((item, idx) => (
              <li key={idx} className="font-medium">
                {item}
              </li>
            ))}
        </ul>
      );

    case "divider":
      return <hr className="w-full border-t border-panel-border my-sm select-none" />;

    default:
      return null;
  }
}
