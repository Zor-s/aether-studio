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
    quoteLineColor?: string;
    quoteVariant?: "classic" | "callout" | "elegant" | "banner";
    backgroundColor?: string;
    listStyleType?:
      | "disc"
      | "circle"
      | "square"
      | "decimal"
      | "decimal-leading-zero"
      | "lower-alpha"
      | "upper-alpha"
      | "lower-roman"
      | "upper-roman"
      | "checkmark"
      | "dash"
      | "none";
    itemSpacing?: string;
    markerColor?: string;
    startNumber?: number;
    buttonVariant?: "solid" | "outline" | "ghost" | "soft" | "glass";
    buttonSize?: "sm" | "md" | "lg" | "xl";
    buttonWidth?: "auto" | "full";
    buttonIcon?:
      | "none"
      | "arrow-right"
      | "external-link"
      | "download"
      | "mail"
      | "play"
      | "star"
      | "heart"
      | "check"
      | "plus"
      | "search"
      | "github";
    iconPosition?: "left" | "right";
    hoverEffect?: "none" | "lift" | "scale" | "glow" | "shine";
    buttonState?: "normal" | "disabled" | "loading";
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
      quoteLineColor?: string;
      quoteVariant?: "classic" | "callout" | "elegant" | "banner";
      backgroundColor?: string;
      listStyleType?:
        | "disc"
        | "circle"
        | "square"
        | "decimal"
        | "decimal-leading-zero"
        | "lower-alpha"
        | "upper-alpha"
        | "lower-roman"
        | "upper-roman"
        | "checkmark"
        | "dash"
        | "none";
      itemSpacing?: string;
      markerColor?: string;
      startNumber?: number;
      buttonVariant?: "solid" | "outline" | "ghost" | "soft" | "glass";
      buttonSize?: "sm" | "md" | "lg" | "xl";
      buttonWidth?: "auto" | "full";
      buttonIcon?:
        | "none"
        | "arrow-right"
        | "external-link"
        | "download"
        | "mail"
        | "play"
        | "star"
        | "heart"
        | "check"
        | "plus"
        | "search"
        | "github";
      iconPosition?: "left" | "right";
      hoverEffect?: "none" | "lift" | "scale" | "glow" | "shine";
      buttonState?: "normal" | "disabled" | "loading";
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
      quoteLineColor?: string;
      quoteVariant?: "classic" | "callout" | "elegant" | "banner";
      backgroundColor?: string;
      listStyleType?:
        | "disc"
        | "circle"
        | "square"
        | "decimal"
        | "decimal-leading-zero"
        | "lower-alpha"
        | "upper-alpha"
        | "lower-roman"
        | "upper-roman"
        | "checkmark"
        | "dash"
        | "none";
      itemSpacing?: string;
      markerColor?: string;
      startNumber?: number;
      buttonVariant?: "solid" | "outline" | "ghost" | "soft" | "glass";
      buttonSize?: "sm" | "md" | "lg" | "xl";
      buttonWidth?: "auto" | "full";
      buttonIcon?:
        | "none"
        | "arrow-right"
        | "external-link"
        | "download"
        | "mail"
        | "play"
        | "star"
        | "heart"
        | "check"
        | "plus"
        | "search"
        | "github";
      iconPosition?: "left" | "right";
      hoverEffect?: "none" | "lift" | "scale" | "glow" | "shine";
      buttonState?: "normal" | "disabled" | "loading";
    };
  };
  link?: string;
  linkTarget?: "_self" | "_blank";
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
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  widthMode: "boxed-md" | "boxed-lg" | "boxed-xl" | "full";
  padding: string;
  gap: string;
}

export const GOOGLE_FONTS_LIST = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Lato",
  "Poppins",
  "Oswald",
  "Raleway",
  "Nunito",
  "Georgia",
  "Playfair Display",
  "Lora",
  "Merriweather",
  "PT Sans",
  "Rubik",
  "Ubuntu",
  "Outfit",
  "Syne",
  "Cormorant Garamond",
  "Cabin",
  "Archivo",
  "Roboto Mono",
  "Source Code Pro",
  "Courier Prime",
  "Space Grotesk",
];

export interface Toast {
  id: string;
  message: string;
  type: "success" | "warning" | "info";
}
