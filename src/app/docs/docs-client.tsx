"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Sidebar from "@/components/docs/sidebar";

export interface DocItem {
  id: string;
  title: string;
  filename: string;
  content: string;
}

interface DocsClientProps {
  documents: DocItem[];
}

function parseMarkdown(md: string): string {
  let html = md;
  
  // HTML escaping (simple)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Pre-process Code blocks to prevent format corruptions
  const codeBlocks: string[] = [];
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    codeBlocks.push(code.trim());
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Inline Code `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-background border border-panel-border px-xs py-[2px] rounded text-cyan-active font-mono text-[11px]">$1</code>');

  // Convert custom alerts: &gt; [!NOTE] etc.
  html = html.replace(/&gt;\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n([\s\S]*?)(?=\n\n|\n&gt;|\n\s*\n|$)/g, (match, type, content) => {
    let style = "bg-accent-soft border-l-4 border-cyan-active text-text-muted";
    let title = "Note";
    if (type === "TIP") { style = "bg-emerald-500/5 border-l-4 border-emerald-500 text-emerald-600 dark:text-emerald-400"; title = "Tip"; }
    else if (type === "IMPORTANT") { style = "bg-cyan-active/5 border-l-4 border-cyan-active text-foreground"; title = "Important"; }
    else if (type === "WARNING") { style = "bg-amber-500/5 border-l-4 border-amber-500 text-amber-600 dark:text-amber-400"; title = "Warning"; }
    return `<div class="p-md rounded-xl border border-panel-border ${style} my-md"><div class="font-bold text-xs uppercase tracking-wider mb-xs">${title}</div><div>${content.trim().replace(/^&gt;\s?/gm, "")}</div></div>`;
  });

  // Tables parsing (simple parser)
  html = html.replace(/\n(\|[^\n]+\|\r?\n\|[ -:|]+\|\r?\n(\|[^\n]+\|\r?\n)+)/g, (match) => {
    const lines = match.trim().split("\n");
    const headers = lines[0].split("|").slice(1, -1).map(h => h.trim());
    const rows = lines.slice(2).map(line => line.split("|").slice(1, -1).map(c => c.trim()));
    
    let tableHtml = `<div class="overflow-x-auto my-md border border-panel-border rounded-xl bg-panel/30"><table class="w-full text-xs text-left border-collapse"><thead><tr class="bg-background border-b border-panel-border">`;
    headers.forEach(h => {
      tableHtml += `<th class="p-sm font-bold text-foreground">${h}</th>`;
    });
    tableHtml += `</tr></thead><tbody>`;
    rows.forEach(row => {
      tableHtml += `<tr class="border-b border-panel-border/40 hover:bg-background/25">`;
      row.forEach(c => {
        tableHtml += `<td class="p-sm text-text-muted font-medium">${c}</td>`;
      });
      tableHtml += `</tr>`;
    });
    tableHtml += `</tbody></table></div>`;
    return tableHtml;
  });

  // Headers
  html = html.replace(/^# (.*$)/gim, '<h1 id="$1" class="text-2xl font-extrabold text-foreground tracking-tight mt-lg mb-sm border-b border-panel-border/30 pb-xs">$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 id="$1" class="text-lg font-bold text-foreground tracking-tight mt-lg mb-xs scroll-mt-24">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 id="$1" class="text-md font-bold text-foreground/90 tracking-tight mt-md mb-xs">$1</h3>');

  // Bold / Strong
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');

  // Bullet items
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-md list-disc text-xs text-text-muted my-xs">$1</li>');

  // Restore Code blocks
  codeBlocks.forEach((code, idx) => {
    html = html.replace(`__CODE_BLOCK_${idx}__`, `<div class="my-md bg-dark-slate border border-panel-border rounded-xl overflow-hidden p-sm text-[11px] font-mono text-cyan-active overflow-x-auto select-all"><pre><code>${code}</code></pre></div>`);
  });

  // Replace double newlines with spacing tags or block wrappers
  html = html.split("\n\n").map(p => {
    if (p.trim().startsWith("<h") || p.trim().startsWith("<div") || p.trim().startsWith("<li") || p.trim().startsWith("<table")) {
      return p;
    }
    return `<p class="text-xs text-text-muted leading-relaxed my-sm">${p.trim()}</p>`;
  }).join("\n");

  return html;
}

export default function DocsClient({ documents }: DocsClientProps) {
  const [activeTab, setActiveTab] = useState<string>(documents[0]?.id || "plan");
  const [searchQuery, setSearchQuery] = useState("");

  const currentDoc = useMemo(() => {
    return documents.find((doc) => doc.id === activeTab) || documents[0];
  }, [activeTab, documents]);

  // Extract sections (H2 headings) for Table of Contents
  const headings = useMemo(() => {
    if (!currentDoc) return [];
    const headingsList: string[] = [];
    const lines = currentDoc.content.split("\n");
    for (const line of lines) {
      if (line.startsWith("## ")) {
        headingsList.push(line.replace("## ", "").trim());
      }
    }
    return headingsList;
  }, [currentDoc]);

  // Filter headings based on search query (if active)
  const filteredHeadings = useMemo(() => {
    if (!searchQuery) return headings;
    return headings.filter((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [headings, searchQuery]);

  // Parse HTML
  const parsedHtml = useMemo(() => {
    if (!currentDoc) return "";
    return parseMarkdown(currentDoc.content);
  }, [currentDoc]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col relative overflow-x-hidden">
      {/* Background radial accent glow shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-active/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-deep-teal/15 blur-[150px] pointer-events-none" />

      {/* Navbar Header */}
      <header className="h-header-h border-b border-panel-border bg-panel/60 backdrop-blur-md flex items-center justify-between px-md md:px-xl shrink-0 select-none z-30 sticky top-0">
        <div className="flex items-center gap-xs">
          <Link href="/" className="flex items-center gap-xs focus:outline-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-deep-teal to-cyan-active flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg select-none">Æ</span>
            </div>
          </Link>
          <div>
            <h1 className="text-md font-bold tracking-tight text-foreground leading-none">Aether Portal</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest mt-[2px] font-semibold">Dev Docs Hub</p>
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
            href="/dashboard"
            className="text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/90 px-md py-[10px] rounded-lg shadow-md shadow-cyan-active/20 hover:shadow-cyan-active/30 active:scale-95 transition-all duration-200"
          >
            Launch Builder
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-[1152px] w-full mx-auto px-md py-xl flex flex-col md:flex-row gap-lg z-20">
        
        {/* Left Sidebar Document Tabs */}
        <aside className="w-full md:w-56 shrink-0 select-none flex flex-col gap-md">
          <div className="flex flex-col gap-xs shrink-0">
            <h2 className="text-md font-bold text-foreground">Aether Docs</h2>
            <p className="text-[11px] text-text-muted">Technical references and layouts specs.</p>
          </div>

          {/* Search bar inside sidebar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search headings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-sm rounded-lg border border-panel-border bg-panel text-xs text-foreground placeholder-text-muted focus:outline-none focus:border-cyan-active transition-all"
            />
            <svg className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Tabs */}
          <nav className="flex flex-row md:flex-col gap-xs overflow-x-auto pb-xs md:pb-0 scrollbar-none border-b border-panel-border/30 md:border-b-0">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setActiveTab(doc.id);
                  setSearchQuery("");
                }}
                className={`px-sm py-xs rounded-lg text-xs font-bold whitespace-nowrap text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-sm ${
                  activeTab === doc.id
                    ? "bg-cyan-active text-white shadow-sm"
                    : "text-text-muted hover:text-foreground hover:bg-panel/50"
                }`}
              >
                <span>{doc.title}</span>
                <span className={`text-[9px] font-mono font-medium px-xs py-[2px] rounded ${
                  activeTab === doc.id ? "bg-white/15 text-white" : "bg-background text-text-muted"
                }`}>
                  {doc.filename}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Center Markdown Reading View */}
        <main className="flex-1 border border-panel-border bg-panel/30 backdrop-blur-sm rounded-2xl p-md sm:p-lg flex flex-col min-w-0">
          <div className="prose dark:prose-invert max-w-none prose-xs">
            {/* Inject compiled markdown HTML */}
            <div
              dangerouslySetInnerHTML={{ __html: parsedHtml }}
              className="flex flex-col gap-xs"
            />
          </div>
        </main>

        {/* Right Sticky Table of Contents Sidebar */}
        <Sidebar headings={filteredHeadings} />
      </div>
    </div>
  );
}
