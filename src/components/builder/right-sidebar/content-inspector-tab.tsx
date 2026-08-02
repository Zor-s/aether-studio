"use client";

import React, { useState } from "react";
import { CanvasElement } from "@/types/builder";
import CustomSelect from "./custom-select";
import {
  parseNestedListItems,
  serializeNestedListItems,
  normalizeItemLevels,
  NestedListItem,
} from "@/lib/compiler/style-utils";

function StructuredListEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (newContent: string) => void;
}) {
  const [editorMode, setEditorMode] = useState<"structured" | "text">("structured");
  const [focusTargetIndex, setFocusTargetIndex] = useState<number | null>(null);

  const items = parseNestedListItems(content);
  const displayItems = items.length > 0 ? items : [{ text: "", level: 0 }];

  const updateItems = (newItems: NestedListItem[]) => {
    const normalized = normalizeItemLevels(newItems);
    onChange(serializeNestedListItems(normalized));
  };

  const handleTextChange = (idx: number, val: string) => {
    const updated = [...displayItems];
    updated[idx] = { ...updated[idx], text: val };
    updateItems(updated);
  };

  const handleIndent = (idx: number) => {
    if (idx === 0) return;
    const updated = [...displayItems];
    updated[idx] = { ...updated[idx], level: updated[idx].level + 1 };
    setFocusTargetIndex(idx);
    updateItems(updated);
  };

  const handleOutdent = (idx: number) => {
    const updated = [...displayItems];
    updated[idx] = { ...updated[idx], level: Math.max(0, updated[idx].level - 1) };
    setFocusTargetIndex(idx);
    updateItems(updated);
  };

  const handleMoveUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...displayItems];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setFocusTargetIndex(idx - 1);
    updateItems(updated);
  };

  const handleMoveDown = (idx: number) => {
    if (idx >= displayItems.length - 1) return;
    const updated = [...displayItems];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setFocusTargetIndex(idx + 1);
    updateItems(updated);
  };

  const handleDelete = (idx: number) => {
    if (displayItems.length <= 1) {
      setFocusTargetIndex(0);
      updateItems([{ text: "", level: 0 }]);
      return;
    }
    const updated = displayItems.filter((_, i) => i !== idx);
    setFocusTargetIndex(Math.max(0, idx - 1));
    updateItems(updated);
  };

  const handleAddItem = (afterIdx: number) => {
    const parentLevel = displayItems[afterIdx] ? displayItems[afterIdx].level : 0;
    const updated = [...displayItems];
    const newIdx = afterIdx + 1;
    updated.splice(newIdx, 0, { text: "", level: parentLevel });
    setFocusTargetIndex(newIdx);
    updateItems(updated);
  };

  const handleAddMainItem = (afterIdx: number) => {
    const updated = [...displayItems];
    const newIdx = Math.max(0, afterIdx + 1);
    updated.splice(newIdx, 0, { text: "", level: 0 });
    setFocusTargetIndex(newIdx);
    updateItems(updated);
  };

  const handleAddSubItem = (afterIdx: number) => {
    const parentLevel = displayItems[afterIdx] ? displayItems[afterIdx].level : 0;
    const updated = [...displayItems];
    const newIdx = Math.max(0, afterIdx + 1);
    updated.splice(newIdx, 0, { text: "", level: parentLevel + 1 });
    setFocusTargetIndex(newIdx);
    updateItems(updated);
  };

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-foreground">Interactive List Items & Sub-Bullets</label>
        <button
          type="button"
          onClick={() => setEditorMode(editorMode === "structured" ? "text" : "structured")}
          className="text-[9px] font-semibold text-cyan-active hover:underline cursor-pointer"
        >
          {editorMode === "structured" ? "Bulk Text Mode" : "Structured Rows"}
        </button>
      </div>

      {editorMode === "text" ? (
        <div className="flex flex-col gap-xs">
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
            className="w-full text-xs p-sm bg-background border border-panel-border rounded-lg text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active transition-all duration-200 resize-none font-mono"
            placeholder="Item 1&#10;  Sub-item A (2 spaces)&#10;Item 2"
          />
          <span className="text-[9px] text-text-muted">Tip: Indent lines with 2 spaces or Tab to create sub-bullets.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-xs border border-panel-border/40 rounded-xl p-xs bg-background/20">
          <div className="flex flex-col gap-xs max-h-[280px] overflow-y-auto pr-xs">
            {displayItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-xs p-[4px] bg-background/50 border border-panel-border/30 hover:border-panel-border/80 rounded-lg group transition-all"
              >
                {/* Left Section: Level Indent, Badge, Symbol & Input */}
                <div
                  style={{ paddingLeft: `${item.level * 12}px` }}
                  className="flex items-center gap-xs flex-1 min-w-0"
                >
                  <span className="px-[4px] py-[1px] text-[8px] font-mono font-bold bg-panel border border-panel-border text-cyan-active rounded shrink-0">
                    L{item.level}
                  </span>
                  <div className="shrink-0 flex items-center justify-center w-3 text-[9px] font-mono text-text-muted opacity-80">
                    {item.level === 0 ? "•" : item.level === 1 ? "◦" : "▪"}
                  </div>
                  <input
                    type="text"
                    ref={(el) => {
                      if (el && focusTargetIndex === idx) {
                        el.focus();
                        setFocusTargetIndex(null);
                      }
                    }}
                    value={item.text}
                    onChange={(e) => handleTextChange(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddItem(idx);
                      } else if (e.key === "Tab") {
                        e.preventDefault();
                        if (e.shiftKey) {
                          handleOutdent(idx);
                        } else {
                          handleIndent(idx);
                        }
                      } else if (e.key === "Backspace" && item.text === "") {
                        if (item.level > 0) {
                          e.preventDefault();
                          handleOutdent(idx);
                        } else if (displayItems.length > 1) {
                          e.preventDefault();
                          handleDelete(idx);
                        }
                      }
                    }}
                    placeholder={item.level === 0 ? "List item..." : "Sub-bullet item..."}
                    className="flex-1 min-w-0 h-7 px-xs text-xs bg-background border border-panel-border rounded text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active"
                  />
                </div>

                {/* Right Section: Fixed Column Action Buttons */}
                <div className="flex items-center gap-[2px] opacity-80 group-hover:opacity-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOutdent(idx)}
                    disabled={item.level === 0}
                    className="w-5 h-6 text-[10px] font-bold bg-panel border border-panel-border rounded hover:border-cyan-active disabled:opacity-30 disabled:cursor-not-allowed text-foreground flex items-center justify-center cursor-pointer"
                    title="Outdent (Move left)"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIndent(idx)}
                    disabled={idx === 0}
                    className="w-5 h-6 text-[10px] font-bold bg-panel border border-panel-border rounded hover:border-cyan-active disabled:opacity-30 disabled:cursor-not-allowed text-foreground flex items-center justify-center cursor-pointer"
                    title="Indent (Create sub-bullet)"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="w-5 h-6 text-[9px] bg-panel border border-panel-border rounded hover:border-cyan-active disabled:opacity-30 disabled:cursor-not-allowed text-foreground flex items-center justify-center cursor-pointer"
                    title="Move item up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === displayItems.length - 1}
                    className="w-5 h-6 text-[9px] bg-panel border border-panel-border rounded hover:border-cyan-active disabled:opacity-30 disabled:cursor-not-allowed text-foreground flex items-center justify-center cursor-pointer"
                    title="Move item down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="w-5 h-6 text-[10px] text-red-400 hover:text-red-600 bg-panel border border-panel-border rounded hover:border-red-500 flex items-center justify-center cursor-pointer"
                    title="Delete item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-xs mt-xs border-t border-panel-border/30 pt-xs">
            <button
              type="button"
              onClick={() => handleAddMainItem(displayItems.length - 1)}
              className="flex-1 h-7 text-[10px] font-semibold bg-panel border border-panel-border hover:border-cyan-active text-foreground rounded transition-all flex items-center justify-center gap-xs cursor-pointer"
            >
              + Add Main Item
            </button>
            <button
              type="button"
              onClick={() => handleAddSubItem(displayItems.length - 1)}
              className="flex-1 h-7 text-[10px] font-semibold bg-cyan-active/10 border border-cyan-active/30 text-cyan-active hover:bg-cyan-active hover:text-white rounded transition-all flex items-center justify-center gap-xs cursor-pointer"
            >
              + Add Sub-Bullet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
  const isGridColumn = selectedElement.parentId && canvasElements.some(parent => parent.id === selectedElement.parentId && parent.type === "grid-2");

  return (
    <div className="flex flex-col gap-md">
      {/* Parent Container Selector */}
      {!["section"].includes(selectedElement.type) && !isGridColumn && (
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
          <span className="text-[9px] text-text-muted mt-[4px] leading-relaxed">
            Choose a section or container block to nest this component inside.
          </span>
        </div>
      )}

      {/* Content Editor */}
      {selectedElement.type === "list" ? (
        <StructuredListEditor
          content={selectedElement.content}
          onChange={(newVal) => handleContentChange("content", newVal)}
        />
      ) : (
        !["section", "container", "grid-2"].includes(selectedElement.type) && (
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
        )
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

      {/* Link URLs & Options (Visible on buttons) */}
      {["button"].includes(selectedElement.type) && (
        <div className="flex flex-col gap-sm border-t border-panel-border/30 pt-sm">
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

          <div className="flex flex-col gap-xs">
            <label className="text-xs font-bold text-foreground">Link Target Window</label>
            <CustomSelect
              value={selectedElement.linkTarget || "_self"}
              onChange={(val) => handleContentChange("linkTarget", val)}
              options={[
                { value: "_self", label: "Same Tab (_self)" },
                { value: "_blank", label: "New Tab / Window (_blank)" },
              ]}
            />
            <span className="text-[9px] text-text-muted">
              Choose whether clicking the action button opens the URL in the current tab or a new tab.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
