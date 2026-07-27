import { CanvasElement, PageSettings } from "@/types/builder";
import { mapColor } from "./style-utils";
import {
  FONT_SIZE_MAP,
  FONT_WEIGHT_MAP,
  BORDER_RADIUS_MAP,
  LETTER_SPACING_MAP,
  SPACE_MAP,
} from "./style-maps";

export function getCSSDeclaration(
  key: string,
  value: string,
  elType: string,
  palette: PageSettings["themePalette"]
): string {
  if (value === undefined || value === null) return "";

  if (key === "margin") {
    if (["section", "container", "grid-2"].includes(elType)) {
      const val = SPACE_MAP[value] || value;
      return `margin-top: ${val} !important; margin-bottom: ${val} !important;`;
    }
    return `margin: ${SPACE_MAP[value] || value} !important;`;
  }

  if (key === "padding") {
    return `padding: ${SPACE_MAP[value] || value} !important;`;
  }

  if (key === "fontSize") {
    return `font-size: ${FONT_SIZE_MAP[value] || value} !important;`;
  }

  if (key === "align") {
    return `text-align: ${value} !important;`;
  }

  if (key === "borderRadius") {
    return `border-radius: ${BORDER_RADIUS_MAP[value] || value} !important;`;
  }

  if (key === "fontWeight") {
    return `font-weight: ${FONT_WEIGHT_MAP[value] || value} !important;`;
  }

  if (key === "letterSpacing") {
    return `letter-spacing: ${LETTER_SPACING_MAP[value] || value} !important;`;
  }

  if (key === "color") {
    const mapped = mapColor(value, palette);
    if (["button", "section", "container", "grid-2"].includes(elType)) {
      const val = value.toLowerCase().trim();
      const isLightBg = ["#d4f0fc", "#89d6fb", "var(--brand-ice-blue)", "var(--brand-sky-blue)"].includes(val);
      const txtColor = isLightBg ? "var(--brand-dark-slate)" : "#ffffff";
      return `background-color: ${mapped} !important; color: ${txtColor} !important;`;
    }
    return `color: ${mapped} !important;`;
  }

  if (key === "backgroundColor") {
    return `background-color: ${mapColor(value, palette)} !important;`;
  }

  if (key === "borderStyle") {
    return `border-style: ${value} !important;`;
  }

  if (key === "borderWidth") {
    return `border-width: ${value}px !important;`;
  }

  if (key === "borderColor") {
    return `border-color: ${mapColor(value, palette)} !important;`;
  }

  if (key === "fontFamily") {
    return `font-family: '${value}', sans-serif !important;`;
  }

  if (key === "direction") {
    return `flex-direction: ${value === "row" ? "row" : "column"} !important;`;
  }

  if (key === "justify") {
    const justifyMap: Record<string, string> = {
      center: "center",
      start: "flex-start",
      end: "flex-end",
      between: "space-between",
    };
    return `justify-content: ${justifyMap[value] || value} !important;`;
  }

  if (key === "alignItems") {
    const alignMap: Record<string, string> = {
      center: "center",
      start: "flex-start",
      end: "flex-end",
      stretch: "stretch",
    };
    return `align-items: ${alignMap[value] || value} !important;`;
  }

  if (key === "gap") {
    return `gap: ${SPACE_MAP[value] || value} !important;`;
  }

  if (key === "widthMode") {
    if (value === "full") return `max-width: 100% !important; margin-left: 0 !important; margin-right: 0 !important; width: 100% !important;`;
    const widthMap: Record<string, string> = {
      "boxed-sm": "384px",
      "boxed-md": "448px",
      "boxed-lg": "512px",
      "boxed-xl": "576px",
    };
    return `max-width: ${widthMap[value] || value} !important; margin-left: auto !important; margin-right: auto !important; width: 100% !important;`;
  }

  if (key === "minHeight") {
    const heightMap: Record<string, string> = {
      auto: "auto",
      screen: "100vh",
      "h-300": "300px",
      "h-500": "500px",
      "h-700": "700px",
    };
    return `min-height: ${heightMap[value] || value} !important;`;
  }

  return "";
}

export function generateResponsiveCSS(
  elements: CanvasElement[],
  palette: PageSettings["themePalette"]
): string {
  const tabletRules: string[] = [];
  const mobileRules: string[] = [];

  elements.forEach((el) => {
    if (el.styles.tablet) {
      const declarations: string[] = [];
      const wrapperDeclarations: string[] = [];

      Object.entries(el.styles.tablet).forEach(([key, val]) => {
        if (key === "align" && el.type === "button") {
          const flexAlign = val === "center" ? "center" : val === "right" ? "flex-end" : "flex-start";
          wrapperDeclarations.push(`justify-content: ${flexAlign} !important;`);
        } else {
          const dec = getCSSDeclaration(key, val as string, el.type, palette);
          if (dec) declarations.push(dec);
        }
      });

      if (declarations.length > 0) {
        tabletRules.push(`#${el.id} { ${declarations.join(" ")} }`);
      }
      if (wrapperDeclarations.length > 0) {
        tabletRules.push(`#${el.id}-wrapper { ${wrapperDeclarations.join(" ")} }`);
      }
    }

    if (el.styles.mobile) {
      const declarations: string[] = [];
      const wrapperDeclarations: string[] = [];

      Object.entries(el.styles.mobile).forEach(([key, val]) => {
        if (key === "align" && el.type === "button") {
          const flexAlign = val === "center" ? "center" : val === "right" ? "flex-end" : "flex-start";
          wrapperDeclarations.push(`justify-content: ${flexAlign} !important;`);
        } else {
          const dec = getCSSDeclaration(key, val as string, el.type, palette);
          if (dec) declarations.push(dec);
        }
      });

      if (declarations.length > 0) {
        mobileRules.push(`#${el.id} { ${declarations.join(" ")} }`);
      }
      if (wrapperDeclarations.length > 0) {
        mobileRules.push(`#${el.id}-wrapper { ${wrapperDeclarations.join(" ")} }`);
      }
    }
  });

  let responsiveCSS = "";
  if (tabletRules.length > 0) {
    responsiveCSS += `
    /* Tablet Overrides */
    @media (max-width: 1024px) {
      ${tabletRules.join("\n      ")}
    }`;
  }
  if (mobileRules.length > 0) {
    responsiveCSS += `
    /* Mobile Overrides */
    @media (max-width: 640px) {
      ${mobileRules.join("\n      ")}
    }`;
  }

  return responsiveCSS;
}
