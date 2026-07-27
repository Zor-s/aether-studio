"use client";

import React from "react";
import type { Project } from "@/components/builder/project-card";

interface AnalyticsModalProps {
  project: Project;
  onClose: () => void;
}

const DAILY_VIEWS = [
  { day: "Mon", val: 30 },
  { day: "Tue", val: 50 },
  { day: "Wed", val: 40 },
  { day: "Thu", val: 80 },
  { day: "Fri", val: 95 },
  { day: "Sat", val: 60 },
  { day: "Sun", val: 75 },
];

const DAILY_FORMS = [
  { day: "Mon", val: 10 },
  { day: "Tue", val: 20 },
  { day: "Wed", val: 15 },
  { day: "Thu", val: 35 },
  { day: "Fri", val: 45 },
  { day: "Sat", val: 30 },
  { day: "Sun", val: 40 },
];

/**
 * AnalyticsModal — presentational component.
 * Displays page view and form submission charts for a given project.
 * Chart data is static/demo. Receives project as prop.
 */
export function AnalyticsModal({ project, onClose }: AnalyticsModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-fadeIn">
      <div className="bg-panel border border-panel-border rounded-2xl w-full max-w-[576px] shadow-2xl p-md sm:p-lg flex flex-col gap-md relative overflow-y-auto max-h-[calc(100vh-2rem)] custom-scrollbar">

        {/* Header */}
        <div className="flex flex-col gap-xs border-b border-panel-border pb-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-bold text-foreground">Analytics Overview: {project.title}</h3>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/10 px-sm py-[2px] rounded-full uppercase tracking-wide">
              Active
            </span>
          </div>
          <p className="text-xs text-text-muted">Edge routing statistics and kontakt form submission metrics.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-sm">
          <div className="bg-background border border-panel-border/60 rounded-xl p-sm flex flex-col gap-[3px]">
            <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Page Views</span>
            <span className="text-lg font-extrabold text-foreground">{project.pageViews || "0"}</span>
          </div>
          <div className="bg-background border border-panel-border/60 rounded-xl p-sm flex flex-col gap-[3px]">
            <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Submissions</span>
            <span className="text-lg font-extrabold text-foreground">{project.formSubmissions || "0"}</span>
          </div>
          <div className="bg-background border border-panel-border/60 rounded-xl p-sm flex flex-col gap-[3px]">
            <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Cache Hit Rate</span>
            <span className="text-lg font-extrabold text-cyan-active">{project.cacheHitRatio || "0%"}</span>
          </div>
        </div>

        {/* Dynamic CSS Bar Charts */}
        <div className="flex flex-col gap-md mt-xs">
          <span className="text-xs font-bold text-foreground">Traffic Hits & Forms (Last 7 Days)</span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md bg-background border border-panel-border/80 rounded-xl p-sm">
            {/* Views Chart */}
            <div className="flex flex-col gap-xs">
              <span className="text-[10px] font-semibold text-text-muted">Daily Page Views</span>
              <div className="h-28 flex items-end justify-between gap-xs border-b border-panel-border/50 pb-xs px-xs pt-md">
                {DAILY_VIEWS.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-[6px] h-full justify-end group/bar">
                    <div className="text-[8px] text-text-muted font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity leading-none">
                      {d.val * 10}
                    </div>
                    <div
                      style={{ height: `${d.val}%` }}
                      className="w-full bg-cyan-active rounded-t-sm hover:bg-cyan-active/90 transition-all duration-300 shadow-md shadow-cyan-active/10"
                    />
                    <span className="text-[8px] text-text-muted uppercase tracking-wider font-semibold leading-none shrink-0">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forms Chart */}
            <div className="flex flex-col gap-xs">
              <span className="text-[10px] font-semibold text-text-muted">Daily Form Inquiries</span>
              <div className="h-28 flex items-end justify-between gap-xs border-b border-panel-border/50 pb-xs px-xs pt-md">
                {DAILY_FORMS.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-[6px] h-full justify-end group/bar">
                    <div className="text-[8px] text-text-muted font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity leading-none">
                      {d.val / 5}
                    </div>
                    <div
                      style={{ height: `${d.val}%` }}
                      className="w-full bg-deep-teal rounded-t-sm hover:bg-deep-teal/90 transition-all duration-300 shadow-md shadow-deep-teal/10"
                    />
                    <span className="text-[8px] text-text-muted uppercase tracking-wider font-semibold leading-none shrink-0">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-xs border-t border-panel-border pt-md">
          <button
            onClick={onClose}
            className="h-10 px-md rounded-lg text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/95 transition-all cursor-pointer shadow-md shadow-cyan-active/15"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
