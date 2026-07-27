import React from "react";
import Link from "next/link";
import { CanvasElement } from "@/types/builder";
import HeaderViewportControls from "./header-viewport-controls";
import HeaderActionButtons from "./header-action-buttons";

interface HeaderProps {
  activeDevice: "desktop" | "tablet" | "mobile";
  setActiveDevice: (device: "desktop" | "tablet" | "mobile") => void;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  undoDisabled?: boolean;
  redoDisabled?: boolean;
  onPublish?: () => void;
  onMenuToggle?: () => void;
  historyIndex?: number;
  historyLength?: number;
  historyList?: CanvasElement[][];
  onJumpToHistoryStep?: (index: number) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export default function Header({
  activeDevice,
  setActiveDevice,
  previewMode,
  setPreviewMode,
  onUndo = () => {},
  onRedo = () => {},
  undoDisabled = false,
  redoDisabled = false,
  onPublish = () => {},
  onMenuToggle = () => {},
  historyIndex = 0,
  historyLength = 1,
  historyList = [],
  onJumpToHistoryStep = () => {},
  theme,
  onThemeToggle,
}: HeaderProps) {
  return (
    <header className="h-header-h border-b border-panel-border bg-panel flex items-center justify-between px-md shrink-0 select-none z-30 transition-colors duration-200">
      {/* Brand & Mobile Menu toggle */}
      <div className="flex items-center gap-sm">
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden p-xs rounded-lg text-text-muted hover:bg-accent-soft hover:text-cyan-active transition-all duration-200 focus:outline-none cursor-pointer"
          title="Toggle Sidebar Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-xs">
          <Link href="/dashboard" className="flex items-center gap-xs focus:outline-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-deep-teal to-cyan-active flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg select-none">Æ</span>
            </div>
          </Link>
          <div className="hidden sm:block">
            <h1 className="text-md font-bold tracking-tight text-foreground leading-snug">Aether Studio</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest mt-[4px] font-semibold">Visual Workspace</p>
          </div>
          <div className="hidden md:flex items-center gap-xs border-l border-panel-border pl-md ml-sm">
            <Link
              href="/"
              className="text-xs font-semibold text-text-muted hover:text-cyan-active transition-colors duration-200 px-sm py-[6px] rounded-lg hover:bg-accent-soft"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-xs font-semibold text-text-muted hover:text-cyan-active transition-colors duration-200 px-sm py-[6px] rounded-lg hover:bg-accent-soft"
            >
              Architecture
            </Link>
            <Link
              href="/docs"
              className="text-xs font-semibold text-text-muted hover:text-cyan-active transition-colors duration-200 px-sm py-[6px] rounded-lg hover:bg-accent-soft"
            >
              Docs
            </Link>
            <Link
              href="/dashboard/projects"
              className="text-xs font-semibold text-text-muted hover:text-cyan-active transition-colors duration-200 px-sm py-[6px] rounded-lg hover:bg-accent-soft"
            >
              All Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Viewport controls */}
      <HeaderViewportControls
        activeDevice={activeDevice}
        setActiveDevice={setActiveDevice}
        previewMode={previewMode}
      />

      {/* Header Actions */}
      <HeaderActionButtons
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        onUndo={onUndo}
        onRedo={onRedo}
        undoDisabled={undoDisabled}
        redoDisabled={redoDisabled}
        onPublish={onPublish}
        historyIndex={historyIndex}
        historyLength={historyLength}
        historyList={historyList}
        onJumpToHistoryStep={onJumpToHistoryStep}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />
    </header>
  );
}
