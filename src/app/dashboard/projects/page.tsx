"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProjectCard } from "@/components/builder";
import type { Project } from "@/components/builder/project-card";

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
            <h1 className="text-md font-bold tracking-tight text-foreground leading-none">Aether Portal</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest mt-[2px] font-semibold">User Portfolios</p>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-fadeIn">
          <div className="bg-panel border border-panel-border rounded-2xl w-full max-w-[512px] shadow-2xl p-md sm:p-lg flex flex-col gap-md relative overflow-y-auto max-h-[calc(100vh-2rem)] custom-scrollbar">
            
            {/* Header */}
            <div className="flex flex-col gap-xs border-b border-panel-border pb-sm">
              <h3 className="text-md font-bold text-foreground">Domain Configurations: {settingsProject.title}</h3>
              <p className="text-xs text-text-muted">Configure subdomain parameters and bind custom hostnames.</p>
            </div>

            <div className="flex flex-col gap-md">
              {/* Subdomain Input */}
              <div className="flex flex-col gap-xs">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Subdomain Namespace</label>
                <div className="flex rounded-lg border border-panel-border bg-background overflow-hidden h-10 items-center">
                  <input
                    type="text"
                    value={subdomainInput}
                    onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="flex-1 bg-transparent px-sm text-xs text-foreground focus:outline-none"
                    placeholder="subdomain"
                  />
                  <span className="text-xs font-semibold text-text-muted bg-panel border-l border-panel-border px-sm py-[10px] h-full">
                    .aether.studio
                  </span>
                </div>
              </div>

              {/* Custom Domain Input */}
              <div className="flex flex-col gap-xs">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Custom Domain Mapping</label>
                <input
                  type="text"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ""))}
                  placeholder="e.g. portfolio.com"
                  className="w-full h-10 px-sm bg-background border border-panel-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-active transition-all"
                />
              </div>

              {/* DNS Instructions Guide */}
              {customDomainInput && (
                <div className="flex flex-col gap-xs p-sm bg-background border border-panel-border rounded-xl mt-xs">
                  <div className="flex items-center gap-xs text-cyan-active">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider">DNS Settings Checklist</span>
                  </div>
                  
                  <p className="text-[10px] text-text-muted mt-1 leading-normal">
                    To finalize mapping <strong>{customDomainInput}</strong>, configure these DNS records in your domain registrar panel:
                  </p>

                  <div className="flex flex-col gap-sm mt-sm">
                    {/* Record A */}
                    <div className="flex flex-col gap-xs border border-panel-border/40 p-xs rounded bg-panel/30">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-foreground">Record 1 (Apex): A Type</span>
                        <button
                          onClick={() => copyToClipboard("185.199.108.153", "record-a")}
                          className="text-[9px] text-cyan-active font-bold hover:underline"
                        >
                          {copiedText === "record-a" ? "Copied!" : "Copy IP"}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-xs text-[10px] text-text-muted mt-xs">
                        <div>Host: <strong className="text-foreground">@</strong></div>
                        <div className="col-span-2">Value: <strong className="text-foreground">185.199.108.153</strong></div>
                      </div>
                    </div>

                    {/* Record CNAME */}
                    <div className="flex flex-col gap-xs border border-panel-border/40 p-xs rounded bg-panel/30">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-foreground">Record 2 (WWW Sub): CNAME Type</span>
                        <button
                          onClick={() => copyToClipboard("domains.aether.studio", "record-cname")}
                          className="text-[9px] text-cyan-active font-bold hover:underline"
                        >
                          {copiedText === "record-cname" ? "Copied!" : "Copy Target"}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-xs text-[10px] text-text-muted mt-xs">
                        <div>Host: <strong className="text-foreground">www</strong></div>
                        <div className="col-span-2">Value: <strong className="text-foreground">domains.aether.studio</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-sm mt-xs border-t border-panel-border pt-md">
              <button
                onClick={() => setSettingsProject(null)}
                className="h-10 px-md rounded-lg text-xs font-semibold border border-panel-border text-text-muted hover:bg-accent-soft hover:text-foreground transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="h-10 px-md rounded-lg text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/95 transition-all cursor-pointer"
              >
                Save Bindings
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Analytics Drawers Modal */}
      {analyticsProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-fadeIn">
          <div className="bg-panel border border-panel-border rounded-2xl w-full max-w-[576px] shadow-2xl p-md sm:p-lg flex flex-col gap-md relative overflow-y-auto max-h-[calc(100vh-2rem)] custom-scrollbar">
            
            {/* Header */}
            <div className="flex flex-col gap-xs border-b border-panel-border pb-sm">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold text-foreground">Analytics Overview: {analyticsProject.title}</h3>
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
                <span className="text-lg font-extrabold text-foreground">{analyticsProject.pageViews || "0"}</span>
              </div>
              <div className="bg-background border border-panel-border/60 rounded-xl p-sm flex flex-col gap-[3px]">
                <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Submissions</span>
                <span className="text-lg font-extrabold text-foreground">{analyticsProject.formSubmissions || "0"}</span>
              </div>
              <div className="bg-background border border-panel-border/60 rounded-xl p-sm flex flex-col gap-[3px]">
                <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Cache Hit Rate</span>
                <span className="text-lg font-extrabold text-cyan-active">{analyticsProject.cacheHitRatio || "0%"}</span>
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
                    {[
                      { day: "Mon", val: 30 },
                      { day: "Tue", val: 50 },
                      { day: "Wed", val: 40 },
                      { day: "Thu", val: 80 },
                      { day: "Fri", val: 95 },
                      { day: "Sat", val: 60 },
                      { day: "Sun", val: 75 }
                    ].map((d) => (
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
                    {[
                      { day: "Mon", val: 10 },
                      { day: "Tue", val: 20 },
                      { day: "Wed", val: 15 },
                      { day: "Thu", val: 35 },
                      { day: "Fri", val: 45 },
                      { day: "Sat", val: 30 },
                      { day: "Sun", val: 40 }
                    ].map((d) => (
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
                onClick={() => setAnalyticsProject(null)}
                className="h-10 px-md rounded-lg text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/95 transition-all cursor-pointer shadow-md shadow-cyan-active/15"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
