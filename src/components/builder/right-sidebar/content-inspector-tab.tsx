"use client";

import React from "react";
import { CanvasElement } from "@/types/builder";
import CustomSelect from "./custom-select";

interface ContentInspectorTabProps {
  selectedElement: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  canvasElements: CanvasElement[];
}

export default function ContentInspectorTab({
  selectedElement,
  onUpdateElement,
  canvasElements,
}: ContentInspectorTabProps) {
  const handleContentChange = (key: string, value: string) => {
    onUpdateElement(selectedElement.id, {
      [key]: value,
    });
  };

  // Helper to find all descendant IDs of a given element to prevent parenting cycles
  const getDescendantIds = (elementId: string): Set<string> => {
    const ids = new Set<string>();
    let addedNew = true;
    while (addedNew) {
      addedNew = false;
      canvasElements.forEach((el) => {
        if (el.parentId && (el.parentId === elementId || ids.has(el.parentId)) && !ids.has(el.id)) {
          ids.add(el.id);
          addedNew = true;
        }
      });
    }
    return ids;
  };

  const descendantIds = getDescendantIds(selectedElement.id);

  return (
    <div className="flex flex-col gap-md">
      {/* Parent Container Selector */}
      {!["section"].includes(selectedElement.type) && (
        <div className="flex flex-col gap-xs">
          <label className="text-xs font-bold text-foreground">Parent Container</label>
          <CustomSelect
            value={selectedElement.parentId || ""}
            onChange={(val) => handleContentChange("parentId", val)}
            options={[
              { value: "", label: "None (Root Page)" },
              ...canvasElements
                .filter(
                  (el) =>
                    ["section", "container"].includes(el.type) &&
                    el.id !== selectedElement.id &&
                    !descendantIds.has(el.id)
                )
                .map((el) => ({
                  value: el.id,
                  label: el.name || `${el.type.charAt(0).toUpperCase() + el.type.slice(1)} (${el.id.slice(0, 6)})`,
                })),
            ]}
          />
          <span className="text-[9px] text-text-muted mt-[2px] leading-relaxed">
            Choose a section or container block to nest this component inside.
          </span>
        </div>
      )}

      {/* Text area for element content */}
      {!["section", "container", "grid-2"].includes(selectedElement.type) && (
        <div className="flex flex-col gap-xs">
          <label className="text-xs font-bold text-foreground">Display Content / Label</label>
          <textarea
            value={selectedElement.content}
            onChange={(e) => handleContentChange("content", e.target.value)}
            rows={4}
            className="w-full text-xs p-sm bg-background border border-panel-border rounded-lg text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active transition-all duration-200 resize-none"
            placeholder="Enter text value..."
          />
        </div>
      )}

      {/* Layout helper info for sections/containers */}
      {["section", "container"].includes(selectedElement.type) && (
        <div className="p-sm bg-background/30 border border-panel-border rounded-lg flex flex-col gap-xs text-[10px] text-text-muted leading-relaxed">
          <span className="font-bold text-foreground">Layout Container Settings</span>
          <span>This block acts as a structural row or container wrapper. To add components inside it:</span>
          <ol className="list-decimal pl-sm flex flex-col gap-[2px]">
            <li>Select the component you want to nest (e.g. text, button, list).</li>
            <li>Go to its <span className="font-bold text-foreground">Content</span> tab.</li>
            <li>Choose this {selectedElement.type} in the <span className="font-bold text-foreground">Parent Container</span> selector.</li>
          </ol>
        </div>
      )}

      {/* Link URLs (Visible on buttons) */}
      {["button"].includes(selectedElement.type) && (
        <div className="flex flex-col gap-xs">
          <label className="text-xs font-bold text-foreground">Action Destination Link</label>
          <input
            type="text"
            value={selectedElement.link || ""}
            onChange={(e) => handleContentChange("link", e.target.value)}
            className="w-full h-10 px-sm rounded-lg border border-panel-border bg-background text-xs text-foreground placeholder-text-muted focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active transition-all duration-200"
            placeholder="https://example.com"
          />
        </div>
      )}
    </div>
  );
}
