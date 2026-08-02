import { useState, useEffect, useCallback } from "react";
import { CanvasElement, PageSettings } from "@/types/builder";
import {
  deleteElementTree,
  renameElementTree,
  duplicateElementTree,
  moveElementTree,
  reorderElementsTree,
} from "@/lib/tree-utils";
import { INITIAL_ELEMENTS, createNewElement } from "@/lib/element-factory";

const isMac =
  typeof window !== "undefined" &&
  navigator.platform.toUpperCase().indexOf("MAC") >= 0;

export function useCanvasState(
  showToast: (message: string, type?: "success" | "warning" | "info") => void,
  themePalette?: PageSettings["themePalette"]
) {
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMobileDrawerTab, setActiveMobileDrawerTab] = useState<"blocks" | "styles">("blocks");

  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>(INITIAL_ELEMENTS);
  const [history, setHistory] = useState<CanvasElement[][]>([INITIAL_ELEMENTS]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const commitChanges = useCallback(
    (newElements: CanvasElement[]) => {
      const nextHistory = history.slice(0, historyIndex + 1);
      setHistory([...nextHistory, newElements]);
      setHistoryIndex(nextHistory.length);
      setCanvasElements(newElements);
    },
    [history, historyIndex]
  );

  const initializeHistory = useCallback(
    (elements: CanvasElement[]) => {
      setCanvasElements(elements);
      setHistory([elements]);
      setHistoryIndex(0);
    },
    []
  );

  const syncSelectedElement = useCallback(
    (snapshot: CanvasElement[]) => {
      if (selectedElement) {
        const synced = snapshot.find((el) => el.id === selectedElement.id);
        setSelectedElement(synced || null);
      }
    },
    [selectedElement]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCanvasElements(history[prevIndex]);
      syncSelectedElement(history[prevIndex]);
    }
  }, [historyIndex, history, syncSelectedElement]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setCanvasElements(history[nextIndex]);
      syncSelectedElement(history[nextIndex]);
    }
  }, [historyIndex, history, syncSelectedElement]);

  const handleJumpToHistoryStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < history.length) {
        setHistoryIndex(index);
        setCanvasElements(history[index]);
        syncSelectedElement(history[index]);
        showToast(`Jumped to history step #${index + 1}`, "info");
      }
    },
    [history, syncSelectedElement, showToast]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "Escape") {
        if (selectedElement) {
          e.preventDefault();
          setSelectedElement(null);
          showToast("Deselected component", "info");
        }
        return;
      }

      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
          showToast("Redone last action", "info");
        } else {
          handleUndo();
          showToast("Undone last action", "info");
        }
      } else if (modifier && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
        showToast("Redone last action", "info");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, handleUndo, handleRedo, showToast]);

  const handleSelectElement = useCallback((element: CanvasElement) => {
    setSelectedElement(element);
    if (window.innerWidth < 1024) {
      setActiveMobileDrawerTab("styles");
      setSidebarOpen(true);
    }
  }, []);

  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      const updated = canvasElements.map((el) => {
        if (el.id === id) {
          const item = { ...el, ...updates };
          setSelectedElement(item);
          return item;
        }
        return el;
      });
      commitChanges(updated);
    },
    [canvasElements, commitChanges]
  );

  const handleAddElement = useCallback(
    (elementId: string) => {
      const created = createNewElement(elementId, themePalette);
      if (!created) return;

      if (Array.isArray(created)) {
        const nextElements = [...canvasElements, ...created];
        commitChanges(nextElements);
        setSelectedElement(created[0]);
      } else {
        const nextElements = [...canvasElements, created];
        commitChanges(nextElements);
        setSelectedElement(created);
      }
    },
    [canvasElements, commitChanges, themePalette]
  );

  const handleDeleteElement = useCallback(
    (id: string) => {
      const { nextElements, deletedIds } = deleteElementTree(canvasElements, id);
      commitChanges(nextElements);
      if (selectedElement && deletedIds.has(selectedElement.id)) {
        setSelectedElement(null);
      }
    },
    [canvasElements, selectedElement, commitChanges]
  );

  const handleRenameElement = useCallback(
    (id: string, name: string) => {
      const updated = renameElementTree(canvasElements, id, name);
      commitChanges(updated);

      if (selectedElement?.id === id) {
        setSelectedElement((current) => (current ? { ...current, name } : current));
      }
    },
    [canvasElements, selectedElement, commitChanges]
  );

  const handleDuplicateElement = useCallback(
    (id: string) => {
      const { nextElements, clonedRoot } = duplicateElementTree(canvasElements, id);
      if (clonedRoot) {
        commitChanges(nextElements);
        setSelectedElement(clonedRoot);
      }
    },
    [canvasElements, commitChanges]
  );

  const handleMoveElement = useCallback(
    (id: string, direction: "up" | "down") => {
      const nextElements = moveElementTree(canvasElements, id, direction);
      if (nextElements !== canvasElements) {
        commitChanges(nextElements);
      }
    },
    [canvasElements, commitChanges]
  );

  const handleReorderElements = useCallback(
    (sourceId: string, targetId: string) => {
      const nextElements = reorderElementsTree(canvasElements, sourceId, targetId);
      if (nextElements !== canvasElements) {
        commitChanges(nextElements);
        showToast("Reordered elements on canvas", "info");
      }
    },
    [canvasElements, commitChanges, showToast]
  );

  return {
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
  };
}
