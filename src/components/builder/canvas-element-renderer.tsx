"use client";

import React, { useState } from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import {
  getStyleClasses,
  getStyleProps,
  getResolvedStyles,
  mapColor,
} from "@/lib/compiler/style-utils";
import CanvasSelectionOverlay from "./canvas-selection-overlay";
import BlockquoteElement from "./elements/blockquote-element";
import AtomicElement from "./elements/atomic-elements";

interface CanvasElementRendererProps {
  element: CanvasElement;
  canvasElements: CanvasElement[];
  activeDevice: "desktop" | "tablet" | "mobile";
  selectedElementId: string | null;
  previewMode: boolean;
  onSelectElement: (element: CanvasElement) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onMoveElement: (id: string, direction: "up" | "down") => void;
  onReorderElements: (sourceId: string, targetId: string) => void;
  setSelectedElementId: (id: string | null) => void;
  themePalette: PageSettings["themePalette"];
}

function normalizeBorderStyles(styles: React.CSSProperties): React.CSSProperties {
  const newStyles = { ...styles };
  if (newStyles.borderStyle) {
    const bs = newStyles.borderStyle as React.CSSProperties["borderTopStyle"];
    newStyles.borderTopStyle = bs;
    newStyles.borderRightStyle = bs;
    newStyles.borderBottomStyle = bs;
    newStyles.borderLeftStyle = bs;
    delete newStyles.borderStyle;
  }
  if (newStyles.borderWidth) {
    const bw = newStyles.borderWidth as React.CSSProperties["borderTopWidth"];
    newStyles.borderTopWidth = bw;
    newStyles.borderRightWidth = bw;
    newStyles.borderBottomWidth = bw;
    newStyles.borderLeftWidth = bw;
    delete newStyles.borderWidth;
  }
  if (newStyles.borderColor) {
    const bc = newStyles.borderColor as React.CSSProperties["borderTopColor"];
    newStyles.borderTopColor = bc;
    newStyles.borderRightColor = bc;
    newStyles.borderBottomColor = bc;
    newStyles.borderLeftColor = bc;
    delete newStyles.borderColor;
  }
  return newStyles;
}

export default function CanvasElementRenderer({
  element: el,
  canvasElements,
  activeDevice,
  selectedElementId,
  previewMode,
  onSelectElement,
  onDeleteElement,
  onDuplicateElement,
  onMoveElement,
  onReorderElements,
  setSelectedElementId,
  themePalette,
}: CanvasElementRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedElementId === el.id;
  const styleClasses = getStyleClasses(el, activeDevice);
  const customStyles = getStyleProps(el, activeDevice, themePalette);
  const resolvedStyles = getResolvedStyles(el, activeDevice);

  let wrapperClasses = `group/item relative transition-all duration-200 ${
    !previewMode
      ? `cursor-pointer ${
          isSelected
            ? "outline outline-2 outline-cyan-active outline-offset-[2px] z-20"
            : isHovered
              ? "outline outline-dashed outline-1 outline-sky-blue outline-offset-[2px]"
              : ""
        }`
      : ""
  } ${styleClasses}`;

  let wrapperStyles = el.type !== "button" ? customStyles : undefined;

  if (el.type === "blockquote") {
    const variant = resolvedStyles.quoteVariant || "classic";
    const quoteLineColorVal = resolvedStyles.quoteLineColor || themePalette.cyanActive;
    const resolvedQuoteLineColor = mapColor(quoteLineColorVal, themePalette);
    const hasRadius = !!resolvedStyles.borderRadius;

    wrapperStyles = normalizeBorderStyles(wrapperStyles || {});

    if (variant === "classic") {
      wrapperClasses += ` border border-l-0 border-panel-border/30 ${hasRadius ? "" : "rounded-r-xl"}`;
      if (!resolvedStyles.backgroundColor) {
        wrapperClasses += " bg-accent-soft/10";
      }
    } else if (variant === "callout") {
      const alignClass = resolvedStyles.align ? "" : "text-center";
      wrapperClasses += ` overflow-hidden shadow-sm border border-panel-border/30 ${alignClass} ${hasRadius ? "" : "rounded-2xl"}`;
      if (!resolvedStyles.backgroundColor) {
        wrapperClasses += " bg-accent-soft/15";
      }
    } else if (variant === "banner") {
      const alignClass = resolvedStyles.align ? "" : "text-center";
      wrapperClasses += ` ${alignClass}`;
      if (!resolvedStyles.backgroundColor) {
        wrapperClasses += " bg-accent-soft/5";
      }
      wrapperStyles = {
        ...wrapperStyles,
        borderTopWidth: "2px",
        borderTopStyle: "solid",
        borderTopColor: resolvedQuoteLineColor,
        borderBottomWidth: "2px",
        borderBottomStyle: "solid",
        borderBottomColor: resolvedQuoteLineColor,
      };
    }
  }

  const children = canvasElements.filter((child) => child.parentId === el.id);
  const isGridColumn =
    el.parentId &&
    canvasElements.some(
      (parent) => parent.id === el.parentId && parent.type === "grid-2"
    );

  const renderChild = (child: CanvasElement) => (
    <CanvasElementRenderer
      key={child.id}
      element={child}
      canvasElements={canvasElements}
      activeDevice={activeDevice}
      selectedElementId={selectedElementId}
      previewMode={previewMode}
      onSelectElement={onSelectElement}
      onDeleteElement={onDeleteElement}
      onDuplicateElement={onDuplicateElement}
      onMoveElement={onMoveElement}
      onReorderElements={onReorderElements}
      setSelectedElementId={setSelectedElementId}
      themePalette={themePalette}
    />
  );

  return (
    <div
      key={el.id}
      draggable={!previewMode}
      onDragStart={(e) => {
        if (previewMode) return;
        e.stopPropagation();
        e.dataTransfer.setData("text/plain", el.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(e) => {
        if (previewMode) return;
        e.preventDefault();
      }}
      onDrop={(e) => {
        if (previewMode) return;
        e.preventDefault();
        e.stopPropagation();
        const sourceId = e.dataTransfer.getData("text/plain");
        if (sourceId && sourceId !== el.id) {
          onReorderElements(sourceId, el.id);
        }
      }}
      onMouseEnter={(e) => {
        if (previewMode) return;
        e.stopPropagation();
        setIsHovered(true);
      }}
      onMouseLeave={(e) => {
        if (previewMode) return;
        e.stopPropagation();
        setIsHovered(false);
      }}
      onClick={(e) => {
        if (previewMode) return;
        e.stopPropagation();
        onSelectElement(el);
      }}
      style={wrapperStyles}
      className={wrapperClasses}
    >
      {/* Dropzone Guidelines */}
      {!previewMode && isHovered && !isSelected && (
        <>
          <div className="absolute top-0 left-0 right-0 h-0 flex items-center justify-center z-10 pointer-events-none animate-fadeIn">
            <div className="w-full border-t border-dashed border-cyan-active/60 relative">
              <div className="absolute -translate-y-1/2 left-1/2 -translate-x-1/2 bg-cyan-active text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md scale-90 hover:scale-100 transition-transform">
                +
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0 flex items-center justify-center z-10 pointer-events-none animate-fadeIn">
            <div className="w-full border-b border-dashed border-cyan-active/60 relative">
              <div className="absolute -translate-y-1/2 left-1/2 -translate-x-1/2 bg-cyan-active text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md scale-90 hover:scale-100 transition-transform">
                +
              </div>
            </div>
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-0 border-l border-dashed border-cyan-active/30 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-0 border-r border-dashed border-cyan-active/30 pointer-events-none" />
        </>
      )}

      {/* Selection Overlay */}
      {!previewMode && isSelected && (
        <CanvasSelectionOverlay
          element={el}
          isGridColumn={!!isGridColumn}
          onMoveElement={onMoveElement}
          onDuplicateElement={onDuplicateElement}
          onDeleteElement={onDeleteElement}
          setSelectedElementId={setSelectedElementId}
        />
      )}

      {/* Layout Containers */}
      {el.type === "section" && (
        <>
          {children.length > 0 ? (
            children.map(renderChild)
          ) : !previewMode ? (
            <div className="w-full flex flex-col gap-md border border-panel-border rounded-xl p-md bg-panel shadow-sm">
              <span className="text-[10px] text-text-muted select-none italic font-medium">
                Empty Section Container
              </span>
            </div>
          ) : null}
        </>
      )}

      {el.type === "grid-2" && (
        <>
          {children.length > 0 ? (
            children.map(renderChild)
          ) : !previewMode ? (
            <>
              <div className="w-full border border-panel-border rounded-xl p-md bg-panel shadow-sm text-center py-lg">
                <span className="text-[10px] text-text-muted italic">Column A</span>
              </div>
              <div className="w-full border border-panel-border rounded-xl p-md bg-panel shadow-sm text-center py-lg">
                <span className="text-[10px] text-text-muted italic">Column B</span>
              </div>
            </>
          ) : null}
        </>
      )}

      {el.type === "container" && (
        <>
          {children.length > 0 ? (
            children.map(renderChild)
          ) : !previewMode ? (
            isGridColumn ? (
              <div className="w-full border border-panel-border rounded-xl p-md bg-panel shadow-sm text-center py-lg">
                <span className="text-[10px] text-text-muted italic">
                  {el.name || "Column"} (Empty)
                </span>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-md border border-panel-border rounded-xl p-md bg-panel shadow-sm">
                <span className="text-[10px] text-text-muted select-none italic font-medium">
                  Standard Content Wrapper
                </span>
              </div>
            )
          ) : null}
        </>
      )}

      {/* Blockquote Element */}
      {el.type === "blockquote" && (
        <BlockquoteElement
          element={el}
          activeDevice={activeDevice}
          themePalette={themePalette}
        />
      )}

      {/* Atomic Basic Elements */}
      {["headline", "paragraph", "button", "subheading", "list", "divider"].includes(el.type) && (
        <AtomicElement
          element={el}
          activeDevice={activeDevice}
          customStyles={customStyles}
        />
      )}
    </div>
  );
}
