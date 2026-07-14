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
> The theme toggle switch is managed within [header.tsx](file:///home/zors/Git%20repositories/aether-studio/src/components/builder/header.tsx). It dynamically applies/removes `.dark` from the root document class list, persisting settings in `localStorage` under `theme` to prevent page load layout flashes.

### C. Dynamic Theme Palette Customization

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

---

## 2. Strict Measurements & Sizing Scale

To ensure components look consistent and measurements are accurate throughout the application, we avoid using ad-hoc sizing values (`w-[134px]`, `text-[17px]`, `p-[11px]`). Instead, we define strict measurement scales.

### A. Spacing Scale (Margins, Padding, Gaps)
The spacing scale relies on multipliers of `4px` (`0.25rem`) to maintain perfect layout alignments:

| Name | Rem Value | Pixel Value | Typical Use Cases |
| :--- | :--- | :--- | :--- |
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
| **`text-xs`** | `0.75rem` (12px) | `1rem` (16px) | Tooltips, element type labels, metadata, shortcuts |
| **`text-sm`** | `0.875rem` (14px)| `1.25rem` (20px)| Secondary labels, input contents, list descriptions |
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
To give builders live visual feedback on mobile devices without relying on browser resizing, the middle editor canvas will render the generated Rose Tree inside an iframe enclosed in a device wrapper:
- **Mobile Mode**: Iframe wrapper width locked to `375px` (iPhone width), centered with a drop shadow.
- **Tablet Mode**: Iframe wrapper width locked to `768px` (iPad width).
- **Desktop Mode**: Iframe wrapper width set to `100%` width.

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

---

## 4. Components UI Inventory (Workspace Outline)

To structure our React components before adding active data models or database connections, we split the UI into clear modules:

```
src/components/builder/
├── header.tsx              # Save status, theme toggle, nav links, and Publish
├── left-sidebar.tsx        # Toggleable Element Registry and Layers panels
├── component-tree.tsx      # Accessible page-root component hierarchy and node actions
├── right-sidebar.tsx       # Style Inspector & Page Settings panel
├── workspace-canvas.tsx    # Design canvas with dropzone guidelines
├── project-card.tsx        # Glassmorphic project item widget card
└── dashboard-navbar.tsx    # Mobile-responsive slide-out sheet drawer
```

### A. Consistency Rules (Guarding Layout Quality)
1. **Layout Wrapper Limits**: Always use `flex flex-col h-screen overflow-hidden` on the main page to freeze page-scroll and keep sidebars locked while the canvas handles its own scrolling.
2. **Interactive States**: Every button or selection block must transition using `transition-all duration-200 ease-in-out` with subtle scale highlights or background shifts.
3. **Outline States**: Elements inside the canvas must render a thin, dotted Sky Blue outline (`border border-dashed border-sky-blue`) during editing that changes to a solid Primary Cyan border when selected.
4. **History Stack Dropdown**: Integrated directly into the top header navbar adjacent to the Undo/Redo buttons. Renders a compact state selector pill (`History (X/Y)`) that opens an overlay dropdown menu containing scrollable time-travel steps dynamically labeled based on elements added, deleted, edited, or reordered.
5. **Left Sidebar Hover Previews**: Hovering any registry element card triggers a floating preview popover adjacent to the sidebar (`left-full ml-sm w-[280px]`). The popover uses the `animate-scaleIn` entry transition and centers its `top` position relative to the hovered item, clamped dynamically to remain within the visible vertical container height. It renders specific HTML mockups with custom, theme-compliant CSS keyframe animations.
6. **Layers Panel**: The sidebar's Layers toggle exposes a page-root tree. Selecting a node selects its canvas element; nodes can be renamed, duplicated, and moved relative to siblings. Parent-child relationships use `parentId`, and expandable rows expose nested structures when present.
7. **Custom Style Dropdowns**: To prevent native OS select element rendering glitches under browser zoom-out levels, and to maintain theme-palette compliance across dark/light modes, all styling selection controls in the sidebar must utilize custom DOM dropdown menus (`CustomSelect`) with absolute-positioned panels and full-screen backdrop click overlays for close handling.


---

## 5. Implementation Roadmap for UI

Our plan to build the UI proceeds step-by-step:

1. **Setup Tailwinds & Design Variables**: Configure `src/app/globals.css` with the colors, themes, font scales, and layout variables.
2. **Design Root Layout**: Build the shell with the responsive wrapper, sidebar slots, and canvas workspace.
3. **Build the Header & Left Sidebar**: Create lists of design elements available for builder canvas selection.
4. **Build the Inspector Sidebar**: Construct inputs for color toggling and padding ranges.
5. **Build the Canvas Wrapper**: Include the device frames (Mobile/Tablet/Desktop iframe simulation).

---

## 6. Tailwind CSS v4 Spacing & Max-Width Caveats

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

## 7. Container Layout & Alignment Settings

To maximize layout flexibility, the **Section Container** and **Standard Wrapper** components support advanced flex alignment options.

### A. Layout Settings Specification

| Style Parameter | Property Key | Values | Tailwind CSS Utility | Compiled CSS Fallback |
| :--- | :--- | :--- | :--- | :--- |
| **Flex Direction** | `direction` | `"col"` (default), `"row"` | `flex-col`, `flex-row` | `flex-direction: column / row` |
| **Justify Content** | `justify` | `"center"` (default), `"start"`, `"end"`, `"between"` | `justify-center`, `justify-start`, `justify-end`, `justify-between` | `justify-content: center / flex-start / flex-end / space-between` |
| **Align Items** | `alignItems` | `"center"` (default), `"start"`, `"end"`, `"stretch"` | `items-center`, `items-start`, `items-end`, `items-stretch` | `align-items: center / flex-start / flex-end / stretch` |
| **Flex Item Gap** | `gap` | `"space-none"`, `"space-xs"`, `"space-sm"`, `"space-md"` (default), `"space-lg"`, `"space-xl"`, `"space-2xl"` | `gap-0`, `gap-xs`, `gap-sm`, `gap-md`, `gap-lg`, `gap-xl`, `gap-2xl` | `gap: 0 / 0.25rem / 0.5rem / 1rem / 1.5rem / 2rem / 3rem` |
| **Width Limit** | `widthMode` | `"full"` (default), `"boxed-sm"`, `"boxed-md"`, `"boxed-lg"`, `"boxed-xl"` | `w-full`, `max-w-[384px] mx-auto w-full`, `max-w-[448px] mx-auto w-full`, `max-w-[512px] mx-auto w-full`, `max-w-[576px] mx-auto w-full` | `max-width: 100% / 384px / 448px / 512px / 576px` |
| **Minimum Height** | `minHeight` | `"auto"` (default), `"screen"`, `"h-300"`, `"h-500"`, `"h-700"` | `min-h-auto`, `min-h-screen`, custom style mapping | `min-height: auto / 100vh / 300px / 500px / 700px` |

### B. Responsive Behaviors & Compilation
All advanced layout controls inherit and cascade normally from Desktop through to Tablet and Mobile viewport settings. Tablet and Mobile overrides generate media-query targeted style rules referencing unique element IDs (e.g. `#el-id`) to override utility class defaults, ensuring exact responsive fidelity.

### C. Spacing and Margins Constraints
To prevent horizontal overflow and layout breaking inside the visual canvas and compiled pages, layout components (`section`, `container`, and `grid-2`) enforce vertical-only margin utilities (`my-none` to `my-2xl`) rather than all-sides margin utilities (`m-none` to `m-2xl`):
1. **Overflow Prevention**: Since layout components default to `width: 100%`, adding left and right margins would result in a total width of `100% + horizontal margins`, which pushes the elements past the viewport boundaries. Vertical-only margins (`my-`) keep the layout container centered and perfectly fitted.
2. **Centering Rules Preservation**: Boxed layout modes use `mx-auto` (horizontal margin auto) to center the container within the workspace. Enforcing vertical-only margins ensures that custom margin adjustments do not override or break `mx-auto`.
