"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import OnboardingWizard from "@/components/landing/onboarding-wizard";

export default function Home() {
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    if (!completed) {
      setOnboardingOpen(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setOnboardingOpen(false);
    localStorage.setItem("onboarding_completed", "true");
  };

  const handleStartTour = () => {
    setOnboardingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col relative overflow-x-hidden">
      {/* Background radial accent glow shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-active/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-deep-teal/15 blur-[150px] pointer-events-none" />

      {/* Top Header Navbar */}
      <header className="h-header-h border-b border-panel-border bg-panel/60 backdrop-blur-md flex items-center justify-between px-sm sm:px-md md:px-xl shrink-0 select-none z-30 sticky top-0">
        <div className="flex items-center gap-xs">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-deep-teal to-cyan-active flex items-center justify-center shadow-md shrink-0">
            <span className="text-white font-bold text-lg select-none">Æ</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-md font-bold tracking-tight text-foreground leading-snug">Aether Studio</h1>
            <p className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest mt-[2px] font-semibold">Visual Platform</p>
          </div>
        </div>

        <nav className="flex items-center gap-xs sm:gap-sm md:gap-md">
          <Link
            href="/about"
            className="text-[11px] sm:text-xs font-semibold text-text-muted hover:text-cyan-active transition-colors duration-200 px-xs sm:px-sm py-1.5 rounded-lg hover:bg-accent-soft"
          >
            Architecture
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

      {/* Hero Section */}
      <main className="flex-1 max-w-[1152px] w-full mx-auto px-md py-xl md:py-2xl flex flex-col items-center justify-center text-center gap-xl z-20">
        <div className="flex flex-col items-center gap-md max-w-[672px]">
          <span className="text-[10px] font-bold text-cyan-active bg-cyan-active/10 border border-cyan-active/20 px-sm py-xs rounded-full uppercase tracking-wider animate-fadeIn">
            Zero-Cost Edge Infrastructure
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Build Stunning Portfolios, <br />
            Hosted on the <span className="bg-gradient-to-r from-cyan-active to-deep-teal bg-clip-text text-transparent">Global Edge.</span>
          </h2>
          <p className="text-sm md:text-md text-text-muted leading-relaxed mt-sm">
            Aether Studio compiles visual drag-and-drop structures into static HTML streams. Intercepted by Cloudflare Workers, assets are served globally from edge cache memory pools. Settle with $0.00 infrastructure bills.
          </p>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-sm">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto h-12 px-lg rounded-xl text-sm font-bold text-white bg-cyan-active hover:bg-cyan-active/95 flex items-center justify-center shadow-lg shadow-cyan-active/15 hover:shadow-cyan-active/25 transition-all duration-200 cursor-pointer"
          >
            Start Designing Free
          </Link>
          <button
            onClick={handleStartTour}
            className="w-full sm:w-auto h-12 px-lg rounded-xl text-sm font-semibold border border-panel-border bg-panel text-text-muted hover:bg-accent-soft hover:text-foreground flex items-center justify-center gap-xs transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Interactive Tour
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md w-full mt-lg">
          
          {/* Card 1 */}
          <div className="border border-panel-border bg-panel/40 backdrop-blur-sm rounded-2xl p-lg flex flex-col items-center text-center gap-sm shadow-sm hover:shadow-md hover:border-cyan-active/45 transition-all duration-250">
            <div className="w-10 h-10 rounded-xl bg-cyan-active/10 text-cyan-active flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-foreground">Symmetrical Viewport Resize</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Drag phone or tablet preview borders directly inside the visual canvas area to test letter-spacing and styling scales instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="border border-panel-border bg-panel/40 backdrop-blur-sm rounded-2xl p-lg flex flex-col items-center text-center gap-sm shadow-sm hover:shadow-md hover:border-cyan-active/45 transition-all duration-250">
            <div className="w-10 h-10 rounded-xl bg-deep-teal/10 text-deep-teal dark:text-sky-blue flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-foreground">Curated Unsplash Dropzone</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Browse categories of royalty-free stock imagery directly in the elements panel, and upload visual assets straight to Cloudflare R2 object storage.
            </p>
          </div>

          {/* Card 3 */}
          <div className="border border-panel-border bg-panel/40 backdrop-blur-sm rounded-2xl p-lg flex flex-col items-center text-center gap-sm shadow-sm hover:shadow-md hover:border-cyan-active/45 transition-all duration-250">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-foreground">Global CDN Edge Caching</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Serving compiles through caches.default worker interfaces maps zero execution limits and latency, providing speeds of less than 20ms worldwide.
            </p>
          </div>

        </div>
      </main>

      {/* Onboarding Wizard Modal */}
      <OnboardingWizard isOpen={onboardingOpen} onClose={handleCloseOnboarding} />
    </div>
  );
}
