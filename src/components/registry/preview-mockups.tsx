import React from "react";

export const customStyles = `
  @keyframes popover-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes popover-bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes popover-zoom-slow {
    0%, 100% { transform: scale(1.05); }
    50% { transform: scale(1.12); }
  }
  @keyframes popover-pulse-glow {
    0%, 100% { box-shadow: 0 0 0px rgba(2, 169, 247, 0.2); }
    50% { box-shadow: 0 0 12px rgba(2, 169, 247, 0.6); }
  }
  @keyframes popover-check-verify {
    0%, 100% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 1; }
  }
  @keyframes popover-spinner {
    to { transform: rotate(360deg); }
  }
  .popover-shimmer-bg {
    background: linear-gradient(90deg, var(--panel-border) 25%, var(--accent-soft) 50%, var(--panel-border) 75%);
    background-size: 200% 100%;
    animation: popover-shimmer 1.5s infinite linear;
  }
`;

export function getElementPreviewMockup(id: string): React.ReactNode {
  switch (id) {
    case "section":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex flex-col gap-xs overflow-hidden relative">
          <div className="border border-dashed border-cyan-active/40 bg-cyan-active/5 rounded p-xs flex flex-col gap-[3px] relative animate-pulse">
            <span className="text-[6px] text-cyan-active/60 font-semibold absolute top-[2px] right-1">Section Container</span>
            <div className="w-8 h-[2px] bg-cyan-active/20 rounded" />
            <div className="w-full h-4 bg-panel rounded-sm border border-panel-border/30" />
          </div>
          <div className="border border-dashed border-cyan-active/20 bg-accent-soft/10 rounded p-xs flex flex-col gap-[3px]">
            <div className="w-12 h-[2px] bg-text-muted/20 rounded" />
            <div className="w-full h-5 bg-panel rounded-sm border border-panel-border/30" />
          </div>
        </div>
      );
    case "grid-2":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex items-center justify-center gap-xs overflow-hidden">
          <div className="w-1/2 h-16 bg-panel border border-panel-border/50 rounded p-xs flex flex-col gap-xs justify-center items-center shadow-sm">
            <div className="w-6 h-6 rounded-full bg-cyan-active/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-cyan-active" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="w-10 h-[3px] bg-text-muted/30 rounded" />
          </div>
          <div className="w-1/2 h-16 bg-panel border border-panel-border/50 rounded p-xs flex flex-col gap-xs justify-center items-center shadow-sm">
            <div className="w-12 h-[4px] bg-foreground/20 rounded" />
            <div className="w-10 h-[3px] bg-text-muted/30 rounded" />
            <div className="w-8 h-[3px] bg-text-muted/20 rounded" />
          </div>
        </div>
      );
    case "container":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex items-center justify-between relative overflow-hidden">
          <div className="w-6 h-full bg-amber-500/10 border-r border-dashed border-amber-500/25 flex items-center justify-center">
            <span className="text-[6px] text-amber-500/40 font-bold rotate-90 scale-90">margin</span>
          </div>
          <div className="flex-1 h-full mx-xs bg-panel border border-cyan-active/30 rounded p-xs flex flex-col justify-center gap-xs shadow-inner">
            <div className="w-16 h-2 bg-foreground/15 rounded" />
            <div className="w-full h-1 bg-text-muted/10 rounded" />
            <div className="w-3/4 h-1 bg-text-muted/10 rounded" />
          </div>
          <div className="w-6 h-full bg-amber-500/10 border-l border-dashed border-amber-500/25 flex items-center justify-center">
            <span className="text-[6px] text-amber-500/40 font-bold rotate-90 scale-90">margin</span>
          </div>
        </div>
      );
    case "headline":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex flex-col justify-center gap-xs overflow-hidden">
          <div className="border-b border-panel-border/20 pb-[2px]">
            <span className="text-[7px] font-bold text-cyan-active uppercase tracking-widest">H1 Heading Spec</span>
          </div>
          <div className="h-6 flex items-center">
            <h4 className="text-xs font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-active to-deep-teal dark:to-white">
              Crafting Perfect Portfolios
            </h4>
          </div>
          <div className="w-full h-[2px] bg-gradient-to-r from-cyan-active to-transparent rounded" />
        </div>
      );
    case "paragraph":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex flex-col justify-center gap-xs overflow-hidden">
          <div className="flex flex-col gap-xs p-xs">
            <div className="w-full h-2 rounded popover-shimmer-bg" />
            <div className="w-11/12 h-2 rounded popover-shimmer-bg" />
            <div className="w-4/5 h-2 rounded popover-shimmer-bg" />
            <div className="w-1/2 h-2 rounded popover-shimmer-bg" />
          </div>
        </div>
      );
    case "button":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex items-center justify-center overflow-hidden">
          <div className="px-sm py-xs bg-cyan-active text-white rounded font-bold text-[9px] flex items-center gap-[3px] transition-all duration-300 transform [animation:popover-bounce-slow_2s_infinite_ease-in-out,popover-pulse-glow_2s_infinite_ease-in-out]">
            <span>Get Started</span>
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      );
    case "image":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 overflow-hidden relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 via-teal-900 to-cyan-500 scale-105 [animation:popover-zoom-slow_5s_infinite_ease-in-out]" />
          <div className="absolute inset-0 bg-black/25" />
          <div className="z-10 text-white flex flex-col items-center gap-[2px]">
            <svg className="w-5 h-5 text-sky-blue/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[7px] font-bold tracking-widest uppercase text-sky-blue/90">Asset Frame</span>
          </div>
        </div>
      );
    case "video":
      return (
        <div className="w-full h-24 bg-slate-950 rounded-md border border-panel-border/50 overflow-hidden relative flex items-center justify-center">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-800">
            <div className="h-full w-1/3 bg-cyan-active rounded-r" />
          </div>
          <div className="w-7 h-7 rounded-full bg-cyan-active/90 flex items-center justify-center shadow-lg transform [animation:popover-bounce-slow_1.8s_infinite_ease-in-out]">
            <svg className="w-3.5 h-3.5 text-white fill-current ml-[2px]" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="absolute top-1 right-1 text-[6px] bg-black/75 px-1 py-[2px] rounded text-slate-400 font-semibold">
            02:40
          </div>
        </div>
      );
    case "contact-form":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex flex-col justify-center gap-xs overflow-hidden">
          <div className="flex flex-col gap-[2px]">
            <label className="text-[6px] font-bold text-text-muted">Email</label>
            <div className="w-full h-5 rounded border border-panel-border/30 bg-panel px-xs flex items-center">
              <div className="w-16 h-1 bg-foreground/20 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-full h-5.5 bg-cyan-active text-white rounded text-[8px] font-bold flex items-center justify-center shadow-sm">
            Send Message
          </div>
        </div>
      );
    case "turnstile":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 flex items-center justify-center overflow-hidden">
          <div className="flex items-center gap-xs px-sm py-xs bg-panel border border-panel-border/50 rounded shadow-sm w-36 relative">
            <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
              <div className="absolute w-3.5 h-3.5 border border-slate-300 border-t-cyan-active rounded-full [animation:popover-spinner_1s_infinite_linear]" />
              <div className="absolute w-2.5 h-2.5 text-emerald-500 [animation:popover-check-verify_1.5s_infinite_ease-in-out]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-[1px]">
              <span className="text-[7px] font-bold text-foreground leading-none">Turnstile Verified</span>
              <span className="text-[5px] text-text-muted leading-none">Cloudflare Protection</span>
            </div>
          </div>
        </div>
      );
    case "blockquote":
      return (
        <div className="w-full h-24 bg-background rounded-md border border-panel-border/50 p-xs flex flex-col justify-center overflow-hidden relative">
          <div className="border-l-[3px] border-cyan-active bg-cyan-active/5 rounded-r p-sm flex flex-col gap-[4px] relative">
            <span className="absolute text-3xl font-serif text-cyan-active opacity-20 select-none pointer-events-none left-1 top-0">“</span>
            <div className="w-full h-1.5 rounded bg-foreground/15 z-10" />
            <div className="w-11/12 h-1.5 rounded bg-foreground/15 z-10" />
            <div className="w-16 h-1 bg-cyan-active/50 rounded mt-[2px] z-10" />
          </div>
        </div>
      );
    default:
      return null;
  }
}
