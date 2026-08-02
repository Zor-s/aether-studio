"use client";

import React, { useState, useEffect } from "react";
import {
  Header,
  LeftSidebar,
  RightSidebar,
  WorkspaceCanvas,
  DashboardNavbar,
  ToastContainer,
} from "@/components/builder";
import { useToast } from "@/hooks/use-toast";
import { useCanvasState } from "@/hooks/use-canvas-state";
import { usePublishState } from "@/hooks/use-publish-state";
import { useSyncState } from "@/hooks/use-sync-state";
import { PublishModal } from "./_components/publish-modal";
import { ViewHtmlModal } from "./_components/view-html-modal";

import { PageSettings } from "@/types/builder";

export default function DashboardPage() {
  const { toasts, showToast, removeToast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    let activeTheme: "light" | "dark" = "light";
    if (storedTheme === "dark" || storedTheme === "light") {
      activeTheme = storedTheme;
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      activeTheme = prefersDark ? "dark" : "light";
    }
    // Set theme asynchronously to avoid synchronous cascading renders warning
    setTimeout(() => {
      setTheme(activeTheme);
    }, 0);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Global Page Settings State
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    seoTitle: "Alex Mercer Portfolio",
    seoDescription: "Lead Software Architect and Developer based in San Francisco.",
    customJs: "",
    faviconUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop",
    themePalette: {
      iceBlue: "#d4f0fc",
      skyBlue: "#89d6fb",
      cyanActive: "#02a9f7",
      deepTeal: "#02577a",
      darkSlate: "#01303f",
    },
    backgroundColor: "#ffffff",
    textColor: "#01303f",
    fontFamily: "Inter",
    widthMode: "boxed-md",
    padding: "space-lg",
    gap: "space-lg",
  });

  const handleUpdatePageSettings = (updates: Partial<PageSettings>) => {
    setPageSettings((prev) => ({ ...prev, ...updates }));
  };

  const {
    activeDevice,
    setActiveDevice,
    selectedElement,
    setSelectedElement,
    previewMode,
    setPreviewMode,
    sidebarOpen,
    setSidebarOpen,
    activeMobileDrawerTab,
    setActiveMobileDrawerTab,
    canvasElements,
    setCanvasElements,
    history,
    historyIndex,
    initializeHistory,
    handleUndo,
    handleRedo,
    handleJumpToHistoryStep,
    handleSelectElement,
    handleUpdateElement,
    handleAddElement,
    handleDeleteElement,
    handleRenameElement,
    handleDuplicateElement,
    handleMoveElement,
    handleReorderElements,
  } = useCanvasState(showToast, pageSettings.themePalette);

  // Sync state across storage & BroadcastChannel
  useSyncState({
    canvasElements,
    setCanvasElements,
    initializeHistory,
    pageSettings,
    setPageSettings,
    showToast,
  });

  const {
    isPublishing,
    setIsPublishing,
    publishStep,
    setPublishStep,
    copied,
    setCopied,
    compiledHtml,
    viewHtmlOpen,
    setViewHtmlOpen,
    handlePublish,
  } = usePublishState(showToast);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* Visual Workspace Top Header */}
      <Header
        theme={theme}
        onThemeToggle={handleThemeToggle}
        activeDevice={activeDevice}
        setActiveDevice={setActiveDevice}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        onUndo={handleUndo}
        onRedo={handleRedo}
        undoDisabled={historyIndex === 0}
        redoDisabled={historyIndex === history.length - 1}
        onPublish={() => handlePublish(canvasElements, pageSettings)}
        onMenuToggle={() => setSidebarOpen(true)}
        historyIndex={historyIndex}
        historyLength={history.length}
        historyList={history}
        onJumpToHistoryStep={handleJumpToHistoryStep}
      />

      {/* Editor Body Wrapper */}
      <div className="flex flex-row flex-1 overflow-hidden relative">
        {/* Left Component Registry Sidebar (Hidden on mobile/tablet viewports) */}
        {!previewMode && (
          <div className="hidden md:flex">
            <LeftSidebar
              onAddElement={handleAddElement}
              canvasElements={canvasElements}
              selectedElementId={selectedElement?.id || null}
              onSelectElement={(id) => {
                const element = canvasElements.find((item) => item.id === id);
                if (element) handleSelectElement(element);
              }}
              onRenameElement={handleRenameElement}
              onDuplicateElement={handleDuplicateElement}
              onMoveElement={handleMoveElement}
            />
          </div>
        )}

        {/* Center Drag & Drop Workspace Canvas */}
        <WorkspaceCanvas
          activeDevice={activeDevice}
          selectedElementId={selectedElement?.id || null}
          setSelectedElementId={(id) => {
            const el = canvasElements.find((item) => item.id === id);
            setSelectedElement(el || null);
          }}
          previewMode={previewMode}
          canvasElements={canvasElements}
          onSelectElement={handleSelectElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onMoveElement={handleMoveElement}
          onReorderElements={handleReorderElements}
          pageSettings={pageSettings}
        />

        {/* Right Style Inspector Sidebar (Hidden on small viewports) */}
        {!previewMode && (
          <div className="hidden lg:flex">
            <RightSidebar
              activeDevice={activeDevice}
              selectedElement={selectedElement}
              onUpdateElement={handleUpdateElement}
              pageSettings={pageSettings}
              onUpdatePageSettings={handleUpdatePageSettings}
              onShowToast={showToast}
              onDeselect={() => setSelectedElement(null)}
              canvasElements={canvasElements}
            />
          </div>
        )}

        {/* Mobile Slide-out sidebar drawer (LeftSidebar and RightSidebar combined) */}
        <DashboardNavbar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
          {/* Drawer tab selector */}
          <div className="flex border-b border-panel-border shrink-0 bg-background p-sm">
            <button
              onClick={() => setActiveMobileDrawerTab("blocks")}
              className={`flex-1 py-xs rounded-md text-xs font-bold transition-all duration-200 ${
                activeMobileDrawerTab === "blocks"
                  ? "bg-panel text-cyan-active shadow-sm"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              Add Blocks
            </button>
            <button
              onClick={() => setActiveMobileDrawerTab("styles")}
              className={`flex-1 py-xs rounded-md text-xs font-bold transition-all duration-200 ${
                activeMobileDrawerTab === "styles"
                  ? "bg-panel text-cyan-active shadow-sm"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              Inspect styles
            </button>
          </div>

          {/* Drawer Panel Container */}
          <div className="flex-1 overflow-hidden flex flex-col bg-panel">
            {activeMobileDrawerTab === "blocks" ? (
              <div className="flex-1 flex flex-col overflow-hidden [&>aside]:border-r-0 [&>aside]:w-full">
                <LeftSidebar
                  onAddElement={(elId) => {
                    handleAddElement(elId);
                    setSidebarOpen(false); // Auto close drawer on insert
                  }}
                  canvasElements={canvasElements}
                  selectedElementId={selectedElement?.id || null}
                  onSelectElement={(id) => {
                    const element = canvasElements.find((item) => item.id === id);
                    if (element) handleSelectElement(element);
                  }}
                  onRenameElement={handleRenameElement}
                  onDuplicateElement={handleDuplicateElement}
                  onMoveElement={handleMoveElement}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden [&>aside]:border-l-0 [&>aside]:w-full">
                <RightSidebar
                  activeDevice={activeDevice}
                  selectedElement={selectedElement}
                  onUpdateElement={handleUpdateElement}
                  pageSettings={pageSettings}
                  onUpdatePageSettings={handleUpdatePageSettings}
                  onShowToast={showToast}
                  onDeselect={() => setSelectedElement(null)}
                  canvasElements={canvasElements}
                />
              </div>
            )}
          </div>
        </DashboardNavbar>
      </div>

      {/* Publishing Modal Overlay */}
      {isPublishing && (
        <PublishModal
          publishStep={publishStep}
          copied={copied}
          onCopyLink={() => {
            navigator.clipboard.writeText("https://alexmercer.aether.studio");
            setCopied(true);
            showToast("Copied deployment URL to clipboard!", "success");
            setTimeout(() => setCopied(false), 2000);
          }}
          onViewHtml={() => setViewHtmlOpen(true)}
          onClose={() => {
            setIsPublishing(false);
            setPublishStep(0);
          }}
        />
      )}

      {/* View HTML Code Modal Overlay */}
      {viewHtmlOpen && (
        <ViewHtmlModal
          compiledHtml={compiledHtml}
          onCopyCode={() => {
            navigator.clipboard.writeText(compiledHtml);
            showToast("Copied full HTML payload to clipboard!", "success");
          }}
          onClose={() => setViewHtmlOpen(false)}
        />
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
