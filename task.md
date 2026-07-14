# Development To-Do List

This document tracks planned fixes, feature implementations, and system improvements for Aether Studio. Contributors are encouraged to pick tasks from this list or propose new ones.

## Mandatory Workflow
- **Read Documentation First:** Before you proceed with any changes, make sure to read the `docs/` directory as it includes all the documentation for the project.

- **Report First:** Any discovered bugs or proposed features MUST be added to this list before any implementation begins.
- **Task-Driven Changes:** Do not implement any changes unless they are documented below and you have been specifically tasked to do so.
- **Scope Adherence:** Strictly apply changes only within the scope of the documented task. Do not refactor unrelated code or fix other issues unless they are critical blockers or part of the defined task.
- **Hierarchical Completion Rule:** A main task or parent subtask must **ONLY** be marked as complete `[X]` when **ALL** of its children/subtasks are also marked `[X]`. Use `[.]` for partially completed parent tasks.

---

### Legend

- `[ ]` Incomplete: No subtasks are finished.
- `[.]` Partially complete: At least one subtask is finished, but not all.
- `[X]` Complete: **ALL** subtasks and nested items are marked `[X]`.

---

### Note for AI Models (Antigravity & others)
When updating this document:
1. **Maintain Hierarchy:** Always preserve the indentation and nested structure.
2. **Propagate Status:** When you finish a subtask, check if it was the last one for its parent. If so, update the parent to `[X]`. If not, ensure the parent is `[.]`.
3. **Be Specific:** Only mark the exact subtask you worked on. Do not mark an entire feature as done unless you have verified every sub-item.
4. **Break Down Large Tasks:** If a task is complex or large, break it down into smaller, manageable subtasks within the hierarchy. For each subtask:
    - Provide a clear **Description** or **Goal**.
    - Include a **Files Involved** list (affected, added, or deleted).

---

- [X] **Codebase Refactoring & Manageability Phase**
  - **Status:** Completed. All components refactored, custom hooks extracted, and registry decoupled.
  - [X] **Feature: Shared Types Extraction (CanvasElement, PageSettings, Toast)**
    - **Goal:** Unify duplicate type definitions (`CanvasElement`, `PageSettings`, `Toast`) from `workspace-canvas.tsx`, `compiler.ts`, `right-sidebar.tsx`, `toast.tsx`, and `page.tsx` into a single, clean shared file.
    - **Files Involved:**
      - `src/types/builder.ts` [NEW]
      - `src/components/builder/workspace-canvas.tsx` [MODIFY]
      - `src/components/builder/right-sidebar.tsx` [MODIFY]
      - `src/components/builder/header.tsx` [MODIFY]
      - `src/components/builder/left-sidebar.tsx` [MODIFY]
      - `src/components/builder/component-tree.tsx` [MODIFY]
      - `src/components/builder/toast.tsx` [MODIFY]
      - `src/components/builder/index.ts` [MODIFY]
      - `src/lib/compiler/compiler.ts` [MODIFY]
      - `src/app/dashboard/page.tsx` [MODIFY]
      - `src/app/api/publish/route.ts` [MODIFY]
  - [X] **Feature: State Management & Custom Hooks Extraction**
    - **Goal:** Extract state management, event listeners, and BroadcastChannel/KV syncing logic from `src/app/dashboard/page.tsx` into clean custom hooks (`useCanvasState`, `useSyncState`, `usePublishState`, `useToast`).
    - **Files Involved:**
      - `src/hooks/use-canvas-state.ts` [NEW]
      - `src/hooks/use-sync-state.ts` [NEW]
      - `src/hooks/use-publish-state.ts` [NEW]
      - `src/hooks/use-toast.ts` [NEW]
      - `src/app/dashboard/page.tsx` [MODIFY]
  - [X] **Feature: Component Registry & Mockup Decoupling**
    - **Goal:** Extract component schemas (`REGISTRY_ELEMENTS`), asset search datasets, graphic previews (`getElementPreviewMockup`), and popover style animations out of `left-sidebar.tsx` and place them in modular registry modules.
    - **Files Involved:**
      - `src/components/registry/registry-elements.tsx` [NEW]
      - `src/components/registry/preview-mockups.tsx` [NEW]
      - `src/components/registry/index.ts` [NEW]
      - `src/components/builder/left-sidebar.tsx` [MODIFY]
  - [X] **Feature: Right Sidebar Tabbed Panel Separation**
    - **Goal:** Deconstruct `RightSidebar` (1178 lines) into smaller, single-purpose tab panel subcomponents (`CustomSelect`, `PageSettingsTab`, `StyleInspectorTab`, `ContentInspectorTab`).
    - **Files Involved:**
      - `src/components/builder/right-sidebar/custom-select.tsx` [NEW]
      - `src/components/builder/right-sidebar/page-settings-tab.tsx` [NEW]
      - `src/components/builder/right-sidebar/style-inspector-tab.tsx` [NEW]
      - `src/components/builder/right-sidebar/content-inspector-tab.tsx` [NEW]
      - `src/components/builder/right-sidebar.tsx` [MODIFY]
  - [X] **Feature: Shared Styling Utilities & DRY Enforcement**
    - **Goal:** Unify duplicated styling and class-mapping helpers (`getStyleClasses`, `getResolvedStyles`, `mapColor`, and `getStyleProps`) from `WorkspaceCanvas` and `compiler.ts` into a single, importable utility file `style-utils.ts`.
    - **Files Involved:**
      - `src/lib/compiler/style-utils.ts` [NEW]
      - `src/lib/compiler/index.ts` [MODIFY]
      - `src/components/builder/workspace-canvas.tsx` [MODIFY]
      - `src/lib/compiler/compiler.ts` [MODIFY]
  - [X] **Feature: Lint & Compiler Warning Cleanups**
    - **Goal:** Clean up the pre-existing ESLint warnings and typescript compilation errors across all main files.
    - **Files Involved:**
      - `src/app/api/publish/route.ts` [MODIFY]
      - `src/app/dashboard/page.tsx` [MODIFY]
      - `src/components/builder/header.tsx` [MODIFY]
      - `src/components/builder/left-sidebar.tsx` [MODIFY]
      - `src/components/builder/right-sidebar.tsx` [MODIFY]
      - `src/lib/compiler/compiler.ts` [MODIFY]