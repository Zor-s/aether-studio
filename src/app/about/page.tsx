"use client";

import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col relative overflow-x-hidden">
      {/* Background radial accent glow shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-active/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-deep-teal/15 blur-[150px] pointer-events-none" />

      {/* Navbar Header */}
      <header className="h-header-h border-b border-panel-border bg-panel/60 backdrop-blur-md flex items-center justify-between px-sm sm:px-md md:px-xl shrink-0 select-none z-30 sticky top-0">
        <div className="flex items-center gap-xs">
          <Link href="/" className="flex items-center gap-xs focus:outline-none shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-deep-teal to-cyan-active flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg select-none">Æ</span>
            </div>
          </Link>
          <div>
            <h1 className="text-sm sm:text-md font-bold tracking-tight text-foreground leading-snug">Aether Portal</h1>
            <p className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest mt-[2px] font-semibold">About Page</p>
          </div>
        </div>

        <nav className="flex items-center gap-xs sm:gap-sm md:gap-md">
          <Link
            href="/"
            className="text-[11px] sm:text-xs font-semibold text-text-muted hover:text-cyan-active transition-colors duration-200 px-xs sm:px-sm py-1.5 rounded-lg hover:bg-accent-soft"
          >
            Home
          </Link>
          <Link
            href="/docs"
            className="text-[11px] sm:text-xs font-semibold text-text-muted hover:text-cyan-active transition-colors duration-200 px-xs sm:px-sm py-1.5 rounded-lg hover:bg-accent-soft"
          >
            Docs
          </Link>
          <Link
            href="/dashboard"
            className="text-[11px] sm:text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/90 px-2 sm:px-md py-2 rounded-lg shadow-md shadow-cyan-active/20 hover:shadow-cyan-active/30 active:scale-95 transition-all duration-200"
          >
            Launch Builder
          </Link>
        </nav>
      </header>

      {/* Main Grid Container */}
      <main className="flex-1 p-md md:p-xl max-w-[1024px] w-full mx-auto flex flex-col gap-xl overflow-y-auto z-20">
        <div className="flex flex-col gap-xs shrink-0">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">System Architecture & Tech Stack</h2>
          <p className="text-sm text-text-muted mt-xs">Under the hood of {"Aether's"} zero-cost multi-tenant Edge-optimized network.</p>
        </div>

        {/* Architecture Diagram Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          
          {/* Card 1: Request Lifecycle */}
          <div className="border border-panel-border bg-panel/40 backdrop-blur-sm rounded-2xl p-lg flex flex-col gap-md">
            <div className="flex items-center gap-sm">
              <div className="w-9 h-9 rounded-lg bg-cyan-active/10 text-cyan-active flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">1. Multi-Tenant Edge Routing</h3>
                <span className="text-[10px] text-cyan-active font-semibold uppercase tracking-wider">Subdomain Lifecycle</span>
              </div>
            </div>
            
            <p className="text-xs text-text-muted leading-relaxed">
              When a user visits a published subdomain (e.g. <code>alex.aether.studio</code>), the browser targets the Cloudflare Worker Subdomain Router. The worker instantly checks the native Edge Cache pool (<code>caches.default</code>) before making any remote calls.
            </p>

            {/* Simulated Flow Block */}
            <div className="border border-panel-border/60 bg-background/50 rounded-xl p-sm flex flex-col gap-xs font-mono text-[9px]">
              <div className="flex justify-between items-center text-text-muted">
                <span>DNS Entry</span>
                <span className="text-emerald-500 font-bold">CNAME Wildcard</span>
              </div>
              <div className="w-full h-px bg-panel-border/30 my-[2px]" />
              <div className="flex justify-between items-center text-text-muted">
                <span>Edge Cache Check</span>
                <span className="text-cyan-active font-bold">2ms Lookup</span>
              </div>
              <div className="w-full h-px bg-panel-border/30 my-[2px]" />
              <div className="flex justify-between items-center text-text-muted">
                <span>R2 Cold Read</span>
                <span className="text-amber-500 font-bold">Cache-Miss Only</span>
              </div>
            </div>
          </div>

          {/* Card 2: Cache & Egress */}
          <div className="border border-panel-border bg-panel/40 backdrop-blur-sm rounded-2xl p-lg flex flex-col gap-md">
            <div className="flex items-center gap-sm">
              <div className="w-9 h-9 rounded-lg bg-deep-teal/10 text-deep-teal dark:text-sky-blue flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">2. Object Egress Optimization</h3>
                <span className="text-[10px] text-cyan-active font-semibold uppercase tracking-wider">Cloudflare R2 Bucket</span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Finalized visual structures are serialized as standalone, compressed static HTML payloads and streamed to Cloudflare R2 bucket. Injected Cache-Control headers ensure global edge cache pools lock content, protecting R2 query quota limits.
            </p>

            <div className="border border-panel-border/60 bg-background/50 rounded-xl p-sm flex flex-col gap-xs font-mono text-[9px]">
              <div className="flex justify-between items-center text-text-muted">
                <span>Egress Fees</span>
                <span className="text-emerald-500 font-bold">$0.00 (Zero)</span>
              </div>
              <div className="w-full h-px bg-panel-border/30 my-[2px]" />
              <div className="flex justify-between items-center text-text-muted">
                <span>Storage Key</span>
                <span className="text-foreground truncate max-w-[160px]">portfolios/[sub]/index.html</span>
              </div>
              <div className="w-full h-px bg-panel-border/30 my-[2px]" />
              <div className="flex justify-between items-center text-text-muted">
                <span>Cache Control</span>
                <span className="text-cyan-active font-bold">immutable, max-age=31536000</span>
              </div>
            </div>
          </div>

          {/* Card 3: Turso sqlite database */}
          <div className="border border-panel-border bg-panel/40 backdrop-blur-sm rounded-2xl p-lg flex flex-col gap-md">
            <div className="flex items-center gap-sm">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">3. Relational Domain Schema</h3>
                <span className="text-[10px] text-cyan-active font-semibold uppercase tracking-wider">Turso Edge Database</span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Tenant account allocations, active subdomain assignments, and custom domain configuration bindings are stored inside a light relational Turso (Edge SQLite) database, synchronized instantly to edge locations.
            </p>

            <div className="border border-panel-border/60 bg-background/50 rounded-xl p-sm flex flex-col gap-xs font-mono text-[9px]">
              <div className="flex justify-between items-center text-text-muted">
                <span>Domain Bindings</span>
                <span className="text-cyan-active font-bold">Cloudflare Turnstile Verified</span>
              </div>
              <div className="w-full h-px bg-panel-border/30 my-[2px]" />
              <div className="flex justify-between items-center text-text-muted">
                <span>Wildcard Mapping</span>
                <span className="text-foreground truncate">*.aether.studio</span>
              </div>
              <div className="w-full h-px bg-panel-border/30 my-[2px]" />
              <div className="flex justify-between items-center text-text-muted">
                <span>Turso SQLite Sync</span>
                <span className="text-emerald-500 font-bold">Real-time replication</span>
              </div>
            </div>
          </div>

          {/* Card 4: Web components */}
          <div className="border border-panel-border bg-panel/40 backdrop-blur-sm rounded-2xl p-lg flex flex-col gap-md">
            <div className="flex items-center gap-sm">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">4. Lightweight JS Runtime</h3>
                <span className="text-[10px] text-cyan-active font-semibold uppercase tracking-wider">Native Web Components</span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Rather than packaging heavy framework script bundles, interactive features (such as dialog modals or forms validation) rely on standard Custom Elements (Native Web Components) running inside a 1.2KB script payload.
            </p>

            <div className="border border-panel-border/60 bg-background/50 rounded-xl p-sm flex flex-col gap-xs font-mono text-[9px]">
              <div className="flex justify-between items-center text-text-muted">
                <span>Runtime Payload</span>
                <span className="text-emerald-500 font-bold">~1.2KB (Gzipped)</span>
              </div>
              <div className="w-full h-px bg-panel-border/30 my-[2px]" />
              <div className="flex justify-between items-center text-text-muted">
                <span>Execution Standard</span>
                <span className="text-foreground">Custom Elements v1 Specs</span>
              </div>
              <div className="w-full h-px bg-panel-border/30 my-[2px]" />
              <div className="flex justify-between items-center text-text-muted">
                <span>Inject Sanitizer</span>
                <span className="text-cyan-active font-bold">Isomorphic-DOMPurify</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info links */}
        <div className="p-lg border border-panel-border bg-panel/30 rounded-2xl text-center flex flex-col items-center gap-sm mt-md">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Ready to deploy?</h4>
          <p className="text-xs text-text-muted max-w-[384px] leading-relaxed">
            Head to the workspace editor and configure your personalized visual design grid now.
          </p>
          <Link
            href="/dashboard"
            className="h-10 px-md rounded-lg bg-cyan-active text-white text-xs font-bold flex items-center justify-center shadow-md shadow-cyan-active/15 hover:shadow-cyan-active/20 transition-all cursor-pointer mt-xs"
          >
            Launch Builder Workspace
          </Link>
        </div>
      </main>
    </div>
  );
}
