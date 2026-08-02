"use client";

import React from "react";
import { CanvasElement } from "@/types/builder";

interface CanvasSelectionOverlayProps {
  element: CanvasElement;
  isGridColumn: boolean;
  onMoveElement: (id: string, direction: "up" | "down") => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  setSelectedElementId: (id: string | null) => void;
  marginDisplay: string;
  paddingDisplay: string;
  isTopEdge?: boolean;
}

export default function CanvasSelectionOverlay({
  element,
  isGridColumn,
  onMoveElement,
  onDuplicateElement,
  onDeleteElement,
  setSelectedElementId,
  marginDisplay,
  paddingDisplay,
  isTopEdge = false,
}: CanvasSelectionOverlayProps) {
  return (
    <div
      className={`absolute ${
        isTopEdge ? "top-full mt-1.5 left-0 right-0" : "-top-8 left-0 right-0"
      } flex items-center justify-between pointer-events-none z-30 select-none animate-fadeIn px-0.5`}
    >
      {/* Left Badge: Element Type & Margin/Padding Indicator */}
      <div className="bg-cyan-active text-white text-[10px] font-bold rounded-md shadow-md flex items-center px-2 py-[3px] gap-1.5 border border-white/20 pointer-events-auto">
        <span className="uppercase tracking-wide">{element.type}</span>
        <span className="opacity-40 font-normal">|</span>
        <span className="font-medium opacity-95">M: {marginDisplay}</span>
        <span className="opacity-40 font-normal">•</span>
        <span className="font-medium opacity-95">P: {paddingDisplay}</span>
      </div>

      {/* Right Action Toolbar */}
      <div className="bg-cyan-active text-white text-[10px] font-bold rounded-md shadow-md flex items-center px-1 py-[3px] gap-0.5 border border-white/20 pointer-events-auto ml-auto">
        {/* Move Up */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoveElement(element.id, "up");
          }}
          className="p-[3px] hover:bg-white/20 rounded transition-colors cursor-pointer"
          title="Move Up"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        {/* Move Down */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoveElement(element.id, "down");
          }}
          className="p-[3px] hover:bg-white/20 rounded transition-colors cursor-pointer"
          title="Move Down"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {/* Duplicate */}
        {!isGridColumn && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateElement(element.id);
            }}
            className="p-[3px] hover:bg-white/20 rounded transition-colors cursor-pointer"
            title="Duplicate Element"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              <rect x="9" y="9" width="11" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} />
            </svg>
          </button>
        )}
        {/* Delete */}
        {!isGridColumn && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteElement(element.id);
              setSelectedElementId(null);
            }}
            className="p-[3px] hover:bg-red-500 rounded transition-colors cursor-pointer"
            title="Delete Element"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
