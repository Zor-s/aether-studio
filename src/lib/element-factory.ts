import { CanvasElement, PageSettings } from "@/types/builder";

export const INITIAL_ELEMENTS: CanvasElement[] = [
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

export function createNewElement(
  elementId: string,
  themePalette?: PageSettings["themePalette"]
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
          color: themePalette?.darkSlate || "#01303f",
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
          color: themePalette?.deepTeal || "#02577a",
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
        styles: {
          fontSize: "text-xs",
          color: themePalette?.cyanActive || "#02a9f7",
          margin: "space-sm",
          align: "left",
          borderRadius: "rounded-md",
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
          color: themePalette?.deepTeal || "#02577a",
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
          color: themePalette?.deepTeal || "#02577a",
          margin: "space-md",
          padding: "space-sm",
          quoteLineColor: themePalette?.cyanActive || "#02a9f7",
          quoteVariant: "classic",
        },
      };

    case "list":
      return {
        id: baseId,
        type: "list",
        category: "basic",
        content:
          "List item bullet point one\nList item bullet point two\nList item bullet point three",
        styles: {
          fontSize: "text-sm",
          color: themePalette?.deepTeal || "#02577a",
          margin: "space-sm",
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
          borderColor: themePalette?.cyanActive || "#02a9f7",
        },
      };

    default:
      return null;
  }
}
