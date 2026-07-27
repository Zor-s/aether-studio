"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProjectCard } from "@/components/builder";
import type { Project } from "@/components/builder/project-card";
import { DomainSettingsModal } from "./_components/domain-settings-modal";
import { AnalyticsModal } from "./_components/analytics-modal";

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Alex Mercer Portfolio",
    subdomain: "alex",
    customDomain: "alexmercer.com",
    lastModified: "2 hours ago",
    isLive: true,
    pageViews: "14,230",
    formSubmissions: "142",
    cacheHitRatio: "99.2%",
  },
  {
    id: "proj-2",
    title: "Aether Labs Landing Page",
    subdomain: "aether-labs",
    lastModified: "Yesterday",
    isLive: true,
    pageViews: "4,512",
    formSubmissions: "38",
    cacheHitRatio: "98.5%",
  },
  {
    id: "proj-3",
    title: "Consulting Hub",
    subdomain: "consult-alex",
    lastModified: "3 days ago",
    isLive: false,
    pageViews: "0",
    formSubmissions: "0",
    cacheHitRatio: "0%",
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  
  // Settings modal states
  const [settingsProject, setSettingsProject] = useState<Project | null>(null);
  const [subdomainInput, setSubdomainInput] = useState("");
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [copiedText, setCopiedText] = useState("");

  // Analytics states
  const [analyticsProject, setAnalyticsProject] = useState<Project | null>(null);



  const handleOpenSettings = (project: Project) => {
    setSettingsProject(project);
    setSubdomainInput(project.subdomain);
    setCustomDomainInput(project.customDomain || "");
  };

  const handleSaveSettings = () => {
    if (!settingsProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === settingsProject.id) {
        return {
          ...p,
          subdomain: subdomainInput,
          customDomain: customDomainInput || undefined,
          lastModified: "Just now"
        };
      }
      return p;
    }));
    setSettingsProject(null);
  };

  const handleCreateProject = () => {
    const nextId = `proj-${Date.now()}`;
    const newProj: Project = {
      id: nextId,
      title: `New Portfolio ${projects.length + 1}`,
      subdomain: `sub-${Date.now().toString().slice(-4)}`,
      lastModified: "Just now",
      isLive: false,
      pageViews: "0",
      formSubmissions: "0",
      cacheHitRatio: "0%"
    };
    setProjects([...projects, newProj]);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
      {/* Header bar */}
      <header className="h-header-h border-b border-panel-border bg-panel flex items-center justify-between px-md shrink-0 select-none z-30">
        <div className="flex items-center gap-xs">
          <Link href="/dashboard" className="flex items-center gap-xs focus:outline-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-deep-teal to-cyan-active flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg select-none">Æ</span>
            </div>
          </Link>
          <div>
            <h1 className="text-md font-bold tracking-tight text-foreground leading-snug">Aether Portal</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest mt-[4px] font-semibold">User Portfolios</p>
          </div>
        </div>

        <nav className="flex items-center gap-sm md:gap-md">
          <Link
            href="/"
            className="text-xs font-semibold text-text-muted hover:text-cyan-active transition-colors duration-200 px-sm py-[8px] rounded-lg hover:bg-accent-soft"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-xs font-semibold text-text-muted hover:text-cyan-active transition-colors duration-200 px-sm py-[8px] rounded-lg hover:bg-accent-soft"
          >
            Architecture
          </Link>
          <Link
            href="/docs"
            className="text-xs font-semibold text-text-muted hover:text-cyan-active transition-colors duration-200 px-sm py-[8px] rounded-lg hover:bg-accent-soft"
          >
            Docs
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/90 px-md py-[10px] rounded-lg shadow-md shadow-cyan-active/20 transition-all duration-200"
          >
            Launch Builder
          </Link>
        </nav>
      </header>

      {/* Main Grid Container */}
      <main className="flex-1 p-md md:p-xl max-w-[1280px] w-full mx-auto flex flex-col gap-lg overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md shrink-0">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Projects Dashboard</h2>
            <p className="text-sm text-text-muted mt-xs">Manage edge domains, view metrics, and edit web assets.</p>
          </div>
          <button
            onClick={handleCreateProject}
            className="flex items-center justify-center gap-xs px-md h-10 rounded-lg text-xs font-bold text-white bg-deep-teal hover:bg-deep-teal/95 active:scale-95 transition-all duration-200 self-start md:self-auto cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Portfolio
          </button>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenSettings={handleOpenSettings}
              onOpenAnalytics={setAnalyticsProject}
            />
          ))}

          {/* Plus Add Card */}
          <div
            onClick={handleCreateProject}
            className="border-2 border-dashed border-panel-border hover:border-cyan-active bg-panel/30 hover:bg-panel/60 rounded-2xl p-lg flex flex-col items-center justify-center text-center gap-sm cursor-pointer transition-all duration-250 min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-full border border-panel-border bg-panel flex items-center justify-center text-cyan-active shadow-inner group-hover:scale-105 transition-transform duration-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="flex flex-col gap-[2px]">
              <h4 className="text-sm font-bold text-foreground">Create New Portfolio</h4>
              <p className="text-xs text-text-muted max-w-[180px]">Add a fresh edge-optimized site to your list.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Domain bindings Settings Modal */}
      {settingsProject && (
        <DomainSettingsModal
          project={settingsProject}
          subdomainInput={subdomainInput}
          customDomainInput={customDomainInput}
          copiedText={copiedText}
          onSubdomainChange={setSubdomainInput}
          onCustomDomainChange={setCustomDomainInput}
          onCopyToClipboard={copyToClipboard}
          onSave={handleSaveSettings}
          onClose={() => setSettingsProject(null)}
        />
      )}

      {/* Analytics Drawers Modal */}
      {analyticsProject && (
        <AnalyticsModal
          project={analyticsProject}
          onClose={() => setAnalyticsProject(null)}
        />
      )}

    </div>
  );
}
