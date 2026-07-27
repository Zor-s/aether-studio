"use client";

import React, { useState } from "react";

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: "Welcome to Aether Studio",
    subtitle: "Edge-Optimized Zero-Cost Portfolio Builder",
    description: "Aether Studio compiles your layouts to semantic, high-performance static HTML payloads, running on Cloudflare Workers and cached globally in edge memory.",
    icon: (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-deep-teal to-cyan-active flex items-center justify-center shadow-lg shadow-cyan-active/20 animate-pulse">
        <span className="text-white font-extrabold text-3xl select-none">Æ</span>
      </div>
    ),
  },
  {
    title: "Dynamic Visual Registry",
    subtitle: "Drag, Drop & Symmetrically Scale",
    description: "Insert responsive containers, contact forms, or stock media blocks. Symmetrically resize device viewports by dragging mobile/tablet outer handles to test styles in real time.",
    icon: (
      <svg className="w-14 h-14 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
      </svg>
    ),
  },
  {
    title: "Brand-Restricted Styling",
    subtitle: "Aesthetics Guardrails Built-in",
    description: "Format typography settings and borders instantly. Design colors are restricted to verified brand palette tokens, keeping your portfolio strictly premium and clean.",
    icon: (
      <svg className="w-14 h-14 text-deep-teal dark:text-sky-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    title: "Direct-to-R2 Edge Publish",
    subtitle: "Zero Serverless Execution Fees",
    description: "Publish compiles your canvas into raw HTML, uploads direct to Cloudflare R2, invalidates global edge caches, and binds subdomain hostnames. Ready in seconds.",
    icon: (
      <svg className="w-14 h-14 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function OnboardingWizard({ isOpen, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset to the first step each time the modal is opened during render
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setCurrentStep(0);
    }
  }

  if (!isOpen) return null;

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-md z-50 flex items-center justify-center p-md animate-fadeIn select-none">
      <div className="bg-panel border border-panel-border rounded-3xl w-full max-w-[512px] shadow-2xl p-md sm:p-xl flex flex-col gap-md sm:gap-lg relative overflow-y-auto max-h-[calc(100vh-2rem)] custom-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-md right-md text-text-muted hover:text-foreground hover:bg-background rounded-full p-xs transition-colors cursor-pointer"
          aria-label="Skip onboarding"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Step Indicator Dot Chain */}
        <div className="flex justify-center gap-xs mt-sm">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-[5px] rounded-full transition-all duration-300 ${
                idx === currentStep ? "w-6 bg-cyan-active" : "w-2.5 bg-panel-border"
              }`}
            />
          ))}
        </div>

        {/* Step Visual Content */}
        <div className="flex flex-col items-center text-center gap-md my-md">
          <div className="h-20 flex items-center justify-center">{step.icon}</div>
          <div className="flex flex-col gap-[3px]">
            <h3 className="text-xl font-extrabold text-foreground tracking-tight">{step.title}</h3>
            <p className="text-xs font-bold text-cyan-active tracking-wide uppercase">{step.subtitle}</p>
          </div>
          <p className="text-sm text-text-muted max-w-[384px] leading-relaxed mt-xs">
            {step.description}
          </p>
        </div>

        {/* Action Controls Footer */}
        <div className="flex items-center justify-between border-t border-panel-border pt-md mt-sm">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-text-muted hover:text-foreground px-sm py-xs rounded hover:bg-background transition-all cursor-pointer"
          >
            Skip Guide
          </button>
          
          <div className="flex items-center gap-sm">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="h-10 px-md rounded-lg text-xs font-semibold border border-panel-border text-text-muted hover:bg-background hover:text-foreground transition-all cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="h-10 px-lg rounded-lg text-xs font-bold text-white bg-cyan-active hover:bg-cyan-active/95 transition-all shadow-md shadow-cyan-active/15 cursor-pointer"
            >
              {currentStep === STEPS.length - 1 ? "Get Started" : "Continue"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
