/**
 * style-maps.ts
 *
 * Centralized design-scale lookup maps for the Aether compiler and style
 * utilities. Both `compiler.ts` (static HTML generation) and `style-utils.ts`
 * (live canvas rendering) import from here.
 *
 * Never re-declare a spacing/scale Record inline elsewhere — update this file.
 */

/** Maps space-* token → CSS value string */
export const SPACE_MAP: Record<string, string> = {
  "space-none": "0",
  "space-xs":   "0.25rem",
  "space-sm":   "0.5rem",
  "space-md":   "1rem",
  "space-lg":   "1.5rem",
  "space-xl":   "2rem",
  "space-2xl":  "3rem",
};

/** Maps space-* token → margin CSS value (lg uses symmetric vertical shorthand) */
export const MARGIN_MAP: Record<string, string> = SPACE_MAP;

/** Maps space-* token → padding CSS value */
export const PADDING_MAP: Record<string, string> = SPACE_MAP;

/** Maps space-* token → gap CSS value */
export const GAP_MAP: Record<string, string> = SPACE_MAP;

/**
 * Maps space-* token → page body padding CSS value.
 * lg and above use 2-value shorthands (vertical horizontal).
 */
export const PAGE_PADDING_MAP: Record<string, string> = {
  "space-none": "0",
  "space-xs":   "0.25rem",
  "space-sm":   "0.5rem",
  "space-md":   "1rem",
  "space-lg":   "2rem 1.5rem",
  "space-xl":   "3rem 2rem",
  "space-2xl":  "4rem 3rem",
};

/** Maps text-* token → CSS font-size value */
export const FONT_SIZE_MAP: Record<string, string> = {
  "text-xs":  "0.78125rem",
  "text-sm":  "0.90625rem",
  "text-md":  "1rem",
  "text-lg":  "1.125rem",
  "text-xl":  "1.25rem",
  "text-2xl": "1.5rem",
  "text-3xl": "1.875rem",
};

/** Maps rounded-* token → CSS border-radius value */
export const BORDER_RADIUS_MAP: Record<string, string> = {
  "rounded-none": "0px",
  "rounded-sm":   "0.125rem",
  "rounded-md":   "0.375rem",
  "rounded-lg":   "0.5rem",
  "rounded-xl":   "0.75rem",
  "rounded-2xl":  "1rem",
  "rounded-full": "9999px",
};

/** Maps font-* token → CSS font-weight value */
export const FONT_WEIGHT_MAP: Record<string, string> = {
  "font-light":     "300",
  "font-normal":    "400",
  "font-medium":    "500",
  "font-semibold":  "600",
  "font-bold":      "700",
  "font-extrabold": "800",
};

/** Maps tracking-* token → CSS letter-spacing value */
export const LETTER_SPACING_MAP: Record<string, string> = {
  "tracking-tighter": "-0.05em",
  "tracking-tight":   "-0.025em",
  "tracking-normal":  "0em",
  "tracking-wide":    "0.025em",
  "tracking-wider":   "0.05em",
  "tracking-widest":  "0.1em",
};

/** Maps justify token → CSS justify-content value */
export const JUSTIFY_MAP: Record<string, string> = {
  "center":  "center",
  "start":   "flex-start",
  "end":     "flex-end",
  "between": "space-between",
};

/** Maps alignItems token → CSS align-items value */
export const ALIGN_ITEMS_MAP: Record<string, string> = {
  "center":  "center",
  "start":   "flex-start",
  "end":     "flex-end",
  "stretch": "stretch",
};

/** Maps widthMode token → CSS max-width value (page-level) */
export const PAGE_WIDTH_MAP: Record<string, string> = {
  "boxed-md": "768px",
  "boxed-lg": "1024px",
  "boxed-xl": "1280px",
  "full":     "100%",
};

/** Maps widthMode token → CSS max-width value (element-level) */
export const ELEMENT_WIDTH_MAP: Record<string, string> = {
  "boxed-sm": "384px",
  "boxed-md": "448px",
  "boxed-lg": "512px",
  "boxed-xl": "576px",
};

/** Maps minHeight token → CSS min-height value */
export const MIN_HEIGHT_MAP: Record<string, string> = {
  "auto":   "auto",
  "screen": "100vh",
  "h-300":  "300px",
  "h-500":  "500px",
  "h-700":  "700px",
};

/** Light background colour values that require dark text contrast */
export const LIGHT_BG_VALUES = new Set([
  "#d4f0fc",
  "#89d6fb",
  "var(--brand-ice-blue)",
  "var(--brand-sky-blue)",
]);

/** Element types that use `color` as a background fill (not text colour) */
export const LAYOUT_ELEMENT_TYPES = new Set([
  "button",
  "section",
  "container",
  "grid-2",
]);
