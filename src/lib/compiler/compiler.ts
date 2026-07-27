import { CanvasElement, PageSettings } from "@/types/builder";
import { mapColor, getStyleClasses } from "./style-utils";
import { SPACE_MAP } from "./style-maps";
import { generateResponsiveCSS } from "./css-generator";
import { buildDocumentHtml } from "./document-template";

function getElementInlineStyles(el: CanvasElement, palette: PageSettings["themePalette"]): string {
  const styles: string[] = [];

  if (el.styles.color) {
    const mapped = mapColor(el.styles.color, palette);
    if (["button", "section", "container", "grid-2"].includes(el.type)) {
      styles.push(`background-color: ${mapped}`);
      const val = el.styles.color.toLowerCase().trim();
      const isLightBg = ["#d4f0fc", "#89d6fb", "var(--brand-ice-blue)", "var(--brand-sky-blue)"].includes(val);
      const txtColor = isLightBg ? "var(--brand-dark-slate)" : "#ffffff";
      styles.push(`color: ${txtColor}`);
    } else {
      styles.push(`color: ${mapped}`);
    }
  }

  if (el.styles.backgroundColor) {
    styles.push(`background-color: ${mapColor(el.styles.backgroundColor, palette)}`);
  }

  if (el.styles.borderStyle && el.styles.borderStyle !== "none") {
    styles.push(`border-style: ${el.styles.borderStyle}`);
    styles.push(`border-width: ${el.styles.borderWidth || 0}px`);
    if (el.styles.borderColor) {
      styles.push(`border-color: ${mapColor(el.styles.borderColor, palette)}`);
    } else {
      styles.push(`border-color: var(--panel-border)`);
    }
  }

  if (el.styles.fontFamily) {
    styles.push(`font-family: '${el.styles.fontFamily}', sans-serif`);
  }

  if (el.styles.minHeight) {
    if (el.styles.minHeight === "h-300") styles.push("min-height: 300px");
    else if (el.styles.minHeight === "h-500") styles.push("min-height: 500px");
    else if (el.styles.minHeight === "h-700") styles.push("min-height: 700px");
  }

  return styles.join("; ");
}

function compileElement(
  el: CanvasElement,
  allElements: CanvasElement[],
  palette: PageSettings["themePalette"]
): string {
  const styleClasses = getStyleClasses(el, "desktop");
  const inlineStyles = getElementInlineStyles(el, palette);
  const styleAttr = inlineStyles ? `style="${inlineStyles}"` : "";

  const children = allElements.filter((child) => child.parentId === el.id);
  const childrenHtml = children
    .map((child) => compileElement(child, allElements, palette))
    .join("\n");

  switch (el.type) {
    case "section":
      return `<section id="${el.id}" class="${styleClasses}" ${styleAttr}>
        ${childrenHtml}
      </section>`;

    case "grid-2":
      return `<div id="${el.id}" class="${styleClasses}" ${styleAttr}>
        ${childrenHtml}
      </div>`;

    case "container":
      return `<div id="${el.id}" class="${styleClasses}" ${styleAttr}>
        ${childrenHtml}
      </div>`;

    case "headline":
      return `<h2 id="${el.id}" class="font-extrabold tracking-tight leading-tight ${styleClasses}" ${styleAttr}>${el.content}</h2>`;

    case "paragraph":
      return `<p id="${el.id}" class="leading-relaxed ${styleClasses}" ${styleAttr}>${el.content}</p>`;

    case "button": {
      const align =
        el.styles.align === "center"
          ? "justify-center"
          : el.styles.align === "right"
          ? "justify-end"
          : "justify-start";
      return `<div id="${el.id}-wrapper" class="flex ${align}">
        <a id="${el.id}" href="${el.link || "#"}" class="px-6 h-10 select-none font-bold text-xs shadow-md flex items-center justify-center transition-all hover:opacity-90 ${styleClasses}" ${styleAttr}>
          ${el.content}
        </a>
      </div>`;
    }

    case "subheading":
      return `<h3 id="${el.id}" class="font-semibold tracking-tight ${styleClasses}" ${styleAttr}>${el.content}</h3>`;

    case "blockquote": {
      const quoteLineColorVal = el.styles.quoteLineColor || palette.cyanActive;
      const resolvedQuoteLineColor = mapColor(quoteLineColorVal, palette);
      const variant = el.styles.quoteVariant || "classic";
      const basePadding = el.styles.padding
        ? SPACE_MAP[el.styles.padding] || el.styles.padding
        : "0.5rem";

      switch (variant) {
        case "callout": {
          const hasRadius = !!el.styles.borderRadius;
          const radiusClass = hasRadius ? "" : "rounded-2xl";
          const combinedStyles = [inlineStyles, `padding: ${basePadding}`]
            .filter(Boolean)
            .join("; ");
          const watermark = `<span class="absolute text-6xl font-serif text-cyan-active opacity-15 select-none pointer-events-none" style="left: ${basePadding}; top: calc(${basePadding} - 0.25rem);">“</span>`;
          const alignClass = el.styles.align ? "" : "text-center";
          const bgClass = el.styles.backgroundColor ? "" : "bg-accent-soft/15";

          return `<blockquote id="${el.id}" class="relative overflow-hidden shadow-sm border border-panel-border/30 ${alignClass} ${radiusClass} ${bgClass} ${styleClasses}" style="${combinedStyles}">
            ${watermark}
            <p class="relative z-10 italic font-medium m-0 w-full">${el.content}</p>
          </blockquote>`;
        }

        case "elegant": {
          const paddingLeft = `calc(${basePadding} + 1.75rem)`;
          const paddingRight = `calc(${basePadding} + 1.75rem)`;
          const paddingTop = `calc(${basePadding} + 0.25rem)`;
          const paddingBottom = `calc(${basePadding} + 0.25rem)`;
          const combinedStyles = [
            inlineStyles,
            `padding-left: ${paddingLeft}`,
            `padding-right: ${paddingRight}`,
            `padding-top: ${paddingTop}`,
            `padding-bottom: ${paddingBottom}`,
          ]
            .filter(Boolean)
            .join("; ");

          const topQuote = `<span class="absolute text-5xl font-serif font-black leading-none select-none opacity-60" style="left: ${basePadding}; top: ${basePadding}; color: ${resolvedQuoteLineColor};">“</span>`;
          const bottomQuote = `<span class="absolute text-5xl font-serif font-black leading-none select-none opacity-60" style="right: ${basePadding}; bottom: calc(${basePadding} - 0.5rem); color: ${resolvedQuoteLineColor};">”</span>`;

          return `<blockquote id="${el.id}" class="relative w-full italic ${styleClasses}" style="${combinedStyles}">
            ${topQuote}
            <p class="m-0 leading-relaxed font-medium w-full">${el.content}</p>
            ${bottomQuote}
          </blockquote>`;
        }

        case "banner": {
          const combinedStyles = [
            inlineStyles,
            `border-top: 2px solid ${resolvedQuoteLineColor}`,
            `border-bottom: 2px solid ${resolvedQuoteLineColor}`,
            `padding: ${basePadding}`,
          ]
            .filter(Boolean)
            .join("; ");
          const alignClass = el.styles.align ? "" : "text-center";
          const bgClass = el.styles.backgroundColor ? "" : "bg-accent-soft/5";

          return `<blockquote id="${el.id}" class="tracking-wide italic font-medium ${alignClass} ${bgClass} ${styleClasses}" style="${combinedStyles}">
            “ ${el.content} ”
          </blockquote>`;
        }

        case "classic":
        default: {
          const paddingLeft = `calc(${basePadding} + 1rem)`;
          const combinedStyles = [
            inlineStyles,
            `padding-left: ${paddingLeft}`,
            `padding-top: ${basePadding}`,
            `padding-bottom: ${basePadding}`,
            `padding-right: ${basePadding}`,
          ]
            .filter(Boolean)
            .join("; ");
          const accentLine = `<span class="absolute rounded-full" style="left: ${basePadding}; top: ${basePadding}; bottom: ${basePadding}; width: 4px; background-color: ${resolvedQuoteLineColor};"></span>`;
          const hasRadius = !!el.styles.borderRadius;
          const radiusClass = hasRadius ? "" : "rounded-r-xl";
          const bgClass = el.styles.backgroundColor ? "" : "bg-accent-soft/10";

          return `<blockquote id="${el.id}" class="relative italic border border-l-0 border-panel-border/30 ${radiusClass} ${bgClass} ${styleClasses}" style="${combinedStyles}">
            ${accentLine}
            ${el.content}
          </blockquote>`;
        }
      }
    }

    case "list": {
      const items = el.content.split("\n").filter(Boolean);
      const itemsHtml = items.map((item) => `<li class="mb-1">${item}</li>`).join("\n");
      return `<ul id="${el.id}" class="list-disc pl-5 ${styleClasses}" ${styleAttr}>\n${itemsHtml}\n</ul>`;
    }

    case "divider":
      return `<hr id="${el.id}" class="w-full my-4 border-t ${styleClasses}" ${styleAttr} />`;

    default:
      return "";
  }
}

export function compileLayout(elements: CanvasElement[], settings: PageSettings): string {
  const uniqueFonts = Array.from(
    new Set(
      [
        settings.fontFamily,
        ...elements.flatMap((el) => [
          el.styles.fontFamily,
          el.styles.mobile?.fontFamily,
          el.styles.tablet?.fontFamily,
        ]),
      ].filter((font): font is string => !!font)
    )
  );

  const fontImports =
    uniqueFonts.length > 0
      ? uniqueFonts
          .map(
            (f) =>
              `@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(
                f
              )}:wght@300;400;500;600;700;800&display=swap');`
          )
          .join("\n")
      : "";

  const rootElements = elements.filter(
    (el) => !el.parentId || !elements.some((p) => p.id === el.parentId)
  );
  const elementsHtml = rootElements
    .map((el) => compileElement(el, elements, settings.themePalette))
    .join("\n");

  const responsiveCSS = generateResponsiveCSS(elements, settings.themePalette);

  return buildDocumentHtml(elementsHtml, fontImports, responsiveCSS, settings);
}
