"use client";

import React from "react";
import { CanvasElement } from "@/types/builder";
import {
  getResolvedStyles,
  isOrderedListType,
  mapColor,
  parseNestedListItems,
  getNestedMarkerType,
  buildListTree,
  ListNode,
  formatHref,
} from "@/lib/compiler/style-utils";

import {
  renderButtonIconJsx,
  renderLoadingSpinnerJsx,
} from "@/lib/compiler/button-icons";

interface AtomicElementProps {
  element: CanvasElement;
  activeDevice: "desktop" | "tablet" | "mobile";
  customStyles: React.CSSProperties;
  previewMode?: boolean;
}

function renderListTreeNodes(
  nodes: ListNode[],
  rootListType: string,
  resolvedStyles: Record<string, any>,
  resolvedMarkerColor?: string,
  isCustomSymbol?: boolean,
  gapClass?: string
) {
  return nodes.map((node, idx) => {
    const markerType = getNestedMarkerType(rootListType, node.level);
    const itemStyle: React.CSSProperties = {
      listStyleType: isCustomSymbol ? "none" : markerType,
    };
    const isOrdered = isOrderedListType(rootListType);
    const SubListTag = isOrdered ? "ol" : "ul";

    return (
      <li
        key={idx}
        style={itemStyle}
        className={`leading-relaxed ${
          resolvedStyles.fontWeight ? "" : "font-medium"
        } ${isCustomSymbol ? "flex items-start gap-xs" : ""}`}
      >
        {rootListType === "checkmark" && (
          <span
            className="shrink-0 font-bold leading-relaxed select-none"
            style={{ color: resolvedMarkerColor || "currentColor" }}
          >
            ✓
          </span>
        )}
        {rootListType === "dash" && (
          <span
            className="shrink-0 font-bold leading-relaxed select-none"
            style={{ color: resolvedMarkerColor || "currentColor" }}
          >
            –
          </span>
        )}
        <span>{node.text}</span>
        {node.children.length > 0 && (
          <SubListTag className={`flex flex-col ${gapClass || "gap-xs"} pl-6 mt-1`}>
            {renderListTreeNodes(
              node.children,
              rootListType,
              resolvedStyles,
              resolvedMarkerColor,
              isCustomSymbol,
              gapClass
            )}
          </SubListTag>
        )}
      </li>
    );
  });
}

export default function AtomicElement({
  element: el,
  activeDevice,
  customStyles,
  previewMode,
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

    case "button": {
      const variant = resolvedStyles.buttonVariant || "solid";
      const size = resolvedStyles.buttonSize || "md";
      const widthMode = resolvedStyles.buttonWidth || "auto";
      const icon = resolvedStyles.buttonIcon || "none";
      const iconPos = resolvedStyles.iconPosition || "right";
      const hover = resolvedStyles.hoverEffect || "none";

      const alignClass =
        widthMode === "full"
          ? "w-full flex justify-center"
          : resolvedStyles.align === "center"
          ? "flex justify-center w-full"
          : resolvedStyles.align === "right"
          ? "flex justify-end w-full"
          : "flex justify-start w-full";

      const SIZE_CLASSES: Record<string, string> = {
        sm: "px-3 h-8 text-xs font-semibold gap-1.5",
        md: "px-6 h-10 text-xs font-bold gap-2",
        lg: "px-8 h-12 text-sm font-bold gap-2.5",
        xl: "px-10 h-14 text-base font-extrabold gap-3",
      };
      const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
      const widthClass = widthMode === "full" ? "w-full" : "w-auto";

      let hoverClass = "hover:opacity-90";
      if (hover === "lift") {
        hoverClass = "hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200";
      } else if (hover === "scale") {
        hoverClass = "hover:scale-[1.03] transition-transform duration-200";
      } else if (hover === "glow") {
        hoverClass = "hover:shadow-[0_0_20px_rgba(2,169,247,0.5)] transition-shadow duration-200";
      } else if (hover === "shine") {
        hoverClass = "relative overflow-hidden group";
      }

      const mappedColor = resolvedStyles.color ? mapColor(resolvedStyles.color) : "var(--brand-cyan-active)";
      const buttonStyle: React.CSSProperties = { ...customStyles };

      if (variant === "outline") {
        buttonStyle.backgroundColor = "transparent";
        buttonStyle.color = mappedColor;
        buttonStyle.borderStyle = "solid";
        buttonStyle.borderWidth = resolvedStyles.borderWidth ? `${resolvedStyles.borderWidth}px` : "1.5px";
        buttonStyle.borderColor = resolvedStyles.borderColor ? mapColor(resolvedStyles.borderColor) : mappedColor;
      } else if (variant === "ghost") {
        buttonStyle.backgroundColor = "transparent";
        buttonStyle.color = mappedColor;
        buttonStyle.borderStyle = "none";
      } else if (variant === "soft") {
        buttonStyle.backgroundColor = "var(--accent-soft, rgba(2, 169, 247, 0.15))";
        buttonStyle.color = mappedColor;
      } else if (variant === "glass") {
        buttonStyle.backgroundColor = "rgba(255, 255, 255, 0.15)";
        buttonStyle.color = mappedColor;
        buttonStyle.backdropFilter = "blur(8px)";
        buttonStyle.borderStyle = "solid";
        buttonStyle.borderWidth = "1px";
        buttonStyle.borderColor = "rgba(255, 255, 255, 0.25)";
      } else {
        if (resolvedStyles.color) {
          const val = resolvedStyles.color.toLowerCase().trim();
          const isLightBg = ["#d4f0fc", "#89d6fb", "var(--brand-ice-blue)", "var(--brand-sky-blue)"].includes(val);
          buttonStyle.backgroundColor = mappedColor;
          buttonStyle.color = isLightBg ? "var(--brand-dark-slate)" : "#ffffff";
        }
      }

      const iconJsx = renderButtonIconJsx(icon, "w-4 h-4 shrink-0");
      const shadowClass = ["ghost", "outline", "soft"].includes(variant) ? "" : "shadow-md";
      const buttonClasses = `select-none ${shadowClass} flex items-center justify-center transition-all duration-200 cursor-pointer ${sizeClass} ${widthClass} ${hoverClass} ${
        resolvedStyles.borderRadius || "rounded-none"
      }`;

      if (previewMode && el.link) {
        return (
          <div className={alignClass}>
            <a
              href={formatHref(el.link)}
              target={el.linkTarget || "_self"}
              rel={el.linkTarget === "_blank" ? "noopener noreferrer" : undefined}
              style={buttonStyle}
              className={buttonClasses}
              onClick={(e) => e.stopPropagation()}
            >
              {hover === "shine" && (
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
              )}
              {iconPos === "left" && iconJsx}
              <span>{el.content}</span>
              {iconPos === "right" && iconJsx}
            </a>
          </div>
        );
      }

      return (
        <div className={alignClass}>
          <button
            type="button"
            style={buttonStyle}
            className={buttonClasses}
          >
            {hover === "shine" && (
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            )}
            {iconPos === "left" && iconJsx}
            <span>{el.content}</span>
            {iconPos === "right" && iconJsx}
          </button>
        </div>
      );
    }

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

    case "list": {
      const parsedItems = parseNestedListItems(el.content);
      const displayItems =
        parsedItems.length > 0
          ? parsedItems
          : [{ text: "List item bullet point", level: 0 }];

      const treeNodes = buildListTree(displayItems);
      const rootListType = resolvedStyles.listStyleType || "disc";
      const isOrdered = isOrderedListType(rootListType);
      const isCustomSymbol = rootListType === "checkmark" || rootListType === "dash";

      const GAP_CLASSES: Record<string, string> = {
        "space-none": "gap-0",
        "space-xs": "gap-xs",
        "space-sm": "gap-sm",
        "space-md": "gap-md",
        "space-lg": "gap-lg",
      };
      const gapClass = GAP_CLASSES[resolvedStyles.itemSpacing || "space-xs"] || "gap-xs";
      const resolvedMarkerColor = resolvedStyles.markerColor
        ? mapColor(resolvedStyles.markerColor)
        : undefined;

      const containerStyleObj: React.CSSProperties = {};
      if (resolvedMarkerColor) {
        (containerStyleObj as Record<string, string>)["--marker-color"] = resolvedMarkerColor;
      }

      const ListTag = isOrdered ? "ol" : "ul";
      const startNum = isOrdered && resolvedStyles.startNumber ? resolvedStyles.startNumber : 1;

      return (
        <ListTag
          start={isOrdered ? startNum : undefined}
          style={containerStyleObj}
          className={`select-none flex flex-col ${gapClass} pl-md ${
            resolvedMarkerColor ? "[&_li::marker]:text-[var(--marker-color)]" : ""
          }`}
        >
          {renderListTreeNodes(
            treeNodes,
            rootListType,
            resolvedStyles,
            resolvedMarkerColor,
            isCustomSymbol,
            gapClass
          )}
        </ListTag>
      );
    }

    case "divider":
      return <hr className="w-full border-t border-panel-border my-sm select-none" />;

    default:
      return null;
  }
}
