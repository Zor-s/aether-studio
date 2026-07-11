"use client";

import React from "react";
import Link from "next/link";

export interface Project {
  id: string;
  title: string;
  subdomain: string;
  customDomain?: string;
  lastModified: string;
  isLive: boolean;
  pageViews: string;
  formSubmissions: string;
  cacheHitRatio: string;
}

interface ProjectCardProps {
  project: Project;
  onOpenSettings: (project: Project) => void;
  onOpenAnalytics: (project: Project) => void;
}

export default function ProjectCard({ project, onOpenSettings, onOpenAnalytics }: ProjectCardProps) {
  return (
    <div className="bg-panel border border-panel-border hover:border-cyan-active/35 rounded-2xl p-md flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-cyan-active/5 shadow-sm group">
      
      {/* Visual Mockup Container */}
      <div className="aspect-video w-full rounded-xl bg-background border border-panel-border/60 relative overflow-hidden flex flex-col p-sm select-none gap-xs">
        {/* Mock header bar */}
        <div className="flex justify-between items-center border-b border-panel-border/30 pb-[4px]">
          <div className="flex gap-[3px]">
            <div className="w-[6px] h-[6px] rounded-full bg-red-400" />
            <div className="w-[6px] h-[6px] rounded-full bg-amber-400" />
            <div className="w-[6px] h-[6px] rounded-full bg-emerald-400" />
          </div>
          <div className="text-[7px] text-text-muted font-mono leading-none bg-panel px-sm py-[2px] rounded truncate max-w-[120px]">
            {project.customDomain || `${project.subdomain}.aether.studio`}
          </div>
        </div>
        
        {/* Mock design layout blocks */}
        <div className="flex flex-col gap-sm items-center justify-center flex-1 py-xs">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-deep-teal/40 to-cyan-active/40 border border-cyan-active/10" />
          <div className="flex flex-col gap-[3px] items-center w-full">
            <div className="w-16 h-2 bg-foreground/15 rounded-full" />
            <div className="w-24 h-1.5 bg-text-muted/10 rounded-full" />
            <div className="w-20 h-1.5 bg-text-muted/10 rounded-full" />
          </div>
        </div>
        
        {/* Hover backdrop overlay */}
        <div className="absolute inset-0 bg-dark-slate/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px] gap-sm z-10">
          <Link
            href="/dashboard"
            className="px-md h-9 rounded-lg bg-cyan-active text-white text-xs font-bold hover:bg-cyan-active/90 flex items-center justify-center shadow-lg transition-transform duration-250 active:scale-95"
          >
            Open Editor
          </Link>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="flex flex-col gap-xs mt-md">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-bold text-foreground truncate group-hover:text-cyan-active transition-colors duration-250">
            {project.title}
          </h3>
          <span className={`text-[9px] font-bold px-sm py-[2px] rounded-full shrink-0 ${
            project.isLive 
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10" 
              : "bg-amber-500/10 text-amber-500 border border-amber-500/10"
          }`}>
            {project.isLive ? "Live at Edge" : "Draft"}
          </span>
        </div>

        {/* Domains List */}
        <div className="flex flex-col gap-[2px] text-[11px] text-text-muted font-medium mt-[2px]">
          <span className="truncate flex items-center gap-xs">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            {project.subdomain}.aether.studio
          </span>
          {project.customDomain && (
            <span className="text-cyan-active truncate flex items-center gap-xs font-bold">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {project.customDomain}
            </span>
          )}
        </div>
      </div>

      {/* Card Actions bar */}
      <div className="flex items-center gap-sm mt-md pt-sm border-t border-panel-border/60 justify-between">
        <span className="text-[10px] text-text-muted font-semibold truncate">
          Modified {project.lastModified}
        </span>
        <div className="flex gap-[6px]">
          {/* Analytics button */}
          <button
            onClick={() => onOpenAnalytics(project)}
            className="p-[6px] rounded-lg border border-panel-border text-text-muted hover:bg-accent-soft hover:text-cyan-active transition-all cursor-pointer"
            title="View Form Submissions & Visitor Analytics"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          
          {/* Domain Bindings Settings button */}
          <button
            onClick={() => onOpenSettings(project)}
            className="p-[6px] rounded-lg border border-panel-border text-text-muted hover:bg-accent-soft hover:text-cyan-active transition-all cursor-pointer"
            title="Domain Configuration Settings"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}
