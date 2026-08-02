"use client";

import React from "react";

export type SectionIconType = "seo" | "layout" | "typography" | "theme" | "scripts";
export type OptionViewMode = "seamless" | "glass" | "tabs";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon: SectionIconType;
  isExpanded: boolean;
  onToggle: () => void;
  badge?: string;
  viewMode?: OptionViewMode;
}

export function renderSectionIcon(icon: SectionIconType) {
  switch (icon) {
    case "seo":
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      );
    case "layout":
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      );
    case "typography":
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10M12 3v18M9 7L12 3l3 4"
          />
        </svg>
      );
    case "theme":
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      );
    case "scripts":
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      );
  }
}

export default function SectionHeader({
  title,
  subtitle,
  icon,
  isExpanded,
  onToggle,
  badge,
  viewMode = "seamless",
}: SectionHeaderProps) {
  if (viewMode === "tabs") {
    return null; // Tabs view uses tab headers directly
  }

  const isSeamless = viewMode === "seamless";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between py-md px-sm text-xs font-semibold cursor-pointer transition-all duration-200 select-none group ${
        isSeamless
          ? isExpanded
            ? "bg-cyan-active/5 text-foreground border-l-2 border-cyan-active pl-md"
            : "text-text-muted hover:text-foreground hover:bg-background/40"
          : isExpanded
          ? "bg-background/60 text-foreground"
          : "text-foreground/90 hover:bg-background/50"
      }`}
    >
      <div className="flex items-start gap-xs min-w-0 pr-xs">
        <div
          className={`p-xs rounded-lg flex items-center justify-center shrink-0 mt-[1px] transition-colors ${
            isExpanded
              ? "bg-cyan-active text-white shadow-sm"
              : "bg-cyan-active/10 text-cyan-active group-hover:bg-cyan-active/20"
          }`}
        >
          {renderSectionIcon(icon)}
        </div>
        <div className="flex flex-col text-left min-w-0 gap-[2px]">
          <span className="font-bold text-xs leading-snug tracking-tight text-foreground">{title}</span>
          {subtitle && (
            <span className="text-[10px] text-text-muted leading-tight font-normal">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-xs shrink-0 pl-xs">
        {badge && (
          <span className="text-[9px] font-bold px-xs py-[1px] rounded bg-cyan-active/10 text-cyan-active uppercase tracking-wide">
            {badge}
          </span>
        )}
        <svg
          className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
            isExpanded ? "rotate-180 text-cyan-active" : "group-hover:text-foreground"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
  );
}
