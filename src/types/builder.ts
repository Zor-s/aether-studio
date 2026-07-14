export interface CanvasElement {
  id: string;
  name?: string;
  parentId?: string;
  type: string;
  content: string;
  category: "layout" | "basic" | "media" | "forms";
  styles: {
    padding?: string;
    margin?: string;
    fontSize?: string;
    color?: string;
    borderRadius?: string;
    align?: "left" | "center" | "right";
    fontWeight?: string;
    letterSpacing?: string;
    borderStyle?: string;
    borderWidth?: string;
    borderColor?: string;
    fontFamily?: string;
    direction?: string;
    justify?: string;
    alignItems?: string;
    gap?: string;
    widthMode?: string;
    minHeight?: string;
    mobile?: {
      padding?: string;
      margin?: string;
      fontSize?: string;
      color?: string;
      borderRadius?: string;
      align?: "left" | "center" | "right";
      fontWeight?: string;
      letterSpacing?: string;
      borderStyle?: string;
      borderWidth?: string;
      borderColor?: string;
      fontFamily?: string;
      direction?: string;
      justify?: string;
      alignItems?: string;
      gap?: string;
      widthMode?: string;
      minHeight?: string;
    };
    tablet?: {
      padding?: string;
      margin?: string;
      fontSize?: string;
      color?: string;
      borderRadius?: string;
      align?: "left" | "center" | "right";
      fontWeight?: string;
      letterSpacing?: string;
      borderStyle?: string;
      borderWidth?: string;
      borderColor?: string;
      fontFamily?: string;
      direction?: string;
      justify?: string;
      alignItems?: string;
      gap?: string;
      widthMode?: string;
      minHeight?: string;
    };
  };
  link?: string;
}

export interface PageSettings {
  seoTitle: string;
  seoDescription: string;
  customJs: string;
  faviconUrl: string;
  themePalette: {
    iceBlue: string;
    skyBlue: string;
    cyanActive: string;
    deepTeal: string;
    darkSlate: string;
  };
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "warning" | "info";
}
