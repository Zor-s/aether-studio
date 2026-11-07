import React from "react";

export interface ElementType {
  id: string;
  name: string;
  category: "layout" | "basic" | "media" | "forms";
  description: string;
  icon: React.ReactNode;
}

export const REGISTRY_ELEMENTS: ElementType[] = [
  // Layouts
  {
    id: "section",
    name: "Section Container",
    category: "layout",
    description: "Full-width section wrapper with padding settings",
    icon: (
      <svg className="w-5 h-5 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: "grid-2",
    name: "Two-Column Grid",
    category: "layout",
    description: "Responsive 50/50 block layout grid",
    icon: (
      <svg className="w-5 h-5 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
      </svg>
    ),
  },
  {
    id: "container",
    name: "Standard Wrapper",
    category: "layout",
    description: "Centered container locked to max widths",
    icon: (
      <svg className="w-5 h-5 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8V4a1 1 0 011-1h16a1 1 0 011 1v4m-18 8v4a1 1 0 001 1h16a1 1 0 001-1v-4M3 8h18v8H3V8z" />
      </svg>
    ),
  },
  // Basic
  {
    id: "headline",
    name: "Large Headline",
    category: "basic",
    description: "Header text block mapping to h1/h2 tags",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    id: "subheading",
    name: "Secondary Subheading",
    category: "basic",
    description: "Subtitle mapping to h3 / h4 tags",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h11" />
      </svg>
    ),
  },
  {
    id: "paragraph",
    name: "Paragraph Block",
    category: "basic",
    description: "Standard body text block with font scales",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: "blockquote",
    name: "Blockquote Testimonial",
    category: "basic",
    description: "Indented text quote block with left border highlights",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "list",
    name: "Bullet List",
    category: "basic",
    description: "Unordered bullet point list container block",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: "button",
    name: "Action Button",
    category: "basic",
    description: "Interactive button mapping to custom urls",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    id: "divider",
    name: "Divider Line",
    category: "basic",
    description: "Horizontal separation rule element",
    icon: (
      <svg className="w-5 h-5 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  },
  // Media
  {
    id: "image",
    name: "Image Asset",
    category: "media",
    description: "Responsive image component with aspect ratio & captions",
    icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export const TYPE_LABELS: Record<string, string> = {
  section: "Section Container",
  "grid-2": "Two-Column Grid",
  container: "Standard Wrapper",
  headline: "Large Headline",
  paragraph: "Paragraph Block",
  button: "Action Button",
  subheading: "Secondary Subheading",
  blockquote: "Blockquote Testimonial",
  list: "Bullet List",
  divider: "Divider Line",
  image: "Image Element",
};

export function getElementTag(id: string): string {
  switch (id) {
    case "section": return "<section>";
    case "grid-2": return "<div> (grid)";
    case "container": return "<div> (max-w)";
    case "headline": return "<h1> / <h2>";
    case "paragraph": return "<p>";
    case "button": return "<button>";
    case "image": return "<img>";
    case "video": return "<video>";
    case "contact-form": return "<form>";
    case "turnstile": return "<script>";
    default: return "<div>";
  }
}
