import { CanvasElement, PageSettings } from "@/types/builder";
import {
  mapColor,
  getStyleClasses,
  isOrderedListType,
  parseNestedListItems,
  getNestedMarkerType,
  buildListTree,
  ListNode,
  formatHref,
} from "./style-utils";
import { SPACE_MAP } from "./style-maps";
import { generateResponsiveCSS } from "./css-generator";
import { buildDocumentHtml } from "./document-template";

import {
  getButtonIconHtml,
  getLoadingSpinnerHtml,
} from "./button-icons";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function compileTreeNodesToHtml(
  nodes: ListNode[],
  rootListType: string,
  resolvedMarkerColor?: string,
  isCustomSymbol?: boolean,
  itemMarginClass?: string
): string {
  const isOrdered = isOrderedListType(rootListType);
  const subTag = isOrdered ? "ol" : "ul";

  return nodes
    .map((node) => {
      const escaped = escapeHtml(node.text);
      const markerType = getNestedMarkerType(rootListType, node.level);
      const listStyleTypeAttr = isCustomSymbol ? "none" : markerType;

      const childrenHtml =
        node.children.length > 0
          ? `\n<${subTag} class="flex flex-col pl-6 mt-1">\n${compileTreeNodesToHtml(
              node.children,
              rootListType,
              resolvedMarkerColor,
              isCustomSymbol,
              itemMarginClass
            )}\n</${subTag}>`
          : "";

      if (rootListType === "checkmark") {
        const symbolColor = resolvedMarkerColor || "currentColor";
        return `<li class="${itemMarginClass} flex items-start gap-2" style="list-style-type: none;"><span style="color: ${symbolColor}; font-weight: bold; flex-shrink: 0;">✓</span><span>${escaped}</span>${childrenHtml}</li>`;
      }
      if (rootListType === "dash") {
        const symbolColor = resolvedMarkerColor || "currentColor";
        return `<li class="${itemMarginClass} flex items-start gap-2" style="list-style-type: none;"><span style="color: ${symbolColor}; font-weight: bold; flex-shrink: 0;">–</span><span>${escaped}</span>${childrenHtml}</li>`;
      }
      return `<li class="${itemMarginClass}" style="list-style-type: ${listStyleTypeAttr};">${escaped}${childrenHtml}</li>`;
    })
    .join("\n");
}

function getElementInlineStyles(el: CanvasElement, palette: PageSettings["themePalette"]): string {
  const styles: string[] = [];

  if (el.type === "button") {
    const variant = el.styles.buttonVariant || "solid";
    const mappedColor = el.styles.color ? mapColor(el.styles.color, palette) : "var(--brand-cyan-active)";

    if (variant === "outline") {
      styles.push("background-color: transparent");
      styles.push(`color: ${mappedColor}`);
      styles.push("border-style: solid");
      styles.push(`border-width: ${el.styles.borderWidth || "1.5"}px`);
      styles.push(`border-color: ${el.styles.borderColor ? mapColor(el.styles.borderColor, palette) : mappedColor}`);
    } else if (variant === "ghost") {
      styles.push("background-color: transparent");
      styles.push(`color: ${mappedColor}`);
      styles.push("border: none");
    } else if (variant === "soft") {
      styles.push("background-color: var(--accent-soft, rgba(2, 169, 247, 0.15))");
      styles.push(`color: ${mappedColor}`);
    } else if (variant === "glass") {
      styles.push("background-color: rgba(255, 255, 255, 0.15)");
      styles.push(`color: ${mappedColor}`);
      styles.push("backdrop-filter: blur(8px)");
      styles.push("-webkit-backdrop-filter: blur(8px)");
      styles.push("border-style: solid");
      styles.push("border-width: 1px");
      styles.push("border-color: rgba(255, 255, 255, 0.25)");
    } else {
      if (el.styles.color) {
        styles.push(`background-color: ${mappedColor}`);
        const val = el.styles.color.toLowerCase().trim();
        const isLightBg = ["#d4f0fc", "#89d6fb", "var(--brand-ice-blue)", "var(--brand-sky-blue)"].includes(val);
        const txtColor = isLightBg ? "var(--brand-dark-slate)" : "#ffffff";
        styles.push(`color: ${txtColor}`);
      }
    }
  } else {
    if (el.styles.color) {
      const mapped = mapColor(el.styles.color, palette);
      if (["section", "container", "grid-2"].includes(el.type)) {
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
  }

  if (el.styles.fontFamily) {
    styles.push(`font-family: '${el.styles.fontFamily}', sans-serif`);
  }

  if (el.styles.minHeight) {
    if (el.styles.minHeight === "h-300") styles.push("min-height: 300px");
    else if (el.styles.minHeight === "h-500") styles.push("min-height: 500px");
    else if (el.styles.minHeight === "h-700") styles.push("min-height: 700px");
  }

  if (el.type === "list") {
    const listType = el.styles.listStyleType || "disc";
    const isCustomSymbol = listType === "checkmark" || listType === "dash";
    styles.push(`list-style-type: ${isCustomSymbol ? "none" : listType}`);
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
      return `<h2 id="${el.id}" class="font-extrabold tracking-tight leading-tight ${styleClasses}" ${styleAttr}>${escapeHtml(el.content)}</h2>`;

    case "paragraph":
      return `<p id="${el.id}" class="leading-relaxed ${styleClasses}" ${styleAttr}>${escapeHtml(el.content)}</p>`;

    case "button": {
      const variant = el.styles.buttonVariant || "solid";
      const size = el.styles.buttonSize || "md";
      const widthMode = el.styles.buttonWidth || "auto";
      const icon = el.styles.buttonIcon || "none";
      const iconPos = el.styles.iconPosition || "right";
      const hover = el.styles.hoverEffect || "none";
      const target = el.linkTarget === "_blank" ? '_blank' : '_self';
      const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';

      const SIZE_CLASSES: Record<string, string> = {
        sm: "px-3 h-8 text-xs font-semibold gap-1.5",
        md: "px-6 h-10 text-xs font-bold gap-2",
        lg: "px-8 h-12 text-sm font-bold gap-2.5",
        xl: "px-10 h-14 text-base font-extrabold gap-3",
      };
      const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
      const widthClass = widthMode === "full" ? "w-full" : "w-auto";

      const align =
        widthMode === "full"
          ? "justify-center"
          : el.styles.align === "center"
          ? "justify-center"
          : el.styles.align === "right"
          ? "justify-end"
          : "justify-start";

      let hoverClass = "hover:opacity-90";
      if (hover === "lift") {
        hoverClass = "hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200";
      } else if (hover === "scale") {
        hoverClass = "hover:scale-[1.03] transition-transform duration-200";
      } else if (hover === "glow") {
        hoverClass = "hover:shadow-[0_0_20px_rgba(2,169,247,0.5)] transition-shadow duration-200";
      } else if (hover === "shine") {
        hoverClass = "relative overflow-hidden group";
      }

      const iconHtml = getButtonIconHtml(icon, "w-4 h-4 shrink-0");

      const shineSheenHtml = hover === "shine"
        ? '<span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"></span>'
        : '';

      const leftIconHtml = iconPos === "left" && iconHtml ? `${iconHtml} ` : '';
      const rightIconHtml = iconPos === "right" && iconHtml ? ` ${iconHtml}` : '';
      const shadowClass = ["ghost", "outline", "soft"].includes(variant) ? "" : "shadow-md";

      return `<div id="${el.id}-wrapper" class="flex w-full ${align}">
        <a id="${el.id}" href="${escapeHtml(formatHref(el.link))}" target="${target}"${relAttr} class="select-none ${shadowClass} flex items-center justify-center transition-all duration-200 ${sizeClass} ${widthClass} ${hoverClass} ${styleClasses}" ${styleAttr}>
          ${shineSheenHtml}${leftIconHtml}<span>${escapeHtml(el.content)}</span>${rightIconHtml}
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
          const combinedStyles = [inlineStyles, `padding: ${basePadding}`]
            .filter(Boolean)
            .join("; ");
          const watermark = `<span class="absolute text-6xl font-serif text-cyan-active opacity-15 select-none pointer-events-none" style="left: ${basePadding}; top: calc(${basePadding} - 0.25rem);">“</span>`;
          const alignClass = el.styles.align ? "" : "text-center";

          return `<blockquote id="${el.id}" class="relative overflow-hidden ${alignClass} ${styleClasses}" style="${combinedStyles}">
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

          return `<blockquote id="${el.id}" class="tracking-wide italic font-medium ${alignClass} ${styleClasses}" style="${combinedStyles}">
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

          return `<blockquote id="${el.id}" class="relative italic ${styleClasses}" style="${combinedStyles}">
            ${accentLine}
            ${el.content}
          </blockquote>`;
        }
      }
    }

    case "list": {
      const parsedItems = parseNestedListItems(el.content);
      const displayItems =
        parsedItems.length > 0
          ? parsedItems
          : [{ text: "List item bullet point", level: 0 }];

      const treeNodes = buildListTree(displayItems);
      const rootListType = el.styles.listStyleType || "disc";
      const isOrdered = isOrderedListType(rootListType);
      const isCustomSymbol = rootListType === "checkmark" || rootListType === "dash";

      const GAP_CLASSES: Record<string, string> = {
        "space-none": "mb-0",
        "space-xs": "mb-1",
        "space-sm": "mb-2",
        "space-md": "mb-4",
        "space-lg": "mb-6",
      };
      const itemMarginClass = GAP_CLASSES[el.styles.itemSpacing || "space-xs"] || "mb-1";

      const tag = isOrdered ? "ol" : "ul";
      const startAttr = isOrdered && el.styles.startNumber ? ` start="${el.styles.startNumber}"` : "";

      const resolvedMarkerColor = el.styles.markerColor ? mapColor(el.styles.markerColor, palette) : undefined;
      const markerStyleRule = resolvedMarkerColor && !isCustomSymbol
        ? `<style>#${el.id}::marker, #${el.id} li::marker { color: ${resolvedMarkerColor}; }</style>\n`
        : "";

      const itemsHtml = compileTreeNodesToHtml(
        treeNodes,
        rootListType,
        resolvedMarkerColor,
        isCustomSymbol,
        itemMarginClass
      );

      return `${markerStyleRule}<${tag} id="${el.id}"${startAttr} class="flex flex-col pl-5 ${styleClasses}" ${styleAttr}>\n${itemsHtml}\n</${tag}>`;
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
