"use client";

import React, { useState } from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import {
  getStyleClasses,
  getStyleProps,
  getResolvedStyles,
  mapColor,
  formatSpaceDisplay,
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

  const marginDisplay = formatSpaceDisplay(resolvedStyles.margin);
  const paddingDisplay = formatSpaceDisplay(resolvedStyles.padding);

  const isFirstRootElement =
    !el.parentId &&
    canvasElements.filter((item) => !item.parentId).findIndex((item) => item.id === el.id) === 0;

  const isTopEdge =
    isFirstRootElement &&
    (!resolvedStyles.margin || ["space-none", "space-xs", "space-sm"].includes(resolvedStyles.margin));

  let wrapperClasses = `group/item relative transition-all duration-200 ${
    !previewMode
      ? `cursor-pointer ${
          isSelected
            ? "outline outline-2 outline-cyan-active -outline-offset-2 z-20"
            : isHovered
              ? "outline outline-1 outline-dashed outline-cyan-active/70 -outline-offset-1 z-10"
              : ""
        }`
      : ""
  } ${styleClasses}`;

  let wrapperStyles = el.type !== "button" ? customStyles : undefined;

  if (el.type === "blockquote") {
    const variant = resolvedStyles.quoteVariant || "classic";
    const quoteLineColorVal = resolvedStyles.quoteLineColor || themePalette.cyanActive;
    const resolvedQuoteLineColor = mapColor(quoteLineColorVal, themePalette);

    wrapperStyles = normalizeBorderStyles(wrapperStyles || {});

    if (variant === "banner") {
      const alignClass = resolvedStyles.align ? "" : "text-center";
      wrapperClasses += ` ${alignClass}`;
      wrapperStyles = {
        borderTopWidth: "2px",
        borderTopStyle: "solid",
        borderTopColor: resolvedQuoteLineColor,
        borderBottomWidth: "2px",
        borderBottomStyle: "solid",
        borderBottomColor: resolvedQuoteLineColor,
        ...wrapperStyles,
      };
    } else if (variant === "callout") {
      const alignClass = resolvedStyles.align ? "" : "text-center";
      wrapperClasses += ` overflow-hidden ${alignClass}`;
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
      {/* Hover Indicator Badge */}
      {!previewMode && isHovered && !isSelected && (
        <div
          className={`absolute ${
            isTopEdge ? "top-full mt-1.5 left-0" : "-top-8 left-0"
          } flex items-center pointer-events-none z-30 select-none animate-fadeIn px-0.5`}
        >
          <div className="bg-dark-slate/90 text-white text-[10px] font-bold rounded-md shadow-md flex items-center px-2 py-[3px] gap-1.5 border border-cyan-active/40 backdrop-blur-sm">
            <span className="uppercase tracking-wide text-cyan-active">{el.type}</span>
            <span className="opacity-40 font-normal">|</span>
            <span className="font-medium text-slate-200">M: {marginDisplay}</span>
            <span className="opacity-40 font-normal">•</span>
            <span className="font-medium text-slate-200">P: {paddingDisplay}</span>
          </div>
        </div>
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
          marginDisplay={marginDisplay}
          paddingDisplay={paddingDisplay}
          isTopEdge={isTopEdge}
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
          previewMode={previewMode}
        />
      )}
    </div>
  );
}
