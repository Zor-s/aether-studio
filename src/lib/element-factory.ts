import { CanvasElement, PageSettings } from "@/types/builder";

export const INITIAL_ELEMENTS: CanvasElement[] = [
  {
    id: "el-1",
    type: "headline",
    category: "basic",
    content: "Alex Mercer",
    styles: {
      fontSize: "text-3xl",
      color: "var(--brand-dark-slate)",
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
      color: "var(--brand-deep-teal)",
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
      color: "var(--brand-cyan-active)",
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
      borderColor: "var(--brand-deep-teal)",
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
      color: "var(--brand-deep-teal)",
      margin: "space-xl",
      padding: "space-sm",
      quoteLineColor: "var(--brand-cyan-active)",
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
      color: "var(--brand-deep-teal)",
      margin: "space-md",
      padding: "space-none",
    },
  },
];

export function createNewElement(
  elementId: string,
  _themePalette?: PageSettings["themePalette"]
): CanvasElement | CanvasElement[] | null {
  const baseId = `el-${Date.now()}`;

  switch (elementId) {
    case "section":
      return {
        id: baseId,
        type: "section",
        category: "layout",
        content: "",
        styles: { padding: "space-md", margin: "space-sm" },
      };

    case "grid-2": {
      const colAId = `${baseId}-col-a`;
      const colBId = `${baseId}-col-b`;
      const gridShortId = baseId.slice(-4);
      const gridEl: CanvasElement = {
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
      return [gridEl, colA, colB];
    }

    case "container":
      return {
        id: baseId,
        type: "container",
        category: "layout",
        content: "",
        styles: { padding: "space-md", margin: "space-sm" },
      };

    case "headline":
      return {
        id: baseId,
        type: "headline",
        category: "basic",
        content: "Click to Edit Heading",
        styles: {
          fontSize: "text-xl",
          color: "var(--brand-dark-slate)",
          margin: "space-sm",
          align: "left",
        },
      };

    case "paragraph":
      return {
        id: baseId,
        type: "paragraph",
        category: "basic",
        content:
          "This is a new text block component added from your builder elements selector. Adjust margins and sizes inside the styles panel.",
        styles: {
          fontSize: "text-sm",
          color: "var(--brand-deep-teal)",
          margin: "space-sm",
          align: "left",
        },
      };

    case "button":
      return {
        id: baseId,
        type: "button",
        category: "basic",
        content: "Action Target Button",
        link: "#",
        linkTarget: "_self",
        styles: {
          fontSize: "text-xs",
          color: "var(--brand-cyan-active)",
          margin: "space-sm",
          align: "left",
          borderRadius: "rounded-md",
          buttonVariant: "solid",
          buttonSize: "md",
          buttonWidth: "auto",
          buttonIcon: "none",
          iconPosition: "right",
          hoverEffect: "lift",
          buttonState: "normal",
        },
      };

    case "subheading":
      return {
        id: baseId,
        type: "subheading",
        category: "basic",
        content: "Secondary Subheading Text",
        styles: {
          fontSize: "text-lg",
          color: "var(--brand-deep-teal)",
          margin: "space-sm",
          align: "left",
        },
      };

    case "blockquote":
      return {
        id: baseId,
        type: "blockquote",
        category: "basic",
        content:
          "This is a blockquote element representing a highlighted quote or testimonial.",
        styles: {
          fontSize: "text-md",
          color: "var(--brand-deep-teal)",
          margin: "space-md",
          padding: "space-sm",
          quoteLineColor: "var(--brand-cyan-active)",
          quoteVariant: "classic",
        },
      };

    case "list":
      return {
        id: baseId,
        type: "list",
        category: "basic",
        content:
          "Main feature item one\n  Sub-bullet feature item A\n  Sub-bullet feature item B\nMain feature item two",
        styles: {
          fontSize: "text-sm",
          color: "var(--brand-deep-teal)",
          margin: "space-sm",
          listStyleType: "disc",
          itemSpacing: "space-xs",
          markerColor: "var(--brand-cyan-active)",
        },
      };

    case "divider":
      return {
        id: baseId,
        type: "divider",
        category: "basic",
        content: "",
        styles: {
          margin: "space-md",
          borderStyle: "solid",
          borderWidth: "1",
          borderColor: "var(--brand-cyan-active)",
        },
      };

    case "image":
      return {
        id: baseId,
        type: "image",
        category: "media",
        content: "",
        src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
        alt: "High performance digital architecture node showcase",
        caption: "Aether Studio — Digital Edge Workspace Node",
        styles: {
          margin: "space-md",
          padding: "space-none",
          align: "center",
          imageWidth: "full",
          aspectRatio: "16/9",
          objectFit: "cover",
          borderRadius: "rounded-xl",
          imageShadow: "md",
          imageHover: "zoom",
          loading: "lazy",
        },
      };

    default:
      return null;
  }
}
