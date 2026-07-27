"use client";

import React, { useState } from "react";
import { CanvasElement } from "@/types/builder";

interface HeaderActionButtonsProps {
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
  onPublish: () => void;
  historyIndex: number;
  historyLength: number;
  historyList: CanvasElement[][];
  onJumpToHistoryStep: (index: number) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export default function HeaderActionButtons({
  previewMode,
  setPreviewMode,
  onUndo,
  onRedo,
  undoDisabled,
  redoDisabled,
  onPublish,
  historyIndex,
  historyLength,
  historyList,
  onJumpToHistoryStep,
  theme,
  onThemeToggle,
}: HeaderActionButtonsProps) {
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving">("synced");
  const [historyDropdownOpen, setHistoryDropdownOpen] = useState(false);

  const simulateSave = () => {
    setSyncStatus("saving");
    setTimeout(() => {
      setSyncStatus("synced");
    }, 1000);
  };

  const getHistoryActionLabel = (
    prev: CanvasElement[] | undefined,
    curr: CanvasElement[]
  ): string => {
    if (!prev) return "Initial State";

    if (curr.length > prev.length) {
      const added = curr.find((c) => !prev.some((p) => p.id === c.id));
      return added ? `Add ${added.type}` : "Add Element";
    }

    if (curr.length < prev.length) {
      const deleted = prev.find((p) => !curr.some((c) => c.id === p.id));
      return deleted ? `Delete ${deleted.type}` : "Delete Element";
    }

    const orderChanged = curr.some((c, idx) => prev[idx] && prev[idx].id !== c.id);
    if (orderChanged) {
      return "Reorder Blocks";
    }

    for (let i = 0; i < curr.length; i++) {
      const c = curr[i];
      const p = prev.find((x) => x.id === c.id);
      if (p && JSON.stringify(c) !== JSON.stringify(p)) {
        return `Edit ${c.type}`;
      }
    }

    return "Modify Page";
  };

  return (
    <div className="flex items-center gap-xs sm:gap-sm">
      {/* Undo/Redo (Hidden in preview mode) */}
      {!previewMode && (
        <div className="hidden sm:flex items-center gap-1 border-r border-panel-border pr-sm relative">
          <button
            type="button"
            onClick={() => {
              onUndo();
              simulateSave();
            }}
            disabled={undoDisabled}
            className={`p-xs rounded-lg text-text-muted hover:bg-accent-soft hover:text-foreground transition-all duration-200 ${
              undoDisabled ? "opacity-35 cursor-not-allowed hover:bg-transparent" : "cursor-pointer"
            }`}
            title="Undo Action (⌘Z / Ctrl+Z)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => {
              onRedo();
              simulateSave();
            }}
            disabled={redoDisabled}
            className={`p-xs rounded-lg text-text-muted hover:bg-accent-soft hover:text-foreground transition-all duration-200 ${
              redoDisabled ? "opacity-35 cursor-not-allowed hover:bg-transparent" : "cursor-pointer"
            }`}
            title="Redo Action (⌘Y / Ctrl+Y)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.934 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z"
              />
            </svg>
          </button>

          {historyLength > 1 && (
            <div className="relative ml-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setHistoryDropdownOpen(!historyDropdownOpen);
                }}
                className="flex items-center gap-xs text-[10px] font-bold text-text-muted hover:text-cyan-active transition-colors duration-200 bg-background/50 hover:bg-background border border-panel-border rounded-lg px-sm py-[4px] cursor-pointer"
                title="View edit history stack"
              >
                <span>
                  History ({historyIndex + 1}/{historyLength})
                </span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    historyDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {historyDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHistoryDropdownOpen(false);
                    }}
                  />
                  <div className="absolute top-[32px] right-0 bg-panel border border-panel-border rounded-xl shadow-xl z-50 flex flex-col w-[200px] overflow-hidden animate-fadeIn">
                    <div className="px-sm py-xs border-b border-panel-border bg-background/60">
                      <span className="text-[9px] font-bold text-foreground uppercase tracking-widest">
                        Workspace History
                      </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar p-xs flex flex-col gap-[2px] bg-panel">
                      {historyList.map((stateElements, idx) => {
                        const isActive = idx === historyIndex;
                        const label = getHistoryActionLabel(historyList[idx - 1], stateElements);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onJumpToHistoryStep(idx);
                              setHistoryDropdownOpen(false);
                            }}
                            className={`w-full text-left px-sm py-[6px] rounded-lg text-[10px] font-medium transition-colors cursor-pointer flex items-center justify-between ${
                              isActive
                                ? "bg-cyan-active/10 text-cyan-active font-bold"
                                : "text-foreground hover:bg-accent-soft hover:text-cyan-active"
                            }`}
                          >
                            <span className="truncate max-w-[130px]">{label}</span>
                            <span className="text-[8px] text-text-muted">#{idx + 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {!previewMode && (
        <div className="flex items-center gap-[6px] px-sm py-[6px] rounded-lg bg-background border border-panel-border">
          <span
            className={`w-[6px] h-[6px] rounded-full ${
              syncStatus === "synced" ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-bounce"
            }`}
          />
          <span className="text-[11px] font-medium text-text-muted hidden md:inline">
            {syncStatus === "synced" ? "Saved to Cloud" : "Saving Changes..."}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={onThemeToggle}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-panel-border bg-panel text-text-muted hover:bg-accent-soft hover:text-foreground transition-all duration-200 focus:outline-none cursor-pointer"
        title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {theme === "light" ? (
          <svg
            className="w-4.5 h-4.5 text-indigo-500 transition-transform duration-300 hover:rotate-45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            className="w-4.5 h-4.5 text-amber-400 transition-transform duration-300 hover:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
            />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={() => setPreviewMode(!previewMode)}
        className={`flex items-center gap-xs px-sm h-10 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
          previewMode
            ? "bg-dark-slate border-deep-teal text-white hover:bg-dark-slate/90"
            : "bg-panel border-panel-border text-text-muted hover:bg-accent-soft hover:text-foreground"
        }`}
        title={previewMode ? "Back to Workspace Editor" : "View compiled interactive preview"}
      >
        {previewMode ? (
          <>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Edit Page</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>Preview</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onPublish}
        className="flex items-center gap-xs px-sm h-10 rounded-lg text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/90 active:scale-95 shadow-md shadow-cyan-active/20 hover:shadow-cyan-active/30 transition-all duration-200 focus:outline-none cursor-pointer"
        title="Compile layout and publish to Edge Workers (Cloudflare R2)"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 10.742l-5.368-2.684L3 8l17.684-7 1.632 1.632-7 17.684-.058-.029-2.684-5.368M13.684 10.316l-3.368 3.368"
          />
        </svg>
        <span className="hidden xs:inline">Publish</span>
      </button>
    </div>
  );
}
