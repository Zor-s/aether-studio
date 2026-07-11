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

- [X] **UI & UX Frontend Phase**
  - **Status:** The base workspace shell (Header, Left Sidebar, Right Sidebar, Workspace Canvas, Mobile Drawer) is compiled and verified.
    - [X] **Feature: Builder theme toggle (Light / Dark mode)**
      - **Goal:** Implement a theme switch control in the header bar. Toggling theme should append/remove the `.dark` class from the root layout, updating panel backdrops and borders between light slate and dark slate/teal themes.
      - **Files Involved:** `src/components/builder/header.tsx`, `src/app/dashboard/page.tsx`
    - [X] **Feature: Canvas Element Dropzone Guidelines**
      - **Goal:** Render vertical and horizontal dotted dropzone indicators inside the canvas when hovering elements, simulating insertion points.
      - **Files Involved:** `src/components/builder/workspace-canvas.tsx`
    - [X] **Feature: Right Sidebar Page Settings Panel**
      - **Goal:** Complete the *Page Settings* tab inside the inspector sidebar, adding inputs for SEO Title, SEO Meta Description, Custom JavaScript tags, and Favicon URL selections.
      - **Files Involved:** `src/components/builder/right-sidebar.tsx`
    - [X] **Feature: Publishing Progress Indicator Dialog**
      - **Goal:** Build an overlay modal that displays when "Publish" is clicked. Renders a step-by-step progress chain (Serializing Canvas -> Uploading assets to R2 -> Purging CDN Cache -> Live!). Provides a copyable public subdomain URL on success.
      - **Files Involved:** `src/app/dashboard/page.tsx`
    - [X] **Route: Projects Overview Grid**
      - **Goal:** Create a new page layout at `/dashboard/projects` rendering a modern project selection grid. Shows card summaries of user portfolios, live subdomains, last-modified timestamps, and a "+" creation card.
      - **Files Involved:** `src/app/dashboard/projects/page.tsx`, `src/components/builder/project-card.tsx`
    - [X] **Feature: Subdomain & Custom Domain Bindings Modal**
      - **Goal:** Build a project settings dialog within the portal allowing builders to map custom domains (e.g. `portfolio.com`) and view DNS instructions (A records, CNAME records).
      - **Files Involved:** `src/app/dashboard/projects/page.tsx`
    - [X] **Feature: Dynamic Form Submissions & Analytics Graphs**
      - **Goal:** Build an analytics statistics tab inside the projects hub showing clean CSS-based bar/line charts for Page Views, Form Submissions, and Cache hit percentages.
      - **Files Involved:** `src/app/dashboard/projects/page.tsx`

---

- [X] **UI & UX Frontend Expansion Phase**
  - **Status:** All enhancements implemented, verified, and compiled.
  - [X] **Feature: Drag Resizer Handles on Canvas Device Previews**
    - **Goal:** Render draggable borders on the left/right edges of the mobile and tablet device frames in the workspace canvas. Dragging allows the builder to freely scale preview widths, giving immediate media query testing.
    - **Files Involved:** `src/components/builder/workspace-canvas.tsx`
  - [X] **Feature: Advanced Typography & Border Style Inspector Controls**
    - **Goal:** Extend the Right Sidebar Styles panel to support additional styling settings, including font-weight weight controls, letter-spacing selections, and custom borders (styles: solid, dashed, dotted; width sliders).
    - **Files Involved:** `src/components/builder/right-sidebar.tsx`
  - [X] **Feature: Global Toast Notification Engine**
    - **Goal:** Replace browser native alerts with animated overlay toast notifications that slide in from the screen corner. Trigger toasts when copying links, auto-saving drafts, or catching compilation warnings.
    - **Files Involved:** `src/app/dashboard/page.tsx`
  - [X] **Feature: Unsplash Media Search & Asset Library Modal**
    - **Goal:** Design a pop-up asset browser modal inside the left sidebar. Allows builders to query high-resolution free images via Unsplash API or browse previously uploaded R2 portfolio assets.
    - **Files Involved:** `src/components/builder/left-sidebar.tsx`, `src/components/builder/right-sidebar.tsx`
  - [X] **Feature: Live Element Drag-and-Drop Sorting**
    - **Goal:** Integrate native HTML5 drag-and-drop or pointer event tracking to allow direct drag reordering of elements within the canvas page flow, replacing the basic move-up/move-down buttons.
    - **Files Involved:** `src/components/builder/workspace-canvas.tsx`
  - [X] **Route: Marketing Landing Page & Onboarding Greeting Tour**
    - **Goal:** Replace the immediate router redirection at `/` with a premium marketing landing page explaining Aether's zero-cost edge tech stack. Includes an interactive modal onboarding guide greeting first-time users and teaching basic layout mechanics.
    - **Files Involved:** `src/app/page.tsx`, `src/components/landing/onboarding-wizard.tsx`
  - [X] **Route: "About" Project Architecture Showcase**
    - **Goal:** Create a new page layout at `/about` presenting Aether's engineering principles. Uses animated diagrams and cards to detail edge routing sequence maps, Cloudflare caching limits, and Turso DB relational schema.
    - **Files Involved:** `src/app/about/page.tsx`
  - [X] **Route: Interactive Documentation Portal**
    - **Goal:** Build a dev-docs hub at `/docs` that parses and renders the project's static markdown documentation (plan, architecture, UI systems). Features a sticky table of contents sidebar, search filter, and custom styling theme.
    - **Files Involved:** `src/app/docs/page.tsx`, `src/components/docs/sidebar.tsx`

---

## Future UI & UX Suggestions & Checklist

- [X] **Feature: Dynamic Theme Palette Customizer**
  - **Goal:** Extend page settings panels to let users configure custom brand palettes, dynamically altering CSS color tokens (`--brand-ice-blue`, `--brand-cyan-active`, etc.) in real time.
- [ ] **Feature: Google Fonts API Typography Registry**
  - **Goal:** Integrate a searchable typography font picker querying the Google Fonts list, inserting dynamic `@import` stylesheet links into the compiled R2 output header.
- [ ] **Feature: Keyboard Shortcuts & Undo/Redo Engine**
  - **Goal:** Build an command-pattern history stack mapping visual canvas mutations to `Cmd+Z` / `Cmd+Shift+Z` actions and show floating history undo indicators.
- [ ] **Feature: Left Sidebar Element Hover Previews**
  - **Goal:** Add visual popover cards when hovering element pills in the registry tab, demonstrating structural animations or miniature layouts.
- [ ] **Feature: Device-Specific Style Breakpoint Overrides**
  - **Goal:** Allow builders to define custom typography/border styles scoped strictly to mobile/tablet breakpoints when viewport dragging is active.
- [ ] **Feature: Component Tree Hierarchy (Layers Panel)**
  - **Goal:** Render a visual hierarchical outline of all canvas nodes in the Left Sidebar. Allows builders to select, rename, duplicate, or re-order nested elements via tree nodes.
- [ ] **Feature: AI-Assisted Custom Component Generator**
  - **Goal:** Add a text input prompt within the Left Sidebar letting builders describe elements (e.g. "Pricing table with 3 cards") and generate canvas JSON blocks automatically.
- [ ] **Feature: Asset Cropping & Optimization Drawer**
  - **Goal:** Embed a lightweight canvas-based crop/resize tool when selecting stock imagery or dragging files to ensure optimal payloads before uploading to R2 storage.
- [ ] **Feature: Dynamic DNS Verification & TXT Checkers**
  - **Goal:** In the projects settings modal, add direct verification checkers that query DNS TXT records to verify ownership before routing custom domain names.
- [ ] **Feature: Drag Alignments Ruler & Guidelines**
  - **Goal:** Render snapping guides, red layout grids, and pixel-dimension distance labels when dragging blocks or adjusting borders on the canvas.
- [ ] **Feature: Interactive Preview Console & Form Tester**
  - **Goal:** Add a toggleable bottom console showing real-time event logs (button clicks, form submits, schema validation logs) while in Live Interactive Preview.


