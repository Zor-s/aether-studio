import { PageSettings } from "@/types/builder";

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HSVA {
  h: number;
  s: number;
  v: number;
  a: number;
}

export interface HSLA {
  h: number;
  s: number;
  l: number;
  a: number;
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r = 0, g = 0, b = 0;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): HSLA {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: 1,
  };
}

// Convert RGB to HSV
export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

// Convert HSV to RGB
export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  h = (h % 360 + 360) % 360;
  s /= 100;
  v /= 100;
  let r = 0, g = 0, b = 0;
  const i = Math.floor((h / 60) % 6);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Validate color string format
export function isValidColor(color: string): boolean {
  const str = color.trim().toLowerCase();
  if (str === "transparent") return true;
  if (/^#([a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/.test(str)) return true;
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/.test(str)) return true;
  if (/^hsla?\(\s*\d+\s*,\s*[\d.]+\s*%\s*,\s*[\d.]+\s*%\s*(?:,\s*[\d.]+\s*)?\)$/.test(str)) return true;
  return false;
}

// Parse any color string to RGBA object
export function parseColor(color: string | undefined | null): RGBA {
  if (typeof color !== "string") {
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  const str = color.trim().toLowerCase();
  if (!str || str === "transparent") {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  const hexMatch = str.match(/^#?([a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    } else if (hex.length === 4) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    let a = 1;
    if (hex.length === 8) {
      a = parseInt(hex.substring(6, 8), 16) / 255;
    }
    return { r, g, b, a };
  }

  const rgbaMatch = str.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (rgbaMatch) {
    return {
      r: Math.min(255, Math.max(0, parseInt(rgbaMatch[1], 10))),
      g: Math.min(255, Math.max(0, parseInt(rgbaMatch[2], 10))),
      b: Math.min(255, Math.max(0, parseInt(rgbaMatch[3], 10))),
      a: rgbaMatch[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(rgbaMatch[4]))) : 1,
    };
  }

  const hslaMatch = str.match(/^hsla?\(\s*(\d+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (hslaMatch) {
    const h = (parseInt(hslaMatch[1], 10) % 360 + 360) % 360;
    const s = Math.min(100, Math.max(0, parseFloat(hslaMatch[2])));
    const l = Math.min(100, Math.max(0, parseFloat(hslaMatch[3])));
    const a = hslaMatch[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(hslaMatch[4]))) : 1;
    const { r, g, b } = hslToRgb(h, s, l);
    return { r, g, b, a };
  }

  return { r: 255, g: 255, b: 255, a: 1 };
}

export function rgbaToHsva({ r, g, b, a }: RGBA): HSVA {
  const { h, s, v } = rgbToHsv(r, g, b);
  return { h, s, v, a };
}

export function hsvaToRgba({ h, s, v, a }: HSVA): RGBA {
  const { r, g, b } = hsvToRgb(h, s, v);
  return { r, g, b, a };
}

export function rgbaToHex({ r, g, b, a }: RGBA): string {
  const toHex = (x: number) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  let hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a < 1) {
    hex += toHex(a * 255);
  }
  return hex;
}

export function hsvaToRgbString({ h, s, v, a }: HSVA): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  if (a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

export function hsvaToHslString({ h, s, v, a }: HSVA): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  const hsl = rgbToHsl(r, g, b);
  if (a < 1) {
    return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a.toFixed(2)})`;
  }
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export function formatColor(hsva: HSVA, format: "hex" | "rgb" | "hsl"): string {
  if (hsva.a === 0) return "transparent";
  const rgba = hsvaToRgba(hsva);
  if (format === "hex") return rgbaToHex(rgba);
  if (format === "rgb") return hsvaToRgbString(hsva);
  return hsvaToHslString(hsva);
}

export const STANDARD_SWATCHES = [
  "#ffffff",
  "#000000",
  "transparent",
  "#64748b",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];
