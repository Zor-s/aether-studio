import { CanvasElement, PageSettings } from "@/types/builder";
import { mapColor, getStyleClasses } from "./style-utils";
import { SPACE_MAP } from "./style-maps";

function escapeHtmlAttr(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeScriptTag(jsCode: string): string {
  if (!jsCode) return '';
  return jsCode.replace(/<\/script>/gi, '<\\/script>');
}

function getElementInlineStyles(el: CanvasElement, palette: PageSettings['themePalette']): string {
  const styles: string[] = [];
  
  if (el.styles.color) {
    const mapped = mapColor(el.styles.color, palette);
    if (['button', 'section', 'container', 'grid-2'].includes(el.type)) {
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

  if (el.styles.borderStyle && el.styles.borderStyle !== 'none') {
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
    if (el.styles.minHeight === 'h-300') styles.push('min-height: 300px');
    else if (el.styles.minHeight === 'h-500') styles.push('min-height: 500px');
    else if (el.styles.minHeight === 'h-700') styles.push('min-height: 700px');
  }

  return styles.join('; ');
}

function compileElement(el: CanvasElement, allElements: CanvasElement[], palette: PageSettings['themePalette']): string {
  const styleClasses = getStyleClasses(el, "desktop");
  const inlineStyles = getElementInlineStyles(el, palette);
  const styleAttr = inlineStyles ? `style="${inlineStyles}"` : '';

  const children = allElements.filter(child => child.parentId === el.id);
  const childrenHtml = children.map(child => compileElement(child, allElements, palette)).join('\n');

  switch (el.type) {
    case 'section':
      return `<section id="${el.id}" class="${styleClasses}" ${styleAttr}>
        ${childrenHtml}
      </section>`;
    
    case 'grid-2':
      return `<div id="${el.id}" class="${styleClasses}" ${styleAttr}>
        ${childrenHtml}
      </div>`;

    case 'container':
      return `<div id="${el.id}" class="${styleClasses}" ${styleAttr}>
        ${childrenHtml}
      </div>`;

    case 'headline':
      return `<h2 id="${el.id}" class="font-extrabold tracking-tight leading-tight ${styleClasses}" ${styleAttr}>${el.content}</h2>`;

    case 'paragraph':
      return `<p id="${el.id}" class="leading-relaxed ${styleClasses}" ${styleAttr}>${el.content}</p>`;

    case 'button': {
      const align = el.styles.align === 'center' ? 'justify-center' : el.styles.align === 'right' ? 'justify-end' : 'justify-start';
      return `<div id="${el.id}-wrapper" class="flex ${align}">
        <a id="${el.id}" href="${el.link || '#'}" class="px-6 h-10 select-none font-bold text-xs shadow-md flex items-center justify-center transition-all hover:opacity-90 ${styleClasses}" ${styleAttr}>
          ${el.content}
        </a>
      </div>`;
    }

    case 'subheading':
      return `<h3 id="${el.id}" class="font-semibold tracking-tight ${styleClasses}" ${styleAttr}>${el.content}</h3>`;

    case 'blockquote': {
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
          const combinedStyles = [
            inlineStyles,
            `padding: ${basePadding}`,
          ]
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

    case 'list': {
      const items = el.content.split('\n').filter(Boolean);
      const itemsHtml = items.map(item => `<li class="mb-1">${item}</li>`).join('\n');
      return `<ul id="${el.id}" class="list-disc pl-5 ${styleClasses}" ${styleAttr}>\n${itemsHtml}\n</ul>`;
    }

    case 'divider':
      return `<hr id="${el.id}" class="w-full my-4 border-t ${styleClasses}" ${styleAttr} />`;

    default:
      return '';
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
        ])
      ].filter((font): font is string => !!font)
    )
  );

  const fontImports = uniqueFonts.length > 0
    ? uniqueFonts.map(f => `@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800&display=swap');`).join('\n')
    : '';

  const rootElements = elements.filter(el => !el.parentId || !elements.some(p => p.id === el.parentId));
  const elementsHtml = rootElements.map(el => compileElement(el, elements, settings.themePalette)).join('\n');

  // Generate mobile and tablet overrides CSS
  const tabletRules: string[] = [];
  const mobileRules: string[] = [];

  elements.forEach((el) => {
    // Tablet overrides
    if (el.styles.tablet) {
      const declarations: string[] = [];
      const wrapperDeclarations: string[] = [];

      Object.entries(el.styles.tablet).forEach(([key, val]) => {
        if (key === 'align' && el.type === 'button') {
          const flexAlign = val === 'center' ? 'center' : val === 'right' ? 'flex-end' : 'flex-start';
          wrapperDeclarations.push(`justify-content: ${flexAlign} !important;`);
        } else {
          const dec = getCSSDeclaration(key, val as string, el.type, settings.themePalette);
          if (dec) declarations.push(dec);
        }
      });

      if (declarations.length > 0) {
        tabletRules.push(`#${el.id} { ${declarations.join(' ')} }`);
      }
      if (wrapperDeclarations.length > 0) {
        tabletRules.push(`#${el.id}-wrapper { ${wrapperDeclarations.join(' ')} }`);
      }
    }

    // Mobile overrides
    if (el.styles.mobile) {
      const declarations: string[] = [];
      const wrapperDeclarations: string[] = [];

      Object.entries(el.styles.mobile).forEach(([key, val]) => {
        if (key === 'align' && el.type === 'button') {
          const flexAlign = val === 'center' ? 'center' : val === 'right' ? 'flex-end' : 'flex-start';
          wrapperDeclarations.push(`justify-content: ${flexAlign} !important;`);
        } else {
          const dec = getCSSDeclaration(key, val as string, el.type, settings.themePalette);
          if (dec) declarations.push(dec);
        }
      });

      if (declarations.length > 0) {
        mobileRules.push(`#${el.id} { ${declarations.join(' ')} }`);
      }
      if (wrapperDeclarations.length > 0) {
        mobileRules.push(`#${el.id}-wrapper { ${wrapperDeclarations.join(' ')} }`);
      }
    }
  });

  // Construct media queries block
  let responsiveCSS = '';
  if (tabletRules.length > 0) {
    responsiveCSS += `
    /* Tablet Overrides */
    @media (max-width: 1024px) {
      ${tabletRules.join('\n      ')}
    }`;
  }
  if (mobileRules.length > 0) {
    responsiveCSS += `
    /* Mobile Overrides */
    @media (max-width: 640px) {
      ${mobileRules.join('\n      ')}
    }`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlAttr(settings.seoTitle || 'Portfolio')}</title>
  <meta name="description" content="${escapeHtmlAttr(settings.seoDescription || '')}">
  ${settings.faviconUrl ? `<link rel="icon" href="${escapeHtmlAttr(settings.faviconUrl)}" type="image/x-icon">` : ''}
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'ice-blue': 'var(--brand-ice-blue)',
            'sky-blue': 'var(--brand-sky-blue)',
            'cyan-active': 'var(--brand-cyan-active)',
            'deep-teal': 'var(--brand-deep-teal)',
            'dark-slate': 'var(--brand-dark-slate)',
          }
        }
      }
    }
  </script>

  <style>
    ${fontImports}

    :root {
      --brand-ice-blue: ${settings.themePalette.iceBlue};
      --brand-sky-blue: ${settings.themePalette.skyBlue};
      --brand-cyan-active: ${settings.themePalette.cyanActive};
      --brand-deep-teal: ${settings.themePalette.deepTeal};
      --brand-dark-slate: ${settings.themePalette.darkSlate};
    }

    /* Spacing Overrides */
    .m-none { margin: 0; }
    .m-xs { margin: 0.25rem; }
    .m-sm { margin: 0.5rem; }
    .m-md { margin: 1rem; }
    .m-lg { margin: 1.5rem; }
    .m-xl { margin: 2rem; }
    .m-2xl { margin: 3rem; }

    .my-none { margin-top: 0; margin-bottom: 0; }
    .my-xs { margin-top: 0.25rem; margin-bottom: 0.25rem; }
    .my-sm { margin-top: 0.5rem; margin-bottom: 0.5rem; }
    .my-md { margin-top: 1rem; margin-bottom: 1rem; }
    .my-lg { margin-top: 1.5rem; margin-bottom: 1.5rem; }
    .my-xl { margin-top: 2rem; margin-bottom: 2rem; }
    .my-2xl { margin-top: 3rem; margin-bottom: 3rem; }

    .p-none { padding: 0; }
    .p-xs { padding: 0.25rem; }
    .p-sm { padding: 0.5rem; }
    .p-md { padding: 1rem; }
    .p-lg { padding: 1.5rem; }
    .p-xl { padding: 2rem; }
    .p-2xl { padding: 3rem; }

    /* Custom Base settings */
    body {
      background-color: ${mapColor(settings.backgroundColor || '#01303f', settings.themePalette)};
      color: ${mapColor(settings.textColor || '#ffffff', settings.themePalette)};
      font-family: '${settings.fontFamily || 'Inter'}', sans-serif;
      min-height: 100vh;
      margin: 0;
      padding: ${
        settings.padding === "space-none" ? "0" :
        settings.padding === "space-xs" ? "0.25rem" :
        settings.padding === "space-sm" ? "0.5rem" :
        settings.padding === "space-md" ? "1rem" :
        settings.padding === "space-lg" ? "2rem 1.5rem" :
        settings.padding === "space-xl" ? "3rem 2rem" :
        settings.padding === "space-2xl" ? "4rem 3rem" : "2rem 1.5rem"
      };
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    
    .portfolio-wrapper {
      width: 100%;
      max-width: ${
        settings.widthMode === "boxed-md" ? "768px" :
        settings.widthMode === "boxed-lg" ? "1024px" :
        settings.widthMode === "boxed-xl" ? "1280px" :
        settings.widthMode === "full" ? "100%" : "768px"
      };
      display: flex;
      flex-direction: column;
      gap: ${
        settings.gap === "space-none" ? "0" :
        settings.gap === "space-xs" ? "0.25rem" :
        settings.gap === "space-sm" ? "0.5rem" :
        settings.gap === "space-md" ? "1rem" :
        settings.gap === "space-lg" ? "1.5rem" :
        settings.gap === "space-xl" ? "2rem" :
        settings.gap === "space-2xl" ? "3rem" : "1.5rem"
      };
    }
    ${responsiveCSS}
  </style>

  ${settings.customJs ? `<script>${escapeScriptTag(settings.customJs)}</script>` : ''}
</head>
<body>
  <div class="portfolio-wrapper">
    ${elementsHtml}
  </div>
</body>
</html>`;

  return html;
}

function getCSSDeclaration(key: string, value: string, elType: string, palette: PageSettings['themePalette']): string {
  if (value === undefined || value === null) return '';

  // 1. Spacing/Margin Scale
  if (key === 'margin') {
    const marginMap: Record<string, string> = {
      'space-none': '0',
      'space-xs': '0.25rem',
      'space-sm': '0.5rem',
      'space-md': '1rem',
      'space-lg': '1.5rem',
      'space-xl': '2rem',
      'space-2xl': '3rem',
    };
    if (['section', 'container', 'grid-2'].includes(elType)) {
      const val = marginMap[value] || value;
      return `margin-top: ${val} !important; margin-bottom: ${val} !important;`;
    }
    return `margin: ${marginMap[value] || value} !important;`;
  }

  // 2. Spacing/Padding Scale
  if (key === 'padding') {
    const paddingMap: Record<string, string> = {
      'space-none': '0',
      'space-xs': '0.25rem',
      'space-sm': '0.5rem',
      'space-md': '1rem',
      'space-lg': '1.5rem',
      'space-xl': '2rem',
      'space-2xl': '3rem',
    };
    return `padding: ${paddingMap[value] || value} !important;`;
  }

  // 3. Font Size Scale
  if (key === 'fontSize') {
    const sizeMap: Record<string, string> = {
      'text-xs': '0.78125rem',
      'text-sm': '0.90625rem',
      'text-md': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem',
      'text-2xl': '1.5rem',
      'text-3xl': '1.875rem',
    };
    return `font-size: ${sizeMap[value] || value} !important;`;
  }

  // 4. Alignment
  if (key === 'align') {
    return `text-align: ${value} !important;`;
  }

  // 5. Border Radius
  if (key === 'borderRadius') {
    const radiusMap: Record<string, string> = {
      'rounded-none': '0px',
      'rounded-sm': '0.125rem',
      'rounded-md': '0.375rem',
      'rounded-lg': '0.5rem',
      'rounded-xl': '0.75rem',
      'rounded-2xl': '1rem',
      'rounded-full': '9999px',
    };
    return `border-radius: ${radiusMap[value] || value} !important;`;
  }

  // 6. Font Weight
  if (key === 'fontWeight') {
    const weightMap: Record<string, string> = {
      'font-light': '300',
      'font-normal': '400',
      'font-medium': '500',
      'font-semibold': '600',
      'font-bold': '700',
      'font-extrabold': '800',
    };
    return `font-weight: ${weightMap[value] || value} !important;`;
  }

  // 7. Letter Spacing
  if (key === 'letterSpacing') {
    const spacingMap: Record<string, string> = {
      'tracking-tighter': '-0.05em',
      'tracking-tight': '-0.025em',
      'tracking-normal': '0em',
      'tracking-wide': '0.025em',
      'tracking-wider': '0.05em',
      'tracking-widest': '0.1em',
    };
    return `letter-spacing: ${spacingMap[value] || value} !important;`;
  }

  // 8. Colors & Borders
  if (key === 'color') {
    const mapped = mapColor(value, palette);
    if (['button', 'section', 'container', 'grid-2'].includes(elType)) {
      const val = value.toLowerCase().trim();
      const isLightBg = ["#d4f0fc", "#89d6fb", "var(--brand-ice-blue)", "var(--brand-sky-blue)"].includes(val);
      const txtColor = isLightBg ? "var(--brand-dark-slate)" : "#ffffff";
      return `background-color: ${mapped} !important; color: ${txtColor} !important;`;
    }
    return `color: ${mapped} !important;`;
  }
  if (key === 'backgroundColor') {
    return `background-color: ${mapColor(value, palette)} !important;`;
  }
  if (key === 'borderStyle') {
    return `border-style: ${value} !important;`;
  }
  if (key === 'borderWidth') {
    return `border-width: ${value}px !important;`;
  }
  if (key === 'borderColor') {
    return `border-color: ${mapColor(value, palette)} !important;`;
  }
  if (key === 'fontFamily') {
    return `font-family: '${value}', sans-serif !important;`;
  }
  if (key === 'direction') {
    return `flex-direction: ${value === 'row' ? 'row' : 'column'} !important;`;
  }
  if (key === 'justify') {
    const justifyMap: Record<string, string> = {
      'center': 'center',
      'start': 'flex-start',
      'end': 'flex-end',
      'between': 'space-between',
    };
    return `justify-content: ${justifyMap[value] || value} !important;`;
  }
  if (key === 'alignItems') {
    const alignMap: Record<string, string> = {
      'center': 'center',
      'start': 'flex-start',
      'end': 'flex-end',
      'stretch': 'stretch',
    };
    return `align-items: ${alignMap[value] || value} !important;`;
  }
  if (key === 'gap') {
    const gapMap: Record<string, string> = {
      'space-none': '0',
      'space-xs': '0.25rem',
      'space-sm': '0.5rem',
      'space-md': '1rem',
      'space-lg': '1.5rem',
      'space-xl': '2rem',
      'space-2xl': '3rem',
    };
    return `gap: ${gapMap[value] || value} !important;`;
  }
  if (key === 'widthMode') {
    if (value === 'full') return `max-width: 100% !important; margin-left: 0 !important; margin-right: 0 !important; width: 100% !important;`;
    const widthMap: Record<string, string> = {
      'boxed-sm': '384px',
      'boxed-md': '448px',
      'boxed-lg': '512px',
      'boxed-xl': '576px',
    };
    return `max-width: ${widthMap[value] || value} !important; margin-left: auto !important; margin-right: auto !important; width: 100% !important;`;
  }
  if (key === 'minHeight') {
    const heightMap: Record<string, string> = {
      'auto': 'auto',
      'screen': '100vh',
      'h-300': '300px',
      'h-500': '500px',
      'h-700': '700px',
    };
    return `min-height: ${heightMap[value] || value} !important;`;
  }

  return '';
}
