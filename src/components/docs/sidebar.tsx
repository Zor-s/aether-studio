"use client";

import React from "react";

interface SidebarProps {
  headings: string[];
}

export default function Sidebar({ headings }: SidebarProps) {
  const handleScrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="hidden md:block w-52 shrink-0 select-none sticky top-24 self-start">
      <div className="flex flex-col gap-sm">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
          On This Page
        </h3>
        
        {headings.length > 0 ? (
          <nav className="flex flex-col gap-xs border-l border-panel-border/60 pl-sm">
            {headings.map((heading) => (
              <button
                key={heading}
                onClick={() => handleScrollToHeading(heading)}
                className="text-left text-xs font-medium text-text-muted hover:text-cyan-active hover:border-l hover:border-cyan-active hover:-ml-[9px] hover:pl-sm transition-all duration-200 py-[4px] truncate"
                title={heading}
              >
                {heading}
              </button>
            ))}
          </nav>
        ) : (
          <span className="text-[11px] text-text-muted italic">No section headings</span>
        )}
      </div>
    </aside>
  );
}
