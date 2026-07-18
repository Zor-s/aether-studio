import { useEffect, useRef } from "react";
import { CanvasElement, PageSettings } from "@/types/builder";

interface SyncStateProps {
  canvasElements: CanvasElement[];
  setCanvasElements: (elements: CanvasElement[]) => void;
  pageSettings: PageSettings;
  setPageSettings: (settings: PageSettings) => void;
  showToast: (message: string, type?: "success" | "warning" | "info") => void;
}

export function useSyncState({
  canvasElements,
  setCanvasElements,
  pageSettings,
  setPageSettings,
  showToast,
}: SyncStateProps) {
  const isInitialMount = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const localTimestampRef = useRef<number>(0);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // 1. Initialize from localStorage and set up BroadcastChannel on mount
  useEffect(() => {
    const defaultPageSettings: PageSettings = {
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
    };

    // Load from localStorage
    const savedElements = localStorage.getItem("aether_canvas_elements");
    const savedSettings = localStorage.getItem("aether_page_settings");
    const savedTimestamp = localStorage.getItem("aether_canvas_timestamp");

    if (savedElements) {
      try {
        const parsed = JSON.parse(savedElements);
        if (Array.isArray(parsed)) {
          setCanvasElements(parsed);
        } else {
          console.error("Canvas elements in localStorage is not an array");
        }
      } catch (e) {
        console.error("Failed to parse canvas elements from localStorage", e);
      }
    }

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setPageSettings({
          ...defaultPageSettings,
          ...parsed,
          themePalette: {
            ...defaultPageSettings.themePalette,
            ...(parsed.themePalette || {}),
          },
        });
      } catch (e) {
        console.error("Failed to parse page settings from localStorage", e);
      }
    }

    if (savedTimestamp) {
      localTimestampRef.current = parseInt(savedTimestamp, 10) || 0;
    }

    // Set up BroadcastChannel
    const channel = new BroadcastChannel("aether_canvas_sync");
    broadcastChannelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, elements, settings, timestamp } = event.data;
      if (type === "STATE_MUTATED" && timestamp > localTimestampRef.current) {
        localTimestampRef.current = timestamp;
        if (elements && Array.isArray(elements)) setCanvasElements(elements);
        if (settings) {
          setPageSettings({
            ...defaultPageSettings,
            ...settings,
            themePalette: {
              ...defaultPageSettings.themePalette,
              ...(settings.themePalette || {}),
            },
          });
        }
        showToast("Synchronized workspace with another active tab", "info");
      }
    };

    isInitialMount.current = false;

    return () => {
      channel.close();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [setCanvasElements, setPageSettings, showToast]);

  // 2. Debounce writing mutations to localStorage & broadcasting changes
  useEffect(() => {
    if (isInitialMount.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const timestamp = Date.now();
      localTimestampRef.current = timestamp;

      localStorage.setItem("aether_canvas_elements", JSON.stringify(canvasElements));
      localStorage.setItem("aether_page_settings", JSON.stringify(pageSettings));
      localStorage.setItem("aether_canvas_timestamp", String(timestamp));

      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: "STATE_MUTATED",
          elements: canvasElements,
          settings: pageSettings,
          timestamp,
        });
      }
    }, 100);
  }, [canvasElements, pageSettings]);
}
