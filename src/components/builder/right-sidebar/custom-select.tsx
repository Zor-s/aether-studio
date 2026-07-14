"use client";

import React, { useState } from "react";

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-xs bg-background border border-panel-border rounded-lg px-sm py-[8px] text-foreground focus:outline-none focus:border-cyan-active focus:ring-1 focus:ring-cyan-active/30 cursor-pointer transition-all duration-200 ${className}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder || "Select..."}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 shrink-0 ml-xs ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Backdrop for closing */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 cursor-default"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        />
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-[38px] left-0 right-0 bg-panel border border-panel-border rounded-lg shadow-xl z-50 flex flex-col overflow-hidden animate-fadeIn max-h-48">
          <div className="overflow-y-auto custom-scrollbar py-xs flex flex-col bg-panel">
            {options.map((opt) => {
              const isActive = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-sm py-[6px] text-xs transition-colors cursor-pointer ${
                    isActive
                      ? "text-cyan-active bg-cyan-active/10 font-bold"
                      : "text-foreground hover:bg-accent-soft hover:text-cyan-active"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
