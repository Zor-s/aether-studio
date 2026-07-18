"use client";

import React, { useState } from "react";
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

import { PageSettings } from "@/types/builder";

export default function DashboardPage() {
  const { toasts, showToast, removeToast } = useToast();

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
  } = useCanvasState(showToast);

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
    backgroundColor: "#01303f",
    textColor: "#ffffff",
    fontFamily: "Inter",
    widthMode: "boxed-md",
    padding: "space-lg",
    gap: "space-lg",
  });

  const handleUpdatePageSettings = (updates: Partial<PageSettings>) => {
    setPageSettings((prev) => ({ ...prev, ...updates }));
  };

  // Sync state across storage & BroadcastChannel
  useSyncState({
    canvasElements,
    setCanvasElements,
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-fadeIn">
          <div className="bg-panel border border-panel-border rounded-2xl w-full max-w-[448px] shadow-2xl p-md sm:p-lg flex flex-col gap-md relative overflow-y-auto max-h-[calc(100vh-2rem)] custom-scrollbar">
            {/* Modal Header */}
            <div className="flex flex-col gap-xs">
              <h3 className="text-lg font-bold text-foreground">Publishing to Cloudflare Edge</h3>
              <p className="text-xs text-text-muted">Deploying optimized design payload globally.</p>
            </div>

            {/* Steps Container */}
            <div className="flex flex-col gap-sm my-xs">
              {/* Step 1: Serialize */}
              <div className="flex items-start gap-sm">
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-300">
                  {publishStep > 1 ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  ) : publishStep === 1 ? (
                    <span className="w-5 h-5 border-2 border-cyan-active border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-background border border-panel-border text-text-muted flex items-center justify-center">
                      1
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col leading-none">
                  <span
                    className={`text-xs font-bold ${
                      publishStep >= 1 ? "text-foreground" : "text-text-muted"
                    }`}
                  >
                    Compile Visual Canvas Layout
                  </span>
                  <span className="text-[10px] text-text-muted mt-[3px]">
                    Serializing workspace nodes to semantic HTML elements.
                  </span>
                </div>
              </div>

              {/* Step 2: Upload to R2 */}
              <div className="flex items-start gap-sm">
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-300">
                  {publishStep > 2 ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  ) : publishStep === 2 ? (
                    <span className="w-5 h-5 border-2 border-cyan-active border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-background border border-panel-border text-text-muted flex items-center justify-center">
                      2
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col leading-none">
                  <span
                    className={`text-xs font-bold ${
                      publishStep >= 2 ? "text-foreground" : "text-text-muted"
                    }`}
                  >
                    Upload Assets to Cloudflare R2
                  </span>
                  <span className="text-[10px] text-text-muted mt-[3px]">
                    Streaming bundles and HTML payload directly to object storage.
                  </span>
                </div>
              </div>

              {/* Step 3: Cache Invalidation */}
              <div className="flex items-start gap-sm">
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-300">
                  {publishStep > 3 ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  ) : publishStep === 3 ? (
                    <span className="w-5 h-5 border-2 border-cyan-active border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-background border border-panel-border text-text-muted flex items-center justify-center">
                      3
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col leading-none">
                  <span
                    className={`text-xs font-bold ${
                      publishStep >= 3 ? "text-foreground" : "text-text-muted"
                    }`}
                  >
                    Purge Edge CDN Cache Pools
                  </span>
                  <span className="text-[10px] text-text-muted mt-[3px]">
                    Invalidating global caches to reflect latest portfolio changes.
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {publishStep < 4 && (
              <div className="w-full h-1.5 bg-background border border-panel-border rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-cyan-active transition-all duration-300 ease-out"
                  style={{ width: `${(publishStep / 4) * 100}%` }}
                />
              </div>
            )}

            {/* Success Layout */}
            {publishStep === 4 && (
              <div className="flex flex-col gap-sm p-sm bg-emerald-500/5 border border-emerald-500/10 rounded-xl mt-xs animate-slideDown">
                <div className="flex items-center gap-xs text-emerald-500">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-bold">Successfully Published Live!</span>
                </div>

                {/* Deployment URL Link Card */}
                <div className="flex items-center justify-between gap-sm bg-background border border-panel-border rounded-lg p-xs pl-sm mt-xs">
                  <span className="text-xs font-semibold text-foreground truncate select-all">
                    alexmercer.aether.studio
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("https://alexmercer.aether.studio");
                      setCopied(true);
                      showToast("Copied deployment URL to clipboard!", "success");
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className={`px-sm py-xs text-[10px] font-bold rounded transition-all duration-200 cursor-pointer ${
                      copied
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/15"
                        : "bg-panel border border-panel-border text-text-muted hover:text-foreground hover:bg-accent-soft"
                    }`}
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-sm mt-xs border-t border-panel-border pt-md">
              {publishStep === 4 ? (
                <>
                  <button
                    onClick={() => {
                      setViewHtmlOpen(true);
                    }}
                    className="h-10 px-md rounded-lg text-xs font-bold text-cyan-active bg-cyan-active/10 hover:bg-cyan-active/15 flex items-center justify-center transition-all duration-200 cursor-pointer"
                  >
                    View HTML
                  </button>
                  <a
                    href="https://alexmercer.aether.studio"
                    target="_blank"
                    rel="noreferrer"
                    className="h-10 px-md rounded-lg text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/95 flex items-center justify-center shadow-md transition-all duration-200"
                  >
                    Visit Site
                  </a>
                  <button
                    onClick={() => {
                      setIsPublishing(false);
                      setPublishStep(0);
                    }}
                    className="h-10 px-md rounded-lg text-xs font-semibold border border-panel-border text-text-muted hover:bg-accent-soft hover:text-foreground transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="h-10 px-md rounded-lg text-xs font-semibold border border-panel-border text-text-muted opacity-50 cursor-not-allowed flex items-center justify-center gap-xs"
                >
                  <span className="w-3.5 h-3.5 border border-text-muted border-t-transparent rounded-full animate-spin" />
                  Deploying...
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View HTML Code Modal Overlay */}
      {viewHtmlOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-fadeIn">
          <div className="bg-panel border border-panel-border rounded-2xl w-full max-w-[672px] shadow-2xl p-md sm:p-lg flex flex-col gap-md relative overflow-hidden h-[calc(100vh-4rem)]">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-panel-border pb-md shrink-0">
              <div className="flex flex-col">
                <h3 className="text-md font-bold text-foreground">Compiled R2 HTML Build Source</h3>
                <p className="text-[11px] text-text-muted">
                  Edge-optimized static layout stream with injected Google Fonts import header.
                </p>
              </div>
              <button
                onClick={() => setViewHtmlOpen(false)}
                className="text-text-muted hover:text-foreground cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Code editor / container (Scrollable) */}
            <div className="flex-1 overflow-auto bg-dark-slate border border-panel-border/80 rounded-xl p-md font-mono text-[10px] text-cyan-active/90 select-all custom-scrollbar">
              <pre className="whitespace-pre">{compiledHtml}</pre>
            </div>

            {/* Footer controls */}
            <div className="flex justify-end items-center gap-sm border-t border-panel-border pt-md shrink-0">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(compiledHtml);
                  showToast("Copied full HTML payload to clipboard!", "success");
                }}
                className="h-9 px-md rounded-lg text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/95 flex items-center justify-center shadow-md shadow-cyan-active/15 transition-all cursor-pointer"
              >
                Copy Code
              </button>
              <button
                onClick={() => setViewHtmlOpen(false)}
                className="h-9 px-md rounded-lg text-xs font-semibold border border-panel-border text-text-muted hover:bg-accent-soft hover:text-foreground transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
