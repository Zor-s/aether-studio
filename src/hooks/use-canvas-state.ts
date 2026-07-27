import { useState, useEffect, useCallback } from "react";
import { CanvasElement, PageSettings } from "@/types/builder";

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
    content:
      "Lead Software Architect and Developer based in San Francisco. Building clean, high-performance web applications at edge memory scales.",
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
    type: "divider",
    category: "basic",
    content: "",
    styles: {
      margin: "space-md",
      padding: "space-none",
      borderStyle: "solid",
      borderWidth: "1",
      borderColor: "#02577a",
    },
  },
  {
    id: "el-5",
    type: "blockquote",
    category: "basic",
    content:
      "Building clean, high-performance web applications at edge memory scales.",
    styles: {
      fontSize: "text-md",
      color: "#02577a",
      margin: "space-xl",
      padding: "space-sm",
      borderRadius: "rounded-xl",
      quoteLineColor: "#02a9f7",
    },
  },
  {
    id: "el-6",
    type: "list",
    category: "basic",
    content:
      "Cloudflare Edge network integration\nOptimized server-side HTML rendering\nLightweight responsive layout controls",
    styles: {
      fontSize: "text-sm",
      color: "#02577a",
      margin: "space-md",
      padding: "space-none",
    },
  },
];

// Detects the modifier key once at module load time (mac = Meta, others = Ctrl).
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

  // History state
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

  /**
   * Synchronizes the selected element with a new history snapshot.
   * Used by handleUndo, handleRedo, and handleJumpToHistoryStep.
   */
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

  // Keyboard Shortcuts Hook/Listener
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

  const handleSelectElement = useCallback(
    (element: CanvasElement) => {
      setSelectedElement(element);
      if (window.innerWidth < 1024) {
        setActiveMobileDrawerTab("styles");
        setSidebarOpen(true);
      }
    },
    []
  );

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
        case "grid-2": {
          const colAId = `${baseId}-col-a`;
          const colBId = `${baseId}-col-b`;
          const gridShortId = baseId.slice(-4);
          newEl = {
            id: baseId,
            type: "grid-2",
            category: "layout",
            content: "",
            styles: { padding: "space-none", margin: "space-sm" },
          };
          const colA: CanvasElement = {
            id: colAId,
            parentId: baseId,
            type: "container",
            category: "layout",
            name: `Column A (Grid ${gridShortId})`,
            content: "",
            styles: { padding: "space-md", margin: "space-none" },
          };
          const colB: CanvasElement = {
            id: colBId,
            parentId: baseId,
            type: "container",
            category: "layout",
            name: `Column B (Grid ${gridShortId})`,
            content: "",
            styles: { padding: "space-md", margin: "space-none" },
          };
          const nextElements = [...canvasElements, newEl, colA, colB];
          commitChanges(nextElements);
          setSelectedElement(newEl);
          return;
        }
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
            styles: { fontSize: "text-xl", color: themePalette?.darkSlate || "#01303f", margin: "space-sm", align: "left" },
          };
          break;
        case "paragraph":
          newEl = {
            id: baseId,
            type: "paragraph",
            category: "basic",
            content:
              "This is a new text block component added from your builder elements selector. Adjust margins and sizes inside the styles panel.",
            styles: { fontSize: "text-sm", color: themePalette?.deepTeal || "#02577a", margin: "space-sm", align: "left" },
          };
          break;
        case "button":
          newEl = {
            id: baseId,
            type: "button",
            category: "basic",
            content: "Action Target Button",
            link: "#",
            styles: {
              fontSize: "text-xs",
              color: themePalette?.cyanActive || "#02a9f7",
              margin: "space-sm",
              align: "left",
              borderRadius: "rounded-md",
            },
          };
          break;
        case "subheading":
          newEl = {
            id: baseId,
            type: "subheading",
            category: "basic",
            content: "Secondary Subheading Text",
            styles: { fontSize: "text-lg", color: themePalette?.deepTeal || "#02577a", margin: "space-sm", align: "left" },
          };
          break;
        case "blockquote":
          newEl = {
            id: baseId,
            type: "blockquote",
            category: "basic",
            content:
              "This is a blockquote element representing a highlighted quote or testimonial.",
            styles: {
              fontSize: "text-md",
              color: themePalette?.deepTeal || "#02577a",
              margin: "space-md",
              padding: "space-sm",
              quoteLineColor: themePalette?.cyanActive || "#02a9f7",
              quoteVariant: "classic",
            },
          };
          break;
        case "list":
          newEl = {
            id: baseId,
            type: "list",
            category: "basic",
            content:
              "List item bullet point one\nList item bullet point two\nList item bullet point three",
            styles: { fontSize: "text-sm", color: themePalette?.deepTeal || "#02577a", margin: "space-sm" },
          };
          break;
        case "divider":
          newEl = {
            id: baseId,
            type: "divider",
            category: "basic",
            content: "",
            styles: { margin: "space-md", borderStyle: "solid", borderWidth: "1", borderColor: themePalette?.cyanActive || "#02a9f7" },
          };
          break;
        default:
          return;
      }

      const nextElements = [...canvasElements, newEl];
      commitChanges(nextElements);
      setSelectedElement(newEl);
    },
    [canvasElements, commitChanges, themePalette]
  );

  const handleDeleteElement = useCallback(
    (id: string) => {
      const deletedIds = new Set([id]);
      let foundDescendant = true;

      while (foundDescendant) {
        foundDescendant = false;
        canvasElements.forEach((element) => {
          if (element.parentId && deletedIds.has(element.parentId) && !deletedIds.has(element.id)) {
            deletedIds.add(element.id);
            foundDescendant = true;
          }
        });
      }

      const nextElements = canvasElements.filter((element) => !deletedIds.has(element.id));
      commitChanges(nextElements);
      if (selectedElement && deletedIds.has(selectedElement.id)) {
        setSelectedElement(null);
      }
    },
    [canvasElements, selectedElement, commitChanges]
  );

  const handleRenameElement = useCallback(
    (id: string, name: string) => {
      const updated = canvasElements.map((element) =>
        element.id === id ? { ...element, name } : element
      );
      commitChanges(updated);

      if (selectedElement?.id === id) {
        setSelectedElement((current) => (current ? { ...current, name } : current));
      }
    },
    [canvasElements, selectedElement, commitChanges]
  );

  const handleDuplicateElement = useCallback(
    (id: string) => {
      const elementMap = new Map(canvasElements.map((el) => [el.id, el]));
      const getDescendants = (parentId: string): CanvasElement[] => {
        const result: CanvasElement[] = [];
        canvasElements.forEach((el) => {
          if (el.parentId === parentId) {
            result.push(el);
            result.push(...getDescendants(el.id));
          }
        });
        return result;
      };

      const original = elementMap.get(id);
      if (!original) return;

      const targetIdx = canvasElements.findIndex((el) => el.id === id);
      if (targetIdx === -1) return;

      const cloneIdMap = new Map<string, string>();
      const timestamp = Date.now();
      let cloneCounter = 0;

      const cloneElement = (el: CanvasElement, newParentId?: string): CanvasElement => {
        const newId = `el-${timestamp}-${cloneCounter++}`;
        cloneIdMap.set(el.id, newId);
        return {
          ...el,
          id: newId,
          parentId: newParentId,
          name: el.id === id ? (el.name ? `${el.name} copy` : undefined) : el.name,
          styles: {
            ...el.styles,
            mobile: el.styles.mobile ? { ...el.styles.mobile } : undefined,
            tablet: el.styles.tablet ? { ...el.styles.tablet } : undefined,
          },
        };
      };

      const elementsToClone = [original, ...getDescendants(id)];
      const clonedElements: CanvasElement[] = [];

      // First pass: clone elements and populate cloneIdMap
      elementsToClone.forEach((el) => {
        const newParentId =
          el.id !== id && el.parentId ? cloneIdMap.get(el.parentId) : el.parentId;
        clonedElements.push(cloneElement(el, newParentId));
      });

      const nextElements = [...canvasElements];
      nextElements.splice(targetIdx + 1, 0, ...clonedElements);
      commitChanges(nextElements);
      setSelectedElement(clonedElements[0]);
    },
    [canvasElements, commitChanges]
  );

  const handleMoveElement = useCallback(
    (id: string, direction: "up" | "down") => {
      const idx = canvasElements.findIndex((el) => el.id === id);
      if (idx === -1) return;

      const element = canvasElements[idx];
      const siblingIndexes = canvasElements
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.parentId === element.parentId)
        .map(({ index }) => index);
      const siblingPosition = siblingIndexes.indexOf(idx);
      const nextSiblingPosition = direction === "up" ? siblingPosition - 1 : siblingPosition + 1;
      const newIdx = siblingIndexes[nextSiblingPosition];
      if (newIdx === undefined) return;

      const nextElements = [...canvasElements];
      const [moved] = nextElements.splice(idx, 1);
      nextElements.splice(newIdx, 0, moved);
      commitChanges(nextElements);
    },
    [canvasElements, commitChanges]
  );

  const handleReorderElements = useCallback(
    (sourceId: string, targetId: string) => {
      const sourceIdx = canvasElements.findIndex((el) => el.id === sourceId);
      const targetIdx = canvasElements.findIndex((el) => el.id === targetId);
      if (sourceIdx === -1 || targetIdx === -1) return;
      if (canvasElements[sourceIdx].parentId !== canvasElements[targetIdx].parentId) return;

      const nextElements = [...canvasElements];
      const [moved] = nextElements.splice(sourceIdx, 1);
      nextElements.splice(targetIdx, 0, moved);

      commitChanges(nextElements);
      showToast("Reordered elements on canvas", "info");
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
