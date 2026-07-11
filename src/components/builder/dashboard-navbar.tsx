"use client";

import React, { useEffect } from "react";

interface DashboardNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function DashboardNavbar({ isOpen, onClose, children }: DashboardNavbarProps) {
  // Prevent page scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Dark backdrop overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-45 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-over panel drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-panel border-r border-panel-border z-50 shadow-2xl flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Close button header */}
        <div className="h-header-h border-b border-panel-border px-md flex items-center justify-between shrink-0 bg-background/50">
          <div className="flex items-center gap-xs">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-deep-teal to-cyan-active flex items-center justify-center">
              <span className="text-white font-bold text-xs">Æ</span>
            </div>
            <span className="text-xs font-extrabold text-foreground uppercase tracking-wider">Aether Workspace</span>
          </div>
          <button
            onClick={onClose}
            className="p-xs rounded-lg text-text-muted hover:bg-accent-soft hover:text-foreground transition-all duration-200 focus:outline-none"
            title="Close Drawer Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
}
