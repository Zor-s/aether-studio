import React, { useState, useEffect } from "react";
import Link from "next/link";

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
}: HeaderProps) {
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving">("synced");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const simulateSave = () => {
    setSyncStatus("saving");
    setTimeout(() => {
      setSyncStatus("synced");
    }, 1000);
  };

  return (
    <header className="h-header-h border-b border-panel-border bg-panel flex items-center justify-between px-md shrink-0 select-none z-30 transition-colors duration-200">
      {/* Brand & Mobile Menu toggle */}
      <div className="flex items-center gap-sm">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-xs rounded-lg text-text-muted hover:bg-accent-soft hover:text-cyan-active transition-all duration-200 focus:outline-none"
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
            <h1 className="text-md font-bold tracking-tight text-foreground leading-none">Aether Studio</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest mt-[2px] font-semibold">Visual Workspace</p>
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

      {/* Responsive Device View Selector (Hidden when in previewMode) */}
      {!previewMode ? (
        <div className="flex items-center bg-background border border-panel-border rounded-lg p-[3px] shadow-inner">
          <button
            onClick={() => setActiveDevice("desktop")}
            className={`px-sm py-xs rounded-md flex items-center gap-xs text-xs font-medium transition-all duration-200 ${
              activeDevice === "desktop"
                ? "bg-panel text-cyan-active shadow-sm"
                : "text-text-muted hover:text-foreground"
            }`}
            title="Desktop View (100% width)"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setActiveDevice("tablet")}
            className={`px-sm py-xs rounded-md flex items-center gap-xs text-xs font-medium transition-all duration-200 ${
              activeDevice === "tablet"
                ? "bg-panel text-cyan-active shadow-sm"
                : "text-text-muted hover:text-foreground"
            }`}
            title="Tablet View (768px width)"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setActiveDevice("mobile")}
            className={`px-sm py-xs rounded-md flex items-center gap-xs text-xs font-medium transition-all duration-200 ${
              activeDevice === "mobile"
                ? "bg-panel text-cyan-active shadow-sm"
                : "text-text-muted hover:text-foreground"
            }`}
            title="Mobile View (375px width)"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>
      ) : (
        <div className="text-xs font-medium text-cyan-active bg-cyan-active/10 border border-cyan-active/20 px-sm py-xs rounded-lg select-none">
          Live Interactive Preview Mode
        </div>
      )}

      {/* Actions: Undo, Redo, Sync, Preview, Publish */}
      <div className="flex items-center gap-xs sm:gap-sm">
        {/* Undo/Redo (Hidden in preview mode) */}
        {!previewMode && (
          <div className="hidden sm:flex items-center gap-1 border-r border-panel-border pr-sm">
            <button
              onClick={() => {
                onUndo();
                simulateSave();
              }}
              disabled={undoDisabled}
              className={`p-xs rounded-lg text-text-muted hover:bg-accent-soft hover:text-foreground transition-all duration-200 ${
                undoDisabled ? "opacity-35 cursor-not-allowed hover:bg-transparent" : "cursor-pointer"
              }`}
              title="Undo Action"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </button>
            <button
              onClick={() => {
                onRedo();
                simulateSave();
              }}
              disabled={redoDisabled}
              className={`p-xs rounded-lg text-text-muted hover:bg-accent-soft hover:text-foreground transition-all duration-200 ${
                redoDisabled ? "opacity-35 cursor-not-allowed hover:bg-transparent" : "cursor-pointer"
              }`}
              title="Redo Action"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.934 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
              </svg>
            </button>
          </div>
        )}

        {/* Sync Status Flag (Simulated) */}
        {!previewMode && (
          <div className="flex items-center gap-[6px] px-sm py-[6px] rounded-lg bg-background border border-panel-border">
            <span className={`w-[6px] h-[6px] rounded-full ${
              syncStatus === "synced" ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-bounce"
            }`} />
            <span className="text-[11px] font-medium text-text-muted hidden md:inline">
              {syncStatus === "synced" ? "Saved to Cloud" : "Saving Changes..."}
            </span>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-panel-border bg-panel text-text-muted hover:bg-accent-soft hover:text-foreground transition-all duration-200 focus:outline-none cursor-pointer"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? (
            <svg className="w-4.5 h-4.5 text-indigo-500 transition-transform duration-300 hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-4.5 h-4.5 text-amber-400 transition-transform duration-300 hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          )}
        </button>

        {/* Preview Mode Switcher */}
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className={`flex items-center gap-xs px-sm h-10 rounded-lg text-xs font-semibold border transition-all duration-200 ${
            previewMode 
              ? "bg-dark-slate border-deep-teal text-white hover:bg-dark-slate/90" 
              : "bg-panel border-panel-border text-text-muted hover:bg-accent-soft hover:text-foreground"
          }`}
          title={previewMode ? "Back to Workspace Editor" : "View compiled interactive preview"}
        >
          {previewMode ? (
            <>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Page</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Preview</span>
            </>
          )}
        </button>

        {/* Publish CTA Button */}
        <button
          onClick={onPublish}
          className="flex items-center gap-xs px-sm h-10 rounded-lg text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/90 active:scale-95 shadow-md shadow-cyan-active/20 hover:shadow-cyan-active/30 transition-all duration-200 focus:outline-none"
          title="Compile layout and publish to Edge Workers (Cloudflare R2)"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l-5.368-2.684L3 8l17.684-7 1.632 1.632-7 17.684-.058-.029-2.684-5.368M13.684 10.316l-3.368 3.368" />
          </svg>
          <span className="hidden xs:inline">Publish</span>
        </button>
      </div>
    </header>
  );
}
