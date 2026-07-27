import { PageSettings } from "@/types/builder";
import { mapColor } from "./style-utils";

function escapeHtmlAttr(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeScriptTag(jsCode: string): string {
  if (!jsCode) return "";
  return jsCode.replace(/<\/script>/gi, "<\\/script>");
}

export function buildDocumentHtml(
  elementsHtml: string,
  fontImports: string,
  responsiveCSS: string,
  settings: PageSettings
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtmlAttr(settings.seoTitle || "Portfolio")}</title>
  <meta name="description" content="${escapeHtmlAttr(settings.seoDescription || "")}">
  ${
    settings.faviconUrl
      ? `<link rel="icon" href="${escapeHtmlAttr(settings.faviconUrl)}" type="image/x-icon">`
      : ""
  }
  
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
      background-color: ${mapColor(
        settings.backgroundColor || "#01303f",
        settings.themePalette
      )};
      color: ${mapColor(settings.textColor || "#ffffff", settings.themePalette)};
      font-family: '${settings.fontFamily || "Inter"}', sans-serif;
      min-height: 100vh;
      margin: 0;
      padding: ${
        settings.padding === "space-none"
          ? "0"
          : settings.padding === "space-xs"
          ? "0.25rem"
          : settings.padding === "space-sm"
          ? "0.5rem"
          : settings.padding === "space-md"
          ? "1rem"
          : settings.padding === "space-lg"
          ? "2rem 1.5rem"
          : settings.padding === "space-xl"
          ? "3rem 2rem"
          : settings.padding === "space-2xl"
          ? "4rem 3rem"
          : "2rem 1.5rem"
      };
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    
    .portfolio-wrapper {
      width: 100%;
      max-width: ${
        settings.widthMode === "boxed-md"
          ? "768px"
          : settings.widthMode === "boxed-lg"
          ? "1024px"
          : settings.widthMode === "boxed-xl"
          ? "1280px"
          : settings.widthMode === "full"
          ? "100%"
          : "768px"
      };
      display: flex;
      flex-direction: column;
      gap: ${
        settings.gap === "space-none"
          ? "0"
          : settings.gap === "space-xs"
          ? "0.25rem"
          : settings.gap === "space-sm"
          ? "0.5rem"
          : settings.gap === "space-md"
          ? "1rem"
          : settings.gap === "space-lg"
          ? "1.5rem"
          : settings.gap === "space-xl"
          ? "2rem"
          : settings.gap === "space-2xl"
          ? "3rem"
          : "1.5rem"
      };
    }
    ${responsiveCSS}
  </style>

  ${settings.customJs ? `<script>${escapeScriptTag(settings.customJs)}</script>` : ""}
</head>
<body>
  <div class="portfolio-wrapper">
    ${elementsHtml}
  </div>
</body>
</html>`;
}
