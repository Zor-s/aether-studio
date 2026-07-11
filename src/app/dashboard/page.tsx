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
import type { CanvasElement, Toast } from "@/components/builder";

const INITIAL_ELEMENTS: CanvasElement[] = [
  {
    id: "el-1",
    type: "headline",
    category: "basic",
    content: "Alex Mercer",
    styles: {
      fontSize: "text-3xl",
      color: "#01303f",
      margin: "space-sm",
      padding: "space-none",
      align: "center",
    },
  },
  {
    id: "el-2",
    type: "paragraph",
    category: "basic",
    content: "Lead Software Architect and Developer based in San Francisco. Building clean, high-performance web applications at edge memory scales.",
    styles: {
      fontSize: "text-md",
      color: "#02577a",
      margin: "space-md",
      padding: "space-none",
      align: "center",
    },
  },
  {
    id: "el-3",
    type: "button",
    category: "basic",
    content: "View Work Portfolio",
    link: "https://github.com/alex-mercer",
    styles: {
      fontSize: "text-xs",
      color: "#02a9f7",
      margin: "space-lg",
      padding: "space-none",
      align: "center",
      borderRadius: "rounded-lg",
    },
  },
  {
    id: "el-4",
    type: "image",
    category: "media",
    content: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
    styles: {
      margin: "space-xl",
      padding: "space-none",
      borderRadius: "rounded-2xl",
    },
  },
  {
    id: "el-5",
    type: "contact-form",
    category: "forms",
    content: "Form Contact Element",
    styles: {
      margin: "space-xl",
      padding: "space-none",
      borderRadius: "rounded-2xl",
    },
  },
  {
    id: "el-6",
    type: "turnstile",
    category: "forms",
    content: "Bot Protection",
    styles: {
      margin: "space-md",
      padding: "space-none",
    },
  },
];

export default function DashboardPage() {
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMobileDrawerTab, setActiveMobileDrawerTab] = useState<"blocks" | "styles">("blocks");

  // Toast System State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global Page Settings State
  const [pageSettings, setPageSettings] = useState({
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
  });

  const handleUpdatePageSettings = (updates: Partial<typeof pageSettings>) => {
    setPageSettings((prev) => ({ ...prev, ...updates }));
  };

  // Publishing simulation state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState(0); // 0: inactive, 1: serialization, 2: R2 upload, 3: cache invalidate, 4: live
  const [copied, setCopied] = useState(false);
  
  // Undo/Redo history buffers
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>(INITIAL_ELEMENTS);
  const [history, setHistory] = useState<CanvasElement[][]>([INITIAL_ELEMENTS]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Helper to commit state changes and log history
  const commitChanges = (newElements: CanvasElement[]) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    setHistory([...nextHistory, newElements]);
    setHistoryIndex(nextHistory.length);
    setCanvasElements(newElements);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCanvasElements(history[prevIndex]);
      // Sync selected element reference
      if (selectedElement) {
        const synced = history[prevIndex].find((el) => el.id === selectedElement.id);
        setSelectedElement(synced || null);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setCanvasElements(history[nextIndex]);
      // Sync selected element reference
      if (selectedElement) {
        const synced = history[nextIndex].find((el) => el.id === selectedElement.id);
        setSelectedElement(synced || null);
      }
    }
  };

  // Select canvas component handler
  const handleSelectElement = (element: CanvasElement) => {
    setSelectedElement(element);
    // On small screens, automatically switch drawer to style tab and open it
    if (window.innerWidth < 1024) {
      setActiveMobileDrawerTab("styles");
      setSidebarOpen(true);
    }
  };

  // Update canvas component styling/content handler
  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    const updated = canvasElements.map((el) => {
      if (el.id === id) {
        const item = { ...el, ...updates };
        // Sync selectedElement copy
        setSelectedElement(item);
        return item;
      }
      return el;
    });
    commitChanges(updated);
  };

  // Add new component from registry picker
  const handleAddElement = (elementId: string) => {
    // Generate a beautiful initial template component matching constraints
    let newEl: CanvasElement;
    const baseId = `el-${Date.now()}`;

    switch (elementId) {
      case "section":
        newEl = {
          id: baseId,
          type: "section",
          category: "layout",
          content: "",
          styles: { padding: "space-md", margin: "space-sm" },
        };
        break;
      case "grid-2":
        newEl = {
          id: baseId,
          type: "grid-2",
          category: "layout",
          content: "",
          styles: { padding: "space-md", margin: "space-sm" },
        };
        break;
      case "container":
        newEl = {
          id: baseId,
          type: "container",
          category: "layout",
          content: "",
          styles: { padding: "space-md", margin: "space-sm" },
        };
        break;
      case "headline":
        newEl = {
          id: baseId,
          type: "headline",
          category: "basic",
          content: "Click to Edit Heading",
          styles: { fontSize: "text-xl", color: "#01303f", margin: "space-sm", align: "left" },
        };
        break;
      case "paragraph":
        newEl = {
          id: baseId,
          type: "paragraph",
          category: "basic",
          content: "This is a new text block component added from your builder elements selector. Adjust margins and sizes inside the styles panel.",
          styles: { fontSize: "text-sm", color: "#02577a", margin: "space-sm", align: "left" },
        };
        break;
      case "button":
        newEl = {
          id: baseId,
          type: "button",
          category: "basic",
          content: "Action Target Button",
          link: "#",
          styles: { fontSize: "text-xs", color: "#02a9f7", margin: "space-sm", align: "left", borderRadius: "rounded-md" },
        };
        break;
      case "image":
        newEl = {
          id: baseId,
          type: "image",
          category: "media",
          content: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
          styles: { margin: "space-sm", borderRadius: "rounded-lg" },
        };
        break;
      case "video":
        newEl = {
          id: baseId,
          type: "video",
          category: "media",
          content: "",
          styles: { margin: "space-sm", borderRadius: "rounded-lg" },
        };
        break;
      case "contact-form":
        newEl = {
          id: baseId,
          type: "contact-form",
          category: "forms",
          content: "",
          styles: { margin: "space-md", borderRadius: "rounded-xl" },
        };
        break;
      case "turnstile":
        newEl = {
          id: baseId,
          type: "turnstile",
          category: "forms",
          content: "",
          styles: { margin: "space-sm" },
        };
        break;
      default:
        return;
    }

    // Insert new element into canvas
    const nextElements = [...canvasElements, newEl];
    commitChanges(nextElements);
    setSelectedElement(newEl);
  };

  // Select stock asset / replace image handler
  const handleSelectAsset = (url: string) => {
    if (selectedElement && selectedElement.type === "image") {
      handleUpdateElement(selectedElement.id, { content: url });
      showToast("Updated image block with selected stock photo!", "success");
    } else {
      const baseId = `el-${Date.now()}`;
      const newEl: CanvasElement = {
        id: baseId,
        type: "image",
        category: "media",
        content: url,
        styles: { margin: "space-sm", borderRadius: "rounded-lg" },
      };
      commitChanges([...canvasElements, newEl]);
      setSelectedElement(newEl);
      showToast("Added new stock image block to canvas!", "success");
    }
  };

  // Delete element handler
  const handleDeleteElement = (id: string) => {
    const nextElements = canvasElements.filter((el) => el.id !== id);
    commitChanges(nextElements);
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
  };

  // Duplicate element handler
  const handleDuplicateElement = (id: string) => {
    const targetIdx = canvasElements.findIndex((el) => el.id === id);
    if (targetIdx === -1) return;

    const original = canvasElements[targetIdx];
    const clone: CanvasElement = {
      ...original,
      id: `el-${Date.now()}`,
      styles: { ...original.styles },
    };

    const nextElements = [...canvasElements];
    nextElements.splice(targetIdx + 1, 0, clone);
    commitChanges(nextElements);
    setSelectedElement(clone);
  };

  // Move element up/down in flow hierarchy handler
  const handleMoveElement = (id: string, direction: "up" | "down") => {
    const idx = canvasElements.findIndex((el) => el.id === id);
    if (idx === -1) return;

    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= canvasElements.length) return;

    const nextElements = [...canvasElements];
    const [moved] = nextElements.splice(idx, 1);
    nextElements.splice(newIdx, 0, moved);
    commitChanges(nextElements);
  };

  // Reorder elements via Drag & Drop handler
  const handleReorderElements = (sourceId: string, targetId: string) => {
    const sourceIdx = canvasElements.findIndex((el) => el.id === sourceId);
    const targetIdx = canvasElements.findIndex((el) => el.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const nextElements = [...canvasElements];
    const [moved] = nextElements.splice(sourceIdx, 1);
    nextElements.splice(targetIdx, 0, moved);
    
    commitChanges(nextElements);
    showToast("Reordered elements on canvas", "info");
  };

  // Publish flow simulation
  const handlePublish = () => {
    setIsPublishing(true);
    setPublishStep(1);

    setTimeout(() => {
      setPublishStep(2);
      setTimeout(() => {
        setPublishStep(3);
        setTimeout(() => {
          setPublishStep(4);
        }, 1000);
      }, 1000);
    }, 1000);
  };

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
        onPublish={handlePublish}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      {/* Editor Body Wrapper */}
      <div className="flex flex-row flex-1 overflow-hidden relative">
        {/* Left Component Registry Sidebar (Hidden on mobile/tablet viewports) */}
        {!previewMode && (
          <div className="hidden md:flex">
            <LeftSidebar
              onAddElement={handleAddElement}
              onSelectAsset={handleSelectAsset}
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
          themePalette={pageSettings.themePalette}
        />

        {/* Right Style Inspector Sidebar (Hidden on small viewports) */}
        {!previewMode && (
          <div className="hidden lg:flex">
            <RightSidebar
              selectedElement={selectedElement}
              onUpdateElement={handleUpdateElement}
              pageSettings={pageSettings}
              onUpdatePageSettings={handleUpdatePageSettings}
              onShowToast={showToast}
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
                  onSelectAsset={(url) => {
                    handleSelectAsset(url);
                    setSidebarOpen(false); // Auto close drawer on selection
                  }}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden [&>aside]:border-l-0 [&>aside]:w-full">
                <RightSidebar
                  selectedElement={selectedElement}
                  onUpdateElement={handleUpdateElement}
                  pageSettings={pageSettings}
                  onUpdatePageSettings={handleUpdatePageSettings}
                  onShowToast={showToast}
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
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                  ) : publishStep === 1 ? (
                    <span className="w-5 h-5 border-2 border-cyan-active border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-background border border-panel-border text-text-muted flex items-center justify-center">1</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col leading-none">
                  <span className={`text-xs font-bold ${publishStep >= 1 ? "text-foreground" : "text-text-muted"}`}>
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
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                  ) : publishStep === 2 ? (
                    <span className="w-5 h-5 border-2 border-cyan-active border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-background border border-panel-border text-text-muted flex items-center justify-center">2</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col leading-none">
                  <span className={`text-xs font-bold ${publishStep >= 2 ? "text-foreground" : "text-text-muted"}`}>
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
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                  ) : publishStep === 3 ? (
                    <span className="w-5 h-5 border-2 border-cyan-active border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-background border border-panel-border text-text-muted flex items-center justify-center">3</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col leading-none">
                  <span className={`text-xs font-bold ${publishStep >= 3 ? "text-foreground" : "text-text-muted"}`}>
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
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
