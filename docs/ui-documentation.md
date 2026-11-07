# Aether Studio Official UI Documentation & Design System Specifications

This document outlines the UI architecture, design tokens, component constraints, and responsive strategies for building the **Aether Studio** visual builder dashboard and canvas. 

---

## 1. The Color Palette (Brand & Interface Tokens)

To ensure the interface feels modern, cohesive, and premium, we establish standard semantic CSS variables mapping directly to the color palette. 

### A. The Palettes
| Palette Name | Hex Code | RGB Value | Primary Purpose | Tailwind Variable |
| :--- | :--- | :--- | :--- | :--- |
| **Ice Blue** | `#d4f0fc` | `rgb(212, 240, 252)` | App backgrounds, hover states, soft panel blocks | `--color-ice-blue` / `bg-ice-blue` |
| **Sky Blue** | `#89d6fb` | `rgb(137, 214, 251)` | High-level accents, border outlines, interactive highlights | `--color-sky-blue` / `border-sky-blue` |
| **Primary Cyan** | `#02a9f7` | `rgb(2, 169, 247)` | Active states, primary CTA buttons, selection focus | `--color-cyan-active` / `bg-cyan-active` |
| **Deep Teal** | `#02577a` | `rgb(2, 87, 122)` | Secondary text, borders, structured lines, layout wrappers | `--color-deep-teal` / `text-deep-teal` |
| **Dark Slate** | `#01303f` | `rgb(1, 48, 63)` | Primary text, main panels, dark theme backgrounds | `--color-dark-slate` / `bg-dark-slate` |

### B. Dark Mode / Light Mode Mapping Strategy
We map the variables dynamically under `:root` and `.dark` selectors inside `src/app/globals.css`:

```css
:root {
  /* Core brand palette */
  --brand-ice-blue: #d4f0fc;
  --brand-sky-blue: #89d6fb;
  --brand-cyan-active: #02a9f7;
  --brand-deep-teal: #02577a;
  --brand-dark-slate: #01303f;

  /* Semantic UI Tokens - Light Mode */
  --background: #f8fafc; /* Warm light neutral background */
  --foreground: var(--brand-dark-slate);
  --panel-bg: #ffffff;
  --panel-border: rgba(2, 87, 122, 0.15); /* Soft Teal border */
  --accent-soft: var(--brand-ice-blue);
  --accent-highlight: var(--brand-sky-blue);
  --accent-primary: var(--brand-cyan-active);
  --text-muted: var(--brand-deep-teal);
}

.dark {
  /* Semantic UI Tokens - Dark Mode */
  --background: #00121a; /* Darkest teal hue */
  --foreground: #f0f9ff;
  --panel-bg: var(--brand-dark-slate); /* #01303f */
  --panel-border: rgba(137, 214, 251, 0.2); /* Soft Sky Blue border */
  --accent-soft: rgba(2, 87, 122, 0.3);
  --accent-highlight: var(--brand-sky-blue);
  --accent-primary: var(--brand-cyan-active);
  --text-muted: var(--brand-sky-blue);
}
```

> [!TIP]
> The theme toggle switch is managed within [page.tsx](file:///home/zors/Git%20repositories/aether-studio/src/app/dashboard/page.tsx). It dynamically applies the `.dark` class to `document.documentElement` (`<html>` element) to toggle dark mode globally across all panels, sidebars, dialogs, and portals.

### C. Workspace Canvas Isolation from Global Dark Mode
To maintain a true WYSIWYG experience, the visual workspace canvas (simulated devices, canvas elements, grid background, and scrollbars) must remain completely isolated from the builder's own dark mode state. 

This is achieved by applying the `.light` class to the root wrapper of the workspace canvas. The `.light` class in `globals.css` overrides the CSS variables back to their standard light mode presets:

```css
.light {
  --background: #f8fafc;
  --foreground: var(--brand-dark-slate);
  --panel-bg: #ffffff;
  --panel-border: rgba(2, 87, 122, 0.15);
  --accent-soft: var(--brand-ice-blue);
  --accent-highlight: var(--brand-sky-blue);
  --accent-primary: var(--brand-cyan-active);
  --text-muted: var(--brand-deep-teal);
}
```

Additionally, `.canvas-grid` and scrollbar thumb rules are overridden within `.light` to prevent them from adopting dark-mode line colors or thumb styling. To ensure canvas elements (Headline, Subheading, Paragraph, etc.) respect the user's custom page settings color values, they inherit color styling dynamically instead of overriding it with hardcoded `text-foreground` or `text-text-muted` classes.

### D. Dynamic Theme Palette Customization

Aether Studio supports real-time customization of the design color palette. Through the global Page Settings panel, builders can choose from several curated theme presets or configure each of the 5 core brand color tokens individually:

| Preset Name | Ice Blue (Soft Accent) | Sky Blue (Highlight) | Cyan Active (Primary Accent) | Deep Teal (Muted Text) | Dark Slate (Dark BG) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Aether Cyan (Default)** | `#d4f0fc` | `#89d6fb` | `#02a9f7` | `#02577a` | `#01303f` |
| **Emerald Forest** | `#e6fcf5` | `#96f2d7` | `#0ca678` | `#097969` | `#0b2921` |
| **Sunset Coral** | `#fff0e6` | `#ffd8a8` | `#ff922b` | `#d9480f` | `#1a0c00` |
| **Midnight Purple** | `#f3f0ff` | `#d0bfff` | `#845ef7` | `#5f3dc4` | `#120b2e` |
| **Warm Amber** | `#fff9db` | `#ffe066` | `#f59f00` | `#d97706` | `#1c1917` |

#### Scoping & Dynamic Inheritance Mechanism
1. **Scoping**: When a builder selects a theme preset or overrides specific colors, the React state maps these configurations into dynamic inline style declarations on the Workspace Canvas simulated device frame (`.group/device`).
2. **Variable Inheritance**:
   ```html
   <div style="--brand-ice-blue: #e6fcf5; --brand-sky-blue: #96f2d7; ...">
     <!-- All child elements inside inherit these variables dynamically -->
   </div>
   ```
3. **Contrast Calculation**: Button components calculate contrast foreground colors dynamically. If the button background matches a light accent color (like `iceBlue` or `skyBlue`), it defaults its text color to `var(--brand-dark-slate)`; otherwise, it renders white (`#ffffff`).

### E. Global Page Styles & Layout Customization

Aether Studio supports page-level style overrides and layout alignment configurations that apply globally to the compiled document and align edit-mode workspace visual frames in a true WYSIWYG experience:

1. **Global Canvas Styles**:
   - **`fontFamily`**: Sets the global font for the body element (searchable from the Google Fonts API registry).
   - **`backgroundColor`**: Configures the overall page backdrop fill (defaults to white `#ffffff`, customizable via HEX or theme swatch color variable).
   - **`textColor`**: Overrides the base typography text color.

2. **Container Sizing & Spacing**:
   - **`widthMode`**: Defines the maximum width of the root visual block layout stack:
     - `boxed-md`: Limits layout container to standard `768px` (default).
     - `boxed-lg`: Limits layout container to showcase `1024px`.
     - `boxed-xl`: Limits layout container to wide desktop `1280px`.
     - `full`: Sets layout container to span `100%` width.
   - **`padding`**: Sets the outer body spacing margins surrounding the main layout container (options map to spacing tokens: `space-none` to `space-2xl`).
   - **`gap`**: Defines the sibling vertical margins between root elements (options map to spacing tokens: `space-none` to `space-2xl`).

 3. **Unified Component Inspector Icon Tab Navigation**:
    - **Single-Row Icon Tab Bar**: Component inspector options merge all controls into a single, clean icon navigation tab bar (`Content`, `Spacing`, `Layout`, `Type`, `Style`), eliminating redundant nested tab tiers for maximum visual clarity.
    - **Dynamic Tab Filtering**: Component inspectors automatically filter available tabs based on the selected element type (e.g. `Layout` shows for section/container/grid blocks; `Type` shows for headline/subheading/paragraph/button/blockquote/list blocks; `Content` handles text, image, link, and container parentage). All underlying style logic, device overrides, and color pickers remain 100% synchronized.

---


## 2. Strict Measurements & Sizing Scale

To ensure components look consistent and measurements are accurate throughout the application, we avoid using ad-hoc sizing values (`w-[134px]`, `text-[17px]`, `p-[11px]`). Instead, we define strict measurement scales.

### A. Spacing Scale (Margins, Padding, Gaps)
The spacing scale relies on multipliers of `4px` (`0.25rem`) to maintain perfect layout alignments:

| Name | Rem Value | Pixel Value | Typical Use Cases |
| :--- | :--- | :--- | :--- |
| **`space-none`**| `0rem` | `0px` | Reset margin, padding, or gap styles |
| **`space-xs`** | `0.25rem` | `4px` | Tiny gaps between icon and text, micro-paddings |
| **`space-sm`** | `0.5rem` | `8px` | Gap between list items, padding for inner components |
| **`space-md`** | `1rem` | `16px` | Card/panel padding, component gaps, general layout padding |
| **`space-lg`** | `1.5rem` | `24px` | Page container padding, spacing between main layout sections |
| **`space-xl`** | `2rem` | `32px` | High-level section margins, canvas margins |
| **`space-2xl`**| `3rem` | `48px` | Outer boundaries of visual builder canvas |

### B. Typography Hierarchy (Strict Font Sizes & Weights)
Fonts will utilize the project's standard Geist Sans and Geist Mono families, as well as selected brand typography from the Google Fonts API. Standard font size tokens are defined below:

| Token | CSS Font Size | Line Height | Purpose |
| :--- | :--- | :--- | :--- |
| **`text-xs`** | `0.78125rem` (12.5px) | `1rem` (16px) | Tooltips, element type labels, metadata, shortcuts |
| **`text-sm`** | `0.90625rem` (14.5px)| `1.25rem` (20px)| Secondary labels, input contents, list descriptions |
| **`text-md`** | `1rem` (16px) | `1.5rem` (24px) | Body copy, primary action label, default inputs |
| **`text-lg`** | `1.125rem` (18px)| `1.75rem` (28px)| Sub-headings, section titles inside sidebar |
| **`text-xl`** | `1.25rem` (20px) | `1.875rem` (30px)| Panel headers, cards titles |
| **`text-2xl`**| `1.5rem` (24px) | `2rem` (32px) | Primary dashboard title, main builder layout title |
| **`text-3xl`**| `1.875rem` (30px)| `2.25rem` (36px)| Builder editor logo title |

### C. Google Fonts API Typography Registry
To support brand personalization while maintaining edge performance limits, Aether Studio integrates a searchable Google Fonts registry.

1. **Supported Registry**: A curated set of 25 popular Google Fonts is available out-of-the-box (e.g. *Inter, Roboto, Poppins, Outfit, Montserrat, Playfair Display, Lora, Georgia, Space Grotesk, Syne, Roboto Mono*, etc.).
2. **On-Demand Font Previews**: The style inspector dropdown pre-fetches and previews the fonts in real time using a combined Google Fonts stylesheet.
3. **Workspace Canvas Invalidation**: The canvas dynamically scans active elements, filters unique custom fonts, and loads only the required families in the device view frame.
4. **Edge Compilation `@import` Rules**: When publishing pages, the compilation engine aggregates all unique fonts used across the canvas elements and injects optimized, low-latency `@import url(...)` rules inside the head of the serialized static HTML document.

### D. Standard Component Heights & Widths (Layout Constants)
Sidebar panels and components must lock to strict pixel sizes to prevent layout shifting on viewport changes:

- **Sidebar Width (Left/Right Panels)**: Exactly `320px` (`w-80`).
- **Header Height**: Exactly `64px` (`h-16`).
- **Canvas Top Bar Height**: Exactly `48px` (`h-12`).
- **Button Heights**:
  - Small: `32px` (`h-8`)
  - Medium (Default): `40px` (`h-10`)
  - Large: `48px` (`h-12`)
- **Border Radii**:
  - Input/Button: `8px` (`rounded-lg`)
  - Sidebars/Tooltips: `12px` (`rounded-xl`)
  - Dashboard Cards: `16px` (`rounded-2xl`)

### E. Spacing for Labels & Descriptions (Preventing Text Collision)
To ensure proper vertical rhythm and readability throughout the dashboard interface, adjacent text blocks (such as a label/header and its subtext/description) must adhere to these defensive layout rules:
1. **Avoid `leading-none` on Text Elements with Descriptions**: The `leading-none` utility forces a tight line-height of `1` which risks text collision or overlap (especially for letters with descenders/ascenders). Instead, use `leading-snug`, `leading-normal`, or let elements inherit standard text line heights.
2. **Defensive Margins and Gaps**: Descriptions or subtexts stacked under labels must not use layout margins smaller than `4px`. Replace instances of `mt-[2px]` or `mb-[2px]` with `mt-xs` (`mt-[4px]`) or `mb-xs` (`mb-[4px]`) to give elements breathing room. When using flexboxes, utilize a vertical gap scale of `gap-xs` or `gap-sm` instead of extremely small custom layouts.

---

## 3. Mobile-First & Responsive Canvas Strategy

Since Aether Studio is an edge-optimized dashboard and canvas creator, the layout must cater to both screen types:
1. **The Builder Interface itself** (accessible and functional on mobile/tablet).
2. **The Canvas Preview** (allowing builders to view how their portfolios scale on mobile viewports).

### A. Responsive Dashboard Layout Adaptability
| Viewport | Screen Width | Layout Adjustment |
| :--- | :--- | :--- |
| **Mobile** | `< 768px` | Sidebars collapsible into a slide-over sheet drawer. Canvas scales to full width. Top header shows hamburger navigation. |
| **Tablet** | `768px - 1024px` | Right inspector panel collapses into a toggleable bottom tray. Left component selector remains visible but narrower (`240px`). |
| **Desktop** | `> 1024px` | Dual-sidebar layout locked to maximum screen height. Canvas expands to fill the middle space. |

### B. The Canvas Frame (Responsive Preview Engine)
To give builders live visual feedback on mobile, tablet, and desktop devices without relying on browser window resizing, the middle editor canvas renders the generated HTML document inside an iframe enclosed in a device wrapper:
- **Desktop Mode**: Features a sleek, modern desktop browser window frame (`rounded-xl border border-panel-border/30 shadow-xl bg-dark-slate`) complete with a browser window header bar displaying window control buttons (red, yellow, green) and a mock URL location field (`https://workspace.aether.studio/desktop-preview`). The page background color (`backgroundColor`) is isolated to the inner viewport container below the header bar to prevent subpixel corner bleed. In preview mode, redundant outer canvas padding is removed (`p-0`), and the iframe height dynamically auto-measures to the document content scroll height (`doc.body.scrollHeight`), rendering full visual quality without 150px height collapse.
- **Tablet Mode**: Iframe wrapper width locked to `768px` (iPad width), centered with a device drop shadow and camera bezel. In preview mode, content scrolls smoothly inside the tablet frame.
- **Mobile Mode**: Iframe wrapper width locked to `375px` (iPhone width), centered with a smartphone frame and top notch speaker grille. In preview mode, content scrolls smoothly inside the smartphone frame.
- **Live Preview Viewport Switcher**: In Live Interactive Preview Mode, the header viewport control bar displays a pulsing live preview status indicator (`Live Interactive Preview Mode`) alongside desktop, tablet, and mobile viewport buttons, enabling real-time device switching during interactive preview sessions.

### C. Device-Specific Style Breakpoint Overrides
To give builders total control over their portfolio layout scaling, Aether Studio supports device-specific styling overrides.

1. **Responsive Viewport Target:** Styling overrides are scoped strictly to the current active device viewport in the header bar:
   - **Tablet Breakpoint:** Applies to viewports `<= 1024px` (`@media (max-width: 1024px)`).
   - **Mobile Breakpoint:** Applies to viewports `<= 640px` (`@media (max-width: 640px)`).
2. **Inheritance (Cascading) Rules:** Style properties cascade downwards from larger viewports. A mobile component inherits its tablet style override; if no tablet override exists, it inherits the base desktop style.
3. **Inspector UI Indicators:** When a builder adjusts styles while tablet or mobile preview is active:
   - A warning banner at the top of the style inspector reminds them they are editing overrides.
   - Any property containing an override displays with a highlighted label.
   - A **Reset** control appears next to overridden properties to let the builder clear the override and inherit the desktop value again.
4. **Edge Compiler Specificity:** The HTML compiler maps active styling overrides (including margins, paddings, borders, colors, and typography) to media-query-wrapped CSS rules targeting unique element IDs (e.g. `#el-id`). This guarantees the overrides take precedence over base inline styles and Tailwind utility classes.

### D. Mobile Viewport Switching & Horizontal Canvas Scrolling
To allow builders on physical mobile devices (e.g. smartphones < 768px wide) to accurately test and view larger screen sizes (Desktop and Tablet viewports):
1. **Header Action Controls**: On mobile screens (`< 640px`), action button text labels (`Preview`, `Edit Page`, and `Publish`) collapse automatically into compact icon buttons with accessible tooltips and titles. Full text labels restore dynamically on desktop viewports (`sm:` and above).
2. **Compact Viewport Switcher & Status Pill**: Viewport switcher buttons (`Desktop`, `Tablet`, `Mobile`) and cloud save status indicators adjust padding (`px-1.5 py-1`) and icon sizes on mobile screens to preserve top header clearance.
3. **True Resolution Viewport Switching on Mobile Devices**:
   - **Desktop Viewport**: Enforces `min-w-[1024px]` on mobile devices so the canvas renders the genuine desktop layout (2-column grids, desktop navigation, desktop typography) instead of collapsing into a phone width.
   - **Tablet Viewport**: Enforces `min-w-[768px] w-[768px]` so the canvas renders the true tablet layout.
   - **Mobile Viewport**: Uses `w-[375px] max-w-full` for standard smartphone previewing.
4. **Horizontal Scroll Engine**: The outer workspace canvas wrapper provides smooth horizontal scrolling (`overflow-x-auto custom-scrollbar`) aligned to `justify-start` on mobile viewports. This enables builders to swipe horizontally across full desktop (1024px) or tablet (768px) visual layouts on any smartphone.
5. **Single Scrollbar Architecture (Inner Frame Isolation)**: To eliminate double scrollbars, the outer workspace background locks vertical scrolling (`overflow-y-hidden`). Vertical scrolling is isolated exclusively to the inner device frame container (`flex-1 min-h-0 overflow-y-auto custom-scrollbar`), ensuring clean, single-scrollbar scrolling across all device viewports.
6. **Slide-Out Sheet Drawer**: The mobile drawer panel calculates width using `w-[280px] sm:w-80 max-w-[85vw]`, guaranteeing a responsive drawer width across all smartphone screen sizes.

---

## 4. Components UI Inventory (Workspace Outline)

To structure our React components before adding active data models or database connections, we split the UI into clear modules:

```
src/
├── components/
│   ├── builder/
│   │   ├── header.tsx              # Save status, theme toggle, nav links, and Publish
│   │   ├── left-sidebar.tsx        # Toggleable Element Registry and Layers panels
│   │   ├── component-tree.tsx      # Accessible page-root component hierarchy and node actions
│   │   ├── right-sidebar.tsx       # Tab controller for styling & page configurations
│   │   ├── right-sidebar/          # Subcomponents for right-sidebar tabs
│   │   │   ├── custom-select.tsx   # Dropdown menu wrapper
│   │   │   ├── color-picker.tsx    # Custom HSV portal-based color picker
│   │   │   ├── page-settings-tab.tsx  # Global SEO, custom JS, and brand theme configurations
│   │   │   ├── style-inspector-tab.tsx # Layout, padding/margin overrides, typography, and border controls
│   │   │   └── content-inspector-tab.tsx # Parent containers and element label settings
│   │   ├── project-card.tsx        # Glassmorphic project item widget card
│   │   └── dashboard-navbar.tsx    # Mobile-responsive slide-out sheet drawer
│   └── registry/                   # Component registry configurations
│       ├── index.ts                # Main entrypoint exporting configuration helpers
│       ├── registry-elements.tsx   # Component schemas and tags definitions
│       └── preview-mockups.tsx     # Custom SVG templates and animations for registry hover cards
├── hooks/                          # Modular state hooks
│   ├── use-canvas-state.ts         # Handles undo/redo, element CRUD, and shortcut keyboard listeners
│   ├── use-sync-state.ts           # Handles local storage debounced autosave and tab BroadcastChannel syncing
│   ├── use-publish-state.ts        # Handles server api publish orchestration
│   └── use-toast.ts                # Handles toast alert states
└── types/
    └── builder.ts                  # Shared types contracts (CanvasElement, PageSettings, Toast)
```

### A. Consistency Rules (Guarding Layout Quality)
1. **Layout Wrapper Limits**: Always use `flex flex-col h-screen overflow-hidden` on the main page to freeze page-scroll and keep sidebars locked while the canvas handles its own scrolling.
2. **Interactive States**: Every button or selection block must transition using `transition-all duration-200 ease-in-out` with subtle scale highlights or background shifts.
3. **Outline States & Outside Spacing Indicators**: Elements inside the canvas render a precise 1px dashed Primary Cyan inset outline (`outline outline-1 outline-dashed outline-cyan-active/70 -outline-offset-1`) during editing hover that transitions seamlessly to a 2px solid Primary Cyan inset border (`outline outline-2 outline-cyan-active -outline-offset-2`) when selected. Utilizing inset offsets (`-outline-offset-2` and `-outline-offset-1`) guarantees the outlines sit inside the element's border-box perimeter, ensuring 100% visible focus borders without size discrepancies, guideline clutter, or outline clipping under `overflow-hidden` containers or zero-padding/margin configurations. Both hover and selection overlays display an attached indicator badge detailing the element type alongside its configured margin and padding (e.g. `M: md (16px) • P: sm (8px)`). The indicator badge and action toolbar strictly render **outside** the element box—positioned 8px above the top border (`-top-8`) by default, or dynamically flipping 4px below the bottom border (`top-full mt-1.5`) when an element sits flush against the topmost canvas edge (`isTopEdge`). This guarantees 100% badge visibility without obscuring text inside the element or adding fake padding to the canvas.
4. **History Stack Dropdown**: Integrated directly into the top header navbar adjacent to the Undo/Redo buttons. Renders a compact state selector pill (`History (X/Y)`) that stays visible across all history stack lengths and opens an overlay dropdown menu containing scrollable time-travel steps dynamically labeled based on elements added, deleted, edited, or reordered. Automatically synchronized during `localStorage` hydration and `BroadcastChannel` multi-tab state sync.
5. **Left Sidebar Hover Previews**: Hovering any registry element card triggers a floating preview popover adjacent to the sidebar (`left-full ml-sm w-[280px]`). The popover uses the `animate-scaleIn` entry transition and centers its `top` position relative to the hovered item, clamped dynamically to remain within the visible vertical container height. To ensure popovers stack cleanly above the Workspace Canvas top window bar (`z-30`), both sidebars (`LeftSidebar` and `RightSidebar`) enforce a `z-40` container stacking level. It renders specific HTML mockups with custom, theme-compliant CSS keyframe animations.
6. **Layers Panel**: The sidebar's Layers toggle exposes a page-root tree. Selecting a node selects its canvas element; nodes can be renamed, duplicated, and moved relative to siblings. Parent-child relationships use `parentId`, and expandable rows expose nested structures when present.
7. **Custom Style Dropdowns**: To prevent native OS select element rendering glitches under browser zoom-out levels, and to maintain theme-palette compliance across dark/light modes, all styling selection controls in the sidebar must utilize custom DOM dropdown menus (`CustomSelect`) with absolute-positioned panels, full-screen backdrop click overlays for close handling, and dynamic viewport-based upward/downward positioning to prevent options list clipping when space below is limited.
8. Custom Color Pickers: To ensure a premium user experience and prevent native browser color picker dialog rendering glitches, all color selection controls must utilize the custom `ColorPicker` component. This component features an interactive HSV saturation-value area, hue/alpha sliders, format inputs (HEX, RGB, HSL), standard color swatches, recent colors saved in localStorage, and theme palette selections. It must render its popover using a React Portal to prevent layout clipping inside scrollable sidebars, and dynamically position itself near the trigger element. To ensure fluid 60fps interaction during drags and slides, the color picker uses local state tracking (`localHsva`) for the active drag value. Updates to the parent element styles are throttled (using a trailing-edge throttle of 60ms) to prevent heavy canvas re-renders from blocking browser input events, while final color values are instantly flushed upon drag completion (`mouseup`/`touchend`).
9. **Action Icons Visual Clarity**: To ensure toolbars and action controls are highly intuitive and visually distinct, icons representing duplicate actions must use overlapping offset rectangles (representing cloning or copying) rather than aligned overlapping boundaries that risk visual blending or merging.


---

## 5. Tailwind CSS v4 Spacing & Max-Width Caveats

> [!WARNING]
> When defining custom spacing tokens inside the `@theme` directive in Tailwind CSS v4 (e.g., `--spacing-lg: 1.5rem`), Tailwind replaces its default spacing keys.
> 
> A critical side-effect of this behavior is that utility classes such as `max-w-sm`, `max-w-md`, `max-w-lg`, and `max-w-xl` will automatically resolve directly to these customized spacing scale keys (e.g., `max-w-lg` resolves to exactly `1.5rem` / `24px` instead of `32rem` / `512px`).
> 
> To prevent modals and containers from being squished, developers **must** use explicit pixel values or custom width tokens for all width-constrained wrappers:
> 
> *   Use `max-w-[384px]` instead of `max-w-sm`
> *   Use `max-w-[448px]` instead of `max-w-md`
> *   Use `max-w-[512px]` instead of `max-w-lg`
> *   Use `max-w-[576px]` instead of `max-w-xl`
> *   Use `max-w-[672px]` instead of `max-w-2xl`
> *   Use `max-w-[1024px]` instead of `max-w-5xl`
> *   Use `max-w-[1152px]` instead of `max-w-6xl`
> *   Use `max-w-[1280px]` instead of `max-w-7xl`

---

## 6. Container Layout & Alignment Settings

To maximize layout flexibility, the **Section Container**, **Standard Wrapper**, and **Two-Column Grid** components support advanced layout and alignment options.

### A. Layout Settings Specification

| Style Parameter | Property Key | Values | Tailwind CSS Utility | Compiled CSS Fallback |
| :--- | :--- | :--- | :--- | :--- |
| **Flex Direction** | `direction` | `"col"` (default), `"row"` | `flex-col`, `flex-row` | `flex-direction: column / row` |
| **Justify Content** | `justify` | `"center"` (default), `"start"`, `"end"`, `"between"` | `justify-center`, `justify-start`, `justify-end`, `justify-between` | `justify-content: center / flex-start / flex-end / space-between` |
| **Align Items** | `alignItems` | `"center"` (default), `"start"`, `"end"`, `"stretch"` | `items-center`, `items-start`, `items-end`, `items-stretch` | `align-items: center / flex-start / flex-end / stretch` |
| **Flex/Grid Item Gap** | `gap` | `"space-none"`, `"space-xs"`, `"space-sm"`, `"space-md"` (default), `"space-lg"`, `"space-xl"`, `"space-2xl"` | `gap-0`, `gap-xs`, `gap-sm`, `gap-md`, `gap-lg`, `gap-xl`, `gap-2xl` | `gap: 0 / 0.25rem / 0.5rem / 1rem / 1.5rem / 2rem / 3rem` |
| **Width Limit** | `widthMode` | `"full"` (default), `"boxed-sm"`, `"boxed-md"`, `"boxed-lg"`, `"boxed-xl"` | `w-full`, `max-w-[384px] mx-auto w-full`, `max-w-[448px] mx-auto w-full`, `max-w-[512px] mx-auto w-full`, `max-w-[576px] mx-auto w-full` | `max-width: 100% / 384px / 448px / 512px / 576px` |
| **Minimum Height** | `minHeight` | `"auto"` (default), `"screen"`, `"h-300"`, `"h-500"`, `"h-700"` | `min-h-auto`, `min-h-screen`, custom style mapping | `min-height: auto / 100vh / 300px / 500px / 700px` |

### B. Two-Column Grid Component (`grid-2`) Specification
The Two-Column Grid component renders a responsive 50/50 block layout grid (`grid grid-cols-1 md:grid-cols-2`). 
1. **Nested Columns Architecture**: Adding a `grid-2` component automatically instantiates two child container elements (Column A and Column B). These represent the left and right columns respectively.
2. **Defensive Layout Constraints**:
   - Column A and Column B are structural layouts locked inside their parent grid. They cannot be deleted or duplicated individually.
   - The Parent Container selector is hidden for Column A and Column B to prevent them from being moved outside the grid context.
   - Deep/Recursive Duplication: Duplicating the parent `grid-2` component clones the grid alongside Column A, Column B, and all of their nested elements, preserving hierarchy references.
3. **Customizable Options**: The parent `grid-2` component supports customizable item Gap (spacing between columns), Width Limit, Border Radius, Background Color, and margins.
4. **Simulated Viewport Resolution**: When rendering in the editor's edit-mode canvas, the grid dynamic classes are resolved against the active device simulation frame. Under mobile simulation, the column layout automatically resolves to a stacked single-column (`grid-cols-1`) format to guarantee visual correctness without relying on browser window media queries.

### C. Responsive Behaviors & Compilation
All advanced layout controls inherit and cascade normally from Desktop through to Tablet and Mobile viewport settings. Tablet and Mobile overrides generate media-query targeted style rules referencing unique element IDs (e.g. `#el-id`) to override utility class defaults, ensuring exact responsive fidelity.

### D. Spacing and Margins Constraints
To prevent horizontal overflow and layout breaking inside the visual canvas and compiled pages, layout components (`section`, `container`, and `grid-2`) enforce vertical-only margin utilities (`my-none` to `my-2xl`) rather than all-sides margin utilities (`m-none` to `m-2xl`):
1. **Overflow Prevention**: Since layout components default to `width: 100%`, adding left and right margins would result in a total width of `100% + horizontal margins`, which pushes the elements past the viewport boundaries. Vertical-only margins (`my-`) keep the layout container centered and perfectly fitted.
2. **Centering Rules Preservation**: Boxed layout modes use `mx-auto` (horizontal margin auto) to center the container within the workspace. Enforcing vertical-only margins ensures that custom margin adjustments do not override or break `mx-auto`.

### E. Workspace Canvas Empty Placeholders (Edit Mode)
To ensure structural visibility while building without affecting production CSS/HTML outputs, empty container components display solid/shadowed placeholder cards on the canvas when `!previewMode` is active:
- **Section Container**: Renders a card (`border border-panel-border rounded-xl p-md bg-panel shadow-sm`) with an italic selection guide indicator.
- **Standard Wrapper**: Renders a card (`border border-panel-border rounded-xl p-md bg-panel shadow-sm`) with an italic selection guide indicator.
- **Two-Column Grid**: If empty/devoid of children, renders two balanced column cards inside it with the same card indicators.

---

## 7. Defensive Coding & Edge Cases Prevention

To guarantee builder stability and compiled page security under nested layout operations, dynamic custom inputs, and local state persistence, the system implements the following defensive coding constraints:

### A. LocalStorage & Multi-Tab State Integrity
- **SSR-Hydration Safety for LocalStorage**: Never evaluate `localStorage` inside `useState` initializers using `typeof window !== "undefined"` checks, as this causes server/client hydration mismatches (server renders `false` while client renders `true`). Instead, initialize component state to a deterministic default (matching SSR output) and synchronize `localStorage` state inside a post-hydration `useEffect` hook.
- **Nested Merging**: When recovering state configurations (`PageSettings`) from `localStorage` or tab-to-tab synchronization (`BroadcastChannel`), the merging logic must perform deep/nested merging on sub-objects (like `themePalette`). Shallow spreads of parent objects are banned to prevent older/partial configuration datasets from corrupting nested palette fields with `undefined` values.
- **Array Verification**: Any canvas tree JSON loaded from local storage must be explicitly validated as an array prior to updating React state to prevent parsing errors/malformed objects from crashing the tree hierarchy.

### B. Color Input Integrity & Verification
- **Hex Code Regex Strictness**: The custom color picker validation only accepts standard CSS hex formats of lengths 3, 4, 6, and 8. Fuzzy ranges (`{3,8}`) are disallowed to prevent typing states of length 5 or 7 from resolving to weird colors or near-invisible transparency levels.
- **Null Safety**: Helper functions converting colors (e.g. RGB/HSL/HEX mappings) must gracefully handle `null`, `undefined`, and non-string inputs by returning sensible default color structures rather than raising runtime type errors.
- **RGB/RBG Channel Swap Prevention**: Color serialization to hex strings must strictly output in `#R-G-B` layout, avoiding any Green and Blue channel inversions.
- **Hue Boundary Normalization**: Color math conversions must constrain the Hue parameter inside the `[0, 360)` range (e.g. via modulo 360 arithmetic) to prevent bounds overflows resulting in invalid color calculations.
- **CSS Variable Resolution**: To ensure visual correctness of active selections, references to color variables (e.g., `var(--brand-cyan-active)`) must be resolved against the active page settings `themePalette` prior to mapping coordinate selectors.
- **Space-Tolerant Matching**: Parsing of function-based color models (like RGB or HSL) must support spaces after parentheses and around parameter elements to tolerate manual user styling entries.
- **Input Validation for Persistence**: Custom user inputs must be fully validated against supported patterns before being written to localStorage arrays (such as the recent colors cache).
- **Saturation-Value Box Rendering**: The saturation-value draggable area must rely on standard CSS alpha composite stacking (normal blending) rather than `background-blend-mode: multiply` to prevent browser rendering bugs on transparent gradient layers.
- **State Isolation & Syncing**: Keep active dragging coordinate calculations completely decoupled from canvas re-renders. Synchronize local state with the `value` prop only when not dragging (`!isDraggingRef.current`) to prevent round-trip conversion rendering glitches or feedback loop jitter.
- **Side-Effect-Free State Updaters**: Never trigger parent component notifications (like `onChange`) inside React `setState` functional updater callbacks, as this violates React's render phase purity. Keep state setters pure and run side effects directly in the event handlers using refs for the latest local state values.
- **Format Input Layout & Overflow Prevention**: The color format text input must utilize flex layout classes including `w-0 flex-1` to allow it to shrink below its default content width, and the format toggler button must declare `shrink-0` to prevent container layout breaks and overflow glitches in narrow sidebars.

### C. Parentage Cycles and Layout Loop Prevention
- **Descendant Selection Block**: When moving or nesting elements, the UI prevents creating recursive cycles (e.g. assigning a child or deep descendant container as the parent of its own ancestor container). The parent selection dropdown list is dynamically filtered to exclude the active element itself and all of its recursive descendants.

### D. Security & Injection Guards in Compiled Pages
- **HTML Character Escaping**: User settings directly compiled into document head metadata tags (e.g., `<title>`, `<meta name="description">`, `<link rel="icon">`) are passed through HTML character escapes to prevent tag breakout and arbitrary script injections.
- **Script Tag Closures**: User-supplied Header Javascript scripts (`customJs`) are verified to prevent premature closure of script tags (`</script>`).

### E. Touch Accessibility & Portal Positioning Synchronization
- **Multi-Touch Support**: Slider surfaces must bind to touch-based events (`touchstart`, `touchmove`, `touchend`) to enable responsive control on mobile/tablet screens.
- **Capture-Phase Window Listeners**: Window-level event bindings (such as `scroll`) must utilize capture propagation (`{ capture: true }`) to correctly intercept scrolling events from nested containers like sidebars, allowing accurate re-alignments of absolute-positioned Portal components.
- **Draggable Handle Transitions**: Draggable elements (like the saturation-value pointer and slider handles) must not use CSS transitions (`transition-all`) while active to prevent cursor lag.

### F. Conditional Typography Defaults & Styling Overrides
- **Typography Controls Availability**: The Style Inspector Typography panel (containing Font Family, Font Size, Text Align, Font Weight, and Letter Spacing) is enabled for Large Headline (`headline`), Secondary Subheading (`subheading`), Paragraph Block (`paragraph`), Action Button (`button`), and Blockquote Testimonial (`blockquote`) components to ensure design system consistency.
- **Default Styling Omission**: To ensure that user-defined custom typography styles (such as `fontWeight` or `letterSpacing` overrides) apply successfully, default styling classes must be conditionally omitted.
- **Headline Component (`h2`)**: If a custom font weight or letter spacing is configured, omit the default `font-extrabold` or `tracking-tight` class from the `h2` tag.
- **Subheading Component (`h3`)**: If a custom font weight or letter spacing is configured, omit the default `font-semibold` or `tracking-tight` class from the `h3` tag.
- **Paragraph Component (`p`)**: If a custom font weight is configured, omit the default `font-medium` class from the `p` tag.
- **Blockquote Component (`blockquote`)**: If a custom font weight is configured, omit the default `font-medium` class from the `blockquote` tag.
- **Blockquote Bounding Box Borders**: The standard border options (`borderStyle`, `borderWidth`, and `borderColor`) apply to the component's bounding box wrapper when configured, allowing builders to create card border outlines around the testimonial block if desired. By default, no outer card borders or rounded corner outlines are applied.
- **Quote Accent Highlight Line**: A dedicated setting (`quoteLineColor`) controls the color of the vertical left highlight accent line (labeled as "Accent Line Color"). It renders as an absolute-positioned vertical bar (`span`) inset dynamically by the active padding value, ensuring a clean presentation.
- **Blockquote Custom Background Color**: A custom background color (`backgroundColor`) option is available for the blockquote component. When configured, it applies a background fill to the blockquote wrapper; by default, blockquotes remain transparent unless a background color is explicitly set.
- **Theme-Aware Default Colors**: When creating new elements (Blockquote, Button, Divider, Headline, Paragraph, Subheading, List), defaults for `color`, `borderColor`, and `quoteLineColor` are initialized dynamically using CSS variable bindings for the active theme's palette tokens (`var(--brand-dark-slate)`, `var(--brand-deep-teal)`, `var(--brand-cyan-active)`) rather than static default hex strings. This ensures elements like the Large Headline remain dynamically bound to the active theme by default whenever the theme preset or theme palette is updated.
- **Blockquote Layout Variants (`quoteVariant`)**: Supports four unique presentation layouts translated directly by the compiler into semantic HTML configurations with integrated theme-palette variables:
  - **Classic**: Features a thick left line accent inset by padding. Clean and transparent by default with no card outline unless custom background/border styles are configured.
  - **Callout**: Renders a centered layout with a large decorative quotation watermark mark. Transparent by default unless custom background/border styles are configured.
  - **Elegant**: A borderless minimalist layout showcasing balanced top and bottom hanging quotation marks (`text-5xl text-cyan-active/60 font-serif`).
  - **Banner**: A horizontal band layout framed with top and bottom borders (2px solid) using the custom `quoteLineColor`. Transparent by default unless a custom background color is configured.
- **Canvas-Compiler Styling Synchronization**: To prevent visual discrepancies in layout containers and ensure unified selection outlines, the canvas workspace wrapper `div` handles all custom outer styles (borders, border-radius, background) for blockquotes, matching other blocks. The inner `<blockquote>` element renders the variant-specific decoration layout (such as highlight lines or quote watermarks) relative to the wrapper's padding-inset content area. In compiled outputs, these outer properties (background, border, border-radius, padding) and the inset offset are compiled directly onto the single semantic `<blockquote>` tag, maintaining perfect visual parity.

### G. Bullet List Component (`list`) Options & Inner Nested Bullets Architecture
To support flexible document lists, nested outline hierarchies, feature checklists, and numbered procedures, the Bullet List component (`type: "list"`) provides comprehensive style options and an automated nested bullet engine:
1. **List Marker Types (`listStyleType`)**:
   - **Unordered Lists (`<ul>`)**: `disc` (Solid Bullet), `circle` (Hollow Circle), `square` (Solid Square), `checkmark` (Checkmark Icon `✓`), `dash` (Hyphen `-`), `none` (Plain unstyled).
   - **Ordered Lists (`<ol>`)**: `decimal` (1, 2, 3), `decimal-leading-zero` (01, 02, 03), `lower-alpha` (a, b, c), `upper-alpha` (A, B, C), `lower-roman` (i, ii, iii), `upper-roman` (I, II, III).
2. **Structured Interactive List Item Manager (`level 0-2+`)**:
   - The Content Inspector features a Notion / Google Docs style visual list manager where each item renders as an interactive row with tree guide accents (`border-l-2`) and level badges (`L0`, `L1`, `L2`).
   - **Fixed Action Column & Direct Controls**: Action buttons (`← Outdent`, `→ Indent`, `↑ Move Up`, `↓ Move Down`, `🗑 Delete`) remain anchored in a fixed right-hand column so inspector controls stay perfectly aligned across all nesting depths without misleading margin shifts.
   - **Keyboard Navigation & Shortcuts**: Supports `Enter` (creates new item below at current level with instant auto-focus), `Tab` (indents item), `Shift+Tab` (outdents item), and `Backspace` on empty input (outdents/deletes item).
   - **Empty-Line State Retention**: Parser (`parseNestedListItems`) preserves empty lines during editing so clicking `+ Add Main Item` or `+ Add Sub-Bullet` creates a responsive new row without transient item filtering bugs.
   - **Dual-Mode Editor**: Seamlessly toggles between `Structured Rows` mode and `Bulk Text` mode, keeping item structures and plain text strings synchronized in real time.
3. **Semantic Sub-List DOM Tree Nesting**:
   - Sub-lists are rendered as semantic nested `<ul class="pl-6">` or `<ol class="pl-6">` elements nested directly inside parent `<li>` nodes using tree algorithm `buildListTree`.
   - Replaces flat item margin offsets with standard HTML list padding (`pl-6` / `1.5rem`) so bullet markers and text align accurately across all levels on canvas preview and compiled static HTML.
   - For unordered lists, sub-bullets automatically progress in shape marker hierarchy: Level 0 (`disc` `•`) → Level 1 (`circle` `◦`) → Level 2+ (`square` `▪`).
   - For ordered lists, sub-bullets automatically progress in numbering style: Level 0 (`decimal` `1.`) → Level 1 (`lower-alpha` `a.`) → Level 2+ (`lower-roman` `i.`).
3. **Item Vertical Spacing (`itemSpacing`)**: Configurable gap between list items (`space-none` 0px, `space-xs` 4px, `space-sm` 8px, `space-md` 16px, `space-lg` 24px).
4. **Independent Marker Color (`markerColor`)**: Custom accent color specifically for bullet points or list numbers across all nested levels (e.g. Primary Cyan `#02a9f7`), allowing markers to stand out while item copy inherits `color`.
5. **Ordered List Starting Index (`startNumber`)**: Configures the starting number for root `<ol>` elements (`start="N"`).
6. **Typography Integration**: List elements participate in full typography styling (Font Family, Font Size, Text Alignment, Font Weight, Letter Spacing).
7. **Line Split & Special Character Hardening**: Splitting of content lines handles indentation levels, preserves special characters, avoids empty list item collapse, and outputs identical nested markup between interactive canvas renders and exported static HTML.

- **Consistency across Preview and Compiler**: The conditional logic must be implemented in both the builder workspace canvas (`workspace-canvas.tsx`) and the edge page compiler (`compiler.ts`) to maintain perfect WYSIWYG synchronization.

### H. Action Button Component (`button`) Architecture, Options & Defensive Controls
To support call-to-action buttons, link destinations, brand buttons, and interactive triggers, the Action Button component (`type: "button"`) features comprehensive options, visual variants, responsive overrides, and edge-case handling:
1. **Link Destination Target (`linkTarget`)**:
   - `_self` (Same Tab - default): Opens the target URL in the active tab.
   - `_blank` (New Window/Tab): Opens target URL in a new browser tab with defensive security attributes (`target="_blank" rel="noopener noreferrer"`).
2. **Button Visual Variants (`buttonVariant`)**:
   - `solid` (default): Filled background matching accent `color` with contrast-calculated text color.
   - `outline`: Transparent background with crisp solid border and text colored with accent `color`.
   - `ghost`: Completely transparent background and no border until hovered, using accent `color` text.
   - `soft`: Soft semi-transparent background fill (`var(--accent-soft)` / `cyanActive/15`) with bold accent text.
   - `glass`: Modern glassmorphic style with backdrop blur (`backdrop-blur-md`), semi-transparent background, and glowing border.
3. **Button Sizing Scale (`buttonSize`)**:
   - `sm`: Small height & padding (`px-3 h-8 text-xs`).
   - `md` (default): Standard height & padding (`px-6 h-10 text-xs`).
   - `lg`: Large height & padding (`px-8 h-12 text-sm`).
   - `xl`: Extra Large height & padding (`px-10 h-14 text-base`).
4. **Button Width Modes (`buttonWidth`)**:
   - `auto` (default): Fits to button content width, aligning within parent layout using `align` (`left`, `center`, `right`).
   - `full`: Spans 100% width of parent container (`w-full`), centering label and icon contents.
5. **Icon Registry & Positioning (`buttonIcon` & `iconPosition`)**:
   - Integrated SVG icon set: `none`, `arrow-right`, `external-link`, `download`, `mail`, `play`, `star`, `heart`, `check`, `plus`, `search`, `github`.
   - `iconPosition`: `left` (Icon before text label) or `right` (Icon after text label).
6. **Hover Animations & Effects (`hoverEffect`)**:
   - `none`: Standard opacity shift.
   - `lift`: Translates upward slightly (`hover:-translate-y-0.5`) with elevated drop shadow.
   - `scale`: Smooth zoom scale effect (`hover:scale-[1.03]`).
   - `glow`: Adds intense glowing halo shadow matching accent color (`hover:shadow-[0_0_20px_rgba(2,169,247,0.5)]`).
   - `shine`: Sweeping light sheen flash animation across button surface on hover (`overflow-hidden`).
7. **Interactive Canvas Navigation vs Editor Selection**:
   - In **Editor Mode** (`!previewMode`), clicking the Action Button on the canvas selects the element so the builder can edit its properties (label, link destination, icon, style) in the inspector panel without triggering navigation.
   - In **Preview Mode** (`previewMode`), clicking an Action Button with an active `link` renders an interactive `<a>` element that follows the URL link (opening in same tab or new tab according to `linkTarget`).
8. **Automatic Protocol Normalization (`formatHref`)**:
   - Web URLs typed without explicit protocols (e.g. `youtube.com`, `google.com`, `twitter.com`) are automatically formatted with `https://` (rendering `https://youtube.com`).
   - Internal links (`/dashboard`), anchor links (`#section`), and protocols (`mailto:`, `tel:`, `http://`, `https://`) are preserved without altering their structure.
9. **Edge Compiler Synchronization**: The compiler engine outputs standard semantic `<a>` tags with `href`, `target`, `rel="noopener noreferrer"`, SVG icons, and CSS classes matching canvas preview 1:1. Responsive device overrides (`mobile` and `tablet`) generate media-query targeted CSS rules targeting `#el-id` and `#el-id-wrapper`.

### I. Image Component (`image`) Architecture, Options & Defensive Controls
To support high-res visual assets, banners, hero graphics, team photos, and portfolio media, the Image component (`type: "image"`) provides full image controls and responsive options:
1. **Image Source & Unsplash Quick Presets (`src`)**:
   - Accepts custom HTTPS image URLs from any CDN or hosting provider.
   - Includes 6 built-in Unsplash presets in the Content Inspector (`Tech Node`, `Architecture`, `Nature Landscape`, `Portrait Person`, `Abstract Gradient`, `Minimal Modern`) for instant 1-click sample insertion.
   - Renders a clean fallback placeholder on the canvas if the URL is empty or fails to load, allowing builders to retry or fix the source URL without breaking the editor.
2. **Alt Text & SEO (`alt`)**:
   - Configurable alt text for search engine optimization and screen reader accessibility.
3. **Figure Caption (`caption`)**:
   - Optional caption text rendered beneath the image as a styled `<figcaption>` element.
4. **Action Destination Link (`link` & `linkTarget`)**:
   - Clicking an image can navigate to a specified URL, opening in the same tab (`_self`) or a new window (`_blank` with `rel="noopener noreferrer"`).
5. **Aspect Ratio Controls (`aspectRatio`)**:
   - Options: `16/9` (Widescreen), `4/3` (Standard), `1/1` (Square), `3/4` (Portrait), `21/9` (Ultrawide), and `auto` (Original image aspect ratio).
6. **Object Fit Modes (`objectFit`)**:
   - Options: `cover` (Crop to fill container), `contain` (Fit entirely inside without cropping), `fill` (Stretch to fill), `none` (Keep original size), `scale-down`.
7. **Width & Alignment (`imageWidth` & `align`)**:
   - `imageWidth`: `full` (100%), `3/4` (75%), `1/2` (50%), `1/3` (33%), `auto` (Fit content).
   - `align`: `left`, `center`, `right`.
8. **Drop Shadow Elevation (`imageShadow`)**:
   - Options: `none`, `sm` (Subtle), `md` (Medium), `lg` (Large), `xl` (Extra Large), `2xl` (Dramatic), `glow` (Glowing Cyan Halo).
9. **Hover Animations & Effects (`imageHover`)**:
   - Options: `none` (Static), `zoom` (Smooth scale 103%), `lift` (Elevate upward + drop shadow), `glow` (Glowing Cyan halo), `grayscale` (Grayscale to full color on hover), `opacity` (Soft fade).
10. **Image Loading Mode (`loading`)**:
    - `lazy` (Optimized lazy loading for fast page loads) or `eager` (Immediate rendering for above-the-fold hero images).
11. **Edge Compiler Synchronization**: The compiler converts image elements into standard `<figure>`, `<a href="...">`, `<img src="..." alt="...">`, and `<figcaption>` tags with responsive CSS style rules and media-query overrides.




