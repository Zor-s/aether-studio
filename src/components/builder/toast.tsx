"use client";

import React, { useEffect } from "react";
import { Toast } from "@/types/builder";

interface ToastProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-md right-md z-50 flex flex-col gap-sm max-w-[384px] w-full pointer-events-none select-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getToastColors = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-emerald-500/10 dark:bg-emerald-500/5",
          border: "border-emerald-500/20 dark:border-emerald-500/10",
          text: "text-emerald-600 dark:text-emerald-400",
          icon: (
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case "warning":
        return {
          bg: "bg-amber-500/10 dark:bg-amber-500/5",
          border: "border-amber-500/20 dark:border-amber-500/10",
          text: "text-amber-600 dark:text-amber-400",
          icon: (
            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      default: // info
        return {
          bg: "bg-accent-soft border border-panel-border",
          border: "border-panel-border",
          text: "text-cyan-active",
          icon: (
            <svg className="w-4 h-4 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  const colors = getToastColors();

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-sm px-md py-sm rounded-xl border ${colors.bg} ${colors.border} shadow-lg backdrop-blur-md transition-all duration-300 animate-slideInRight`}
      role="alert"
    >
      <div className="flex items-center gap-sm">
        <span className="shrink-0">{colors.icon}</span>
        <span className={`text-xs font-bold ${colors.text}`}>{toast.message}</span>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-full p-[2px] transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
