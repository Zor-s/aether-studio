"use client";

import { useMemo, useState } from "react";
import type { CanvasElement } from "./workspace-canvas";

interface ComponentTreeProps {
  canvasElements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onRenameElement: (id: string, name: string) => void;
  onDuplicateElement: (id: string) => void;
  onMoveElement: (id: string, direction: "up" | "down") => void;
}

interface ComponentTreeNodeProps extends Omit<ComponentTreeProps, "canvasElements"> {
  element: CanvasElement;
  level: number;
  childrenByParent: Map<string, CanvasElement[]>;
}

const TYPE_LABELS: Record<string, string> = {
  section: "Section",
  "grid-2": "2-column grid",
  container: "Container",
  headline: "Headline",
  paragraph: "Paragraph",
  button: "Button",
  image: "Image",
  video: "Video",
  "contact-form": "Contact form",
  turnstile: "Turnstile",
};

function getNodeName(element: CanvasElement) {
  if (element.name?.trim()) return element.name.trim();
  if (element.content?.trim()) return element.content.trim().slice(0, 32);
  return TYPE_LABELS[element.type] || "Untitled component";
}

function TypeIcon({ type }: { type: string }) {
  const isLayout = ["section", "grid-2", "container"].includes(type);

  return isLayout ? (
    <svg className="w-3.5 h-3.5 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ) : (
    <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5v14" />
    </svg>
  );
}

function TreeNode({
  element,
  level,
  childrenByParent,
  selectedElementId,
  onSelectElement,
  onRenameElement,
  onDuplicateElement,
  onMoveElement,
}: ComponentTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const children = childrenByParent.get(element.id) || [];
  const isSelected = selectedElementId === element.id;
  const nodeName = getNodeName(element);

  const beginRename = () => {
    setNameDraft(nodeName);
    setIsRenaming(true);
  };

  const saveRename = () => {
    const trimmedName = nameDraft.trim();
    if (trimmedName && trimmedName !== nodeName) {
      onRenameElement(element.id, trimmedName);
    }
    setIsRenaming(false);
  };

  return (
    <li role="none" className="relative">
      <div
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={children.length > 0 ? isExpanded : undefined}
        tabIndex={0}
        onClick={() => onSelectElement(element.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelectElement(element.id);
          }
        }}
        className={`group flex h-9 items-center gap-xs rounded-lg pr-xs text-xs transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-active ${
          isSelected
            ? "bg-cyan-active/10 text-foreground"
            : "text-text-muted hover:bg-accent-soft/60 hover:text-foreground"
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {children.length > 0 ? (
          <button
            type="button"
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${nodeName}`}
            onClick={(event) => {
              event.stopPropagation();
              setIsExpanded((expanded) => !expanded);
            }}
            className="flex w-4 h-4 items-center justify-center rounded text-text-muted hover:bg-panel hover:text-foreground"
          >
            <svg className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ) : (
          <span className="w-4" aria-hidden="true" />
        )}

        <span className="w-5 h-5 shrink-0 rounded bg-background border border-panel-border flex items-center justify-center">
          <TypeIcon type={element.type} />
        </span>

        {isRenaming ? (
          <input
            autoFocus
            value={nameDraft}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setNameDraft(event.target.value)}
            onBlur={saveRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                saveRename();
              }
              if (event.key === "Escape") setIsRenaming(false);
            }}
            className="min-w-0 flex-1 h-6 rounded border border-cyan-active bg-panel px-xs text-xs text-foreground focus:outline-none"
            aria-label={`Rename ${nodeName}`}
          />
        ) : (
          <span className="min-w-0 flex-1 truncate font-medium" title={nodeName}>{nodeName}</span>
        )}

        {!isRenaming && (
          <div className="flex items-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
            <button type="button" onClick={(event) => { event.stopPropagation(); beginRename(); }} className="w-6 h-6 flex items-center justify-center rounded hover:bg-panel" aria-label={`Rename ${nodeName}`} title="Rename">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16.862 4.487 2.651 2.651M7.5 18.75l-4.25.75.75-4.25L14.513 4.737a1.875 1.875 0 0 1 2.651 2.651L7.5 18.75Z" /></svg>
            </button>
            <button type="button" onClick={(event) => { event.stopPropagation(); onDuplicateElement(element.id); }} className="w-6 h-6 flex items-center justify-center rounded hover:bg-panel" aria-label={`Duplicate ${nodeName}`} title="Duplicate">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 0 0 2 2h6M8 7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V7Z" /></svg>
            </button>
            <button type="button" onClick={(event) => { event.stopPropagation(); onMoveElement(element.id, "up"); }} className="w-6 h-6 flex items-center justify-center rounded hover:bg-panel" aria-label={`Move ${nodeName} up`} title="Move up">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m5 15 7-7 7 7" /></svg>
            </button>
            <button type="button" onClick={(event) => { event.stopPropagation(); onMoveElement(element.id, "down"); }} className="w-6 h-6 flex items-center justify-center rounded hover:bg-panel" aria-label={`Move ${nodeName} down`} title="Move down">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m19 9-7 7-7-7" /></svg>
            </button>
          </div>
        )}
      </div>

      {children.length > 0 && isExpanded && (
        <ul role="group" className="relative before:absolute before:left-md before:top-0 before:bottom-sm before:border-l before:border-panel-border">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              element={child}
              level={level + 1}
              childrenByParent={childrenByParent}
              selectedElementId={selectedElementId}
              onSelectElement={onSelectElement}
              onRenameElement={onRenameElement}
              onDuplicateElement={onDuplicateElement}
              onMoveElement={onMoveElement}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ComponentTree(props: ComponentTreeProps) {
  const { canvasElements } = props;
  const { rootElements, childrenByParent } = useMemo(() => {
    const elementIds = new Set(canvasElements.map((element) => element.id));
    const root: CanvasElement[] = [];
    const byParent = new Map<string, CanvasElement[]>();

    canvasElements.forEach((element) => {
      if (!element.parentId || !elementIds.has(element.parentId)) {
        root.push(element);
        return;
      }
      const siblings = byParent.get(element.parentId) || [];
      siblings.push(element);
      byParent.set(element.parentId, siblings);
    });

    return { rootElements: root, childrenByParent: byParent };
  }, [canvasElements]);

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center justify-between px-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Portfolio page</span>
        <span className="rounded-full bg-accent-soft px-sm py-[2px] text-[10px] font-bold text-cyan-active">{canvasElements.length}</span>
      </div>
      {rootElements.length > 0 ? (
        <ul role="tree" aria-label="Canvas component hierarchy" className="flex flex-col gap-[2px]">
          {rootElements.map((element) => (
            <TreeNode
              key={element.id}
              element={element}
              level={0}
              childrenByParent={childrenByParent}
              selectedElementId={props.selectedElementId}
              onSelectElement={props.onSelectElement}
              onRenameElement={props.onRenameElement}
              onDuplicateElement={props.onDuplicateElement}
              onMoveElement={props.onMoveElement}
            />
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-panel-border p-lg text-center text-xs text-text-muted">
          Add a block to begin your page hierarchy.
        </div>
      )}
    </div>
  );
}
