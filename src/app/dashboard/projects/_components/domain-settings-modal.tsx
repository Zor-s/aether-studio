"use client";

import React from "react";
import type { Project } from "@/components/builder/project-card";

interface DomainSettingsModalProps {
  project: Project;
  subdomainInput: string;
  customDomainInput: string;
  copiedText: string;
  onSubdomainChange: (val: string) => void;
  onCustomDomainChange: (val: string) => void;
  onCopyToClipboard: (text: string, label: string) => void;
  onSave: () => void;
  onClose: () => void;
}

/**
 * DomainSettingsModal — presentational component.
 * Displays subdomain/custom-domain configuration and DNS instructions.
 * All state is owned by ProjectsPage.
 */
export function DomainSettingsModal({
  project,
  subdomainInput,
  customDomainInput,
  copiedText,
  onSubdomainChange,
  onCustomDomainChange,
  onCopyToClipboard,
  onSave,
  onClose,
}: DomainSettingsModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-fadeIn">
      <div className="bg-panel border border-panel-border rounded-2xl w-full max-w-[512px] shadow-2xl p-md sm:p-lg flex flex-col gap-md relative overflow-y-auto max-h-[calc(100vh-2rem)] custom-scrollbar">

        {/* Header */}
        <div className="flex flex-col gap-xs border-b border-panel-border pb-sm">
          <h3 className="text-md font-bold text-foreground">Domain Configurations: {project.title}</h3>
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
                onChange={(e) => onSubdomainChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
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
              onChange={(e) => onCustomDomainChange(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ""))}
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
                      onClick={() => onCopyToClipboard("185.199.108.153", "record-a")}
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
                      onClick={() => onCopyToClipboard("domains.aether.studio", "record-cname")}
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
            onClick={onClose}
            className="h-10 px-md rounded-lg text-xs font-semibold border border-panel-border text-text-muted hover:bg-accent-soft hover:text-foreground transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="h-10 px-md rounded-lg text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/95 transition-all cursor-pointer"
          >
            Save Bindings
          </button>
        </div>

      </div>
    </div>
  );
}
