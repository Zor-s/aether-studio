import { useState, useCallback } from "react";
import { CanvasElement, PageSettings } from "@/types/builder";

export function usePublishState(
  showToast: (message: string, type?: "success" | "warning" | "info") => void
) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [compiledHtml, setCompiledHtml] = useState<string>("");
  const [viewHtmlOpen, setViewHtmlOpen] = useState(false);

  const handlePublish = useCallback(
    async (canvasElements: CanvasElement[], pageSettings: PageSettings) => {
      setIsPublishing(true);
      setPublishStep(1);

      try {
        const response = await fetch("/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ elements: canvasElements, pageSettings }),
        });

        const result = await response.json();
        if (result.success && result.data?.html) {
          setCompiledHtml(result.data.html);
        } else {
          showToast(
            result.error?.message || "Failed to serialize visual canvas.",
            "warning"
          );
        }
      } catch (err) {
        console.warn("Serialization endpoint failed, falling back locally:", err);
        showToast(
          "Serialization endpoint lookup failed. Using local compiler fallback.",
          "info"
        );
        try {
          const { compileLayout } = await import("@/lib/compiler");
          setCompiledHtml(compileLayout(canvasElements, pageSettings));
        } catch (compileErr) {
          console.error("Local fallback compile failed:", compileErr);
        }
      }

      setTimeout(() => {
        setPublishStep(2);
        setTimeout(() => {
          setPublishStep(3);
          setTimeout(() => {
            setPublishStep(4);
          }, 1000);
        }, 1000);
      }, 1000);
    },
    [showToast]
  );

  return {
    isPublishing,
    setIsPublishing,
    publishStep,
    setPublishStep,
    copied,
    setCopied,
    compiledHtml,
    setCompiledHtml,
    viewHtmlOpen,
    setViewHtmlOpen,
    handlePublish,
  };
}
